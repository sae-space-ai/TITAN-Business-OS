/**
 * TITAN Business OS — Motor de Ejecución Autónoma
 * 
 * INSTRUCCIÓN → INTERPRETACIÓN → PLAN → VALIDACIÓN → EJECUCIÓN → 
 * AUTORIZACIÓN → VERIFICACIÓN → RESULTADO
 */

import { v4 as uuidv4 } from 'uuid';
import {
  AutonomousTask,
  InterpretedIntent,
  TaskPlan,
  ExecutionStep,
  TaskExecutionResult,
  ExecutionRoute,
  RouteDefinition,
  RouteSelection,
  ServiceRequest,
  Client,
  Budget,
  BudgetLine,
  Service,
  Permission,
} from '../types';
import { calculateLineSubtotal, calculateBudgetTotals } from './calculations';

// ============================================================
// REGISTRO DE HERRAMIENTAS
// ============================================================

export const TOOL_REGISTRY = {
  'list_pending_requests': {
    name: 'list_pending_requests',
    description: 'Lista solicitudes pendientes de la empresa',
    parameters: { status: { type: 'string', required: false, description: 'Filtrar por estado' } },
    requiresAuthorization: false,
    permissions: ['requests.read'] as Permission[],
  },
  'get_client': {
    name: 'get_client',
    description: 'Obtiene datos de un cliente',
    parameters: { clientId: { type: 'string', required: true, description: 'ID del cliente' } },
    requiresAuthorization: false,
    permissions: ['clients.read'] as Permission[],
  },
  'list_clients': {
    name: 'list_clients',
    description: 'Lista todos los clientes',
    parameters: {},
    requiresAuthorization: false,
    permissions: ['clients.read'] as Permission[],
  },
  'get_tariffs': {
    name: 'get_tariffs',
    description: 'Lista tarifas de la empresa',
    parameters: {},
    requiresAuthorization: false,
    permissions: ['tariffs.manage'] as Permission[],
  },
  'create_budget_draft': {
    name: 'create_budget_draft',
    description: 'Crea un borrador de presupuesto',
    parameters: {
      clientId: { type: 'string', required: true, description: 'ID del cliente' },
      lines: { type: 'array', required: true, description: 'Líneas del presupuesto' },
      taxRate: { type: 'number', required: false, description: 'Tipo IVA' },
    },
    requiresAuthorization: true,
    permissions: ['budgets.create'] as Permission[],
  },
  'check_agenda': {
    name: 'check_agenda',
    description: 'Consulta disponibilidad en agenda',
    parameters: { date: { type: 'string', required: false, description: 'Fecha a consultar' } },
    requiresAuthorization: false,
    permissions: [] as Permission[],
  },
  'request_approval': {
    name: 'request_approval',
    description: 'Solicita aprobación para una acción',
    parameters: {
      title: { type: 'string', required: true, description: 'Título de la solicitud' },
      description: { type: 'string', required: true, description: 'Descripción' },
    },
    requiresAuthorization: true,
    permissions: ['authorizations.approve'] as Permission[],
  },
  'get_request_details': {
    name: 'get_request_details',
    description: 'Obtiene detalles de una solicitud',
    parameters: { requestId: { type: 'string', required: true, description: 'ID de la solicitud' } },
    requiresAuthorization: false,
    permissions: ['requests.read'] as Permission[],
  },
};

// ============================================================
// RUTAS DE EJECUCIÓN (JOULE)
// ============================================================

export const ROUTE_DEFINITIONS: RouteDefinition[] = [
  {
    id: 'deterministic',
    name: 'Motor Determinista',
    description: 'Cálculos sin IA, máximo rendimiento',
    provider: 'local',
    model: 'deterministic-engine',
    estimatedCost: 0,
    estimatedLatency: 50,
    qualityScore: 1.0,
    privacyLevel: 'high',
    enabled: true,
  },
  {
    id: 'small_model',
    name: 'Modelo Ligero',
    description: 'GPT-4o-mini para tareas simples',
    provider: 'openai',
    model: 'gpt-4o-mini',
    estimatedCost: 0.001,
    estimatedLatency: 1500,
    qualityScore: 0.7,
    privacyLevel: 'medium',
    enabled: false, // Requiere API key
  },
  {
    id: 'advanced_model',
    name: 'Modelo Avanzado',
    description: 'GPT-4o para tareas complejas',
    provider: 'openai',
    model: 'gpt-4o',
    estimatedCost: 0.01,
    estimatedLatency: 5000,
    qualityScore: 0.95,
    privacyLevel: 'medium',
    enabled: false, // Requiere API key
  },
  {
    id: 'hybrid',
    name: 'Híbrido',
    description: 'Determinista + modelo ligero',
    provider: 'local+openai',
    model: 'hybrid-engine',
    estimatedCost: 0.001,
    estimatedLatency: 2000,
    qualityScore: 0.85,
    privacyLevel: 'medium',
    enabled: false,
  },
];

