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



## 🎯 Patrón Modelo-Vista-Controlador (MVC)

### ¿Qué es MVC?

MVC es un **patrón de arquitectura de software** que separa una aplicación en tres componentes principales:

#### **MODELO (Model)**

- **Qué es**: La capa de datos y lógica de negocio
- **Responsabilidad**: Gestionar los datos, validarlos, y ejecutar las reglas del negocio
- **En FinanSmart**: PostgreSQL + esquemas de base de datos

#### **VISTA (View)**

- **Qué es**: La capa de presentación visual
- **Responsabilidad**: Mostrar información al usuario y capturar sus acciones
- **En FinanSmart**: Componentes React (JSX, CSS)

#### **CONTROLADOR (Controller)**

- **Qué es**: El intermediario entre Modelo y Vista
- **Responsabilidad**: Recibir peticiones del usuario, procesarlas usando el Modelo, y actualizar la Vista
- **En FinanSmart**: Rutas de Express (API REST)

### Beneficios de MVC

**1. Mantenibilidad**

- Cambios en cómo se ven los datos (Vista) no afectan la base de datos (Modelo)
- Cambios en la base de datos no requieren modificar la interfaz
- Cada capa puede evolucionar independientemente

**2. Reutilización de Código**

- El mismo backend (Controlador + Modelo) puede servir a múltiples interfaces
- Un endpoint puede ser consumido por web, móvil, o aplicaciones de escritorio

**3. Trabajo en Equipo Paralelo**

- Un desarrollador puede trabajar en la interfaz (frontend)
- Otro desarrollador puede trabajar en la lógica y datos (backend)
- Solo necesitan acordar el "contrato" de la API

**4. Testing Más Fácil**

- Cada capa se puede probar independientemente
- El Modelo se puede testear sin interfaz gráfica
- La Vista se puede testear con datos simulados

**5. Escalabilidad**

- Frontend puede estar en un servidor (CDN)
- Backend en otro servidor
- Base de datos en un servidor especializado

### Por Qué Elegimos MVC

**1. Aplicación de Datos Estructurados**

- FinanSmart maneja datos financieros relacionales (ingresos, gastos, metas)
- PostgreSQL como Modelo es ideal para relaciones complejas
- React como Vista muestra los datos de forma visual

**2. API Reutilizable**

- El mismo backend puede servir a aplicación web (actual)
- En el futuro: app móvil, extensión de navegador, CLI

**3. Separación Frontend/Backend Clara**

- Frontend en puerto 5173 (Vite)
- Backend en puerto 4000 (Express)
- Comunicación solo por HTTP/REST

**4. Cambios Frecuentes en UI**

- Durante desarrollo cambiamos diseño varias veces
- Solo modificamos la Vista (React)
- Backend nunca se tocó por cambios visuales

**5. Lógica de Negocio Compleja**

- Gamificación requiere cálculos complejos (puntos, niveles, badges)
- Toda esa lógica está en el Controlador
- No mezclada con la interfaz visual

### Cómo se Refleja MVC en FinanSmart

**MODELO (PostgreSQL)**

- 12 tablas que definen la estructura de datos
- Valida tipos de datos (números, textos, fechas)
- Garantiza integridad con Foreign Keys
- Almacena: usuarios, ingresos, gastos, metas, gamificación

**CONTROLADOR (Express Routes)**

- `backend/routes/expenses.js` - Gestión de gastos
- `backend/routes/goals.js` - Gestión de metas
- `backend/routes/gamification.js` - Sistema de puntos
- Valida datos de entrada
- Aplica lógica de negocio
- Consulta/modifica la base de datos
- Devuelve respuestas JSON

**VISTA (React Components)**

- `Budget.jsx` - Formulario de gastos/ingresos
- `Dashboard.jsx` - Panel principal
- `Goals.jsx` - Interfaz de metas
- `Statistics.jsx` - Gráficas y análisis
- Captura acciones del usuario
- Llama al Controlador (API)
- Muestra datos de forma visual

### Flujo Completo: Ejemplo de Agregar un Gasto

**Paso 1: VISTA** - Usuario llena formulario con monto $50,000 y categoría "Alimentación"

**Paso 2: VISTA** - React hace petición HTTP al Controlador: `POST /api/expenses`

