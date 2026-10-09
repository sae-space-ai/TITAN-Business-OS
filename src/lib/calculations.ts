/**
 * TITAN Business OS — Motor de Cálculos Deterministas
 * 
 * Todos los cálculos económicos se realizan aquí, NUNCA en la IA.
 * Los precios proceden exclusivamente de tarifas autorizadas o valores
 * expresamente aprobados por el usuario.
 */

import { BudgetLine } from '../types';

// Redondeo a 2 decimales con política explícita
export function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

// Calcular subtotal de una línea
export function calculateLineSubtotal(
  quantity: number,
  unitPrice: number,
  discountPercent: number = 0
): number {
  const gross = quantity * unitPrice;
  const discount = gross * (discountPercent / 100);
  return roundMoney(gross - discount);
}

// Calcular totales del presupuesto
export function calculateBudgetTotals(
  lines: BudgetLine[],
  globalDiscount: number = 0,
  taxRate: number = 21
) {
  // Sumar subtotales de líneas
  const linesSubtotal = lines.reduce((sum, line) => sum + line.subtotal, 0);
  
  // Aplicar descuento global si existe
  const globalDiscountAmount = roundMoney(linesSubtotal * (globalDiscount / 100));
  const subtotalAfterDiscount = roundMoney(linesSubtotal - globalDiscountAmount);
  
  // Calcular impuestos
  const taxAmount = roundMoney(subtotalAfterDiscount * (taxRate / 100));
  
  // Total final
  const total = roundMoney(subtotalAfterDiscount + taxAmount);
  
  return {
    linesSubtotal: roundMoney(linesSubtotal),
    globalDiscount: globalDiscountAmount,
    taxBase: subtotalAfterDiscount,
    taxRate,
    taxAmount,
    total,
  };
}

// Validar que los importes coinciden
export function validateBudgetConsistency(
  lines: BudgetLine[],
  declaredSubtotal: number,
  declaredTaxBase: number,
  declaredTaxAmount: number,
  declaredTotal: number,
  taxRate: number,
  tolerance: number = 0.01
): { valid: boolean; errors: string[] } {
  const calculated = calculateBudgetTotals(lines, 0, taxRate);
  const errors: string[] = [];

  if (Math.abs(calculated.linesSubtotal - declaredSubtotal) > tolerance) {
    errors.push(`Subtotal declarado (${declaredSubtotal}) no coincide con calculado (${calculated.linesSubtotal})`);
  }

  if (Math.abs(calculated.taxBase - declaredTaxBase) > tolerance) {
    errors.push(`Base imponible declarada (${declaredTaxBase}) no coincide con calculada (${calculated.taxBase})`);
  }

  if (Math.abs(calculated.taxAmount - declaredTaxAmount) > tolerance) {
    errors.push(`IVA declarado (${declaredTaxAmount}) no coincide con calculado (${calculated.taxAmount})`);
  }

  if (Math.abs(calculated.total - declaredTotal) > tolerance) {
    errors.push(`Total declarado (${declaredTotal}) no coincide con calculado (${calculated.total})`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// Tipos de IVA comunes en España (verificados)
export const SPANISH_TAX_RATES = {
  general: { rate: 21, label: 'IVA General (21%)', source: 'Ley 37/1992, art. 90' },
  reducido: { rate: 10, label: 'IVA Reducido (10%)', source: 'Ley 37/1992, art. 90' },
  superreducido: { rate: 4, label: 'IVA Superreducido (4%)', source: 'Ley 37/1992, art. 90' },
  exento: { rate: 0, label: 'Exento (0%)', source: 'Ley 37/1992, art. 20' },
} as const;

// Formatear moneda
export function formatCurrency(amount: number, currency: string = 'EUR'): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency,
  }).format(amount);
}

// Formatear fecha
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

// Generar checksum simple para documentos
export function generateChecksum(data: string): string {
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36).padStart(8, '0');
}