// ============================================================
// INTENT INTERPRETER
// ============================================================

export function interpretInstruction(instruction: string): InterpretedIntent {
  const lower = instruction.toLowerCase();
  const facts: string[] = [];
  const inferences: string[] = [];
  const entities: string[] = [];
  const dates: string[] = [];
  const constraints: string[] = [];
  const requestedActions: string[] = [];
  const missingInformation: string[] = [];

  // Detectar acciones solicitadas
  if (lower.includes('revisa') || lower.includes('revisar')) {
    requestedActions.push('review_requests');
    facts.push('El usuario solicita revisar solicitudes');
  }
  if (lower.includes('presupuesto') || lower.includes('presupuestos')) {
    requestedActions.push('create_budgets');
    facts.push('El usuario solicita preparar presupuestos');
  }
  if (lower.includes('cita') || lower.includes('agend') || lower.includes('organiza')) {
    requestedActions.push('schedule_appointments');
    facts.push('El usuario solicita organizar citas');
  }
  if (lower.includes('documento') || lower.includes('documentos') || lower.includes('pdf')) {
    requestedActions.push('prepare_documents');
    facts.push('El usuario solicita preparar documentos');
  }
  if (lower.includes('aprobación') || lower.includes('aprobar') || lower.includes('aprob')) {
    requestedActions.push('request_approvals');
    constraints.push('Requiere aprobación humana');
  }
  if (lower.includes('pendiente')) {
    constraints.push('Solo elementos pendientes');
    facts.push('Filtrar por estado pendiente');
  }

  // Detectar entidades
  if (lower.includes('cliente')) entities.push('cliente');
  if (lower.includes('solicitud')) entities.push('solicitud');
  if (lower.includes('factura')) entities.push('factura');

  // Detectar fechas
  const datePatterns = ['hoy', 'mañana', 'esta semana', 'próxima semana', 'este mes'];
  datePatterns.forEach(pattern => {
    if (lower.includes(pattern)) dates.push(pattern);
  });

  // Detectar información faltante
  if (requestedActions.includes('create_budgets') && !lower.includes('cliente')) {
    missingInformation.push('No se especifica qué cliente');
  }
  if (requestedActions.includes('schedule_appointments') && dates.length === 0) {
    missingInformation.push('No se especifica fecha para la cita');
  }

  // Inferencias
  if (requestedActions.length > 1) {
    inferences.push('Operación multi-paso que requiere coordinación entre módulos');
  }
  if (requestedActions.includes('create_budgets')) {
    inferences.push('Se necesitarán tarifas de la empresa para calcular importes');
  }

  const confidence = requestedActions.length > 0 ? 0.8 : 0.3;

  return {
    objective: extractObjective(instruction),
    entities,
    dates,
    constraints,
    requestedActions,
    missingInformation,
    confidence,
    facts,
    inferences,
  };
}

function extractObjective(instruction: string): string {
  const lower = instruction.toLowerCase();
  if (lower.includes('revisa') && lower.includes('presupuesto')) {
    return 'Revisar solicitudes pendientes y preparar presupuestos';
  }
  if (lower.includes('prepara') || lower.includes('crear')) {
    return 'Preparar documentos y operaciones solicitadas';
  }
  return instruction.substring(0, 100);
}

// ============================================================
// TASK PLANNER
// ============================================================

