# 💰 FinanSmart - Aplicación de Finanzas Personales

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-18.3.1-61dafb.svg)

**Plataforma integral de educación y gestión financiera personal con IA local**

[Características](#características) • [Instalación](#instalación) • [Uso](#uso) • [Documentación](#documentación)

</div>

---

## 📋 Tabla de Contenidos

- [Descripción General](#descripción-general)
- [Características Principales](#características-principales)
- [Arquitectura del Sistema](#arquitectura-del-sistema)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Uso](#uso)
- [Módulos del Sistema](#módulos-del-sistema)
- [Sistema de Gamificación](#sistema-de-gamificación)
- [Sistema de IA Local](#sistema-de-ia-local)
- [Base de Datos](#base-de-datos)
- [API Endpoints](#api-endpoints)
- [Flujo de Trabajo para Desarrolladores](#flujo-de-trabajo-para-desarrolladores)
- [Contribución](#contribución)
- [Licencia](#licencia)

---

## 🎯 Descripción General

**FinanSmart** es una aplicación web completa de gestión de finanzas personales diseñada para ayudar a los usuarios a tomar control de su salud financiera mediante:

- 📊 **Gestión inteligente** de ingresos, gastos y metas financieras
- 🎓 **Educación financiera** interactiva con 16 lecciones y quizzes
- 🎮 **Gamificación** con desafíos, insignias y sistema de puntos
- 🤖 **Recomendaciones IA** personalizadas usando modelos locales (Ollama)
- 📈 **Análisis y estadísticas** visuales en tiempo real
- 🎯 **Metas de ahorro y gasto** con seguimiento automático

La aplicación está diseñada para ser intuitiva, educativa y motivadora, combinando las mejores prácticas de finanzas personales con técnicas de gamificación para fomentar hábitos financieros saludables.

## ✨ Características Principales

### 💼 Gestión Financiera

- ✅ Registro de ingresos y gastos por categorías
- ✅ Dashboard interactivo con métricas en tiempo real
- ✅ Cálculo automático de balance y saldo disponible
- ✅ Historial de transacciones con filtros y búsqueda
- ✅ Análisis de gastos por categoría y período

### 🎯 Sistema de Metas

- ✅ **Metas de Ahorro**: Define objetivos de ahorro con seguimiento de progreso
- ✅ **Metas de Gasto**: Establece límites mensuales (monto fijo o porcentaje de ingresos)
- ✅ Actualización automática de progreso
- ✅ Alertas visuales cuando te acercas o excedes límites
- ✅ Recompensas por completar metas (+100 puntos)

### 🎓 Módulo Educativo

- ✅ 16 lecciones organizadas en 4 módulos temáticos:
  - 📚 **Módulo 1**: Fundamentos de Finanzas Personales
  - 💰 **Módulo 2**: Presupuesto y Control de Gastos
  - 🏦 **Módulo 3**: Ahorro e Inversión
  - 💳 **Módulo 4**: Manejo de Deudas
- ✅ Quizzes interactivos en cada lección (4 opciones)
- ✅ Seguimiento de progreso educativo
- ✅ Duración estimada: 57 minutos de contenido total
- ✅ Contenido adaptado al contexto colombiano

### 🎮 Sistema de Gamificación

- ✅ **5 Desafíos Progresivos**:

  1. Registra tu primera meta (100 pts)
  2. Crea 3 metas de ahorro (200 pts)
  3. 7 días consecutivos con gastos (150 pts)
  4. Completa una meta de ahorro (300 pts)
  5. Completa 3 lecciones educativas (500 pts)

- ✅ **6 Insignias Desbloqueables**:

  - 🌱 Principiante (primera transacción)
  - 💰 Ahorrador Novato (primera meta)
  - ⭐ Meta Cumplida (completa 1 meta)
  - 🏆 Maestro del Ahorro (5 metas)
  - 📚 Estudiante Financiero (3 lecciones)
  - 🔥 Racha de Fuego (7 días consecutivos)

- ✅ **Sistema de Puntos**:

  - Completar metas: +100 puntos
  - Completar desafíos: +100 a +500 puntos
  - Racha diaria: +5 puntos/día
  - Bonus semanal: +50 puntos cada 7 días

- ✅ Tabla de clasificación (leaderboard)
- ✅ Notificaciones de logros en tiempo real

### 🤖 Sugerencias con IA Local

- ✅ Análisis automático de patrones de gasto
- ✅ Recomendaciones personalizadas basadas en tu perfil financiero
- ✅ Identificación de categorías de alto gasto
- ✅ Sugerencias de optimización de presupuesto
- ✅ 100% privado - Sin enviar datos a la nube
- ✅ Modelos de lenguaje open-source (Ollama + Phi/Llama2)

### 📊 Estadísticas y Análisis

- ✅ Gráficos interactivos de gastos por categoría
- ✅ Tendencias mensuales de ingresos vs gastos
- ✅ Indicador de salud financiera
- ✅ Proyecciones y alertas tempranas
- ✅ Exportación de reportes (próximamente)

### 🔐 Seguridad

- ✅ Autenticación JWT con tokens seguros
- ✅ Encriptación de contraseñas con bcrypt
- ✅ Sesiones con expiración automática (2 horas)
- ✅ Validación de datos en backend y frontend
- ✅ Protección contra SQL injection

---

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                             │
│              React + Vite + React Router                    │
├─────────────────────────────────────────────────────────────┤
│  Components:  Header | Dashboard | Budget | Goals          │
│               Education | Gamification | Statistics         │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/REST API
                         │ JWT Auth
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                        BACKEND                              │
│                 Node.js + Express                           │
├─────────────────────────────────────────────────────────────┤
│  Routes:      /api/auth | /api/incomes | /api/expenses     │
│               /api/goals | /api/education                   │
│               /api/gamification | /api/suggestions          │
└────────────┬──────────────────────┬─────────────────────────┘
             │                      │
             ▼                      ▼
┌────────────────────┐   ┌─────────────────────┐
│    PostgreSQL      │   │  Ollama (IA Local)  │
│   Base de Datos    │   │   Modelo: phi       │
└────────────────────┘   └─────────────────────┘
```

### Flujo de Datos

1. **Usuario** realiza acción en la interfaz (React)
2. **Frontend** envía petición HTTP con token JWT
3. **Backend** valida token y procesa la solicitud
4. **Base de Datos** almacena/recupera información
5. **Gamificación** actualiza automáticamente desafíos y puntos
6. **IA Local** genera recomendaciones cuando se solicita
7. **Frontend** actualiza la interfaz con los datos recibidos

---

## 🛠️ Tecnologías Utilizadas

### Frontend

| Tecnología       | Versión | Propósito                  |
| ---------------- | ------- | -------------------------- |
| **React**        | 18.3.1  | Framework UI principal     |
| **Vite**         | 7.1.7   | Build tool y dev server    |
| **React Router** | 7.1.1   | Navegación SPA             |
| **Victory**      | 37.3.2  | Gráficos y visualizaciones |
| **Lucide React** | 0.468.0 | Iconografía                |

### Backend

| Tecnología     | Versión | Propósito                   |
| -------------- | ------- | --------------------------- |
| **Node.js**    | ≥18.0.0 | Runtime JavaScript          |
| **Express**    | 4.21.2  | Framework web               |
| **PostgreSQL** | 15+     | Base de datos relacional    |
| **JWT**        | 9.0.2   | Autenticación               |
| **bcrypt**     | 5.1.1   | Encriptación de contraseñas |
| **dotenv**     | 17.2.3  | Variables de entorno        |

### IA y Análisis

| Tecnología       | Propósito           |
| ---------------- | ------------------- |
| **Ollama**       | Motor de IA local   |
| **Phi / Llama2** | Modelos de lenguaje |

---

## 📦 Requisitos Previos

Antes de instalar el proyecto, asegúrate de tener:

### Software

- ✅ **Node.js** v18.0.0 o superior ([Descargar](https://nodejs.org/))
- ✅ **PostgreSQL** v15 o superior ([Descargar](https://www.postgresql.org/download/))
- ✅ **Ollama** para IA local ([Descargar](https://ollama.com/download))
- ✅ **Git** para control de versiones
- ✅ **Editor de código** (VS Code recomendado)

### Conocimientos Recomendados

- JavaScript/ES6+
- React fundamentals
- Node.js y Express
- SQL básico
- REST APIs
- Git/GitHub

---

## 🚀 Instalación

### 1. Clonar el Repositorio

```bash
git clone https://github.com/daniellelooo/app-financiera.git
cd app-financiera
```

### 2. Configurar PostgreSQL

Crear la base de datos:

```sql
CREATE DATABASE appfinanciera;
CREATE USER postgres WITH PASSWORD '1234';
GRANT ALL PRIVILEGES ON DATABASE appfinanciera TO postgres;
```

### 3. Instalar Dependencias

```bash
# Instalar dependencias del backend
cd backend
npm install

# Instalar dependencias del frontend
cd ../frontend
npm install

# Volver a la raíz del proyecto
cd ..
```

### 4. Configurar Variables de Entorno

#### Backend (`backend/.env`)

```env
PORT=4000
DB_USER=postgres
DB_HOST=localhost
DB_NAME=appfinanciera
DB_PASSWORD=1234
DB_PORT=5432
JWT_SECRET=tu_clave_secreta_aqui_cambiarla_en_produccion
```

#### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:4000
```

### 5. Inicializar Base de Datos

Las tablas se crean automáticamente al iniciar el backend por primera vez. El sistema creará:

- `users` - Usuarios del sistema
- `incomes` - Registro de ingresos
- `expenses` - Registro de gastos
- `goals` - Metas de ahorro y gasto
- `education_progress` - Progreso educativo
- `gamification_profile` - Perfiles de gamificación
- `challenges` - Desafíos disponibles
- `user_challenges` - Progreso de desafíos por usuario
- `badges` - Insignias disponibles
- `user_badges` - Insignias desbloqueadas por usuario
- `notifications` - Sistema de notificaciones

### 6. Instalar y Configurar Ollama (IA Local)

```bash
# Descargar e instalar Ollama
# https://ollama.com/download

# Descargar el modelo phi (recomendado, 1.6GB)
ollama pull phi

# O usar llama2 (más grande, 3.8GB)
ollama pull llama2

# Iniciar el modelo
ollama run phi
```

**Nota**: Deja esta terminal abierta mientras uses la aplicación. El backend se conectará automáticamente a `http://localhost:11434`.

### 7. Iniciar la Aplicación

Tienes dos opciones:

#### Opción A: Iniciar todo desde la raíz (Recomendado)

```bash
npm run dev
```

Esto iniciará automáticamente el backend (puerto 4000) y el frontend (puerto 5173).

#### Opción B: Iniciar por separado

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev

# Terminal 3 - Ollama (IA)
ollama run phi
```

### 8. Acceder a la Aplicación

Abre tu navegador en: **http://localhost:5173**

---

## ⚙️ Configuración

### Cambiar Puerto del Backend

Edita `backend/.env`:

```env
PORT=4000  # Cambia a tu puerto preferido
```

Y actualiza `frontend/.env`:

```env
VITE_API_URL=http://localhost:TU_PUERTO
```

### Cambiar Modelo de IA

Edita `backend/routes/suggestions.js` (línea ~60):

```javascript
const model = "phi"; // Cambia a "llama2", "mistral", etc.
```

### Ajustar Categorías de Gastos

Edita `frontend/src/pages/Budget.jsx` (líneas 36-45):

```javascript
const categories = [
  "Alimentación",
  "Transporte",
  // Agrega tus categorías personalizadas
];
```

---

## 💻 Uso

### Registro e Inicio de Sesión

1. **Registrarse**: Crea una cuenta con email y contraseña
2. **Iniciar Sesión**: Accede con tus credenciales
3. El token JWT se guarda automáticamente y expira en 2 horas

### Gestión de Finanzas

#### Registrar Ingresos/Gastos

1. Ve a **Presupuesto**
2. Llena el formulario con monto, categoría y descripción
3. Los datos se guardan automáticamente en PostgreSQL

#### Crear Metas

**Meta de Ahorro**:

1. Ve a **Metas**
2. Selecciona "Meta de Ahorro"
3. Define nombre, monto objetivo y fecha límite
4. Agrega ahorros progresivamente

**Meta de Gasto**:

1. Ve a **Metas**
2. Selecciona "Meta de Gasto"
3. Define límite mensual:
   - Monto fijo: "Gastar máximo $500,000"
   - Porcentaje: "Gastar máximo 20% de mis ingresos"
4. El progreso se actualiza automáticamente con tus gastos

### Educación Financiera

1. Ve a **Educación**
2. Navega entre los 4 módulos disponibles
3. Lee las lecciones (2-5 minutos cada una)
4. Responde los quizzes para consolidar el aprendizaje
5. Completa 3 lecciones para desbloquear la insignia "Estudiante Financiero"

### Gamificación

1. Ve a **Juegos**
2. Completa desafíos para ganar puntos:
   - Crea metas
   - Registra gastos diarios
   - Completa lecciones educativas
3. Desbloquea insignias por logros
4. Sube en el ranking de usuarios

### Recomendaciones IA

1. Ve a **Estadísticas**
2. Haz clic en "Obtener Recomendaciones"
3. El sistema analiza tu perfil financiero:
   - Patrones de gasto
   - Categorías de alto consumo
   - Balance disponible
   - Metas activas
4. Ollama genera 3 sugerencias personalizadas en español
5. Implementa las recomendaciones para mejorar tu salud financiera

---

## 📚 Módulos del Sistema

### 🏠 Dashboard

- Resumen visual de tu situación financiera
- Tarjetas con métricas clave (balance, gastos, ahorros)
- Actividad reciente (últimas 5 transacciones)
- Progreso de metas y educación

### 💰 Presupuesto

- Formulario de ingresos (monto, descripción, fecha)
- Formulario de gastos (monto, categoría, descripción, fecha)
- Balance calculado automáticamente
- Historial de transacciones editable

### 🎯 Metas

- Creación de metas de ahorro y gasto
- Seguimiento visual con barras de progreso
- Alertas de proximidad a límites
- Edición y eliminación de metas

### 🎓 Educación

- 16 lecciones interactivas en 4 módulos
- Quizzes de 4 opciones
- Seguimiento de progreso
- Contenido adaptado a Colombia

### 🎮 Juegos (Gamificación)

- 5 desafíos progresivos
- 6 insignias desbloqueables
- Sistema de puntos acumulativos
- Tabla de clasificación
- Notificaciones de logros

### 📊 Estadísticas

- Gráficos de gastos por categoría (torta)
- Tendencias mensuales (líneas)
- Indicador de salud financiera
- Botón de sugerencias IA

### 👤 Perfil

- Información de usuario
- Cambio de contraseña
- Estadísticas personales

---

## 🎮 Sistema de Gamificación

### Desafíos

| Desafío            | Descripción                        | Puntos | Criterio           |
| ------------------ | ---------------------------------- | ------ | ------------------ |
| **Primer Paso**    | Registra tu primera meta           | 100    | 1+ metas creadas   |
| **Planificador**   | Crea 3 metas de ahorro             | 200    | 3+ metas activas   |
| **Constante**      | 7 días seguidos registrando gastos | 150    | Racha de 7 días    |
| **Meta Alcanzada** | Completa una meta de ahorro        | 300    | 1+ meta completada |
| **Estudiante**     | Completa 3 lecciones               | 500    | 3+ lecciones       |

### Insignias

| Insignia | Nombre                | Requisito               |
| -------- | --------------------- | ----------------------- |
| 🌱       | Principiante          | Primera transacción     |
| 💰       | Ahorrador Novato      | Primera meta creada     |
| ⭐       | Meta Cumplida         | 1 meta completada       |
| 🏆       | Maestro del Ahorro    | 5 metas completadas     |
| 📚       | Estudiante Financiero | 3 lecciones completadas |
| 🔥       | Racha de Fuego        | 7 días consecutivos     |

### Sistema de Puntos

```
Acción                      | Puntos
----------------------------|--------
Completar meta              | +100
Completar desafío           | +100 a +500
Racha diaria                | +5/día
Bonus semanal (7 días)      | +50
```

Los puntos se usan para el ranking y próximamente para recompensas desbloqueables.

---

## 🤖 Sistema de IA Local

### Arquitectura de Sugerencias

```
┌──────────────────────────────────────────────────┐
│  1. Usuario solicita recomendaciones            │
└──────────────┬───────────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────────┐
│  2. Backend analiza datos financieros:          │
│     - Ingresos totales                           │
│     - Gastos por categoría                       │
│     - Balance disponible                         │
│     - Metas activas                              │
└──────────────┬───────────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────────┐
│  3. Genera sugerencias determinísticas:         │
│     - Categoría de mayor gasto                   │
│     - Porcentaje a reducir                       │
│     - Recomendación de ahorro                    │
└──────────────┬───────────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────────┐
│  4. Envía contexto + candidatos a Ollama:       │
│     POST http://localhost:11434/api/generate    │
│     Model: phi (o llama2)                        │
└──────────────┬───────────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────────┐
│  5. LLM refina y selecciona mejores 3:          │
│     - Lenguaje natural en español                │
│     - Máximo 18 palabras por sugerencia         │
│     - Formato: Verbo + acción + beneficio       │
└──────────────┬───────────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────────┐
│  6. Frontend muestra sugerencias al usuario     │
└──────────────────────────────────────────────────┘
```

### Ejemplo de Sugerencia Generada

**Entrada**:

- Ingresos: $10,000,000
- Gastos Tecnología: $1,100,000 (mayor categoría)
- Balance: $8,900,000

**Salida**:

1. Reduce Tecnología 15% (≈$165,000) para equilibrar
2. Destina 15% de ingresos (≈$1,500,000) a ahorro
3. Invierte 20% del balance (≈$1,780,000) en fondo conservador

### Privacidad

- ✅ Todo el procesamiento es local (no se envían datos a la nube)
- ✅ No requiere API keys ni suscripciones
- ✅ Funciona offline una vez instalado Ollama
- ✅ Datos nunca salen de tu computadora

---

## 🗄️ Base de Datos

### Esquema de Tablas

#### `users`

```sql
id SERIAL PRIMARY KEY
email TEXT UNIQUE NOT NULL
password TEXT NOT NULL (bcrypt hash)
name TEXT
```

#### `incomes`

```sql
id SERIAL PRIMARY KEY
user_id INTEGER REFERENCES users(id)
amount REAL NOT NULL
description TEXT
date TEXT NOT NULL (ISO format)
```

#### `expenses`

```sql
id SERIAL PRIMARY KEY
user_id INTEGER REFERENCES users(id)
amount REAL NOT NULL
category TEXT NOT NULL
description TEXT
date TEXT NOT NULL
```

#### `goals`

```sql
id SERIAL PRIMARY KEY
user_id INTEGER REFERENCES users(id)
name TEXT NOT NULL
target REAL NOT NULL
current REAL DEFAULT 0
deadline TEXT
completed BOOLEAN DEFAULT FALSE
type TEXT DEFAULT 'saving' ('saving' | 'expense')
```

#### `education_progress`

```sql
id SERIAL PRIMARY KEY
user_id INTEGER REFERENCES users(id)
lesson_id INTEGER
quiz_score INTEGER
completed_at TIMESTAMP DEFAULT NOW()
UNIQUE(user_id, lesson_id)
```

#### `gamification_profile`

```sql
id SERIAL PRIMARY KEY
user_id INTEGER REFERENCES users(id) UNIQUE
points INTEGER DEFAULT 0
streak_days INTEGER DEFAULT 0
last_activity_date TEXT
```

#### `challenges`

```sql
id SERIAL PRIMARY KEY
name TEXT NOT NULL
description TEXT
points INTEGER
target INTEGER
```

#### `user_challenges`

```sql
id SERIAL PRIMARY KEY
user_id INTEGER REFERENCES users(id)
challenge_id INTEGER REFERENCES challenges(id)
progress INTEGER DEFAULT 0
completed BOOLEAN DEFAULT FALSE
completed_at TIMESTAMP
```

#### `badges`

```sql
id SERIAL PRIMARY KEY
name TEXT NOT NULL
description TEXT
icon TEXT
```

#### `user_badges`

```sql
id SERIAL PRIMARY KEY
user_id INTEGER REFERENCES users(id)
badge_id INTEGER REFERENCES badges(id)
earned_at TIMESTAMP DEFAULT NOW()
UNIQUE(user_id, badge_id)
```

#### `notifications`

```sql
id SERIAL PRIMARY KEY
user_id INTEGER REFERENCES users(id)
message TEXT
type TEXT
read BOOLEAN DEFAULT FALSE
created_at TIMESTAMP DEFAULT NOW()
```

### Relaciones

```
users (1) ──< (N) incomes
users (1) ──< (N) expenses
users (1) ──< (N) goals
users (1) ──< (N) education_progress
users (1) ──< (1) gamification_profile
users (1) ──< (N) user_challenges
users (1) ──< (N) user_badges
users (1) ──< (N) notifications
```

---

## 🔌 API Endpoints

### Autenticación

| Método | Endpoint        | Descripción                  | Auth |
| ------ | --------------- | ---------------------------- | ---- |
| POST   | `/api/register` | Registrar nuevo usuario      | No   |
| POST   | `/api/login`    | Iniciar sesión (retorna JWT) | No   |
| GET    | `/api/profile`  | Obtener perfil del usuario   | Sí   |

### Ingresos

| Método | Endpoint           | Descripción               | Auth |
| ------ | ------------------ | ------------------------- | ---- |
| GET    | `/api/incomes`     | Listar todos los ingresos | Sí   |
| POST   | `/api/incomes`     | Crear nuevo ingreso       | Sí   |
| PUT    | `/api/incomes/:id` | Actualizar ingreso        | Sí   |
| DELETE | `/api/incomes/:id` | Eliminar ingreso          | Sí   |

### Gastos

| Método | Endpoint                             | Descripción             | Auth |
| ------ | ------------------------------------ | ----------------------- | ---- |
| GET    | `/api/expenses`                      | Listar todos los gastos | Sí   |
| GET    | `/api/expenses/monthly/:year/:month` | Gastos del mes          | Sí   |
| POST   | `/api/expenses`                      | Crear nuevo gasto       | Sí   |
| PUT    | `/api/expenses/:id`                  | Actualizar gasto        | Sí   |
| DELETE | `/api/expenses/:id`                  | Eliminar gasto          | Sí   |

### Metas

| Método | Endpoint         | Descripción            | Auth |
| ------ | ---------------- | ---------------------- | ---- |
| GET    | `/api/goals`     | Listar todas las metas | Sí   |
| POST   | `/api/goals`     | Crear nueva meta       | Sí   |
| PUT    | `/api/goals/:id` | Actualizar meta        | Sí   |
| DELETE | `/api/goals/:id` | Eliminar meta          | Sí   |

### Educación

| Método | Endpoint                  | Descripción               | Auth |
| ------ | ------------------------- | ------------------------- | ---- |
| GET    | `/api/education/progress` | Progreso educativo        | Sí   |
| GET    | `/api/education/stats`    | Estadísticas educativas   | Sí   |
| POST   | `/api/education/complete` | Marcar lección completada | Sí   |

### Gamificación

| Método | Endpoint                               | Descripción               | Auth |
| ------ | -------------------------------------- | ------------------------- | ---- |
| GET    | `/api/gamification/profile`            | Perfil de gamificación    | Sí   |
| GET    | `/api/gamification/challenges`         | Listar desafíos           | Sí   |
| GET    | `/api/gamification/badges`             | Insignias del usuario     | Sí   |
| GET    | `/api/gamification/leaderboard`        | Tabla de clasificación    | Sí   |
| POST   | `/api/gamification/refresh-challenges` | Recalcular progreso       | Sí   |
| POST   | `/api/gamification/reset-badges`       | Reiniciar insignias (dev) | Sí   |

### Sugerencias IA

| Método | Endpoint           | Descripción                | Auth |
| ------ | ------------------ | -------------------------- | ---- |
| POST   | `/api/suggestions` | Generar recomendaciones IA | Sí   |

### Notificaciones

| Método | Endpoint                      | Descripción           | Auth |
| ------ | ----------------------------- | --------------------- | ---- |
| GET    | `/api/notifications`          | Listar notificaciones | Sí   |
| PUT    | `/api/notifications/:id/read` | Marcar como leída     | Sí   |

### Ejemplo de Petición

```javascript
// Login
const response = await fetch("http://localhost:4000/api/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email: "user@example.com", password: "123456" }),
});
const { token } = await response.json();

// Crear gasto (requiere token)
const expense = await fetch("http://localhost:4000/api/expenses", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    amount: 50000,
    category: "Alimentación",
    description: "Supermercado",
    date: "2025-10-15",
  }),
});
```

---

## 👥 Flujo de Trabajo para Desarrolladores

### Estructura del Proyecto

```
prototipo-app-financiera/
├── backend/
│   ├── routes/
│   │   ├── gamification.js    # Lógica de gamificación
│   │   └── suggestions.js     # Integración IA (Ollama)
│   ├── index.js               # Servidor Express principal
│   ├── package.json
│   └── .env                   # Variables de entorno
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Budget.jsx
│   │   │   ├── Goals.jsx      # Metas de ahorro y gasto
│   │   │   ├── Education.jsx  # 16 lecciones + quizzes
│   │   │   ├── Gamification.jsx
│   │   │   ├── Statistics.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── ...
│   │   ├── App.jsx            # Routing principal
│   │   ├── App.css
│   │   └── main.jsx
│   ├── package.json
│   └── .env
│
├── .gitignore
├── package.json               # Scripts raíz (npm run dev)
└── README.md
```

### Convenciones de Código

#### Backend

- **Rutas protegidas**: Usar middleware `authMiddleware`
- **Consultas SQL**: Usar `$1, $2` (no `?`)
- **Errores**: Retornar JSON con `{ message: "..." }`
- **Puntos**: Otorgar en backend, no frontend

#### Frontend

- **Estado global**: `App.jsx` es fuente de verdad
- **Props drilling**: Pasar `setUserExpenses`, `setUserIncomes`, etc.
- **Fechas**: Usar formato ISO `YYYY-MM-DD`
- **Iconos**: Lucide React (`import { Icon } from "lucide-react"`)

### Git Workflow

#### 1. Crear Rama de Trabajo

```bash
git checkout main
git pull origin main
git checkout -b feature/nombre-descriptivo
```

Nombres de rama sugeridos:

- `feature/nueva-funcionalidad`
- `fix/correccion-bug`
- `docs/actualizar-readme`
- `refactor/mejorar-codigo`

#### 2. Hacer Commits Atómicos

```bash
git add archivo1.js archivo2.jsx
git commit -m "feat: agregar sistema de notificaciones push"
```

**Convención de mensajes** (Conventional Commits):

- `feat:` Nueva funcionalidad
- `fix:` Corrección de bug
- `docs:` Cambios en documentación
- `style:` Formato, sin cambios en lógica
- `refactor:` Refactorización de código
- `test:` Agregar o actualizar tests
- `chore:` Mantenimiento, dependencias

#### 3. Subir Cambios

```bash
git push origin feature/nombre-descriptivo
```

#### 4. Crear Pull Request

1. Ve a GitHub
2. Clic en "Compare & pull request"
3. Describe los cambios realizados:
   - ¿Qué problema resuelve?
   - ¿Cómo probarlo?
   - Screenshots (si aplica)
4. Asigna revisores
5. Espera aprobación antes de hacer merge

#### 5. Mantener Rama Actualizada

```bash
git checkout main
git pull origin main
git checkout feature/tu-rama
git merge main
# Resolver conflictos si existen
git push origin feature/tu-rama
```

### Testing Local

Antes de hacer push, verifica:

```bash
# Backend - Sin errores en consola
cd backend
npm run dev
# Prueba endpoints con Postman o Thunder Client

# Frontend - Sin errores en consola del navegador
cd frontend
npm run dev
# Navega por todas las páginas

# Verificar Ollama funcionando
curl http://localhost:11434/api/tags
```

### Debugging

#### Backend

```javascript
console.log("🔍 DEBUG:", variable);
console.error("❌ ERROR:", error);
console.log("✅ SUCCESS:", data);
```

#### Frontend

```javascript
console.log("📊 STATE:", userExpenses);
console.table(goals); // Para arrays de objetos
```

---

## 🤝 Contribución

¡Las contribuciones son bienvenidas! Sigue estos pasos:

1. **Fork** el repositorio
2. **Crea una rama** (`git checkout -b feature/AmazingFeature`)
3. **Commit** tus cambios (`git commit -m 'feat: add AmazingFeature'`)
4. **Push** a la rama (`git push origin feature/AmazingFeature`)
5. **Abre un Pull Request**

### Áreas para Contribuir

- 🎨 Mejorar UI/UX
- 📱 Hacer la app responsive para móviles
- 🧪 Agregar tests unitarios y de integración
- 🌐 Agregar internacionalización (i18n)
- 📊 Más tipos de gráficos y visualizaciones
- 🔔 Sistema de notificaciones push
- 📤 Exportar reportes a PDF/Excel
- 🎯 Más desafíos y logros
- 📚 Más contenido educativo
- 🤖 Mejorar prompts de IA

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver archivo `LICENSE` para más detalles.

---

## 👨‍💻 Autores

- **Daniel** - [@daniellelooo](https://github.com/daniellelooo)

---

## 🙏 Agradecimientos

- **Ollama** por proporcionar IA local gratuita
- **Victory Charts** por las visualizaciones
- **Lucide** por los iconos
- **PostgreSQL** por la base de datos robusta
- **Vite** por el tooling ultrarrápido

---

## 📞 Soporte

¿Tienes preguntas o problemas?

- 📧 Email: [tu-email@ejemplo.com]
- 🐛 Issues: [GitHub Issues](https://github.com/daniellelooo/app-financiera/issues)
- 💬 Discusiones: [GitHub Discussions](https://github.com/daniellelooo/app-financiera/discussions)

---

## 🗺️ Roadmap

### v1.1 (Próximamente)

- [ ] App móvil con React Native
- [ ] Modo oscuro
- [ ] Exportar reportes PDF
- [ ] Compartir logros en redes sociales

### v1.2 (Futuro)

- [ ] Integración con bancos (Open Banking)
- [ ] Sincronización multi-dispositivo
- [ ] Recordatorios inteligentes
- [ ] Asistente de voz

### v2.0 (Visión)

- [ ] Planificación de inversiones
- [ ] Cálculo de impuestos
- [ ] Asesoría financiera con IA avanzada
- [ ] Marketplace de productos financieros

---

<div align="center">

**⭐ Si este proyecto te ayudó, considera darle una estrella en GitHub ⭐**

Hecho con ❤️ usando React, Node.js y Ollama

[⬆ Volver arriba](#-finansmart---aplicación-de-finanzas-personales)

</div>
