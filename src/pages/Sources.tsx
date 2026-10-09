import { Landmark, AlertTriangle, ExternalLink, CheckCircle, Clock } from 'lucide-react';

// Fuentes oficiales predefinidas (no inventadas - son las fuentes reales de referencia)
const officialSources = [
  {
    id: '1',
    organism: 'Boletín Oficial del Estado (BOE)',
    url: 'https://www.boe.es',
    reference: 'boe.es',
    title: 'Legislación consolidada',
    status: 'active' as const,
    category: 'Normativa general',
    consultedAt: '2026-01-01',
    note: 'Fuente primaria de legislación española',
  },
  {
    id: '2',
    organism: 'Agencia Estatal de Administración Tributaria (AEAT)',
    url: 'https://www.agenciatributaria.es',
    reference: 'aeat.es',
    title: 'Normativa fiscal y tributaria',
    status: 'active' as const,
    category: 'Fiscal',
    consultedAt: '2026-01-01',
    note: 'IVA, IRPF, impuestos societarios',
  },
  {
    id: '3',
    organism: 'Agencia Española de Protección de Datos (AEPD)',
    url: 'https://www.aepd.es',
    reference: 'aepd.es',
    title: 'Normativa de protección de datos',
    status: 'active' as const,
    category: 'Protección de datos',
    consultedAt: '2026-01-01',
    note: 'RGPD, LOPDGDD',
  },
  {
    id: '4',
    organism: 'Ministerio de Asuntos Económicos',
    url: 'https://www.mineco.gob.es',
    reference: 'mineco.gob.es',
    title: 'Regulación de facturación',
    status: 'pending_review' as const,
    category: 'Facturación',
    consultedAt: '2026-01-01',
    note: 'Veri*factu — Reglamento de sistemas informáticos de facturación. Pendiente de validación completa.',
  },
];

export default function Sources() {
  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <h1 className="text-2xl font-bold text-[#334155] flex items-center gap-2">
            <Landmark size={24} className="text-[#D778A4]" />
            Fuentes Oficiales
          </h1>
          <span className="text-[10px] px-2 py-0.5 rounded bg-[#F8D7E7] text-[#D778A4] font-medium">
            Experimental
          </span>
        </div>
        <p className="text-sm text-gray-500">
          Registro de conocimiento normativo de España. Estas fuentes se consultarán
          para validar reglas fiscales, de facturación y protección de datos.
        </p>
      </div>

      {/* Warning */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-800">Módulo en fase experimental</p>
            <p className="text-xs text-amber-700 mt-1">
              Este módulo registra las fuentes oficiales de referencia pero aún no aplica
              reglas normativas automáticamente. Ninguna operación fiscal se realizará sin
              validación humana y verificación de la normativa vigente.
            </p>
          </div>
        </div>
      </div>

      {/* Distinction legend */}
      <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100">
        <h3 className="text-sm font-semibold text-[#334155] mb-3">Clasificación de información</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-start gap-2">
            <CheckCircle size={14} className="text-green-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-medium text-[#334155]">Norma verificada</p>
              <p className="text-[10px] text-gray-500">Fuente oficial consultada y validada</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Clock size={14} className="text-amber-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-medium text-[#334155]">Pendiente de validación</p>
              <p className="text-[10px] text-gray-500">Requiere revisión antes de aplicar reglas</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-blue-100 border border-blue-300 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-medium text-[#334155]">Dato aportado por empresa</p>
              <p className="text-[10px] text-gray-500">Información proporcionada por el usuario</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-violet-100 border border-violet-300 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-medium text-[#334155]">Inferencia de IA</p>
              <p className="text-[10px] text-gray-500">Propuesta generada, requiere confirmación</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sources List */}
      <div className="space-y-3">
        {officialSources.map((source) => (
          <div key={source.id} className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-sm transition-shadow">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-[#334155] text-sm">{source.organism}</h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${
                    source.status === 'active'
                      ? 'bg-green-50 text-green-700 border-green-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    {source.status === 'active' ? 'Activa' : 'Pendiente revisión'}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{source.title}</p>
                <p className="text-xs text-gray-400 mt-1">{source.note}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                  <span>Categoría: {source.category}</span>
                  <span>Consultada: {source.consultedAt}</span>
                </div>
              </div>
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-[#288FC5] shrink-0"
                title="Visitar fuente oficial"
              >
                <ExternalLink size={16} />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Info */}
      <div className="mt-6 bg-[#EAF7FE] rounded-xl p-4 border border-[#288FC5]/10">
        <p className="text-xs text-[#288FC5]">
          <span className="font-medium">Principio:</span> No se programarán fechas legales ni tipos
          impositivos usando únicamente recuerdos del modelo de IA. Toda regla normativa debe
          estar respaldada por una fuente oficial verificada y fecha de vigencia confirmada.
        </p>
      </div>
    </div>
  );
}