export function createTaskPlan(
  intent: InterpretedIntent,
  companyId: string,
  pendingRequests: ServiceRequest[],
  services: Service[],
  clients: Client[]
): TaskPlan {
  const steps: ExecutionStep[] = [];
  let order = 0;
  const requiredPermissions: Permission[] = [];

  // Paso 1: Listar solicitudes pendientes
  if (intent.requestedActions.includes('review_requests')) {
    steps.push({
      id: uuidv4(),
      order: order++,
      tool: 'list_pending_requests',
      parameters: { status: 'received' },
      dependencies: [],
      requiredPermissions: ['requests.read'],
      requiresAuthorization: false,
      successCondition: 'Lista de solicitudes obtenida',
      errorPolicy: 'stop',
      status: 'pending',
    });
    requiredPermissions.push('requests.read');
  }

  // Paso 2: Para cada solicitud, analizar y crear presupuesto
  if (intent.requestedActions.includes('create_budgets')) {
    steps.push({
      id: uuidv4(),
      order: order++,
      tool: 'get_tariffs',
      parameters: {},
      dependencies: [],
      requiredPermissions: ['tariffs.manage'],
      requiresAuthorization: false,
      successCondition: 'Tarifas obtenidas',
      errorPolicy: 'stop',
      status: 'pending',
    });

    // Crear presupuestos (uno por solicitud pendiente)
    pendingRequests.forEach((req, idx) => {
      steps.push({
        id: uuidv4(),
        order: order++,
        tool: 'create_budget_draft',
        parameters: {
          requestId: req.id,
          clientId: req.clientId,
          useTariffs: true,
        },
        dependencies: [steps[steps.length - 1]?.id || ''],
        requiredPermissions: ['budgets.create'],
        requiresAuthorization: true,
        successCondition: 'Borrador de presupuesto creado',
        errorPolicy: 'skip',
        status: 'pending',
      });
    });

    requiredPermissions.push('budgets.create', 'tariffs.manage');
  }

  // Paso 3: Consultar agenda
  if (intent.requestedActions.includes('schedule_appointments')) {
    steps.push({
      id: uuidv4(),
      order: order++,
      tool: 'check_agenda',
      parameters: { date: intent.dates[0] || 'today' },
      dependencies: [],
      requiredPermissions: [],
      requiresAuthorization: false,
      successCondition: 'Disponibilidad consultada',
      errorPolicy: 'skip',
      status: 'pending',
    });
  }

  // Paso 4: Solicitar aprobación
  if (intent.requestedActions.includes('request_approvals')) {
    steps.push({
      id: uuidv4(),
      order: order++,
      tool: 'request_approval',
      parameters: {
        title: 'Aprobación de presupuestos preparados',
        description: `${pendingRequests.length} presupuestos listos para revisión`,
      },
      dependencies: steps.filter(s => s.tool === 'create_budget_draft').map(s => s.id),
      requiredPermissions: ['authorizations.approve'],
      requiresAuthorization: true,
      successCondition: 'Solicitud de aprobación creada',
      errorPolicy: 'stop',
      status: 'pending',
    });
    requiredPermissions.push('authorizations.approve');
  }

  return {
    steps,
    estimatedDuration: steps.length * 2, // 2 segundos por paso estimado
    estimatedCost: 0, // Motor determinista
    requiredPermissions: [...new Set(requiredPermissions)],
    requiresAuthorization: steps.some(s => s.requiresAuthorization),
  };
}

// ============================================================
// ROUTE SELECTOR (JOULE NIVEL 3)
// ============================================================

export function selectExecutionRoute(
  taskComplexity: 'simple' | 'moderate' | 'complex',
  privacyRequired: boolean,
  budgetLimit: number
): RouteSelection {
  const availableRoutes = ROUTE_DEFINITIONS.filter(r => r.enabled);
  
  // Si no hay rutas de IA configuradas, usar determinista
  if (availableRoutes.length === 0 || availableRoutes.every(r => r.id === 'deterministic')) {
    return {
      taskId: '',
      selectedRoute: 'deterministic',
      reason: 'Única ruta disponible. Configure API de IA para habilitar optimización.',
      alternatives: ROUTE_DEFINITIONS.filter(r => r.id !== 'deterministic').map(r => ({
        route: r.id,
        cost: r.estimatedCost,
        latency: r.estimatedLatency,
        quality: r.qualityScore,
        reason: `Requiere API key de ${r.provider}`,
      })),
      selectedAt: new Date().toISOString(),
    };
  }

  // Si privacidad alta, solo determinista
  if (privacyRequired) {
    return {
      taskId: '',
      selectedRoute: 'deterministic',
      reason: 'Privacidad requerida: solo motor local',
      alternatives: [],
      selectedAt: new Date().toISOString(),
    };
  }

  // Seleccionar según complejidad
  let selected: ExecutionRoute = 'deterministic';
  let reason = '';

  if (taskComplexity === 'simple') {
    selected = 'deterministic';
    reason = 'Tarea simple: motor determinista es suficiente y más rápido';
  } else if (taskComplexity === 'moderate') {
    const smallModel = availableRoutes.find(r => r.id === 'small_model');
    if (smallModel && smallModel.estimatedCost <= budgetLimit) {
      selected = 'small_model';
      reason = 'Tarea moderada: modelo ligero ofrece mejor relación calidad/coste';
    } else {
      selected = 'deterministic';
      reason = 'Modelo ligero no disponible o excede presupuesto';
    }
  } else {
    const advanced = availableRoutes.find(r => r.id === 'advanced_model');
    if (advanced && advanced.estimatedCost <= budgetLimit) {
      selected = 'advanced_model';
      reason = 'Tarea compleja: modelo avanzado necesario';
    } else {
      selected = 'deterministic';
      reason = 'Modelo avanzado no disponible o excede presupuesto';
    }
  }

  return {
    taskId: '',
    selectedRoute: selected,
    reason,
    alternatives: availableRoutes.filter(r => r.id !== selected).map(r => ({
      route: r.id,
      cost: r.estimatedCost,
      latency: r.estimatedLatency,
      quality: r.qualityScore,
      reason: r.description,
    })),
    selectedAt: new Date().toISOString(),
  };
}