**Paso 3: CONTROLADOR** - Express recibe datos, valida que el monto sea positivo

**Paso 4: CONTROLADOR** - Si válido, hace query SQL al Modelo

**Paso 5: MODELO** - PostgreSQL ejecuta INSERT y guarda el gasto

**Paso 6: MODELO** - Devuelve el registro guardado con su ID

**Paso 7: CONTROLADOR** - Envía respuesta JSON a la Vista

**Paso 8: VISTA** - React actualiza la interfaz, usuario ve el nuevo gasto

### Ventajas Prácticas en Nuestro Proyecto

**Cambio de Diseño**

- Cambiamos el Dashboard de lista a tarjetas
- Solo modificamos `Dashboard.jsx` (Vista)
- Backend no se tocó

**Nueva Validación**

- Necesitábamos limitar gastos máximo $1,000,000
- Solo agregamos validación en `expenses.js` (Controlador)
- Aplica a cualquier cliente (web/móvil)

**Escalabilidad Futura**

- Si creamos app móvil React Native
- Reutilizamos 100% del backend
- Solo creamos nueva Vista en móvil

---

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
POST /api/gamification/refresh-challenges  
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


## 🏆 BUENAS PRÁCTICAS IMPLEMENTADAS

### 1. Arquitectura y Diseño

#### ✅ Separación de Responsabilidades (Separation of Concerns)

```
frontend/
  ├── components/     → Componentes reutilizables (Header, ProtectedRoute)
  ├── pages/          → Vistas completas (Dashboard, Budget, etc.)
  └── src/            → Lógica de presentación

backend/
  ├── routes/         → Lógica de negocio por dominio
  └── index.js        → Configuración y middleware central
```

**Beneficio**: Cada archivo tiene una responsabilidad clara, facilita mantenimiento y testing.

#### ✅ Patrón MVC Adaptado

```
Model      → PostgreSQL (esquema de datos)
View       → React Components (JSX)
Controller → Express Routes (lógica de negocio)
```

#### ✅ RESTful API Design

```javascript
// Recursos con verbos HTTP semánticos
GET    /api/expenses          → Listar gastos
POST   /api/expenses          → Crear gasto
PUT    /api/expenses/:id      → Actualizar gasto
DELETE /api/expenses/:id      → Eliminar gasto

// Rutas anidadas lógicas
POST   /api/gamification/refresh-challenges
GET    /api/education/progress
```

**Beneficio**: API predecible, fácil de consumir y documentar.

#### ✅ Single Source of Truth

```javascript
// App.jsx es el estado central
const [userIncomes, setUserIncomes] = useState([]);
const [userExpenses, setUserExpenses] = useState([]);
const [savingsGoals, setSavingsGoals] = useState([]);

// Balance calculado, no almacenado
const userBalance = totalIncomes - totalExpenses;
```

**Beneficio**: No hay duplicación de datos, siempre consistente.

---

### 2. Seguridad

#### ✅ Autenticación JWT Stateless

```javascript
// No almacenamos sesiones en servidor
const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: "2h" });

// Middleware de autenticación en cada ruta protegida
app.use("/api/*", authenticateToken);
```

**Beneficio**: Escalable horizontalmente, no requiere sesiones compartidas.

#### ✅ Hash de Contraseñas con bcrypt

```javascript
// Nunca almacenamos contraseñas en texto plano
const hashedPassword = await bcrypt.hash(password, 10);

// Comparación segura con salt automático
const isValid = await bcrypt.compare(password, user.password);
```

**Beneficio**: Protección contra brechas de datos, imposible recuperar password original.

#### ✅ Prepared Statements (Prevención SQL Injection)

```javascript
// ✅ BIEN - Uso de parámetros $1, $2
db.query("SELECT * FROM expenses WHERE user_id = $1 AND category = $2", [
  userId,
  category,
]);

// ❌ MAL - Concatenación directa
// db.query(`SELECT * FROM expenses WHERE user_id = '${userId}'`)
```

**Beneficio**: Imposible inyectar código SQL malicioso.

#### ✅ Validación de Datos en Backend

