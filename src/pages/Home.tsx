import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import {
  Bot, Brain, Zap, Users, FileText, FileCheck, Receipt,
  FolderOpen, BarChart3, Calendar, CreditCard, Mail, Megaphone,
  Landmark, Shield, Settings, ArrowRight, Sparkles, TrendingUp,
  Clock, AlertCircle
} from 'lucide-react';
import { useState } from 'react';

const homeModules = [
  { id: 'employee', label: 'Empleado digital', icon: Bot, path: '/empleado-digital', status: 'coming_soon', color: 'from-violet-500 to-purple-600' },
  { id: 'intelligence', label: 'Inteligencia algorítmica', icon: Brain, path: '/inteligencia', status: 'coming_soon', color: 'from-blue-500 to-indigo-600' },
  { id: 'joule', label: 'JOULE Optimization', icon: Zap, path: '/joule', status: 'coming_soon', color: 'from-amber-500 to-orange-600' },
  { id: 'clients', label: 'Clientes', icon: Users, path: '/clientes', status: 'active', color: 'from-[#288FC5] to-[#1a6fa0]' },
  { id: 'requests', label: 'Solicitudes', icon: FileText, path: '/solicitudes', status: 'active', color: 'from-[#288FC5] to-[#1a6fa0]' },
  { id: 'budgets', label: 'Presupuestos', icon: FileCheck, path: '/presupuestos', status: 'active', color: 'from-[#288FC5] to-[#1a6fa0]' },
  { id: 'billing', label: 'Facturación', icon: Receipt, path: '/facturacion', status: 'coming_soon', color: 'from-gray-400 to-gray-500' },
  { id: 'documents', label: 'Documentos', icon: FolderOpen, path: '/documentos', status: 'coming_soon', color: 'from-gray-400 to-gray-500' },
  { id: 'reports', label: 'Informes', icon: BarChart3, path: '/informes', status: 'coming_soon', color: 'from-gray-400 to-gray-500' },
  { id: 'agenda', label: 'Agenda', icon: Calendar, path: '/agenda', status: 'coming_soon', color: 'from-gray-400 to-gray-500' },
  { id: 'payments', label: 'Cobros', icon: CreditCard, path: '/cobros', status: 'coming_soon', color: 'from-gray-400 to-gray-500' },
  { id: 'mail', label: 'Correo', icon: Mail, path: '/correo', status: 'coming_soon', color: 'from-gray-400 to-gray-500' },
  { id: 'marketing', label: 'Marketing', icon: Megaphone, path: '/marketing', status: 'coming_soon', color: 'from-gray-400 to-gray-500' },
  { id: 'sources', label: 'Fuentes oficiales', icon: Landmark, path: '/fuentes', status: 'experimental', color: 'from-[#D778A4] to-[#b85a85]' },
  { id: 'auth', label: 'Autorizaciones', icon: Shield, path: '/autorizaciones', status: 'coming_soon', color: 'from-gray-400 to-gray-500' },
  { id: 'settings', label: 'Configuración', icon: Settings, path: '/configuracion', status: 'active', color: 'from-gray-600 to-gray-700' },
];

