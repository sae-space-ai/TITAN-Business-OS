import { useState } from 'react';
import { useStore } from '../store';
import { Receipt, Plus, AlertTriangle, FileText } from 'lucide-react';

export default function Billing() {
  const session = useStore(s => s.currentSession);
  const invoices = useStore(s => s.invoices);
  const clients = useStore(s => s.clients);
  const addInvoice = useStore(s => s.addInvoice);

  const [showCreate, setShowCreate] = useState(false);
  const [clientId, setClientId] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [series, setSeries] = useState('A');
  const [notes, setNotes] = useState('');

  const companyInvoices = session ? invoices.filter(i => i.companyId === session.companyId) : [];
  const companyClients = session ? clients.filter(c => c.companyId === session.companyId) : [];

  const handleCreate = () => {
    if (!session || !clientId || !issueDate || !dueDate) return;

    // En producción: calcular líneas, impuestos, totales
    // Por ahora: crear factura vacía como borrador
    addInvoice({
      companyId: session.companyId,
      number: `${series}-${String(companyInvoices.length + 1).padStart(4, '0')}`,
      series,
      clientId,
      issueDate,
      dueDate,
      lines: [],
      subtotal: 0,
      taxRate: 21,
      taxAmount: 0,
      total: 0,
      status: 'draft',
      notes,
      createdBy: session.userId,
    });

    setClientId('');
    setIssueDate('');
    setDueDate('');
    setNotes('');
    setShowCreate(false);
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
            <p className="text-sm font-medium text-amber-800">Módulo en validación legal</p>
            <p className="text-xs text-amber-700 mt-1">
              Este módulo permite crear y gestionar borradores de facturas. La emisión fiscal real requiere:
            </p>
            <ul className="text-xs text-amber-700 mt-2 space-y-1 list-disc list-inside">
              <li>Verificación de cumplimiento con RD 238/2026 (Veri*factu)</li>
              <li>Validación de Orden HAC/1028/2026</li>
              <li>Integración con proveedor de facturación conforme</li>
              <li>Pruebas técnicas y jurídicas</li>
            </ul>
            <p className="text-xs text-amber-700 mt-2">
              <strong>Estado actual:</strong> Borradores operativos. Emisión fiscal deshabilitada.
            </p>
          </div>
        </div>
      </div>

      {/* Create Invoice */}
      {showCreate && (
        <div className="bg-white rounded-xl border border-gray-100 p-5 mb-6">
          <h3 className="font-semibold text-[#334155] mb-4">Nueva factura (borrador)</h3>
          <div className="space-y-3">
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
                <label className="block text-sm font-medium text-[#334155] mb-1">Serie</label>
                <select
                  value={series}
                  onChange={(e) => setSeries(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
                >
                  <option value="A">A - General</option>
                  <option value="B">B - Recurrentes</option>
                  <option value="R">R - Rectificativas</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-[#334155] mb-1">Fecha emisión *</label>
                <input
                  type="date"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#334155] mb-1">Fecha vencimiento *</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#334155] mb-1">Notas</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm resize-none"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCreate(false)}
                className="px-4 py-2 rounded-lg border border-gray-200 text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreate}
                className="px-4 py-2 rounded-lg bg-[#288FC5] text-white text-sm font-medium hover:bg-[#1a6fa0]"
              >
                Crear borrador
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
                      <span className="font-medium text-[#334155]">{invoice.total.toFixed(2)}€</span>
                    </div>
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