```javascript
// Nunca confiamos en datos del cliente
if (!amount || amount <= 0) {
  return res.status(400).json({ error: "Monto inválido" });
}

if (!category || !validCategories.includes(category)) {
  return res.status(400).json({ error: "Categoría inválida" });
}
```

**Beneficio**: Previene datos corruptos en la base de datos.

#### ✅ CORS Configurado

```javascript
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
```

**Beneficio**: Protección contra peticiones de orígenes no autorizados.

---

### 3. Código Limpio (Clean Code)

#### ✅ Nombres Descriptivos

```javascript
// ✅ BIEN
const calculateFinancialHealth = (incomes, expenses, savings) => {};
const userBalance = totalIncomes - totalExpenses;

// ❌ MAL
const calc = (a, b, c) => {};
const x = y - z;
```

#### ✅ Funciones Pequeñas y Enfocadas (Single Responsibility)

```javascript
// Una función, una responsabilidad
const addPoints = async (db, userId, points) => {
  await db.query(
    "UPDATE gamification_profile SET points = points + $1 WHERE user_id = $2",
    [points, userId]
  );
};

const checkAndAwardBadges = async (db, userId) => {
  // Lógica exclusiva de badges
};
```

**Beneficio**: Fácil de testear, reutilizable, mantenible.

#### ✅ DRY (Don't Repeat Yourself)

```javascript
// Helper reutilizado en múltiples rutas
const createNotification = async (
  db,
  userId,
  type,
  title,
  message,
  priority
) => {
  await db.query(
    "INSERT INTO notifications (user_id, type, title, message, priority) VALUES ($1, $2, $3, $4, $5)",
    [userId, type, title, message, priority]
  );
};

// Usado en routes/gamification.js, routes/education.js, etc.
```

**Beneficio**: Cambios en un solo lugar, menos bugs.

#### ✅ Constantes en Lugar de Magic Numbers

```javascript
// ✅ BIEN
const POINTS_PER_LESSON = 50;
const POINTS_PER_GOAL = 30;
const LEVEL_POINTS_THRESHOLD = 1000;

const level = Math.floor(points / LEVEL_POINTS_THRESHOLD) + 1;

// ❌ MAL
const level = Math.floor(points / 1000) + 1;
```

---

### 4. Manejo de Errores

#### ✅ Try-Catch en Operaciones Asíncronas

```javascript
router.get("/expenses", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM expenses WHERE user_id = $1", [
      req.user.id,
    ]);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching expenses:", err);
    res.status(500).json({ error: "Error al obtener gastos" });
  }
});
```

**Beneficio**: La aplicación no se cae, usuario recibe mensaje claro.

#### ✅ Validación con Mensajes Específicos

```javascript
if (!email || !password) {
  return res.status(400).json({
    error: "Email y contraseña son requeridos",
  });
}

if (password.length < 6) {
  return res.status(400).json({
    error: "La contraseña debe tener al menos 6 caracteres",
  });
}
```

#### ✅ Fallbacks en Integraciones Externas

```javascript
// Sistema híbrido: IA + fallback determinístico
try {
  const aiSuggestions = await getOllamaSuggestions(data);
  return aiSuggestions;
} catch (error) {
  console.warn("Ollama unavailable, using deterministic fallback");
  return deterministicSuggestions;
}
```

**Beneficio**: Servicio siempre disponible incluso si Ollama falla.

---

### 5. Performance y Optimización

#### ✅ Consultas SQL Optimizadas

```javascript
// ✅ BIEN - Una query con JOIN
const result = await db.query(
  `
  SELECT g.*, COUNT(m.id) as movement_count
  FROM goals g
  LEFT JOIN movements m ON g.id = m.goal_id
  WHERE g.user_id = $1
  GROUP BY g.id
`,
  [userId]
);

// ❌ MAL - N+1 queries
const goals = await db.query("SELECT * FROM goals WHERE user_id = $1", [
  userId,
]);
for (let goal of goals) {
  const movements = await db.query(
    "SELECT * FROM movements WHERE goal_id = $1",
    [goal.id]
  );
}
```

**Beneficio**: Menos queries, mejor rendimiento.

#### ✅ Memoización en Frontend

```javascript
// Evita recalcular en cada render
const expensesByCategory = useMemo(() => {
  return filteredExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});
}, [filteredExpenses]);
```

