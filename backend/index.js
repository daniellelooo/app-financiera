
// === IMPORTS ===
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Pool } from 'pg';

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
    password TEXT NOT NULL
  );`);
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
    completed BOOLEAN DEFAULT FALSE
  );`);
};
await initDb();


// === EXPRESS INIT ===
const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';
app.use(cors());
app.use(express.json());

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
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email y contraseña requeridos' });
  try {
  const { rows: existingRows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  const existing = existingRows[0];
    if (existing) return res.status(409).json({ message: 'Usuario ya existe' });
    const hashed = await bcrypt.hash(password, 10);
  await pool.query('INSERT INTO users (email, password) VALUES ($1, $2)', [email, hashed]);
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
  res.json({ email: req.user.email });
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
  const { name, target, deadline } = req.body;
  if (!name || !target || !deadline) return res.status(400).json({ message: 'Nombre, objetivo y fecha límite requeridos' });
  try {
    const result = await pool.query(
      'INSERT INTO goals (user_id, name, target, deadline, current, completed) VALUES ($1, $2, $3, $4, 0, false) RETURNING id',
      [req.user.id, name, target, deadline]
    );
    res.status(201).json({ goal: { id: result.rows[0].id, name, target, current: 0, deadline, completed: false } });
  } catch {
    res.status(500).json({ message: 'Error al crear meta' });
  }
});

// === GOALS UPDATE ===
app.put('/api/goals/:id', authMiddleware, async (req, res) => {
  const { name, target, deadline, current, completed } = req.body;
  const { id } = req.params;
  if (!name || !target || !deadline) return res.status(400).json({ message: 'Nombre, objetivo y fecha límite requeridos' });
  try {
    await pool.query(
      'UPDATE goals SET name = $1, target = $2, deadline = $3, current = $4, completed = $5 WHERE id = $6 AND user_id = $7',
      [name, target, deadline, current ?? 0, completed ?? false, id, req.user.id]
    );
    res.json({ id, name, target, deadline, current, completed });
  } catch {
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
