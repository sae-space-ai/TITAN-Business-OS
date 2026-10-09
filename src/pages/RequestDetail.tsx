import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { analyzeRequest, validateAIAnalysisSchema } from '../lib/ai-analyzer';
import { ArrowLeft, Brain, CheckCircle, AlertCircle, Clock, FileText, Sparkles, AlertTriangle } from 'lucide-react';

export default function RequestDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const session = useStore(s => s.currentSession);
  const requests = useStore(s => s.requests);
  const clients = useStore(s => s.clients);
  const services = useStore(s => s.services);
  const aiConfig = useStore(s => s.aiConfig);
  const updateRequestAnalysis = useStore(s => s.updateRequestAnalysis);
  const addJouleMetric = useStore(s => s.addJouleMetric);
  const hasPermission = useStore(s => s.hasPermission);

  const request = requests.find(r => r.id === id);
  const client = request?.clientId ? clients.find(c => c.id === request.clientId) : null;

  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');

  if (!request || !session) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">Solicitud no encontrada</p>
        <button onClick={() => navigate('/solicitudes')} className="mt-4 text-[#288FC5] hover:underline">
          Volver a solicitudes
        </button>
      </div>
    );
  }

  const handleAnalyze = async () => {
    if (!hasPermission('digital_employee.execute')) {
      setError('No tienes permisos para ejecutar el análisis');
      return;
    }

    setAnalyzing(true);
    setError('');

    try {
      const companyServices = services.filter(s => s.companyId === session.companyId);
      const startTime = Date.now();
      
      const analysis = await analyzeRequest(request, companyServices, aiConfig);
      
      // Validar esquema
      const validation = validateAIAnalysisSchema(analysis);
      if (!validation.valid) {
        const errorAnalysis = {
          ...analysis,
          status: 'schema_violation' as const,
          errorMessage: `Respuesta IA no cumple esquema: ${validation.errors.join(', ')}`,
        };
        updateRequestAnalysis(request.id, errorAnalysis);
        
        addJouleMetric({
          companyId: session.companyId,
          requestId: request.id,
          operation: 'analyze_request',
          provider: analysis.model === 'none' ? 'none' : 'local',
          model: analysis.model,
          tokensInput: 0,
          tokensOutput: 0,
          cost: 0,
          latencyMs: Date.now() - startTime,
          retries: 0,
          status: 'error',
        });
        
        setError('La respuesta de la IA no cumple el esquema esperado');
        setAnalyzing(false);
        return;
      }

      // Guardar análisis
      updateRequestAnalysis(request.id, analysis);
      
      // Registrar métrica JOULE
      addJouleMetric({
        companyId: session.companyId,
        requestId: request.id,
        operation: 'analyze_request',
        provider: analysis.model === 'none' ? 'none' : (analysis.model.includes('openai') ? 'openai' : 'local'),
        model: analysis.model,
        tokensInput: analysis.tokensUsed,
        tokensOutput: 0,
        cost: analysis.costEstimate,
        latencyMs: Date.now() - startTime,
        retries: 0,
        status: analysis.status === 'success' ? 'success' : 'error',
        qualityScore: analysis.confidence,
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al analizar');
    } finally {
      setAnalyzing(false);
    }
  };

  const statusLabels: Record<string, { label: string; color: string }> = {
    received: { label: 'Nueva', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    analyzing: { label: 'En análisis', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    analyzed: { label: 'Analizada', color: 'bg-violet-50 text-violet-700 border-violet-200' },
    budgeting: { label: 'Presupuestando', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    budget_ready: { label: 'Presupuestada', color: 'bg-green-50 text-green-700 border-green-200' },
    approved: { label: 'Aprobada', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    sent: { label: 'Enviada', color: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
    completed: { label: 'Completada', color: 'bg-gray-50 text-gray-700 border-gray-200' },
    rejected: { label: 'Rechazada', color: 'bg-red-50 text-red-700 border-red-200' },
    cancelled: { label: 'Cancelada', color: 'bg-gray-50 text-gray-500 border-gray-200' },
  };

  const status = statusLabels[request.status] || statusLabels.received;

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <button
        onClick={() => navigate('/solicitudes')}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#288FC5] mb-4"
      >
        <ArrowLeft size={16} />
        Volver a solicitudes
      </button>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#334155] flex items-center gap-2">
            <FileText size={24} className="text-[#288FC5]" />
            Solicitud #{request.id.slice(0, 8)}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {new Date(request.createdAt).toLocaleString('es-ES')}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${status.color}`}>
          {status.label}
        </span>
      </div>

      {/* Info */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Cliente</p>
            <p className="text-sm font-medium text-[#334155]">{client?.name || 'No asignado'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Canal</p>
            <p className="text-sm font-medium text-[#334155] capitalize">{request.channel.replace('_', ' ')}</p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-xs text-gray-500 mb-1">Descripción</p>
            <p className="text-sm text-[#334155]">{request.description}</p>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Análisis IA */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-[#334155] flex items-center gap-2">
            <Brain size={18} className="text-violet-500" />
            Análisis del Empleado Digital
          </h3>
          {hasPermission('digital_employee.execute') && !request.aiAnalysis && (
            <button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-500 text-white text-sm font-medium hover:bg-violet-600 disabled:opacity-50"
            >
              {analyzing ? (
                <>
                  <Clock size={14} className="animate-spin" />
                  Analizando...
                </>
              ) : (
                <>
                  <Sparkles size={14} />
                  Analizar con TITAN
                </>
              )}
            </button>
          )}
        </div>

        {!request.aiAnalysis ? (
          <div className="text-center py-8">
            <Brain size={40} className="mx-auto text-gray-200 mb-3" />
            <p className="text-sm text-gray-500">
              {hasPermission('digital_employee.execute')
                ? 'Pulsa "Analizar con TITAN" para que el empleado digital procese esta solicitud'
                : 'No tienes permisos para ejecutar el análisis'}
            </p>
            {!aiConfig.apiKeyConfigured && (
              <p className="text-xs text-amber-600 mt-2">
                <AlertTriangle size={12} className="inline mr-1" />
                Nota: No hay API de IA configurada. El análisis será básico (palabras clave).
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Estado del análisis */}
            {request.aiAnalysis.status === 'pending_integration' && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-800">Integración de IA pendiente</p>
                    <p className="text-xs text-amber-700 mt-1">{request.aiAnalysis.errorMessage}</p>
                    <p className="text-xs text-amber-600 mt-2">
                      Se ha realizado un análisis básico por palabras clave. Para análisis avanzado, configure una API de IA.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {request.aiAnalysis.status === 'error' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm font-medium text-red-800">Error en análisis</p>
                <p className="text-xs text-red-700 mt-1">{request.aiAnalysis.errorMessage}</p>
              </div>
            )}

            {/* Servicio identificado */}
            <div className="bg-violet-50 border border-violet-200 rounded-lg p-4">
              <p className="text-xs text-violet-600 mb-1">Servicio identificado</p>
              <p className="text-sm font-medium text-violet-900">{request.aiAnalysis.identifiedService}</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex-1 bg-violet-200 rounded-full h-2">
                  <div
                    className="bg-violet-500 h-2 rounded-full"
                    style={{ width: `${request.aiAnalysis.confidence * 100}%` }}
                  />
                </div>
                <span className="text-xs text-violet-600">{(request.aiAnalysis.confidence * 100).toFixed(0)}% confianza</span>
              </div>
            </div>

            {/* Hechos */}
            {request.aiAnalysis.facts.length > 0 && (
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Hechos extraídos</p>
                <ul className="space-y-1">
                  {request.aiAnalysis.facts.map((fact, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle size={14} className="text-green-500 mt-0.5 shrink-0" />
                      <span>{fact}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Inferencias */}
            {request.aiAnalysis.inferences.length > 0 && (
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Inferencias (no verificadas)</p>
                <ul className="space-y-1">
                  {request.aiAnalysis.inferences.map((inf, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-violet-400">→</span>
                      <span>{inf}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Datos faltantes */}
            {request.aiAnalysis.missingData.length > 0 && (
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Información pendiente</p>
                <ul className="space-y-1">
                  {request.aiAnalysis.missingData.map((missing, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-amber-700">
                      <AlertCircle size={14} className="text-amber-500 mt-0.5 shrink-0" />
                      <span>{missing}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Conceptos propuestos */}
            {request.aiAnalysis.proposedConcepts.length > 0 && (
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Conceptos propuestos para presupuesto</p>
                <div className="space-y-2">
                  {request.aiAnalysis.proposedConcepts.map((concept, i) => (
                    <div key={i} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <p className="text-sm font-medium text-[#334155]">{concept.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Cantidad sugerida: {concept.suggestedQuantity} {concept.suggestedUnit}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Acción propuesta */}
            <div className="bg-[#EAF7FE] rounded-lg p-4 border border-[#288FC5]/20">
              <p className="text-xs text-[#288FC5] mb-1">Acción recomendada</p>
              <p className="text-sm text-[#334155]">{request.aiAnalysis.proposedAction}</p>
            </div>

            {/* Métricas */}
            <div className="flex items-center gap-4 text-xs text-gray-400 pt-2 border-t border-gray-100">
              <span>Modelo: {request.aiAnalysis.model}</span>
              <span>Latencia: {request.aiAnalysis.latencyMs}ms</span>
              <span>Análisis: {new Date(request.aiAnalysis.analyzedAt).toLocaleString('es-ES')}</span>
            </div>
          </div>
        )}
      </div>

      {/* Acciones */}
      <div className="flex gap-3">
        {request.aiAnalysis && request.status === 'analyzed' && (
          <button
            onClick={() => navigate(`/presupuestos/nueva?requestId=${request.id}`)}
            className="flex-1 py-2.5 rounded-lg bg-[#288FC5] text-white text-sm font-medium hover:bg-[#1a6fa0]"
          >
            Crear presupuesto desde análisis
          </button>
        )}
        <button
          onClick={() => navigate('/solicitudes')}
          className="px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50"
        >
          Volver
        </button>
      </div>
    </div>
  );
}
