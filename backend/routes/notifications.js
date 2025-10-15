import express from 'express';
const router = express.Router();

// GET /api/notifications - Obtener todas las notificaciones del usuario
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await req.db.query(
      `SELECT * FROM notifications 
       WHERE user_id = $1 
       ORDER BY created_at DESC 
       LIMIT 50`,
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error obteniendo notificaciones:', error);
    res.status(500).json({ error: 'Error al obtener notificaciones' });
  }
});

// GET /api/notifications/unread - Obtener notificaciones no leídas
router.get('/unread', async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await req.db.query(
      `SELECT * FROM notifications 
       WHERE user_id = $1 AND is_read = false 
       ORDER BY created_at DESC`,
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error obteniendo notificaciones no leídas:', error);
    res.status(500).json({ error: 'Error al obtener notificaciones' });
  }
});

// GET /api/notifications/count - Contar notificaciones no leídas
router.get('/count', async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await req.db.query(
      `SELECT COUNT(*) as count FROM notifications 
       WHERE user_id = $1 AND is_read = false`,
      [userId]
    );
    res.json({ count: parseInt(result.rows[0].count) });
  } catch (error) {
    console.error('Error contando notificaciones:', error);
    res.status(500).json({ error: 'Error al contar notificaciones' });
  }
});

// POST /api/notifications/mark-read/:id - Marcar notificación como leída
router.post('/mark-read/:id', async (req, res) => {
  try {
    const userId = req.user.id;
    const notificationId = req.params.id;
    
    await req.db.query(
      `UPDATE notifications 
       SET is_read = true 
       WHERE id = $1 AND user_id = $2`,
      [notificationId, userId]
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error marcando notificación como leída:', error);
    res.status(500).json({ error: 'Error al actualizar notificación' });
  }
});

// POST /api/notifications/mark-all-read - Marcar todas como leídas
router.post('/mark-all-read', async (req, res) => {
  try {
    const userId = req.user.id;
    
    await req.db.query(
      `UPDATE notifications 
       SET is_read = true 
       WHERE user_id = $1 AND is_read = false`,
      [userId]
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error marcando todas como leídas:', error);
    res.status(500).json({ error: 'Error al actualizar notificaciones' });
  }
});

// DELETE /api/notifications/:id - Eliminar una notificación
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.user.id;
    const notificationId = req.params.id;
    
    await req.db.query(
      `DELETE FROM notifications 
       WHERE id = $1 AND user_id = $2`,
      [notificationId, userId]
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error eliminando notificación:', error);
    res.status(500).json({ error: 'Error al eliminar notificación' });
  }
});

// POST /api/notifications/check-budget-alerts - Verificar alertas de presupuesto
router.post('/check-budget-alerts', async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Obtener gastos del mes actual por categoría
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    const expensesResult = await req.db.query(
      `SELECT category, SUM(amount) as total
       FROM expenses
       WHERE user_id = $1 AND date LIKE $2
       GROUP BY category`,
      [userId, `${currentMonth}%`]
    );

    // Obtener ingresos totales del mes
    const incomesResult = await req.db.query(
      `SELECT SUM(amount) as total
       FROM incomes
       WHERE user_id = $1 AND date LIKE $2`,
      [userId, `${currentMonth}%`]
    );

    const totalIncome = incomesResult.rows[0]?.total || 0;
    const budgetPerCategory = totalIncome * 0.15; // 15% del ingreso por categoría (ejemplo)

    const alerts = [];

    // Verificar cada categoría
    for (const expense of expensesResult.rows) {
      const percentage = (expense.total / budgetPerCategory) * 100;
      
      if (percentage >= 80 && percentage < 100) {
        // Alerta: cerca del límite
        alerts.push({
          type: 'budget_warning',
          title: `⚠️ Cerca del límite en ${expense.category}`,
          message: `Has gastado ${percentage.toFixed(0)}% de tu presupuesto en ${expense.category}`,
          priority: 'medium',
        });
      } else if (percentage >= 100) {
        // Alerta crítica: excediste el límite
        alerts.push({
          type: 'budget_exceeded',
          title: `🚨 Límite excedido en ${expense.category}`,
          message: `Has excedido el presupuesto en ${expense.category} (${percentage.toFixed(0)}%)`,
          priority: 'high',
        });
      }
    }

    // Crear notificaciones para las alertas
    for (const alert of alerts) {
      // Verificar si ya existe una notificación similar reciente (últimas 24 horas)
      const existingAlert = await req.db.query(
        `SELECT id FROM notifications
         WHERE user_id = $1 AND type = $2 AND title = $3
         AND created_at > NOW() - INTERVAL '24 hours'`,
        [userId, alert.type, alert.title]
      );

      if (existingAlert.rows.length === 0) {
        await req.db.query(
          `INSERT INTO notifications (user_id, type, title, message, priority, is_read)
           VALUES ($1, $2, $3, $4, $5, false)`,
          [userId, alert.type, alert.title, alert.message, alert.priority]
        );
      }
    }

    res.json({ alerts, count: alerts.length });
  } catch (error) {
    console.error('Error verificando alertas de presupuesto:', error);
    res.status(500).json({ error: 'Error al verificar alertas' });
  }
});

