import express from 'express';
const router = express.Router();

// Helper para crear notificaciones
const createNotification = async (db, userId, type, title, message, priority = 'low') => {
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

// Obtener datos de gamificación del usuario
router.get('/profile', async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Obtener o crear perfil de gamificación
    let profile = await req.db.query(
      'SELECT * FROM gamification_profile WHERE user_id = $1',
      [userId]
    );

    if (profile.rows.length === 0) {
      // Crear perfil inicial
      await req.db.query(
        'INSERT INTO gamification_profile (user_id, points, level, current_streak, best_streak) VALUES ($1, 0, 1, 0, 0)',
        [userId]
      );
      profile = await req.db.query(
        'SELECT * FROM gamification_profile WHERE user_id = $1',
        [userId]
      );
    }

    res.json(profile.rows[0]);
  } catch (error) {
    console.error('Error obteniendo perfil de gamificación:', error);
    res.status(500).json({ error: 'Error al obtener perfil' });
  }
});

// Obtener desafíos activos
router.get('/challenges', async (req, res) => {
  try {
    const userId = req.user.id;
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    
    // Obtener desafíos del mes actual
    const challenges = await req.db.query(
      `SELECT c.*, uc.completed, uc.progress, uc.completed_at 
       FROM challenges c
       LEFT JOIN user_challenges uc ON c.id = uc.challenge_id AND uc.user_id = $1
       WHERE c.month = $2 OR c.month IS NULL
       ORDER BY c.id`,
      [userId, currentMonth]
    );

    res.json(challenges.rows);
  } catch (error) {
    console.error('Error obteniendo desafíos:', error);
    res.status(500).json({ error: 'Error al obtener desafíos' });
  }
});

// Actualizar progreso de desafío
router.post('/update-challenge', async (req, res) => {
  try {
    const userId = req.user.id;
    const { challengeId, progress } = req.body;

    // Obtener información del desafío
    const challenge = await req.db.query(
      'SELECT * FROM challenges WHERE id = $1',
      [challengeId]
    );

    if (challenge.rows.length === 0) {
      return res.status(404).json({ error: 'Desafío no encontrado' });
    }

    const challengeData = challenge.rows[0];
    const isCompleted = progress >= challengeData.target;

    // Verificar si ya existe registro
    const existing = await req.db.query(
      'SELECT * FROM user_challenges WHERE user_id = $1 AND challenge_id = $2',
      [userId, challengeId]
    );

    if (existing.rows.length === 0) {
      // Crear nuevo registro
      await req.db.query(
        'INSERT INTO user_challenges (user_id, challenge_id, progress, completed) VALUES ($1, $2, $3, $4)',
        [userId, challengeId, progress, isCompleted]
      );
    } else {
      // Actualizar progreso
      await req.db.query(
        'UPDATE user_challenges SET progress = $1, completed = $2, completed_at = $3 WHERE user_id = $4 AND challenge_id = $5',
        [progress, isCompleted, isCompleted ? new Date() : null, userId, challengeId]
      );
    }

    // Si se completó, otorgar puntos y crear notificación
    if (isCompleted && !existing.rows[0]?.completed) {
      await addPoints(req.db, userId, challengeData.reward_points);
      
      // Crear notificación de logro
      await createNotification(
        req.db,
        userId,
        'achievement',
        '🎉 ¡Reto Completado!',
        `Has completado el reto "${challengeData.title}" y ganado ${challengeData.reward_points} puntos`,
        'medium'
      );
    }

    res.json({ success: true, isCompleted, pointsEarned: isCompleted ? challengeData.reward_points : 0 });
  } catch (error) {
    console.error('Error actualizando desafío:', error);
    res.status(500).json({ error: 'Error al actualizar desafío' });
  }
});

// Obtener badges/insignias
router.get('/badges', async (req, res) => {
  try {
    const userId = req.user.id;
    
    const badges = await req.db.query(
      `SELECT b.*, ub.earned_at 
       FROM badges b
       LEFT JOIN user_badges ub ON b.id = ub.badge_id AND ub.user_id = $1
       ORDER BY b.id`,
      [userId]
    );

    res.json(badges.rows);
  } catch (error) {
    console.error('Error obteniendo badges:', error);
    res.status(500).json({ error: 'Error al obtener badges' });
  }
});

