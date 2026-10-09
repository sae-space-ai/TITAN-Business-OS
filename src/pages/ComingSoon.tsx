import { useLocation } from 'react-router-dom';
import { Construction } from 'lucide-react';

const moduleNames: Record<string, string> = {
  '/empleado-digital': 'Empleado digital',
  '/inteligencia': 'Inteligencia algorítmica',
  '/joule': 'JOULE Optimization',
  '/facturacion': 'Facturación',
  '/documentos': 'Documentos',
  '/informes': 'Informes',
  '/agenda': 'Agenda',
  '/cobros': 'Cobros',
  '/correo': 'Correo',
  '/marketing': 'Marketing',
  '/autorizaciones': 'Autorizaciones',
};

export default function ComingSoon() {
  const location = useLocation();
  const moduleName = moduleNames[location.pathname] || 'Módulo';

  return (
    <div className="flex items-center justify-center min-h-[60vh] p-8">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-[#EAF7FE] flex items-center justify-center mx-auto mb-4">
          <Construction size={32} className="text-[#288FC5]" />
        </div>
        <h2 className="text-xl font-bold text-[#334155] mb-2">{moduleName}</h2>
        <p className="text-gray-500 text-sm mb-4">
          Este módulo está en desarrollo y estará disponible próximamente.
        </p>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <p className="text-xs text-amber-700">
            <span className="font-medium">Estado:</span> En construcción — Etapa posterior
          </p>
          <p className="text-xs text-amber-600 mt-1">
            No se simulará funcionalidad que no esté implementada y verificada.
          </p>
        </div>
      </div>
    </div>
  );
}
