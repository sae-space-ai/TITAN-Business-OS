import { useState } from 'react';
import { useStore } from '../store';
import { Receipt, Plus, AlertTriangle, FileText, Download, Eye, Edit2 } from 'lucide-react';
import { generateBudgetPDF } from '../lib/pdf-generator';
import { calculateLineSubtotal, calculateBudgetTotals, formatCurrency } from '../lib/calculations';
import { v4 as uuidv4 } from 'uuid';

export default function Billing() {
  const session = useStore(s => s.currentSession);
  const invoices = useStore(s => s.invoices);
  const clients = useStore(s => s.clients);
  const budgets = useStore(s => s.budgets);
  const addInvoice = useStore(s => s.addInvoice);
  const updateInvoice = useStore(s => s.updateInvoice);
  const company = useStore(s => s.getCurrentCompany);

  const [showCreate, setShowCreate] = useState(false);
  const [showEditor, setShowEditor] = useState<string | null>(null);
  const [clientId, setClientId] = useState('');
  const [budgetId, setBudgetId] = useState('');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [series, setSeries] = useState('A');
  const [notes, setNotes] = useState('');
  const [lines, setLines] = useState<Array<{ id: string; description: string; quantity: number; unitPrice: number; discount: number; subtotal: number }>>([]);

  const companyInvoices = session ? invoices.filter(i => i.companyId === session.companyId) : [];
  const companyClients = session ? clients.filter(c => c.companyId === session.companyId) : [];
  const companyBudgets = session ? budgets.filter(b => b.companyId === session.companyId && b.status === 'approved') : [];

  const handleCreateFromBudget = () => {
    if (!budgetId) return;
    const budget = budgets.find(b => b.id === budgetId);
    if (!budget) return;

    setClientId(budget.clientId);
    setLines(budget.lines.map(l => ({ ...l, id: uuidv4() })));
  };

  const addLine = () => {
    setLines([...lines, { id: uuidv4(), description: '', quantity: 1, unitPrice: 0, discount: 0, subtotal: 0 }]);
  };

  const updateLine = (index: number, field: string, value: any) => {
    const newLines = [...lines];
    (newLines[index] as any)[field] = value;
    if (['quantity', 'unitPrice', 'discount'].includes(field)) {
      newLines[index].subtotal = calculateLineSubtotal(newLines[index].quantity, newLines[index].unitPrice, newLines[index].discount);
    }
    setLines(newLines);
  };

  const removeLine = (index: number) => {
    setLines(lines.filter((_, i) => i !== index));
  };

  const handleCreate = () => {
    if (!session || !clientId || !issueDate || !dueDate) return;

    const totals = calculateBudgetTotals(lines, 0, 21);
    const number = `${series}-${String(companyInvoices.filter(i => i.series === series).length + 1).padStart(4, '0')}`;

    addInvoice({
      companyId: session.companyId,
      number,
      series,
      clientId,
      budgetId: budgetId || undefined,
      issueDate,
      dueDate,
      lines,
      subtotal: totals.linesSubtotal,
      taxRate: 21,
      taxAmount: totals.taxAmount,
      total: totals.total,
      status: 'draft',
      notes,
      createdBy: session.userId,
    });

    resetForm();
  };

  const resetForm = () => {
    setClientId('');
    setBudgetId('');
    setIssueDate(new Date().toISOString().split('T')[0]);
    setDueDate('');
    setSeries('A');
    setNotes('');
    setLines([]);
    setShowCreate(false);
    setShowEditor(null);
  };

  const handleGeneratePDF = (invoice: any) => {
    const client = companyClients.find(c => c.id === invoice.clientId);
    const companyData = company();
    if (!client || !companyData) return;

    const pdfData = {
      ...invoice,
      taxBase: invoice.subtotal,
      conditions: invoice.notes || '',
      validityDays: 30,
    };

    const result = generateBudgetPDF(pdfData as any, companyData, client);
    const link = document.createElement('a');
    link.href = result.dataUrl;
    link.download = `Factura_${invoice.number}.pdf`;
    link.click();
  };

  const statusColors = {
    draft: 'bg-gray-50 text-gray-700 border-gray-200',
    issued: 'bg-blue-50 text-blue-700 border-blue-200',
    sent: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    paid: 'bg-green-50 text-green-700 border-green-200',
    overdue: 'bg-red-50 text-red-700 border-red-200',
    cancelled: 'bg-gray-50 text-gray-500 border-gray-200',
    rectificative: 'bg-amber-50 text-amber-700 border-amber-200',
  };

  const editingInvoice = showEditor ? invoices.find(i => i.id === showEditor) : null;

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#334155] flex items-center gap-2">
            <Receipt size={24} className="text-[#288FC5]" />
            Facturación
          </h1>
          <p className="text-sm text-gray-500 mt-1">{companyInvoices.length} facturas</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#288FC5] text-white text-sm font-medium hover:bg-[#1a6fa0]"
        >
          <Plus size={16} /> Nueva factura
        </button>
      </div>

      {/* Aviso legal */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <AlertTriangle size={20} className="text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-800">Módulo operativo para gestión de facturas</p>
            <p className="text-xs text-amber-700 mt-1">
              Borradores y gestión administrativa completos. La emisión fiscal real requiere integración con proveedor conforme (RD 238/2026, Veri*factu).
            </p>
          </div>
        </div>
      </div>

      {/* Create/Edit Form */}
      {(showCreate || showEditor) && (
        <div className="bg-white rounded-xl border border-gray-100 p-5 mb-6">
          <h3 className="font-semibold text-[#334155] mb-4">
            {showEditor ? `Editar factura ${editingInvoice?.number}` : 'Nueva factura'}
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-[#334155] mb-1">Cliente *</label>
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
              <div>
                <label className="block text-sm font-medium text-[#334155] mb-1">Desde presupuesto</label>
                <select
                  value={budgetId}
                  onChange={(e) => { setBudgetId(e.target.value); }}
                  onBlur={handleCreateFromBudget}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
                >
                  <option value="">Crear manualmente...</option>
                  {companyBudgets.map(b => (
                    <option key={b.id} value={b.id}>{b.number} - {companyClients.find(c => c.id === b.clientId)?.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-[#334155] mb-1">Serie</label>
                <select value={series} onChange={(e) => setSeries(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm">
                  <option value="A">A - General</option>
                  <option value="B">B - Recurrentes</option>
                  <option value="R">R - Rectificativas</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#334155] mb-1">Fecha emisión *</label>
                <input type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#334155] mb-1">Fecha vencimiento *</label>
                <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
              </div>
            </div>

            {/* Lines */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-[#334155]">Líneas de factura</label>
                <button onClick={addLine} className="text-xs px-3 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200">
                  + Añadir línea
                </button>
              </div>
              {lines.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">Sin líneas. Añade productos o servicios.</p>
              ) : (
                <div className="space-y-2">
                  {lines.map((line, i) => (
                    <div key={line.id} className="grid grid-cols-12 gap-2 items-center p-2 bg-gray-50 rounded">
                      <input
                        type="text"
                        value={line.description}
                        onChange={(e) => updateLine(i, 'description', e.target.value)}
                        placeholder="Descripción"
                        className="col-span-5 px-2 py-1 rounded border border-gray-200 text-sm"
                      />
                      <input
                        type="number"
                        value={line.quantity}
                        onChange={(e) => updateLine(i, 'quantity', parseFloat(e.target.value) || 0)}
                        placeholder="Cant."
                        className="col-span-2 px-2 py-1 rounded border border-gray-200 text-sm"
                      />
                      <input
                        type="number"
                        value={line.unitPrice}
                        onChange={(e) => updateLine(i, 'unitPrice', parseFloat(e.target.value) || 0)}
                        placeholder="Precio"
                        className="col-span-2 px-2 py-1 rounded border border-gray-200 text-sm"
                      />
                      <div className="col-span-2 text-sm font-medium text-right">
                        {formatCurrency(line.subtotal)}
                      </div>
                      <button onClick={() => removeLine(i)} className="col-span-1 p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-500">
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Totals */}
            {lines.length > 0 && (
              <div className="bg-[#EAF7FE] rounded-lg p-4">
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Base imponible:</span>
                    <span>{formatCurrency(lines.reduce((sum, l) => sum + l.subtotal, 0))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">IVA (21%):</span>
                    <span>{formatCurrency(lines.reduce((sum, l) => sum + l.subtotal, 0) * 0.21)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-[#288FC5]/20 font-bold">
                    <span>TOTAL:</span>
                    <span className="text-[#288FC5]">{formatCurrency(lines.reduce((sum, l) => sum + l.subtotal, 0) * 1.21)}</span>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-[#334155] mb-1">Notas</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm resize-none" />
            </div>

            <div className="flex gap-3">
              <button onClick={resetForm} className="px-4 py-2 rounded-lg border border-gray-200 text-sm">Cancelar</button>
              <button onClick={handleCreate} className="px-4 py-2 rounded-lg bg-[#288FC5] text-white text-sm font-medium hover:bg-[#1a6fa0]">
                {showEditor ? 'Guardar cambios' : 'Crear factura'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invoices List */}
      {companyInvoices.length === 0 ? (
        <div className="text-center py-12">
          <Receipt size={48} className="mx-auto text-gray-200 mb-4" />
          <p className="text-gray-500">No hay facturas creadas</p>
        </div>
      ) : (
        <div className="space-y-3">
          {companyInvoices.map(invoice => {
            const client = companyClients.find(c => c.id === invoice.clientId);
            return (
              <div key={invoice.id} className="bg-white rounded-xl border border-gray-100 p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText size={16} className="text-gray-400" />
                      <span className="font-semibold text-[#334155]">{invoice.number}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${statusColors[invoice.status]}`}>
                        {invoice.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">Cliente: {client?.name || 'N/A'}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                      <span>Emisión: {new Date(invoice.issueDate).toLocaleDateString('es-ES')}</span>
                      <span>Vencimiento: {new Date(invoice.dueDate).toLocaleDateString('es-ES')}</span>
                      <span className="font-medium text-[#334155]">{formatCurrency(invoice.total)}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {invoice.status === 'draft' && (
                      <button
                        onClick={() => { setShowEditor(invoice.id); setClientId(invoice.clientId); setLines(invoice.lines); setIssueDate(invoice.issueDate); setDueDate(invoice.dueDate); setSeries(invoice.series); setNotes(invoice.notes || ''); }}
                        className="p-2 rounded hover:bg-gray-100 text-gray-400 hover:text-[#288FC5]"
                      >
                        <Edit2 size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => handleGeneratePDF(invoice)}
                      className="p-2 rounded hover:bg-gray-100 text-gray-400 hover:text-[#288FC5]"
                    >
                      <Download size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