export default function Home() {
  const navigate = useNavigate();
  const getCurrentUser = useStore(s => s.getCurrentUser);
  const getCurrentCompany = useStore(s => s.getCurrentCompany);
  const getRequestsByCompany = useStore(s => s.getRequestsByCompany);
  const getBudgetsByCompany = useStore(s => s.getBudgetsByCompany);
  const getClientsByCompany = useStore(s => s.getClientsByCompany);
  const [quickInput, setQuickInput] = useState('');

  const user = getCurrentUser();
  const company = getCurrentCompany();
  const session = useStore(s => s.currentSession);

  const requests = session ? getRequestsByCompany(session.companyId) : [];
  const budgets = session ? getBudgetsByCompany(session.companyId) : [];
  const clients = session ? getClientsByCompany(session.companyId) : [];

  const pendingRequests = requests.filter(r => ['received', 'analyzing', 'analyzed'].includes(r.status));
  const pendingBudgets = budgets.filter(b => b.status === 'pending_approval');

  const handleQuickAction = () => {
    if (quickInput.trim()) {
      navigate('/solicitudes/nueva?description=' + encodeURIComponent(quickInput));
    }
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-[#334155]">
          Hola, {user?.name?.split(' ')[0] || 'bienvenido'} 👋
        </h1>
        <p className="text-gray-500 mt-1">
          {company?.commercialName} — Centro de operaciones
        </p>
      </div>

      {/* Quick Action */}
      <div className="bg-gradient-to-r from-[#EAF7FE] to-[#F8D7E7]/30 rounded-2xl p-6 mb-8 border border-[#288FC5]/10">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#288FC5] flex items-center justify-center shrink-0">
            <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[#334155]">
              ¿Qué quieres que haga TITAN por ti hoy?
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Describe lo que necesitas en lenguaje natural
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={quickInput}
            onChange={(e) => setQuickInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleQuickAction()}
            placeholder="Ej: Necesito un presupuesto para el cliente García por consultoría..."
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#288FC5]/20 focus:border-[#288FC5]"
          />
          <button
            onClick={handleQuickAction}
            disabled={!quickInput.trim()}
            className="px-5 py-3 rounded-xl bg-[#288FC5] text-white font-medium text-sm hover:bg-[#1a6fa0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <span className="hidden sm:inline">Enviar</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#EAF7FE] flex items-center justify-center">
              <FileText size={18} className="text-[#288FC5]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#334155]">{requests.length}</p>
              <p className="text-xs text-gray-500">Solicitudes</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#F8D7E7]/50 flex items-center justify-center">
              <FileCheck size={18} className="text-[#D778A4]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#334155]">{budgets.length}</p>
              <p className="text-xs text-gray-500">Presupuestos</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
              <Users size={18} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#334155]">{clients.length}</p>
              <p className="text-xs text-gray-500">Clientes</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
              <Clock size={18} className="text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#334155]">{pendingRequests.length + pendingBudgets.length}</p>
              <p className="text-xs text-gray-500">Pendientes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pending items */}
      {(pendingRequests.length > 0 || pendingBudgets.length > 0) && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle size={16} className="text-amber-600" />
            <h3 className="text-sm font-semibold text-amber-800">Requiere tu atención</h3>
          </div>
          <div className="space-y-2">
            {pendingRequests.slice(0, 3).map(req => (
              <div key={req.id} className="flex items-center justify-between bg-white rounded-lg p-3 border border-amber-100">
                <div className="flex items-center gap-3">
                  <FileText size={14} className="text-amber-500" />
                  <span className="text-sm text-gray-700 truncate max-w-[200px]">{req.description}</span>
                </div>
                <button
                  onClick={() => navigate('/solicitudes')}
                  className="text-xs text-[#288FC5] font-medium hover:underline"
                >
                  Ver →
                </button>
              </div>
            ))}
            {pendingBudgets.slice(0, 2).map(bud => (
              <div key={bud.id} className="flex items-center justify-between bg-white rounded-lg p-3 border border-amber-100">
                <div className="flex items-center gap-3">
                  <FileCheck size={14} className="text-[#D778A4]" />
                  <span className="text-sm text-gray-700">Presupuesto {bud.number} — {bud.total.toFixed(2)}€</span>
                </div>
                <button
                  onClick={() => navigate('/presupuestos')}
                  className="text-xs text-[#288FC5] font-medium hover:underline"
                >
                  Aprobar →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modules Grid */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-[#334155] mb-4">Módulos</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {homeModules.map((mod) => {
            const Icon = mod.icon;
            const isComingSoon = mod.status === 'coming_soon';
            const isExperimental = mod.status === 'experimental';

            return (
              <button
                key={mod.id}
                onClick={() => {
                  if (!isComingSoon) navigate(mod.path);
                }}
                disabled={isComingSoon}
                className={`
                  relative group p-4 rounded-xl border text-left transition-all
                  ${isComingSoon
                    ? 'bg-gray-50 border-gray-100 cursor-not-allowed opacity-60'
                    : isExperimental
                      ? 'bg-white border-[#F8D7E7] hover:border-[#D778A4] hover:shadow-md'
                      : 'bg-white border-gray-100 hover:border-[#288FC5] hover:shadow-md'
                  }
                `}
              >
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${mod.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <Icon size={20} className="text-white" />
                </div>
                <p className="text-sm font-medium text-[#334155]">{mod.label}</p>
                {isComingSoon && (
                  <span className="absolute top-2 right-2 text-[9px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-400 font-medium">
                    Próximamente
                  </span>
                )}
                {isExperimental && (
                  <span className="absolute top-2 right-2 text-[9px] px-1.5 py-0.5 rounded bg-[#F8D7E7] text-[#D778A4] font-medium">
                    Experimental
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Stage info */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#EAF7FE] flex items-center justify-center">
            <TrendingUp size={16} className="text-[#288FC5]" />
          </div>
          <div>
            <p className="text-sm font-medium text-[#334155]">Etapa 1 — Fundación completada</p>
            <p className="text-xs text-gray-500">
              Home, autenticación, empresas, roles, base de datos y estructura modular operativos.
              Siguiente: Circuito Comercial (Etapa 2).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
