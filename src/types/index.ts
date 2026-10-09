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
  notes?: string;
  tags: string[];
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
  aiAnalysis?: AIAnalysis;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface AIAnalysis {
  identifiedService: string;
  extractedData: Record<string, string>;
  missingData: string[];
  facts: string[];
  inferences: string[];
  proposedAction: string;
  confidence: number;
  model: string;
  tokensUsed: number;
  costEstimate: number;
  analyzedAt: string;
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
  requestId: string;
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

// --- ESTADO GLOBAL ---

export interface AppState {
  companies: Company[];
  users: User[];
  currentSession: Session | null;
  clients: Client[];
  tariffs: Tariff[];
  requests: ServiceRequest[];
  budgets: Budget[];
  documents: Document[];
  tasks: DigitalEmployeeTask[];
  authorizations: Authorization[];
  auditLogs: AuditLog[];
  aiMetrics: AIMetric[];
  officialSources: OfficialSource[];
}

export const INITIAL_STATE: AppState = {
  companies: [],
  users: [],
  currentSession: null,
  clients: [],
  tariffs: [],
  requests: [],
  budgets: [],
  documents: [],
  tasks: [],
  authorizations: [],
  auditLogs: [],
  aiMetrics: [],
  officialSources: [],
};
