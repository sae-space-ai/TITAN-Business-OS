import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useStore } from '../store';
import { BudgetLine } from '../types';
import { calculateLineSubtotal, calculateBudgetTotals, formatCurrency, SPANISH_TAX_RATES } from '../lib/calculations';
import { generateBudgetPDF } from '../lib/pdf-generator';
import { generateBudgetXLSX } from '../lib/xlsx-generator';
import { v4 as uuidv4 } from 'uuid';
import { FileText, Plus, Trash2, Download, CheckCircle, AlertCircle, Save } from 'lucide-react';

export default function BudgetEditor() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const session = useStore(s => s.currentSession);
  const budgets = useStore(s => s.budgets);
  const requests = useStore(s => s.requests);
  const clients = useStore(s => s.clients);
  const services = useStore(s => s.services);
  const company = useStore(s => s.getCurrentCompany());
  const addBudget = useStore(s => s.addBudget);
  const updateBudget = useStore(s => s.updateBudget);
  const addApprovalHistory = useStore(s => s.addApprovalHistory);
  const addGeneratedDocument = useStore(s => s.addGeneratedDocument);
  const getDocumentsByBudget = useStore(s => s.getDocumentsByBudget);
  const getCurrentUser = useStore(s => s.getCurrentUser);
  const hasPermission = useStore(s => s.hasPermission);

  const existingBudget = id ? budgets.find(b => b.id === id) : null;
  const requestId = searchParams.get('requestId');
  const request = requestId ? requests.find(r => r.id === requestId) : null;
  const user = getCurrentUser();
  const companyServices = session ? services.filter(s => s.companyId === session.companyId) : [];
  const companyClients = session ? clients.filter(c => c.companyId === session.companyId) : [];
  const documents = id ? getDocumentsByBudget(id) : [];

  const [clientId, setClientId] = useState(existingBudget?.clientId || request?.clientId || '');
  const [lines, setLines] = useState<BudgetLine[]>(existingBudget?.lines || []);
  const [taxRate, setTaxRate] = useState(existingBudget?.taxRate || 21);
  const [conditions, setConditions] = useState(existingBudget?.conditions || '');
  const [notes, setNotes] = useState(existingBudget?.notes || '');
  const [validityDays, setValidityDays] = useState(existingBudget?.validityDays || 30);
  const [taxValidationPending, setTaxValidationPending] = useState(false);

  const totals = calculateBudgetTotals(lines, 0, taxRate);

  const addLine = () => {
    setLines([...lines, {
      id: uuidv4(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      discount: 0,
      subtotal: 0,
    }]);
  };

  const updateLine = (index: number, field: keyof BudgetLine, value: any) => {
    const newLines = [...lines];
    (newLines[index] as any)[field] = value;
    
    // Recalcular subtotal
    if (['quantity', 'unitPrice', 'discount'].includes(field)) {
      newLines[index].subtotal = calculateLineSubtotal(
        newLines[index].quantity,
        newLines[index].unitPrice,
        newLines[index].discount
      );
    }
    
    setLines(newLines);
  };

  const removeLine = (index: number) => {
    setLines(lines.filter((_, i) => i !== index));
  };

  const selectService = (index: number, serviceId: string) => {
    const service = companyServices.find(s => s.id === serviceId);
    if (service) {
      const newLines = [...lines];
      newLines[index].description = service.name;
      newLines[index].unitPrice = service.defaultUnitPrice;
      newLines[index].subtotal = calculateLineSubtotal(1, service.defaultUnitPrice, 0);
      newLines[index].tariffId = service.id;
      setLines(newLines);
    }
  };

  const handleSave = (status: 'draft' | 'pending_approval') => {
    if (!session || !user || !company) return;
    if (!clientId) { alert('Selecciona un cliente'); return; }
    if (lines.length === 0) { alert('Añade al menos un concepto'); return; }

    const number = existingBudget?.number || `PRE-${new Date().getFullYear()}-${String(budgets.filter(b => b.companyId === session.companyId).length + 1).padStart(4, '0')}`;
    const version = existingBudget ? existingBudget.version + 1 : 1;

    const budgetData = {
      companyId: session.companyId,
      requestId: request?.id || undefined,
      clientId,
      number,
      version,
      status,
      lines,
      subtotal: totals.linesSubtotal,
      discount: 0,
      taxBase: totals.taxBase,
      taxRate,
      taxAmount: totals.taxAmount,
      total: totals.total,
      currency: 'EUR',
      conditions,
      validityDays,
      notes,
    };

    if (existingBudget) {
      updateBudget(existingBudget.id, budgetData);
      addApprovalHistory({
        companyId: session.companyId,
        budgetId: existingBudget.id,
        userId: user.id,
        userName: user.name,
        action: 'modified',
        fromStatus: existingBudget.status,
        toStatus: status,
        version,
        notes: 'Modificación de presupuesto',
      });
    } else {
      const newBudget = { ...budgetData, id: uuidv4(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      addBudget(budgetData);
      addApprovalHistory({
        companyId: session.companyId,
        budgetId: (budgets.length).toString(),
        userId: user.id,
        userName: user.name,
        action: 'created',
        toStatus: status,
        version: 1,
      });
    }

    navigate('/presupuestos');
  };

  const handleApprove = () => {
    if (!existingBudget || !user || !session) return;
    if (!hasPermission('budgets.approve')) {
      alert('No tienes permisos para aprobar presupuestos');
      return;
    }

    updateBudget(existingBudget.id, {
      status: 'approved',
      approvedBy: user.id,
      approvedAt: new Date().toISOString(),
    });

    addApprovalHistory({
      companyId: session.companyId,
      budgetId: existingBudget.id,
      userId: user.id,
      userName: user.name,
      action: 'approved',
      fromStatus: existingBudget.status,
      toStatus: 'approved',
      version: existingBudget.version,
    });
  };

  const handleGeneratePDF = () => {
    if (!existingBudget || !company) return;
    const client = clients.find(c => c.id === existingBudget.clientId);
    if (!client) return;

    const result = generateBudgetPDF(existingBudget, company, client);
    
    addGeneratedDocument({
      companyId: company.id,
      budgetId: existingBudget.id,
      type: 'budget_pdf',
      name: `Presupuesto_${existingBudget.number}_v${existingBudget.version}.pdf`,
      dataUrl: result.dataUrl,
      fileSize: result.fileSize,
      version: existingBudget.version,
      checksum: result.checksum,
      createdBy: user?.id || '',
    });

    // Download
    const link = document.createElement('a');
    link.href = result.dataUrl;
    link.download = `Presupuesto_${existingBudget.number}_v${existingBudget.version}.pdf`;
    link.click();
  };

  const handleGenerateXLSX = () => {
    if (!existingBudget || !company) return;
    const client = clients.find(c => c.id === existingBudget.clientId);
    if (!client) return;

    const result = generateBudgetXLSX(existingBudget, company, client);
    
    addGeneratedDocument({
      companyId: company.id,
      budgetId: existingBudget.id,
      type: 'budget_xlsx',
      name: `Presupuesto_${existingBudget.number}_v${existingBudget.version}.xlsx`,
      dataUrl: result.dataUrl,
      fileSize: result.fileSize,
      version: existingBudget.version,
      checksum: result.checksum,
      createdBy: user?.id || '',
    });

    const link = document.createElement('a');
    link.href = result.dataUrl;
    link.download = `Presupuesto_${existingBudget.number}_v${existingBudget.version}.xlsx`;
    link.click();
  };

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto">
      <button onClick={() => navigate('/presupuestos')} className="text-sm text-gray-500 hover:text-[#288FC5] mb-4">
        ← Volver a presupuestos
      </button>

      <h1 className="text-2xl font-bold text-[#334155] mb-6">
        {existingBudget ? `Editar ${existingBudget.number}` : 'Nuevo Presupuesto'}
      </h1>

      {/* Tax validation warning */}
      {taxValidationPending && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 text-sm text-amber-700">
          <AlertCircle size={14} className="inline mr-1" />
          Validación normativa pendiente: el tipo de IVA seleccionado no ha sido verificado para este servicio específico.
        </div>
      )}

      {/* Client selection */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 mb-4">
        <label className="block text-sm font-medium text-[#334155] mb-2">Cliente *</label>
        <select
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
        >
          <option value="">Seleccionar cliente...</option>
          {companyClients.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Lines */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-[#334155]">Conceptos</h3>
          <button onClick={addLine} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#288FC5] text-white text-sm hover:bg-[#1a6fa0]">
            <Plus size={14} /> Añadir línea
          </button>
        </div>

        {lines.length === 0 ? (
          <p className="text-center text-sm text-gray-400 py-4">Sin conceptos. Añade una línea para comenzar.</p>
        ) : (
          <div className="space-y-3">
            {lines.map((line, i) => (
              <div key={line.id} className="grid grid-cols-12 gap-2 items-start p-3 bg-gray-50 rounded-lg">
                <div className="col-span-12 sm:col-span-5">
                  <input
                    type="text"
                    value={line.description}
                    onChange={(e) => updateLine(i, 'description', e.target.value)}
                    placeholder="Descripción del servicio"
                    className="w-full px-2 py-1.5 rounded border border-gray-200 text-sm"
                  />
                  {companyServices.length > 0 && (
                    <select
                      onChange={(e) => selectService(i, e.target.value)}
                      className="w-full mt-1 px-2 py-1 rounded border border-gray-200 text-xs text-gray-500"
                      value=""
                    >
                      <option value="">O seleccionar del catálogo...</option>
                      {companyServices.map(s => (
                        <option key={s.id} value={s.id}>{s.name} — {formatCurrency(s.defaultUnitPrice)}/{s.unit}</option>
                      ))}
                    </select>
                  )}
                </div>
                <div className="col-span-3 sm:col-span-2">
                  <label className="text-[10px] text-gray-500">Cantidad</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={line.quantity}
                    onChange={(e) => updateLine(i, 'quantity', parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-1.5 rounded border border-gray-200 text-sm"
                  />
                </div>
                <div className="col-span-3 sm:col-span-2">
                  <label className="text-[10px] text-gray-500">Precio (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={line.unitPrice}
                    onChange={(e) => updateLine(i, 'unitPrice', parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-1.5 rounded border border-gray-200 text-sm"
                  />
                </div>
                <div className="col-span-4 sm:col-span-2">
                  <label className="text-[10px] text-gray-500">Subtotal</label>
                  <p className="px-2 py-1.5 text-sm font-medium text-[#334155]">{formatCurrency(line.subtotal)}</p>
                </div>
                <div className="col-span-2 sm:col-span-1 flex items-end">
                  <button onClick={() => removeLine(i)} className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-500">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tax and totals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <label className="block text-sm font-medium text-[#334155] mb-2">Tipo de IVA</label>
          <select
            value={taxRate}
            onChange={(e) => { setTaxRate(parseFloat(e.target.value)); setTaxValidationPending(true); }}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
          >
            {Object.entries(SPANISH_TAX_RATES).map(([key, rate]) => (
              <option key={key} value={rate.rate}>{rate.label}</option>
            ))}
          </select>
          <p className="text-[10px] text-gray-400 mt-1">
            Fuente: Ley 37/1992 del IVA
          </p>

          <label className="block text-sm font-medium text-[#334155] mb-2 mt-4">Condiciones</label>
          <textarea
            value={conditions}
            onChange={(e) => setConditions(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm resize-none"
            placeholder="Condiciones comerciales..."
          />

          <label className="block text-sm font-medium text-[#334155] mb-2 mt-4">Validez (días)</label>
          <input
            type="number"
            value={validityDays}
            onChange={(e) => setValidityDays(parseInt(e.target.value) || 30)}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
          />
        </div>

        <div className="bg-[#EAF7FE] rounded-xl border border-[#288FC5]/20 p-5">
          <h3 className="font-semibold text-[#334155] mb-3">Resumen</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Base imponible</span>
              <span className="text-[#334155]">{formatCurrency(totals.taxBase)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">IVA ({taxRate}%)</span>
              <span className="text-[#334155]">{formatCurrency(totals.taxAmount)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-[#288FC5]/20">
              <span className="font-semibold text-[#334155]">TOTAL</span>
              <span className="font-bold text-[#288FC5] text-lg">{formatCurrency(totals.total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => handleSave('draft')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50"
        >
          <Save size={14} /> Guardar borrador
        </button>
        <button
          onClick={() => handleSave('pending_approval')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#288FC5] text-white text-sm font-medium hover:bg-[#1a6fa0]"
        >
          Enviar a aprobación
        </button>
        {existingBudget && existingBudget.status === 'pending_approval' && hasPermission('budgets.approve') && (
          <button
            onClick={handleApprove}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700"
          >
            <CheckCircle size={14} /> Aprobar
          </button>
        )}
        {existingBudget && existingBudget.status === 'approved' && (
          <>
            <button
              onClick={handleGeneratePDF}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-500 text-white text-sm font-medium hover:bg-violet-600"
            >
              <Download size={14} /> Generar PDF
            </button>
            <button
              onClick={handleGenerateXLSX}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600"
            >
              <Download size={14} /> Generar XLSX
            </button>
          </>
        )}
      </div>

      {/* Documents list */}
      {documents.length > 0 && (
        <div className="mt-6 bg-white rounded-xl border border-gray-100 p-5">
          <h3 className="font-semibold text-[#334155] mb-3">Documentos generados</h3>
          <div className="space-y-2">
            {documents.map(doc => (
              <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText size={16} className="text-gray-400" />
                  <span className="text-sm text-[#334155]">{doc.name}</span>
                  <span className="text-xs text-gray-400">{doc.fileSize} KB</span>
                </div>
                <a
                  href={doc.dataUrl}
                  download={doc.name}
                  className="text-sm text-[#288FC5] hover:underline"
                >
                  Descargar
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
