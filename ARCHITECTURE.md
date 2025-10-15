# 🏗️ Arquitectura del Sistema - FinanSmart

## 📐 Visión General

FinanSmart es una aplicación monorepo que combina un **backend REST API** con un **frontend SPA**, enfocada en gestión financiera personal con gamificación e IA local.

```
prototipo-app-financiera/
├── backend/          # Express API (Puerto 4000)
│   ├── index.js      # Servidor principal + DB init
│   └── routes/       # Módulos de negocio
│       ├── suggestions.js      # IA + Ollama
│       ├── education.js        # Lecciones
│       ├── gamification.js     # Puntos/badges
│       └── notifications.js    # Sistema de alertas
├── frontend/         # React + Vite (Puerto 5173)
│   └── src/
│       ├── App.jsx              # State manager principal
│       ├── pages/               # Vistas principales
│       └── components/          # Componentes reutilizables
└── package.json      # Scripts concurrently
```

## 🔄 Flujo de Datos

### Patrón Central: Lift State + Prop Drilling

```
┌─────────────────────────────────────────┐
│            App.jsx (Root)               │
│  ┌─────────────────────────────────┐   │
│  │  State Central:                 │   │
│  │  - userIncomes                  │   │
│  │  - userExpenses                 │   │
│  │  - userGoals                    │   │
│  │  - balance (computed)           │   │
│  └─────────────────────────────────┘   │
└──────────────┬──────────────────────────┘
               │ Props & Setters
     ┌─────────┼─────────┬─────────┐
     ▼         ▼         ▼         ▼
  Budget   Dashboard  Goals   Statistics
```

**Regla de oro**: `App.jsx` hace fetch inicial, los hijos reciben datos por props. Solo refetch en hijos para actualizaciones específicas (ej: gamificación).

## 🗄️ Base de Datos PostgreSQL

### Esquema Principal

#### Tablas Core

```sql
users (id, email, password, name)
  └── incomes (user_id, amount, description, date)
  └── expenses (user_id, amount, category, description, date)
  └── goals (user_id, name, target, current, deadline, completed, type)
```

#### Sistema de Gamificación

```sql
gamification_profile (user_id, points, level, current_streak, best_streak, last_activity_date)
  └── user_challenges (user_id, challenge_id, progress, completed)
  └── user_badges (user_id, badge_id, earned_at)

challenges (5 pre-seeded: first_saving, 3_savings, 7_day_expenses, goal_completed, 5_lessons)
badges (6 pre-seeded: Principiante, Ahorrador Novato, Meta Cumplida, etc.)
```

#### Educación y Notificaciones

```sql
education_progress (user_id, lesson_id, achievement_id, quiz_score, completed_at)
notifications (user_id, type, title, message, priority, is_read, created_at)
```

**Nota**: Fechas como TEXT (ISO), cantidades como REAL. Auto-inicialización en `backend/index.js` líneas 28-183.

## 🎮 Sistema de Gamificación

### Arquitectura de Auto-Actualización

```
Frontend (Gamification.jsx) mount
         │
         ▼
POST /api/gamification/refresh-challenges
         │
         ├─► Recalcula Challenge 1: Total metas creadas
         ├─► Recalcula Challenge 2: 3+ metas
         ├─► Recalcula Challenge 3: 7 días consecutivos con gastos
         ├─► Recalcula Challenge 4: Meta completada
         ├─► Recalcula Challenge 5: 5 lecciones completadas
         │
         ├─► checkAndAwardBadges()
         │    └─► Verifica 6 condiciones de badges
         │         └─► Crea notificaciones automáticas
         │
         ▼
Frontend hace GET a /profile, /challenges, /badges, /leaderboard
```

### Fórmulas Clave

- **Nivel**: `floor(puntos / 1000) + 1`
- **Racha**: 5pts/día, 50pts bonus cada 7 días
- **Badges**: Auto-otorgados por `awardBadge()` (nunca insertar manualmente)

## 🤖 Sistema de IA (Ollama)

### Arquitectura Híbrida

```
Usuario pide sugerencias (Statistics.jsx)
         │
         ▼
GET /api/suggestions
         │
         ├─► 1. Genera candidatos deterministicos (lines 28-48)
         │      - Analiza patrones de gastos
         │      - Crea 5-8 sugerencias basadas en reglas
         │
         ├─► 2. Envía a Ollama (localhost:11434)
         │      - Modelo: phi
         │      - Prompt: "Selecciona 3 mejores, 18 palabras max"
         │
         ├─► 3. Valida respuesta LLM (lines 79-98)
         │      - Verifica formato
         │      - Asegura límite de palabras
         │
         └─► 4. Fallback a deterministico si falla
```

**Prerequisito**: `ollama run phi` corriendo en segundo plano.

## 🔐 Autenticación JWT