// ============================================================
// TASK EXECUTOR
// ============================================================

export interface ExecutionContext {
  companyId: string;
  userId: string;
  requests: ServiceRequest[];
  clients: Client[];
  services: Service[];
  budgets: Budget[];
  hasPermission: (permission: Permission) => boolean;
}

export async function executeStep(
  step: ExecutionStep,
  context: ExecutionContext
): Promise<TaskExecutionResult> {
  const startTime = Date.now();

  // Verificar permisos
  for (const perm of step.requiredPermissions) {
    if (!context.hasPermission(perm)) {
      return {
        stepId: step.id,
        tool: step.tool,
        success: false,
        error: `Permiso insuficiente: ${perm}`,
        executedAt: new Date().toISOString(),
        duration: Date.now() - startTime,
        verified: false,
      };
    }
  }

  try {
    let data: any;

    switch (step.tool) {
      case 'list_pending_requests':
        data = context.requests.filter(r => 
          r.companyId === context.companyId && 
          ['received', 'analyzing'].includes(r.status)
        );
        break;

      case 'get_tariffs':
        data = context.services.filter(s => s.companyId === context.companyId && s.isActive);
        break;

      case 'list_clients':
        data = context.clients.filter(c => c.companyId === context.companyId);
        break;

      case 'get_request_details':
        data = context.requests.find(r => r.id === step.parameters.requestId);
        if (!data) throw new Error('Solicitud no encontrada');
        break;

      case 'check_agenda':
        data = { available: true, message: 'Agenda consultada (sin integración externa)' };
        break;

      case 'create_budget_draft':
        // Crear borrador usando tarifas reales
        const request = context.requests.find(r => r.id === step.parameters.requestId);
        if (!request) throw new Error('Solicitud no encontrada');
        
        const tariffs = context.services.filter(s => s.companyId === context.companyId && s.isActive);
        if (tariffs.length === 0) throw new Error('No hay tarifas configuradas');

        const lines: BudgetLine[] = tariffs.slice(0, 2).map(t => ({
          id: uuidv4(),
          description: t.name,
          quantity: 1,
          unitPrice: t.defaultUnitPrice,
          discount: 0,
          subtotal: calculateLineSubtotal(1, t.defaultUnitPrice, 0),
          tariffId: t.id,
        }));

        const totals = calculateBudgetTotals(lines, 0, 21);
        data = {
          lines,
          ...totals,
          requestId: request.id,
          clientId: request.clientId,
        };
        break;

      case 'request_approval':
        data = {
          authorizationId: uuidv4(),
          title: step.parameters.title,
          status: 'pending',
        };
        break;

      default:
        throw new Error(`Herramienta desconocida: ${step.tool}`);
    }

    return {
      stepId: step.id,
      tool: step.tool,
      success: true,
      data,
      executedAt: new Date().toISOString(),
      duration: Date.now() - startTime,
      verified: true,
    };
  } catch (error) {
    return {
      stepId: step.id,
      tool: step.tool,
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
      executedAt: new Date().toISOString(),
      duration: Date.now() - startTime,
      verified: false,
    };
  }
}

// ============================================================
// RESULT VERIFIER
// ============================================================

export function verifyResult(result: TaskExecutionResult, step: ExecutionStep): boolean {
  if (!result.success) return false;
  if (!result.data && step.successCondition !== 'Lista vacía permitida') return false;
  return true;
}
