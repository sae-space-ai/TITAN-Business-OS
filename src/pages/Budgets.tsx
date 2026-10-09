import { useState } from 'react';
import { useStore } from '../store';
import { FileCheck, Eye, Download, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Budget, BudgetStatus } from '../types';

const statusLabels: Record<BudgetStatus, string> = {
  draft: 'Borrador',
  pending_approval: 'Pendiente aprobación',
  approved: 'Aprobado',
  rejected: 'Rechazado',
  sent: 'Enviado',
  expired: 'Caducado',
};

const statusColors: Record<BudgetStatus, string> = {
  draft: 'bg-gray-50 text-gray-700 border-gray-200',
  pending_approval: 'bg-amber-50 text-amber-700 border-amber-200',
  approved: 'bg-green-50 text-green-700 border-green-200',
  rejected: 'bg-red-50 text-red-700 border-red-200',
  sent: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  expired: 'bg-gray-50 text-gray-500 border-gray-200',
};

export default function Budgets() {
  const session = useStore(s => s.currentSession);
  const getBudgetsByCompany = useStore(s => s.getBudgetsByCompany);
  const getClientsByCompany = useStore(s => s.getClientsByCompany);
  const updateBudget = useStore(s => s.updateBudget);
  const hasPermission = useStore(s => s.hasPermission);
  const getCurrentUser = useStore(s => s.getCurrentUser);

  const budgets = session ? getBudgetsByCompany(session.companyId) : [];
  const clients = session ? getClientsByCompany(session.companyId) : [];
  const user = getCurrentUser();

  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);

  const handleApprove = (budget: Budget) => {
    if (!user) return;
    updateBudget(budget.id, {
      status: 'approved',
      approvedBy: user.id,
      approvedAt: new Date().toISOString(),
    });
    setSelectedBudget(null);
  };

  const handleReject = (budget: Budget) => {
    updateBudget(budget.id, {
      status: 'rejected',
      rejectionReason: 'Rechazado por el usuario',
    });
    setSelectedBudget(null);
  };

  const sortedBudgets = [...budgets].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#334155] flex items-center gap-2">
          <FileCheck size={24} className="text-[#D778A4]" />
          Presupuestos
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {budgets.length} {budgets.length === 1 ? 'presupuesto generado' : 'presupuestos generados'}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 p-3">
          <p className="text-xs text-gray-500">Pendientes</p>
          <p className="text-xl font-bold text-amber-600">
            {budgets.filter(b => b.status === 'pending_approval').length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-3">
          <p className="text-xs text-gray-500">Aprobados</p>
          <p className="text-xl font-bold text-green-600">
            {budgets.filter(b => b.status === 'approved').length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-3">
          <p className="text-xs text-gray-500">Enviados</p>
          <p className="text-xl font-bold text-cyan-600">
            {budgets.filter(b => b.status === 'sent').length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-3">
          <p className="text-xs text-gray-500">Total importe</p>
          <p className="text-xl font-bold text-[#334155]">
            {budgets.reduce((sum, b) => sum + b.total, 0).toFixed(0)}€
          </p>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedBudget && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-[#334155]">
                    Presupuesto {selectedBudget.number}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Versión {selectedBudget.version} — {new Date(selectedBudget.createdAt).toLocaleDateString('es-ES')}
                  </p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full border font-medium ${statusColors[selectedBudget.status]}`}>
                  {statusLabels[selectedBudget.status]}
                </span>
              </div>

              {/* Client */}
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <p className="text-xs text-gray-500 mb-1">Cliente</p>
                <p className="text-sm font-medium text-[#334155]">
                  {clients.find(c => c.id === selectedBudget.clientId)?.name || 'Sin asignar'}
                </p>
              </div>

              {/* Lines */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-[#334155] mb-2">Conceptos</h4>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left px-3 py-2 text-xs font-medium text-gray-500">Descripción</th>
                        <th className="text-right px-3 py-2 text-xs font-medium text-gray-500">Cant.</th>
                        <th className="text-right px-3 py-2 text-xs font-medium text-gray-500">Precio</th>
                        <th className="text-right px-3 py-2 text-xs font-medium text-gray-500">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedBudget.lines.map((line) => (
                        <tr key={line.id} className="border-t border-gray-100">
                          <td className="px-3 py-2 text-[#334155]">{line.description}</td>
                          <td className="px-3 py-2 text-right text-gray-600">{line.quantity}</td>
                          <td className="px-3 py-2 text-right text-gray-600">{line.unitPrice.toFixed(2)}€</td>
                          <td className="px-3 py-2 text-right font-medium text-[#334155]">{line.subtotal.toFixed(2)}€</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Totals */}
              <div className="bg-[#EAF7FE] rounded-lg p-4 mb-4">
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Base imponible</span>
                    <span className="text-[#334155]">{selectedBudget.taxBase.toFixed(2)}€</span>
                  </div>
                  {selectedBudget.discount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Descuento</span>
                      <span className="text-green-600">-{selectedBudget.discount.toFixed(2)}€</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">IVA ({selectedBudget.taxRate}%)</span>
                    <span className="text-[#334155]">{selectedBudget.taxAmount.toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-[#288FC5]/20">
                    <span className="font-semibold text-[#334155]">TOTAL</span>
                    <span className="font-bold text-[#288FC5] text-lg">{selectedBudget.total.toFixed(2)}€</span>
                  </div>
                </div>
              </div>

              {/* Conditions */}
              {selectedBudget.conditions && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-[#334155] mb-1">Condiciones</h4>
                  <p className="text-sm text-gray-600">{selectedBudget.conditions}</p>
                </div>
              )}

              {/* Approval info */}
              {selectedBudget.approvedAt && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                  <p className="text-xs text-green-700">
                    <CheckCircle size={12} className="inline mr-1" />
                    Aprobado el {new Date(selectedBudget.approvedAt).toLocaleString('es-ES')}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button
                  onClick={() => setSelectedBudget(null)}
                  className="flex-1 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50"
                >
                  Cerrar
                </button>
                {selectedBudget.status === 'pending_approval' && hasPermission('budgets.approve') && (
                  <>
                    <button
                      onClick={() => handleReject(selectedBudget)}
                      className="px-4 py-2 rounded-lg border border-red-200 text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-1"
                    >
                      <XCircle size={14} />
                      Rechazar
                    </button>
                    <button
                      onClick={() => handleApprove(selectedBudget)}
                      className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 flex items-center gap-1"
                    >
                      <CheckCircle size={14} />
                      Aprobar
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Budgets List */}
      {sortedBudgets.length === 0 ? (
        <div className="text-center py-12">
          <FileCheck size={48} className="mx-auto text-gray-200 mb-4" />
          <p className="text-gray-500">Aún no hay presupuestos generados</p>
          <p className="text-xs text-gray-400 mt-2">
            Los presupuestos se generan desde las solicitudes aprobadas
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedBudgets.map((budget) => {
            const client = clients.find(c => c.id === budget.clientId);
            return (
              <div
                key={budget.id}
                className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-sm transition-shadow cursor-pointer"
                onClick={() => setSelectedBudget(budget)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-[#334155]">{budget.number}</span>
                      <span className="text-xs text-gray-400">v{budget.version}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${statusColors[budget.status]}`}>
                        {statusLabels[budget.status]}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {client?.name || 'Sin cliente'} — {new Date(budget.createdAt).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-[#334155]">{budget.total.toFixed(2)}€</p>
                    <p className="text-xs text-gray-400">{budget.lines.length} conceptos</p>
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
