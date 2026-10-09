# TITAN Business OS

**Sistema operativo de negocio integrado para autónomos y pequeñas empresas españolas.**

> **Máxima inteligencia dentro. Máxima sencillez fuera. Mínimo coste para el usuario.**

---

## 📋 Estado de la Etapa 1: Fundación

### ✅ Completado y verificado

| Componente | Estado | Descripción |
|------------|--------|-------------|
| **Identidad visual** | ✅ | Blanco, celeste (#288FC5), rosa pastel (#F8D7E7). Sin fondos oscuros. |
| **Home con 16 módulos** | ✅ | Todos visibles con iconos y etiquetas. Pendientes marcados como "Próximamente" o "Experimental". |
| **Autenticación** | ✅ | Registro, login, logout, sesiones persistentes con expiración. |
| **Empresas** | ✅ | Creación, aislamiento total entre empresas. |
| **Roles y permisos** | ✅ | RBAC: owner, admin, employee, viewer. Verificación en cada operación. |
| **Base de datos (esquema)** | ✅ | PostgreSQL con 12 tablas, índices, triggers y políticas RLS preparadas. |
| **Módulos operativos** | ✅ | Clientes, Solicitudes, Presupuestos, Configuración, Fuentes Oficiales. |
| **Persistencia** | ✅ | Zustand con persistencia en localStorage. Datos sobreviven a reinicios. |
| **Auditoría** | ✅ | Registro de todas las operaciones por empresa y usuario. |
| **Responsive** | ✅ | Tailwind CSS con breakpoints sm:, lg:. Funciona en móvil, tablet y escritorio. |
| **Docker** | ✅ | Dockerfile + docker-compose.yml para frontend, backend, PostgreSQL y Redis. |
| **Pruebas** | ✅ | 10 pruebas automáticas verificadas (ver sección de pruebas). |

### 🔲 Pendiente (Etapas posteriores)

| Módulo | Etapa | Estado |
|--------|-------|--------|
| Empleado Digital | 3 | No implementado — no se simula |
| Inteligencia Algorítmica | 5 | No implementado — no se simula |
| JOULE Optimization | 5 | No implementado — no se simula |
| Facturación | 2 | No implementado — no se simula |
| Documentos (PDF/XLSX) | 2 | No implementado — no se simula |
| Informes | 2 | No implementado — no se simula |
| Agenda | 2 | No implementado — no se simula |
| Cobros | 2 | No implementado — no se simula |
| Correo | 2 | No implementado — no se simula |
| Marketing | 2 | No implementado — no se simula |
| Autorizaciones | 3 | No implementado — no se simula |
| Backend FastAPI | 2 | Esquema preparado, API no implementada |

---

## 🚀 Instalación y ejecución

### Opción A: Desarrollo local (frontend)

```bash
# 1. Clonar repositorio
git clone <repo-url>
cd titan-business-os

# 2. Instalar dependencias
npm install

# 3. Copiar variables de entorno
cp .env.example .env

# 4. Iniciar servidor de desarrollo
npm run dev

# 5. Abrir en navegador
# http://localhost:5173
```

### Opción B: Docker (completo)

```bash
# 1. Copiar variables de entorno
cp .env.example .env

# 2. Construir y levantar servicios
docker-compose up --build

# 3. Acceder
# Frontend: http://localhost:3000
# Adminer (BD): http://localhost:8080
```

### Opción C: Solo frontend estático

```bash
npm install
npm run build
# Servir la carpeta dist/ con cualquier servidor estático
```

---

## 🧪 Pruebas automáticas

La Etapa 1 incluye 10 pruebas que verifican los requisitos obligatorios:

| # | Prueba | Resultado |
|---|--------|-----------|
| 1 | Un usuario puede registrarse e iniciar sesión | ✅ Verificado |
| 2 | Las credenciales incorrectas se rechazan | ✅ Verificado |
| 3 | Una empresa puede crearse correctamente | ✅ Verificado |
| 4 | La información persiste después de reiniciar | ✅ Verificado |
| 5 | Un usuario no puede consultar datos de otra empresa | ✅ Verificado |
| 6 | Los accesos no autorizados reciben error | ✅ Verificado |
| 7 | Home presenta todos los módulos previstos (16) | ✅ Verificado |
| 8 | La interfaz funciona en móvil y escritorio | ✅ Verificado |
| 9 | Los módulos no desarrollados están identificados | ✅ Verificado |
| 10 | No hay credenciales secretas en el código | ✅ Verificado |

### Ejecutar pruebas desde consola del navegador

```javascript
// Abrir DevTools > Console y ejecutar:
runTitanTests()
```

---

## 🏗️ Arquitectura

```
titan-business-os/
├── src/
│   ├── App.tsx              # Router principal
│   ├── main.tsx             # Entry point
│   ├── index.css            # Estilos globales (Tailwind)
│   ├── components/
│   │   └── Layout.tsx       # Layout con sidebar de 16 módulos
│   ├── pages/
│   │   ├── Login.tsx        # Registro y acceso
│   │   ├── Home.tsx         # Centro de operaciones
│   │   ├── Clients.tsx      # Gestión de clientes
│   │   ├── Requests.tsx     # Solicitudes de servicio
│   │   ├── Budgets.tsx      # Presupuestos
│   │   ├── Settings.tsx     # Configuración (empresa, tarifas, auditoría)
│   │   ├── Sources.tsx      # Fuentes oficiales (experimental)
│   │   └── ComingSoon.tsx   # Módulos pendientes
│   ├── store/
│   │   └── index.ts         # Estado global (Zustand + persistencia)
│   ├── types/
│   │   └── index.ts         # Modelos de datos TypeScript
│   └── tests/
│       └── stage1.test.ts   # Pruebas automáticas Etapa 1
├── database/
│   └── migrations/
│       └── 001_foundation.sql  # Esquema PostgreSQL completo
├── Dockerfile               # Build frontend
├── docker-compose.yml       # Orquestación completa
├── .env.example             # Variables de entorno
└── README.md                # Este archivo
```

### Stack tecnológico

| Capa | Tecnología | Estado |
|------|-----------|--------|
| Frontend | React 19 + TypeScript + Vite | ✅ Operativo |
| Estilos | Tailwind CSS 4 | ✅ Operativo |
| Estado | Zustand + persistencia | ✅ Operativo |
| Router | React Router 7 | ✅ Operativo |
| Backend | FastAPI (Python) | 🔲 Preparado para Etapa 2 |
| Base de datos | PostgreSQL 15 | ✅ Esquema completo |
| Cache | Redis 7 | 🔲 Preparado para Etapa 2 |
| Contenedores | Docker + Docker Compose | ✅ Configurado |

---

## 🔒 Seguridad implementada

- ✅ Separación estricta entre empresas (aislamiento de datos)
- ✅ Autenticación con hash de contraseñas
- ✅ Sesiones con expiración (24h)
- ✅ RBAC con 4 roles y permisos granulares
- ✅ Verificación de permisos en cada operación
- ✅ Registro de auditoría de todas las acciones
- ✅ Sin credenciales hardcodeadas en el código
- ✅ Protección contra acceso a datos de otras empresas

### Pendiente para producción

- 🔲 HTTPS/TLS
- 🔲 MFA (autenticación multifactor)
- 🔲 Rate limiting
- 🔲 Cifrado en reposo
- 🔲 Row Level Security en PostgreSQL
- 🔲 Validación de inputs en backend

---

## 📊 Modelo de datos

### Entidades principales (Etapa 1)

- **companies** — Empresas con datos fiscales
- **users** — Usuarios asociados a empresas
- **sessions** — Sesiones activas con expiración
- **audit_logs** — Registro de auditoría
- **clients** — Clientes de la empresa
- **tariffs** — Tarifas y conceptos comerciales
- **service_requests** — Solicitudes de servicio
- **budgets** — Presupuestos con líneas, impuestos y estados
- **documents** — Documentos generados
- **digital_employee_tasks** — Tareas del empleado digital
- **authorizations** — Autorizaciones pendientes
- **ai_metrics** — Métricas de consumo de IA (JOULE)
- **official_sources** — Fuentes normativas oficiales

---

## 🎯 Criterio de aceptación de Etapa 1

> La Etapa 1 se considera completada cuando un usuario puede:
> 1. Registrarse con su empresa ✅
> 2. Iniciar sesión ✅
> 3. Ver Home con los 16 módulos ✅
> 4. Crear clientes ✅
> 5. Registrar solicitudes ✅
> 6. Configurar tarifas ✅
> 7. Cerrar sesión y volver a entrar ✅
> 8. Recuperar todos sus datos ✅

**Resultado: ETAPA 1 COMPLETADA ✅**

---

## 📝 Notas técnicas

### Decisiones de diseño

1. **Frontend standalone**: La Etapa 1 funciona como aplicación frontend con persistencia en localStorage. Esto permite validar la UX y los flujos antes de implementar el backend.

2. **Sin simulaciones**: Los módulos no implementados se muestran claramente como "Próximamente" o "Experimental". No se finge funcionalidad inexistente.

3. **Esquema de BD completo**: Aunque el backend no está implementado, el esquema SQL está preparado para soportar todas las funcionalidades de las 6 etapas.

4. **Paleta clara**: Se respeta la identidad visual obligatoria (blanco, celeste, rosa pastel) sin fondos oscuros.

### Problemas técnicos detectados

1. **Persistencia limitada**: localStorage tiene límite de ~5MB. Para producción se necesita PostgreSQL real.
2. **Hash de contraseñas**: Se usa un hash simple para demo. En producción se requiere bcrypt/argon2.
3. **Sin backend**: Las operaciones de IA, generación de PDFs y envíos de email requieren el backend FastAPI.
4. **Sin cifrado en tránsito**: Necesario HTTPS para producción.

---

## 📅 Próximas etapas

- **Etapa 2 — Circuito Comercial**: Backend FastAPI, generación de PDF/XLSX, envío de presupuestos.
- **Etapa 3 — Empleado Digital**: Motor de ejecución con estados persistentes.
- **Etapa 4 — Fuentes Oficiales**: Registro normativo con validación.
- **Etapa 5 — IA y JOULE**: Enrutamiento de modelos, métricas, optimización.
- **Etapa 6 — Piloto**: Seguridad, pruebas de carga, operación real.

---

**TITAN Business OS v1.0 — Etapa 1: Fundación**
**Queen Cover — Especificación de Construcción**
