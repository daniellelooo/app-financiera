import React from "react";
import {
  PiggyBank,
  TrendingUp,
  Target,
  BookOpen,
  Calendar,
  Bell,
  DollarSign,
  Award,
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
  const completedLessons = 3; // Número simulado de lecciones completadas

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

  return (
    <div>
      {/* Summary Cards */}
      <div
        style={{
          display: "flex",
          gap: "1.5rem",
          flexWrap: "wrap",
          marginBottom: "2rem",
        }}
      >
        <div className="card" style={{ flex: 1, minWidth: 220 }}>
          <h3
            className="card-title"
            style={{ display: "flex", alignItems: "center", gap: 8 }}
          >
            <DollarSign size={24} style={{ color: "#1976d2" }} /> Balance
          </h3>
          <div
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: userBalance < 0 ? "#d32f2f" : "#1976d2",
            }}
          >
            ${userBalance.toLocaleString()}
          </div>
        </div>
        <div className="card" style={{ flex: 1, minWidth: 220 }}>
          <h3
            className="card-title"
            style={{ display: "flex", alignItems: "center", gap: 8 }}
          >
            <TrendingUp size={24} style={{ color: "#f44336" }} /> Gastos
          </h3>
          <div style={{ fontSize: 28, fontWeight: 700, color: "#f44336" }}>
            ${totalExpenses.toLocaleString()}
          </div>
        </div>
        <div className="card" style={{ flex: 1, minWidth: 220 }}>
          <h3
            className="card-title"
            style={{ display: "flex", alignItems: "center", gap: 8 }}
          >
            <PiggyBank size={24} style={{ color: "#43a047" }} /> Ahorros
          </h3>
          <div style={{ fontSize: 28, fontWeight: 700, color: "#43a047" }}>
            ${totalSaved?.toLocaleString?.() || 0}
          </div>
        </div>
        <div className="card" style={{ flex: 1, minWidth: 220 }}>
          <h3
            className="card-title"
            style={{ display: "flex", alignItems: "center", gap: 8 }}
          >
            <Award size={24} style={{ color: "#ff9800" }} /> Logros
          </h3>
          <div style={{ fontSize: 28, fontWeight: 700, color: "#ff9800" }}>
            {savingsGoals.filter((g) => g.achieved).length}
          </div>
        </div>
        <div className="card" style={{ flex: 1, minWidth: 220 }}>
          <h3
            className="card-title"
            style={{ display: "flex", alignItems: "center", gap: 8 }}
          >
            <Target size={24} style={{ color: "#1976d2" }} /> Metas activas
          </h3>
          <div style={{ fontSize: 28, fontWeight: 700, color: "#1976d2" }}>
            {savingsGoals.filter((g) => !g.achieved).length}
          </div>
        </div>
        <div className="card" style={{ flex: 1, minWidth: 220 }}>
          <h3
            className="card-title"
            style={{ display: "flex", alignItems: "center", gap: 8 }}
          >
            <BookOpen size={24} style={{ color: "#43a047" }} /> Lecciones
            completadas
          </h3>
          <div style={{ fontSize: 28, fontWeight: 700, color: "#43a047" }}>
            {completedLessons}
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="dashboard">
        <div className="card">
          <h3 className="card-title">
            <Calendar
              size={24}
              style={{ marginRight: "10px", verticalAlign: "middle" }}
            />
            Actividad Financiera Reciente
          </h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {allMovements
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .slice(0, 5)
              .map((item, idx) => (
                <li
                  key={idx}
                  style={{
                    padding: "10px 0",
                    borderBottom: "1px solid #eee",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  {item.type === "expense" && (
                    <TrendingUp size={18} style={{ color: "#f44336" }} />
                  )}
                  {item.type === "income" && (
                    <DollarSign size={18} style={{ color: "#1976d2" }} />
                  )}
                  {item.type === "saving" && (
                    <PiggyBank size={18} style={{ color: "#43a047" }} />
                  )}
                  <span>{item.text}</span>
                  <span
                    style={{
                      color: "#888",
                      fontSize: "0.85em",
                      marginLeft: "auto",
                    }}
                  >
                    ({new Date(item.date).toLocaleDateString()})
                  </span>
                </li>
              ))}
            {allMovements.length === 0 && (
              <li style={{ padding: "10px 0" }}>No hay actividad reciente.</li>
            )}
          </ul>
        </div>
      </div>

      {/* Alert if balance is negative */}
      {userBalance < 0 && (
        <div
          className="card"
          style={{
            background: "#ffebee",
            border: "2px solid #f44336",
            marginTop: 24,
          }}
        >
          <h3 style={{ color: "#d32f2f", margin: "0 0 1rem 0" }}>
            ⚠️ Alerta Financiera
          </h3>
          <p style={{ color: "#d32f2f", margin: 0 }}>
            Tu balance está en números rojos. ¡No te preocupes! Esto es normal
            al comenzar.
            <br />
            <strong>Tip:</strong> Revisa la sección de educación para aprender
            sobre presupuestos y control de gastos.
          </p>
        </div>
      )}

      {/* Info if no expenses */}
      {totalExpenses === 0 && (
        <div
          className="card"
          style={{
            background: "#e3f2fd",
            border: "2px solid #2196f3",
            marginTop: 24,
          }}
        >
          <h3 style={{ color: "#1976d2", margin: "0 0 1rem 0" }}>
            🚀 ¡Comienza tu viaje financiero!
          </h3>
          <p style={{ color: "#1976d2", margin: 0 }}>
            Aún no has registrado gastos. Te recomendamos empezar registrando
            tus gastos diarios para conocer mejor tus hábitos financieros.
            <br />
            <strong>Primer paso:</strong> Ve a "Presupuesto" y registra tus
            ingresos y gastos del día.
          </p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
