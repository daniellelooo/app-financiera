import React, { useState, useEffect } from "react";
import {
  BookOpen,
  PlayCircle,
  CheckCircle,
  Lock,
  Award,
  Brain,
  Calculator,
  TrendingUp,
  Shield,
  Target,
  Sparkles,
  DollarSign,
  PiggyBank,
  Lightbulb,
} from "lucide-react";

const Education = () => {
  const [completedLessons, setCompletedLessons] = useState([]);
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showQuizResult, setShowQuizResult] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  // Función helper para renderizar iconos
  const renderIcon = (iconName, size, color) => {
    const icons = {
      target: <Target size={size} color={color} />,
      book: <BookOpen size={size} color={color} />,
      dollar: <DollarSign size={size} color={color} />,
      piggy: <PiggyBank size={size} color={color} />,
    };
    return icons[iconName] || <Award size={size} color={color} />;
  };

  // Cargar progreso al montar el componente
  useEffect(() => {
    fetchProgress();
    fetchStats();
  }, []);

  const fetchProgress = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/education/progress`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        const data = await res.json();
        setCompletedLessons(data.completedLessons || []);
        setUnlockedAchievements(data.achievements || []);
      }
    } catch (error) {
      console.error("Error cargando progreso:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/education/stats`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error cargando estadísticas:", error);
    }
  };

  const modules = [
    {
      id: 1,
      title: "Fundamentos de Finanzas Personales",
      icon: Brain,
      lessons: [
        {
          id: 1,
          title: "Qué son las finanzas personales",
          duration: "3 min",
          completed: true,
        },
        {
          id: 2,
          title: "La importancia del dinero en tu vida",
          duration: "3 min",
          completed: true,
        },
        {
          id: 3,
          title: "Ingresos vs. Gastos: Lo básico",
          duration: "2 min",
          completed: false,
        },
        {
          id: 4,
          title: "Tu primera evaluación financiera",
          duration: "4 min",
          completed: false,
        },
      ],
    },
    {
      id: 2,
      title: "Creando tu Primer Presupuesto",
      icon: Calculator,
      lessons: [
        {
          id: 5,
          title: "Qué es un presupuesto y por qué lo necesitas",
          duration: "3 min",
          completed: true,
        },
        {
          id: 6,
          title: "Registrando tus ingresos reales",
          duration: "3 min",
          completed: false,
        },
        {
          id: 7,
          title: "Categorizando tus gastos",
          duration: "3 min",
          completed: false,
        },
        {
          id: 8,
          title: "La regla 50/30/20 para jóvenes",
          duration: "4 min",
          completed: false,
        },
      ],
    },
    {
      id: 3,
      title: "El Poder del Ahorro",
      icon: TrendingUp,
      lessons: [
        {
          id: 9,
          title: "Por qué ahorrar desde joven",
          duration: "3 min",
          completed: false,
        },
        {
          id: 10,
          title: "El interés compuesto: Tu mejor amigo",
          duration: "4 min",
          completed: false,
        },
        {
          id: 11,
          title: "Estrategias de ahorro para estudiantes",
          duration: "4 min",
          completed: false,
        },
        {
          id: 12,
          title: "Creando tu primer fondo de emergencia",
          duration: "5 min",
          completed: false,
        },
      ],
    },
    {
      id: 4,
      title: "Evitando las Trampas de Deuda",
      icon: Shield,
      lessons: [
        {
          id: 13,
          title: "Tipos de deuda: Buena vs. Mala",
          duration: "3 min",
          completed: false,
        },
        {
          id: 14,
          title: "Tarjetas de crédito: Beneficios y riesgos",
          duration: "4 min",
          completed: false,
        },
        {
          id: 15,
          title: "Cómo evitar el sobreendeudamiento",
          duration: "4 min",
          completed: false,
        },
        {
          id: 16,
          title: "Estrategias para salir de deudas",
          duration: "5 min",
          completed: false,
        },
      ],
    },
  ];

  const achievements = [
    {
      id: 1,
      title: "Primer Paso",
      description: "Completaste tu primera lección",
      icon: "target",
      earned: true,
    },
    {
      id: 2,
      title: "Estudiante Dedicado",
      description: "Completaste 5 lecciones",
      icon: "book",
      earned: false,
    },
    {
      id: 3,
      title: "Maestro del Presupuesto",
      description: "Completaste el módulo de presupuesto",
      icon: "dollar",
      earned: false,
    },
    {
      id: 4,
      title: "Genio del Ahorro",
      description: "Completaste el módulo de ahorro",
      icon: "piggy",
      earned: false,
    },
    {
      id: 5,
      title: "Experto Financiero",
      description: "Completaste todos los módulos",
      icon: "👑",
      earned: false,
    },
  ];

  const lessonContent = {
    1: {
      title: "Qué son las finanzas personales",
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
        question:
          "¿Cuál es el beneficio PRINCIPAL de entender las finanzas personales desde joven?",
        options: [
          "Volverse millonario rápidamente",
          "Tener control sobre tu vida económica",
          "Impresionar a los amigos",
          "Conseguir más dinero",
        ],
        correct: 1,
      },
    },
    2: {
      title: "La importancia del dinero en tu vida",
      content: `
        El dinero es una herramienta, no un objetivo. Su importancia radica en que te permite:
        
        → LIBERTAD: Tomar decisiones sin preocuparte por limitaciones económicas
        → SEGURIDAD: Enfrentar imprevistos sin estrés
        → OPORTUNIDADES: Aprovechar oportunidades que requieren inversión
        → TIEMPO: Comprar tiempo y comodidad
        
        Para los estudiantes universitarios, el dinero bien manejado significa:
        • Poder concentrarte en estudiar sin estrés financiero
        • Independencia gradual de tus padres
        • Preparación para la vida profesional
        • Bases sólidas para tu futuro
        
        ¡No se trata de acumular dinero, sino de usarlo inteligentemente!
      `,
      quiz: {
        question:
          "¿Qué representa principalmente el dinero según esta lección?",
        options: [
          "Un objetivo de vida",
          "Una herramienta para lograr objetivos",
          "Una forma de mostrar éxito",
          "Solo números en una cuenta",
        ],
        correct: 1,
      },
    },
    3: {
      title: "Ingresos vs. Gastos: Lo básico",
      content: `
        INGRESOS: Todo el dinero que ENTRA a tu bolsillo
        • Mesada o ayuda familiar
        • Salario de trabajo part-time
        • Becas o subsidios
        • Regalos en efectivo
        
        GASTOS: Todo el dinero que SALE de tu bolsillo
        • Comida y transporte
        • Entretenimiento y salidas
        • Materiales de estudio
        • Ropa y tecnología
        
        → LA REGLA DE ORO:
        Ingresos > Gastos = ✅ Salud financiera
        Ingresos < Gastos = Problemas a la vista
        
        Consejo: Registra TODO durante un mes para saber realmente cuánto gastas.
      `,
      quiz: {
        question: "¿Qué indica que tienes salud financiera?",
        options: [
          "Gastar todo lo que ganas",
          "Tus ingresos son mayores que tus gastos",
          "Pedir prestado frecuentemente",
          "No registrar tus gastos",
        ],
        correct: 1,
      },
    },
    4: {
      title: "Tu primera evaluación financiera",
      content: `
        Es hora de hacer un chequeo honesto de tu situación actual:
        
        PASO 1: Calcula tus ingresos mensuales
        Suma todo el dinero que recibes al mes (promedio de 3 meses)
        
        PASO 2: Lista tus gastos fijos
        • Transporte
        • Comida
        • Celular/Internet
        • Otros gastos regulares
        
        PASO 3: Lista tus gastos variables
        • Salidas
        • Compras impulsivas
        • Caprichos
        
        PASO 4: Haz las cuentas
        Total Ingresos - Total Gastos = ?
        
        Si el resultado es positivo: ¡Vas bien! Puedes ahorrar
        Si es negativo: Necesitas ajustar tus gastos urgentemente
      `,
      quiz: {
        question: "¿Qué debes hacer primero en una evaluación financiera?",
        options: [
          "Empezar a ahorrar inmediatamente",
          "Calcular tus ingresos mensuales",
          "Pedir un préstamo",
          "Comprar cosas que necesitas",
        ],
        correct: 1,
      },
    },
    5: {
      title: "Qué es un presupuesto y por qué lo necesitas",
      content: `
        Un presupuesto es un PLAN para tu dinero. Te dice exactamente cuánto puedes gastar en cada cosa.
        
        ¿POR QUÉ LO NECESITAS?
        
        ✅ Evita sorpresas: Sabes exactamente cuánto dinero tienes
        ✅ Control: Tú decides a dónde va tu dinero
        ✅ Metas: Puedes ahorrar para lo que realmente quieres
        ✅ Paz mental: No más estrés por dinero
        
        MITO: "Los presupuestos son aburridos"
        REALIDAD: Te dan LIBERTAD para gastar sin culpa
        
        Un presupuesto NO es una restricción, es un mapa que te lleva a tus objetivos.
        
        Piénsalo así: ¿Harías un viaje largo sin GPS? Tu presupuesto es el GPS de tu dinero.
      `,
      quiz: {
        question: "¿Qué es realmente un presupuesto?",
        options: [
          "Una restricción que limita tus gastos",
          "Un plan que te dice cómo usar tu dinero",
          "Una forma de volverse rico rápido",
          "Algo que solo necesitan los adultos",
        ],
        correct: 1,
      },
    },
    6: {
      title: "Registrando tus ingresos reales",
      content: `
        Ser honesto con tus ingresos es el primer paso para un presupuesto real.
        
        → QUÉ REGISTRAR:
        
        INGRESOS FIJOS (cada mes igual):
        • Mesada regular
        • Salario de trabajo
        • Beca o subsidio
        
        INGRESOS VARIABLES (cambian cada mes):
        • Trabajos ocasionales
        • Regalos de cumpleaños
        • Ventas de cosas que ya no usas
        
        → TIPS IMPORTANTES:
        
        1. Usa el promedio de 3 meses para ingresos variables
        2. NO cuentes dinero que "esperas" recibir
        3. Sé conservador: Mejor subestimar que sobreestimar
        4. Actualiza tu registro mensualmente
        
        Herramientas: Nuestra app, Excel, o simplemente una libreta.
      `,
      quiz: {
        question:
          "¿Cómo debes manejar los ingresos variables en tu presupuesto?",
        options: [
          "Ignorarlos completamente",
          "Usar el promedio de 3 meses",
          "Contar solo el mes más alto",
          "Inventar una cantidad optimista",
        ],
        correct: 1,
      },
    },
    7: {
      title: "Categorizando tus gastos",
      content: `
        Organizar tus gastos en categorías te ayuda a ver dónde va realmente tu dinero.
        
        → CATEGORÍAS PRINCIPALES:
        
        🍔 NECESIDADES (50%):
        • Comida
        • Transporte
        • Materiales de estudio
        • Productos de higiene
        
        → GUSTOS (30%):
        • Entretenimiento
        • Salidas con amigos
        • Streaming services
        • Hobbies
        
        → AHORRO (20%):
        • Fondo de emergencia
        • Metas específicas
        • Inversiones futuras
        
        🔍 EJERCICIO PRÁCTICO:
        Revisa tus últimos 30 días y clasifica CADA gasto. 
        ¿Te sorprende dónde va más dinero?
        
        La mayoría descubre que gasta más en "gustos" de lo que pensaba.
      `,
      quiz: {
        question: "Según la regla 50/30/20, ¿qué porcentaje deberías ahorrar?",
        options: ["10%", "20%", "30%", "50%"],
        correct: 1,
      },
    },
    8: {
      title: "La regla 50/30/20 para jóvenes",
      content: `
        La regla 50/30/20 es una forma SIMPLE de dividir tu dinero:
        
        → 50% - NECESIDADES
        Lo que TIENES que pagar sí o sí:
        • Comida y transporte
        • Servicios básicos (celular, internet)
        • Útiles escolares
        
        → 30% - DESEOS
        Lo que QUIERES pero no necesitas:
        • Salir a comer
        • Netflix, Spotify
        • Ropa de moda
        • Videojuegos
        
        → 20% - AHORRO
        Para tu futuro:
        • Emergencias
        • Metas a corto plazo
        • Metas a largo plazo
        
        → PARA ESTUDIANTES:
        Si vives con tus padres, intenta ahorrar el 40% en lugar del 20%.
        ¡Aprovecha que no pagas renta ni comida!
      `,
      quiz: {
        question: "En la regla 50/30/20, ¿a qué categoría pertenece Netflix?",
        options: [
          "Necesidades (50%)",
          "Deseos (30%)",
          "Ahorro (20%)",
          "No debería estar en el presupuesto",
        ],
        correct: 1,
      },
    },
    9: {
      title: "Por qué ahorrar desde joven",
      content: `
        Ahorrar cuando eres joven es como plantar un árbol: entre más temprano lo hagas, más grande crecerá.
        
        → VENTAJAS DE AHORRAR JOVEN:
        
        1. TIEMPO = TU SUPERPODER
        Tienes décadas para que tu dinero crezca
        
        2. HÁBITO TEMPRANO
        Es más fácil empezar ahora que cambiar después
        
        3. LIBERTAD FUTURA
        Podrás elegir trabajos que te gusten, no solo los que paguen
        
        4. EMERGENCIAS
        Estarás preparado para imprevistos
        
        5. OPORTUNIDADES
        Cuando aparezca una gran oportunidad, tendrás el dinero
        
        → EJEMPLO REAL:
        Si ahorras $50,000 al mes desde los 20 años:
        A los 30 tendrás $6,000,000 + intereses
        ¡Sin contar el interés compuesto!
      `,
      quiz: {
        question: "¿Cuál es la MAYOR ventaja de ahorrar desde joven?",
        options: [
          "Impresionar a tus amigos",
          "El tiempo permite que tu dinero crezca más",
          "Puedes comprar cosas caras",
          "Es más fácil que trabajar",
        ],
        correct: 1,
      },
    },
    10: {
      title: "El interés compuesto: Tu mejor amigo",
      content: `
        Albert Einstein dijo: "El interés compuesto es la octava maravilla del mundo".
        
        🤔 ¿QUÉ ES?
        Es ganar interés sobre tu dinero... ¡Y sobre los intereses que ya ganaste!
        
        → EJEMPLO MÁGICO:
        
        Inviertes $1,000,000 al 10% anual:
        Año 1: $1,100,000 (ganas $100,000)
        Año 2: $1,210,000 (ganas $110,000)
        Año 3: $1,331,000 (ganas $121,000)
        
        ¡Los intereses generan más intereses!
        
        → COMPARACIÓN PODEROSA:
        Persona A ahorra desde los 20 a los 30 (10 años)
        Persona B ahorra desde los 30 a los 60 (30 años)
        
        ¿Quién tiene más dinero a los 60?
        ¡Persona A! Porque el tiempo hizo todo el trabajo.
        
        CONCLUSIÓN: Empieza YA, aunque sea con poco.
      `,
      quiz: {
        question: "¿Qué hace el interés compuesto?",
        options: [
          "Suma una cantidad fija cada mes",
          "Genera interés sobre el capital y los intereses acumulados",
          "Solo funciona con mucho dinero",
          "Es solo para bancos",
        ],
        correct: 1,
      },
    },
    11: {
      title: "Estrategias de ahorro para estudiantes",
      content: `
        No necesitas ganar mucho para ahorrar. Aquí tienes estrategias realistas:
        
        → MÉTODO "PÁGATE PRIMERO"
        Cuando recibas dinero, aparta el 20% ANTES de gastar
        
        → LA REGLA DE LAS 24 HORAS
        ¿Quieres comprar algo? Espera 24 horas. Si todavía lo quieres, cómpralo.
        
        🍕 TRAE LUNCH
        Ahorras $30,000-$50,000 al mes vs. comer fuera
        
        ☕ CAFÉ EN CASA
        Un café diario = $90,000 al mes. Hazlo en casa = $10,000
        
        → REVISA SUSCRIPCIONES
        ¿Realmente usas Netflix, Spotify, Prime, HBO, Disney+?
        Elige 1-2 y compártelas con amigos
        
        🚶 CAMINA MÁS
        Si está a menos de 20min, camina en vez de Uber
        
        → CASH PARA GASTOS
        Retira efectivo semanal. Cuando se acabe, se acabe.
      `,
      quiz: {
        question: "¿Qué es el método 'Págate primero'?",
        options: [
          "Comprar lo que quieras primero",
          "Apartar dinero para ahorro antes de gastar",
          "Pagar tus deudas al final del mes",
          "Gastar todo y ahorrar lo que sobre",
        ],
        correct: 1,
      },
    },
    12: {
      title: "Creando tu primer fondo de emergencia",
      content: `
        Un fondo de emergencia es dinero guardado SOLO para imprevistos.
        
        🚨 ¿CUÁNDO LO USAS?
        • Se descompone tu laptop
        • Emergencia médica
        • Pérdida de beca o trabajo
        • Imprevisto familiar grave
        
        ❌ NO ES PARA:
        • Salir de fiesta
        • Comprar ropa
        • Vacaciones
        • "Se me antojó"
        
        → ¿CUÁNTO NECESITAS?
        
        META INICIAL: $500,000
        (cubre la mayoría de emergencias pequeñas)
        
        META INTERMEDIA: 3 meses de gastos
        (suficiente para sobrevivir sin ingresos)
        
        META AVANZADA: 6 meses de gastos
        (tranquilidad total)
        
        📍 DÓNDE GUARDARLO:
        • Cuenta de ahorros separada
        • Fácil de acceder
        • NO en tu cuenta principal
        • NO en efectivo en casa
      `,
      quiz: {
        question: "¿Cuál es una emergencia REAL para usar tu fondo?",
        options: [
          "Salieron zapatos en oferta",
          "Se descompuso tu laptop",
          "Quieres cambiar de celular",
          "Tus amigos van de viaje",
        ],
        correct: 1,
      },
    },
    13: {
      title: "Tipos de deuda: Buena vs. Mala",
      content: `
        No todas las deudas son malas. Aprende a diferenciarlas:
        
        ✅ DEUDA BUENA (Te hace crecer):
        • Préstamo estudiantil con baja tasa
        • Crédito para emprender un negocio
        • Hipoteca de vivienda
        
        Características:
        - Baja tasa de interés (<10%)
        - Genera valor a futuro
        - Aumenta tu patrimonio
        
        ❌ DEUDA MALA (Te hunde):
        • Tarjeta de crédito sin pagar completo
        • Préstamos gota a gota
        • Créditos de consumo para gustos
        
        Características:
        - Alta tasa de interés (>20%)
        - Para consumo que no genera valor
        - Reduce tu patrimonio
        
        → REGLA DE ORO:
        Solo endeúdate para INVERTIR en ti mismo, no para CONSUMIR.
      `,
      quiz: {
        question: "¿Qué caracteriza a una deuda buena?",
        options: [
          "Tiene interés alto pero puedes pagarla",
          "Genera valor a futuro con baja tasa de interés",
          "Es para comprar cosas que quieres",
          "Cualquier deuda es mala",
        ],
        correct: 1,
      },
    },
    14: {
      title: "Tarjetas de crédito: Beneficios y riesgos",
      content: `
        Las tarjetas de crédito son herramientas poderosas... que pueden ayudarte o destruirte.
        
        ✅ BENEFICIOS:
        • Construyes historial crediticio
        • Protección en compras
        • Puntos y cashback
        • Disponibilidad en emergencias
        • No cargas efectivo
        
        → RIESGOS:
        • Intereses altísimos (30-50% anual)
        • Fácil gastar más de lo que tienes
        • Cuota de manejo
        • Deuda creciente si no pagas completo
        
        📏 REGLAS DE ORO:
        
        1. USA SOLO SI PUEDES PAGAR COMPLETO
        2. Nunca gastes más del 30% del límite
        3. Paga SIEMPRE el total, no el mínimo
        4. Usa solo para cosas que ya planeabas comprar
        5. No la uses para emergencias (para eso está tu fondo)
        
        💀 TRAMPA MORTAL:
        Pagar solo el mínimo = deuda eterna
      `,
      quiz: {
        question:
          "¿Cuál es la regla más importante de las tarjetas de crédito?",
        options: [
          "Usar todo el límite disponible",
          "Pagar siempre el total, no el mínimo",
          "Pedir el límite más alto posible",
          "Tener muchas tarjetas",
        ],
        correct: 1,
      },
    },
    15: {
      title: "Cómo evitar el sobreendeudamiento",
      content: `
        El sobreendeudamiento es cuando debes más de lo que puedes pagar. Aquí cómo evitarlo:
        
        🚦 SEÑALES DE ALERTA:
        • Pagas deudas con más deudas
        • Usas toda tu tarjeta cada mes
        • Solo pagas el mínimo
        • Evitas ver tus estados de cuenta
        • Te estresas cuando piensas en dinero
        
        → ESTRATEGIAS DE PREVENCIÓN:
        
        1. REGLA DEL 30%
        Tus pagos de deuda NO deben superar el 30% de tus ingresos
        
        2. PRESUPUESTO ESTRICTO
        Si tienes deudas, sigue el presupuesto al pie de la letra
        
        3. NO MÁS DEUDA
        Si ya debes, NO te endeudes más hasta liquidar
        
        4. FONDO DE EMERGENCIA
        Evita pedir prestado para imprevistos
        
        5. PIENSA DOS VECES
        Antes de comprar a crédito: ¿Realmente lo necesito?
        
        → MANTRA: "Si no puedo pagarlo en efectivo, no puedo comprarlo"
      `,
      quiz: {
        question: "¿Cuánto de tus ingresos puede ir a pago de deudas?",
        options: [
          "Hasta el 50%",
          "Máximo el 30%",
          "Todo lo que puedas",
          "No importa el porcentaje",
        ],
        correct: 1,
      },
    },
    16: {
      title: "Estrategias para salir de deudas",
      content: `
        Si ya estás endeudado, no te preocupes. Hay salida. Aquí el plan:
        
        → MÉTODO BOLA DE NIEVE:
        1. Lista todas tus deudas de menor a mayor
        2. Paga el mínimo en todas
        3. Pon dinero EXTRA en la más pequeña
        4. Cuando la liquides, ataca la siguiente
        5. Repite hasta ser libre
        
        ¿Por qué funciona? Victorias tempranas te motivan
        
        💪 MÉTODO AVALANCHA:
        1. Lista deudas de mayor a menor interés
        2. Ataca primero las de interés alto
        3. Ahorras más dinero en intereses
        
        ¿Por qué funciona? Es matemáticamente óptimo
        
        → PLAN DE ATAQUE:
        • Negocia tasas de interés más bajas
        • Busca ingresos extra temporales
        • Vende cosas que no usas
        • Recorta gastos al mínimo
        • Celebra cada deuda liquidada
        
        ⏰ SÉ PACIENTE: Salir de deudas toma tiempo, ¡pero es posible!
      `,
      quiz: {
        question: "¿Qué método de pago de deudas te da victorias rápidas?",
        options: [
          "Pagar todas un poco",
          "Método Bola de Nieve (de menor a mayor)",
          "Ignorarlas y esperar",
          "Pedir más préstamos",
        ],
        correct: 1,
      },
    },
  };

  // Refrescar todos los retos automáticamente
  const refreshChallenges = async () => {
    const token = localStorage.getItem("token");
    try {
      await fetch(
        `${import.meta.env.VITE_API_URL}/api/gamification/refresh-challenges`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (err) {
      console.error("Error refrescando retos:", err);
    }
  };

  const handleCompleteLesson = async (lessonId, quizScore) => {
    if (completedLessons.includes(lessonId)) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/education/complete-lesson`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ lessonId, score: quizScore }),
        }
      );

      if (res.ok) {
        const data = await res.json();
        setCompletedLessons([...completedLessons, lessonId]);

        // Mostrar notificación de nuevos logros
        if (data.newAchievements && data.newAchievements.length > 0) {
          setUnlockedAchievements([
            ...unlockedAchievements,
            ...data.newAchievements,
          ]);
          alert(
            `¡Felicidades! Has desbloqueado ${data.newAchievements.length} nuevo(s) logro(s)`
          );
        }

        // Refrescar todos los retos
        await refreshChallenges();

        fetchStats();
        setSelectedLesson(null);
      }
    } catch (error) {
      console.error("Error completando lección:", error);
      alert("Error al guardar progreso");
    }
  };

  const handleQuizSubmit = () => {
    if (selectedAnswer === null) {
      alert("Por favor selecciona una respuesta");
      return;
    }

    const content = lessonContent[selectedLesson.id];
    const isCorrect = selectedAnswer === content.quiz.correct;
    const score = isCorrect ? 100 : 0;

    setShowQuizResult(true);

    // Completar lección automáticamente después del quiz
    if (isCorrect) {
      setTimeout(() => {
        handleCompleteLesson(selectedLesson.id, score);
      }, 2000);
    }
  };

  const handleLessonClick = (lesson, moduleIndex, lessonIndex) => {
    if (!isLessonAccessible(lesson, moduleIndex, lessonIndex)) {
      alert("Debes completar la lección anterior primero");
      return;
    }

    setSelectedLesson(lesson);
    setSelectedAnswer(null);
    setShowQuizResult(false);
  };

  const isLessonAccessible = (lesson, moduleIndex, lessonIndex) => {
    if (lessonIndex === 0) return true;
    return completedLessons.includes(
      modules[moduleIndex].lessons[lessonIndex - 1].id
    );
  };

  const totalLessons = modules.reduce(
    (sum, module) => sum + module.lessons.length,
    0
  );
  const progressPercentage = (completedLessons.length / totalLessons) * 100;

  if (selectedLesson && lessonContent[selectedLesson.id]) {
    const content = lessonContent[selectedLesson.id];

    return (
      <div className="card">
        <button
          onClick={() => setSelectedLesson(null)}
          className="btn btn-secondary"
          style={{ marginBottom: "2rem" }}
        >
          ← Volver a módulos
        </button>

        <h1 className="card-title">{content.title}</h1>

        <div
          style={{
            background: "#f8f9fa",
            padding: "2rem",
            borderRadius: "8px",
            marginBottom: "2rem",
            lineHeight: "1.6",
            whiteSpace: "pre-line",
          }}
        >
          {content.content}
        </div>

        {content.quiz && !completedLessons.includes(selectedLesson.id) && (
          <div
            className="card"
            style={{
              background: showQuizResult
                ? selectedAnswer === content.quiz.correct
                  ? "#d4edda"
                  : "#f8d7da"
                : "#e3f2fd",
              transition: "all 0.3s",
            }}
          >
            <h3
              style={{
                marginBottom: "1.5rem",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <BookOpen size={20} /> Quiz de la Lección
            </h3>
            <p style={{ fontSize: "1.1rem", marginBottom: "1.5rem" }}>
              <strong>{content.quiz.question}</strong>
            </p>

            {!showQuizResult ? (
              <>
                {content.quiz.options.map((option, index) => (
                  <div key={index} style={{ marginBottom: "1rem" }}>
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                        padding: "12px",
                        borderRadius: "6px",
                        border: `2px solid ${
                          selectedAnswer === index ? "#667eea" : "#ddd"
                        }`,
                        background:
                          selectedAnswer === index ? "#f0f4ff" : "white",
                        transition: "all 0.2s",
                      }}
                    >
                      <input
                        type="radio"
                        name="quiz"
                        value={index}
                        checked={selectedAnswer === index}
                        onChange={() => setSelectedAnswer(index)}
                        style={{ marginRight: "10px", cursor: "pointer" }}
                      />
                      <span style={{ fontSize: "15px" }}>{option}</span>
                    </label>
                  </div>
                ))}
                <button
                  onClick={handleQuizSubmit}
                  className="btn btn-primary"
                  style={{ marginTop: "1rem", width: "100%" }}
                  disabled={selectedAnswer === null}
                >
                  Enviar Respuesta
                </button>
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "2rem" }}>
                {selectedAnswer === content.quiz.correct ? (
                  <>
                    <CheckCircle
                      size={48}
                      color="#28a745"
                      style={{ marginBottom: "1rem" }}
                    />
                    <h3 style={{ color: "#28a745", marginBottom: "1rem" }}>
                      ¡Respuesta Correcta!
                    </h3>
                    <p>Completando la lección...</p>
                  </>
                ) : (
                  <>
                    <p style={{ fontSize: "2rem", marginBottom: "1rem" }}>❌</p>
                    <h3 style={{ color: "#dc3545", marginBottom: "1rem" }}>
                      Respuesta Incorrecta
                    </h3>
                    <p style={{ marginBottom: "1rem" }}>
                      La respuesta correcta era:{" "}
                      <strong>
                        {content.quiz.options[content.quiz.correct]}
                      </strong>
                    </p>
                    <button
                      onClick={() => {
                        setShowQuizResult(false);
                        setSelectedAnswer(null);
                      }}
                      className="btn btn-primary"
                    >
                      Intentar de Nuevo
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {completedLessons.includes(selectedLesson.id) && (
          <div
            className="card"
            style={{
              background: "#d4edda",
              textAlign: "center",
              padding: "2rem",
            }}
          >
            <CheckCircle
              size={48}
              color="#28a745"
              style={{ marginBottom: "1rem" }}
            />
            <h3 style={{ color: "#28a745" }}>✅ Lección Completada</h3>
            <p>¡Excelente trabajo! Continúa con la siguiente lección.</p>
          </div>
        )}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
        <p>Cargando tu progreso...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header con Estadísticas */}
      <div
        className="card"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
        }}
      >
        <h1
          className="card-title"
          style={{ color: "white", marginBottom: "1.5rem" }}
        >
          <BookOpen
            size={32}
            style={{ marginRight: "10px", verticalAlign: "middle" }}
          />
          Educación Financiera
        </h1>

        {stats && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1.5rem",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "2.5rem",
                  fontWeight: "bold",
                  marginBottom: "0.5rem",
                }}
              >
                {stats.completedLessons}/{stats.totalLessons}
              </div>
              <div style={{ opacity: 0.9 }}>Lecciones Completadas</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "2.5rem",
                  fontWeight: "bold",
                  marginBottom: "0.5rem",
                }}
              >
                {stats.unlockedAchievements}/{stats.totalAchievements}
              </div>
              <div style={{ opacity: 0.9 }}>Logros Desbloqueados</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "2.5rem",
                  fontWeight: "bold",
                  marginBottom: "0.5rem",
                }}
              >
                {stats.averageScore.toFixed(0)}%
              </div>
              <div style={{ opacity: 0.9 }}>Promedio en Quizzes</div>
            </div>
          </div>
        )}

        <div style={{ marginTop: "2rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "0.5rem",
              opacity: 0.9,
            }}
          >
            <span>Progreso General:</span>
            <span>{progressPercentage.toFixed(1)}%</span>
          </div>

          <div
            style={{
              width: "100%",
              height: "24px",
              backgroundColor: "rgba(255,255,255,0.3)",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${progressPercentage}%`,
                height: "100%",
                background: "linear-gradient(90deg, #4caf50, #8bc34a)",
                transition: "width 0.5s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                paddingRight: "10px",
                fontWeight: "bold",
                fontSize: "12px",
              }}
            >
              {progressPercentage > 5 && `${progressPercentage.toFixed(0)}%`}
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard">
        {modules.map((module, moduleIndex) => {
          const ModuleIcon = module.icon;
          const completedInModule = module.lessons.filter((lesson) =>
            completedLessons.includes(lesson.id)
          ).length;

          return (
            <div key={module.id} className="card">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "1rem",
                }}
              >
                <ModuleIcon
                  size={32}
                  style={{ marginRight: "10px", color: "#667eea" }}
                />
                <div>
                  <h3 style={{ margin: 0 }}>{module.title}</h3>
                  <p style={{ margin: 0, color: "#666", fontSize: "0.9rem" }}>
                    {completedInModule}/{module.lessons.length} lecciones
                    completadas
                  </p>
                </div>
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <div
                  style={{
                    width: "100%",
                    height: "8px",
                    backgroundColor: "#e0e0e0",
                    borderRadius: "4px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${
                        (completedInModule / module.lessons.length) * 100
                      }%`,
                      height: "100%",
                      backgroundColor: "#667eea",
                      transition: "width 0.3s ease",
                    }}
                  ></div>
                </div>
              </div>

              {module.lessons.map((lesson, lessonIndex) => {
                const isAccessible = isLessonAccessible(
                  lesson,
                  moduleIndex,
                  lessonIndex
                );
                const isCompleted = completedLessons.includes(lesson.id);

                return (
                  <div
                    key={lesson.id}
                    onClick={() =>
                      isAccessible &&
                      handleLessonClick(lesson, moduleIndex, lessonIndex)
                    }
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "10px",
                      borderRadius: "4px",
                      marginBottom: "5px",
                      cursor: isAccessible ? "pointer" : "not-allowed",
                      background: isCompleted
                        ? "#e8f5e8"
                        : isAccessible
                        ? "#f8f9fa"
                        : "#f0f0f0",
                      opacity: isAccessible ? 1 : 0.6,
                      border: isCompleted
                        ? "2px solid #4caf50"
                        : "1px solid #ddd",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      {isCompleted ? (
                        <CheckCircle
                          size={20}
                          color="#4caf50"
                          style={{ marginRight: "10px" }}
                        />
                      ) : isAccessible ? (
                        <PlayCircle
                          size={20}
                          color="#667eea"
                          style={{ marginRight: "10px" }}
                        />
                      ) : (
                        <Lock
                          size={20}
                          color="#999"
                          style={{ marginRight: "10px" }}
                        />
                      )}
                      <span
                        style={{ fontWeight: isCompleted ? "bold" : "normal" }}
                      >
                        {lesson.title}
                      </span>
                    </div>
                    <span style={{ fontSize: "0.8rem", color: "#666" }}>
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
          <Award
            size={24}
            style={{ marginRight: "10px", verticalAlign: "middle" }}
          />
          Logros y Reconocimientos
        </h3>

        <div className="dashboard">
          {achievements.map((achievement) => {
            const isEarned = unlockedAchievements.includes(achievement.id);
            return (
              <div
                key={achievement.id}
                className="card"
                style={{
                  textAlign: "center",
                  opacity: isEarned ? 1 : 0.5,
                  border: isEarned ? "3px solid #ffd700" : "1px solid #ddd",
                  transform: isEarned ? "scale(1.02)" : "scale(1)",
                  transition: "all 0.3s",
                  boxShadow: isEarned
                    ? "0 4px 20px rgba(255, 215, 0, 0.3)"
                    : "0 2px 10px rgba(0,0,0,0.1)",
                }}
              >
                <div
                  style={{
                    marginBottom: "1rem",
                    filter: isEarned ? "none" : "grayscale(100%)",
                  }}
                >
                  {renderIcon(
                    achievement.icon,
                    56,
                    isEarned ? "#4F46E5" : "#999"
                  )}
                </div>
                <h4
                  style={{
                    margin: "0 0 0.5rem 0",
                    color: isEarned ? "#333" : "#999",
                  }}
                >
                  {achievement.title}
                </h4>
                <p
                  style={{
                    margin: 0,
                    fontSize: "0.9rem",
                    color: isEarned ? "#666" : "#aaa",
                  }}
                >
                  {achievement.description}
                </p>
                {isEarned ? (
                  <div
                    style={{
                      marginTop: "0.75rem",
                      padding: "0.5rem 1rem",
                      background:
                        "linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)",
                      borderRadius: "20px",
                      fontSize: "0.85rem",
                      fontWeight: "bold",
                      color: "#333",
                      boxShadow: "0 2px 8px rgba(255, 215, 0, 0.4)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                    }}
                  >
                    <Sparkles size={16} /> ¡DESBLOQUEADO! <Sparkles size={16} />
                  </div>
                ) : (
                  <div
                    style={{
                      marginTop: "0.75rem",
                      padding: "0.5rem 1rem",
                      background: "#f0f0f0",
                      borderRadius: "20px",
                      fontSize: "0.85rem",
                      color: "#999",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                    }}
                  >
                    <Lock size={16} /> Bloqueado
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div
        className="card"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
        }}
      >
        <h3
          className="card-title"
          style={{ display: "flex", alignItems: "center", gap: "10px" }}
        >
          <Lightbulb size={24} /> Tip del Día
        </h3>
        <p style={{ margin: 0, fontSize: "1.1rem" }}>
          "El interés compuesto es la octava maravilla del mundo. Quien lo
          entiende, lo gana; quien no lo entiende, lo paga." - Albert Einstein
        </p>
        <p style={{ margin: "1rem 0 0 0", fontSize: "0.9rem", opacity: 0.9 }}>
          Comenzar a ahorrar desde joven, aunque sea poco, puede hacer una
          diferencia enorme en tu futuro financiero gracias al poder del tiempo
          y el interés compuesto.
        </p>
      </div>
    </div>
  );
};

export default Education;
