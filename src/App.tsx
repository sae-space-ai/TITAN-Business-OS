import { useState } from 'react';

export default function App() {
  const [activeSection, setActiveSection] = useState('vision');
  const [expandedModule, setExpandedModule] = useState<string | null>(null);

  const sections = [
    { id: 'vision', label: 'Visión', icon: '🎯' },
    { id: 'architecture', label: 'Arquitectura', icon: '🏗️' },
    { id: 'modules', label: 'Módulos', icon: '📦' },
    { id: 'data', label: 'Datos', icon: '💾' },
    { id: 'flows', label: 'Flujos', icon: '🔄' },
    { id: 'integrations', label: 'Integraciones', icon: '🔗' },
    { id: 'security', label: 'Seguridad', icon: '🔒' },
    { id: 'acceptance', label: 'Aceptación', icon: '✅' },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xl font-bold">
                T
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">TITAN Business OS</h1>
                <p className="text-xs text-gray-400">Queen Cover — Especificación de Construcción</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium">
                📋 Documento Maestro
              </span>
              <span className="px-3 py-1 rounded-full bg-gray-800 text-gray-400 text-xs">
                v1.0
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b border-gray-800 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto py-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  activeSection === section.id
                    ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
                }`}
              >
                <span>{section.icon}</span>
                <span>{section.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeSection === 'vision' && <VisionSection />}
        {activeSection === 'architecture' && <ArchitectureSection />}
        {activeSection === 'modules' && (
          <ModulesSection
            expandedModule={expandedModule}
            setExpandedModule={setExpandedModule}
          />
        )}
        {activeSection === 'data' && <DataSection />}
        {activeSection === 'flows' && <FlowsSection />}
        {activeSection === 'integrations' && <IntegrationsSection />}
        {activeSection === 'security' && <SecuritySection />}
        {activeSection === 'acceptance' && <AcceptanceSection />}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              Queen Cover — TITAN Business OS Specification
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>Máxima inteligencia dentro</span>
              <span className="text-gray-700">|</span>
              <span>Máxima sencillez fuera</span>
              <span className="text-gray-700">|</span>
              <span>Mínimo coste</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function VisionSection() {
  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 via-gray-900 to-cyan-950 border border-gray-800 p-8 sm:p-12">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent"></div>
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-medium mb-4">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            SUPERPROMPT MAESTRO
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            TITAN Business OS
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mb-6">
            Sistema operativo de negocio integrado para autónomos. 
            Inteligencia artificial que trabaja para ti, no contra ti.
          </p>
          
          {/* Core Philosophy */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700/50">
              <div className="text-3xl mb-3">🧠</div>
              <h3 className="font-semibold text-white text-sm mb-2">Máxima Inteligencia Dentro</h3>
              <p className="text-xs text-gray-400">
                IA avanzada, automatización completa, procesamiento inteligente de datos
              </p>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700/50">
              <div className="text-3xl mb-3">✨</div>
              <h3 className="font-semibold text-white text-sm mb-2">Máxima Sencillez Fuera</h3>
              <p className="text-xs text-gray-400">
                Interfaz natural, lenguaje humano, cero complejidad técnica visible
              </p>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700/50">
              <div className="text-3xl mb-3">💰</div>
              <h3 className="font-semibold text-white text-sm mb-2">Mínimo Coste</h3>
              <p className="text-xs text-gray-400">
                Optimización extrema, recursos eficientes, ROI inmediato
              </p>
            </div>
          </div>

          {/* User Story */}
          <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-cyan-300 uppercase tracking-wider mb-3">
              Historia de Usuario Principal
            </h3>
            <p className="text-gray-200 leading-relaxed">
              Un autónomo abre TITAN, le dice qué necesita en lenguaje natural, 
              y recibe el trabajo correctamente realizado. No necesita comprender 
              la tecnología que existe detrás. Solo necesita confiar en el resultado.
            </p>
          </div>
        </div>
      </div>

      {/* Principles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span>🎯</span> Principios de Diseño
          </h3>
          <ul className="space-y-3">
            {[
              "Producto integrado, no colección de prototipos",
              "Datos persistentes conectan todos los módulos",
              "Permisos unificados y verificables",
              "Operaciones auditables y trazables",
              "Construcción progresiva: núcleo primero, ambición después",
              "Cada módulo aporta valor inmediato",
              "La complejidad se oculta, la simplicidad se muestra",
            ].map((principle, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 shrink-0"></span>
                <span className="text-sm text-gray-300">{principle}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span>🚫</span> Anti-Patrones a Evitar
          </h3>
          <ul className="space-y-3">
            {[
              "Módulos aislados sin conexión de datos",
              "Complejidad técnica visible para el usuario",
              "Funcionalidades que requieren conocimiento técnico",
              "Sobrecarga de características innecesarias",
              "Dependencia de múltiples herramientas desconectadas",
              "Procesos manuales donde la automatización es posible",
              "Costes ocultos o inesperados",
            ].map((anti, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-red-400 mt-0.5">✗</span>
                <span className="text-sm text-gray-400">{anti}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Success Criteria */}
      <div className="bg-gradient-to-r from-cyan-500/5 to-blue-500/5 border border-cyan-500/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span>✅</span> Criterio de Éxito Definitivo
        </h3>
        <p className="text-gray-200 leading-relaxed mb-4">
          TITAN Business OS será un éxito cuando un autónomo pueda:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            "Abrir la aplicación sin formación previa",
            "Expresar necesidades en lenguaje natural",
            "Recibir resultados correctos y verificables",
            "Confiar en el sistema sin supervisar cada paso",
            "Ahorrar tiempo real (horas, no minutos)",
            "Pagar un coste predecible y justo",
          ].map((criterion, i) => (
            <div key={i} className="flex items-start gap-2 text-sm">
              <span className="text-cyan-400 shrink-0">→</span>
              <span className="text-gray-300">{criterion}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ArchitectureSection() {
  return (
    <div className="space-y-6">
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Arquitectura General del Sistema
        </h3>
        <p className="text-sm text-gray-400 mb-6">
          TITAN Business OS sigue una arquitectura modular integrada donde todos los componentes 
          comparten datos persistentes, permisos unificados y operaciones verificables.
        </p>

        {/* Architecture Layers */}
        <div className="space-y-4">
          {/* Presentation Layer */}
          <div className="bg-gradient-to-r from-cyan-500/10 to-transparent border border-cyan-500/20 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">🎨</span>
              <div>
                <h4 className="font-semibold text-white">Capa de Presentación</h4>
                <p className="text-xs text-gray-400">Interfaz natural y accesible</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {["Chat Natural", "Dashboard Visual", "Notificaciones"].map((item, i) => (
                <div key={i} className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
                  <p className="text-sm text-gray-300">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Orchestration Layer */}
          <div className="bg-gradient-to-r from-violet-500/10 to-transparent border border-violet-500/20 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">🎭</span>
              <div>
                <h4 className="font-semibold text-white">Capa de Orquestación</h4>
                <p className="text-xs text-gray-400">Coordinación inteligente de agentes</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {["Agente Coordinador", "Motor de Decisiones", "Gestor de Contexto"].map((item, i) => (
                <div key={i} className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
                  <p className="text-sm text-gray-300">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Business Logic Layer */}
          <div className="bg-gradient-to-r from-blue-500/10 to-transparent border border-blue-500/20 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">⚙️</span>
              <div>
                <h4 className="font-semibold text-white">Capa de Lógica de Negocio</h4>
                <p className="text-xs text-gray-400">Módulos funcionales especializados</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {["Facturación", "Clientes", "Proyectos", "Finanzas", "Documentos", "Comunicación", "Análisis", "Automatización"].map((item, i) => (
                <div key={i} className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
                  <p className="text-sm text-gray-300">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Data Layer */}
          <div className="bg-gradient-to-r from-emerald-500/10 to-transparent border border-emerald-500/20 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">💾</span>
              <div>
                <h4 className="font-semibold text-white">Capa de Datos</h4>
                <p className="text-xs text-gray-400">Persistencia unificada y segura</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {["Base de Datos Principal", "Almacenamiento de Archivos", "Caché y Sesiones"].map((item, i) => (
                <div key={i} className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
                  <p className="text-sm text-gray-300">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Integration Layer */}
          <div className="bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/20 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">🔗</span>
              <div>
                <h4 className="font-semibold text-white">Capa de Integración</h4>
                <p className="text-xs text-gray-400">Conexiones con servicios externos</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {["Email", "Pasarelas de Pago", "Bancos", "APIs Públicas", "Cloud Storage", "Mensajería", "Calendarios", "Otros"].map((item, i) => (
                <div key={i} className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
                  <p className="text-sm text-gray-300">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Key Architectural Decisions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h4 className="text-sm font-medium text-cyan-400 uppercase tracking-wider mb-3">
            Decisiones Arquitectónicas Clave
          </h4>
          <ul className="space-y-3">
            {[
              { decision: "Base de datos única", reason: "Todos los módulos comparten el mismo store" },
              { decision: "API REST + WebSocket", reason: "Comunicación síncrona y en tiempo real" },
              { decision: "Autenticación centralizada", reason: "JWT con refresh tokens y RBAC" },
              { decision: "Event-driven architecture", reason: "Módulos reaccionan a cambios de datos" },
              { decision: "Queue system para tareas largas", reason: "No bloquear la interfaz" },
            ].map((item, i) => (
              <li key={i} className="bg-gray-800/30 rounded-lg p-3">
                <p className="text-sm font-medium text-white mb-1">{item.decision}</p>
                <p className="text-xs text-gray-400">{item.reason}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h4 className="text-sm font-medium text-violet-400 uppercase tracking-wider mb-3">
            Stack Tecnológico Recomendado
          </h4>
          <div className="space-y-3">
            {[
              { layer: "Frontend", tech: "React + TypeScript + Tailwind CSS" },
              { layer: "Backend", tech: "Node.js + Express/Fastify + TypeScript" },
              { layer: "Base de Datos", tech: "PostgreSQL + Prisma ORM" },
              { layer: "Cache", tech: "Redis para sesiones y datos frecuentes" },
              { layer: "Queue", tech: "Bull/BullMQ para tareas asíncronas" },
              { layer: "IA", tech: "OpenAI API / Anthropic Claude API" },
              { layer: "Deploy", tech: "Docker + VPS (Hetzner/DigitalOcean)" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-xs font-medium text-gray-500 w-20 shrink-0">{item.layer}:</span>
                <span className="text-sm text-gray-300">{item.tech}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ModulesSection({
  expandedModule,
  setExpandedModule,
}: {
  expandedModule: string | null;
  setExpandedModule: (id: string | null) => void;
}) {
  const modules = [
    {
      id: 'billing',
      name: 'Módulo de Facturación',
      icon: '🧾',
      priority: 'CRÍTICO',
      description: 'Generación automática de facturas, presupuestos y recibos',
      features: [
        'Creación de facturas desde lenguaje natural',
        'Cálculo automático de impuestos (IVA, IRPF)',
        'Generación de PDFs profesionales',
        'Control de estados (borrador, enviada, pagada)',
        'Recordatorios automáticos de pago',
        'Exportación a formatos estándar',
      ],
      data: ['Facturas', 'Líneas de factura', 'Impuestos', 'Series numeración'],
      integrations: ['Email', 'Pasarelas de pago', 'Bancos'],
    },
    {
      id: 'clients',
      name: 'Módulo de Clientes',
      icon: '👥',
      priority: 'CRÍTICO',
      description: 'Gestión completa de la base de datos de clientes',
      features: [
        'Fichas de cliente con historial completo',
        'Búsqueda inteligente y filtrado',
        'Segmentación automática',
        'Comunicación centralizada',
        'Notas y etiquetas personalizadas',
        'Importación/exportación de datos',
      ],
      data: ['Clientes', 'Contactos', 'Historial', 'Etiquetas'],
      integrations: ['Email', 'Calendario', 'CRM externo'],
    },
    {
      id: 'projects',
      name: 'Módulo de Proyectos',
      icon: '📋',
      priority: 'ALTO',
      description: 'Organización y seguimiento de proyectos y tareas',
      features: [
        'Creación de proyectos desde descripción natural',
        'Desglose automático en tareas',
        'Asignación de tiempos y recursos',
        'Seguimiento de progreso',
        'Registro de tiempo trabajado',
        'Informes de productividad',
      ],
      data: ['Proyectos', 'Tareas', 'Tiempos', 'Entregables'],
      integrations: ['Calendario', 'Email', 'Almacenamiento'],
    },
    {
      id: 'finance',
      name: 'Módulo Financiero',
      icon: '💰',
      priority: 'ALTO',
      description: 'Control de ingresos, gastos y salud financiera',
      features: [
        'Registro automático de movimientos',
        'Categorización inteligente de gastos',
        'Conciliación bancaria',
        'Previsión de flujo de caja',
        'Informes financieros',
        'Alertas de umbrales',
      ],
      data: ['Movimientos', 'Categorías', 'Cuentas', 'Presupuestos'],
      integrations: ['Bancos', 'Pasarelas de pago'],
    },
    {
      id: 'documents',
      name: 'Módulo de Documentos',
      icon: '📄',
      priority: 'MEDIO',
      description: 'Gestión inteligente de documentos y archivos',
      features: [
        'Almacenamiento organizado',
        'Extracción automática de datos',
        'Clasificación inteligente',
        'Búsqueda por contenido',
        'Versionado de documentos',
        'Firmas digitales',
      ],
      data: ['Documentos', 'Versiones', 'Metadatos', 'Permisos'],
      integrations: ['Cloud storage', 'Email', 'Firma digital'],
    },
    {
      id: 'communication',
      name: 'Módulo de Comunicación',
      icon: '💬',
      priority: 'MEDIO',
      description: 'Centralización de comunicaciones con clientes',
      features: [
        'Email unificado',
        'Plantillas inteligentes',
        'Seguimiento de respuestas',
        'Programación de envíos',
        'Historial por cliente',
        'Notificaciones push',
      ],
      data: ['Mensajes', 'Plantillas', 'Conversaciones', 'Contactos'],
      integrations: ['Email', 'SMS', 'WhatsApp', 'Telegram'],
    },
    {
      id: 'analytics',
      name: 'Módulo de Análisis',
      icon: '📊',
      priority: 'MEDIO',
      description: 'Inteligencia de negocio y reporting',
      features: [
        'Dashboards personalizables',
        'KPIs automáticos',
        'Informes periódicos',
        'Análisis de tendencias',
        'Predicciones básicas',
        'Exportación de datos',
      ],
      data: ['Métricas', 'Informes', 'Alertas', 'Configuraciones'],
      integrations: ['Todos los módulos'],
    },
    {
      id: 'automation',
      name: 'Módulo de Automatización',
      icon: '🤖',
      priority: 'ALTO',
      description: 'Motor de automatizaciones y workflows',
      features: [
        'Creación de flujos desde lenguaje natural',
        'Triggers condicionales',
        'Acciones encadenadas',
        'Templates predefinidos',
        'Monitorización de ejecuciones',
        'Logs detallados',
      ],
      data: ['Workflows', 'Triggers', 'Acciones', 'Ejecuciones'],
      integrations: ['Todos los módulos', 'APIs externas'],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-white mb-2">
          Módulos Funcionales
        </h3>
        <p className="text-sm text-gray-400 mb-6">
          Cada módulo es una unidad funcional independiente pero completamente integrada con el resto del sistema.
          Todos comparten datos, permisos y operaciones.
        </p>

        {/* Modules Grid */}
        <div className="space-y-4">
          {modules.map((module) => (
            <div
              key={module.id}
              className={`bg-gray-800/30 rounded-xl border transition-all duration-300 ${
                expandedModule === module.id
                  ? 'border-cyan-500/30 shadow-lg shadow-cyan-500/5'
                  : 'border-gray-700/50 hover:border-gray-600'
              }`}
            >
              <button
                onClick={() => setExpandedModule(expandedModule === module.id ? null : module.id)}
                className="w-full p-5 text-left"
              >
                <div className="flex items-start gap-4">
                  <span className="text-3xl">{module.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-white font-semibold">{module.name}</h4>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        module.priority === 'CRÍTICO'
                          ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                          : module.priority === 'ALTO'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      }`}>
                        {module.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">{module.description}</p>
                  </div>
                  <span className={`text-gray-500 transition-transform duration-200 ${
                    expandedModule === module.id ? 'rotate-180' : ''
                  }`}>
                    ▼
                  </span>
                </div>
              </button>

              {expandedModule === module.id && (
                <div className="px-5 pb-5 border-t border-gray-700/50 pt-4">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Features */}
                    <div>
                      <h5 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                        Funcionalidades
                      </h5>
                      <ul className="space-y-1.5">
                        {module.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                            <span className="text-cyan-400 mt-0.5">•</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Data Models */}
                    <div>
                      <h5 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                        Modelos de Datos
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {module.data.map((data, i) => (
                          <span key={i} className="px-2 py-1 rounded bg-gray-700/50 border border-gray-600/50 text-xs text-gray-300">
                            {data}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Integrations */}
                    <div>
                      <h5 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                        Integraciones
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {module.integrations.map((integration, i) => (
                          <span key={i} className="px-2 py-1 rounded bg-violet-500/10 border border-violet-500/20 text-xs text-violet-300">
                            {integration}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DataSection() {
  return (
    <div className="space-y-6">
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Modelo de Datos Unificado
        </h3>
        <p className="text-sm text-gray-400 mb-6">
          Todos los módulos comparten una base de datos centralizada con relaciones explícitas.
          Esto garantiza consistencia, integridad y trazabilidad completa.
        </p>

        {/* Core Entities */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-cyan-400 uppercase tracking-wider">
            Entidades Principales
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { entity: 'User', fields: ['id', 'email', 'name', 'role', 'settings'] },
              { entity: 'Client', fields: ['id', 'name', 'email', 'phone', 'address', 'taxId'] },
              { entity: 'Invoice', fields: ['id', 'clientId', 'number', 'date', 'total', 'status'] },
              { entity: 'Project', fields: ['id', 'clientId', 'name', 'status', 'budget', 'deadline'] },
              { entity: 'Task', fields: ['id', 'projectId', 'title', 'status', 'estimatedTime'] },
              { entity: 'Transaction', fields: ['id', 'type', 'amount', 'category', 'date'] },
            ].map((item, i) => (
              <div key={i} className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-4">
                <h5 className="font-semibold text-white mb-2">{item.entity}</h5>
                <div className="space-y-1">
                  {item.fields.map((field, j) => (
                    <div key={j} className="text-xs text-gray-400 font-mono">
                      {field}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Relationships */}
        <div className="mt-8">
          <h4 className="text-sm font-medium text-violet-400 uppercase tracking-wider mb-3">
            Relaciones Clave
          </h4>
          <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/50">
            <div className="space-y-2 text-sm text-gray-300">
              <p><span className="text-cyan-400 font-mono">Client</span> → <span className="text-cyan-400 font-mono">Invoice</span> (1:N)</p>
              <p><span className="text-cyan-400 font-mono">Client</span> → <span className="text-cyan-400 font-mono">Project</span> (1:N)</p>
              <p><span className="text-cyan-400 font-mono">Project</span> → <span className="text-cyan-400 font-mono">Task</span> (1:N)</p>
              <p><span className="text-cyan-400 font-mono">Invoice</span> → <span className="text-cyan-400 font-mono">Transaction</span> (1:N)</p>
              <p><span className="text-cyan-400 font-mono">Project</span> → <span className="text-cyan-400 font-mono">Invoice</span> (N:M)</p>
            </div>
          </div>
        </div>

        {/* Data Principles */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-800/30 rounded-lg p-5 border border-gray-700/50">
            <h5 className="text-sm font-medium text-white mb-3">Principios de Datos</h5>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">→</span>
                <span>Integridad referencial estricta</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">→</span>
                <span>Soft delete para auditoría</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">→</span>
                <span>Timestamps automáticos</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400">→</span>
                <span>Versionado de cambios críticos</span>
              </li>
            </ul>
          </div>

          <div className="bg-gray-800/30 rounded-lg p-5 border border-gray-700/50">
            <h5 className="text-sm font-medium text-white mb-3">Estrategia de Persistencia</h5>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-violet-400">→</span>
                <span>PostgreSQL como fuente de verdad</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-violet-400">→</span>
                <span>Redis para caché y sesiones</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-violet-400">→</span>
                <span>S3/MinIO para archivos</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-violet-400">→</span>
                <span>Backups automáticos diarios</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function FlowsSection() {
  const flows = [
    {
      name: 'Flujo de Facturación',
      steps: [
        'Usuario describe trabajo realizado',
        'IA extrae datos y crea borrador de factura',
        'Usuario revisa y aprueba',
        'Sistema genera PDF y envía por email',
        'Se registra en contabilidad',
        'Se actualiza estado del proyecto',
      ],
    },
    {
      name: 'Flujo de Nuevo Cliente',
      steps: [
        'Usuario introduce datos del cliente',
        'Sistema crea ficha y verifica duplicados',
        'Se genera plantilla de bienvenida',
        'Se envía email de presentación',
        'Se crea proyecto si aplica',
        'Se programa seguimiento',
      ],
    },
    {
      name: 'Flujo de Automatización',
      steps: [
        'Usuario describe automatización deseada',
        'IA interpreta y propone flujo',
        'Usuario ajusta parámetros',
        'Sistema crea workflow',
        'Se ejecuta según triggers',
        'Se notifican resultados',
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Flujos Operativos Principales
        </h3>
        <p className="text-sm text-gray-400 mb-6">
          Los flujos muestran cómo los módulos trabajan juntos para completar tareas complejas
          de forma automática y coordinada.
        </p>

        <div className="space-y-6">
          {flows.map((flow, i) => (
            <div key={i} className="bg-gray-800/30 rounded-xl border border-gray-700/50 p-5">
              <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-xs text-cyan-300">
                  {i + 1}
                </span>
                {flow.name}
              </h4>
              <div className="relative">
                <div className="absolute left-3 top-3 bottom-3 w-px bg-gray-700"></div>
                <div className="space-y-3">
                  {flow.steps.map((step, j) => (
                    <div key={j} className="relative pl-10">
                      <div className="absolute left-1.5 w-3 h-3 rounded-full bg-cyan-500/30 border-2 border-cyan-400"></div>
                      <p className="text-sm text-gray-300">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Event System */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h4 className="text-sm font-medium text-violet-400 uppercase tracking-wider mb-3">
          Sistema de Eventos
        </h4>
        <p className="text-sm text-gray-400 mb-4">
          Los módulos se comunican mediante eventos. Cuando algo cambia en un módulo,
          se emite un evento que otros módulos pueden escuchar y procesar.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            'invoice.created',
            'client.updated',
            'payment.received',
            'project.completed',
            'task.assigned',
            'automation.triggered',
          ].map((event, i) => (
            <div key={i} className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/50">
              <code className="text-sm text-violet-300">{event}</code>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function IntegrationsSection() {
  return (
    <div className="space-y-6">
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Integraciones con Servicios Externos
        </h3>
        <p className="text-sm text-gray-400 mb-6">
          TITAN se conecta con servicios externos para ampliar sus capacidades.
          Todas las integraciones siguen el mismo patrón: autenticación segura, 
          manejo de errores y sincronización de datos.
        </p>

        {/* Integration Categories */}
        <div className="space-y-6">
          {/* Email */}
          <div>
            <h4 className="text-sm font-medium text-cyan-400 uppercase tracking-wider mb-3">
              Comunicación
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { name: 'Gmail / Outlook', status: 'prioritario' },
                { name: 'SendGrid / Mailgun', status: 'prioritario' },
                { name: 'WhatsApp Business', status: 'fase 2' },
                { name: 'Telegram Bot', status: 'fase 2' },
              ].map((item, i) => (
                <div key={i} className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/50">
                  <p className="text-sm text-gray-300 mb-1">{item.name}</p>
                  <span className={`text-xs ${
                    item.status === 'prioritario' ? 'text-green-400' : 'text-gray-500'
                  }`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Payments */}
          <div>
            <h4 className="text-sm font-medium text-cyan-400 uppercase tracking-wider mb-3">
              Pagos
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { name: 'Stripe', status: 'prioritario' },
                { name: 'PayPal', status: 'fase 2' },
                { name: 'Redsys (España)', status: 'fase 2' },
                { name: 'Criptomonedas', status: 'opcional' },
              ].map((item, i) => (
                <div key={i} className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/50">
                  <p className="text-sm text-gray-300 mb-1">{item.name}</p>
                  <span className={`text-xs ${
                    item.status === 'prioritario' ? 'text-green-400' : 
                    item.status === 'fase 2' ? 'text-amber-400' : 'text-gray-500'
                  }`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Banking */}
          <div>
            <h4 className="text-sm font-medium text-cyan-400 uppercase tracking-wider mb-3">
              Banca
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { name: 'Plaid (EU)', status: 'prioritario' },
                { name: 'Open Banking APIs', status: 'prioritario' },
                { name: 'Importación CSV', status: 'fallback' },
                { name: 'Conciliación manual', status: 'fallback' },
              ].map((item, i) => (
                <div key={i} className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/50">
                  <p className="text-sm text-gray-300 mb-1">{item.name}</p>
                  <span className={`text-xs ${
                    item.status === 'prioritario' ? 'text-green-400' : 
                    item.status === 'fallback' ? 'text-blue-400' : 'text-gray-500'
                  }`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* AI */}
          <div>
            <h4 className="text-sm font-medium text-cyan-400 uppercase tracking-wider mb-3">
              Inteligencia Artificial
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { name: 'OpenAI GPT-4', status: 'prioritario' },
                { name: 'Anthropic Claude', status: 'prioritario' },
                { name: 'Modelos open-source', status: 'opcional' },
                { name: 'Embeddings (vector)', status: 'fase 2' },
              ].map((item, i) => (
                <div key={i} className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/50">
                  <p className="text-sm text-gray-300 mb-1">{item.name}</p>
                  <span className={`text-xs ${
                    item.status === 'prioritario' ? 'text-green-400' : 
                    item.status === 'fase 2' ? 'text-amber-400' : 'text-gray-500'
                  }`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Integration Pattern */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h4 className="text-sm font-medium text-violet-400 uppercase tracking-wider mb-3">
          Patrón de Integración Estándar
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            'OAuth 2.0 para autenticación',
            'Webhooks para notificaciones',
            'Rate limiting y retry logic',
            'Cifrado de credenciales',
            'Logs de todas las operaciones',
            'Fallbacks manuales si falla',
          ].map((pattern, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-gray-300">
              <span className="text-violet-400">→</span>
              <span>{pattern}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SecuritySection() {
  return (
    <div className="space-y-6">
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Modelo de Seguridad
        </h3>
        <p className="text-sm text-gray-400 mb-6">
          La seguridad es transversal a todo el sistema. Cada capa, cada módulo, cada operación
          sigue los mismos principios de protección.
        </p>

        {/* Security Layers */}
        <div className="space-y-4">
          <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-xl p-5">
            <h4 className="text-sm font-medium text-cyan-400 uppercase tracking-wider mb-3">
              Autenticación
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {['JWT con refresh tokens', 'MFA opcional', 'Sesiones seguras', 'Bloqueo tras intentos fallidos'].map((item, j) => (
                <div key={j} className="flex items-start gap-2 text-sm text-gray-300">
                  <span className="text-cyan-400">✓</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-violet-500/5 border border-violet-500/20 rounded-xl p-5">
            <h4 className="text-sm font-medium text-violet-400 uppercase tracking-wider mb-3">
              Autorización
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {['RBAC (Role-Based Access Control)', 'Permisos granulares por recurso', 'Herencia de permisos', 'Auditoría de accesos'].map((item, j) => (
                <div key={j} className="flex items-start gap-2 text-sm text-gray-300">
                  <span className="text-violet-400">✓</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-5">
            <h4 className="text-sm font-medium text-blue-400 uppercase tracking-wider mb-3">
              Protección de Datos
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {['Cifrado en tránsito (TLS)', 'Cifrado en reposo', 'Datos sensibles aislados', 'Backups encriptados'].map((item, j) => (
                <div key={j} className="flex items-start gap-2 text-sm text-gray-300">
                  <span className="text-blue-400">✓</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-5">
            <h4 className="text-sm font-medium text-emerald-400 uppercase tracking-wider mb-3">
              Seguridad de Aplicación
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {['Validación de inputs', 'Protección CSRF/XSS', 'Rate limiting', 'Sanitización de datos'].map((item, j) => (
                <div key={j} className="flex items-start gap-2 text-sm text-gray-300">
                  <span className="text-emerald-400">✓</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Compliance */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h4 className="text-sm font-medium text-amber-400 uppercase tracking-wider mb-3">
          Cumplimiento Normativo
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { norm: 'GDPR / RGPD', desc: 'Protección de datos europeos' },
            { norm: 'LOPDGDD', desc: 'Ley orgánica española' },
            { norm: 'Facturación electrónica', desc: 'Veri*factu (España)' },
            { norm: 'Conservación de datos', desc: '4 años mínimos fiscales' },
          ].map((item, i) => (
            <div key={i} className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-4">
              <p className="text-sm font-medium text-amber-300 mb-1">{item.norm}</p>
              <p className="text-xs text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AcceptanceSection() {
  return (
    <div className="space-y-6">
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Criterios Objetivos de Aceptación
        </h3>
        <p className="text-sm text-gray-400 mb-6">
          TITAN Business OS se considera funcional cuando cumple todos estos criterios.
          No son objetivos, son requisitos mínimos.
        </p>

        {/* Acceptance Criteria */}
        <div className="space-y-4">
          {[
            {
              category: 'Funcionalidad Core',
              criteria: [
                'Crear factura desde descripción en lenguaje natural',
                'Generar PDF de factura válido fiscalmente',
                'Enviar factura por email automáticamente',
                'Registrar pago y actualizar estado',
                'Crear ficha de cliente completa',
                'Asociar facturas a clientes y proyectos',
              ],
            },
            {
              category: 'Integración de Datos',
              criteria: [
                'Todos los módulos comparten la misma base de datos',
                'Cambios en un módulo se reflejan instantáneamente en otros',
                'No existe información duplicada o inconsistente',
                'Trazabilidad completa de todas las operaciones',
                'Backups automáticos y verificables',
              ],
            },
            {
              category: 'Experiencia de Usuario',
              criteria: [
                'Interfaz completamente en español',
                'No requiere formación técnica previa',
                'Todas las acciones principales en máximo 3 clics',
                'Feedback inmediato de todas las operaciones',
                'Recuperación automática ante errores',
              ],
            },
            {
              category: 'Seguridad y Privacidad',
              criteria: [
                'Autenticación segura con JWT',
                'Datos cifrados en tránsito y reposo',
                'Permisos granulares verificables',
                'Logs de auditoría completos',
                'Cumplimiento GDPR/LOPDGDD',
              ],
            },
            {
              category: 'Rendimiento y Fiabilidad',
              criteria: [
                'Tiempo de respuesta < 2 segundos',
                'Disponibilidad > 99.5%',
                'Sin pérdida de datos ante fallos',
                'Escalable a 1000 usuarios concurrentes',
                'Monitorización y alertas automáticas',
              ],
            },
            {
              category: 'Coste y Sostenibilidad',
              criteria: [
                'Coste infraestructura < $50/mes para 100 usuarios',
                'Coste IA < $0.50 por operación compleja',
                'Sin costes ocultos o sorpresas',
                'ROI demostrable en primer mes',
                'Mantenimiento < 5 horas/mes',
              ],
            },
          ].map((section, i) => (
            <div key={i} className="bg-gray-800/30 rounded-xl border border-gray-700/50 p-5">
              <h4 className="text-sm font-medium text-cyan-400 uppercase tracking-wider mb-3">
                {section.category}
              </h4>
              <div className="space-y-2">
                {section.criteria.map((criterion, j) => (
                  <div key={j} className="flex items-start gap-3">
                    <span className="w-4 h-4 rounded border border-green-500/30 bg-green-500/10 shrink-0 mt-0.5"></span>
                    <span className="text-sm text-gray-300">{criterion}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Definition of Done */}
      <div className="bg-gradient-to-r from-green-500/5 to-emerald-500/5 border border-green-500/20 rounded-xl p-6">
        <h4 className="text-sm font-medium text-green-400 uppercase tracking-wider mb-3">
          Definition of Done (DoD)
        </h4>
        <p className="text-sm text-gray-300 leading-relaxed">
          Un módulo se considera "terminado" cuando: está implementado, probado, documentado,
          integrado con el resto del sistema, cumple los criterios de aceptación específicos,
          y ha sido validado por al menos un usuario real en condiciones de uso normales.
        </p>
      </div>
    </div>
  );
}
