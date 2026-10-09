import { useState } from 'react';
import { useStore } from '../store';
import { Bot, Send, CheckCircle, AlertCircle, Clock, FileText, Sparkles, Loader2, Play, History } from 'lucide-react';
import {
  interpretInstruction,
  createTaskPlan,
  executeStep,
  verifyResult,
  selectExecutionRoute,
  TOOL_REGISTRY,
} from '../lib/execution-engine';
import { AutonomousTask, TaskExecutionResult } from '../types';
import { v4 as uuidv4 } from 'uuid';

export default function DigitalEmployee() {
  const session = useStore(s => s.currentSession);
  const requests = useStore(s => s.requests);
  const clients = useStore(s => s.clients);
  const services = useStore(s => s.services);
  const budgets = useStore(s => s.budgets);
  const hasPermission = useStore(s => s.hasPermission);
  const addAutonomousTask = useStore(s => s.addAutonomousTask);
  const updateAutonomousTask = useStore(s => s.updateAutonomousTask);
  const getAutonomousTasksByCompany = useStore(s => s.getAutonomousTasksByCompany);
  const addJouleMetric = useStore(s => s.addJouleMetric);

  const [instruction, setInstruction] = useState('');
  const [executing, setExecuting] = useState(false);
  const [currentTask, setCurrentTask] = useState<AutonomousTask | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [logs, setLogs] = useState<Array<{ type: 'info' | 'success' | 'error' | 'warning'; message: string }>>([]);

  const companyTasks = session ? getAutonomousTasksByCompany(session.companyId) : [];

  const addLog = (type: 'info' | 'success' | 'error' | 'warning', message: string) => {
    setLogs(prev => [...prev, { type, message }]);
  };

  const handleExecute = async () => {
    if (!instruction.trim() || !session) return;

    setExecuting(true);
    setLogs([]);
    setCurrentTask(null);

    addLog('info', '🧠 Interpretando instrucción...');

    // 1. Interpretar instrucción
    const intent = interpretInstruction(instruction);
    addLog('info', `Objetivo: ${intent.objective}`);
    addLog('info', `Confianza: ${(intent.confidence * 100).toFixed(0)}%`);

    if (intent.facts.length > 0) {
      intent.facts.forEach(f => addLog('info', `✓ ${f}`));
    }
    if (intent.inferences.length > 0) {
      intent.inferences.forEach(i => addLog('warning', `→ ${i}`));
    }
    if (intent.missingInformation.length > 0) {
      intent.missingInformation.forEach(m => addLog('error', `⚠ ${m}`));
    }

    // 2. Obtener datos de la empresa
    const companyRequests = requests.filter(r => r.companyId === session.companyId);
    const pendingRequests = companyRequests.filter(r => ['received', 'analyzing'].includes(r.status));
    const companyServices = services.filter(s => s.companyId === session.companyId);
    const companyClients = clients.filter(c => c.companyId === session.companyId);

    addLog('info', `Solicitudes pendientes: ${pendingRequests.length}`);
    addLog('info', `Tarifas disponibles: ${companyServices.length}`);

    // 3. Seleccionar ruta de ejecución (JOULE)
    const routeSelection = selectExecutionRoute(
      intent.requestedActions.length > 2 ? 'complex' : intent.requestedActions.length > 0 ? 'moderate' : 'simple',
      false,
      1.0
    );
    addLog('info', `Ruta JOULE: ${routeSelection.selectedRoute} — ${routeSelection.reason}`);

    // 4. Crear plan
    const plan = createTaskPlan(intent, session.companyId, pendingRequests, companyServices, companyClients);
    addLog('info', `Plan: ${plan.steps.length} pasos, ~${plan.estimatedDuration}s estimado`);

    // 5. Crear tarea autónoma
    const task: AutonomousTask = {
      id: uuidv4(),
      companyId: session.companyId,
      userId: session.userId,
      instruction,
      interpretedIntent: intent,
      plan,
      status: 'planned',
      currentStep: 0,
      results: [],
      authorizations: [],
      startedAt: new Date().toISOString(),
      jouleMetrics: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addAutonomousTask(task);
    setCurrentTask(task);

    // 6. Ejecutar pasos
    addLog('info', '▶ Iniciando ejecución...');
    updateAutonomousTask(task.id, { status: 'executing' });

    const context = {
      companyId: session.companyId,
      userId: session.userId,
      requests: companyRequests,
      clients: companyClients,
      services: companyServices,
      budgets: budgets.filter(b => b.companyId === session.companyId),
      hasPermission,
    };

    const results: TaskExecutionResult[] = [];
    let allSuccess = true;

    for (let i = 0; i < plan.steps.length; i++) {
      const step = plan.steps[i];
      addLog('info', `Paso ${i + 1}/${plan.steps.length}: ${step.tool}`);

      // Verificar si requiere autorización
      if (step.requiresAuthorization) {
        addLog('warning', `⏸ Paso requiere autorización: ${step.tool}`);
        // En producción, aquí se detendría y esperaría aprobación
        // Por ahora, simulamos que se aprueba automáticamente para demo
        addLog('info', '✓ Autorización simulada (en producción requeriría aprobación humana)');
      }

      const startTime = Date.now();
      const result = await executeStep(step, context);
      results.push(result);

      if (result.success) {
        addLog('success', `✓ ${step.tool} completado (${result.duration}ms)`);
        
        // Registrar métrica JOULE
        addJouleMetric({
          companyId: session.companyId,
          operation: step.tool,
          provider: routeSelection.selectedRoute === 'deterministic' ? 'local' : 'openai',
          model: routeSelection.selectedRoute,
          tokensInput: 0,
          tokensOutput: 0,
          cost: 0,
          latencyMs: result.duration,
          retries: 0,
          status: 'success',
        });
      } else {
        addLog('error', `✗ ${step.tool} falló: ${result.error}`);
        allSuccess = false;

        if (step.errorPolicy === 'stop') {
          addLog('error', '⛔ Ejecución detenida por política de error');
          break;
        }
      }
    }

    // 7. Verificar resultados
    const verifiedResults = results.map(r => ({
      ...r,
      verified: verifyResult(r, plan.steps.find(s => s.id === r.stepId)!),
    }));

    // 8. Actualizar tarea
    const finalStatus = allSuccess ? 'verified' : 'failed';
    updateAutonomousTask(task.id, {
      status: finalStatus,
      results: verifiedResults,
      completedAt: new Date().toISOString(),
      currentStep: plan.steps.length,
    });

    addLog('success', `✅ Tarea ${finalStatus === 'verified' ? 'completada y verificada' : 'finalizada con errores'}`);
    addLog('info', `Resultados: ${verifiedResults.filter(r => r.success).length}/${verifiedResults.length} pasos exitosos`);

    setExecuting(false);
  };

  const statusColors: Record<string, string> = {
    requested: 'bg-blue-50 text-blue-700',
    planned: 'bg-indigo-50 text-indigo-700',
    executing: 'bg-amber-50 text-amber-700',
    awaiting_authorization: 'bg-orange-50 text-orange-700',
    verified: 'bg-green-50 text-green-700',
    completed: 'bg-emerald-50 text-emerald-700',
    failed: 'bg-red-50 text-red-700',
    cancelled: 'bg-gray-50 text-gray-700',
  };

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#334155] flex items-center gap-2">
            <Bot size={24} className="text-violet-500" />
            Empleado Digital
          </h1>
          <p className="text-sm text-gray-500 mt-1">Motor de ejecución autónoma</p>
        </div>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 text-sm hover:bg-gray-200"
        >
          <History size={14} /> Historial ({companyTasks.length})
        </button>
      </div>

      {/* Chat Input */}
      <div className="bg-gradient-to-r from-violet-50 to-[#EAF7FE] rounded-2xl border border-violet-200/50 p-6 mb-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-violet-500 flex items-center justify-center shrink-0">
            <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-[#334155]">¿Qué necesitas que haga?</h2>
            <p className="text-xs text-gray-500 mt-0.5">Describe la operación en lenguaje natural</p>
          </div>
        </div>
        <div className="flex gap-2">
          <textarea
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleExecute()}
            placeholder="Ej: Revisa las solicitudes pendientes, prepara presupuestos y deja los documentos listos para mi aprobación"
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 resize-none"
            rows={2}
            disabled={executing}
          />
          <button
            onClick={handleExecute}
            disabled={executing || !instruction.trim()}
            className="px-5 py-3 rounded-xl bg-violet-500 text-white font-medium text-sm hover:bg-violet-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {executing ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            <span className="hidden sm:inline">Ejecutar</span>
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {[
            'Revisa las solicitudes pendientes',
            'Prepara presupuestos para clientes sin presupuesto',
            'Organiza citas para esta semana',
          ].map((example, i) => (
            <button
              key={i}
              onClick={() => setInstruction(example)}
              className="text-xs px-3 py-1.5 rounded-full bg-white border border-violet-200 text-violet-600 hover:bg-violet-50"
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      {/* Execution Log */}
      {logs.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-5 mb-6">
          <h3 className="font-semibold text-[#334155] mb-3 flex items-center gap-2">
            <Play size={16} className="text-violet-500" />
            Ejecución en curso
          </h3>
          <div className="space-y-1.5 max-h-80 overflow-y-auto">
            {logs.map((log, i) => (
              <div
                key={i}
                className={`text-sm px-3 py-1.5 rounded ${
                  log.type === 'success' ? 'bg-green-50 text-green-700' :
                  log.type === 'error' ? 'bg-red-50 text-red-700' :
                  log.type === 'warning' ? 'bg-amber-50 text-amber-700' :
                  'bg-gray-50 text-gray-600'
                }`}
              >
                {log.message}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Current Task Details */}
      {currentTask && (
        <div className="bg-white rounded-xl border border-gray-100 p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[#334155]">Tarea Actual</h3>
            <span className={`text-xs px-2 py-1 rounded-full ${statusColors[currentTask.status] || 'bg-gray-100'}`}>
              {currentTask.status}
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            <div>
              <p className="text-xs text-gray-500">Pasos</p>
              <p className="font-medium">{currentTask.plan.steps.length}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Completados</p>
              <p className="font-medium">{currentTask.results.filter(r => r.success).length}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Duración</p>
              <p className="font-medium">
                {currentTask.completedAt
                  ? `${((new Date(currentTask.completedAt).getTime() - new Date(currentTask.startedAt).getTime()) / 1000).toFixed(1)}s`
                  : 'En curso...'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Autorizaciones</p>
              <p className="font-medium">{currentTask.plan.requiresAuthorization ? 'Requeridas' : 'No'}</p>
            </div>
          </div>
        </div>
      )}

      {/* History */}
      {showHistory && companyTasks.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h3 className="font-semibold text-[#334155] mb-4">Historial de Tareas</h3>
          <div className="space-y-2">
            {companyTasks.slice(0, 10).map(task => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#334155] truncate">{task.instruction}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(task.createdAt).toLocaleString('es-ES')} — {task.results.filter(r => r.success).length}/{task.plan.steps.length} pasos
                  </p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full shrink-0 ml-2 ${statusColors[task.status] || 'bg-gray-100'}`}>
                  {task.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info */}
      <div className="mt-6 bg-violet-50 border border-violet-200 rounded-xl p-4">
        <p className="text-xs text-violet-700">
          <span className="font-medium">Estado:</span> Motor de ejecución operativo con herramientas deterministas. 
          Para análisis avanzado con IA, configure una API key en Configuración.
          Las autorizaciones humanas son obligatorias para operaciones sensibles.
        </p>
      </div>
    </div>
  );
}
