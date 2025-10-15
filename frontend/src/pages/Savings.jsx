import React, { useState, useEffect } from "react";
import {
  Target,
  TrendingUp,
  Calendar,
  Trophy,
  Plus,
  CheckCircle,
} from "lucide-react";

const Savings = ({ savingsGoals, setSavingsGoals }) => {
  // Iniciar edición de meta
  const handleEditGoal = (goal) => {
    setEditingGoal(goal.id);
    setEditGoalData({
      name: goal.name,
      target: goal.target,
      deadline: goal.deadline ? goal.deadline.slice(0, 10) : "",
    });
  };

  // Cambios en el formulario de edición
  const handleEditGoalChange = (e) => {
    const { name, value } = e.target;
    setEditGoalData((prev) => ({ ...prev, [name]: value }));
  };

  // Guardar edición en backend
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

  // Eliminar meta en backend
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

  // Funciones DEPRECADAS - mantener para no romper código existente
  const updateSavingsChallenges = async () => {
    await refreshChallenges();
  };

  const updateGoalCompletedChallenge = async () => {
    await refreshChallenges();
  };

  // Estado para edición de metas
  const [editingGoal, setEditingGoal] = useState(null);
  const [editGoalData, setEditGoalData] = useState({
    name: "",
    target: "",
    deadline: "",
  });

  // El fetch inicial de metas ahora se hace en App.jsx

  const [newGoal, setNewGoal] = useState({
    name: "",
    target: "",
    deadline: "",
  });

  const [savingAmount, setSavingAmount] = useState("");
  const [selectedGoal, setSelectedGoal] = useState("");
  // Función para recargar metas del backend
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
      const goalData = {
        name: newGoal.name,
        target: parseFloat(newGoal.target),
        deadline: newGoal.deadline,
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
        console.log("Goal creation response:", data);
        if (response.ok) {
          setNewGoal({ name: "", target: "", deadline: "" });
          await reloadGoals();
        } else {
          alert(data.message || "Error al crear la meta");
        }
      } catch (error) {
        console.error("Error creating goal:", error);
        alert("Error de red al crear la meta");
      }
    }
  };

  const handleAddSaving = async (e) => {
    e.preventDefault();
    if (savingAmount && selectedGoal) {
      const amount = parseFloat(savingAmount);
      const goal = savingsGoals.find((g) => g.id === parseInt(selectedGoal));
      if (!goal) return;
      const newCurrent = goal.current + amount;
      const isNewlyCompleted = !goal.completed && newCurrent >= goal.target;
      const updatedGoal = {
        ...goal,
        current: newCurrent,
        completed: newCurrent >= goal.target,
      };
      // Actualizar en backend
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
            }),
          }
        );
        if (res.ok) {
          // Recargar metas desde backend para mantener sincronizado
          await reloadGoals();

          // Actualizar desafíos de gamificación
          await updateSavingsChallenges(amount);

          // Si se completó una meta, actualizar desafío de meta alcanzada
          if (isNewlyCompleted) {
            await updateGoalCompletedChallenge();
          }
        } else {
          const err = await res.text();
          alert("Error al actualizar ahorro: " + err);
        }
      } catch (error) {
        alert("Error de red al actualizar ahorro");
      }
      setSavingAmount("");
      setSelectedGoal("");
    }
  };

  const totalSaved = savingsGoals.reduce((sum, goal) => sum + goal.current, 0);
  const completedGoals = savingsGoals.filter((goal) => goal.completed).length;

  return (
    <div>
      <div className="card">
        <h1 className="card-title">Mis Ahorros y Metas</h1>
        <div className="dashboard">
          <div className="card stats-card">
            <TrendingUp size={48} style={{ marginBottom: "1rem" }} />
            <h2 className="stats-number">${totalSaved.toLocaleString()}</h2>
            <p className="stats-label">Total Ahorrado</p>
          </div>

          <div
            className="card stats-card"
            style={{
              background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
            }}
          >
            <Target size={48} style={{ marginBottom: "1rem" }} />
            <h2 className="stats-number">{savingsGoals.length}</h2>
            <p className="stats-label">Metas Activas</p>
          </div>

          <div
            className="card stats-card"
            style={{
              background: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
            }}
          >
            <Trophy size={48} style={{ marginBottom: "1rem" }} />
            <h2 className="stats-number">{completedGoals}</h2>
            <p className="stats-label">Metas Completadas</p>
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
              <label className="form-label">Nombre de la Meta</label>
              <input
                type="text"
                className="form-input"
                value={newGoal.name}
                onChange={(e) =>
                  setNewGoal({ ...newGoal, name: e.target.value })
                }
                placeholder="Ej: Nueva bicicleta"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Monto Objetivo</label>
              <input
                type="number"
                className="form-input"
                value={newGoal.target}
                onChange={(e) =>
                  setNewGoal({ ...newGoal, target: e.target.value })
                }
                placeholder="Ej: 500000"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Fecha Límite</label>
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
              Crear Meta de Ahorro
            </button>
          </form>
        </div>

        <div className="card">
          <h3 className="card-title">
            <TrendingUp
              size={24}
              style={{ marginRight: "10px", verticalAlign: "middle" }}
            />
            Agregar a una Meta
          </h3>
          <form onSubmit={handleAddSaving}>
            <div className="form-group">
              <label className="form-label">Seleccionar Meta</label>
              <select
                className="form-input"
                value={selectedGoal}
                onChange={(e) => setSelectedGoal(e.target.value)}
                required
              >
                <option value="">Selecciona una meta...</option>
                {savingsGoals
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
      </div>

      <div className="card">
        <h3 className="card-title">
          <Target
            size={24}
            style={{ marginRight: "10px", verticalAlign: "middle" }}
          />
          Mis Metas de Ahorro
        </h3>

        {savingsGoals.length === 0 ? (
          <p style={{ textAlign: "center", color: "#666", padding: "2rem" }}>
            No tienes metas de ahorro aún. ¡Crea tu primera meta!
          </p>
        ) : (
          <div>
            {savingsGoals.map((goal) => {
              const progress = (goal.current / goal.target) * 100;
              const daysLeft = Math.ceil(
                (new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24)
              );

              return (
                <div
                  key={goal.id}
                  className="card"
                  style={{ margin: "1rem 0" }}
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
                          style={{ fontSize: "0.8rem" }}
                        >
                          Guardar
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          style={{ fontSize: "0.8rem" }}
                          onClick={() => setEditingGoal(null)}
                        >
                          Cancelar
                        </button>
                      </form>
                    ) : (
                      <>
                        <h4 style={{ margin: 0 }}>{goal.name}</h4>
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
                            marginLeft: "10px",
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
                            marginLeft: "5px",
                          }}
                        >
                          Eliminar
                        </button>
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

                    {/* Progress bar mejorada */}
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
                        {progress >= 10 && (
                          <span
                            style={{
                              position: "absolute",
                              right: "8px",
                              top: "50%",
                              transform: "translateY(-50%)",
                              color: "white",
                              fontSize: "0.75rem",
                              fontWeight: "bold",
                            }}
                          >
                            {progress.toFixed(0)}%
                          </span>
                        )}
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
      </div>
    </div>
  );
};

export default Savings;
