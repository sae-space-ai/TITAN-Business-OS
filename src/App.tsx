import { useState } from 'react';

function App() {
  const [activeSection, setActiveSection] = useState('overview');
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);

  const questions = [
    {
      id: 1,
      title: "¿Qué problemas específicos quieres resolver?",
      description: "Define los casos de uso reales. Por ejemplo: automatizar atención al cliente, generar informes, monitorizar datos, gestionar contenido, etc.",
      importance: "CRÍTICA",
      icon: "🎯",
      context: "Sin objetivos claros no se puede diseñar una arquitectura eficiente. Cada agente y herramienta debe responder a un problema concreto.",
      examples: [
        "Automatizar la generación de informes semanales a partir de datos dispersos",
        "Monitorizar fuentes de información y generar alertas inteligentes",
        "Gestionar y responder consultas de clientes de forma semi-autónoma",
        "Procesar documentos y extraer información estructurada",
        "Coordinar tareas entre múltiples herramientas y plataformas"
      ]
    },
    {
      id: 2,
      title: "¿Quién usará el sistema y cómo interactuará con él?",
      description: "Identifica los usuarios finales: solo tú, un equipo pequeño, clientes externos, o una combinación.",
      importance: "CRÍTICA",
      icon: "👥",
      context: "El tipo de usuario determina la complejidad de la interfaz, los niveles de supervisión necesarios y el modelo de seguridad.",
      examples: [
        "Solo yo (uso personal para productividad)",
        "Yo + 2-3 colaboradores con roles diferenciados",
        "Equipo interno de una empresa (5-15 personas)",
        "Clientes externos que interactúan con los agentes",
        "Combinación: yo superviso, agentes ejecutan, clientes reciben resultados"
      ]
    },
    {
      id: 3,
      title: "¿Qué herramientas y servicios externos necesitas integrar?",
      description: "Enumera las plataformas, APIs y servicios con los que el sistema debe conectarse.",
      importance: "ALTA",
      icon: "🔗",
      context: "Las integraciones definen la complejidad técnica, los costes variables y los requisitos de seguridad del sistema.",
      examples: [
        "APIs de IA: OpenAI, Anthropic, Google AI",
        "Comunicación: Email, Slack, Telegram, WhatsApp",
        "Almacenamiento: Google Drive, Notion, bases de datos",
        "Desarrollo: GitHub, APIs de código, servicios cloud",
        "Datos: Scraping web, APIs públicas, bases de datos externas"
      ]
    },
    {
      id: 4,
      title: "¿Qué nivel de autonomía deben tener los agentes?",
      description: "Define si los agentes actúan solo con tu aprobación, de forma semi-autónoma, o completamente autónomos.",
      importance: "ALTA",
      icon: "🤖",
      context: "El nivel de autonomía afecta directamente a la arquitectura de seguridad, los costes (tokens consumidos) y los riesgos del sistema.",
      examples: [
        "Totalmente supervisado: yo apruebo cada acción",
        "Semi-autónomo: ejecuta tareas rutinarias, pide aprobación para las críticas",
        "Autónomo con límites: opera dentro de parámetros definidos, escala excepciones",
        "Autónomo completo: solo reporta resultados (requiere madurez del sistema)",
        "Mixto: diferentes niveles según el tipo de tarea o agente"
      ]
    },
    {
      id: 5,
      title: "¿Cuál es tu horizonte temporal y prioridad inmediata?",
      description: "Define qué necesitas que funcione primero y en qué plazo esperas tener un sistema operativo.",
      importance: "ALTA",
      icon: "⏱️",
      context: "Determina el alcance del MVP, las tecnologías iniciales y qué componentes pueden esperar a fases posteriores.",
      examples: [
        "MVP en 1-2 semanas: un agente que resuelva UN problema concreto",
        "Sistema básico en 1 mes: 2-3 agentes con integraciones esenciales",
        "Plataforma completa en 2-3 meses: ecosistema modular con supervisión",
        "Evolución progresiva: empezar mínimo y crecer según necesidades reales",
        "Exploración: probar diferentes enfoques antes de comprometerse con una arquitectura"
      ]
    }
  ];

  const handleAnswerChange = (questionId: number, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const sections = [
    { id: 'overview', label: 'Visión', icon: '📋' },
    { id: 'questions', label: 'Preguntas', icon: '❓' },
    { id: 'architecture', label: 'Arquitectura', icon: '🏗️' },
    { id: 'budget', label: 'Presupuesto', icon: '💰' },
    { id: 'roadmap', label: 'Hoja de Ruta', icon: '🗺️' },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-xl">
                🧠
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Sistema de IA — Fase 0</h1>
                <p className="text-xs text-gray-400">Visión, Estrategia y Arquitectura</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium">
                ⏳ En progreso
              </span>
              <span className="px-3 py-1 rounded-full bg-gray-800 text-gray-400 text-xs">
                Paso 0.1 de 0.7
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
                    ? 'bg-violet-500/10 text-violet-300 border border-violet-500/20'
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
        {activeSection === 'overview' && <OverviewSection />}
        {activeSection === 'questions' && (
          <QuestionsSection
            questions={questions}
            answers={answers}
            expandedQuestion={expandedQuestion}
            setExpandedQuestion={setExpandedQuestion}
            handleAnswerChange={handleAnswerChange}
          />
        )}
        {activeSection === 'architecture' && <ArchitectureSection />}
        {activeSection === 'budget' && <BudgetSection />}
        {activeSection === 'roadmap' && <RoadmapSection />}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              Fase 0 — No se avanza sin autorización explícita
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                Diseño en progreso
              </span>
              <span>Presupuesto máx: $100/mes</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function OverviewSection() {
  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 via-gray-900 to-violet-950 border border-gray-800 p-8 sm:p-12">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-violet-500/10 via-transparent to-transparent"></div>
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-medium mb-4">
            <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse"></span>
            FASE 0 — DEFINICIÓN
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ecosistema de Agentes de IA
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mb-6">
            Sistema modular, escalable, seguro y económicamente sostenible para automatizar tareas, 
            conectar herramientas externas, procesar información y ejecutar procesos bajo supervisión humana.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
              <div className="text-2xl mb-2">🎯</div>
              <h3 className="font-semibold text-white text-sm">Enfoque</h3>
              <p className="text-xs text-gray-400 mt-1">Agentes de IA + Automatizaciones + Integraciones</p>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
              <div className="text-2xl mb-2">💰</div>
              <h3 className="font-semibold text-white text-sm">Presupuesto</h3>
              <p className="text-xs text-gray-400 mt-1">&lt; $100 USD/mes — Máxima eficiencia</p>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
              <div className="text-2xl mb-2">🔒</div>
              <h3 className="font-semibold text-white text-sm">Seguridad</h3>
              <p className="text-xs text-gray-400 mt-1">Supervisión humana + Mínimo privilegio</p>
            </div>
          </div>
        </div>
      </div>

      {/* Context */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span>📌</span> Contexto Inicial
          </h3>
          <ul className="space-y-3">
            {[
              { label: "Nivel técnico", value: "Intermedio" },
              { label: "Presupuesto", value: "< $100 USD/mes" },
              { label: "Prioridad", value: "Eficiencia + Minimizar costes" },
              { label: "Infraestructura", value: "Pendiente de selección" },
              { label: "Estrategia", value: "Diseñar primero, desplegar después" },
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-2 shrink-0"></span>
                <div>
                  <span className="text-sm text-gray-400">{item.label}: </span>
                  <span className="text-sm text-white font-medium">{item.value}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span>📦</span> Resultados Obligatorios
          </h3>
          <ol className="space-y-2">
            {[
              "Documento de visión del proyecto",
              "Objetivos y casos de uso priorizados",
              "Diagrama de arquitectura propuesto",
              "Tecnologías recomendadas y justificación",
              "Diseño inicial de agentes y responsabilidades",
              "Modelo de seguridad",
              "Presupuesto estimado",
              "Hoja de ruta de implementación",
              "Riesgos y decisiones pendientes",
              "Lista de verificación para aprobar Fase 0",
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-sm">
                <span className="w-6 h-6 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-xs text-gray-400 shrink-0">
                  {i + 1}
                </span>
                <span className="text-gray-300">{item}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Rules */}
      <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-amber-300 mb-4 flex items-center gap-2">
          <span>⚠️</span> Reglas de Trabajo
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            "No avanzar sin autorización explícita",
            "No comprar ni desplegar servicios",
            "No asumir herramientas obligatorias",
            "No inventar integraciones ni capacidades",
            "Explicar decisiones técnicas con claridad",
            "Priorizar soluciones simples y seguras",
            "Mantener presupuesto como restricción",
            "Trabajar paso a paso, preguntar cuando falte info",
          ].map((rule, i) => (
            <div key={i} className="flex items-start gap-2 text-sm">
              <span className="text-amber-400 mt-0.5">•</span>
              <span className="text-gray-300">{rule}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function QuestionsSection({
  questions,
  answers,
  expandedQuestion,
  setExpandedQuestion,
  handleAnswerChange,
}: {
  questions: any[];
  answers: Record<number, string>;
  expandedQuestion: number | null;
  setExpandedQuestion: (id: number | null) => void;
  handleAnswerChange: (id: number, value: string) => void;
}) {
  const answeredCount = Object.keys(answers).filter(k => answers[Number(k)]?.trim()).length;

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-white">
            0.1 — Definición de Objetivos
          </h3>
          <span className="text-sm text-gray-400">
            {answeredCount} de {questions.length} respondidas
          </span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-violet-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(answeredCount / questions.length) * 100}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-400 mt-3">
          Responde estas preguntas estratégicas para que pueda diseñar la arquitectura del sistema. 
          No avances a la Fase 1 sin tus respuestas.
        </p>
      </div>

      {/* Questions */}
      <div className="space-y-4">
        {questions.map((question) => (
          <div
            key={question.id}
            className={`bg-gray-900 rounded-xl border transition-all duration-300 ${
              expandedQuestion === question.id
                ? 'border-violet-500/30 shadow-lg shadow-violet-500/5'
                : 'border-gray-800 hover:border-gray-700'
            }`}
          >
            <button
              onClick={() => setExpandedQuestion(expandedQuestion === question.id ? null : question.id)}
              className="w-full p-6 text-left"
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl">{question.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-white font-semibold">{question.title}</h4>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      question.importance === 'CRÍTICA'
                        ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {question.importance}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">{question.description}</p>
                </div>
                <span className={`text-gray-500 transition-transform duration-200 ${
                  expandedQuestion === question.id ? 'rotate-180' : ''
                }`}>
                  ▼
                </span>
              </div>
            </button>

            {expandedQuestion === question.id && (
              <div className="px-6 pb-6 border-t border-gray-800 pt-4">
                {/* Context */}
                <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-300">
                    <span className="font-medium text-violet-300">¿Por qué importa? </span>
                    {question.context}
                  </p>
                </div>

                {/* Examples */}
                <div className="mb-4">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                    Ejemplos de respuesta
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {question.examples.map((example: string, i: number) => (
                      <button
                        key={i}
                        onClick={() => handleAnswerChange(question.id, example)}
                        className={`text-left text-sm p-3 rounded-lg border transition-all ${
                          answers[question.id] === example
                            ? 'bg-violet-500/10 border-violet-500/30 text-violet-200'
                            : 'bg-gray-800/30 border-gray-700/50 text-gray-400 hover:border-gray-600 hover:text-gray-300'
                        }`}
                      >
                        {example}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Text answer */}
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 block">
                    O escribe tu propia respuesta
                  </label>
                  <textarea
                    value={answers[question.id] || ''}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    placeholder="Escribe tu respuesta aquí..."
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-3 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 resize-none"
                    rows={3}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summary */}
      {answeredCount > 0 && (
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            📝 Resumen de Respuestas
          </h3>
          <div className="space-y-3">
            {questions.map((q) => (
              answers[q.id]?.trim() ? (
                <div key={q.id} className="flex items-start gap-3 p-3 bg-gray-800/30 rounded-lg">
                  <span className="text-lg">{q.icon}</span>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">{q.title}</p>
                    <p className="text-sm text-gray-200">{answers[q.id]}</p>
                  </div>
                </div>
              ) : null
            ))}
          </div>
          {answeredCount === questions.length && (
            <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <p className="text-sm text-green-300 font-medium">
                ✅ Has respondido todas las preguntas. Estás listo para que diseñe la arquitectura del sistema.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ArchitectureSection() {
  const components = [
    { name: "Orquestador de Agentes", status: "pendiente", desc: "Coordina la comunicación entre agentes" },
    { name: "Modelos de Lenguaje (API)", status: "pendiente", desc: "OpenAI, Anthropic, o alternativas open-source" },
    { name: "Motor de Workflows", status: "pendiente", desc: "Automatización de procesos (n8n o similar)" },
    { name: "Memoria Persistente", status: "pendiente", desc: "PostgreSQL + vector store para contexto" },
    { name: "Sistema de Herramientas", status: "pendiente", desc: "APIs externas y funciones ejecutables" },
    { name: "Gestión de Credenciales", status: "pendiente", desc: "Vault o variables de entorno seguras" },
    { name: "Registro de Operaciones", status: "pendiente", desc: "Logs centralizados y auditables" },
    { name: "Supervisión Humana", status: "pendiente", desc: "Aprobaciones y panel de control" },
    { name: "Seguridad y Acceso", status: "pendiente", desc: "Auth, RBAC, encriptación" },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-white mb-2">
          0.2 — Diseño de Arquitectura
        </h3>
        <p className="text-sm text-gray-400 mb-6">
          Esta sección se completará tras recibir las respuestas de la Fase 0.1. 
          La arquitectura se diseñará según los casos de uso reales identificados.
        </p>

        {/* Architecture Diagram Placeholder */}
        <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-8 mb-6">
          <div className="text-center">
            <div className="text-4xl mb-4">🏗️</div>
            <h4 className="text-white font-medium mb-2">Diagrama de Arquitectura</h4>
            <p className="text-sm text-gray-400 max-w-md mx-auto">
              Se generará tras definir los objetivos. Incluirá la relación entre componentes, 
              flujos de datos y puntos de integración.
            </p>
          </div>
        </div>

        {/* Components Grid */}
        <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">
          Componentes previstos
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {components.map((comp, i) => (
            <div key={i} className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-white">{comp.name}</span>
                <span className="px-2 py-0.5 rounded text-xs bg-gray-700 text-gray-400">
                  {comp.status}
                </span>
              </div>
              <p className="text-xs text-gray-500">{comp.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Indispensable vs Optional */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h4 className="text-sm font-medium text-green-400 uppercase tracking-wider mb-3">
            ✅ Indispensables (MVP)
          </h4>
          <ul className="space-y-2">
            {["Orquestador básico", "Modelo de lenguaje (1 API)", "Almacenamiento persistente", "Gestión de credenciales", "Logs básicos"].map((item, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
            🔲 Opcionales (Fases posteriores)
          </h4>
          <ul className="space-y-2">
            {["Motor de workflows avanzado", "Vector store para RAG", "Múltiples modelos", "Dashboard de supervisión", "Sistema de alertas"].map((item, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-gray-400">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-600"></span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function BudgetSection() {
  const budgetItems = [
    { category: "Infraestructura", items: [
      { name: "VPS / Cloud (Hetzner, DigitalOcean)", min: 5, max: 20, type: "fijo" },
      { name: "Docker + gestión", min: 0, max: 0, type: "incluido" },
    ]},
    { category: "Modelos de IA", items: [
      { name: "OpenAI API (GPT-4o-mini / GPT-4o)", min: 5, max: 40, type: "variable" },
      { name: "Anthropic API (Claude)", min: 0, max: 20, type: "variable" },
      { name: "Modelos open-source (Ollama local)", min: 0, max: 0, type: "gratis" },
    ]},
    { category: "Almacenamiento", items: [
      { name: "PostgreSQL (hosting o self-hosted)", min: 0, max: 15, type: "fijo" },
      { name: "Almacenamiento de archivos", min: 0, max: 5, type: "fijo" },
    ]},
    { category: "Herramientas", items: [
      { name: "n8n (self-hosted)", min: 0, max: 0, type: "gratis" },
      { name: "Monitorización básica", min: 0, max: 5, type: "fijo" },
    ]},
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-white mb-2">
          0.6 — Presupuesto Estimado
        </h3>
        <p className="text-sm text-gray-400 mb-6">
          Estimación preliminar. Los costes reales dependerán del uso y las decisiones de la Fase 0.1.
        </p>

        {/* Budget Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4 text-center">
            <p className="text-xs text-green-400 uppercase tracking-wider mb-1">Escenario Mínimo</p>
            <p className="text-2xl font-bold text-green-300">~$10</p>
            <p className="text-xs text-gray-400">Uso básico, modelos económicos</p>
          </div>
          <div className="bg-violet-500/5 border border-violet-500/20 rounded-xl p-4 text-center">
            <p className="text-xs text-violet-400 uppercase tracking-wider mb-1">Escenario Medio</p>
            <p className="text-2xl font-bold text-violet-300">~$40</p>
            <p className="text-xs text-gray-400">Uso moderado, mix de modelos</p>
          </div>
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 text-center">
            <p className="text-xs text-amber-400 uppercase tracking-wider mb-1">Límite Máximo</p>
            <p className="text-2xl font-bold text-amber-300">$100</p>
            <p className="text-xs text-gray-400">Tope presupuestario</p>
          </div>
        </div>

        {/* Budget Breakdown */}
        <div className="space-y-4">
          {budgetItems.map((category, i) => (
            <div key={i}>
              <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-2">
                {category.category}
              </h4>
              <div className="space-y-2">
                {category.items.map((item, j) => (
                  <div key={j} className="flex items-center justify-between bg-gray-800/30 rounded-lg p-3 border border-gray-700/30">
                    <div className="flex items-center gap-3">
                      <span className={`w-2 h-2 rounded-full ${
                        item.type === 'gratis' ? 'bg-green-400' :
                        item.type === 'fijo' ? 'bg-blue-400' :
                        item.type === 'variable' ? 'bg-amber-400' : 'bg-gray-400'
                      }`}></span>
                      <span className="text-sm text-gray-300">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-400">
                        {item.min === item.max ? (item.min === 0 ? 'Gratis' : `$${item.min}`) : `$${item.min}-$${item.max}`}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        item.type === 'gratis' ? 'bg-green-500/10 text-green-400' :
                        item.type === 'fijo' ? 'bg-blue-500/10 text-blue-400' :
                        item.type === 'variable' ? 'bg-amber-500/10 text-amber-400' :
                        'bg-gray-700 text-gray-400'
                      }`}>
                        {item.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cost Optimization Tips */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h4 className="text-sm font-medium text-violet-400 uppercase tracking-wider mb-3">
          💡 Estrategias de Optimización
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            "Usar modelos pequeños para tareas simples (GPT-4o-mini)",
            "Self-hosting de n8n y PostgreSQL para eliminar costes fijos",
            "Cachear respuestas frecuentes para reducir llamadas a APIs",
            "Usar modelos open-source locales cuando sea posible",
            "Implementar límites de uso por agente y por día",
            "Monitorizar consumo en tiempo real para detectar anomalías",
          ].map((tip, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-gray-300 bg-gray-800/30 rounded-lg p-3">
              <span className="text-violet-400 shrink-0">→</span>
              <span>{tip}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RoadmapSection() {
  const phases = [
    {
      phase: "Fase 0",
      title: "Definición y Diseño",
      status: "actual",
      description: "Objetivos, arquitectura, tecnologías, seguridad y presupuesto",
      tasks: ["Definir objetivos", "Diseñar arquitectura", "Seleccionar tecnologías", "Planificar seguridad", "Estimar presupuesto"]
    },
    {
      phase: "Fase 1",
      title: "MVP — Primer Agente",
      status: "pendiente",
      description: "Un agente funcional que resuelva UN problema concreto",
      tasks: ["Configurar infraestructura base", "Implementar un agente simple", "Conectar 1-2 herramientas", "Validar funcionamiento"]
    },
    {
      phase: "Fase 2",
      title: "Expansión Controlada",
      status: "pendiente",
      description: "Añadir más agentes, memoria y automatizaciones",
      tasks: ["Sistema de memoria persistente", "Motor de workflows", "Segundo agente especializado", "Panel de supervisión básico"]
    },
    {
      phase: "Fase 3",
      title: "Optimización y Escalado",
      status: "pendiente",
      description: "Mejorar eficiencia, seguridad y capacidades",
      tasks: ["Optimización de costes", "Hardening de seguridad", "Métricas y monitorización", "Documentación completa"]
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-white mb-2">
          0.7 — Plan de Implementación
        </h3>
        <p className="text-sm text-gray-400 mb-6">
          Hoja de ruta provisional. Se ajustará según las decisiones de la Fase 0.1.
        </p>

        {/* Timeline */}
        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gray-800"></div>
          <div className="space-y-6">
            {phases.map((phase, i) => (
              <div key={i} className="relative pl-14">
                <div className={`absolute left-4 w-5 h-5 rounded-full border-2 ${
                  phase.status === 'actual'
                    ? 'bg-violet-500 border-violet-400 shadow-lg shadow-violet-500/30'
                    : 'bg-gray-800 border-gray-600'
                }`}></div>
                <div className={`rounded-xl border p-5 ${
                  phase.status === 'actual'
                    ? 'bg-violet-500/5 border-violet-500/20'
                    : 'bg-gray-800/30 border-gray-700/50'
                }`}>
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      phase.status === 'actual'
                        ? 'bg-violet-500/20 text-violet-300'
                        : 'bg-gray-700 text-gray-400'
                    }`}>
                      {phase.phase}
                    </span>
                    <h4 className={`font-semibold ${phase.status === 'actual' ? 'text-white' : 'text-gray-300'}`}>
                      {phase.title}
                    </h4>
                  </div>
                  <p className="text-sm text-gray-400 mb-3">{phase.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {phase.tasks.map((task, j) => (
                      <span key={j} className="px-2 py-1 rounded bg-gray-800/50 border border-gray-700/50 text-xs text-gray-400">
                        {task}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pending Decisions */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h4 className="text-sm font-medium text-amber-400 uppercase tracking-wider mb-3">
          ⏳ Decisiones Pendientes
        </h4>
        <div className="space-y-2">
          {[
            "Selección de proveedor cloud / VPS",
            "Elección de modelo de lenguaje principal",
            "Definición del primer caso de uso prioritario",
            "Nivel de autonomía inicial de los agentes",
            "Herramientas externas prioritarias",
          ].map((decision, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-amber-500/5 border border-amber-500/10 rounded-lg">
              <span className="w-4 h-4 rounded border border-amber-500/30 shrink-0"></span>
              <span className="text-sm text-gray-300">{decision}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Risks */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h4 className="text-sm font-medium text-red-400 uppercase tracking-wider mb-3">
          🚨 Riesgos Identificados
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { risk: "Costes inesperados de APIs", mitigation: "Límites de uso y monitorización" },
            { risk: "Complejidad prematura", mitigation: "MVP mínimo, iterar después" },
            { risk: "Fugas de datos sensibles", mitigation: "Encriptación + mínimo privilegio" },
            { risk: "Dependencia de un solo proveedor", mitigation: "Diseño modular, multi-modelo" },
          ].map((item, i) => (
            <div key={i} className="bg-red-500/5 border border-red-500/10 rounded-lg p-4">
              <p className="text-sm text-red-300 font-medium mb-1">{item.risk}</p>
              <p className="text-xs text-gray-400">Mitigación: {item.mitigation}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
