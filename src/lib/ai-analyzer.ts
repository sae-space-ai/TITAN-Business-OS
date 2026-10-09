/**
 * TITAN Business OS — Motor de Análisis IA (Empleado Digital)
 * 
 * Este motor analiza solicitudes y propone conceptos para presupuestos.
 * 
 * IMPORTANTE: 
 * - Si no hay API de IA configurada, informa claramente.
 * - NUNCA inventa precios, cantidades, clientes o condiciones.
 * - Los precios SIEMPRE proceden de tarifas autorizadas.
 * - Las inferencias se marcan claramente como tales.
 */

import { ServiceRequest, AIAnalysisResult, Service, AIConfig } from '../types';

// Analizar una solicitud
export async function analyzeRequest(
  request: ServiceRequest,
  services: Service[],
  aiConfig: AIConfig
): Promise<AIAnalysisResult> {
  const startTime = Date.now();

  // Verificar si hay API configurada
  if (!aiConfig.apiKeyConfigured) {
    return {
      identifiedService: 'No disponible',
      confidence: 0,
      extractedData: {},
      missingData: ['Integración de IA no configurada'],
      facts: ['La solicitud ha sido recibida correctamente'],
      inferences: [],
      contradictions: [],
      proposedConcepts: [],
      proposedAction: 'Configurar API de IA para habilitar el análisis automático',
      model: 'none',
      tokensUsed: 0,
      costEstimate: 0,
      latencyMs: Date.now() - startTime,
      status: 'pending_integration',
      errorMessage: 'No hay proveedor de IA configurado. Configure una API key en Configuración > Integraciones.',
      analyzedAt: new Date().toISOString(),
    };
  }

  // Simular análisis (en producción, aquí se llamaría a la API real)
  // Por ahora, hacemos un análisis básico basado en palabras clave
  
  try {
    const analysis = performBasicAnalysis(request, services);
    
    return {
      ...analysis,
      latencyMs: Date.now() - startTime,
      status: 'success',
      analyzedAt: new Date().toISOString(),
    };
  } catch (error) {
    return {
      identifiedService: 'Error en análisis',
      confidence: 0,
      extractedData: {},
      missingData: [],
      facts: [],
      inferences: [],
      contradictions: [],
      proposedConcepts: [],
      proposedAction: 'Revisar manualmente la solicitud',
      model: 'error',
      tokensUsed: 0,
      costEstimate: 0,
      latencyMs: Date.now() - startTime,
      status: 'error',
      errorMessage: error instanceof Error ? error.message : 'Error desconocido',
      analyzedAt: new Date().toISOString(),
    };
  }
}

// Análisis básico basado en palabras clave (sin IA real)
function performBasicAnalysis(request: ServiceRequest, services: Service[]): Omit<AIAnalysisResult, 'latencyMs' | 'status' | 'analyzedAt'> {
  const description = request.description.toLowerCase();
  const facts: string[] = [];
  const inferences: string[] = [];
  const missingData: string[] = [];
  const contradictions: string[] = [];
  const proposedConcepts: Array<{
    description: string;
    suggestedServiceId?: string;
    suggestedQuantity?: number;
    suggestedUnit?: string;
  }> = [];

  // Hechos extraídos directamente
  facts.push(`Solicitud recibida el ${new Date(request.createdAt).toLocaleDateString('es-ES')}`);
  facts.push(`Canal de entrada: ${request.channel}`);
  
  if (request.clientId) {
    facts.push('Cliente identificado en la solicitud');
  } else {
    missingData.push('Cliente no especificado');
  }

  // Buscar servicios que coincidan con palabras clave
  const keywords = extractKeywords(description);
  
  services.forEach(service => {
    const serviceName = service.name.toLowerCase();
    const serviceDesc = service.description.toLowerCase();
    
    // Coincidencia simple
    const matches = keywords.some(keyword => 
      serviceName.includes(keyword) || serviceDesc.includes(keyword)
    );
    
    if (matches) {
      proposedConcepts.push({
        description: service.name,
        suggestedServiceId: service.id,
        suggestedQuantity: 1,
        suggestedUnit: service.unit,
      });
      inferences.push(`Posible servicio identificado: ${service.name} (basado en palabras clave)`);
    }
  });

  // Detectar información faltante
  if (!description.includes('precio') && !description.includes('coste') && !description.includes('presupuesto')) {
    missingData.push('No se menciona información sobre precios o presupuesto');
  }

  if (!description.includes('plazo') && !description.includes('tiempo') && !description.includes('entrega')) {
    missingData.push('No se especifica plazo de entrega');
  }

  if (description.length < 50) {
    missingData.push('La descripción es muy breve, puede faltar información importante');
  }

  // Identificar servicio principal
  let identifiedService = 'No identificado';
  let confidence = 0;

  if (proposedConcepts.length > 0) {
    identifiedService = proposedConcepts[0].description;
    confidence = 0.6; // Confianza moderada para análisis básico
    inferences.push('Análisis basado en coincidencia de palabras clave, no en IA avanzada');
  }

  return {
    identifiedService,
    confidence,
    extractedData: {
      serviceDescription: request.description.substring(0, 200),
    },
    missingData,
    facts,
    inferences,
    contradictions,
    proposedConcepts,
    proposedAction: proposedConcepts.length > 0
      ? 'Revisar los conceptos propuestos y ajustar cantidades/precios'
      : 'No se pudieron identificar servicios automáticamente. Crear presupuesto manualmente.',
    model: 'basic-keyword-analysis',
    tokensUsed: 0,
    costEstimate: 0,
  };
}

// Extraer palabras clave de la descripción
function extractKeywords(text: string): string[] {
  const stopWords = ['el', 'la', 'los', 'las', 'un', 'una', 'de', 'del', 'en', 'con', 'por', 'para', 'que', 'es', 'son'];
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3 && !stopWords.includes(word));
  
  return [...new Set(words)]; // Eliminar duplicados
}

// Validar esquema de respuesta IA
export function validateAIAnalysisSchema(analysis: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!analysis.identifiedService || typeof analysis.identifiedService !== 'string') {
    errors.push('identifiedService debe ser un string');
  }

  if (typeof analysis.confidence !== 'number' || analysis.confidence < 0 || analysis.confidence > 1) {
    errors.push('confidence debe ser un número entre 0 y 1');
  }

  if (!Array.isArray(analysis.missingData)) {
    errors.push('missingData debe ser un array');
  }

  if (!Array.isArray(analysis.facts)) {
    errors.push('facts debe ser un array');
  }

  if (!Array.isArray(analysis.proposedConcepts)) {
    errors.push('proposedConcepts debe ser un array');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
