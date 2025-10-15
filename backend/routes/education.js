import express from 'express';
const router = express.Router();

// Obtener progreso de educación del usuario
router.get('/progress', async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await req.db.query(
      'SELECT * FROM education_progress WHERE user_id = $1',
      [userId]
    );
    
    res.json({
      completedLessons: result.rows.map(row => row.lesson_id),
      achievements: result.rows
        .filter(row => row.achievement_id)
        .map(row => row.achievement_id)
    });
  } catch (error) {
    console.error('Error obteniendo progreso:', error);
    res.status(500).json({ error: 'Error al obtener progreso' });
  }
});

// Marcar lección como completada
router.post('/complete-lesson', async (req, res) => {
  try {
    const userId = req.user.id;
    const { lessonId, score } = req.body;

    // Verificar si ya está completada
    const existing = await req.db.query(
      'SELECT * FROM education_progress WHERE user_id = $1 AND lesson_id = $2',
      [userId, lessonId]
    );

    if (existing.rows.length === 0) {
      // Insertar nueva lección completada
      await req.db.query(
        'INSERT INTO education_progress (user_id, lesson_id, completed_at, quiz_score) VALUES ($1, $2, NOW(), $3)',
        [userId, lessonId, score || 0]
      );
    }

    // Verificar logros
    const completedCount = await req.db.query(
      'SELECT COUNT(*) FROM education_progress WHERE user_id = $1 AND lesson_id IS NOT NULL',
      [userId]
    );
    
    const count = parseInt(completedCount.rows[0].count);
    const newAchievements = [];

    // Logro: Primera lección
    if (count === 1) {
      await unlockAchievement(req.db, userId, 1);
      newAchievements.push(1);
    }
    
    // Logro: 5 lecciones
    if (count === 5) {
      await unlockAchievement(req.db, userId, 2);
      newAchievements.push(2);
    }

    // Logro: 10 lecciones
    if (count === 10) {
      await unlockAchievement(req.db, userId, 3);
      newAchievements.push(3);
    }

    // Logro: 16 lecciones (todas)
    if (count === 16) {
      await unlockAchievement(req.db, userId, 5);
      newAchievements.push(5);
    }

    res.json({ 
      success: true, 
      newAchievements,
      totalCompleted: count
    });
  } catch (error) {
    console.error('Error completando lección:', error);
    res.status(500).json({ error: 'Error al completar lección' });
  }
});

// Desbloquear logro
async function unlockAchievement(db, userId, achievementId) {
  const existing = await db.query(
    'SELECT * FROM education_progress WHERE user_id = $1 AND achievement_id = $2',
    [userId, achievementId]
  );

  if (existing.rows.length === 0) {
    await db.query(
      'INSERT INTO education_progress (user_id, achievement_id, completed_at) VALUES ($1, $2, NOW())',
      [userId, achievementId]
    );
  }
}

// Obtener estadísticas de educación
router.get('/stats', async (req, res) => {
  try {
    const userId = req.user.id;
    
    const completed = await req.db.query(
      'SELECT COUNT(*) FROM education_progress WHERE user_id = $1 AND lesson_id IS NOT NULL',
      [userId]
    );

    const achievements = await req.db.query(
      'SELECT COUNT(*) FROM education_progress WHERE user_id = $1 AND achievement_id IS NOT NULL',
      [userId]
    );

    const avgScore = await req.db.query(
      'SELECT AVG(quiz_score) as avg FROM education_progress WHERE user_id = $1 AND quiz_score IS NOT NULL',
      [userId]
    );

    res.json({
      completedLessons: parseInt(completed.rows[0].count),
      totalLessons: 16,
      unlockedAchievements: parseInt(achievements.rows[0].count),
      totalAchievements: 5,
      averageScore: parseFloat(avgScore.rows[0].avg) || 0
    });
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
});

export default router;
