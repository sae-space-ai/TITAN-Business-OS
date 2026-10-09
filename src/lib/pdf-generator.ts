/**
 * TITAN Business OS — Generador de PDF para Presupuestos
 * 
 * Genera documentos PDF profesionales desde datos de presupuesto.
 * Los importes deben coincidir exactamente con los de la base de datos.
 */

import jsPDF from 'jspdf';
import { Budget, Company, Client } from '../types';
import { formatCurrency, formatDate } from './calculations';

export interface PDFGenerationResult {
  dataUrl: string;
  fileSize: number;
  checksum: string;
}

export function generateBudgetPDF(
  budget: Budget,
  company: Company,
  client: Client
): PDFGenerationResult {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let y = 20;

  // --- CABECERA: Identidad de la empresa ---
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(40, 143, 197); // Azul celeste TITAN
  doc.text(company.commercialName, margin, y);
  
  y += 6;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text(company.name, margin, y);
  
  y += 4;
  doc.text(`NIF: ${company.taxId}`, margin, y);
  
  if (company.address) {
    y += 4;
    doc.text(company.address, margin, y);
  }
  
  if (company.city) {
    y += 4;
    doc.text(`${company.postalCode || ''} ${company.city}${company.province ? ` (${company.province})` : ''}`, margin, y);
  }

  // --- TIPO DE DOCUMENTO (derecha) ---
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(40, 143, 197);
  doc.text('PRESUPUESTO', pageWidth - margin, 20, { align: 'right' });
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  doc.text(`Nº ${budget.number}`, pageWidth - margin, 28, { align: 'right' });
  doc.text(`Versión ${budget.version}`, pageWidth - margin, 33, { align: 'right' });
  doc.text(`Fecha: ${formatDate(budget.createdAt)}`, pageWidth - margin, 38, { align: 'right' });

  // --- ESTADO ---
  const statusLabels: Record<string, string> = {
    draft: 'BORRADOR',
    pending_approval: 'PENDIENTE APROBACIÓN',
    approved: 'APROBADO',
    rejected: 'RECHAZADO',
    sent: 'ENVIADO',
    expired: 'CADUCADO',
  };
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(150, 150, 150);
  doc.text(`Estado: ${statusLabels[budget.status] || budget.status}`, pageWidth - margin, 44, { align: 'right' });

  // Línea separadora
  y = 55;
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);

  // --- DATOS DEL CLIENTE ---
  y += 10;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(60, 60, 60);
  doc.text('CLIENTE', margin, y);
  
  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(40, 40, 40);
  doc.text(client.name, margin, y);
  
  if (client.taxId) {
    y += 5;
    doc.text(`NIF: ${client.taxId}`, margin, y);
  }
  
  if (client.address) {
    y += 5;
    doc.text(client.address, margin, y);
  }
  
  if (client.email || client.phone) {
    y += 5;
    const contact = [client.email, client.phone].filter(Boolean).join(' | ');
    doc.text(contact, margin, y);
  }

  // --- TABLA DE CONCEPTOS ---
  y += 15;
  
  // Encabezados de tabla
  const colX = {
    desc: margin,
    qty: pageWidth - 90,
    price: pageWidth - 65,
    subtotal: pageWidth - margin - 5,
  };
  
  doc.setFillColor(234, 247, 254); // Celeste claro
  doc.rect(margin, y - 4, pageWidth - 2 * margin, 8, 'F');
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(60, 60, 60);
  doc.text('DESCRIPCIÓN', colX.desc + 2, y);
  doc.text('CANT.', colX.qty, y, { align: 'right' });
  doc.text('PRECIO', colX.price, y, { align: 'right' });
  doc.text('SUBTOTAL', colX.subtotal, y, { align: 'right' });
  
  y += 8;
  
  // Líneas del presupuesto
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(40, 40, 40);
  doc.setFontSize(9);
  
  budget.lines.forEach((line) => {
    // Descripción (con wrap si es muy larga)
    const descLines = doc.splitTextToSize(line.description, colX.qty - colX.desc - 10);
    descLines.forEach((lineText: string, i: number) => {
      if (y > 260) {
        doc.addPage();
        y = 20;
      }
      doc.text(lineText, colX.desc + 2, y);
      y += 4;
    });
    
    // Cantidad, precio y subtotal en la última línea de la descripción
    const lastY = y - 4;
    doc.text(String(line.quantity), colX.qty, lastY, { align: 'right' });
    doc.text(formatCurrency(line.unitPrice), colX.price, lastY, { align: 'right' });
    doc.text(formatCurrency(line.subtotal), colX.subtotal, lastY, { align: 'right' });
    
    y += 4;
  });

  // --- TOTALES ---
  y += 5;
  doc.setDrawColor(200, 200, 200);
  doc.line(pageWidth - 100, y, pageWidth - margin, y);
  
  y += 8;
  doc.setFontSize(9);
  doc.setTextColor(60, 60, 60);
  
  // Base imponible
  doc.text('Base imponible:', pageWidth - 100, y);
  doc.text(formatCurrency(budget.taxBase), pageWidth - margin, y, { align: 'right' });
  
  // Descuento si existe
  if (budget.discount > 0) {
    y += 5;
    doc.text('Descuento:', pageWidth - 100, y);
    doc.text(`-${formatCurrency(budget.discount)}`, pageWidth - margin, y, { align: 'right' });
  }
  
  // IVA
  y += 5;
  doc.text(`IVA (${budget.taxRate}%):`, pageWidth - 100, y);
  doc.text(formatCurrency(budget.taxAmount), pageWidth - margin, y, { align: 'right' });
  
  // TOTAL
  y += 8;
  doc.setDrawColor(40, 143, 197);
  doc.setLineWidth(0.8);
  doc.line(pageWidth - 100, y - 3, pageWidth - margin, y - 3);
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(40, 143, 197);
  doc.text('TOTAL:', pageWidth - 100, y);
  doc.text(formatCurrency(budget.total), pageWidth - margin, y, { align: 'right' });

  // --- CONDICIONES ---
  if (budget.conditions || budget.notes) {
    y += 15;
    if (y > 250) {
      doc.addPage();
      y = 20;
    }
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(60, 60, 60);
    doc.text('CONDICIONES', margin, y);
    
    y += 5;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    doc.setFontSize(8);
    
    const conditionsText = [
      budget.conditions ? `Condiciones: ${budget.conditions}` : '',
      `Validez: ${budget.validityDays} días desde la fecha de emisión`,
      budget.notes ? `Notas: ${budget.notes}` : '',
    ].filter(Boolean).join('\n');
    
    const conditionLines = doc.splitTextToSize(conditionsText, pageWidth - 2 * margin);
    conditionLines.forEach((line: string) => {
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
      doc.text(line, margin, y);
      y += 4;
    });
  }

  // --- PIE DE PÁGINA ---
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(150, 150, 150);
    doc.text(
      `PRESUPUESTO — ${company.commercialName} — ${budget.number} v${budget.version} — Página ${i} de ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
    doc.text(
      'Este documento es un presupuesto, no una factura emitida.',
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 6,
      { align: 'center' }
    );
  }

  // Generar data URL
  const dataUrl = doc.output('datauristring');
  const fileSize = Math.round((dataUrl.length * 0.75) / 1024); // Estimación en KB
  
  // Calcular checksum
  let checksum = 0;
  for (let i = 0; i < dataUrl.length; i++) {
    checksum = ((checksum << 5) - checksum) + dataUrl.charCodeAt(i);
    checksum = checksum & checksum;
  }
  const checksumStr = Math.abs(checksum).toString(36).padStart(8, '0');

  return {
    dataUrl,
    fileSize,
    checksum: checksumStr,
  };
}
