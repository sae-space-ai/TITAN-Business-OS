import { useState } from 'react';
import { useStore } from '../store';
import { Settings, Building2, Users, Receipt, Shield, Plus, Edit2 } from 'lucide-react';
import { Tariff } from '../types';

export default function SettingsPage() {
  const session = useStore(s => s.currentSession);
  const getCurrentCompany = useStore(s => s.getCurrentCompany);
  const getCurrentUser = useStore(s => s.getCurrentUser);
  const getTariffsByCompany = useStore(s => s.getTariffsByCompany);
  const addTariff = useStore(s => s.addTariff);
  const updateTariff = useStore(s => s.updateTariff);
  const hasPermission = useStore(s => s.hasPermission);
  const getAuditLogsByCompany = useStore(s => s.getAuditLogsByCompany);

  const company = getCurrentCompany();
  const user = getCurrentUser();
  const tariffs = session ? getTariffsByCompany(session.companyId) : [];
  const auditLogs = session ? getAuditLogsByCompany(session.companyId).slice(0, 20) : [];

  const [activeTab, setActiveTab] = useState<'company' | 'tariffs' | 'audit'>('company');

  // Tariff form
  const [showTariffForm, setShowTariffForm] = useState(false);
  const [tariffName, setTariffName] = useState('');
  const [tariffDesc, setTariffDesc] = useState('');
  const [tariffPrice, setTariffPrice] = useState('');
  const [tariffUnit, setTariffUnit] = useState('hora');
  const [tariffCategory, setTariffCategory] = useState('general');

  const handleAddTariff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;

    addTariff({
      companyId: session.companyId,
      name: tariffName,
      description: tariffDesc,
      unitPrice: parseFloat(tariffPrice) || 0,
      unit: tariffUnit,
      category: tariffCategory,
      isActive: true,
    });

    setTariffName('');
    setTariffDesc('');
    setTariffPrice('');
    setShowTariffForm(false);
  };

  const tabs = [
    { id: 'company' as const, label: 'Empresa', icon: Building2 },
    { id: 'tariffs' as const, label: 'Tarifas', icon: Receipt },
    { id: 'audit' as const, label: 'Auditoría', icon: Shield },
  ];

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#334155] flex items-center gap-2">
          <Settings size={24} className="text-gray-600" />
          Configuración
        </h1>
        <p className="text-sm text-gray-500 mt-1">Gestiona tu empresa, tarifas y auditoría</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mb-6 w-fit">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-[#288FC5] shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Company Tab */}
      {activeTab === 'company' && company && (
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-[#334155] mb-4">Datos de la empresa</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Razón social</label>
              <p className="text-sm text-[#334155] font-medium">{company.name}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Nombre comercial</label>
              <p className="text-sm text-[#334155] font-medium">{company.commercialName}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">NIF/CIF</label>
              <p className="text-sm text-[#334155] font-mono">{company.taxId}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
              <p className="text-sm text-[#334155]">{company.email}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Teléfono</label>
              <p className="text-sm text-[#334155]">{company.phone || '—'}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">País</label>
              <p className="text-sm text-[#334155]">{company.country}</p>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1">Dirección</label>
              <p className="text-sm text-[#334155]">
                {company.address || '—'}{company.postalCode ? `, ${company.postalCode}` : ''} {company.city || ''} {company.province || ''}
              </p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <h4 className="text-sm font-semibold text-[#334155] mb-3">Tu sesión</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-xs text-gray-500">Usuario:</span>
                <p className="text-[#334155] font-medium">{user?.name}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">Email:</span>
                <p className="text-[#334155]">{user?.email}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">Rol:</span>
                <p className="text-[#334155] capitalize font-medium">{user?.role}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tariffs Tab */}
      {activeTab === 'tariffs' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#334155]">Tarifas y conceptos</h3>
            {hasPermission('tariffs.manage') && (
              <button
                onClick={() => setShowTariffForm(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#288FC5] text-white text-sm font-medium hover:bg-[#1a6fa0]"
              >
                <Plus size={14} />
                Añadir tarifa
              </button>
            )}
          </div>

          {/* Tariff Form */}
          {showTariffForm && (
            <div className="bg-white rounded-xl border border-gray-100 p-4 mb-4">
              <form onSubmit={handleAddTariff} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Nombre *</label>
                    <input
                      type="text"
                      value={tariffName}
                      onChange={(e) => setTariffName(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#288FC5]/20 focus:border-[#288FC5]"
                      placeholder="Consultoría estratégica"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Categoría</label>
                    <select
                      value={tariffCategory}
                      onChange={(e) => setTariffCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#288FC5]/20 focus:border-[#288FC5]"
                    >
                      <option value="general">General</option>
                      <option value="consultoria">Consultoría</option>
                      <option value="desarrollo">Desarrollo</option>
                      <option value="diseno">Diseño</option>
                      <option value="formacion">Formación</option>
                      <option value="mantenimiento">Mantenimiento</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Precio unitario (€) *</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={tariffPrice}
                      onChange={(e) => setTariffPrice(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#288FC5]/20 focus:border-[#288FC5]"
                      placeholder="75.00"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Unidad</label>
                    <select
                      value={tariffUnit}
                      onChange={(e) => setTariffUnit(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#288FC5]/20 focus:border-[#288FC5]"
                    >
                      <option value="hora">Hora</option>
                      <option value="unidad">Unidad</option>
                      <option value="proyecto">Proyecto</option>
                      <option value="mensual">Mensual</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Descripción</label>
                  <input
                    type="text"
                    value={tariffDesc}
                    onChange={(e) => setTariffDesc(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#288FC5]/20 focus:border-[#288FC5]"
                    placeholder="Descripción breve del servicio"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowTariffForm(false)}
                    className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-[#288FC5] text-white text-sm font-medium hover:bg-[#1a6fa0]"
                  >
                    Guardar tarifa
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Tariffs List */}
          {tariffs.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-xl border border-gray-100">
              <Receipt size={40} className="mx-auto text-gray-200 mb-3" />
              <p className="text-gray-500 text-sm">No hay tarifas configuradas</p>
              <p className="text-xs text-gray-400 mt-1">
                Las tarifas se usarán para calcular presupuestos automáticamente
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {tariffs.map((tariff) => (
                <div key={tariff.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#334155]">{tariff.name}</p>
                    <p className="text-xs text-gray-500">{tariff.description || 'Sin descripción'}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-gray-400 capitalize">{tariff.category}</span>
                      <span className="text-xs text-gray-400">/ {tariff.unit}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-[#288FC5]">{tariff.unitPrice.toFixed(2)}€</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded ${tariff.isActive ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {tariff.isActive ? 'Activa' : 'Inactiva'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Audit Tab */}
      {activeTab === 'audit' && (
        <div>
          <h3 className="text-lg font-semibold text-[#334155] mb-4">Registro de auditoría</h3>
          <p className="text-sm text-gray-500 mb-4">
            Historial de las últimas operaciones realizadas en tu empresa
          </p>

          {auditLogs.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-xl border border-gray-100">
              <Shield size={40} className="mx-auto text-gray-200 mb-3" />
              <p className="text-gray-500 text-sm">Sin registros de auditoría</p>
            </div>
          ) : (
            <div className="space-y-2">
              {auditLogs.map((log) => (
                <div key={log.id} className="bg-white rounded-lg border border-gray-100 p-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#334155]">{log.action}</p>
                    <p className="text-xs text-gray-500">
                      Recurso: {log.resource} — {new Date(log.timestamp).toLocaleString('es-ES')}
                    </p>
                  </div>
                  <span className="text-xs font-mono text-gray-400">
                    {log.resourceId.slice(0, 8)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