// Actualizar racha
router.post('/update-streak', async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Verificar última actividad
    const lastActivity = await req.db.query(
      'SELECT last_activity_date FROM gamification_profile WHERE user_id = $1',
      [userId]
    );

    const today = new Date().toISOString().slice(0, 10);
    const lastDate = lastActivity.rows[0]?.last_activity_date;

    if (lastDate === today) {
      return res.json({ message: 'Ya registraste actividad hoy' });
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);

    let newStreak = 1;
    
    if (lastDate === yesterdayStr) {
      // Continuar racha
      const current = await req.db.query(
        'SELECT current_streak FROM gamification_profile WHERE user_id = $1',
        [userId]
      );
      newStreak = (current.rows[0]?.current_streak || 0) + 1;
    }

    // Actualizar racha y mejor racha
    await req.db.query(
      `UPDATE gamification_profile 
       SET current_streak = $1, 
           best_streak = GREATEST(best_streak, $1),
           last_activity_date = $2
       WHERE user_id = $3`,
      [newStreak, today, userId]
    );

    // Otorgar puntos por racha
    if (newStreak % 7 === 0) {
      await addPoints(req.db, userId, 50); // Bonus por semana completa
    } else {
      await addPoints(req.db, userId, 5);
    }

    res.json({ newStreak, pointsEarned: newStreak % 7 === 0 ? 50 : 5 });
  } catch (error) {
    console.error('Error actualizando racha:', error);
    res.status(500).json({ error: 'Error al actualizar racha' });
  }
});

// Función auxiliar para agregar puntos y verificar nivel
async function addPoints(db, userId, points) {
  // Agregar puntos
  await db.query(
    'UPDATE gamification_profile SET points = points + $1 WHERE user_id = $2',
    [points, userId]
  );

  // Obtener puntos actuales
  const result = await db.query(
    'SELECT points, level FROM gamification_profile WHERE user_id = $1',
    [userId]
  );

  const { points: currentPoints, level: currentLevel } = result.rows[0];

  // Calcular nivel (cada 1000 puntos = 1 nivel)
  const newLevel = Math.floor(currentPoints / 1000) + 1;

  if (newLevel > currentLevel) {
    await db.query(
      'UPDATE gamification_profile SET level = $1 WHERE user_id = $2',
      [newLevel, userId]
    );
    
    // Crear notificación de subida de nivel
    await createNotification(
      db,
      userId,
      'achievement',
      '⭐ ¡Nivel Alcanzado!',
      `¡Felicitaciones! Has alcanzado el nivel ${newLevel}`,
      'high'
    );
  }

  return { newLevel, leveledUp: newLevel > currentLevel };
}

// Ranking de usuarios
router.get('/leaderboard', async (req, res) => {
  try {
    const leaderboard = await req.db.query(
      `SELECT u.name, g.points, g.level, g.current_streak
       FROM gamification_profile g
       JOIN users u ON g.user_id = u.id
       ORDER BY g.points DESC
       LIMIT 10`
    );

    res.json(leaderboard.rows);
  } catch (error) {
    console.error('Error obteniendo ranking:', error);
    res.status(500).json({ error: 'Error al obtener ranking' });
  }
});

// Recalcular/refrescar progreso de todos los desafíos
router.post('/refresh-challenges', async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Desafío: Primer Ahorro (ID 1) - contar todas las metas de ahorro
    const allGoals = await req.db.query(
      'SELECT COUNT(*) FROM goals WHERE user_id = $1',
      [userId]
    );
    const savingsCount = parseInt(allGoals.rows[0].count);
    if (savingsCount > 0) {
      await updateChallengeProgress(req.db, userId, 1, Math.min(savingsCount, 1));
    }

    // 2. Desafío: Ahorro Constante (ID 2) - 3 metas de ahorro
    await updateChallengeProgress(req.db, userId, 2, Math.min(savingsCount, 3));

    // 3. Desafío: Control de Gastos - 7 días seguidos con gastos (ID 3)
    const consecutiveDays = await calculateConsecutiveDaysWithExpenses(req.db, userId);
    await updateChallengeProgress(req.db, userId, 3, Math.min(consecutiveDays, 7));

    // 4. Desafío: Meta Alcanzada (ID 4)
    const completedGoals = await req.db.query(
      'SELECT COUNT(*) FROM goals WHERE user_id = $1 AND completed = true',
      [userId]
    );
    const goalsCompleted = parseInt(completedGoals.rows[0].count);
    await updateChallengeProgress(req.db, userId, 4, Math.min(goalsCompleted, 1));

    // 5. Desafío: Educación Financiera (ID 5) - 5 lecciones completadas
    const lessonsCompleted = await req.db.query(
      'SELECT COUNT(*) FROM education_progress WHERE user_id = $1 AND lesson_id IS NOT NULL',
      [userId]
    );
    const lessonsCount = parseInt(lessonsCompleted.rows[0].count);
    await updateChallengeProgress(req.db, userId, 5, Math.min(lessonsCount, 5));

    // Actualizar racha automáticamente si hay actividad hoy
    await updateStreakIfActive(req.db, userId);

    // Verificar y otorgar badges
    await checkAndAwardBadges(req.db, userId);

    res.json({ success: true, message: 'Desafíos actualizados' });
  } catch (error) {
    console.error('Error refrescando desafíos:', error);
    res.status(500).json({ error: 'Error al refrescar desafíos' });
  }
});

