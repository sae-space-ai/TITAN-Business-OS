import { useState } from 'react';
import { useStore } from '../store';
import { Shield, Calendar, BarChart3, Zap, FileText, Mail, Megaphone, CreditCard, Receipt, Bot, Brain, Download } from 'lucide-react';

// ========== AUTORIZACIONES ==========
export function Authorizations() {
  const session = useStore(s => s.currentSession);
  const authorizationRequests = useStore(s => s.authorizationRequests);
  const company = useStore(s => s.getCurrentCompany);
  const user = useStore(s => s.getCurrentUser);

  const pending = session ? authorizationRequests.filter(a => a.companyId === session.companyId && a.status === 'pending') : [];

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-[#334155] flex items-center gap-2 mb-6">
        <Shield size={24} className="text-[#288FC5]" />
        Centro de Autorizaciones
      </h1>
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="font-semibold text-[#334155] mb-4">Operaciones Pendientes</h3>
        {pending.length === 0 ? (
          <p className="text-gray-500 text-sm">No hay operaciones pendientes de autorización</p>
        ) : (
          <div className="space-y-3">
            {pending.map(auth => (
              <div key={auth.id} className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="font-medium text-[#334155]">{auth.title}</p>
                <p className="text-sm text-gray-600 mt-1">{auth.description}</p>
                <p className="text-xs text-gray-500 mt-2">Solicitado por: {auth.requestedByName}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ========== AGENDA ==========
export function Agenda() {
  const session = useStore(s => s.currentSession);
  const events = useStore(s => s.events);
  const companyEvents = session ? events.filter(e => e.companyId === session.companyId) : [];

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-[#334155] flex items-center gap-2 mb-6">
        <Calendar size={24} className="text-[#288FC5]" />
        Agenda Empresarial
      </h1>
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <p className="text-sm text-gray-500 mb-4">Calendario de eventos y citas</p>
        {companyEvents.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">No hay eventos programados</p>
        ) : (
          <div className="space-y-2">
            {companyEvents.map(event => (
              <div key={event.id} className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium text-[#334155]">{event.title}</p>
                <p className="text-xs text-gray-500">{new Date(event.startDate).toLocaleString('es-ES')}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ========== INFORMES ==========
export function Reports() {
  const session = useStore(s => s.currentSession);
  const requests = useStore(s => s.requests);
  const budgets = useStore(s => s.budgets);
  const clients = useStore(s => s.clients);

  const companyRequests = session ? requests.filter(r => r.companyId === session.companyId) : [];
  const companyBudgets = session ? budgets.filter(b => b.companyId === session.companyId) : [];
  const companyClients = session ? clients.filter(c => c.companyId === session.companyId) : [];

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-[#334155] flex items-center gap-2 mb-6">
        <BarChart3 size={24} className="text-[#288FC5]" />
        Informes Empresariales
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-xs text-gray-500">Solicitudes</p>
          <p className="text-2xl font-bold text-[#334155]">{companyRequests.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-xs text-gray-500">Presupuestos</p>
          <p className="text-2xl font-bold text-[#334155]">{companyBudgets.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-xs text-gray-500">Aprobados</p>
          <p className="text-2xl font-bold text-green-600">{companyBudgets.filter(b => b.status === 'approved').length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-xs text-gray-500">Clientes</p>
          <p className="text-2xl font-bold text-[#334155]">{companyClients.length}</p>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="font-semibold text-[#334155] mb-4">Resumen de Actividad</h3>
        <p className="text-sm text-gray-600">
          Total presupuestos: {companyBudgets.length}<br />
          Importe total: {companyBudgets.reduce((sum, b) => sum + b.total, 0).toFixed(2)}€<br />
          Clientes activos: {companyClients.filter(c => c.status === 'active').length}
        </p>
      </div>
    </div>
  );
}

// ========== JOULE ==========
export function Joule() {
  const session = useStore(s => s.currentSession);
  const jouleMetrics = useStore(s => s.jouleMetrics);
  const companyMetrics = session ? jouleMetrics.filter(m => m.companyId === session.companyId) : [];

  const totalCost = companyMetrics.reduce((sum, m) => sum + m.cost, 0);
  const totalCalls = companyMetrics.length;
  const avgLatency = companyMetrics.length > 0 ? companyMetrics.reduce((sum, m) => sum + m.latencyMs, 0) / companyMetrics.length : 0;

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-[#334155] flex items-center gap-2 mb-6">
        <Zap size={24} className="text-amber-500" />
        JOULE Optimization
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-xs text-gray-500">Llamadas IA</p>
          <p className="text-2xl font-bold text-[#334155]">{totalCalls}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-xs text-gray-500">Coste Total</p>
          <p className="text-2xl font-bold text-[#288FC5]">{totalCost.toFixed(4)}€</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <p className="text-xs text-gray-500">Latencia Media</p>
          <p className="text-2xl font-bold text-[#334155]">{avgLatency.toFixed(0)}ms</p>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="font-semibold text-[#334155] mb-4">Métricas de Eficiencia</h3>
        <p className="text-sm text-gray-600">
          JOULE registra el consumo de recursos de IA para optimizar costes manteniendo calidad.
        </p>
      </div>
    </div>
  );
}

// ========== FACTURACIÓN ==========
export function Billing() {
  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-[#334155] flex items-center gap-2 mb-6">
        <Receipt size={24} className="text-[#288FC5]" />
        Facturación
      </h1>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
        <p className="text-sm text-amber-800">
          <strong>Módulo en preparación.</strong> La facturación requiere validación de normativa española vigente sobre sistemas informáticos de facturación y facturación electrónica. 
          Mientras se completa la integración con un proveedor conforme, este módulo permanece en estado de validación legal.
        </p>
      </div>
    </div>
  );
}

// ========== DOCUMENTOS ==========
export function Documents() {
  const session = useStore(s => s.currentSession);
  const generatedDocuments = useStore(s => s.generatedDocuments);
  const companyDocs = session ? generatedDocuments.filter(d => d.companyId === session.companyId) : [];

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-[#334155] flex items-center gap-2 mb-6">
        <FileText size={24} className="text-violet-500" />
        Gestor de Documentos
      </h1>
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="font-semibold text-[#334155] mb-4">Documentos Generados</h3>
        {companyDocs.length === 0 ? (
          <p className="text-gray-500 text-sm">No hay documentos generados. Genera PDF/XLSX desde presupuestos aprobados.</p>
        ) : (
          <div className="space-y-2">
            {companyDocs.map(doc => (
              <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-[#334155]">{doc.name}</p>
                  <p className="text-xs text-gray-500">{doc.fileSize} KB</p>
                </div>
                <a href={doc.dataUrl} download={doc.name} className="text-[#288FC5] hover:underline text-sm flex items-center gap-1">
                  <Download size={14} /> Descargar
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ========== COBROS ==========
export function Payments() {
  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-[#334155] flex items-center gap-2 mb-6">
        <CreditCard size={24} className="text-[#288FC5]" />
        Cobros
      </h1>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
        <p className="text-sm text-amber-800">
          <strong>Módulo en preparación.</strong> La gestión de cobros requiere integración con facturación y validación de normativa financiera.
        </p>
      </div>
    </div>
  );
}

// ========== CORREO ==========
export function MailModule() {
  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-[#334155] flex items-center gap-2 mb-6">
        <Mail size={24} className="text-[#288FC5]" />
        Correo Empresarial
      </h1>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
        <p className="text-sm text-amber-800">
          <strong>Módulo en preparación.</strong> Requiere integración con proveedores de email autorizados.
        </p>
      </div>
    </div>
  );
}

// ========== MARKETING ==========
export function Marketing() {
  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-[#334155] flex items-center gap-2 mb-6">
        <Megaphone size={24} className="text-[#288FC5]" />
        Marketing
      </h1>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
        <p className="text-sm text-amber-800">
          <strong>Módulo en preparación.</strong> Herramientas de marketing con controles de privacidad y consentimiento.
        </p>
      </div>
    </div>
  );
}

// ========== EMPLEADO DIGITAL (Chat) ==========
export function DigitalEmployee() {
  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-[#334155] flex items-center gap-2 mb-6">
        <Bot size={24} className="text-violet-500" />
        Empleado Digital
      </h1>
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="font-semibold text-[#334155] mb-4">Chat Operativo</h3>
        <p className="text-sm text-gray-600 mb-4">
          El empleado digital puede analizar solicitudes desde el módulo de Solicitudes. 
          El chat interactivo completo está en desarrollo.
        </p>
        <div className="bg-violet-50 border border-violet-200 rounded-lg p-4">
          <p className="text-xs text-violet-700">
            <strong>Estado:</strong> Análisis de solicitudes operativo. Chat interactivo en desarrollo.
          </p>
        </div>
      </div>
    </div>
  );
}

// ========== INTELIGENCIA ALGORÍTMICA ==========
export function AlgorithmicIntelligence() {
  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-[#334155] flex items-center gap-2 mb-6">
        <Brain size={24} className="text-blue-500" />
        Inteligencia Algorítmica
      </h1>
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="font-semibold text-[#334155] mb-4">Motor de IA Avanzada</h3>
        <p className="text-sm text-gray-600 mb-4">
          TITAN Algorithmic Intelligence combina modelos generativos, algoritmos especializados y verificación.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-xs text-blue-700">
            <strong>Estado:</strong> Arquitectura preparada. Capacidades avanzadas en investigación.
          </p>
        </div>
      </div>
    </div>
  );
}
