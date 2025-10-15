import React, { useState, useEffect } from "react";
import {
  PlusCircle,
  MinusCircle,
  DollarSign,
  Calendar,
  Tag,
  Trash2,
  ShoppingCart,
  Car,
  Gamepad2,
  GraduationCap,
  Shirt,
  Heart,
  Laptop,
  MoreHorizontal,
  TrendingUp,
  Wallet,
} from "lucide-react";

const Budget = ({
  userBalance,
  setUserBalance,
  userExpenses,
  setUserExpenses,
  userIncomes,
  setUserIncomes,
}) => {
  // Estado para edición de gastos (debe ir aquí, no fuera)
  const [editingExpense, setEditingExpense] = useState(null);
  const [editExpenseData, setEditExpenseData] = useState({
    description: "",
    amount: "",
    category: "",
  });

  const [income, setIncome] = useState("");
  const [expense, setExpense] = useState("");
  const [expenseCategory, setExpenseCategory] = useState("Alimentación");
  const [expenseDescription, setExpenseDescription] = useState("");

  // Cargar incomes y expenses del backend al montar
  // useEffect eliminado: la carga de datos y balance ahora se hace en App.jsx

  const categories = [
    { name: "Alimentación", icon: ShoppingCart, color: "#ff6b6b" },
    { name: "Transporte", icon: Car, color: "#4ecdc4" },
    { name: "Entretenimiento", icon: Gamepad2, color: "#95e1d3" },
    { name: "Educación", icon: GraduationCap, color: "#667eea" },
    { name: "Ropa", icon: Shirt, color: "#f38181" },
    { name: "Salud", icon: Heart, color: "#aa96da" },
    { name: "Tecnología", icon: Laptop, color: "#5f27cd" },
    { name: "Otros", icon: MoreHorizontal, color: "#a8dadc" },
  ];

  // Helper para obtener la categoría
  const getCategoryData = (categoryName) => {
    return (
      categories.find((c) => c.name === categoryName) ||
      categories[categories.length - 1]
    );
  };

  // Función para recargar incomes y expenses del backend
  const reloadData = async () => {
    const token = localStorage.getItem("token");
    try {
      const resIncomes = await fetch(
        `${import.meta.env.VITE_API_URL}/api/incomes`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const incomes = await resIncomes.json();
      const resExpenses = await fetch(
        `${import.meta.env.VITE_API_URL}/api/expenses`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const expenses = await resExpenses.json();
      const totalIncomes = Array.isArray(incomes)
        ? incomes.reduce((sum, i) => sum + (i.amount || 0), 0)
        : 0;
      const totalExpenses = Array.isArray(expenses)
        ? expenses.reduce((sum, e) => sum + (e.amount || 0), 0)
        : 0;
      setUserBalance(totalIncomes - totalExpenses);
      setUserExpenses(Array.isArray(expenses) ? expenses : []);
    } catch (err) {
      console.error("Error recargando datos del backend:", err);
    }
  };

  const handleAddIncome = async (e) => {
    e.preventDefault();
    if (income && parseFloat(income) > 0) {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/incomes`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            amount: parseFloat(income),
            description: "Ingreso manual",
            date: new Date().toISOString().split("T")[0],
          }),
        });
        const data = await res.json();
        console.log("Respuesta ingreso:", data);
        if (res.ok) {
          setIncome("");
          await reloadData();
        } else {
          alert("Error al guardar el ingreso en el backend");
        }
      } catch {
        alert("Error de conexión con el backend");
      }
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

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (expense && parseFloat(expense) > 0 && expenseDescription) {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/expenses`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              amount: parseFloat(expense),
              category: expenseCategory,
              description: expenseDescription,
              date: new Date().toISOString().split("T")[0],
            }),
          }
        );
        const data = await res.json();
        console.log("Respuesta gasto:", data);
        if (res.ok) {
          setExpense("");
          setExpenseDescription("");
          await reloadData();

          // Refrescar todos los retos
          await refreshChallenges();
        } else {
          alert("Error al guardar el gasto en el backend");
        }
      } catch (err) {
        console.log("Error gasto:", err);
        alert("Error de conexión con el backend");
      }
    }
  };

  // Eliminar gasto en backend
  const handleDeleteExpense = async (expenseId) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/expenses/${expenseId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        console.log(`Gasto ${expenseId} eliminado`);
        await reloadData();
      } else {
        const err = await res.text();
        console.error("Error al eliminar gasto:", err);
      }
    } catch (error) {
      console.error("Error al eliminar gasto:", error);
    }
  };

  // Iniciar edición
  const handleEditExpense = (expense) => {
    setEditingExpense(expense.id);
    setEditExpenseData({
      description: expense.description,
      amount: expense.amount,
      category: expense.category,
    });
  };

  // Cambios en el formulario de edición
  const handleEditExpenseChange = (e) => {
    const { name, value } = e.target;
    setEditExpenseData((prev) => ({ ...prev, [name]: value }));
  };

  // Guardar edición en backend
  const handleEditExpenseSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/expenses/${editingExpense}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editExpenseData),
        }
      );
      if (res.ok) {
        console.log(`Gasto ${editingExpense} editado`);
        setEditingExpense(null);
        await reloadData();
      } else {
        const err = await res.text();
        console.error("Error al editar gasto:", err);
      }
    } catch (error) {
      console.error("Error al editar gasto:", error);
    }
  };

  const totalExpenses = userExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div>
      <div className="card">
        <h1 className="card-title">Mi Presupuesto</h1>
        <div className="dashboard">
          <div className="card stats-card">
            <DollarSign size={48} style={{ marginBottom: "1rem" }} />
            <h2 className="stats-number">${userBalance.toLocaleString()}</h2>
            <p className="stats-label">Balance Actual</p>
          </div>

          <div
            className="card stats-card"
            style={{
              background: "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)",
            }}
          >
            <MinusCircle size={48} style={{ marginBottom: "1rem" }} />
            <h2 className="stats-number">${totalExpenses.toLocaleString()}</h2>
            <p className="stats-label">Total Gastos</p>
          </div>
        </div>
      </div>

      <div className="dashboard">
        <div className="card">
          <h3 className="card-title">
            <PlusCircle
              size={24}
              style={{ marginRight: "10px", verticalAlign: "middle" }}
            />
            Registrar Ingreso
          </h3>
          <form onSubmit={handleAddIncome}>
            <div className="form-group">
              <label className="form-label">Monto del Ingreso</label>
              <input
                type="number"
                className="form-input"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                placeholder="Ej: 50000"
                step="0.01"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Agregar Ingreso
            </button>
          </form>
        </div>

        <div className="card">
          <h3 className="card-title">
            <MinusCircle
              size={24}
              style={{ marginRight: "10px", verticalAlign: "middle" }}
            />
            Registrar Gasto
          </h3>
          <form onSubmit={handleAddExpense}>
            <div className="form-group">
              <label className="form-label">Monto del Gasto</label>
              <input
                type="number"
                className="form-input"
                value={expense}
                onChange={(e) => setExpense(e.target.value)}
                placeholder="Ej: 15000"
                step="0.01"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Categoría</label>
              <select
                className="form-input"
                value={expenseCategory}
                onChange={(e) => setExpenseCategory(e.target.value)}
              >
                {categories.map((cat) => (
                  <option key={cat.name} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Descripción</label>
              <input
                type="text"
                className="form-input"
                value={expenseDescription}
                onChange={(e) => setExpenseDescription(e.target.value)}
                placeholder="Ej: Almuerzo universidad"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Registrar Gasto
            </button>
          </form>
        </div>
      </div>

      <div className="card">
        <h3 className="card-title">
          <Calendar
            size={24}
            style={{ marginRight: "10px", verticalAlign: "middle" }}
          />
          Historial de Gastos
        </h3>

        {userExpenses.length === 0 ? (
          <p style={{ textAlign: "center", color: "#666", padding: "2rem" }}>
            No has registrado gastos aún. ¡Comienza registrando tus gastos
            diarios!
          </p>
        ) : (
          <div>
            {userExpenses
              .slice()
              .reverse()
              .map((expense) => (
                <div
                  key={expense.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "15px",
                    border: "1px solid #eee",
                    borderRadius: "8px",
                    marginBottom: "10px",
                    background: "#f9f9f9",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "5px",
                      }}
                    >
                      <Tag
                        size={16}
                        style={{ marginRight: "8px", color: "#667eea" }}
                      />
                      <strong>{expense.category}</strong>
                      <span style={{ marginLeft: "10px", color: "#666" }}>
                        {expense.date}
                      </span>
                    </div>
                    <p style={{ margin: 0, color: "#666" }}>
                      {expense.description}
                    </p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    {editingExpense === expense.id ? (
                      <form
                        onSubmit={handleEditExpenseSubmit}
                        style={{
                          display: "inline-flex",
                          gap: "8px",
                          alignItems: "center",
                          background: "#fff",
                          borderRadius: 6,
                          padding: 6,
                        }}
                      >
                        <input
                          type="text"
                          name="description"
                          value={editExpenseData.description}
                          onChange={handleEditExpenseChange}
                          required
                          style={{
                            width: "120px",
                            background: "#f3f3f3",
                            border: "1px solid #bbb",
                            color: "#222",
                          }}
                        />
                        <input
                          type="number"
                          name="amount"
                          value={editExpenseData.amount}
                          onChange={handleEditExpenseChange}
                          required
                          style={{
                            width: "80px",
                            background: "#f3f3f3",
                            border: "1px solid #bbb",
                            color: "#222",
                          }}
                        />
                        <select
                          name="category"
                          value={editExpenseData.category}
                          onChange={handleEditExpenseChange}
                          required
                          style={{
                            background: "#f3f3f3",
                            border: "1px solid #bbb",
                            color: "#222",
                          }}
                        >
                          {categories.map((cat) => (
                            <option key={cat.name} value={cat.name}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                        <button
                          type="submit"
                          style={{
                            fontSize: "0.8rem",
                            background: "#4caf50",
                            color: "#fff",
                            border: "none",
                            borderRadius: 4,
                            padding: "4px 10px",
                            cursor: "pointer",
                          }}
                        >
                          Guardar
                        </button>
                        <button
                          type="button"
                          style={{
                            fontSize: "0.8rem",
                            background: "#e74c3c",
                            color: "#fff",
                            border: "none",
                            borderRadius: 4,
                            padding: "4px 10px",
                            cursor: "pointer",
                          }}
                          onClick={() => setEditingExpense(null)}
                        >
                          Cancelar
                        </button>
                      </form>
                    ) : (
                      <>
                        <span
                          style={{
                            fontSize: "1.2rem",
                            fontWeight: "bold",
                            color: "#e74c3c",
                          }}
                        >
                          -${expense.amount.toLocaleString()}
                        </span>
                        <button
                          onClick={() => handleEditExpense(expense)}
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
                          onClick={() => handleDeleteExpense(expense.id)}
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
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {userBalance < 0 && (
        <div
          className="card"
          style={{ background: "#ffebee", border: "2px solid #f44336" }}
        >
          <h3 style={{ color: "#d32f2f", margin: "0 0 1rem 0" }}>
            ⚠️ Alerta de Sobregasto
          </h3>
          <p style={{ color: "#d32f2f", margin: 0 }}>
            Tu balance es negativo. Considera revisar tus gastos y ajustar tu
            presupuesto.
            <br />
            <strong>Recomendación:</strong> Evita gastos innecesarios y busca
            formas de generar ingresos adicionales.
          </p>
        </div>
      )}
    </div>
  );
};

export default Budget;
