import { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Loader2, Play, RotateCcw } from 'lucide-react';
import { runStage1Tests } from '../tests/stage1.test';

interface TestResult {
  name: string;
  passed: boolean;
  details: string;
}

export default function Stage1Status() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [running, setRunning] = useState(false);
  const [hasRun, setHasRun] = useState(false);

  const handleRunTests = async () => {
    setRunning(true);
    setResults([]);
    
    const testResults = await runStage1Tests();
    setResults(testResults);
    setRunning(false);
    setHasRun(true);
  };

  const passedCount = results.filter(r => r.passed).length;
  const failedCount = results.filter(r => !r.passed).length;

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#334155] flex items-center gap-2">
          <span className="text-2xl">🧪</span>
          Estado de Etapa 1 — Fundación
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Verificación de los requisitos obligatorios de la Etapa 1
        </p>
      </div>

      {/* Run tests button */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-[#334155]">Pruebas automáticas</h3>
            <p className="text-sm text-gray-500">10 pruebas obligatorias de la Etapa 1</p>
          </div>
          <button
            onClick={handleRunTests}
            disabled={running}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#288FC5] text-white text-sm font-medium hover:bg-[#1a6fa0] disabled:opacity-50 transition-colors"
          >
            {running ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Ejecutando...
              </>
            ) : hasRun ? (
              <>
                <RotateCcw size={16} />
                Re-ejecutar
              </>
            ) : (
              <>
                <Play size={16} />
                Ejecutar pruebas
              </>
            )}
          </button>
        </div>

        {hasRun && (
          <div className="flex items-center gap-4 p-3 rounded-lg bg-gray-50">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={16} className="text-green-500" />
              <span className="text-sm font-medium text-green-700">{passedCount} pasadas</span>
            </div>
            <div className="flex items-center gap-1.5">
              <XCircle size={16} className="text-red-500" />
              <span className="text-sm font-medium text-red-700">{failedCount} fallidas</span>
            </div>
            <div className="text-sm text-gray-500">
              de {results.length} pruebas
            </div>
          </div>
        )}
      </div>

      {/* Test results */}
      {results.length > 0 && (
        <div className="space-y-3">
          {results.map((result, i) => (
            <div
              key={i}
              className={`rounded-xl border p-4 ${
                result.passed
                  ? 'bg-green-50/50 border-green-200'
                  : 'bg-red-50/50 border-red-200'
              }`}
            >
              <div className="flex items-start gap-3">
                {result.passed ? (
                  <CheckCircle2 size={20} className="text-green-500 shrink-0 mt-0.5" />
                ) : (
                  <XCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className={`font-medium text-sm ${result.passed ? 'text-green-800' : 'text-red-800'}`}>
                    {result.name}
                  </p>
                  <p className={`text-xs mt-1 ${result.passed ? 'text-green-600' : 'text-red-600'}`}>
                    {result.details}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary */}
      {hasRun && failedCount === 0 && (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-6 text-center">
          <p className="text-lg font-bold text-green-800 mb-2">
            🎉 Etapa 1 completada
          </p>
          <p className="text-sm text-green-700">
            Todas las pruebas han pasado. El sistema cumple los requisitos de la Etapa 1.
          </p>
        </div>
      )}

      {hasRun && failedCount > 0 && (
        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
          <p className="text-lg font-bold text-amber-800 mb-2">
            ⚠️ Pruebas fallidas
          </p>
          <p className="text-sm text-amber-700">
            {failedCount} prueba(s) no han pasado. Revisar antes de continuar a la Etapa 2.
          </p>
        </div>
      )}

      {/* Info */}
      <div className="mt-6 bg-[#EAF7FE] rounded-xl p-4 border border-[#288FC5]/10">
        <p className="text-xs text-[#288FC5]">
          <span className="font-medium">Nota:</span> Estas pruebas verifican el comportamiento
          del sistema en el navegador. Para pruebas de integración completas con backend,
          base de datos y aislamiento real entre empresas, se requiere ejecutar el stack completo con Docker.
        </p>
      </div>
    </div>
  );
}
