# AI Coding Agent Instructions - FinanSmart

## Project Overview

Full-featured personal finance management web app with gamification, education modules, and AI-powered suggestions. Built with React (Vite) frontend and Node.js + Express backend. Uses PostgreSQL for data persistence and Ollama for local AI-powered financial recommendations.

**Key Features**: Income/expense tracking, savings goals, spending goals (% or fixed), 16 educational lessons with quizzes, 5 challenges, 6 badges, streak system, notifications, and leaderboard.

## Architecture & Key Patterns

### Monorepo Structure

- **Root**: Orchestrates both services via `concurrently` scripts (`npm run dev`)
- **`/backend`**: Express API server (port 4000), ES modules (`"type": "module"`)
  - **Routes**: `/api/suggestions`, `/api/education`, `/api/gamification`, `/api/notifications`
- **`/frontend`**: Vite + React SPA, connects to backend via `VITE_API_URL` env var

### Data Flow Pattern

**Critical**: State management follows a "lift state + prop drilling" pattern:

- `App.jsx` is the **single source of truth** for core financial data
- On login/mount, `App.jsx` fetches `incomes`, `expenses`, `goals` from backend
- Balance is computed in `App.jsx`: `totalIncomes - totalExpenses`
- Pages receive data as props and callback setters (e.g., `Budget.jsx` gets `setUserExpenses`)
- **Never duplicate data fetching** in child components unless explicitly refreshing

Example from `App.jsx` (lines 28-77):

```jsx
const [userIncomes, setUserIncomes] = React.useState([]);
const [userExpenses, setUserExpenses] = React.useState([]);
// Fetch on mount/login
useEffect(() => {
  /* fetch all data */
}, [isAuthenticated]);
```

### Authentication Flow

- JWT-based auth stored in `localStorage.getItem("token")`
- All protected API routes require `Authorization: Bearer <token>` header
- Middleware in `backend/index.js` (line 68-81) validates token and attaches `req.user`

### PostgreSQL Database Schema

**Core Tables** (auto-initialized in `backend/index.js` lines 28-183):

- `users`: `id` (SERIAL), `email` (UNIQUE), `password` (bcrypt hashed), `name` (TEXT)
- `incomes`: `user_id` (FK), `amount` (REAL), `description`, `date` (TEXT)
- `expenses`: `user_id` (FK), `amount`, `category`, `description`, `date`
- `goals`: `user_id` (FK), `name`, `target`, `current`, `deadline`, `completed` (BOOLEAN), `type` ('saving'/'spending')

**Gamification Tables**:

- `gamification_profile`: `user_id` (UNIQUE), `points`, `level`, `current_streak`, `best_streak`, `last_activity_date`
- `challenges`: Pre-seeded 5 challenges (first_saving, 3_savings, 7_day_expenses, goal_completed, 5_lessons)
- `user_challenges`: `user_id`, `challenge_id`, `progress`, `completed`, `completed_at`
- `badges`: Pre-seeded 6 badges (Principiante, Ahorrador Novato, Meta Cumplida, Maestro del Ahorro, Estudiante Financiero, Racha de Fuego)
- `user_badges`: `user_id`, `badge_id`, `earned_at`

**Education/Notification Tables**:

- `education_progress`: `user_id`, `lesson_id`, `achievement_id`, `quiz_score`, `completed_at`
- `notifications`: `user_id`, `type`, `title`, `message`, `priority`, `is_read`, `created_at`

**Important**: Dates stored as TEXT (ISO format), amounts as REAL (float). Goals `type` field distinguishes saving vs. spending goals.

### AI Suggestions Architecture

**Unique Hybrid Approach** (`backend/routes/suggestions.js`):

1. Generate deterministic rule-based candidates (lines 28-48) based on expense patterns
2. Send candidates + financial data to **Ollama local LLM** (model: `phi`)
3. LLM refines/selects 3 best suggestions (strict 18-word limit, verb-first)
4. Fallback to deterministic if LLM fails validation

**Ollama Integration**:

- Runs locally on `http://localhost:11434`
- Must be started separately: `ollama run phi` (or `llama2`)
- No API keys required—100% offline AI

## Developer Workflows

### Starting Development

```bash
# From root (uses concurrently)
npm run dev  # Starts backend (nodemon) + frontend (vite) in parallel

# OR start separately:
cd backend && npm run dev    # Port 4000
cd frontend && npm run dev   # Port 5173 (default Vite)
```

**Prerequisites**:

- PostgreSQL running with database `appfinanciera` (user: `postgres`, password: `1234`, port: 5432)
- Ollama installed and model pulled (`ollama pull phi`)

### Environment Variables

- **Backend**: Uses `dotenv` for `.env` (JWT_SECRET, DB credentials)
- **Frontend**: `.env` with `VITE_API_URL=http://localhost:4000` (Vite convention)

