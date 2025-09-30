import React, { useMemo, useState } from "react";
import {
  BarChart,
  PieChart,
  TrendingUp,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import {
  VictoryPie,
  VictoryBar,
  VictoryChart,
  VictoryAxis,
  VictoryTooltip,
  VictoryLegend,
  VictoryTheme,
} from "victory";

const monthsES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const Statistics = ({ userExpenses, totalSaved }) => {
  // Estado para filtro
  const [filterType, setFilterType] = useState("mes");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Obtener ingresos reales del localStorage (ya que no se pasan por props)
  const [userIncomes, setUserIncomes] = useState([]);
  React.useEffect(() => {
    const fetchIncomes = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/incomes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setUserIncomes(Array.isArray(data) ? data : []);
      } catch {}
    };
    fetchIncomes();
  }, []);

  // Filtrar gastos e ingresos según filtro
  const filteredExpenses = useMemo(() => {
    if (!Array.isArray(userExpenses)) return [];
    if (filterType === "mes") {
      return userExpenses.filter((e) => {
        const d = new Date(e.date);
        return (
          d.getMonth() === selectedMonth && d.getFullYear() === selectedYear
        );
      });
    }
    return userExpenses.filter((e) => {
      const d = new Date(e.date);
      return d.getFullYear() === selectedYear;
    });
  }, [userExpenses, filterType, selectedMonth, selectedYear]);

  const filteredIncomes = useMemo(() => {
    if (!Array.isArray(userIncomes)) return [];
    if (filterType === "mes") {
      return userIncomes.filter((i) => {
        const d = new Date(i.date);
        return (
          d.getMonth() === selectedMonth && d.getFullYear() === selectedYear
        );
      });
    }
    return userIncomes.filter((i) => {
      const d = new Date(i.date);
      return d.getFullYear() === selectedYear;
    });
  }, [userIncomes, filterType, selectedMonth, selectedYear]);

  // Calcular estadísticas por categorías (filtradas)
  const expensesByCategory = filteredExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});
  const categories = Object.keys(expensesByCategory);
  const totalExpenses = Object.values(expensesByCategory).reduce(
    (sum, amount) => sum + amount,
    0
  );
  const totalIncomes = filteredIncomes.reduce(
    (sum, i) => sum + (i.amount || 0),
    0
  );
  const totalSavings = typeof totalSaved === "number" ? totalSaved : 0;

  // Datos para análisis de IA (puedes personalizarlo con insights reales si lo deseas)
  const aiInsights = [
    {
      type: "warning",
      title: "Gasto elevado en alguna categoría",
      description:
        categories.length > 0
          ? `Tu mayor gasto este periodo fue en ${categories[0]}`
          : "No hay datos suficientes.",
      recommendation:
        "Revisa tus gastos y ajusta tu presupuesto si es necesario.",
      icon: AlertTriangle,
      color: "#ff9800",
    },
    {
      type: "positive",
      title: "Ahorro acumulado",
      description: `Tus ahorros actuales: $${totalSavings.toLocaleString()}`,
      recommendation: "Sigue ahorrando para alcanzar tus metas.",
      icon: TrendingUp,
      color: "#4caf50",
    },
  ];

  // Salud financiera simple basada en proporción ahorro/gasto/ingreso
  const ahorroRate =
    totalIncomes > 0
      ? ((totalIncomes - totalExpenses) / totalIncomes) * 100
      : 0;
  const financialHealth = {
    score: Math.max(0, Math.min(100, Math.round(ahorroRate + 50))),
    level: ahorroRate > 20 ? "Excelente" : ahorroRate > 0 ? "Bueno" : "Bajo",
    factors: [
      {
        name: "Ahorro",
        score: Math.round(ahorroRate),
        status:
          ahorroRate > 20 ? "Excelente" : ahorroRate > 0 ? "Bueno" : "Bajo",
      },
      {
        name: "Gastos",
        score: Math.round((totalExpenses / (totalIncomes || 1)) * 100),
        status: totalExpenses < totalIncomes ? "Bueno" : "Alto",
      },
    ],
  };

  // Filtros UI
  const handleMonthChange = (e) => setSelectedMonth(Number(e.target.value));
  const handleYearChange = (e) => setSelectedYear(Number(e.target.value));

  // Calcular semanas del año seleccionado

  // Gráficos: datos para Victory
  const pieData = categories.map((cat) => ({
    x: cat,
    y: expensesByCategory[cat],
  }));
  const barData = [
    { x: "Ingresos", y: totalIncomes },
    { x: "Gastos", y: totalExpenses },
    { x: "Ahorros", y: totalSavings },
  ];

  return (
    <div>
      <div className="card" style={{ marginBottom: 24 }}>
        <h2 style={{ marginBottom: 12 }}>Filtrar estadísticas</h2>
        <div
          style={{
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <label>
            <input
              type="radio"
              checked={filterType === "mes"}
              onChange={() => setFilterType("mes")}
            />{" "}
            Por mes
          </label>
          <label>
            <input
              type="radio"
              checked={filterType === "año"}
              onChange={() => setFilterType("año")}
            />{" "}
            Por año
          </label>
          <select value={selectedYear} onChange={handleYearChange}>
            {Array.from(
              { length: 5 },
              (_, i) => new Date().getFullYear() - i
            ).map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          {filterType === "mes" && (
            <select value={selectedMonth} onChange={handleMonthChange}>
              {monthsES.map((m, i) => (
                <option key={m} value={i}>
                  {m}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>
      <div className="card">
        <h1 className="card-title">
          <BarChart
            size={32}
            style={{ marginRight: "10px", verticalAlign: "middle" }}
          />
          Mis Estadísticas Financieras
        </h1>

        <div className="dashboard">
          <div className="card stats-card">
            <h3 style={{ margin: "0 0 1rem 0" }}>Salud Financiera</h3>
            <div
              style={{
                position: "relative",
                width: "120px",
                height: "120px",
                margin: "0 auto",
              }}
            >
              <svg
                width="120"
                height="120"
                style={{ transform: "rotate(-90deg)" }}
              >
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  stroke="#e0e0e0"
                  strokeWidth="10"
                  fill="transparent"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  stroke="#4caf50"
                  strokeWidth="10"
                  fill="transparent"
                  strokeDasharray={`${(financialHealth.score / 100) * 314} 314`}
                />
              </svg>
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "2rem", fontWeight: "bold" }}>
                  {financialHealth.score}
                </div>
                <div style={{ fontSize: "0.9rem" }}>
                  {financialHealth.level}
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 style={{ margin: "0 0 1rem 0" }}>
              Factores de Salud Financiera
            </h3>
            {financialHealth.factors.map((factor, index) => (
              <div key={index} style={{ marginBottom: "1rem" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "0.5rem",
                  }}
                >
                  <span style={{ fontSize: "0.9rem" }}>{factor.name}</span>
                  <span
                    style={{
                      fontSize: "0.8rem",
                      color:
                        factor.score >= 80
                          ? "#4caf50"
                          : factor.score >= 60
                          ? "#ff9800"
                          : "#f44336",
                    }}
                  >
                    {factor.status}
                  </span>
                </div>
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
                      width: `${factor.score}%`,
                      height: "100%",
                      backgroundColor:
                        factor.score >= 80
                          ? "#4caf50"
                          : factor.score >= 60
                          ? "#ff9800"
                          : "#f44336",
                      transition: "width 0.3s ease",
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="dashboard">
        <div className="card">
          <h3 className="card-title">
            <PieChart
              size={24}
              style={{ marginRight: "10px", verticalAlign: "middle" }}
            />
            Gastos por Categoría
          </h3>
          {categories.length === 0 ? (
            <p style={{ textAlign: "center", color: "#666", padding: "2rem" }}>
              No hay datos de gastos para mostrar. ¡Comienza registrando tus
              gastos!
            </p>
          ) : (
            <VictoryPie
              data={pieData}
              colorScale={[
                "#667eea",
                "#84fab0",
                "#f093fb",
                "#ffecd2",
                "#a8edea",
                "#d299c2",
                "#89f7fe",
              ]}
              labelComponent={<VictoryTooltip />}
              style={{ labels: { fontSize: 14, fill: "#333" } }}
              height={250}
              padding={{ top: 20, bottom: 40, left: 80, right: 80 }}
            />
          )}
        </div>

        <div className="card">
          <h3 className="card-title">
            <Calendar
              size={24}
              style={{ marginRight: "10px", verticalAlign: "middle" }}
            />
            Resumen Ingresos/Gastos/Ahorros
          </h3>
          <VictoryChart
            theme={VictoryTheme.material}
            domainPadding={40}
            height={250}
            padding={{ top: 20, bottom: 40, left: 60, right: 60 }}
          >
            <VictoryAxis style={{ tickLabels: { fontSize: 14 } }} />
            <VictoryAxis
              dependentAxis
              style={{ tickLabels: { fontSize: 14 } }}
            />
            <VictoryBar
              data={barData}
              labels={({ datum }) => `$${datum.y.toLocaleString()}`}
              labelComponent={<VictoryTooltip />}
              style={{ data: { fill: "#667eea" }, labels: { fontSize: 12 } }}
              barWidth={40}
            />
          </VictoryChart>
        </div>
      </div>

      <div className="card">
        <h3 className="card-title">🤖 Análisis Inteligente de IA</h3>
        <p style={{ marginBottom: "2rem", color: "#666" }}>
          Basado en tus hábitos financieros, aquí tienes recomendaciones
          personalizadas:
        </p>

        {aiInsights.map((insight, index) => {
          const IconComponent = insight.icon;

          return (
            <div
              key={index}
              className="card"
              style={{
                margin: "1rem 0",
                borderLeft: `4px solid ${insight.color}`,
                background:
                  insight.type === "positive"
                    ? "#e8f5e8"
                    : insight.type === "warning"
                    ? "#fff3e0"
                    : "#e3f2fd",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start" }}>
                <IconComponent
                  size={24}
                  color={insight.color}
                  style={{ marginRight: "1rem", marginTop: "0.25rem" }}
                />
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: "0 0 0.5rem 0", color: insight.color }}>
                    {insight.title}
                  </h4>
                  <p style={{ margin: "0 0 0.5rem 0" }}>
                    {insight.description}
                  </p>
                  <p style={{ margin: 0, fontStyle: "italic", color: "#666" }}>
                    <strong>Recomendación:</strong> {insight.recommendation}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div
        className="card"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
        }}
      >
        <h3 className="card-title">📊 Resumen del Mes</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "2rem",
          }}
        >
          <div>
            <h4 style={{ margin: "0 0 0.5rem 0" }}>Meta de Ahorro</h4>
            <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
              {/* Progreso de la meta de ahorro más avanzada */}
              {(() => {
                // Simula una meta de ahorro principal (la de mayor porcentaje)
                // Si hay metas, calcula el % de avance de la más avanzada
                if (typeof window !== "undefined" && window.savingsGoals) {
                  const goals = window.savingsGoals;
                  if (goals.length > 0) {
                    const best = goals.reduce((a, b) =>
                      a.current / a.target > b.current / b.target ? a : b
                    );
                    const percent = Math.min(
                      100,
                      Math.round((best.current / best.target) * 100)
                    );
                    return `${percent}% alcanzado (${best.name})`;
                  }
                }
                return "Sin metas";
              })()}
            </div>
          </div>
          <div>
            <h4 style={{ margin: "0 0 0.5rem 0" }}>Categoría Top</h4>
            <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
              {categories.length > 0 ? categories[0] : "N/A"}
            </div>
          </div>
          <div>
            <h4 style={{ margin: "0 0 0.5rem 0" }}>Días sin gastos extras</h4>
            <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
              {/* Días del mes actual sin gastos fuera de categoría "Necesario" */}
              {(() => {
                if (!Array.isArray(filteredExpenses)) return "-";
                const daysInMonth = new Date(
                  selectedYear,
                  selectedMonth + 1,
                  0
                ).getDate();
                let daysWithoutExtra = 0;
                for (let d = 1; d <= daysInMonth; d++) {
                  const dayExpenses = filteredExpenses.filter((e) => {
                    const date = new Date(e.date);
                    return (
                      date.getDate() === d &&
                      date.getMonth() === selectedMonth &&
                      date.getFullYear() === selectedYear
                    );
                  });
                  // Si todos los gastos del día son "Necesario" (o no hay gastos), cuenta como día sin extra
                  if (dayExpenses.every((e) => e.category === "Necesario")) {
                    daysWithoutExtra++;
                  }
                }
                return `${daysWithoutExtra} días`;
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
