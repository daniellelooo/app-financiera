import React, { useState, useEffect } from "react";
import {
  Target,
  TrendingUp,
  TrendingDown,
  Calendar,
  Trophy,
  Plus,
  CheckCircle,
  DollarSign,
  Percent,
} from "lucide-react";

const Goals = ({
  savingsGoals,
  setSavingsGoals,
  userIncomes,
  userExpenses,
}) => {
  const [editingGoal, setEditingGoal] = useState(null);
  const [editGoalData, setEditGoalData] = useState({
    name: "",
    target: "",
    deadline: "",
    type: "saving",
  });

  const [newGoal, setNewGoal] = useState({
    name: "",
    target: "",
    deadline: "",
    type: "saving",
    isPercentage: false,
  });

  const [savingAmount, setSavingAmount] = useState("");
  const [selectedGoal, setSelectedGoal] = useState("");

  // Calcular gastos del mes actual
  const getCurrentMonthExpenses = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const currentMonth = `${year}-${month}`;

    return userExpenses
      .filter((expense) => expense.date.startsWith(currentMonth))
      .reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
  };

  // Calcular ingresos del mes actual
  const getCurrentMonthIncomes = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const currentMonth = `${year}-${month}`;

    return userIncomes
      .filter((income) => income.date.startsWith(currentMonth))
      .reduce((sum, income) => sum + parseFloat(income.amount), 0);
  };

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

  const reloadGoals = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/goals`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const goals = await res.json();
      setSavingsGoals(Array.isArray(goals) ? goals : []);
    } catch (err) {
      console.error("Error recargando metas del backend:", err);
    }
  };

  const handleCreateGoal = async (e) => {
    e.preventDefault();
    if (newGoal.name && newGoal.target && newGoal.deadline) {
      let targetValue = parseFloat(newGoal.target);

      // Si es meta de gasto con porcentaje, calcular el valor basado en ingresos
      if (newGoal.type === "expense" && newGoal.isPercentage) {
        const monthlyIncome = getCurrentMonthIncomes();
        targetValue = (monthlyIncome * targetValue) / 100;
      }

      const goalData = {
        name: newGoal.name,
        target: targetValue,
        deadline: newGoal.deadline,
        type: newGoal.type,
      };

      const token = localStorage.getItem("token");
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL || ""}/api/goals`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(goalData),
          }
        );
        const data = await response.json();
        if (response.ok) {
          setNewGoal({
            name: "",
            target: "",
            deadline: "",
            type: "saving",
            isPercentage: false,
          });
          await reloadGoals();
          await refreshChallenges();
        } else {
          alert(data.message || "Error al crear la meta");
        }
      } catch (error) {
        console.error("Error creating goal:", error);
        alert("Error de red al crear la meta");
      }
    }
  };

  const handleAddProgress = async (e) => {
    e.preventDefault();
    if (savingAmount && selectedGoal) {
      const amount = parseFloat(savingAmount);
      const goal = savingsGoals.find((g) => g.id === parseInt(selectedGoal));
      if (!goal) return;

      let newCurrent = goal.current;
      let isNewlyCompleted = false;

      if (goal.type === "saving") {
        // Meta de ahorro: sumar al progreso
        newCurrent = goal.current + amount;
        isNewlyCompleted = !goal.completed && newCurrent >= goal.target;
      } else if (goal.type === "expense") {
        // Meta de gasto: calcular gasto actual del mes
        newCurrent = getCurrentMonthExpenses();
        isNewlyCompleted = !goal.completed && newCurrent <= goal.target;
      }

      const updatedGoal = {
        ...goal,
        current: newCurrent,
        completed:
          goal.type === "saving"
            ? newCurrent >= goal.target
            : newCurrent <= goal.target,
      };

      const token = localStorage.getItem("token");
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/goals/${goal.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              name: updatedGoal.name,
              target: updatedGoal.target,
              deadline: updatedGoal.deadline,
              current: updatedGoal.current,
              completed: updatedGoal.completed,
              type: updatedGoal.type,
            }),
          }
        );
        if (res.ok) {
          await reloadGoals();
          await refreshChallenges();
        } else {
          const err = await res.text();
          alert("Error al actualizar meta: " + err);
        }
      } catch (error) {
        alert("Error de red al actualizar meta");
      }
      setSavingAmount("");
      setSelectedGoal("");
    }
  };

  const handleEditGoal = (goal) => {
    setEditingGoal(goal.id);
    setEditGoalData({
      name: goal.name,
      target: goal.target,
      deadline: goal.deadline ? goal.deadline.slice(0, 10) : "",
      type: goal.type || "saving",
    });
  };

  const handleEditGoalChange = (e) => {
    const { name, value } = e.target;
    setEditGoalData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditGoalSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/goals/${editingGoal}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editGoalData),
        }
      );
      if (res.ok) {
        setEditingGoal(null);
        await reloadGoals();
      } else {
        const err = await res.text();
        console.error("Error al editar meta:", err);
      }
    } catch (error) {
      console.error("Error al editar meta:", error);
    }
  };

  const handleDeleteGoal = async (goalId) => {
    const token = localStorage.getItem("token");
    if (!window.confirm("¿Seguro que deseas eliminar esta meta?")) return;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/goals/${goalId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        await reloadGoals();
      } else {
        const err = await res.text();
        console.error("Error al eliminar meta:", err);
      }
    } catch (error) {
      console.error("Error al eliminar meta:", error);
    }
  };

  // Actualizar automáticamente el progreso de metas de gasto
  useEffect(() => {
    const updateExpenseGoals = async () => {
      const expenseGoals = savingsGoals.filter(
        (g) => g.type === "expense" && !g.completed
      );
      const currentExpenses = getCurrentMonthExpenses();

      for (const goal of expenseGoals) {
        if (goal.current !== currentExpenses) {
          const token = localStorage.getItem("token");
          try {
            await fetch(
              `${import.meta.env.VITE_API_URL}/api/goals/${goal.id}`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  name: goal.name,
                  target: goal.target,
                  deadline: goal.deadline,
                  current: currentExpenses,
                  completed: currentExpenses <= goal.target,
                  type: goal.type,
                }),
              }
            );
          } catch (error) {
            console.error("Error actualizando meta de gasto:", error);
          }
        }
      }

      if (expenseGoals.length > 0) {
        await reloadGoals();
      }
    };

    if (userExpenses.length > 0) {
      updateExpenseGoals();
    }
  }, [userExpenses]);

  const savingGoals = savingsGoals.filter(
    (g) => g.type === "saving" || !g.type
  );
  const expenseGoals = savingsGoals.filter((g) => g.type === "expense");

  const totalSaved = savingGoals.reduce((sum, goal) => sum + goal.current, 0);
  const completedGoals = savingsGoals.filter((goal) => goal.completed).length;

  return (
    <div>
      <div className="card">
        <h1 className="card-title">Mis Metas Financieras</h1>
        <div className="dashboard">
          <div className="card stats-card">
            <TrendingUp size={48} style={{ marginBottom: "1rem" }} />
            <h2 className="stats-number">${totalSaved.toLocaleString()}</h2>
            <p className="stats-label">Total Ahorrado</p>
          </div>

          <div
            className="card stats-card"
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            }}
          >
            <Target
              size={48}
              style={{ marginBottom: "1rem", color: "white" }}
            />
            <h2 className="stats-number" style={{ color: "white" }}>
              {savingsGoals.length}
            </h2>
            <p className="stats-label" style={{ color: "white" }}>
              Metas Activas
            </p>
          </div>

          <div
            className="card stats-card"
            style={{
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
            }}
          >
            <Trophy
              size={48}
              style={{ marginBottom: "1rem", color: "white" }}
            />
            <h2 className="stats-number" style={{ color: "white" }}>
              {completedGoals}
            </h2>
            <p className="stats-label" style={{ color: "white" }}>
              Metas Completadas
            </p>
          </div>
        </div>
      </div>

      <div className="dashboard">
        <div className="card">
          <h3 className="card-title">
            <Plus
              size={24}
              style={{ marginRight: "10px", verticalAlign: "middle" }}
            />
            Crear Nueva Meta
          </h3>
          <form onSubmit={handleCreateGoal}>
            <div className="form-group">
              <label className="form-label">Tipo de Meta</label>
              <select
                className="form-input"
                value={newGoal.type}
                onChange={(e) =>
                  setNewGoal({
                    ...newGoal,
                    type: e.target.value,
                    isPercentage: false,
                  })
                }
                required
              >
                <option value="saving">Meta de Ahorro</option>
                <option value="expense">Meta de Gasto</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Nombre de la Meta</label>
              <input
                type="text"
                className="form-input"
                value={newGoal.name}
                onChange={(e) =>
                  setNewGoal({ ...newGoal, name: e.target.value })
                }
                placeholder={
                  newGoal.type === "saving"
                    ? "Ej: Nueva bicicleta"
                    : "Ej: Reducir gastos de ocio"
                }
                required
              />
            </div>

            {newGoal.type === "expense" && (
              <div className="form-group">
                <label className="form-label">
                  <input
                    type="checkbox"
                    checked={newGoal.isPercentage}
                    onChange={(e) =>
                      setNewGoal({ ...newGoal, isPercentage: e.target.checked })
                    }
                    style={{ marginRight: "8px" }}
                  />
                  Usar porcentaje de ingresos
                </label>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">
                {newGoal.type === "saving"
                  ? "Monto Objetivo"
                  : newGoal.isPercentage
                  ? "Porcentaje Máximo"
                  : "Límite de Gasto"}
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type="number"
                  className="form-input"
                  value={newGoal.target}
                  onChange={(e) =>
                    setNewGoal({ ...newGoal, target: e.target.value })
                  }
                  placeholder={
                    newGoal.type === "saving"
                      ? "Ej: 500000"
                      : newGoal.isPercentage
                      ? "Ej: 20"
                      : "Ej: 300000"
                  }
                  step="0.01"
                  required
                />
                {newGoal.type === "expense" && newGoal.isPercentage && (
                  <span
                    style={{
                      position: "absolute",
                      right: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: "1.2rem",
                      color: "#666",
                    }}
                  >
                    %
                  </span>
                )}
              </div>
              {newGoal.type === "expense" &&
                newGoal.isPercentage &&
                newGoal.target && (
                  <small
                    style={{
                      color: "#666",
                      marginTop: "4px",
                      display: "block",
                    }}
                  >
                    Equivale a: $
                    {(
                      (getCurrentMonthIncomes() * parseFloat(newGoal.target)) /
                      100
                    ).toLocaleString()}
                  </small>
                )}
            </div>

            <div className="form-group">
              <label className="form-label">
                {newGoal.type === "saving" ? "Fecha Límite" : "Fin del Mes"}
              </label>
              <input
                type="date"
                className="form-input"
                value={newGoal.deadline}
                onChange={(e) =>
                  setNewGoal({ ...newGoal, deadline: e.target.value })
                }
                required
              />
            </div>

            <button type="submit" className="btn btn-primary">
              {newGoal.type === "saving"
                ? "Crear Meta de Ahorro"
                : "Crear Meta de Gasto"}
            </button>
          </form>
        </div>

        {savingGoals.filter((g) => !g.completed).length > 0 && (
          <div className="card">
            <h3 className="card-title">
              <TrendingUp
                size={24}
                style={{ marginRight: "10px", verticalAlign: "middle" }}
              />
              Agregar a una Meta de Ahorro
            </h3>
            <form onSubmit={handleAddProgress}>
              <div className="form-group">
                <label className="form-label">Seleccionar Meta</label>
                <select
                  className="form-input"
                  value={selectedGoal}
                  onChange={(e) => setSelectedGoal(e.target.value)}
                  required
                >
                  <option value="">Selecciona una meta...</option>
                  {savingGoals
                    .filter((goal) => !goal.completed)
                    .map((goal) => (
                      <option key={goal.id} value={goal.id}>
                        {goal.name} (${goal.current.toLocaleString()} / $
                        {goal.target.toLocaleString()})
                      </option>
                    ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Monto a Ahorrar</label>
                <input
                  type="number"
                  className="form-input"
                  value={savingAmount}
                  onChange={(e) => setSavingAmount(e.target.value)}
                  placeholder="Ej: 25000"
                  step="0.01"
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary">
                Agregar Ahorro
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Metas de Ahorro */}
      {savingGoals.length > 0 && (
        <div className="card">
          <h3 className="card-title">
            <TrendingUp
              size={24}
              style={{ marginRight: "10px", verticalAlign: "middle" }}
            />
            Metas de Ahorro
          </h3>

          {savingGoals.map((goal) => {
            const progress = (goal.current / goal.target) * 100;
            const daysLeft = Math.ceil(
              (new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24)
            );

            return (
              <div key={goal.id} className="card" style={{ margin: "1rem 0" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "1rem",
                  }}
                >
                  {editingGoal === goal.id ? (
                    <form
                      onSubmit={handleEditGoalSubmit}
                      style={{
                        display: "inline-flex",
                        gap: "8px",
                        alignItems: "center",
                        flexWrap: "wrap",
                      }}
                    >
                      <input
                        type="text"
                        name="name"
                        value={editGoalData.name}
                        onChange={handleEditGoalChange}
                        required
                        style={{ width: "120px" }}
                      />
                      <input
                        type="number"
                        name="target"
                        value={editGoalData.target}
                        onChange={handleEditGoalChange}
                        required
                        style={{ width: "80px" }}
                      />
                      <input
                        type="date"
                        name="deadline"
                        value={editGoalData.deadline}
                        onChange={handleEditGoalChange}
                        required
                      />
                      <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ fontSize: "0.8rem", padding: "5px 10px" }}
                      >
                        Guardar
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        style={{ fontSize: "0.8rem", padding: "5px 10px" }}
                        onClick={() => setEditingGoal(null)}
                      >
                        Cancelar
                      </button>
                    </form>
                  ) : (
                    <>
                      <h4
                        style={{
                          margin: 0,
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <TrendingUp size={20} color="#4caf50" />
                        {goal.name}
                      </h4>
                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          alignItems: "center",
                        }}
                      >
                        {goal.completed && (
                          <CheckCircle size={24} color="#4caf50" />
                        )}
                        <button
                          onClick={() => handleEditGoal(goal)}
                          style={{
                            padding: "5px 10px",
                            fontSize: "0.8rem",
                            background: "#1976d2",
                            color: "#fff",
                            border: "none",
                            borderRadius: 4,
                            cursor: "pointer",
                          }}
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeleteGoal(goal.id)}
                          style={{
                            padding: "5px 10px",
                            fontSize: "0.8rem",
                            background: "#e74c3c",
                            color: "#fff",
                            border: "none",
                            borderRadius: 4,
                            cursor: "pointer",
                          }}
                        >
                          Eliminar
                        </button>
                      </div>
                    </>
                  )}
                </div>

                <div style={{ marginBottom: "1rem" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <span>${goal.current.toLocaleString()}</span>
                    <span>${goal.target.toLocaleString()}</span>
                  </div>

                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${Math.min(progress, 100)}%`,
                        background: goal.completed
                          ? "linear-gradient(90deg, #4caf50 0%, #66bb6a 100%)"
                          : "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
                      }}
                    >
                      <span
                        style={{
                          color: "white",
                          fontSize: "0.85rem",
                          fontWeight: "bold",
                        }}
                      >
                        {progress.toFixed(0)}%
                      </span>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: "0.5rem",
                      fontSize: "0.9rem",
                      color: "#666",
                    }}
                  >
                    <span>{progress.toFixed(1)}% completado</span>
                    <span>
                      <Calendar
                        size={16}
                        style={{
                          marginRight: "5px",
                          verticalAlign: "middle",
                        }}
                      />
                      {daysLeft > 0
                        ? `${daysLeft} días restantes`
                        : goal.completed
                        ? "Completada"
                        : "Tiempo vencido"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Metas de Gasto */}
      {expenseGoals.length > 0 && (
        <div className="card">
          <h3 className="card-title">
            <TrendingDown
              size={24}
              style={{ marginRight: "10px", verticalAlign: "middle" }}
            />
            Metas de Gasto (Mes Actual)
          </h3>
          <p
            style={{ fontSize: "0.9rem", color: "#666", marginBottom: "1rem" }}
          >
            Las metas de gasto se actualizan automáticamente según tus gastos
            del mes
          </p>

          {expenseGoals.map((goal) => {
            const progress = (goal.current / goal.target) * 100;
            const remaining = goal.target - goal.current;
            const daysLeft = Math.ceil(
              (new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24)
            );

            return (
              <div
                key={goal.id}
                className="card"
                style={{
                  margin: "1rem 0",
                  borderLeft:
                    goal.current > goal.target
                      ? "4px solid #e74c3c"
                      : "4px solid #4caf50",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "1rem",
                  }}
                >
                  {editingGoal === goal.id ? (
                    <form
                      onSubmit={handleEditGoalSubmit}
                      style={{
                        display: "inline-flex",
                        gap: "8px",
                        alignItems: "center",
                        flexWrap: "wrap",
                      }}
                    >
                      <input
                        type="text"
                        name="name"
                        value={editGoalData.name}
                        onChange={handleEditGoalChange}
                        required
                        style={{ width: "120px" }}
                      />
                      <input
                        type="number"
                        name="target"
                        value={editGoalData.target}
                        onChange={handleEditGoalChange}
                        required
                        style={{ width: "80px" }}
                      />
                      <input
                        type="date"
                        name="deadline"
                        value={editGoalData.deadline}
                        onChange={handleEditGoalChange}
                        required
                      />
                      <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ fontSize: "0.8rem", padding: "5px 10px" }}
                      >
                        Guardar
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        style={{ fontSize: "0.8rem", padding: "5px 10px" }}
                        onClick={() => setEditingGoal(null)}
                      >
                        Cancelar
                      </button>
                    </form>
                  ) : (
                    <>
                      <h4
                        style={{
                          margin: 0,
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <TrendingDown
                          size={20}
                          color={
                            goal.current > goal.target ? "#e74c3c" : "#4caf50"
                          }
                        />
                        {goal.name}
                      </h4>
                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          alignItems: "center",
                        }}
                      >
                        {goal.completed && (
                          <CheckCircle size={24} color="#4caf50" />
                        )}
                        <button
                          onClick={() => handleEditGoal(goal)}
                          style={{
                            padding: "5px 10px",
                            fontSize: "0.8rem",
                            background: "#1976d2",
                            color: "#fff",
                            border: "none",
                            borderRadius: 4,
                            cursor: "pointer",
                          }}
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeleteGoal(goal.id)}
                          style={{
                            padding: "5px 10px",
                            fontSize: "0.8rem",
                            background: "#e74c3c",
                            color: "#fff",
                            border: "none",
                            borderRadius: 4,
                            cursor: "pointer",
                          }}
                        >
                          Eliminar
                        </button>
                      </div>
                    </>
                  )}
                </div>

                <div style={{ marginBottom: "1rem" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "0.5rem",
                      fontWeight: "bold",
                    }}
                  >
                    <span
                      style={{
                        color:
                          goal.current > goal.target ? "#e74c3c" : "#4caf50",
                      }}
                    >
                      Gastado: ${goal.current.toLocaleString()}
                    </span>
                    <span>Límite: ${goal.target.toLocaleString()}</span>
                  </div>

                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${Math.min(progress, 100)}%`,
                        background:
                          goal.current > goal.target
                            ? "linear-gradient(90deg, #e74c3c 0%, #c0392b 100%)"
                            : progress >= 80
                            ? "linear-gradient(90deg, #f39c12 0%, #e67e22 100%)"
                            : "linear-gradient(90deg, #4caf50 0%, #66bb6a 100%)",
                      }}
                    >
                      <span
                        style={{
                          color: "white",
                          fontSize: "0.85rem",
                          fontWeight: "bold",
                        }}
                      >
                        {progress.toFixed(0)}%
                      </span>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: "0.5rem",
                      fontSize: "0.9rem",
                      color: "#666",
                    }}
                  >
                    <span
                      style={{
                        color: remaining >= 0 ? "#4caf50" : "#e74c3c",
                        fontWeight: "bold",
                      }}
                    >
                      {remaining >= 0
                        ? `Puedes gastar $${remaining.toLocaleString()} más`
                        : `Excedido por $${Math.abs(
                            remaining
                          ).toLocaleString()}`}
                    </span>
                    <span>
                      <Calendar
                        size={16}
                        style={{
                          marginRight: "5px",
                          verticalAlign: "middle",
                        }}
                      />
                      {daysLeft > 0
                        ? `${daysLeft} días restantes`
                        : "Mes finalizado"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Goals;
