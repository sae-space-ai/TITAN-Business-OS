-- ============================================================
-- TITAN BUSINESS OS — Migración Etapa 2: Circuito Comercial
-- ============================================================

-- Tabla: services (Catálogo de servicios)
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    default_unit_price DECIMAL(10,2) NOT NULL DEFAULT 0,
    unit VARCHAR(20) NOT NULL DEFAULT 'hora',
    category VARCHAR(50) NOT NULL DEFAULT 'general',
    default_tax_rate DECIMAL(5,2) NOT NULL DEFAULT 21,
    conditions TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    valid_from DATE,
    valid_until DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_services_company ON services(company_id);
CREATE INDEX IF NOT EXISTS idx_services_active ON services(is_active);

-- Tabla: approval_history (Historial de aprobaciones)
CREATE TABLE IF NOT EXISTS approval_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    budget_id UUID NOT NULL REFERENCES budgets(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    user_name VARCHAR(255) NOT NULL,
    action VARCHAR(30) NOT NULL,
    from_status VARCHAR(20),
    to_status VARCHAR(20) NOT NULL,
    version INTEGER NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_approval_history_budget ON approval_history(budget_id);
CREATE INDEX IF NOT EXISTS idx_approval_history_company ON approval_history(company_id);

-- Tabla: generated_documents (Documentos PDF/XLSX generados)
CREATE TABLE IF NOT EXISTS generated_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    budget_id UUID NOT NULL REFERENCES budgets(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL,
    name VARCHAR(255) NOT NULL,
    data_url TEXT NOT NULL,
    file_size INTEGER NOT NULL DEFAULT 0,
    version INTEGER NOT NULL DEFAULT 1,
    checksum VARCHAR(50) NOT NULL,
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_generated_documents_budget ON generated_documents(budget_id);
CREATE INDEX IF NOT EXISTS idx_generated_documents_company ON generated_documents(company_id);

-- Tabla: joule_metrics (Métricas de consumo IA)
CREATE TABLE IF NOT EXISTS joule_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    task_id UUID REFERENCES digital_employee_tasks(id) ON DELETE SET NULL,
    request_id UUID REFERENCES service_requests(id) ON DELETE SET NULL,
    operation VARCHAR(100) NOT NULL,
    provider VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    tokens_input INTEGER NOT NULL DEFAULT 0,
    tokens_output INTEGER NOT NULL DEFAULT 0,
    cost DECIMAL(10,6) NOT NULL DEFAULT 0,
    latency_ms INTEGER NOT NULL DEFAULT 0,
    retries INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL,
    quality_score DECIMAL(3,2),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_joule_metrics_company ON joule_metrics(company_id);
CREATE INDEX IF NOT EXISTS idx_joule_metrics_created ON joule_metrics(created_at DESC);

-- Actualizar tabla clients para añadir status y contact_person
ALTER TABLE clients ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'active';
ALTER TABLE clients ADD COLUMN IF NOT EXISTS contact_person VARCHAR(255);

-- Actualizar tabla budgets para hacer requestId opcional
ALTER TABLE budgets ALTER COLUMN request_id DROP NOT NULL;

-- Trigger para updated_at en services
CREATE TRIGGER IF NOT EXISTS update_services_updated_at BEFORE UPDATE ON services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
