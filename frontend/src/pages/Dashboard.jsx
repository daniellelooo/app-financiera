import React from "react";
import {
  PiggyBank,
  TrendingUp,
  Target,
  BookOpen,
  Calendar,
  DollarSign,
  Award,
  ArrowUp,
  ArrowDown,
  Activity,
} from "lucide-react";

const Dashboard = ({
  userBalance,
  userExpenses,
  userIncomes = [],
  totalSaved,
  savingsGoals,
}) => {
  // Debug: log savingsGoals to verify movements structure
  console.log("savingsGoals", savingsGoals);
  const totalExpenses = userExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  // Obtener lecciones completadas del localStorage (sincronizado con Education.jsx)
  const [completedLessons, setCompletedLessons] = React.useState(0);

  React.useEffect(() => {
    const fetchCompletedLessons = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/education/stats`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (res.ok) {
          const data = await res.json();
          setCompletedLessons(data.completedLessons || 0);
        }
      } catch (err) {
        console.error("Error obteniendo lecciones completadas:", err);
        setCompletedLessons(0);
      }
    };

    fetchCompletedLessons();
  }, []);

  // Movimientos recientes (gastos, ingresos, ahorros)
  const savingsMovements = savingsGoals.flatMap((goal) =>
    (goal.movements || []).map((m) => ({
      type: "saving",
      date: m.date,
      text: ` Ahorro de $${m.amount.toLocaleString()} en meta "${goal.name}"`,
    }))
  );
  const allMovements = [
    ...userExpenses.map((e) => ({
      type: "expense",
      date: e.date,
      text: ` Gasto de $${e.amount.toLocaleString()} en ${e.category}`,
    })),
    ...userIncomes.map((i) => ({
      type: "income",
      date: i.date,
      text: `Ingreso de $${i.amount.toLocaleString()} (${
        i.description || "Ingreso"
      })`,
    })),
    ...savingsMovements,
  ];

  // Calcular totales de ingresos
  const totalIncome = userIncomes.reduce(
    (sum, income) => sum + income.amount,
    0
  );

  // Calcular tasa de ahorro
  const savingsRate =
    totalIncome > 0 ? ((totalSaved / totalIncome) * 100).toFixed(1) : 0;

  return (
    <div>
      {/* Summary Cards con diseño mejorado */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        {/* Balance Card */}
        <div
          className="card"
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{ position: "relative", zIndex: 1 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "0.5rem",
                opacity: 0.9,
              }}
            >
              <DollarSign size={20} />
              <span style={{ fontSize: "0.9rem", fontWeight: 500 }}>
                Balance Total
              </span>
            </div>
            <div
              style={{
                fontSize: "2.2rem",
                fontWeight: 800,
                marginBottom: "0.5rem",
              }}
            >
              ${userBalance.toLocaleString()}
            </div>
            <div style={{ fontSize: "0.85rem", opacity: 0.9 }}>
              {userBalance >= 0 ? "💰 En positivo" : "⚠️ Requiere atención"}
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              bottom: -20,
              right: -20,
              opacity: 0.2,
              transform: "rotate(-15deg)",
            }}
          >
            <DollarSign size={120} />
          </div>
        </div>

        {/* Gastos Card */}
        <div
          className="card"
          style={{
            background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
            color: "white",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{ position: "relative", zIndex: 1 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "0.5rem",
                opacity: 0.9,
              }}
            >
              <TrendingUp size={20} />
              <span style={{ fontSize: "0.9rem", fontWeight: 500 }}>
                Gastos del Mes
              </span>
            </div>
            <div
              style={{
                fontSize: "2.2rem",
                fontWeight: 800,
                marginBottom: "0.5rem",
              }}
            >
              ${totalExpenses.toLocaleString()}
            </div>
            <div style={{ fontSize: "0.85rem", opacity: 0.9 }}>
              {userExpenses.length} transacciones
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              bottom: -20,
              right: -20,
              opacity: 0.2,
              transform: "rotate(-15deg)",
            }}
          >
            <TrendingUp size={120} />
          </div>
        </div>

        {/* Ahorros Card */}
        <div
          className="card"
          style={{
            background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
            color: "white",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{ position: "relative", zIndex: 1 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "0.5rem",
                opacity: 0.9,
              }}
            >
              <PiggyBank size={20} />
              <span style={{ fontSize: "0.9rem", fontWeight: 500 }}>
                Total Ahorrado
              </span>
            </div>
            <div
              style={{
                fontSize: "2.2rem",
                fontWeight: 800,
                marginBottom: "0.5rem",
              }}
            >
              ${totalSaved?.toLocaleString?.() || 0}
            </div>
            <div style={{ fontSize: "0.85rem", opacity: 0.9 }}>
              {savingsRate}% de tus ingresos
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              bottom: -20,
              right: -20,
              opacity: 0.2,
              transform: "rotate(-15deg)",
            }}
          >
            <PiggyBank size={120} />
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <div
          className="card"
          style={{ textAlign: "center", padding: "1.5rem" }}
        >
          <Award
            size={32}
            style={{ color: "#ff9800", margin: "0 auto 0.5rem" }}
          />
          <div
            style={{ fontSize: "1.8rem", fontWeight: 700, color: "#ff9800" }}
          >
            {savingsGoals.filter((g) => g.achieved).length}
          </div>
          <div style={{ fontSize: "0.9rem", color: "#666" }}>
            Metas Logradas
          </div>
        </div>

        <div
          className="card"
          style={{ textAlign: "center", padding: "1.5rem" }}
        >
          <Target
            size={32}
            style={{ color: "#667eea", margin: "0 auto 0.5rem" }}
          />
          <div
            style={{ fontSize: "1.8rem", fontWeight: 700, color: "#667eea" }}
          >
            {savingsGoals.filter((g) => !g.achieved).length}
          </div>
          <div style={{ fontSize: "0.9rem", color: "#666" }}>Metas Activas</div>
        </div>

        <div
          className="card"
          style={{ textAlign: "center", padding: "1.5rem" }}
        >
          <BookOpen
            size={32}
            style={{ color: "#4caf50", margin: "0 auto 0.5rem" }}
          />
          <div
            style={{ fontSize: "1.8rem", fontWeight: 700, color: "#4caf50" }}
          >
            {completedLessons}
          </div>
          <div style={{ fontSize: "0.9rem", color: "#666" }}>Lecciones</div>
        </div>

        <div
          className="card"
          style={{ textAlign: "center", padding: "1.5rem" }}
        >
          <Activity
            size={32}
            style={{ color: "#f44336", margin: "0 auto 0.5rem" }}
          />
          <div
            style={{ fontSize: "1.8rem", fontWeight: 700, color: "#f44336" }}
          >
            {allMovements.length}
          </div>
          <div style={{ fontSize: "0.9rem", color: "#666" }}>Movimientos</div>
        </div>
      </div>

      {/* Recent Activity Section con diseño mejorado */}
      <div className="card">
        <h3 className="card-title">
          <Calendar size={24} />
          Actividad Financiera Reciente
        </h3>
        {allMovements.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "3rem 1rem",
              color: "#999",
            }}
          >
            <Activity
              size={64}
              style={{ margin: "0 auto 1rem", opacity: 0.3 }}
            />
            <p>No hay actividad reciente.</p>
            <p style={{ fontSize: "0.9rem" }}>
              Comienza registrando tus ingresos y gastos.
            </p>
          </div>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
          >
            {allMovements
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .slice(0, 8)
              .map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: "1rem",
                    borderRadius: "12px",
                    background:
                      item.type === "expense"
                        ? "linear-gradient(135deg, #fff5f5 0%, #ffe6e6 100%)"
                        : item.type === "income"
                        ? "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)"
                        : "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    border: `2px solid ${
                      item.type === "expense"
                        ? "#fecaca"
                        : item.type === "income"
                        ? "#bfdbfe"
                        : "#bbf7d0"
                    }`,
                    transition: "all 0.2s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateX(4px)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 12px rgba(0,0,0,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateX(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background:
                        item.type === "expense"
                          ? "#fca5a5"
                          : item.type === "income"
                          ? "#93c5fd"
                          : "#86efac",
                      flexShrink: 0,
                    }}
                  >
                    {item.type === "expense" && (
                      <ArrowDown size={24} color="#991b1b" />
                    )}
                    {item.type === "income" && (
                      <ArrowUp size={24} color="#1e40af" />
                    )}
                    {item.type === "saving" && (
                      <PiggyBank size={24} color="#166534" />
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontWeight: 600,
                        color: "#2d3748",
                        marginBottom: "0.25rem",
                      }}
                    >
                      {item.text}
                    </div>
                    <div
                      style={{
                        fontSize: "0.85rem",
                        color: "#718096",
                      }}
                    >
                      {new Date(item.date).toLocaleDateString("es-ES", {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                  <div
                    style={{
                      padding: "0.4rem 0.8rem",
                      borderRadius: "8px",
                      background: "white",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      color:
                        item.type === "expense"
                          ? "#dc2626"
                          : item.type === "income"
                          ? "#2563eb"
                          : "#16a34a",
                    }}
                  >
                    {item.type === "expense" ? "-" : "+"}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Alert if balance is negative con diseño mejorado */}
      {userBalance < 0 && (
        <div
          className="card"
          style={{
            background: "linear-gradient(135deg, #fff5f5 0%, #fee2e2 100%)",
            border: "3px solid #fca5a5",
            marginTop: "1.5rem",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{ position: "relative", zIndex: 1 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                marginBottom: "1rem",
              }}
            >
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "16px",
                  background: "#fca5a5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "28px",
                }}
              >
                ⚠️
              </div>
              <div>
                <h3
                  style={{
                    color: "#991b1b",
                    margin: 0,
                    fontSize: "1.3rem",
                    fontWeight: 700,
                  }}
                >
                  Alerta Financiera
                </h3>
                <p
                  style={{
                    color: "#b91c1c",
                    margin: "0.25rem 0 0 0",
                    fontSize: "0.9rem",
                  }}
                >
                  Balance en números rojos
                </p>
              </div>
            </div>
            <p
              style={{
                color: "#7f1d1d",
                margin: "0 0 0.75rem 0",
                lineHeight: 1.6,
              }}
            >
              Tu balance está en negativo. ¡No te preocupes! Esto es normal al
              comenzar.
            </p>
            <div
              style={{
                padding: "1rem",
                background: "white",
                borderRadius: "12px",
                borderLeft: "4px solid #f87171",
              }}
            >
              <strong style={{ color: "#991b1b" }}>💡 Tip:</strong>
              <span style={{ color: "#7f1d1d", marginLeft: "0.5rem" }}>
                Revisa la sección de Educación para aprender sobre presupuestos
                y control de gastos.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Info if no expenses con diseño mejorado */}
      {totalExpenses === 0 && (
        <div
          className="card"
          style={{
            background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
            border: "3px solid #93c5fd",
            marginTop: "1.5rem",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{ position: "relative", zIndex: 1 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                marginBottom: "1rem",
              }}
            >
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "16px",
                  background: "#93c5fd",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "28px",
                }}
              >
                🚀
              </div>
              <div>
                <h3
                  style={{
                    color: "#1e40af",
                    margin: 0,
                    fontSize: "1.3rem",
                    fontWeight: 700,
                  }}
                >
                  ¡Comienza tu viaje financiero!
                </h3>
                <p
                  style={{
                    color: "#2563eb",
                    margin: "0.25rem 0 0 0",
                    fontSize: "0.9rem",
                  }}
                >
                  Primeros pasos hacia la libertad financiera
                </p>
              </div>
            </div>
            <p
              style={{
                color: "#1e3a8a",
                margin: "0 0 0.75rem 0",
                lineHeight: 1.6,
              }}
            >
              Aún no has registrado gastos. Te recomendamos empezar registrando
              tus gastos diarios para conocer mejor tus hábitos financieros.
            </p>
            <div
              style={{
                padding: "1rem",
                background: "white",
                borderRadius: "12px",
                borderLeft: "4px solid #60a5fa",
              }}
            >
              <strong style={{ color: "#1e40af" }}>🎯 Primer paso:</strong>
              <span style={{ color: "#1e3a8a", marginLeft: "0.5rem" }}>
                Ve a "Presupuesto" y registra tus ingresos y gastos del día.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
