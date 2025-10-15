import React, { useMemo, useState } from "react";
import {
  BarChart,
  PieChart,
  TrendingUp,
  Calendar,
  AlertTriangle,
  ShoppingCart,
  Car,
  Gamepad2,
  GraduationCap,
  Shirt,
  Heart,
  Smartphone,
  MoreHorizontal,
  Sparkles,
  Activity,
} from "lucide-react";
import {
  VictoryPie,
  VictoryChart,
  VictoryAxis,
  VictoryTooltip,
  VictoryLegend,
  VictoryTheme,
  VictoryLine,
  VictoryGroup,
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
  // Mapa de iconos y colores por categoría (mismo que Budget.jsx)
  const categoryData = {
    Alimentación: { icon: ShoppingCart, color: "#FF6B6B" },
    Transporte: { icon: Car, color: "#4ECDC4" },
    Entretenimiento: { icon: Gamepad2, color: "#95E1D3" },
    Educación: { icon: GraduationCap, color: "#F38181" },
    Ropa: { icon: Shirt, color: "#AA96DA" },
    Salud: { icon: Heart, color: "#FCBAD3" },
    Tecnología: { icon: Smartphone, color: "#A8DADC" },
    Otros: { icon: MoreHorizontal, color: "#C7CEEA" },
  };

  const getCategoryIcon = (category) => {
    const data = categoryData[category] || categoryData["Otros"];
    const IconComponent = data.icon;
    return <IconComponent size={20} style={{ color: data.color }} />;
  };

  const getCategoryColor = (category) => {
    return (categoryData[category] || categoryData["Otros"]).color;
  };

  // Estado para filtro
  const [filterType, setFilterType] = useState("mes");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Obtener ingresos y metas reales
  const [userIncomes, setUserIncomes] = useState([]);
  const [savingsGoals, setSavingsGoals] = useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      try {
        // Fetch incomes
        const incomesRes = await fetch(
          `${import.meta.env.VITE_API_URL}/api/incomes`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const incomesData = await incomesRes.json();
        setUserIncomes(Array.isArray(incomesData) ? incomesData : []);

        // Fetch savings goals
        const goalsRes = await fetch(
          `${import.meta.env.VITE_API_URL}/api/goals`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const goalsData = await goalsRes.json();
        setSavingsGoals(Array.isArray(goalsData) ? goalsData : []);
      } catch {}
    };
    fetchData();
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

  // Estado para sugerencias IA
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);

  React.useEffect(() => {
    const fetchSuggestions = async () => {
      setAiLoading(true);
      setAiError(null);
      try {
        const res = await fetch(
          `${
            import.meta.env.VITE_API_URL || "http://localhost:4000"
          }/api/suggestions`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              // Enviar TODOS los datos del usuario, no solo los filtrados por fecha
              expenses: userExpenses || [],
              incomes: userIncomes || [],
              savingsGoals: [],
            }),
          }
        );
        const data = await res.json();
        // El backend puede devolver texto extra antes de la lista numerada o todo en una sola línea
        let suggestions = [];
        if (typeof data.suggestions === "string") {
          // Extrae todas las ocurrencias de "n. texto" usando regex global
          const matches = [...data.suggestions.matchAll(/\d+\.\s*([^\n\r]+)/g)];
          suggestions = matches
            .map((m) => m[1].trim())
            .filter((s) => s.length > 0)
            .slice(0, 3); // Asegurar que solo se muestren máximo 3
        }
        setAiSuggestions(suggestions);
      } catch (err) {
        setAiError("No se pudieron obtener sugerencias de IA");
      } finally {
        setAiLoading(false);
      }
    };
    fetchSuggestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(userExpenses), JSON.stringify(userIncomes)]);

  // Salud financiera basada en proporción ahorro/gasto/ingreso
  const ahorroRate =
    totalIncomes > 0
      ? ((totalIncomes - totalExpenses) / totalIncomes) * 100
      : 0;

  const gastoRate = Math.round((totalExpenses / (totalIncomes || 1)) * 100);

  const financialHealth = {
    score: Math.max(0, Math.min(100, Math.round(ahorroRate + 50))),
    level: ahorroRate > 20 ? "Excelente" : ahorroRate > 0 ? "Bueno" : "Bajo",
    factors: [
      {
        name: "Ahorro",
        score: Math.max(0, Math.round(ahorroRate)),
        status:
          ahorroRate > 30
            ? "Excelente"
            : ahorroRate > 15
            ? "Bueno"
            : ahorroRate > 0
            ? "Regular"
            : "Bajo",
        color:
          ahorroRate > 30
            ? "#4caf50"
            : ahorroRate > 15
            ? "#8bc34a"
            : ahorroRate > 0
            ? "#ffc107"
            : "#ff9800",
      },
      {
        name: "Gastos",
        score: Math.min(100, gastoRate),
        status:
          gastoRate < 50
            ? "Excelente"
            : gastoRate < 70
            ? "Bueno"
            : gastoRate < 85
            ? "Regular"
            : "Alto",
        color:
          gastoRate < 50
            ? "#4caf50"
            : gastoRate < 70
            ? "#8bc34a"
            : gastoRate < 85
            ? "#ffc107"
            : "#f44336",
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

  // === NUEVA SECCIÓN: Datos para gráfica comparativa de últimos 6 meses ===
  const comparativeData = useMemo(() => {
    const months = [];
    const today = new Date();

    // Generar últimos 6 meses (incluyendo el actual)
    for (let i = 5; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthIndex = date.getMonth();
      const year = date.getFullYear();

      // Filtrar ingresos y gastos de este mes
      const monthIncomes = userIncomes.filter((inc) => {
        const d = new Date(inc.date);
        return d.getMonth() === monthIndex && d.getFullYear() === year;
      });

      const monthExpenses = userExpenses.filter((exp) => {
        const d = new Date(exp.date);
        return d.getMonth() === monthIndex && d.getFullYear() === year;
      });

      const totalInc = monthIncomes.reduce(
        (sum, i) => sum + (i.amount || 0),
        0
      );
      const totalExp = monthExpenses.reduce(
        (sum, e) => sum + (e.amount || 0),
        0
      );

      months.push({
        month: monthsES[monthIndex],
        ingresos: totalInc,
        gastos: totalExp,
      });
    }

    return months;
  }, [userIncomes, userExpenses]);

  return (
    <div>
      <div className="card" style={{ marginBottom: 24 }}>
        <h2
          style={{
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Calendar
            size={24}
            style={{ marginRight: "10px", color: "#667eea" }}
          />
          Filtrar Estadísticas
        </h2>
        <div
          style={{
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => setFilterType("mes")}
              style={{
                padding: "0.7rem 1.5rem",
                borderRadius: "8px",
                border:
                  filterType === "mes"
                    ? "2px solid #667eea"
                    : "2px solid #e0e0e0",
                background:
                  filterType === "mes"
                    ? "linear-gradient(135deg, #667eea, #764ba2)"
                    : "white",
                color: filterType === "mes" ? "white" : "#666",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              Por Mes
            </button>
            <button
              onClick={() => setFilterType("año")}
              style={{
                padding: "0.7rem 1.5rem",
                borderRadius: "8px",
                border:
                  filterType === "año"
                    ? "2px solid #667eea"
                    : "2px solid #e0e0e0",
                background:
                  filterType === "año"
                    ? "linear-gradient(135deg, #667eea, #764ba2)"
                    : "white",
                color: filterType === "año" ? "white" : "#666",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
            >
              Por Año
            </button>
          </div>

          <select
            value={selectedYear}
            onChange={handleYearChange}
            style={{
              padding: "0.7rem 1rem",
              borderRadius: "8px",
              border: "2px solid #e0e0e0",
              background: "white",
              fontSize: "0.95rem",
              fontWeight: "600",
              cursor: "pointer",
              minWidth: "120px",
            }}
          >
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
            <select
              value={selectedMonth}
              onChange={handleMonthChange}
              style={{
                padding: "0.7rem 1rem",
                borderRadius: "8px",
                border: "2px solid #e0e0e0",
                background: "white",
                fontSize: "0.95rem",
                fontWeight: "600",
                cursor: "pointer",
                minWidth: "150px",
              }}
            >
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
          <div
            className="card stats-card"
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Background decoration */}
            <div
              style={{
                position: "absolute",
                top: "-30%",
                right: "-20%",
                width: "200px",
                height: "200px",
                background: "rgba(255,255,255,0.1)",
                borderRadius: "50%",
                filter: "blur(40px)",
              }}
            ></div>

            <h3
              style={{
                margin: "0 0 1.5rem 0",
                position: "relative",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Activity size={24} style={{ marginRight: "10px" }} />
              Salud Financiera
            </h3>
            <div
              style={{
                position: "relative",
                width: "140px",
                height: "140px",
                margin: "0 auto 1rem",
              }}
            >
              <svg
                width="140"
                height="140"
                style={{ transform: "rotate(-90deg)" }}
              >
                <defs>
                  <linearGradient
                    id="healthGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#4caf50" />
                    <stop offset="100%" stopColor="#8bc34a" />
                  </linearGradient>
                </defs>
                <circle
                  cx="70"
                  cy="70"
                  r="60"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="12"
                  fill="transparent"
                />
                <circle
                  cx="70"
                  cy="70"
                  r="60"
                  stroke="url(#healthGradient)"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray={`${(financialHealth.score / 100) * 377} 377`}
                  strokeLinecap="round"
                  style={{
                    transition: "stroke-dasharray 0.8s ease",
                    filter: "drop-shadow(0 0 8px rgba(76, 175, 80, 0.6))",
                  }}
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
                <div style={{ fontSize: "2.5rem", fontWeight: "bold" }}>
                  {financialHealth.score}
                </div>
                <div
                  style={{
                    fontSize: "0.95rem",
                    opacity: 0.95,
                    fontWeight: "600",
                  }}
                >
                  {financialHealth.level}
                </div>
              </div>
            </div>
            <div
              style={{
                textAlign: "center",
                padding: "0.8rem",
                background: "rgba(255,255,255,0.15)",
                borderRadius: "8px",
                fontSize: "0.9rem",
                fontWeight: "500",
              }}
            >
              Basado en tus hábitos financieros
            </div>
          </div>

          <div className="card">
            <h3
              style={{
                margin: "0 0 1.5rem 0",
                fontSize: "1.1rem",
                fontWeight: "700",
              }}
            >
              Factores de Salud Financiera
            </h3>
            {financialHealth.factors.map((factor, index) => (
              <div
                key={index}
                style={{
                  marginBottom: "1.5rem",
                  padding: "1rem",
                  background: "#f8f9fa",
                  borderRadius: "12px",
                  border: `2px solid ${factor.color}20`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "0.8rem",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      fontSize: "1rem",
                      fontWeight: "600",
                      color: "#333",
                    }}
                  >
                    {factor.name}: {Math.max(0, Math.min(100, factor.score))}%
                  </span>
                  <span
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: "700",
                      color: factor.color,
                      padding: "0.3rem 0.8rem",
                      background: `${factor.color}15`,
                      borderRadius: "20px",
                    }}
                  >
                    {factor.status}
                  </span>
                </div>
                <div
                  style={{
                    width: "100%",
                    height: "10px",
                    backgroundColor: "#e0e0e0",
                    borderRadius: "5px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${Math.max(0, Math.min(100, factor.score))}%`,
                      height: "100%",
                      background: `linear-gradient(90deg, ${factor.color}, ${factor.color}dd)`,
                      transition: "width 0.5s ease",
                      borderRadius: "5px",
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
            <>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <VictoryPie
                  data={pieData}
                  colorScale={pieData.map((item) => getCategoryColor(item.x))}
                  labels={({ datum }) => {
                    const percentage = (
                      (datum.y / totalExpenses) *
                      100
                    ).toFixed(1);
                    return `${percentage}%`;
                  }}
                  style={{
                    labels: {
                      fontSize: 13,
                      fill: "#fff",
                      fontWeight: "700",
                      textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                    },
                  }}
                  innerRadius={50}
                  labelRadius={85}
                  width={350}
                  height={240}
                  padding={{ top: 20, bottom: 20, left: 50, right: 50 }}
                />
              </div>
              <div
                style={{
                  marginTop: "20px",
                  paddingTop: "15px",
                  borderTop: "1px solid #e0e0e0",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                    gap: "12px",
                    padding: "0 10px",
                  }}
                >
                  {pieData.map((item, index) => {
                    const percentage = ((item.y / totalExpenses) * 100).toFixed(
                      1
                    );
                    const color = getCategoryColor(item.x);
                    return (
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          fontSize: "13px",
                          padding: "10px 14px",
                          backgroundColor: "#fff",
                          borderRadius: "8px",
                          border: `2px solid ${color}`,
                          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                          transition: "all 0.3s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-2px)";
                          e.currentTarget.style.boxShadow = `0 4px 12px ${color}40`;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow =
                            "0 2px 8px rgba(0,0,0,0.06)";
                        }}
                      >
                        <div style={{ marginRight: "12px", display: "flex" }}>
                          {getCategoryIcon(item.x)}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              fontWeight: "700",
                              color: "#333",
                              marginBottom: "2px",
                            }}
                          >
                            {item.x}
                          </div>
                          <div style={{ fontSize: "12px", color: "#666" }}>
                            ${item.y.toLocaleString()} · {percentage}%
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
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

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1.5rem",
              marginTop: "1.5rem",
            }}
          >
            {/* Ingresos */}
            <div
              style={{
                background: "linear-gradient(135deg, #4caf50 0%, #81c784 100%)",
                padding: "2rem 1.5rem",
                borderRadius: "12px",
                color: "white",
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 4px 20px rgba(76, 175, 80, 0.3)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 30px rgba(76, 175, 80, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 4px 20px rgba(76, 175, 80, 0.3)";
              }}
            >
              {/* Background decoration */}
              <div
                style={{
                  position: "absolute",
                  top: "-30%",
                  right: "-20%",
                  width: "150px",
                  height: "150px",
                  background: "rgba(255,255,255,0.15)",
                  borderRadius: "50%",
                  filter: "blur(30px)",
                }}
              ></div>

              <div style={{ position: "relative" }}>
                <div
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: "600",
                    marginBottom: "1rem",
                    opacity: 0.95,
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  💰 Ingresos
                </div>
                <div
                  style={{
                    fontSize: "2.5rem",
                    fontWeight: "bold",
                    marginBottom: "0.5rem",
                  }}
                >
                  ${totalIncomes.toLocaleString()}
                </div>
                <div
                  style={{
                    fontSize: "0.85rem",
                    opacity: 0.9,
                  }}
                >
                  Total acumulado
                </div>
              </div>
            </div>

            {/* Gastos */}
            <div
              style={{
                background: "linear-gradient(135deg, #f44336 0%, #ef5350 100%)",
                padding: "2rem 1.5rem",
                borderRadius: "12px",
                color: "white",
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 4px 20px rgba(244, 67, 54, 0.3)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 30px rgba(244, 67, 54, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 4px 20px rgba(244, 67, 54, 0.3)";
              }}
            >
              {/* Background decoration */}
              <div
                style={{
                  position: "absolute",
                  top: "-30%",
                  right: "-20%",
                  width: "150px",
                  height: "150px",
                  background: "rgba(255,255,255,0.15)",
                  borderRadius: "50%",
                  filter: "blur(30px)",
                }}
              ></div>

              <div style={{ position: "relative" }}>
                <div
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: "600",
                    marginBottom: "1rem",
                    opacity: 0.95,
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  💸 Gastos
                </div>
                <div
                  style={{
                    fontSize: "2.5rem",
                    fontWeight: "bold",
                    marginBottom: "0.5rem",
                  }}
                >
                  ${totalExpenses.toLocaleString()}
                </div>
                <div
                  style={{
                    fontSize: "0.85rem",
                    opacity: 0.9,
                  }}
                >
                  Total gastado
                </div>
              </div>
            </div>

            {/* Ahorros */}
            <div
              style={{
                background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
                padding: "2rem 1.5rem",
                borderRadius: "12px",
                color: "white",
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 4px 20px rgba(25, 118, 210, 0.3)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 30px rgba(25, 118, 210, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 4px 20px rgba(25, 118, 210, 0.3)";
              }}
            >
              {/* Background decoration */}
              <div
                style={{
                  position: "absolute",
                  top: "-30%",
                  right: "-20%",
                  width: "150px",
                  height: "150px",
                  background: "rgba(255,255,255,0.15)",
                  borderRadius: "50%",
                  filter: "blur(30px)",
                }}
              ></div>

              <div style={{ position: "relative" }}>
                <div
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: "600",
                    marginBottom: "1rem",
                    opacity: 0.95,
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  🐷 Ahorros
                </div>
                <div
                  style={{
                    fontSize: "2.5rem",
                    fontWeight: "bold",
                    marginBottom: "0.5rem",
                  }}
                >
                  ${totalSavings.toLocaleString()}
                </div>
                <div
                  style={{
                    fontSize: "0.85rem",
                    opacity: 0.9,
                  }}
                >
                  Balance disponible
                </div>
              </div>
            </div>
          </div>

          {/* Barra de progreso visual */}
          <div
            style={{
              marginTop: "2rem",
              padding: "1.5rem",
              background: "#f8f9fa",
              borderRadius: "12px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "1rem",
                fontSize: "0.9rem",
                fontWeight: "600",
                color: "#666",
              }}
            >
              <span>Distribución financiera</span>
              <span>
                {totalIncomes > 0
                  ? Math.round((totalExpenses / totalIncomes) * 100)
                  : 0}
                % gastado
              </span>
            </div>
            <div
              style={{
                display: "flex",
                height: "20px",
                borderRadius: "10px",
                overflow: "hidden",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              {totalIncomes > 0 && (
                <>
                  <div
                    style={{
                      width: `${(totalExpenses / totalIncomes) * 100}%`,
                      background: "linear-gradient(90deg, #f44336, #ef5350)",
                      transition: "width 0.5s ease",
                    }}
                    title={`Gastos: ${Math.round(
                      (totalExpenses / totalIncomes) * 100
                    )}%`}
                  ></div>
                  <div
                    style={{
                      width: `${
                        ((totalIncomes - totalExpenses) / totalIncomes) * 100
                      }%`,
                      background: "linear-gradient(90deg, #4caf50, #81c784)",
                      transition: "width 0.5s ease",
                    }}
                    title={`Ahorro: ${Math.round(
                      ((totalIncomes - totalExpenses) / totalIncomes) * 100
                    )}%`}
                  ></div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div
        className="card"
        style={{
          background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background decoration */}
        <div
          style={{
            position: "absolute",
            bottom: "-30%",
            right: "-10%",
            width: "250px",
            height: "250px",
            background: "rgba(255,255,255,0.3)",
            borderRadius: "50%",
            filter: "blur(60px)",
          }}
        ></div>

        <h3
          className="card-title"
          style={{
            display: "flex",
            alignItems: "center",
            position: "relative",
          }}
        >
          <Sparkles
            size={28}
            style={{ marginRight: "10px", color: "#667eea" }}
          />
          Análisis Inteligente de IA
        </h3>
        <p
          style={{
            marginBottom: "1.5rem",
            color: "#555",
            fontSize: "0.95rem",
            position: "relative",
          }}
        >
          Basado en tus hábitos financieros, aquí tienes recomendaciones
          personalizadas:
        </p>

        {aiLoading && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "2rem",
              position: "relative",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                border: "4px solid rgba(102, 126, 234, 0.2)",
                borderTop: "4px solid #667eea",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            ></div>
            <p
              style={{
                marginLeft: "1rem",
                color: "#667eea",
                fontWeight: "600",
              }}
            >
              Cargando sugerencias de IA...
            </p>
          </div>
        )}

        {aiError && (
          <div
            style={{
              padding: "1rem",
              background: "rgba(244, 67, 54, 0.1)",
              borderRadius: "8px",
              color: "#d32f2f",
              fontWeight: "600",
              position: "relative",
            }}
          >
            {aiError}
          </div>
        )}

        {!aiLoading && !aiError && aiSuggestions.length > 0 && (
          <div style={{ position: "relative" }}>
            {aiSuggestions.map((s, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "start",
                  gap: "15px",
                  padding: "1rem",
                  marginBottom: "12px",
                  background: "rgba(255, 255, 255, 0.7)",
                  borderRadius: "12px",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
                  backdropFilter: "blur(10px)",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateX(5px)";
                  e.currentTarget.style.boxShadow =
                    "0 6px 20px rgba(102, 126, 234, 0.2)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateX(0)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 15px rgba(0,0,0,0.08)";
                }}
              >
                <div
                  style={{
                    minWidth: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #667eea, #764ba2)",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    fontSize: "0.9rem",
                    flexShrink: 0,
                  }}
                >
                  {i + 1}
                </div>
                <p
                  style={{
                    margin: 0,
                    fontSize: "1rem",
                    lineHeight: "1.6",
                    color: "#333",
                  }}
                >
                  {s}
                </p>
              </div>
            ))}
          </div>
        )}

        {!aiLoading && !aiError && aiSuggestions.length === 0 && (
          <p
            style={{
              color: "#888",
              textAlign: "center",
              padding: "2rem",
              position: "relative",
            }}
          >
            No hay sugerencias disponibles en este momento.
          </p>
        )}
      </div>

      <div
        className="card"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background decoration */}
        <div
          style={{
            position: "absolute",
            top: "-20%",
            right: "-10%",
            width: "300px",
            height: "300px",
            background: "rgba(255,255,255,0.1)",
            borderRadius: "50%",
            filter: "blur(60px)",
          }}
        ></div>

        <h3
          className="card-title"
          style={{ position: "relative", marginBottom: "2rem" }}
        >
          📊 Resumen del Período
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "2rem",
            position: "relative",
          }}
        >
          {/* Total de Ingresos */}
          <div>
            <h4
              style={{
                margin: "0 0 0.8rem 0",
                opacity: 0.9,
                fontSize: "0.95rem",
              }}
            >
              Total Ingresos
            </h4>
            <div
              style={{
                fontSize: "1.8rem",
                fontWeight: "bold",
                marginBottom: "0.5rem",
              }}
            >
              ${totalIncomes.toLocaleString()}
            </div>
            <div style={{ fontSize: "0.85rem", opacity: 0.85 }}>
              {filteredIncomes.length}{" "}
              {filteredIncomes.length === 1 ? "ingreso" : "ingresos"}{" "}
              registrados
            </div>
          </div>

          {/* Total de Gastos */}
          <div>
            <h4
              style={{
                margin: "0 0 0.8rem 0",
                opacity: 0.9,
                fontSize: "0.95rem",
              }}
            >
              Total Gastos
            </h4>
            <div
              style={{
                fontSize: "1.8rem",
                fontWeight: "bold",
                marginBottom: "0.5rem",
              }}
            >
              ${totalExpenses.toLocaleString()}
            </div>
            <div style={{ fontSize: "0.85rem", opacity: 0.85 }}>
              {filteredExpenses.length}{" "}
              {filteredExpenses.length === 1 ? "gasto" : "gastos"} registrados
            </div>
          </div>

          {/* Categoría Más Gastada */}
          <div>
            <h4
              style={{
                margin: "0 0 0.8rem 0",
                opacity: 0.9,
                fontSize: "0.95rem",
              }}
            >
              Categoría Mayor Gasto
            </h4>
            <div
              style={{
                fontSize: "1.8rem",
                fontWeight: "bold",
                marginBottom: "0.5rem",
              }}
            >
              {(() => {
                if (categories.length === 0) return "N/A";
                const topCategory = categories[0];
                return topCategory;
              })()}
            </div>
            <div style={{ fontSize: "0.85rem", opacity: 0.85 }}>
              {(() => {
                if (categories.length === 0) return "Sin gastos";
                const topAmount = expensesByCategory[categories[0]];
                return `$${topAmount.toLocaleString()}`;
              })()}
            </div>
          </div>

          {/* Metas de Ahorro */}
          <div>
            <h4
              style={{
                margin: "0 0 0.8rem 0",
                opacity: 0.9,
                fontSize: "0.95rem",
              }}
            >
              Metas de Ahorro
            </h4>
            <div
              style={{
                fontSize: "1.8rem",
                fontWeight: "bold",
                marginBottom: "0.5rem",
              }}
            >
              {(() => {
                if (savingsGoals.length === 0) return "Sin metas";
                const completedGoals = savingsGoals.filter((g) => g.completed);
                return `${completedGoals.length}/${savingsGoals.length}`;
              })()}
            </div>
            <div style={{ fontSize: "0.85rem", opacity: 0.85 }}>
              {(() => {
                if (savingsGoals.length === 0) return "Crea tu primera meta";
                const completedGoals = savingsGoals.filter((g) => g.completed);
                return completedGoals.length === savingsGoals.length
                  ? "¡Todas completadas! 🎉"
                  : "metas completadas";
              })()}
            </div>
          </div>
        </div>
      </div>

      {/* === SECCIÓN: Gráfica comparativa de últimos 6 meses (MOVIDA AL FINAL) === */}
      <div className="card" style={{ marginBottom: 24 }}>
        <h3
          className="card-title"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 8,
          }}
        >
          <TrendingUp size={20} />
          Comparativa de Últimos 6 Meses
        </h3>
        <p style={{ color: "#888", marginBottom: 16, fontSize: "0.85rem" }}>
          Evolución mensual de ingresos vs gastos
        </p>

        <VictoryChart
          theme={VictoryTheme.material}
          height={350}
          width={800}
          padding={{ top: 50, bottom: 70, left: 80, right: 60 }}
          domainPadding={{ x: 30 }}
        >
          <VictoryAxis
            style={{
              tickLabels: {
                fontSize: 13,
                padding: 8,
                angle: 0,
                fontWeight: 600,
              },
              axis: { stroke: "#e0e0e0", strokeWidth: 1 },
            }}
          />
          <VictoryAxis
            dependentAxis
            style={{
              tickLabels: { fontSize: 13, padding: 8 },
              axis: { stroke: "#e0e0e0", strokeWidth: 1 },
              grid: { stroke: "#f0f0f0", strokeDasharray: "3, 3" },
            }}
            tickFormat={(value) => `$${(value / 1000).toFixed(0)}k`}
          />

          <VictoryLegend
            x={280}
            y={10}
            orientation="horizontal"
            gutter={30}
            style={{
              labels: { fontSize: 14, fontWeight: 600 },
              border: { stroke: "#e0e0e0" },
            }}
            data={[
              {
                name: "Ingresos",
                symbol: { fill: "#4caf50", type: "circle", size: 6 },
              },
              {
                name: "Gastos",
                symbol: { fill: "#f44336", type: "circle", size: 6 },
              },
            ]}
            borderPadding={{ top: 5, bottom: 5, left: 10, right: 10 }}
          />

          <VictoryGroup>
            <VictoryLine
              data={comparativeData}
              x="month"
              y="ingresos"
              style={{
                data: {
                  stroke: "#4caf50",
                  strokeWidth: 3.5,
                  strokeLinecap: "round",
                },
              }}
              labels={({ datum }) => `$${datum.ingresos.toLocaleString()}`}
              labelComponent={
                <VictoryTooltip
                  style={{ fontSize: 12, fontWeight: 600 }}
                  flyoutStyle={{
                    fill: "white",
                    stroke: "#4caf50",
                    strokeWidth: 2,
                  }}
                  flyoutPadding={8}
                />
              }
            />
            <VictoryLine
              data={comparativeData}
              x="month"
              y="gastos"
              style={{
                data: {
                  stroke: "#f44336",
                  strokeWidth: 3.5,
                  strokeLinecap: "round",
                },
              }}
              labels={({ datum }) => `$${datum.gastos.toLocaleString()}`}
              labelComponent={
                <VictoryTooltip
                  style={{ fontSize: 12, fontWeight: 600 }}
                  flyoutStyle={{
                    fill: "white",
                    stroke: "#f44336",
                    strokeWidth: 2,
                  }}
                  flyoutPadding={8}
                />
              }
            />
          </VictoryGroup>
        </VictoryChart>
      </div>
    </div>
  );
};

export default Statistics;
