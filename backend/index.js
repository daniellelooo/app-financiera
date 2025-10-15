
// === IMPORTS ===
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Pool } from 'pg';

import suggestionsRouter from './routes/suggestions.js';
import educationRouter from './routes/education.js';
import gamificationRouter from './routes/gamification.js';
import notificationsRouter from './routes/notifications.js';


// === DB INIT (PostgreSQL) ===
const pool = new Pool({
  user: 'postgres', // Cambia por tu usuario
  host: 'localhost',
  database: 'appfinanciera',
  password: '1234', // Cambia por tu contraseña
  port: 5432,
});

// Crea tablas si no existen (ajusta tipos para PostgreSQL)
const initDb = async () => {
  await pool.query(`CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT
  );`);
  
  // Agregar columna 'name' si no existe (para usuarios existentes)
  try {
    await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS name TEXT;`);
  } catch (err) {
    // La columna ya existe o error, continuar
  }
  await pool.query(`CREATE TABLE IF NOT EXISTS incomes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    amount REAL NOT NULL,
    description TEXT,
    date TEXT NOT NULL
  );`);
  await pool.query(`CREATE TABLE IF NOT EXISTS expenses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    amount REAL NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    date TEXT NOT NULL
  );`);
  await pool.query(`CREATE TABLE IF NOT EXISTS goals (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    name TEXT NOT NULL,
    target REAL NOT NULL,
    current REAL NOT NULL DEFAULT 0,
    deadline TEXT,
    completed BOOLEAN DEFAULT FALSE,
    type TEXT DEFAULT 'saving'
  );`);
  
  // Agregar columna 'type' si no existe (para metas existentes)
  try {
    await pool.query(`ALTER TABLE goals ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'saving';`);
  } catch (err) {
    // La columna ya existe o error, continuar
  }
  
  // Tabla para progreso de educación y logros
  await pool.query(`CREATE TABLE IF NOT EXISTS education_progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    lesson_id INTEGER,
    achievement_id INTEGER,
    quiz_score INTEGER,
    completed_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, lesson_id),
    UNIQUE(user_id, achievement_id)
  );`);
  
  // Tablas para gamificación
  await pool.query(`CREATE TABLE IF NOT EXISTS gamification_profile (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE REFERENCES users(id),
    points INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    current_streak INTEGER DEFAULT 0,
    best_streak INTEGER DEFAULT 0,
    last_activity_date DATE
  );`);

  await pool.query(`CREATE TABLE IF NOT EXISTS challenges (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    target REAL NOT NULL,
    reward_points INTEGER NOT NULL,
    type TEXT NOT NULL,
    month TEXT,
    icon TEXT
  );`);

  await pool.query(`CREATE TABLE IF NOT EXISTS user_challenges (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    challenge_id INTEGER NOT NULL REFERENCES challenges(id),
    progress REAL DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP,
    UNIQUE(user_id, challenge_id)
  );`);

  await pool.query(`CREATE TABLE IF NOT EXISTS badges (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    requirement TEXT
  );`);

  await pool.query(`CREATE TABLE IF NOT EXISTS user_badges (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    badge_id INTEGER NOT NULL REFERENCES badges(id),
    earned_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, badge_id)
  );`);
  
  // Insertar desafíos iniciales si no existen
  const challengeCheck = await pool.query('SELECT COUNT(*) FROM challenges');
  if (parseInt(challengeCheck.rows[0].count) === 0) {
    await pool.query(`
      INSERT INTO challenges (title, description, target, reward_points, type, icon) VALUES
      ('Primer Ahorro', 'Registra tu primer ahorro del mes', 1, 100, 'savings', '💰'),
      ('Ahorro Constante', 'Ahorra 3 veces en un mes', 3, 200, 'savings', '🏦'),
      ('Control de Gastos', 'Registra gastos durante 7 días seguidos', 7, 150, 'expenses', '📝'),
      ('Meta Alcanzada', 'Completa una meta de ahorro', 1, 500, 'goals', '🎯'),
      ('Educación Financiera', 'Completa 5 lecciones', 5, 300, 'education', '📚')
    `);
  }

  // Insertar o actualizar badges
  const badgeCheck = await pool.query('SELECT COUNT(*) FROM badges');
  if (parseInt(badgeCheck.rows[0].count) === 0) {
    // Insertar badges iniciales
    await pool.query(`
      INSERT INTO badges (name, description, icon, requirement) VALUES
      ('Principiante', 'Registra tu primer movimiento', '🌟', 'first_transaction'),
      ('Ahorrador Novato', 'Crea tu primera meta de ahorro', '🐣', 'first_saving'),
      ('Meta Cumplida', 'Completa una meta de ahorro', '🎯', 'goal_completed'),
      ('Maestro del Ahorro', 'Completa 5 metas de ahorro', '👑', '5_goals'),
      ('Estudiante Financiero', 'Completa 3 lecciones', '📖', '3_lessons'),
      ('Racha de Fuego', 'Mantén una racha de 7 días', '🔥', '7_day_streak')
    `);
  } else {
    // Actualizar badges existentes para corregir datos incorrectos
    await pool.query(`
      UPDATE badges SET name = 'Principiante', description = 'Registra tu primer movimiento', icon = '🌟', requirement = 'first_transaction' WHERE id = 1;
      UPDATE badges SET name = 'Ahorrador Novato', description = 'Crea tu primera meta de ahorro', icon = '🐣', requirement = 'first_saving' WHERE id = 2;
      UPDATE badges SET name = 'Meta Cumplida', description = 'Completa una meta de ahorro', icon = '🎯', requirement = 'goal_completed' WHERE id = 3;
      UPDATE badges SET name = 'Maestro del Ahorro', description = 'Completa 5 metas de ahorro', icon = '👑', requirement = '5_goals' WHERE id = 4;
      UPDATE badges SET name = 'Estudiante Financiero', description = 'Completa 3 lecciones', icon = '📖', requirement = '3_lessons' WHERE id = 5;
      UPDATE badges SET name = 'Racha de Fuego', description = 'Mantén una racha de 7 días', icon = '🔥', requirement = '7_day_streak' WHERE id = 6;
    `);
  }

  // Tabla para notificaciones
  await pool.query(`CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    priority TEXT DEFAULT 'low',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
  );`);
};
await initDb();



// === EXPRESS INIT ===
const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';
app.use(cors());
app.use(express.json());

// Middleware para pasar pool a las rutas
app.use((req, res, next) => {
  req.db = pool;
  next();
});

// === AUTH MIDDLEWARE ===
const authMiddleware = async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: 'Token requerido' });
  try {
    const token = auth.split(' ')[1];
    const payload = jwt.verify(token, JWT_SECRET);
  const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [payload.email]);
  const user = rows[0];
    if (!user) return res.status(401).json({ message: 'Usuario no encontrado' });
    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: 'Token inválido' });
  }
};

// === ROUTES ===
app.use('/api/suggestions', suggestionsRouter);
app.use('/api/education', authMiddleware, educationRouter);
app.use('/api/gamification', authMiddleware, gamificationRouter);
app.use('/api/notifications', authMiddleware, notificationsRouter);

// === GET EXPENSES ===
app.get('/api/expenses', authMiddleware, async (req, res) => {
  try {
  const { rows } = await pool.query('SELECT * FROM expenses WHERE user_id = $1 ORDER BY date DESC', [req.user.id]);
  const expenses = rows;
    res.json(expenses);
  } catch {
    res.status(500).json({ message: 'Error al obtener gastos' });
  }
});

// === EXPENSES MONTHLY STATS ===
app.get('/api/expenses/monthly/:year/:month', authMiddleware, async (req, res) => {
  const { year, month } = req.params;
  try {
    const { rows: expenses } = await pool.query(
      `SELECT * FROM expenses WHERE user_id = $1 AND date LIKE $2`,
      [req.user.id, `${year}-${month.padStart(2, '0')}%`]
    );
    const total = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
    res.json({ expenses, total });
  } catch {
    res.status(500).json({ message: 'Error al obtener gastos mensuales' });
  }
});

// === GET GOALS ===
app.get('/api/goals', authMiddleware, async (req, res) => {
  try {
  const { rows } = await pool.query('SELECT * FROM goals WHERE user_id = $1 ORDER BY deadline ASC', [req.user.id]);
  const goals = rows;
    res.json(goals);
  } catch {
    res.status(500).json({ message: 'Error al obtener metas' });
  }
});

// === AUTH ENDPOINTS ===
app.post('/api/register', async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) return res.status(400).json({ message: 'Email, contraseña y nombre requeridos' });
  try {
  const { rows: existingRows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  const existing = existingRows[0];
    if (existing) return res.status(409).json({ message: 'Usuario ya existe' });
    const hashed = await bcrypt.hash(password, 10);
  await pool.query('INSERT INTO users (email, password, name) VALUES ($1, $2, $3)', [email, hashed, name]);
    res.status(201).json({ message: 'Usuario registrado' });
  } catch (err) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
  const { rows: userRows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  const user = userRows[0];
    if (!user) return res.status(401).json({ message: 'Credenciales inválidas' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Credenciales inválidas' });
    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '2h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

app.get('/api/profile', authMiddleware, (req, res) => {
  res.json({ 
    email: req.user.email,
    name: req.user.name || 'Usuario'
  });
});

// === INCOMES CRUD ===
app.get('/api/incomes', authMiddleware, async (req, res) => {
  try {
  const { rows } = await pool.query('SELECT * FROM incomes WHERE user_id = $1 ORDER BY date DESC', [req.user.id]);
  const incomes = rows;
    res.json(incomes);
  } catch {
    res.status(500).json({ message: 'Error al obtener ingresos' });
  }
});

app.post('/api/incomes', authMiddleware, async (req, res) => {
  const { amount, description, date } = req.body;
  if (!amount || !date) return res.status(400).json({ message: 'Monto y fecha requeridos' });
  try {
  const result = await pool.query('INSERT INTO incomes (user_id, amount, description, date) VALUES ($1, $2, $3, $4) RETURNING id', [req.user.id, amount, description || '', date]);
  res.status(201).json({ id: result.rows[0].id, amount, description, date });
  } catch {
    res.status(500).json({ message: 'Error al crear ingreso' });
  }
});

app.put('/api/incomes/:id', authMiddleware, async (req, res) => {
  const { amount, description, date } = req.body;
  const { id } = req.params;
  try {
  await pool.query('UPDATE incomes SET amount = $1, description = $2, date = $3 WHERE id = $4 AND user_id = $5', [amount, description || '', date, id, req.user.id]);
    res.json({ id, amount, description, date });
  } catch {
    res.status(500).json({ message: 'Error al actualizar ingreso' });
  }
});

app.delete('/api/incomes/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
  await pool.query('DELETE FROM incomes WHERE id = $1 AND user_id = $2', [id, req.user.id]);
    res.json({ message: 'Ingreso eliminado' });
  } catch {
    res.status(500).json({ message: 'Error al eliminar ingreso' });
  }
});

// === EXPENSES CRUD ===
app.post('/api/expenses', authMiddleware, async (req, res) => {
  const { amount, category, description, date } = req.body;
  if (!amount || !category || !date) return res.status(400).json({ message: 'Monto, categoría y fecha requeridos' });
  try {
    const result = await pool.query(
      'INSERT INTO expenses (user_id, amount, category, description, date) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [req.user.id, amount, category, description || '', date]
    );
    res.status(201).json({ id: result.rows[0].id, amount, category, description, date });
  } catch {
    res.status(500).json({ message: 'Error al crear gasto' });
  }
});

// === EXPENSES UPDATE ===
app.put('/api/expenses/:id', authMiddleware, async (req, res) => {
  const { amount, category, description } = req.body;
  const { id } = req.params;
  if (!amount || !category) return res.status(400).json({ message: 'Monto y categoría requeridos' });
  try {
    await pool.query(
      'UPDATE expenses SET amount = $1, category = $2, description = $3 WHERE id = $4 AND user_id = $5',
      [amount, category, description || '', id, req.user.id]
    );
    res.json({ id, amount, category, description });
  } catch {
    res.status(500).json({ message: 'Error al actualizar gasto' });
  }
});

// === EXPENSES DELETE ===
app.delete('/api/expenses/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
  await pool.query('DELETE FROM expenses WHERE id = $1 AND user_id = $2', [id, req.user.id]);
    res.json({ message: 'Gasto eliminado' });
  } catch {
    res.status(500).json({ message: 'Error al eliminar gasto' });
  }
});

// === GOALS CRUD ===
app.post('/api/goals', authMiddleware, async (req, res) => {
  const { name, target, deadline, type } = req.body;
  if (!name || !target || !deadline) return res.status(400).json({ message: 'Nombre, objetivo y fecha límite requeridos' });
  const goalType = type || 'saving'; // Default: meta de ahorro
  try {
    const result = await pool.query(
      'INSERT INTO goals (user_id, name, target, deadline, current, completed, type) VALUES ($1, $2, $3, $4, 0, false, $5) RETURNING id',
      [req.user.id, name, target, deadline, goalType]
    );
    res.status(201).json({ goal: { id: result.rows[0].id, name, target, current: 0, deadline, completed: false, type: goalType } });
  } catch {
    res.status(500).json({ message: 'Error al crear meta' });
  }
});

// === GOALS UPDATE ===
app.put('/api/goals/:id', authMiddleware, async (req, res) => {
  const { name, target, deadline, current, completed, type } = req.body;
  const { id } = req.params;
  if (!name || !target || !deadline) return res.status(400).json({ message: 'Nombre, objetivo y fecha límite requeridos' });
  try {
    // Verificar si la meta ya estaba completada
    const previousGoal = await pool.query(
      'SELECT completed, type FROM goals WHERE id = $1 AND user_id = $2',
      [id, req.user.id]
    );
    
    const wasCompleted = previousGoal.rows[0]?.completed || false;
    const isNowCompleted = completed ?? false;
    const goalType = type || previousGoal.rows[0]?.type || 'saving';
    
    // Actualizar meta
    await pool.query(
      'UPDATE goals SET name = $1, target = $2, deadline = $3, current = $4, completed = $5, type = $6 WHERE id = $7 AND user_id = $8',
      [name, target, deadline, current ?? 0, isNowCompleted, goalType, id, req.user.id]
    );
    
    // Si la meta se acaba de completar (no estaba completada antes), otorgar puntos
    if (isNowCompleted && !wasCompleted) {
      // Otorgar 100 puntos por completar una meta
      await pool.query(
        'UPDATE gamification_profile SET points = points + 100 WHERE user_id = $1',
        [req.user.id]
      );
      
      console.log(`✅ Meta completada! +100 puntos para usuario ${req.user.id}`);
    }
    
    res.json({ id, name, target, deadline, current, completed: isNowCompleted, type: goalType });
  } catch (err) {
    console.error('Error al actualizar meta:', err);
    res.status(500).json({ message: 'Error al actualizar meta' });
  }
});

// === GOALS DELETE ===
app.delete('/api/goals/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
  await pool.query('DELETE FROM goals WHERE id = $1 AND user_id = $2', [id, req.user.id]);
    res.json({ message: 'Meta eliminada' });
  } catch {
    res.status(500).json({ message: 'Error al eliminar meta' });
  }
});

// === SERVER START ===
app.listen(PORT, () => {
  console.log(`Backend escuchando en http://localhost:${PORT}`);
});