### Database Setup

Tables auto-initialize on backend start (line 24-56). No migrations—schema changes require manual SQL or ALTER statements.

## Gamification System Architecture

### Auto-Refresh Mechanism

**Critical Pattern**: Gamification data uses a refresh-on-load pattern (`Gamification.jsx` line 28-40):

1. Component calls `POST /api/gamification/refresh-challenges` on mount
2. Backend recalculates ALL challenge progress from database state (lines 266-578 in `gamification.js`)
3. Frontend then fetches updated profile, challenges, badges, and leaderboard

**Why**: Ensures UI reflects actual user progress without manual updates. Challenges track:

- Challenge 1: Total goals created (≥1 goal)
- Challenge 2: Total goals created (≥3 goals)
- Challenge 3: Consecutive days with expenses (≥7 days)
- Challenge 4: Completed goals count (≥1 completed)
- Challenge 5: Lessons completed (≥5 lessons)

### Badge Award System

Badges auto-awarded via `checkAndAwardBadges()` helper (line 460-515):

- Checks conditions (e.g., "has 3+ completed lessons")
- Inserts into `user_badges` if not already earned
- Creates notification automatically

**Never manually insert badges**—always use refresh endpoint or helper functions.

### Points & Leveling

- Points awarded via `addPoints()` helper (line 218-244)
- Level = `floor(points / 1000) + 1`
- Level-up triggers notification automatically
- Streak system: 5pts/day, 50pts bonus every 7 days

## Project-Specific Conventions

### Expense Categories

Hardcoded list in `Budget.jsx` (line 36-45):

```javascript
[
  "Alimentación",
  "Transporte",
  "Entretenimiento",
  "Educación",
  "Ropa",
  "Salud",
  "Tecnología",
  "Otros",
];
```

Always use these exact strings for consistency.

### Notification System

Backend creates notifications via `createNotification()` helper (lines 5-14 in `gamification.js`):

```javascript
await createNotification(db, userId, "achievement", "Title", "Message", "high");
```

**Types**: `achievement`, `reminder`, `warning`, `goal`, `lesson`  
**Priorities**: `low`, `medium`, `high`

Frontend endpoints (`/api/notifications`):

- `GET /` - Get all (limit 50)
- `GET /unread` - Filter unread
- `GET /count` - Count badge
- `POST /mark-read/:id` - Mark single as read
- `POST /mark-all-read` - Bulk mark read
- `DELETE /:id` - Delete notification

### Date Handling

- Store dates as ISO strings (`YYYY-MM-DD`)
- Use `.slice(0, 10)` to extract date portion from datetime strings
- Example: `<input type="date">` expects `YYYY-MM-DD` format

### API Error Handling

Backend uses generic catch blocks returning 500 errors. Frontend should check `res.ok` before parsing JSON:

```javascript
if (res.ok) {
  /* success */
} else {
  const err = await res.text(); /* handle */
}
```

### Styling

- No CSS framework—custom CSS in `App.css`, `style.css`
- `.card` and `.card-title` classes for consistent UI (see `Dashboard.jsx`)
- Lucide React icons throughout (`import { Icon } from "lucide-react"`)

## Education System

**Structure** (`backend/routes/education.js`):

- 16 lessons organized in 4 modules (4 lessons each)
- Quizzes with 4 options per question
- Progress tracking via `education_progress` table
- Achievement unlocks at milestones: 1st lesson (id=1), 5 lessons (id=2), 10 lessons (id=3), all 16 (id=5)

**Endpoints**:

- `GET /api/education/progress` - Returns `{completedLessons: [ids], achievements: [ids]}`
- `POST /api/education/complete-lesson` - Body: `{lessonId, score}`, auto-checks achievements

**Integration**: Completing 3+ lessons triggers "Estudiante Financiero" badge via `checkAndAwardBadges()`

## Pending Features (Context for Future Work)

- `movements` field in goals: Currently computed client-side, may need migration

## Common Pitfalls

1. **Don't call `fetch` in page components' `useEffect` if `App.jsx` already provides data**—causes double fetches
2. **PostgreSQL uses `$1, $2` parameterized queries**, not SQLite `?` placeholders
3. **Ollama must be running** before testing AI suggestions—API returns connection errors otherwise
4. **Token expiration**: JWT expires in 2h (see `backend/index.js` line 138)—no refresh token flow exists

## Testing Suggestions Locally

```bash
# Terminal 1: Start Ollama
ollama run phi

# Terminal 2: Backend + Frontend
npm run dev

# Test via Statistics page > "Obtener Recomendaciones" button
# Watch backend logs for "🤖 RAW modelo:" output
```

When editing suggestion logic, focus on:

- Deterministic candidates (lines 28-48 in `suggestions.js`)
- LLM prompt engineering (lines 50-52)
- Validation rules (lines 79-98)
