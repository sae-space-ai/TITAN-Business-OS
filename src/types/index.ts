// ============================================================
// TITAN BUSINESS OS — Modelos de Datos
// Etapa 1: Fundación
// ============================================================

// --- AUTENTICACIÓN Y EMPRESAS ---

export type Role = 'owner' | 'admin' | 'employee' | 'viewer';

export interface Company {
  id: string;
  name: string;
  commercialName: string;
  taxId: string; // NIF/CIF
  address: string;
  postalCode: string;
  city: string;
  province: string;
  country: string;
  email: string;
  phone: string;
  logo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  companyId: string;
  email: string;
  name: string;
  role: Role;
  passwordHash: string; // En producción: bcrypt. Aquí: hash simple para demo
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

export interface Session {
  userId: string;
  companyId: string;
  token: string;
  expiresAt: string;
  createdAt: string;
}

// --- PERMISOS ---

export type Permission =
  | 'requests.create'
  | 'requests.read'
  | 'requests.update'
  | 'requests.delete'
  | 'clients.create'
  | 'clients.read'
  | 'clients.update'
  | 'clients.delete'
  | 'budgets.create'
  | 'budgets.read'
  | 'budgets.update'
  | 'budgets.approve'
  | 'budgets.send'
  | 'invoices.create'
  | 'invoices.read'
  | 'documents.read'
  | 'documents.create'
  | 'reports.read'
  | 'company.settings'
  | 'company.users'
  | 'tariffs.manage'
  | 'digital_employee.execute'
  | 'authorizations.approve'
  | 'audit.read';

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  owner: [
    'requests.create', 'requests.read', 'requests.update', 'requests.delete',
    'clients.create', 'clients.read', 'clients.update', 'clients.delete',
    'budgets.create', 'budgets.read', 'budgets.update', 'budgets.approve', 'budgets.send',
    'invoices.create', 'invoices.read',
    'documents.read', 'documents.create',
    'reports.read',
    'company.settings', 'company.users',
    'tariffs.manage',
    'digital_employee.execute',
    'authorizations.approve',
    'audit.read',
  ],
  admin: [
    'requests.create', 'requests.read', 'requests.update',
    'clients.create', 'clients.read', 'clients.update',
    'budgets.create', 'budgets.read', 'budgets.update', 'budgets.approve',
    'invoices.read',
    'documents.read', 'documents.create',
    'reports.read',
    'company.users',
    'tariffs.manage',
    'digital_employee.execute',
    'audit.read',
  ],
  employee: [
    'requests.create', 'requests.read',
    'clients.read',
    'budgets.read',
    'documents.read',
  ],
  viewer: [
    'requests.read',
    'clients.read',
    'budgets.read',
    'documents.read',
    'reports.read',
  ],
};

// --- CLIENTES ---

export type ClientStatus = 'active' | 'archived';

export interface Client {
  id: string;
  companyId: string;
  name: string;
  taxId?: string;
  email?: string;
  phone?: string;
  address?: string;
  postalCode?: string;
  city?: string;
  contactPerson?: string;
  notes?: string;
  tags: string[];
  status: ClientStatus;
  isSynthetic: boolean; // Marcado si es dato de prueba
  createdAt: string;
  updatedAt: string;
}

// --- TARIFAS ---