// POST /api/notifications/check-goals-reminders - Verificar recordatorios de metas
router.post('/check-goals-reminders', async (req, res) => {
  try {
    const userId = req.user.id;
    
    const goalsResult = await req.db.query(
      `SELECT * FROM goals
       WHERE user_id = $1 AND completed = false`,
      [userId]
    );

    const reminders = [];

    for (const goal of goalsResult.rows) {
      const progress = (goal.current / goal.target) * 100;
      const deadline = new Date(goal.deadline);
      const today = new Date();
      const daysRemaining = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));

      // Recordatorio: Meta cerca de completarse
      if (progress >= 70 && progress < 100) {
        reminders.push({
          type: 'goal_progress',
          title: `🎯 ¡Casi lo logras!`,
          message: `Tu meta "${goal.name}" está al ${progress.toFixed(0)}%. Solo te falta $${(goal.target - goal.current).toFixed(2)}`,
          priority: 'medium',
        });
      }

      // Recordatorio: Deadline cercano
      if (daysRemaining <= 7 && daysRemaining > 0 && progress < 100) {
        reminders.push({
          type: 'goal_deadline',
          title: `⏰ Fecha límite cercana`,
          message: `Tu meta "${goal.name}" vence en ${daysRemaining} días. Progreso: ${progress.toFixed(0)}%`,
          priority: 'high',
        });
      }

      // Recordatorio: Deadline pasado
      if (daysRemaining < 0 && progress < 100) {
        reminders.push({
          type: 'goal_overdue',
          title: `📅 Meta vencida`,
          message: `La meta "${goal.name}" venció hace ${Math.abs(daysRemaining)} días`,
          priority: 'high',
        });
      }
    }

    // Crear notificaciones para los recordatorios
    for (const reminder of reminders) {
      const existingReminder = await req.db.query(
        `SELECT id FROM notifications
         WHERE user_id = $1 AND type = $2 AND title = $3
         AND created_at > NOW() - INTERVAL '24 hours'`,
        [userId, reminder.type, reminder.title]
      );

      if (existingReminder.rows.length === 0) {
        await req.db.query(
          `INSERT INTO notifications (user_id, type, title, message, priority, is_read)
           VALUES ($1, $2, $3, $4, $5, false)`,
          [userId, reminder.type, reminder.title, reminder.message, reminder.priority]
        );
      }
    }

    res.json({ reminders, count: reminders.length });
  } catch (error) {
    console.error('Error verificando recordatorios de metas:', error);
    res.status(500).json({ error: 'Error al verificar recordatorios' });
  }
});

// POST /api/notifications/generate-weekly-tip - Generar consejo financiero semanal
router.post('/generate-weekly-tip', async (req, res) => {
  try {
    const userId = req.user.id;

    // Lista de consejos financieros
    const financialTips = [
      {
        title: "💡 Regla del 50/30/20",
        message: "Divide tu ingreso: 50% necesidades, 30% gustos, 20% ahorros. ¡Inténtalo este mes!",
      },
      {
        title: "💰 Ahorra antes de gastar",
        message: "Separa tus ahorros apenas recibas tu ingreso, no esperes a final de mes.",
      },
      {
        title: "📊 Revisa tus gastos",
        message: "Dedica 15 minutos cada semana a revisar tus gastos y ajusta tu presupuesto.",
      },
      {
        title: "🎯 Metas SMART",
        message: "Tus metas de ahorro deben ser Específicas, Medibles, Alcanzables, Relevantes y con Tiempo definido.",
      },
      {
        title: "⚠️ Fondo de emergencia",
        message: "Intenta ahorrar 3-6 meses de gastos para imprevistos. Empieza con lo que puedas.",
      },
      {
        title: "🛍️ Compra inteligente",
        message: "Espera 24 horas antes de compras no planificadas. ¿Realmente lo necesitas?",
      },
      {
        title: "📚 Educación continua",
        message: "Dedica 10 minutos al día a aprender sobre finanzas. Completa una lección nueva.",
      },
      {
        title: "🔄 Automatiza",
        message: "Configura transferencias automáticas a tus ahorros. ¡Ahorra sin pensarlo!",
      },
      {
        title: "💳 Evita deudas",
        message: "Las deudas de tarjetas de crédito tienen intereses altos. Págalas cuanto antes.",
      },
      {
        title: "🎁 Gastos hormiga",
        message: "Pequeños gastos diarios suman mucho al mes. Identifícalos y controla al menos uno.",
      },
    ];

    // Verificar si ya se generó un consejo esta semana
    const existingTip = await req.db.query(
      `SELECT id FROM notifications
       WHERE user_id = $1 AND type = 'tip'
       AND created_at > NOW() - INTERVAL '7 days'`,
      [userId]
    );

    if (existingTip.rows.length > 0) {
      return res.json({ message: 'Ya se generó un consejo esta semana' });
    }

    // Seleccionar un consejo aleatorio
    const randomTip = financialTips[Math.floor(Math.random() * financialTips.length)];

    // Crear notificación
    await req.db.query(
      `INSERT INTO notifications (user_id, type, title, message, priority, is_read)
       VALUES ($1, 'tip', $2, $3, 'low', false)`,
      [userId, randomTip.title, randomTip.message]
    );

    res.json({ success: true, tip: randomTip });
  } catch (error) {
    console.error('Error generando consejo semanal:', error);
    res.status(500).json({ error: 'Error al generar consejo' });
  }
});

// Función helper para crear notificaciones (exportada para usar en otros módulos)
export const createNotification = async (db, userId, type, title, message, priority = 'low') => {
  try {
    await db.query(
      `INSERT INTO notifications (user_id, type, title, message, priority, is_read)
       VALUES ($1, $2, $3, $4, $5, false)`,
      [userId, type, title, message, priority]
    );
  } catch (error) {
    console.error('Error creando notificación:', error);
  }
};

export default router;
