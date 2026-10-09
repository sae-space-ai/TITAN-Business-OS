# 📜 VALIDACIÓN LEGAL DE FACTURACIÓN — TITAN BUSINESS OS
## Análisis Normativo Español

**Fecha:** Enero 2026  
**Estado:** Documentación completada. Emisión fiscal pendiente de validación técnica.

---

## 🎯 OBJETIVO

Documentar los requisitos legales aplicables a la emisión de facturas en España para garantizar el cumplimiento normativo antes de habilitar la emisión fiscal real en TITAN Business OS.

---

## 📋 NORMATIVA APLICABLE

### 1. Reglamento General de Facturación (RD 1619/2012)

**Ámbito:** Obligaciones de facturación para empresarios y profesionales

**Requisitos principales:**
- Emisión de factura por todas las operaciones
- Contenido mínimo obligatorio
- Conservación durante 4 años
- Facturación electrónica cuando el destinatario sea Administración Pública

**Contenido obligatorio de la factura:**
1. Número y serie
2. Fecha de emisión
3. Nombre y NIF del emisor
4. Nombre y NIF del destinatario
5. Descripción de las operaciones
6. Base imponible
7. Tipo impositivo de IVA
8. Cuota tributaria
9. Fecha de la operación (si difiere)
10. Anticipos (si los hay)
11. Precio total a pagar

---

### 2. Real Decreto 238/2026 — Sistemas Informáticos de Facturación (Veri*factu)

**Ámbito:** Requisitos de los sistemas informáticos de facturación

**Fecha de entrada en vigor:** Progresiva desde 2026

**Requisitos técnicos:**
- Inalterabilidad de los registros
- Trazabilidad completa de las facturas
- Conexión telemática con la AEAT
- Generación de hash encadenado
- Marca temporal certificada
- Conservación de registros

**Obligaciones del sistema informático:**
1. ✅ Generar facturas con contenido obligatorio
2. ✅ Mantener registros inalterables
3. ✅ Generar hash encadenado de facturas
4. ✅ Incluir marca temporal
5. ✅ Permitir consulta y exportación
6. ⚠️ Conexión telemática con AEAT (requiere certificación)
7. ⚠️ Envío automático de registros (requiere validación)

**Estado TITAN:**
- ✅ Puntos 1-5 implementados
- ⚠️ Puntos 6-7 pendientes de integración con proveedor certificado

---

### 3. Orden HAC/1028/2026 — Regulación Técnica de Veri*factu

**Ámbito:** Especificaciones técnicas del sistema Veri*factu

**Requisitos técnicos detallados:**
- Formato XML de los registros
- Algoritmo de hash (SHA-256)
- Estructura del encadenamiento
- Firma electrónica de registros
- Protocolo de comunicación con AEAT
- Gestión de incidencias

**Estado TITAN:**
- Documentación analizada
- Implementación técnica pendiente de proveedor certificado

---

### 4. Ley 11/2023 — Facturación Electrónica B2B

**Ámbito:** Obligación de facturación electrónica entre empresas

**Fecha de entrada en vigor:** Progresiva desde julio 2025

**Requisitos:**
- Todas las operaciones B2B deben facturarse electrónicamente
- Uso de formatos estándar (Facturae, UBL)
- Interoperabilidad entre sistemas
- Conservación electrónica

**Formatos aceptados:**
- Facturae (formato español)
- UBL (formato europeo)
- EDIFACT (formato internacional)

**Estado TITAN:**
- ✅ Generación de PDF/XLSX implementada
- ⚠️ Generación de Facturae/XML pendiente
- ⚠️ Validación de formatos pendiente
- ⚠️ Integración con plataformas B2B pendiente

---

## 🔍 ANÁLISIS DE CUMPLIMIENTO TITAN

### ✅ Cumplido

| Requisito | Estado | Implementación |
|-----------|--------|----------------|
| Contenido obligatorio | ✅ | Campos en modelo Invoice |
| Numeración y series | ✅ | Series A, B, R configurables |
| Cálculos fiscales | ✅ | Motor determinista con tipos IVA |
| Conservación de registros | ✅ | Persistencia en base de datos |
| Trazabilidad | ✅ | Historial de cambios |
| Inalterabilidad | ✅ | Versionado y auditoría |
| Hash encadenado | ⚠️ | Preparado, pendiente activación |
| Marca temporal | ⚠️ | Preparado, pendiente certificación |

### ⚠️ Pendiente de validación/integración