// Helper: Actualizar progreso de un desafío específico
async function updateChallengeProgress(db, userId, challengeId, progress) {
  const challenge = await db.query('SELECT * FROM challenges WHERE id = $1', [challengeId]);
  if (challenge.rows.length === 0) return;

  const challengeData = challenge.rows[0];
  const isCompleted = progress >= challengeData.target;

  const existing = await db.query(
    'SELECT * FROM user_challenges WHERE user_id = $1 AND challenge_id = $2',
    [userId, challengeId]
  );

  if (existing.rows.length === 0) {
    // Insertar nuevo registro
    await db.query(
      'INSERT INTO user_challenges (user_id, challenge_id, progress, completed, completed_at) VALUES ($1, $2, $3, $4, $5)',
      [userId, challengeId, progress, isCompleted, isCompleted ? new Date() : null]
    );
    
    // Si se inserta ya completado, otorgar puntos
    if (isCompleted) {
      await addPoints(db, userId, challengeData.reward_points);
      await createNotification(
        db,
        userId,
        'achievement',
        '🎉 ¡Reto Completado!',
        `Has completado el reto "${challengeData.title}" y ganado ${challengeData.reward_points} puntos`,
        'medium'
      );
    }
  } else {
    const wasCompleted = existing.rows[0].completed;
    await db.query(
      'UPDATE user_challenges SET progress = $1, completed = $2, completed_at = $3 WHERE user_id = $4 AND challenge_id = $5',
      [progress, isCompleted, isCompleted ? new Date() : null, userId, challengeId]
    );

    // Si acaba de completarse (no estaba completado antes), otorgar puntos
    if (isCompleted && !wasCompleted) {
      await addPoints(db, userId, challengeData.reward_points);
      await createNotification(
        db,
        userId,
        'achievement',
        '🎉 ¡Reto Completado!',
        `Has completado el reto "${challengeData.title}" y ganado ${challengeData.reward_points} puntos`,
        'medium'
      );
    }
  }
}

// Helper: Calcular días consecutivos con gastos registrados
async function calculateConsecutiveDaysWithExpenses(db, userId) {
  const expenses = await db.query(
    `SELECT DISTINCT DATE(date) as expense_date 
     FROM expenses 
     WHERE user_id = $1 
     ORDER BY expense_date DESC`,
    [userId]
  );

  if (expenses.rows.length === 0) return 0;

  let consecutive = 1;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < expenses.rows.length - 1; i++) {
    const currentDate = new Date(expenses.rows[i].expense_date);
    const nextDate = new Date(expenses.rows[i + 1].expense_date);
    
    const diffTime = Math.abs(currentDate - nextDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      consecutive++;
    } else {
      break;
    }
  }

  return consecutive;
}

// Helper: Actualizar racha automáticamente si hay actividad hoy
async function updateStreakIfActive(db, userId) {
  try {
    const today = new Date().toISOString().slice(0, 10);
    
    // Verificar si hay actividad hoy (gastos, ingresos o metas)
    const hasActivity = await db.query(
      `SELECT EXISTS(
        SELECT 1 FROM expenses WHERE user_id = $1 AND DATE(date) = $2
        UNION ALL
        SELECT 1 FROM incomes WHERE user_id = $1 AND DATE(date) = $2
        UNION ALL
        SELECT 1 FROM goals WHERE user_id = $1 AND DATE(deadline) = $2
        LIMIT 1
      )`,
      [userId, today]
    );

    if (!hasActivity.rows[0].exists) {
      return; // No hay actividad hoy, no actualizar racha
    }

    // Obtener última fecha de actividad
    const lastActivity = await db.query(
      'SELECT last_activity_date, current_streak FROM gamification_profile WHERE user_id = $1',
      [userId]
    );

    const lastDate = lastActivity.rows[0]?.last_activity_date;

    if (lastDate === today) {
      return; // Ya se actualizó hoy
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);

    let newStreak = 1;
    
    if (lastDate === yesterdayStr) {
      // Continuar racha
      newStreak = (lastActivity.rows[0]?.current_streak || 0) + 1;
    }

    // Actualizar racha y mejor racha
    await db.query(
      `UPDATE gamification_profile 
       SET current_streak = $1, 
           best_streak = GREATEST(best_streak, $1),
           last_activity_date = $2
       WHERE user_id = $3`,
      [newStreak, today, userId]
    );

    // Otorgar puntos por racha
    if (newStreak % 7 === 0) {
      await addPoints(db, userId, 50); // Bonus por semana completa
    } else {
      await addPoints(db, userId, 5);
    }
  } catch (error) {
    console.error('Error actualizando racha:', error);
  }
}