```
Login/Register → JWT (exp: 2h) → localStorage.token
                                        │
                     Todas las peticiones protegidas
                                        │
                            Authorization: Bearer <token>
                                        │
                            authMiddleware (backend/index.js:68-81)
                                        │
                            Verifica & adjunta req.user
```

**Sin refresh tokens** - Usuario debe re-login tras 2 horas.

## 📚 Sistema de Educación

```
Education.jsx (16 lecciones, 4 módulos)
         │
         ├─► GET /api/education/progress
         │    └─► {completedLessons: [ids], achievements: [ids]}
         │
         └─► POST /api/education/complete-lesson {lessonId, score}
              └─► Desbloquea achievements en hitos: 1, 5, 10, 16 lecciones
              └─► Si ≥3 lecciones → Badge "Estudiante Financiero"
```

## 🔔 Sistema de Notificaciones

### Creación Automática

```javascript
// Backend usa helper en cada evento importante
await createNotification(
  db,
  userId,
  "achievement",
  "Título",
  "Mensaje",
  "high"
);
```

**Tipos**: `achievement`, `reminder`, `warning`, `goal`, `lesson`  
**Prioridades**: `low`, `medium`, `high`

### Endpoints

- `GET /api/notifications` - Últimas 50
- `GET /api/notifications/unread` - No leídas
- `GET /api/notifications/count` - Badge contador
- `POST /api/notifications/mark-read/:id` - Marcar individual
- `POST /api/notifications/mark-all-read` - Marcar todas
- `DELETE /api/notifications/:id` - Eliminar

## 🚀 Flujo de Desarrollo

### Inicio Rápido

```bash
# Terminal 1: Ollama (obligatorio para sugerencias)
ollama run phi

# Terminal 2: App completa
npm run dev  # Usa concurrently → backend:4000 + frontend:5173
```

### Variables de Entorno

```bash
# backend/.env
JWT_SECRET=supersecretkey
# DB: postgres/1234@localhost:5432/appfinanciera

# frontend/.env
VITE_API_URL=http://localhost:4000
```

## 🎯 Metas: Ahorro vs. Gasto

### Tipos de Metas

```javascript
// type: 'saving' → Acumular hasta target
{
  name: "Vacaciones",
  target: 1000000,
  current: 250000,  // Incrementa con aportes
  type: "saving"
}

// type: 'spending' → No exceder target mensual
{
  name: "Restaurantes",
  target: 200000,      // Límite mensual (puede ser % de ingresos)
  current: 150000,     // Gastos acumulados del mes
  type: "spending"
}
```

Calculado en frontend - no hay tabla `movements` en DB.

## ⚠️ Consideraciones Técnicas

### PostgreSQL vs. SQLite

- Usa `$1, $2, $3` (no `?` de SQLite)
- SERIAL para auto-increment (no INTEGER PRIMARY KEY)
- TEXT para fechas ISO, REAL para números decimales

### Patrones Críticos

1. **No duplicar fetches**: Si `App.jsx` ya provee data, no hacer `useEffect` fetch en hijos
2. **Gamificación siempre vía refresh**: Nunca calcular progreso en frontend
3. **Badges automáticos**: Usar `checkAndAwardBadges()`, no INSERT manual
4. **Categorías hardcoded**: 8 categorías fijas en `Budget.jsx:36-45`

### Limitaciones Conocidas

- Sin migraciones DB (cambios vía ALTER manual)
- JWT sin refresh (expira en 2h)
- Ollama debe estar corriendo (sin fallback cloud)
- Fechas como strings (no TIMESTAMP nativo)

## 📊 Endpoints API Principales

```
AUTH (no middleware)
POST /api/login
POST /api/register

CORE (con authMiddleware)
GET/POST /api/incomes
GET/POST /api/expenses
GET/POST/PUT/DELETE /api/goals

GAMIFICATION
GET  /api/gamification/profile
GET  /api/gamification/challenges
POST /api/gamification/refresh-challenges  ⭐ Llamar en cada carga
GET  /api/gamification/badges
GET  /api/gamification/leaderboard
POST /api/gamification/update-streak

EDUCATION
GET  /api/education/progress
POST /api/education/complete-lesson

NOTIFICATIONS
GET    /api/notifications
GET    /api/notifications/unread
GET    /api/notifications/count
POST   /api/notifications/mark-read/:id
POST   /api/notifications/mark-all-read
DELETE /api/notifications/:id

AI
GET /api/suggestions  (requiere Ollama activo)
```

## 🔧 Debugging Tips

### Ver logs de Ollama

```bash
# Backend muestra en consola:
🤖 RAW modelo: [respuesta del LLM]
```

### Resetear gamificación

```bash
POST /api/gamification/reset-badges  # Recalcula todos los badges
```

### Verificar estado de DB

```sql
-- PostgreSQL: postgres@localhost:5432/appfinanciera
SELECT * FROM gamification_profile WHERE user_id = 1;
SELECT * FROM user_challenges WHERE user_id = 1;
```

---

**Última actualización**: Octubre 2025  
**Versión**: 1.0.0