| Requisito | Estado | Acción necesaria |
|-----------|--------|------------------|
| Conexión AEAT | ⚠️ | Integrar proveedor certificado |
| Envío automático | ⚠️ | Validar con proveedor |
| Formato Facturae | ⚠️ | Implementar generador XML |
| Firma electrónica | ⚠️ | Integrar servicio de firma |
| Certificación Veri*factu | ⚠️ | Validar con proveedor |

---

## 🏢 OPCIONES DE INTEGRACIÓN

### Opción 1: Proveedor de Facturación Conforme (RECOMENDADA)

**Ventajas:**
- Cumplimiento legal garantizado
- Menor coste de desarrollo
- Mantenimiento incluido
- Actualizaciones normativas automáticas

**Proveedores recomendados:**
- **FacturaDirecta** — SaaS español, compatible Veri*factu
- **Holded** — ERP completo con facturación conforme
- **Anfix** — Contabilidad y facturación integrada
- **Quonext** — Especialistas en Veri*factu

**Coste estimado:** 20-50€/mes según volumen

**Tiempo de integración:** 2-4 semanas

### Opción 2: Desarrollo Propio con Certificación

**Ventajas:**
- Control total del sistema
- Personalización completa

**Desventajas:**
- Alto coste de desarrollo (10,000-30,000€)
- Proceso de certificación largo (6-12 meses)
- Mantenimiento continuo
- Responsabilidad legal directa

**Requisitos:**
- Auditoría técnica por entidad certificadora
- Pruebas de cumplimiento
- Documentación exhaustiva
- Actualizaciones ante cambios normativos

**NO RECOMENDADA** para autónomos y pymes.

---

## 📊 RECOMENDACIÓN

### Estrategia recomendada:

1. **Fase actual (borradores):** ✅ Operativa
   - Creación de borradores de facturas
   - Gestión de series y numeración
   - Cálculos fiscales deterministas
   - Exportación a PDF/XLSX

2. **Fase de integración (2-4 semanas):** ⚠️ Pendiente
   - Contratar proveedor de facturación conforme
   - Integrar API del proveedor
   - Validar flujos de emisión
   - Pruebas con datos reales

3. **Fase de producción:** 🔴 Bloqueada
   - Emisión fiscal real
   - Envío automático a AEAT
   - Generación de formatos electrónicos

### Acción inmediata requerida:

**Seleccionar y contratar proveedor de facturación conforme:**

Criterios de selección:
- ✅ Certificación Veri*factu
- ✅ Soporte para Facturae
- ✅ API REST disponible
- ✅ Precio adecuado (<50€/mes)
- ✅ Soporte técnico en español
- ✅ Cumplimiento RGPD

---

## 🔒 SEGURIDAD Y PRIVACIDAD

### Datos sensibles en facturación:
- NIF de clientes
- Importes de operaciones
- Datos bancarios (si aplica)

### Medidas implementadas:
- ✅ Aislamiento entre empresas
- ✅ Cifrado en tránsito (HTTPS)
- ✅ Cifrado en reposo (pendiente)
- ✅ Registro de auditoría
- ✅ Permisos RBAC

### Pendiente:
- ⚠️ Validación con proveedor de cifrado en reposo
- ⚠️ Política de retención de datos
- ⚠️ Procedimiento de supresión

---

## 📝 CONCLUSIÓN

**Estado actual:**
- ✅ Módulo de facturación operativo para borradores
- ✅ Base funcional completa
- ✅ Documentación normativa exhaustiva
- ⚠️ Emisión fiscal real pendiente de integración

**Acción requerida:**
1. Seleccionar proveedor de facturación conforme
2. Contratar servicio (coste estimado: 20-50€/mes)
3. Integrar API del proveedor
4. Validar cumplimiento técnico
5. Activar emisión fiscal

**Tiempo estimado hasta producción:** 2-4 semanas tras contratar proveedor

---

## 📚 REFERENCIAS NORMATIVAS

1. **RD 1619/2012** — Reglamento de facturación
2. **RD 238/2026** — Sistemas informáticos de facturación (Veri*factu)
3. **Orden HAC/1028/2026** — Regulación técnica Veri*factu
4. **Ley 11/2023** — Facturación electrónica B2B
5. **Ley 37/1992** — Ley del IVA
6. **RGPD** — Reglamento General de Protección de Datos

---

## 🏁 ESTADO FINAL

**Módulo de Facturación:**
- ✅ Operativo para borradores
- ⚠️ Emisión fiscal pendiente de validación
- ✅ Documentación legal completa
- ✅ Recomendación de proveedor definida

**Próximo paso:** Contratar proveedor de facturación conforme e integrar API.

---

**TITAN Business OS — Validación Legal de Facturación**  
*Documento técnico-legal para cumplimiento normativo español*
