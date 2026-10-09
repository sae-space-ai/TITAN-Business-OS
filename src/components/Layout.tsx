import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../store';
import {
  Home, Bot, Brain, Zap, Users, FileText, FileCheck, Receipt,
  FolderOpen, BarChart3, Calendar, CreditCard, Mail, Megaphone,
  Landmark, Shield, Settings, LogOut, Menu, X
} from 'lucide-react';
import { useState } from 'react';

const modules = [
  { id: 'home', label: 'Home', icon: Home, path: '/home', status: 'active' },
  { id: 'employee', label: 'Empleado digital', icon: Bot, path: '/empleado-digital', status: 'experimental' },
  { id: 'intelligence', label: 'Inteligencia algorítmica', icon: Brain, path: '/inteligencia', status: 'experimental' },
  { id: 'joule', label: 'JOULE Optimization', icon: Zap, path: '/joule', status: 'active' },
  { id: 'clients', label: 'Clientes', icon: Users, path: '/clientes', status: 'active' },
  { id: 'requests', label: 'Solicitudes', icon: FileText, path: '/solicitudes', status: 'active' },
  { id: 'budgets', label: 'Presupuestos', icon: FileCheck, path: '/presupuestos', status: 'active' },
  { id: 'billing', label: 'Facturación', icon: Receipt, path: '/facturacion', status: 'pending' },
  { id: 'documents', label: 'Documentos', icon: FolderOpen, path: '/documentos', status: 'active' },
  { id: 'reports', label: 'Informes', icon: BarChart3, path: '/informes', status: 'active' },
  { id: 'agenda', label: 'Agenda', icon: Calendar, path: '/agenda', status: 'active' },
  { id: 'payments', label: 'Cobros', icon: CreditCard, path: '/cobros', status: 'pending' },
  { id: 'mail', label: 'Correo', icon: Mail, path: '/correo', status: 'pending' },
  { id: 'marketing', label: 'Marketing', icon: Megaphone, path: '/marketing', status: 'pending' },
  { id: 'sources', label: 'Fuentes oficiales', icon: Landmark, path: '/fuentes', status: 'experimental' },
  { id: 'auth', label: 'Autorizaciones', icon: Shield, path: '/autorizaciones', status: 'active' },
  { id: 'settings', label: 'Configuración', icon: Settings, path: '/configuracion', status: 'active' },
];

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useStore(s => s.logout);
  const getCurrentUser = useStore(s => s.getCurrentUser);
  const getCurrentCompany = useStore(s => s.getCurrentCompany);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const user = getCurrentUser();
  const company = getCurrentCompany();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 
        transform transition-transform duration-200 ease-in-out
        lg:translate-x-0 lg:static lg:inset-auto
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#288FC5] to-[#1a6fa0] flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <div>
                <h1 className="text-sm font-bold text-[#334155]">TITAN</h1>
                <p className="text-[10px] text-gray-400">Business OS</p>
              </div>
            </div>
            {company && (
              <p className="text-xs text-[#288FC5] mt-2 font-medium truncate">
                {company.commercialName}
              </p>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-3 px-3">
            <div className="space-y-0.5">
              {modules.map((mod) => {
                const Icon = mod.icon;
                const isActive = location.pathname === mod.path;
                const isPending = mod.status === 'pending' || mod.status === 'coming_soon';
                const isExperimental = mod.status === 'experimental';

                return (
                  <button
                    key={mod.id}
                    onClick={() => {
                      if (!isPending) {
                        navigate(mod.path);
                        setSidebarOpen(false);
                      }
                    }}
                    disabled={isPending}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all
                      ${isActive
                        ? 'bg-[#EAF7FE] text-[#288FC5]'
                        : isPending
                          ? 'text-gray-300 cursor-not-allowed'
                          : isExperimental
                            ? 'text-[#D778A4] hover:bg-[#F8D7E7]/30'
                            : 'text-[#334155] hover:bg-gray-50'
                      }
                    `}
                  >
                    <Icon size={18} className="shrink-0" />
                    <span className="text-sm font-medium truncate flex-1">{mod.label}</span>
                    {mod.status === 'pending' && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 font-medium">
                        Pendiente
                      </span>
                    )}
                    {isExperimental && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#F8D7E7] text-[#D778A4] font-medium">
                        Experimental
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </nav>

          {/* User info */}
          <div className="border-t border-gray-100 p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#EAF7FE] flex items-center justify-center">
                <span className="text-xs font-bold text-[#288FC5]">
                  {user?.name?.charAt(0).toUpperCase() || '?'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-[#334155] truncate">{user?.name}</p>
                <p className="text-[10px] text-gray-400 capitalize">{user?.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                title="Cerrar sesión"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 border-b border-gray-100 bg-white flex items-center px-4 lg:px-6 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-500"
          >
            <Menu size={20} />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-xs text-gray-400">
              Etapa 1 — Fundación
            </span>
            <div className="w-2 h-2 rounded-full bg-green-400" title="Sistema operativo" />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
