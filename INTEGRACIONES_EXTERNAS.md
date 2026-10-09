# 🔗 INTEGRACIONES EXTERNAS — TITAN BUSINESS OS
## Estado y Requisitos de Activación

**Fecha:** Enero 2026  
**Estado:** Documentación completada. Integraciones pendientes de configuración.

---

## 📊 RESUMEN DE INTEGRACIONES

| Módulo | Integración | Estado | Requisito | Coste estimado |
|--------|-------------|--------|-----------|----------------|
| Correo | Gmail/Outlook | ⚠️ Pendiente | OAuth 2.0 | Gratis |
| Marketing | Email marketing | ⚠️ Pendiente | API key | 20-100€/mes |
| Facturación | Proveedor conforme | ⚠️ Pendiente | API + certificación | 20-50€/mes |
| Cobros | Pasarela de pagos | ⚠️ Pendiente | API + contrato | Variable |
| IA avanzada | OpenAI/Anthropic | ⚠️ Pendiente | API key | Variable |
| Calendario | Google Calendar | ⚠️ Pendiente | OAuth 2.0 | Gratis |

---

## 📧 CORREO — Gmail/Outlook

### Estado actual
- ✅ Lógica funcional completa
- ✅ Gestión de borradores
- ✅ Solicitudes de aprobación
- ✅ Adaptadores preparados
- ⚠️ Envío real pendiente de OAuth

### Requisitos de activación

#### Gmail
1. Crear proyecto en Google Cloud Console
2. Habilitar Gmail API
3. Configurar OAuth 2.0
4. Obtener Client ID y Client Secret
5. Configurar URI de redirección
6. Implementar flujo de autorización

#### Outlook/Microsoft 365
1. Registrar aplicación en Azure AD
2. Configurar permisos Mail.ReadWrite
3. Obtener Client ID y Client Secret
4. Implementar flujo OAuth 2.0

### Coste
- **Gmail/Outlook:** Gratis (incluido en cuenta)
- **Desarrollo:** 1-2 semanas

### Tiempo de integración
- Configuración OAuth: 2-3 días
- Pruebas: 2-3 días
- **Total:** 1 semana

### Documentación técnica
- Gmail API: https://developers.google.com/gmail/api
- Microsoft Graph: https://learn.microsoft.com/es-es/graph/api/overview

---

## 📢 MARKETING — Email Marketing

### Estado actual
- ✅ Gestión de campañas completa
- ✅ Segmentación de contactos
- ✅ Métricas preparadas
- ✅ Cumplimiento RGPD documentado
- ⚠️ Envío real pendiente de proveedor

### Proveedores recomendados

#### Mailchimp
- **Ventajas:** Popular, buena documentación, plan gratuito
- **Coste:** Gratis hasta 500 contactos, luego 10-50€/mes
- **API:** REST API v3
- **Integración:** 1-2 semanas

#### Sendinblue (Brevo)
- **Ventajas:** Español, buen precio, GDPR compliant
- **Coste:** Gratis hasta 300 emails/día, luego 20-40€/mes
- **API:** REST API
- **Integración:** 1-2 semanas

#### Mailgun
- **Ventajas:** Orientado a desarrolladores, potente
- **Coste:** 0.80€ por 1000 emails
- **API:** REST API
- **Integración:** 1 semana

### Requisitos de activación
1. Contratar cuenta en proveedor
2. Obtener API key
3. Configurar dominio y SPF/DKIM
4. Implementar llamadas API
5. Validar cumplimiento RGPD
6. Pruebas con datos reales

### Coste total estimado
- Proveedor: 20-50€/mes
- Desarrollo: 1-2 semanas
- **Total:** 20-50€/mes + desarrollo

---

## 🧾 FACTURACIÓN — Proveedor Conforme

### Estado actual
- ✅ Borradores operativos
- ✅ Cálculos fiscales
- ✅ Series y numeración
- ✅ Documentación legal completa
- ⚠️ Emisión fiscal pendiente de proveedor

### Proveedores recomendados

#### FacturaDirecta
- **Ventajas:** Español, Veri*factu ready, buen soporte
- **Coste:** 25-45€/mes
- **API:** REST API
- **Integración:** 2-3 semanas

#### Holded
- **Ventajas:** ERP completo, facturación + contabilidad
- **Coste:** 30-60€/mes
- **API:** REST API
- **Integración:** 3-4 semanas

#### Anfix
- **Ventajas:** Especializado en autónomos, Veri*factu
- **Coste:** 20-40€/mes
- **API:** REST API
- **Integración:** 2-3 semanas

### Requisitos de activación
1. Contratar proveedor conforme
2. Obtener credenciales API
3. Implementar integración
4. Validar flujos de emisión
5. Pruebas con AEAT (si aplica)
6. Activar producción

### Coste total estimado
- Proveedor: 20-60€/mes
- Desarrollo: 2-4 semanas
- **Total:** 20-60€/mes + desarrollo

### Documentación legal
Ver: `VALIDACION_LEGAL_FACTURACION.md`

---

## 💰 COBROS — Pasarela de Pagos

### Estado actual
- ✅ Gestión de pagos
- ✅ Estados y historial
- ✅ Adaptadores preparados
- ⚠️ Confirmación real pendiente

### Proveedores recomendados

#### Stripe
- **Ventajas:** Global, buena documentación, fácil integración
- **Coste:** 1.4% + 0.25€ por transacción (Europa)
- **API:** REST API + Webhooks
- **Integración:** 1-2 semanas