// Helper: Verificar y otorgar badges automáticamente
async function checkAndAwardBadges(db, userId) {
  // Badge: Principiante (first_transaction) - Primer movimiento registrado
  const hasTransactions = await db.query(
    `SELECT EXISTS(
      SELECT 1 FROM expenses WHERE user_id = $1
      UNION ALL
      SELECT 1 FROM incomes WHERE user_id = $1
      LIMIT 1
    )`,
    [userId]
  );
  
  if (hasTransactions.rows[0].exists) {
    await awardBadge(db, userId, 1); // ID 1: Principiante
  }

  // Badge: Ahorrador Novato (first_saving) - Primer ahorro
  const hasGoals = await db.query(
    'SELECT EXISTS(SELECT 1 FROM goals WHERE user_id = $1 LIMIT 1)',
    [userId]
  );
  if (hasGoals.rows[0].exists) {
    await awardBadge(db, userId, 2); // ID 2: Ahorrador Novato
  }

  // Badge: Meta Cumplida (goal_completed) - Meta completada
  const hasCompletedGoal = await db.query(
    'SELECT EXISTS(SELECT 1 FROM goals WHERE user_id = $1 AND completed = true LIMIT 1)',
    [userId]
  );
  if (hasCompletedGoal.rows[0].exists) {
    await awardBadge(db, userId, 3); // ID 3: Meta Cumplida
  }

  // Badge: Maestro del Ahorro (5 goals completed)
  const goalCount = await db.query(
    'SELECT COUNT(*) FROM goals WHERE user_id = $1 AND completed = true',
    [userId]
  );
  if (parseInt(goalCount.rows[0].count) >= 5) {
    await awardBadge(db, userId, 4); // ID 4: Maestro del Ahorro
  }

  // Badge: Estudiante Financiero (3 lessons completed)
  const lessonCount = await db.query(
    'SELECT COUNT(*) FROM education_progress WHERE user_id = $1 AND lesson_id IS NOT NULL',
    [userId]
  );
  if (parseInt(lessonCount.rows[0].count) >= 3) {
    await awardBadge(db, userId, 5); // ID 5: Estudiante Financiero
  }

  // Badge: Racha de Fuego (7 day streak)
  const streak = await db.query(
    'SELECT current_streak FROM gamification_profile WHERE user_id = $1',
    [userId]
  );
  if (streak.rows[0]?.current_streak >= 7) {
    await awardBadge(db, userId, 6); // ID 6: Racha de Fuego
  }
}

// Helper: Otorgar un badge si no lo tiene
async function awardBadge(db, userId, badgeId) {
  const hasBadge = await db.query(
    'SELECT 1 FROM user_badges WHERE user_id = $1 AND badge_id = $2',
    [userId, badgeId]
  );

  if (hasBadge.rows.length === 0) {
    await db.query(
      'INSERT INTO user_badges (user_id, badge_id, earned_at) VALUES ($1, $2, NOW())',
      [userId, badgeId]
    );

    const badge = await db.query('SELECT name FROM badges WHERE id = $1', [badgeId]);
    if (badge.rows.length > 0) {
      await createNotification(
        db,
        userId,
        'achievement',
        '🏆 ¡Nueva Insignia!',
        `Has desbloqueado la insignia "${badge.rows[0].name}"`,
        'high'
      );
    }
  }
}

// Endpoint temporal para limpiar badges incorrectos
router.post('/reset-badges', async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Eliminar todos los badges del usuario
    await req.db.query('DELETE FROM user_badges WHERE user_id = $1', [userId]);
    
    // Refrescar badges correctos
    await checkAndAwardBadges(req.db, userId);
    
    res.json({ success: true, message: 'Badges reiniciados correctamente' });
  } catch (error) {
    console.error('Error reiniciando badges:', error);
    res.status(500).json({ error: 'Error al reiniciar badges' });
  }
});

export default router;
