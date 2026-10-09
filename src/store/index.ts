import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import {
  AppState,
  INITIAL_STATE,
  Company,
  User,
  Session,
  Client,
  Tariff,
  Service,
  ServiceRequest,
  Budget,
  BudgetLine,
  ApprovalHistoryEntry,
  GeneratedDocument,
  JouleMetric,
  AIAnalysisResult,
  AIConfig,
  AuditLog,
  Role,
  ROLE_PERMISSIONS,
  Permission,
} from '../types';

// --- Hash simple para demo (en producción: bcrypt) ---
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

interface TitanStore extends AppState {
  // Auth
  registerCompany: (company: Omit<Company, 'id' | 'createdAt' | 'updatedAt'>, ownerEmail: string, ownerName: string, password: string) => { success: boolean; error?: string };
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  getCurrentUser: () => User | null;
  getCurrentCompany: () => Company | null;
  hasPermission: (permission: Permission) => boolean;

  // Clients
  addClient: (client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateClient: (id: string, data: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  archiveClient: (id: string) => void;
  getClientsByCompany: (companyId: string) => Client[];

  // Tariffs
  addTariff: (tariff: Omit<Tariff, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTariff: (id: string, data: Partial<Tariff>) => void;
  getTariffsByCompany: (companyId: string) => Tariff[];

  // Services
  addService: (service: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateService: (id: string, data: Partial<Service>) => void;
  getServicesByCompany: (companyId: string) => Service[];

  // Requests
  addRequest: (request: Omit<ServiceRequest, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateRequest: (id: string, data: Partial<ServiceRequest>) => void;
  updateRequestAnalysis: (requestId: string, analysis: AIAnalysisResult) => void;
  getRequestsByCompany: (companyId: string) => ServiceRequest[];

  // Budgets
  addBudget: (budget: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateBudget: (id: string, data: Partial<Budget>) => void;
  getBudgetsByCompany: (companyId: string) => Budget[];

  // AI Config
  updateAIConfig: (config: Partial<AIConfig>) => void;

  // Approval History
  addApprovalHistory: (entry: Omit<ApprovalHistoryEntry, 'id' | 'timestamp'>) => void;
  getApprovalHistoryByBudget: (budgetId: string) => ApprovalHistoryEntry[];

  // Generated Documents
  addGeneratedDocument: (doc: Omit<GeneratedDocument, 'id' | 'createdAt'>) => void;
  getDocumentsByBudget: (budgetId: string) => GeneratedDocument[];

  // JOULE Metrics
  addJouleMetric: (metric: Omit<JouleMetric, 'id' | 'createdAt'>) => void;
  getJouleMetricsByCompany: (companyId: string) => JouleMetric[];

  // Audit
  addAuditLog: (log: Omit<AuditLog, 'id' | 'timestamp'>) => void;
  getAuditLogsByCompany: (companyId: string) => AuditLog[];
}

export const useStore = create<TitanStore>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      // --- AUTH ---
      registerCompany: (companyData, ownerEmail, ownerName, password) => {
        const existingUser = get().users.find(u => u.email === ownerEmail);
        if (existingUser) {
          return { success: false, error: 'Ya existe un usuario con ese email' };
        }

        const now = new Date().toISOString();
        const companyId = uuidv4();
        const userId = uuidv4();

        const company: Company = {
          ...companyData,
          id: companyId,
          createdAt: now,
          updatedAt: now,
        };

        const user: User = {
          id: userId,
          companyId,
          email: ownerEmail,
          name: ownerName,
          role: 'owner',
          passwordHash: simpleHash(password),
          isActive: true,
          createdAt: now,
        };

        set(state => ({
          companies: [...state.companies, company],
          users: [...state.users, user],
        }));

        get().addAuditLog({
          companyId,
          userId,
          action: 'company.created',
          resource: 'company',
          resourceId: companyId,
          details: { name: company.name },
        });

        return { success: true };
      },

      login: (email, password) => {
        const user = get().users.find(u => u.email === email);
        if (!user) {
          return { success: false, error: 'Usuario no encontrado' };
        }
        if (!user.isActive) {
          return { success: false, error: 'Cuenta desactivada' };
        }
        if (user.passwordHash !== simpleHash(password)) {
          return { success: false, error: 'Contraseña incorrecta' };
        }

        const now = new Date().toISOString();
        const session: Session = {
          userId: user.id,
          companyId: user.companyId,
          token: uuidv4(),
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          createdAt: now,
        };

        set(state => ({
          currentSession: session,
          users: state.users.map(u =>
            u.id === user.id ? { ...u, lastLogin: now } : u
          ),
        }));

        get().addAuditLog({
          companyId: user.companyId,
          userId: user.id,
          action: 'user.login',
          resource: 'session',
          resourceId: session.token,
          details: {},
        });

        return { success: true };
      },

      logout: () => {
        const session = get().currentSession;
        if (session) {
          get().addAuditLog({
            companyId: session.companyId,
            userId: session.userId,
            action: 'user.logout',
            resource: 'session',
            resourceId: session.token,
            details: {},
          });
        }
        set({ currentSession: null });
      },

      getCurrentUser: () => {
        const session = get().currentSession;
        if (!session) return null;
        return get().users.find(u => u.id === session.userId) || null;
      },

      getCurrentCompany: () => {
        const session = get().currentSession;
        if (!session) return null;
        return get().companies.find(c => c.id === session.companyId) || null;
      },

      hasPermission: (permission) => {
        const user = get().getCurrentUser();
        if (!user) return false;
        const allowed = ROLE_PERMISSIONS[user.role];
        return allowed.includes(permission);
      },

      // --- CLIENTS ---
      addClient: (clientData) => {
        const now = new Date().toISOString();
        const client: Client = {
          ...clientData,
          id: uuidv4(),
          createdAt: now,
          updatedAt: now,
        };
        set(state => ({ clients: [...state.clients, client] }));

        const session = get().currentSession;
        if (session) {
          get().addAuditLog({
            companyId: session.companyId,
            userId: session.userId,
            action: 'client.created',
            resource: 'client',
            resourceId: client.id,
            details: { name: client.name },
          });
        }
      },

      updateClient: (id, data) => {
        set(state => ({
          clients: state.clients.map(c =>
            c.id === id ? { ...c, ...data, updatedAt: new Date().toISOString() } : c
          ),
        }));
      },

      deleteClient: (id) => {
        set(state => ({
          clients: state.clients.filter(c => c.id !== id),
        }));
      },

      getClientsByCompany: (companyId) => {
        return get().clients.filter(c => c.companyId === companyId);
      },

      // --- TARIFFS ---
      addTariff: (tariffData) => {
        const now = new Date().toISOString();
        const tariff: Tariff = {
          ...tariffData,
          id: uuidv4(),
          createdAt: now,
          updatedAt: now,
        };
        set(state => ({ tariffs: [...state.tariffs, tariff] }));
      },

      updateTariff: (id, data) => {
        set(state => ({
          tariffs: state.tariffs.map(t =>
            t.id === id ? { ...t, ...data, updatedAt: new Date().toISOString() } : t
          ),
        }));
      },

      getTariffsByCompany: (companyId) => {
        return get().tariffs.filter(t => t.companyId === companyId);
      },

      // --- REQUESTS ---
      addRequest: (requestData) => {
        const now = new Date().toISOString();
        const request: ServiceRequest = {
          ...requestData,
          id: uuidv4(),
          createdAt: now,
          updatedAt: now,
        };
        set(state => ({ requests: [...state.requests, request] }));

        const session = get().currentSession;
        if (session) {
          get().addAuditLog({
            companyId: session.companyId,
            userId: session.userId,
            action: 'request.created',
            resource: 'request',
            resourceId: request.id,
            details: { description: request.description.substring(0, 100) },
          });
        }
      },

      updateRequest: (id, data) => {
        set(state => ({
          requests: state.requests.map(r =>
            r.id === id ? { ...r, ...data, updatedAt: new Date().toISOString() } : r
          ),
        }));
      },

      getRequestsByCompany: (companyId) => {
        return get().requests.filter(r => r.companyId === companyId);
      },

      // --- BUDGETS ---
      addBudget: (budgetData) => {
        const now = new Date().toISOString();
        const budget: Budget = {
          ...budgetData,
          id: uuidv4(),
          createdAt: now,
          updatedAt: now,
        };
        set(state => ({ budgets: [...state.budgets, budget] }));

        const session = get().currentSession;
        if (session) {
          get().addAuditLog({
            companyId: session.companyId,
            userId: session.userId,
            action: 'budget.created',
            resource: 'budget',
            resourceId: budget.id,
            details: { number: budget.number, total: budget.total },
          });
        }
      },

      updateBudget: (id, data) => {
        set(state => ({
          budgets: state.budgets.map(b =>
            b.id === id ? { ...b, ...data, updatedAt: new Date().toISOString() } : b
          ),
        }));
      },

      getBudgetsByCompany: (companyId) => {
        return get().budgets.filter(b => b.companyId === companyId);
      },

      // --- SERVICES (Catálogo) ---
      addService: (serviceData: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>) => {
        const now = new Date().toISOString();
        const service: Service = {
          ...serviceData,
          id: uuidv4(),
          createdAt: now,
          updatedAt: now,
        };
        set(state => ({ services: [...state.services, service] }));
      },

      updateService: (id: string, data: Partial<Service>) => {
        set(state => ({
          services: state.services.map(s =>
            s.id === id ? { ...s, ...data, updatedAt: new Date().toISOString() } : s
          ),
        }));
      },

      getServicesByCompany: (companyId: string) => {
        return get().services.filter(s => s.companyId === companyId);
      },

      // --- AI CONFIG ---
      updateAIConfig: (config: Partial<AIConfig>) => {
        set(state => ({ aiConfig: { ...state.aiConfig, ...config } }));
      },

      // --- AI ANALYSIS ---
      updateRequestAnalysis: (requestId: string, analysis: AIAnalysisResult) => {
        set(state => ({
          requests: state.requests.map(r =>
            r.id === requestId
              ? { ...r, aiAnalysis: analysis, status: 'analyzed', updatedAt: new Date().toISOString() }
              : r
          ),
        }));
      },

      // --- APPROVAL HISTORY ---
      addApprovalHistory: (entry: Omit<ApprovalHistoryEntry, 'id' | 'timestamp'>) => {
        const historyEntry: ApprovalHistoryEntry = {
          ...entry,
          id: uuidv4(),
          timestamp: new Date().toISOString(),
        };
        set(state => ({ approvalHistory: [...state.approvalHistory, historyEntry] }));
      },

      getApprovalHistoryByBudget: (budgetId: string) => {
        return get().approvalHistory
          .filter(h => h.budgetId === budgetId)
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      },

      // --- GENERATED DOCUMENTS ---
      addGeneratedDocument: (doc: Omit<GeneratedDocument, 'id' | 'createdAt'>) => {
        const document: GeneratedDocument = {
          ...doc,
          id: uuidv4(),
          createdAt: new Date().toISOString(),
        };
        set(state => ({ generatedDocuments: [...state.generatedDocuments, document] }));
      },

      getDocumentsByBudget: (budgetId: string) => {
        return get().generatedDocuments.filter(d => d.budgetId === budgetId);
      },

      // --- JOULE METRICS ---
      addJouleMetric: (metric: Omit<JouleMetric, 'id' | 'createdAt'>) => {
        const jouleMetric: JouleMetric = {
          ...metric,
          id: uuidv4(),
          createdAt: new Date().toISOString(),
        };
        set(state => ({ jouleMetrics: [...state.jouleMetrics, jouleMetric] }));
      },

      getJouleMetricsByCompany: (companyId: string) => {
        return get().jouleMetrics
          .filter(m => m.companyId === companyId)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      },

      // --- CLIENT ARCHIVE ---
      archiveClient: (id: string) => {
        set(state => ({
          clients: state.clients.map(c =>
            c.id === id ? { ...c, status: 'archived' as const, updatedAt: new Date().toISOString() } : c
          ),
        }));
      },

      // --- AUDIT ---
      addAuditLog: (logData) => {
        const log: AuditLog = {
          ...logData,
          id: uuidv4(),
          timestamp: new Date().toISOString(),
        };
        set(state => ({ auditLogs: [...state.auditLogs, log] }));
      },

      getAuditLogsByCompany: (companyId) => {
        return get().auditLogs
          .filter(l => l.companyId === companyId)
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      },
    }),
    {
      name: 'titan-business-os-storage',
      partialize: (state) => ({
        companies: state.companies,
        users: state.users,
        currentSession: state.currentSession,
        clients: state.clients,
        tariffs: state.tariffs,
        requests: state.requests,
        budgets: state.budgets,
        documents: state.documents,
        tasks: state.tasks,
        authorizations: state.authorizations,
        auditLogs: state.auditLogs,
        aiMetrics: state.aiMetrics,
        officialSources: state.officialSources,
      }),
    }
  )
);