**Beneficio**: Mejor performance en listas grandes.

#### ✅ Lazy Loading (React)

```javascript
// Cargar componentes solo cuando se necesitan
const Education = React.lazy(() => import("./pages/Education"));

<Suspense fallback={<div>Cargando...</div>}>
  <Education />
</Suspense>;
```

**Beneficio**: Carga inicial más rápida, mejor First Contentful Paint.

---

### 6. Control de Versiones (Git)

#### ✅ Commits Descriptivos

```bash
# ✅ BIEN
git commit -m "feat: Add dark mode toggle in Profile page"
git commit -m "fix: Prevent SQL injection in expenses endpoint"
git commit -m "refactor: Extract authentication middleware"

# ❌ MAL
git commit -m "changes"
git commit -m "fix stuff"
```

**Convención**: Conventional Commits (feat, fix, refactor, docs, style, test, chore)

#### ✅ .gitignore Completo

```bash
# No versionar archivos sensibles
.env
node_modules/
dist/
*.log

# No versionar archivos de IDE
.vscode/
.idea/
```

---

### 7. Configuración y Deployment

#### ✅ Variables de Entorno

```javascript
// backend/.env
DB_USER = postgres;
DB_PASSWORD = secret;
JWT_SECRET = supersecret123;

// Uso en código
const dbPassword = process.env.DB_PASSWORD;
```

**Beneficio**: Configuración separada del código, diferentes valores por entorno.

#### ✅ Scripts npm Organizados

```json
{
  "scripts": {
    "dev": "concurrently \"npm run backend\" \"npm run frontend\"",
    "backend": "cd backend && nodemon index.js",
    "frontend": "cd frontend && npm run dev"
  }
}
```

#### ✅ Inicialización Automática de DB

```javascript
// backend/index.js
const initDB = async () => {
  await db.query(`CREATE TABLE IF NOT EXISTS users (...)`);
  await db.query(`CREATE TABLE IF NOT EXISTS expenses (...)`);
  // Seed data inicial
  await db.query(`INSERT INTO challenges (...) ON CONFLICT DO NOTHING`);
};

initDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
```

**Beneficio**: Setup automático, onboarding de desarrolladores sin pasos manuales.

---

### 8. UX/UI

#### ✅ Feedback Visual Inmediato

```javascript
// Loading states
const [loading, setLoading] = useState(false);
if (loading) return <div>Cargando...</div>;

// Success feedback
toast.success("¡Gasto agregado exitosamente!");
```

#### ✅ Modo Oscuro Coherente

```css
/* Paleta de colores consistente */
body.dark-mode {
  --bg-primary: #0d1117;
  --bg-secondary: #161b22;
  --text-primary: #ffffff;
  --text-secondary: #8b949e;
}
```

**Beneficio**: Reduce fatiga visual, respeta preferencias del usuario.

#### ✅ Responsive Design

```css
@media (max-width: 768px) {
  .dashboard {
    grid-template-columns: 1fr;
  }
}
```

---




## 📊 RESUMEN DE BUENAS PRÁCTICAS

| Categoría         | Prácticas Implementadas                                         | Beneficio Principal |
| ----------------- | --------------------------------------------------------------- | ------------------- |
| **Arquitectura**  | Separación responsabilidades, MVC, REST, Single Source of Truth | Mantenibilidad      |
| **Seguridad**     | JWT, bcrypt, prepared statements, validación backend, CORS      | Protección de datos |
| **Código Limpio** | Nombres descriptivos, DRY, Single Responsibility, constantes    | Legibilidad         |
| **Errores**       | Try-catch global, fallbacks, mensajes específicos               | Robustez            |
| **Performance**   | Queries optimizadas, memoización, lazy loading                  | Velocidad           |
| **Git**           | Commits descriptivos, .gitignore, conventional commits          | Colaboración        |
| **Config**        | Variables entorno, scripts estandarizados, auto-init DB         | Deployment fácil    |
| **UX/UI**         | Feedback visual, modo oscuro, responsive design                 | Experiencia usuario |
| **Docs**          | README, comentarios útiles, architecture docs                   | Onboarding          |

---

**Última actualización**: Noviembre 2025  
**Versión**: 1.0.0
