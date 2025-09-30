import React, { useState } from 'react';
import { BookOpen, PlayCircle, CheckCircle, Lock, Award, Brain, Calculator, TrendingUp, Shield } from 'lucide-react';

const Education = () => {
  const [completedLessons, setCompletedLessons] = useState([1, 2, 5]);
  const [selectedLesson, setSelectedLesson] = useState(null);

  const modules = [
    {
      id: 1,
      title: 'Fundamentos de Finanzas Personales',
      icon: Brain,
      lessons: [
        { id: 1, title: 'Qué son las finanzas personales', duration: '5 min', completed: true },
        { id: 2, title: 'La importancia del dinero en tu vida', duration: '7 min', completed: true },
        { id: 3, title: 'Ingresos vs. Gastos: Lo básico', duration: '6 min', completed: false },
        { id: 4, title: 'Tu primera evaluación financiera', duration: '10 min', completed: false }
      ]
    },
    {
      id: 2,
      title: 'Creando tu Primer Presupuesto',
      icon: Calculator,
      lessons: [
        { id: 5, title: 'Qué es un presupuesto y por qué lo necesitas', duration: '8 min', completed: true },
        { id: 6, title: 'Registrando tus ingresos reales', duration: '6 min', completed: false },
        { id: 7, title: 'Categorizando tus gastos', duration: '9 min', completed: false },
        { id: 8, title: 'La regla 50/30/20 para jóvenes', duration: '12 min', completed: false }
      ]
    },
    {
      id: 3,
      title: 'El Poder del Ahorro',
      icon: TrendingUp,
      lessons: [
        { id: 9, title: 'Por qué ahorrar desde joven', duration: '7 min', completed: false },
        { id: 10, title: 'El interés compuesto: Tu mejor amigo', duration: '10 min', completed: false },
        { id: 11, title: 'Estrategias de ahorro para estudiantes', duration: '8 min', completed: false },
        { id: 12, title: 'Creando tu primer fondo de emergencia', duration: '15 min', completed: false }
      ]
    },
    {
      id: 4,
      title: 'Evitando las Trampas de Deuda',
      icon: Shield,
      lessons: [
        { id: 13, title: 'Tipos de deuda: Buena vs. Mala', duration: '9 min', completed: false },
        { id: 14, title: 'Tarjetas de crédito: Beneficios y riesgos', duration: '11 min', completed: false },
        { id: 15, title: 'Cómo evitar el sobreendeudamiento', duration: '8 min', completed: false },
        { id: 16, title: 'Estrategias para salir de deudas', duration: '13 min', completed: false }
      ]
    }
  ];

  const achievements = [
    { id: 1, title: 'Primer Paso', description: 'Completaste tu primera lección', icon: '🎯', earned: true },
    { id: 2, title: 'Estudiante Dedicado', description: 'Completaste 5 lecciones', icon: '📚', earned: false },
    { id: 3, title: 'Maestro del Presupuesto', description: 'Completaste el módulo de presupuesto', icon: '💰', earned: false },
    { id: 4, title: 'Genio del Ahorro', description: 'Completaste el módulo de ahorro', icon: '🏦', earned: false },
    { id: 5, title: 'Experto Financiero', description: 'Completaste todos los módulos', icon: '👑', earned: false }
  ];

  const lessonContent = {
    1: {
      title: 'Qué son las finanzas personales',
      content: `
        Las finanzas personales son el conjunto de decisiones que tomas sobre tu dinero día a día. 
        Incluyen cómo ganas, gastas, ahorras e inviertes tu dinero.
        
        Para los jóvenes, entender las finanzas personales es crucial porque:
        
        • Te da control sobre tu vida económica
        • Te ayuda a alcanzar tus metas y sueños
        • Te protege de problemas financieros futuros
        • Te permite tomar decisiones informadas
        
        Recuerda: No necesitas ser rico para manejar bien tu dinero. 
        ¡Incluso con pocos recursos puedes crear hábitos financieros saludables!
      `,
      quiz: {
        question: '¿Cuál es el beneficio PRINCIPAL de entender las finanzas personales desde joven?',
        options: [
          'Volverse millonario rápidamente',
          'Tener control sobre tu vida económica',
          'Impresionar a los amigos',
          'Conseguir más dinero'
        ],
        correct: 1
      }
    },
    2: {
      title: 'La importancia del dinero en tu vida',
      content: `
        El dinero es una herramienta, no un objetivo. Su importancia radica en que te permite:
        
        🎯 LIBERTAD: Tomar decisiones sin preocuparte por limitaciones económicas
        🛡️ SEGURIDAD: Enfrentar imprevistos sin estrés
        🌟 OPORTUNIDADES: Aprovechar oportunidades que requieren inversión
        ⏳ TIEMPO: Comprar tiempo y comodidad
        
        Para los estudiantes universitarios, el dinero bien manejado significa:
        • Poder concentrarte en estudiar sin estrés financiero
        • Independencia gradual de tus padres
        • Preparación para la vida profesional
        • Bases sólidas para tu futuro
        
        ¡No se trata de acumular dinero, sino de usarlo inteligentemente!
      `,
      quiz: {
        question: '¿Qué representa principalmente el dinero según esta lección?',
        options: [
          'Un objetivo de vida',
          'Una herramienta para lograr objetivos',
          'Una forma de mostrar éxito',
          'Solo números en una cuenta'
        ],
        correct: 1
      }
    }
  };

  const handleCompleteLesson = (lessonId) => {
    if (!completedLessons.includes(lessonId)) {
      setCompletedLessons([...completedLessons, lessonId]);
    }
  };

  const handleLessonClick = (lesson) => {
    // Solo permitir acceso si la lección anterior está completada o es la primera
    const moduleIndex = modules.findIndex(m => m.lessons.some(l => l.id === lesson.id));
    const lessonIndex = modules[moduleIndex].lessons.findIndex(l => l.id === lesson.id);
    
    if (lessonIndex === 0 || completedLessons.includes(modules[moduleIndex].lessons[lessonIndex - 1].id)) {
      setSelectedLesson(lesson);
    }
  };

  const isLessonAccessible = (lesson, moduleIndex, lessonIndex) => {
    if (lessonIndex === 0) return true;
    return completedLessons.includes(modules[moduleIndex].lessons[lessonIndex - 1].id);
  };

  const totalLessons = modules.reduce((sum, module) => sum + module.lessons.length, 0);
  const progressPercentage = (completedLessons.length / totalLessons) * 100;

  if (selectedLesson && lessonContent[selectedLesson.id]) {
    const content = lessonContent[selectedLesson.id];
    
    return (
      <div className="card">
        <button 
          onClick={() => setSelectedLesson(null)}
          className="btn btn-secondary"
          style={{ marginBottom: '2rem' }}
        >
          ← Volver a módulos
        </button>
        
        <h1 className="card-title">{content.title}</h1>
        
        <div style={{ 
          background: '#f8f9fa', 
          padding: '2rem', 
          borderRadius: '8px', 
          marginBottom: '2rem',
          lineHeight: '1.6',
          whiteSpace: 'pre-line'
        }}>
          {content.content}
        </div>

        {content.quiz && (
          <div className="card" style={{ background: '#e3f2fd' }}>
            <h3>Quiz de la Lección</h3>
            <p><strong>{content.quiz.question}</strong></p>
            {content.quiz.options.map((option, index) => (
              <div key={index} style={{ marginBottom: '0.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input type="radio" name="quiz" value={index} style={{ marginRight: '0.5rem' }} />
                  {option}
                </label>
              </div>
            ))}
          </div>
        )}

        <button 
          onClick={() => handleCompleteLesson(selectedLesson.id)}
          className="btn btn-primary"
          style={{ marginTop: '2rem' }}
          disabled={completedLessons.includes(selectedLesson.id)}
        >
          {completedLessons.includes(selectedLesson.id) ? (
            <>
              <CheckCircle size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Lección Completada
            </>
          ) : (
            'Marcar como Completada'
          )}
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <h1 className="card-title">
          <BookOpen size={32} style={{ marginRight: '10px', verticalAlign: 'middle' }} />
          Educación Financiera
        </h1>
        
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span>Progreso General:</span>
            <span>{completedLessons.length}/{totalLessons} lecciones completadas</span>
          </div>
          
          <div style={{ 
            width: '100%', 
            height: '20px', 
            backgroundColor: '#e0e0e0', 
            borderRadius: '10px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${progressPercentage}%`,
              height: '100%',
              backgroundColor: '#4caf50',
              transition: 'width 0.3s ease'
            }}></div>
          </div>
          
          <p style={{ marginTop: '0.5rem', color: '#666' }}>
            {progressPercentage.toFixed(1)}% completado
          </p>
        </div>
      </div>

      <div className="dashboard">
        {modules.map((module, moduleIndex) => {
          const ModuleIcon = module.icon;
          const completedInModule = module.lessons.filter(lesson => 
            completedLessons.includes(lesson.id)
          ).length;
          
          return (
            <div key={module.id} className="card">
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <ModuleIcon size={32} style={{ marginRight: '10px', color: '#667eea' }} />
                <div>
                  <h3 style={{ margin: 0 }}>{module.title}</h3>
                  <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>
                    {completedInModule}/{module.lessons.length} lecciones completadas
                  </p>
                </div>
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ 
                  width: '100%', 
                  height: '8px', 
                  backgroundColor: '#e0e0e0', 
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${(completedInModule / module.lessons.length) * 100}%`,
                    height: '100%',
                    backgroundColor: '#667eea',
                    transition: 'width 0.3s ease'
                  }}></div>
                </div>
              </div>

              {module.lessons.map((lesson, lessonIndex) => {
                const isAccessible = isLessonAccessible(lesson, moduleIndex, lessonIndex);
                const isCompleted = completedLessons.includes(lesson.id);
                
                return (
                  <div 
                    key={lesson.id}
                    onClick={() => isAccessible && handleLessonClick(lesson)}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '10px',
                      borderRadius: '4px',
                      marginBottom: '5px',
                      cursor: isAccessible ? 'pointer' : 'not-allowed',
                      background: isCompleted ? '#e8f5e8' : isAccessible ? '#f8f9fa' : '#f0f0f0',
                      opacity: isAccessible ? 1 : 0.6,
                      border: isCompleted ? '2px solid #4caf50' : '1px solid #ddd'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      {isCompleted ? (
                        <CheckCircle size={20} color="#4caf50" style={{ marginRight: '10px' }} />
                      ) : isAccessible ? (
                        <PlayCircle size={20} color="#667eea" style={{ marginRight: '10px' }} />
                      ) : (
                        <Lock size={20} color="#999" style={{ marginRight: '10px' }} />
                      )}
                      <span style={{ fontWeight: isCompleted ? 'bold' : 'normal' }}>
                        {lesson.title}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.8rem', color: '#666' }}>
                      {lesson.duration}
                    </span>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      <div className="card">
        <h3 className="card-title">
          <Award size={24} style={{ marginRight: '10px', verticalAlign: 'middle' }} />
          Logros y Reconocimientos
        </h3>
        
        <div className="dashboard">
          {achievements.map(achievement => (
            <div 
              key={achievement.id}
              className="card"
              style={{
                textAlign: 'center',
                opacity: achievement.earned ? 1 : 0.5,
                border: achievement.earned ? '2px solid #ffd700' : '1px solid #ddd'
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                {achievement.icon}
              </div>
              <h4 style={{ margin: '0 0 0.5rem 0' }}>{achievement.title}</h4>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>
                {achievement.description}
              </p>
              {achievement.earned && (
                <div style={{ 
                  marginTop: '0.5rem', 
                  padding: '0.25rem 0.5rem',
                  background: '#ffd700',
                  borderRadius: '12px',
                  fontSize: '0.8rem',
                  fontWeight: 'bold'
                }}>
                  ¡DESBLOQUEADO!
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <h3 className="card-title">💡 Tip del Día</h3>
        <p style={{ margin: 0, fontSize: '1.1rem' }}>
          "El interés compuesto es la octava maravilla del mundo. Quien lo entiende, lo gana; 
          quien no lo entiende, lo paga." - Albert Einstein
        </p>
        <p style={{ margin: '1rem 0 0 0', fontSize: '0.9rem', opacity: 0.9 }}>
          Comenzar a ahorrar desde joven, aunque sea poco, puede hacer una diferencia enorme 
          en tu futuro financiero gracias al poder del tiempo y el interés compuesto.
        </p>
      </div>
    </div>
  );
};

export default Education;
