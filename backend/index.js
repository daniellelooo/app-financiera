
// === IMPORTS ===
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// === DB INIT ===
let db;
const initDb = async () => {
  db = await open({
    filename: './users.db',
    driver: sqlite3.Database
  });
  await db.exec(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  );`);
  await db.exec(`CREATE TABLE IF NOT EXISTS incomes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    amount REAL NOT NULL,
    description TEXT,
    date TEXT NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );`);
  await db.exec(`CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    amount REAL NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    date TEXT NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );`);
  await db.exec(`CREATE TABLE IF NOT EXISTS goals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    target REAL NOT NULL,
    current REAL NOT NULL DEFAULT 0,
    deadline TEXT,
    completed INTEGER DEFAULT 0,
    FOREIGN KEY(user_id) REFERENCES users(id)
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
    const user = await db.get('SELECT * FROM users WHERE email = ?', payload.email);
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
    const expenses = await db.all('SELECT * FROM expenses WHERE user_id = ? ORDER BY date DESC', req.user.id);
    res.json(expenses);
  } catch {
    res.status(500).json({ message: 'Error al obtener gastos' });
  }
});

// === GET GOALS ===
app.get('/api/goals', authMiddleware, async (req, res) => {
  try {
    const goals = await db.all('SELECT * FROM goals WHERE user_id = ? ORDER BY deadline ASC', req.user.id);
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
    const existing = await db.get('SELECT * FROM users WHERE email = ?', email);
    if (existing) return res.status(409).json({ message: 'Usuario ya existe' });
    const hashed = await bcrypt.hash(password, 10);
    await db.run('INSERT INTO users (email, password) VALUES (?, ?)', email, hashed);
    res.status(201).json({ message: 'Usuario registrado' });
  } catch (err) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await db.get('SELECT * FROM users WHERE email = ?', email);
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
    const incomes = await db.all('SELECT * FROM incomes WHERE user_id = ? ORDER BY date DESC', req.user.id);
    res.json(incomes);
  } catch {
    res.status(500).json({ message: 'Error al obtener ingresos' });
  }
});

app.post('/api/incomes', authMiddleware, async (req, res) => {
  const { amount, description, date } = req.body;
  if (!amount || !date) return res.status(400).json({ message: 'Monto y fecha requeridos' });
  try {
    const result = await db.run('INSERT INTO incomes (user_id, amount, description, date) VALUES (?, ?, ?, ?)', req.user.id, amount, description || '', date);
    res.status(201).json({ id: result.lastID, amount, description, date });
  } catch {
    res.status(500).json({ message: 'Error al crear ingreso' });
  }
});

app.put('/api/incomes/:id', authMiddleware, async (req, res) => {
  const { amount, description, date } = req.body;
  const { id } = req.params;
  try {
    await db.run('UPDATE incomes SET amount = ?, description = ?, date = ? WHERE id = ? AND user_id = ?', amount, description || '', date, id, req.user.id);
    res.json({ id, amount, description, date });
  } catch {
    res.status(500).json({ message: 'Error al actualizar ingreso' });
  }
});

app.delete('/api/incomes/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    await db.run('DELETE FROM incomes WHERE id = ? AND user_id = ?', id, req.user.id);
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
    const result = await db.run(
      'INSERT INTO expenses (user_id, amount, category, description, date) VALUES (?, ?, ?, ?, ?)',
      req.user.id, amount, category, description || '', date
    );
    res.status(201).json({ id: result.lastID, amount, category, description, date });
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
    await db.run(
      'UPDATE expenses SET amount = ?, category = ?, description = ? WHERE id = ? AND user_id = ?',
      amount, category, description || '', id, req.user.id
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
    await db.run('DELETE FROM expenses WHERE id = ? AND user_id = ?', id, req.user.id);
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
    const result = await db.run(
      'INSERT INTO goals (user_id, name, target, deadline, current, completed) VALUES (?, ?, ?, ?, 0, 0)',
      req.user.id, name, target, deadline
    );
    res.status(201).json({ goal: { id: result.lastID, name, target, current: 0, deadline, completed: false } });
  } catch {
    res.status(500).json({ message: 'Error al crear meta' });
  }
});

// === GOALS UPDATE ===
app.put('/api/goals/:id', authMiddleware, async (req, res) => {
  const { name, target, deadline } = req.body;
  const { id } = req.params;
  if (!name || !target || !deadline) return res.status(400).json({ message: 'Nombre, objetivo y fecha límite requeridos' });
  try {
    await db.run(
      'UPDATE goals SET name = ?, target = ?, deadline = ? WHERE id = ? AND user_id = ?',
      name, target, deadline, id, req.user.id
    );
    res.json({ id, name, target, deadline });
  } catch {
    res.status(500).json({ message: 'Error al actualizar meta' });
  }
});

// === GOALS DELETE ===
app.delete('/api/goals/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    await db.run('DELETE FROM goals WHERE id = ? AND user_id = ?', id, req.user.id);
    res.json({ message: 'Meta eliminada' });
  } catch {
    res.status(500).json({ message: 'Error al eliminar meta' });
  }
});

// === SERVER START ===
app.listen(PORT, () => {
  console.log(`Backend escuchando en http://localhost:${PORT}`);
});
