/**
 * TITAN Business OS — Generador de XLSX para Presupuestos
 * 
 * Genera documentos XLSX profesionales desde datos de presupuesto.
 * Los importes deben coincidir exactamente con los de la base de datos.
 */

import * as XLSX from 'xlsx';
import { Budget, Company, Client } from '../types';
import { formatCurrency, formatDate } from './calculations';

export interface XLSXGenerationResult {
  dataUrl: string;
  fileSize: number;
  checksum: string;
}

export function generateBudgetXLSX(
  budget: Budget,
  company: Company,
  client: Client
): XLSXGenerationResult {
  // --- HOJA 1: DATOS DEL PRESUPUESTO ---
  const statusLabels: Record<string, string> = {
    draft: 'Borrador',
    pending_approval: 'Pendiente aprobación',
    approved: 'Aprobado',
    rejected: 'Rechazado',
    sent: 'Enviado',
    expired: 'Caducado',
  };

  const headerData = [
    ['PRESUPUESTO'],
    [],
    ['Empresa', company.commercialName],
    ['Razón Social', company.name],
    ['NIF', company.taxId],
    ['Dirección', company.address || ''],
    ['Ciudad', `${company.postalCode || ''} ${company.city || ''}`.trim()],
    [],
    ['Cliente', client.name],
    ['NIF Cliente', client.taxId || ''],
    ['Email', client.email || ''],
    ['Teléfono', client.phone || ''],
    [],
    ['Número', budget.number],
    ['Versión', budget.version],
    ['Fecha', formatDate(budget.createdAt)],
    ['Estado', statusLabels[budget.status] || budget.status],
    ['Validez', `${budget.validityDays} días`],
  ];

  const wsHeader = XLSX.utils.aoa_to_sheet(headerData);
  
  // Ajustar anchos de columna
  wsHeader['!cols'] = [
    { wch: 15 },
    { wch: 40 },
  ];

  // --- HOJA 2: CONCEPTOS ---
  const conceptsData = [
    ['CONCEPTOS DEL PRESUPUESTO'],
    [],
    ['Descripción', 'Cantidad', 'Precio Unitario', 'Descuento (%)', 'Subtotal'],
    ...budget.lines.map(line => [
      line.description,
      line.quantity,
      line.unitPrice,
      line.discount,
      line.subtotal,
    ]),
    [],
    [],
    ['', '', '', 'Base Imponible:', budget.taxBase],
    ['', '', '', 'IVA (' + budget.taxRate + '%):', budget.taxAmount],
    ['', '', '', 'TOTAL:', budget.total],
  ];

  const wsConcepts = XLSX.utils.aoa_to_sheet(conceptsData);
  
  // Formato de celdas numéricas
  const range = XLSX.utils.decode_range(wsConcepts['!ref'] || 'A1');
  for (let R = 3; R <= budget.lines.length + 2; R++) {
    // Cantidad
    const qtyCell = XLSX.utils.encode_cell({ r: R, c: 1 });
    if (wsConcepts[qtyCell]) wsConcepts[qtyCell].z = '#,##0.00';
    
    // Precio
    const priceCell = XLSX.utils.encode_cell({ r: R, c: 2 });
    if (wsConcepts[priceCell]) wsConcepts[priceCell].z = '#,##0.00 €';
    
    // Descuento
    const discCell = XLSX.utils.encode_cell({ r: R, c: 3 });
    if (wsConcepts[discCell]) wsConcepts[discCell].z = '0.00%';
    
    // Subtotal
    const subCell = XLSX.utils.encode_cell({ r: R, c: 4 });
    if (wsConcepts[subCell]) wsConcepts[subCell].z = '#,##0.00 €';
  }

  // Formato de totales
  const totalRow = budget.lines.length + 6;
  const baseCell = XLSX.utils.encode_cell({ r: totalRow, c: 4 });
  if (wsConcepts[baseCell]) wsConcepts[baseCell].z = '#,##0.00 €';
  
  const ivaCell = XLSX.utils.encode_cell({ r: totalRow + 1, c: 4 });
  if (wsConcepts[ivaCell]) wsConcepts[ivaCell].z = '#,##0.00 €';
  
  const totalCell = XLSX.utils.encode_cell({ r: totalRow + 2, c: 4 });
  if (wsConcepts[totalCell]) {
    wsConcepts[totalCell].z = '#,##0.00 €';
    wsConcepts[totalCell].s = { font: { bold: true } };
  }

  wsConcepts['!cols'] = [
    { wch: 40 },
    { wch: 12 },
    { wch: 15 },
    { wch: 12 },
    { wch: 15 },
  ];

  // --- HOJA 3: CONDICIONES ---
  const conditionsData = [
    ['CONDICIONES DEL PRESUPUESTO'],
    [],
    ['Condiciones comerciales:'],
    [budget.conditions || 'No especificadas'],
    [],
    ['Notas:'],
    [budget.notes || 'Sin notas'],
    [],
    ['Validez del presupuesto:'],
    [`${budget.validityDays} días desde la fecha de emisión`],
    [],
    ['Tratamiento fiscal:'],
    [`IVA ${budget.taxRate}% aplicado sobre base imponible`],
    [],
    ['IMPORTANTE:'],
    ['Este documento es un presupuesto, no una factura emitida.'],
  ];

  const wsConditions = XLSX.utils.aoa_to_sheet(conditionsData);
  wsConditions['!cols'] = [{ wch: 80 }];

  // Crear libro de trabajo
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, wsHeader, 'Presupuesto');
  XLSX.utils.book_append_sheet(wb, wsConcepts, 'Conceptos');
  XLSX.utils.book_append_sheet(wb, wsConditions, 'Condiciones');

  // Generar buffer
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'base64' });
  const dataUrl = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${wbout}`;
  const fileSize = Math.round((wbout.length * 0.75) / 1024); // Estimación en KB

  // Calcular checksum
  let checksum = 0;
  for (let i = 0; i < wbout.length; i++) {
    checksum = ((checksum << 5) - checksum) + wbout.charCodeAt(i);
    checksum = checksum & checksum;
  }
  const checksumStr = Math.abs(checksum).toString(36).padStart(8, '0');

  return {
    dataUrl,
    fileSize,
    checksum: checksumStr,
  };
}