#### Redsys
- **Ventajas:** Español, bancos españoles
- **Coste:** Variable según banco (0.5-1.5%)
- **API:** SOAP/REST
- **Integración:** 2-3 semanas

#### PayPal
- **Ventajas:** Popular, fácil de usar
- **Coste:** 2.9% + 0.35€ por transacción
- **API:** REST API
- **Integración:** 1 semana

### Requisitos de activación
1. Contratar pasarela de pagos
2. Obtener credenciales API
3. Configurar webhooks
4. Implementar flujo de pago
5. Pruebas en sandbox
6. Activar producción

### Coste total estimado
- Pasarela: Variable (1-3% por transacción)
- Desarrollo: 1-3 semanas
- **Total:** Variable + desarrollo

---

## 🤖 IA AVANZADA — OpenAI/Anthropic

### Estado actual
- ✅ Motor determinista operativo
- ✅ JOULE Nivel 3 (optimización activa)
- ✅ Arquitectura preparada
- ⚠️ Modelos avanzados pendientes de API

### Proveedores

#### OpenAI
- **Modelos:** GPT-4o, GPT-4o-mini
- **Coste:** Variable según uso
  - GPT-4o-mini: $0.15/1M tokens input
  - GPT-4o: $2.50/1M tokens input
- **API:** REST API
- **Integración:** 1-2 días

#### Anthropic
- **Modelos:** Claude 3.5 Sonnet, Claude 3 Opus
- **Coste:** Variable según uso
  - Claude 3.5 Sonnet: $3/1M tokens input
- **API:** REST API
- **Integración:** 1-2 días

### Requisitos de activación
1. Crear cuenta en proveedor
2. Obtener API key
3. Configurar en TITAN (Configuración > IA)
4. Probar con tareas reales
5. Ajustar políticas JOULE

### Coste total estimado
- API: Variable (5-50€/mes según uso)
- Desarrollo: 1-2 días
- **Total:** 5-50€/mes

---

## 📅 CALENDARIO — Google Calendar

### Estado actual
- ✅ Agenda operativa
- ✅ Gestión de eventos
- ⚠️ Sincronización pendiente

### Requisitos de activación
1. Crear proyecto en Google Cloud Console
2. Habilitar Google Calendar API
3. Configurar OAuth 2.0
4. Obtener credenciales
5. Implementar sincronización
6. Gestión de conflictos

### Coste
- **Google Calendar:** Gratis
- **Desarrollo:** 1 semana

---

## 📋 PLAN DE ACTIVACIÓN RECOMENDADO

### Prioridad Alta (ROI inmediato)

1. **IA avanzada** (1-2 días)
   - Configurar API OpenAI
   - Coste: 5-20€/mes
   - Beneficio: Análisis avanzado

2. **Correo** (1 semana)
   - Configurar OAuth Gmail
   - Coste: Gratis
   - Beneficio: Envío real de correos

### Prioridad Media (funcionalidad completa)

3. **Facturación** (2-4 semanas)
   - Contratar proveedor conforme
   - Coste: 20-60€/mes
   - Beneficio: Emisión fiscal legal

4. **Marketing** (1-2 semanas)
   - Contratar proveedor email
   - Coste: 20-50€/mes
   - Beneficio: Campañas reales

### Prioridad Baja (según necesidad)

5. **Cobros** (1-3 semanas)
   - Contratar pasarela pagos
   - Coste: Variable (1-3%)
   - Beneficio: Cobros automáticos

6. **Calendario** (1 semana)
   - Configurar Google Calendar
   - Coste: Gratis
   - Beneficio: Sincronización

---

## 💡 RECOMENDACIONES

### Para autónomos
1. Activar IA avanzada (OpenAI) — 5-20€/mes
2. Configurar Correo (Gmail) — Gratis
3. Evaluar Facturación según volumen

### Para pymes
1. Activar todas las integraciones
2. Priorizar Facturación conforme
3. Implementar Marketing si hay campañas

### Coste total estimado (escenario completo)
- IA: 20€/mes
- Correo: Gratis
- Facturación: 40€/mes
- Marketing: 30€/mes
- Cobros: Variable
- **Total fijo:** ~90€/mes
- **Total variable:** Según uso

---

## 🔒 SEGURIDAD EN INTEGRACIONES

### Principios aplicados
- ✅ OAuth 2.0 para autenticación
- ✅ Tokens con expiración
- ✅ Cifrado en tránsito (HTTPS)
- ✅ Almacenamiento seguro de credenciales
- ✅ Permisos mínimos necesarios
- ✅ Registro de auditoría

### Pendiente
- ⚠️ Rotación automática de tokens
- ⚠️ Monitorización de uso
- ⚠️ Alertas de seguridad

---

## 📝 ACCIONES REQUERIDAS DEL PROPIETARIO

### Inmediatas
1. **Decidir qué integraciones activar**
2. **Contratar proveedores necesarios**
3. **Proporcionar credenciales API**

### Para cada integración
1. Crear cuenta en proveedor
2. Obtener API keys/credenciales
3. Configurar en TITAN
4. Validar funcionamiento
5. Activar producción

---

## 🏁 ESTADO FINAL

**Integraciones preparadas:** 6  
**Integraciones activas:** 0  
**Integraciones pendientes:** 6  

**Coste mínimo para funcionalidad completa:** ~90€/mes  
**Tiempo estimado de activación completa:** 6-10 semanas  

**Recomendación:** Activar primero IA y Correo (coste bajo, beneficio alto).

---

**TITAN Business OS — Integraciones Externas**  
*Guía completa de activación de integraciones*