export interface Tariff {
  id: string;
  companyId: string;
  name: string;
  description: string;
  unitPrice: number;
  unit: string; // 'hora', 'unidad', 'proyecto', 'mensual'
  category: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// --- SOLICITUDES ---

export type RequestChannel = 'web' | 'email' | 'phone' | 'in_person' | 'other';
export type RequestStatus = 'received' | 'analyzing' | 'analyzed' | 'budgeting' | 'budget_ready' | 'approved' | 'sent' | 'completed' | 'rejected' | 'cancelled';

export interface ServiceRequest {
  id: string;
  companyId: string;
  clientId?: string;
  channel: RequestChannel;
  description: string;
  rawInput: string; // Texto original del usuario
  status: RequestStatus;
  assignedTo?: string; // userId
  attachments: string[];
  aiAnalysis?: AIAnalysisResult;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

// --- PRESUPUESTOS ---

export type BudgetStatus = 'draft' | 'pending_approval' | 'approved' | 'rejected' | 'sent' | 'expired';

export interface BudgetLine {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number; // percentage
  subtotal: number;
  tariffId?: string;
}

export interface Budget {
  id: string;
  companyId: string;
  requestId?: string;
  clientId: string;
  number: string;
  version: number;
  status: BudgetStatus;
  lines: BudgetLine[];
  subtotal: number;
  discount: number;
  taxBase: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  currency: string;
  conditions: string;
  validityDays: number;
  notes?: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

// --- DOCUMENTOS ---

export type DocumentType = 'budget' | 'invoice' | 'report' | 'contract' | 'other';

export interface Document {
  id: string;
  companyId: string;
  type: DocumentType;
  name: string;
  referenceId: string; // budget.id, etc.
  format: 'pdf' | 'xlsx' | 'other';
  fileSize: number;
  storagePath: string;
  version: number;
  createdBy: string;
  createdAt: string;
}

// --- TAREAS DEL EMPLEADO DIGITAL ---

export type TaskStatus = 'REQUESTED' | 'PLANNED' | 'AWAITING_APPROVAL' | 'RUNNING' | 'VERIFIED' | 'FAILED' | 'CANCELLED' | 'REVERSED';

export interface DigitalEmployeeTask {
  id: string;
  companyId: string;
  requestId: string;
  status: TaskStatus;
  plan: TaskStep[];
  currentStep: number;
  result?: TaskResult;
  error?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskStep {
  id: string;
  order: number;
  action: string;
  tool: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  result?: string;
  startedAt?: string;
  completedAt?: string;
}

export interface TaskResult {
  summary: string;
  outputs: Record<string, string>;
  verifiedAt: string;
  verifiedBy: string;
}

// --- AUTORIZACIONES ---

export type AuthorizationStatus = 'pending' | 'approved' | 'rejected' | 'expired';

export interface Authorization {
  id: string;
  companyId: string;
  taskId: string;
  action: string;
  description: string;
  status: AuthorizationStatus;
  requestedBy: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  expiresAt: string;
  createdAt: string;
}

// --- AUDITORÍA ---

export interface AuditLog {
  id: string;
  companyId: string;
  userId: string;
  action: string;
  resource: string;
  resourceId: string;
  details: Record<string, unknown>;
  ipAddress?: string;
  timestamp: string;
}

// --- MÉTRICAS IA / JOULE ---

export interface AIMetric {
  id: string;
  companyId: string;
  taskId?: string;
  model: string;
  provider: string;
  tokensInput: number;
  tokensOutput: number;
  cost: number;
  latencyMs: number;
  retries: number;
  qualityScore?: number;
  createdAt: string;
}

// --- FUENTES OFICIALES ---

export interface OfficialSource {
  id: string;
  organism: string;
  url: string;
  reference: string;
  title: string;
  publishedAt: string;
  effectiveAt?: string;
  consultedAt: string;
  version: string;
  status: 'active' | 'repealed' | 'pending_review';
  validatedBy?: string;
  category: string;
}

// --- SERVICIOS (Catálogo mejorado) ---

export interface Service {
  id: string;
  companyId: string;
  name: string;
  description: string;
  defaultUnitPrice: number;
  unit: string;
  category: string;
  defaultTaxRate: number; // Por defecto 21, pero puede variar
  conditions?: string;
  isActive: boolean;
  validFrom?: string;
  validUntil?: string;
  createdAt: string;
  updatedAt: string;
}

// --- HISTORIAL DE APROBACIONES ---

export interface ApprovalHistoryEntry {
  id: string;
  companyId: string;
  budgetId: string;
  userId: string;
  userName: string;
  action: 'created' | 'modified' | 'submitted' | 'approved' | 'rejected' | 'requested_changes' | 'annulled' | 'versioned';
  fromStatus?: BudgetStatus;
  toStatus: BudgetStatus;
  version: number;
  notes?: string;
  timestamp: string;
}

// --- ANÁLISIS IA ---

export interface AIAnalysisResult {
  identifiedService: string;
  confidence: number;
  extractedData: {
    clientName?: string;
    serviceDescription?: string;
    estimatedQuantity?: number;
    estimatedUnit?: string;
    urgency?: string;
    specialConditions?: string;
  };
  missingData: string[];
  facts: string[];
  inferences: string[];
  contradictions: string[];
  proposedConcepts: Array<{
    description: string;
    suggestedServiceId?: string;
    suggestedQuantity?: number;
    suggestedUnit?: string;
  }>;
  proposedAction: string;
  model: string;
  tokensUsed: number;
  costEstimate: number;
  latencyMs: number;
  status: 'success' | 'error' | 'pending_integration' | 'schema_violation';
  errorMessage?: string;
  analyzedAt: string;
}

// --- CONFIGURACIÓN DE IA ---

export interface AIConfig {
  provider?: string;
  model?: string;
  apiKeyConfigured: boolean;
  maxCallsPerDay: number;
  maxTokensPerCall: number;
  timeoutMs: number;
  maxRetries: number;
}

// --- DOCUMENTOS GENERADOS ---

export type GeneratedDocumentType = 'budget_pdf' | 'budget_xlsx';

export interface GeneratedDocument {
  id: string;
  companyId: string;
  budgetId: string;
  type: GeneratedDocumentType;
  name: string;
  dataUrl: string; // Base64 data URL para descarga
  fileSize: number;
  version: number;
  checksum: string; // Hash para verificar integridad
  createdBy: string;
  createdAt: string;
}

// --- MÉTRICAS JOULE ---

export interface JouleMetric {
  id: string;
  companyId: string;
  taskId?: string;
  requestId?: string;
  operation: string;
  provider: string;
  model: string;
  tokensInput: number;
  tokensOutput: number;
  cost: number;
  latencyMs: number;
  retries: number;
  status: 'success' | 'error' | 'timeout' | 'rate_limited';
  qualityScore?: number;
  createdAt: string;
}

// --- AGENDA ---

export type EventStatus = 'scheduled' | 'confirmed' | 'cancelled' | 'completed';

export interface CalendarEvent {
  id: string;
  companyId: string;
  title: string;
  description?: string;
  clientId?: string;
  requestId?: string;
  startDate: string;
  endDate: string;
  location?: string;
  status: EventStatus;
  reminder?: number; // minutos antes
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// --- COBROS ---

export type PaymentStatus = 'pending' | 'partial' | 'paid' | 'overdue' | 'cancelled';

export interface Payment {
  id: string;
  companyId: string;
  budgetId?: string;
  invoiceId?: string;
  clientId: string;
  amount: number;
  paidAmount: number;
  dueDate: string;
  status: PaymentStatus;
  paymentDate?: string;
  paymentMethod?: string;
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// --- FACTURAS ---

export type InvoiceStatus = 'draft' | 'issued' | 'sent' | 'paid' | 'overdue' | 'cancelled' | 'rectificative';

export interface Invoice {
  id: string;
  companyId: string;
  number: string;
  series: string;
  clientId: string;
  budgetId?: string;
  issueDate: string;
  dueDate: string;
  lines: BudgetLine[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  status: InvoiceStatus;
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// --- CORREO ---

export type EmailStatus = 'draft' | 'sent' | 'received' | 'failed';

export interface Email {
  id: string;
  companyId: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  status: EmailStatus;
  clientId?: string;
  requestId?: string;
  sentAt?: string;
  receivedAt?: string;
  createdBy: string;
  createdAt: string;
}

// --- MARKETING ---

export type CampaignStatus = 'draft' | 'scheduled' | 'active' | 'completed' | 'cancelled';

export interface Campaign {
  id: string;
  companyId: string;
  name: string;
  description?: string;
  type: 'email' | 'social' | 'promotion';
  status: CampaignStatus;
  startDate: string;
  endDate?: string;
  targetClients: string[];
  message?: string;
  results?: {
    sent: number;
    opened: number;
    responded: number;
  };
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// --- AUTORIZACIONES (mejorado) ---

export interface AuthorizationRequest {
  id: string;
  companyId: string;
  type: 'budget_approval' | 'invoice_emission' | 'email_send' | 'payment' | 'automation' | 'other';
  title: string;
  description: string;
  requestData: Record<string, any>;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  requestedBy: string;
  requestedByName: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  expiresAt: string;
  createdAt: string;
}

// --- MOTOR DE EJECUCIÓN AUTÓNOMA ---

export type TaskExecutionStatus = 
  | 'requested'
  | 'planned'
  | 'validated'
  | 'executing'
  | 'awaiting_authorization'
  | 'completed'
  | 'verified'
  | 'failed'
  | 'cancelled';

export interface AutonomousTask {
  id: string;
  companyId: string;
  userId: string;
  instruction: string;
  interpretedIntent?: InterpretedIntent;
  plan: TaskPlan;
  status: TaskExecutionStatus;
  currentStep: number;
  results: TaskExecutionResult[];
  authorizations: string[]; // IDs de AuthorizationRequest
  startedAt: string;
  completedAt?: string;
  error?: string;
  jouleMetrics: string[]; // IDs de métricas JOULE
  createdAt: string;
  updatedAt: string;
}

export interface InterpretedIntent {
  objective: string;
  entities: string[];
  dates: string[];
  constraints: string[];
  requestedActions: string[];
  missingInformation: string[];
  confidence: number;
  facts: string[];
  inferences: string[];
}

export interface TaskPlan {
  steps: ExecutionStep[];
  estimatedDuration: number; // segundos
  estimatedCost: number;
  requiredPermissions: Permission[];
  requiresAuthorization: boolean;
}

export interface ExecutionStep {
  id: string;
  order: number;
  tool: string;
  parameters: Record<string, any>;
  dependencies: string[]; // IDs de otros pasos
  requiredPermissions: Permission[];
  requiresAuthorization: boolean;
  successCondition: string;
  errorPolicy: 'stop' | 'retry' | 'skip';
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped' | 'awaiting_auth';
  result?: any;
  error?: string;
  startedAt?: string;
  completedAt?: string;
  authorizationId?: string;
}

export interface TaskExecutionResult {
  stepId: string;
  tool: string;
  success: boolean;
  data?: any;
  error?: string;
  executedAt: string;
  duration: number;
  verified: boolean;
}

// --- HERRAMIENTAS DEL EMPLEADO DIGITAL ---

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: Record<string, { type: string; required: boolean; description: string }>;
  requiresAuthorization: boolean;
  permissions: Permission[];
}

// --- RUTAS DE EJECUCIÓN JOULE ---

export type ExecutionRoute = 'deterministic' | 'small_model' | 'advanced_model' | 'hybrid';

export interface RouteDefinition {
  id: ExecutionRoute;
  name: string;
  description: string;
  provider: string;
  model: string;
  estimatedCost: number;
  estimatedLatency: number;
  qualityScore: number;
  privacyLevel: 'high' | 'medium' | 'low';
  enabled: boolean;
}

export interface RouteSelection {
  taskId: string;
  selectedRoute: ExecutionRoute;
  reason: string;
  alternatives: Array<{
    route: ExecutionRoute;
    cost: number;
    latency: number;
    quality: number;
    reason: string;
  }>;
  selectedAt: string;
}

// --- ESTADO GLOBAL ---

export interface AppState {
  companies: Company[];
  users: User[];
  currentSession: Session | null;
  clients: Client[];
  tariffs: Tariff[];
  services: Service[];
  requests: ServiceRequest[];
  budgets: Budget[];
  approvalHistory: ApprovalHistoryEntry[];
  documents: Document[];
  generatedDocuments: GeneratedDocument[];
  tasks: DigitalEmployeeTask[];
  authorizations: Authorization[];
  authorizationRequests: AuthorizationRequest[];
  auditLogs: AuditLog[];
  aiMetrics: AIMetric[];
  jouleMetrics: JouleMetric[];
  officialSources: OfficialSource[];
  aiConfig: AIConfig;
  events: CalendarEvent[];
  payments: Payment[];
  invoices: Invoice[];
  emails: Email[];
  campaigns: Campaign[];
  autonomousTasks: AutonomousTask[];
}

export const INITIAL_STATE: AppState = {
  companies: [],
  users: [],
  currentSession: null,
  clients: [],
  tariffs: [],
  services: [],
  requests: [],
  budgets: [],
  approvalHistory: [],
  documents: [],
  generatedDocuments: [],
  tasks: [],
  authorizations: [],
  authorizationRequests: [],
  auditLogs: [],
  aiMetrics: [],
  jouleMetrics: [],
  officialSources: [],
  aiConfig: {
    apiKeyConfigured: false,
    maxCallsPerDay: 100,
    maxTokensPerCall: 4000,
    timeoutMs: 30000,
    maxRetries: 2,
  },
  events: [],
  payments: [],
  invoices: [],
  emails: [],
  campaigns: [],
  autonomousTasks: [],
};
