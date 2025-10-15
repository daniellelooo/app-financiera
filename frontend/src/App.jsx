import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Budget from "./pages/Budget";
import Goals from "./pages/Goals";
import Education from "./pages/Education";
import Gamification from "./pages/Gamification";
import Notifications from "./pages/Notifications";
import Statistics from "./pages/Statistics";
import Register from "./pages/Register";
import "./App.css";

function App() {
  // Iniciar siempre como NO autenticado
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [userBalance, setUserBalance] = React.useState(0);
  const [userExpenses, setUserExpenses] = React.useState([]);
  const [userIncomes, setUserIncomes] = React.useState([]);
  const [savingsGoals, setSavingsGoals] = React.useState([]);

  // Validar token al cargar la página
  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        // Intentar acceder a un endpoint protegido para validar el token
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          // Token válido, usuario autenticado
          setIsAuthenticated(true);
        } else {
          // Token inválido o expirado, limpiar y desautenticar
          localStorage.removeItem("token");
          setIsAuthenticated(false);
        }
      } catch (error) {
        // Error de conexión, limpiar y desautenticar
        console.error("Error validando token:", error);
        localStorage.removeItem("token");
        setIsAuthenticated(false);
      }
    };

    validateToken();
  }, []);

  // Cargar datos del usuario cuando esté autenticado
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token || !isAuthenticated) return;

      try {
        // Ingresos
        const resIncomes = await fetch(
          `${import.meta.env.VITE_API_URL}/api/incomes`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!resIncomes.ok) throw new Error("Error al cargar ingresos");
        const incomes = await resIncomes.json();
        setUserIncomes(Array.isArray(incomes) ? incomes : []);

        // Gastos
        const resExpenses = await fetch(
          `${import.meta.env.VITE_API_URL}/api/expenses`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!resExpenses.ok) throw new Error("Error al cargar gastos");
        const expenses = await resExpenses.json();
        setUserExpenses(Array.isArray(expenses) ? expenses : []);

        // Metas de ahorro
        const resGoals = await fetch(
          `${import.meta.env.VITE_API_URL}/api/goals`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!resGoals.ok) throw new Error("Error al cargar metas");
        const goals = await resGoals.json();
        setSavingsGoals(Array.isArray(goals) ? goals : []);

        // Calcular balance
        const totalIncomes = Array.isArray(incomes)
          ? incomes.reduce((sum, i) => sum + (i.amount || 0), 0)
          : 0;
        const totalExpenses = Array.isArray(expenses)
          ? expenses.reduce((sum, e) => sum + (e.amount || 0), 0)
          : 0;
        setUserBalance(totalIncomes - totalExpenses);
      } catch (err) {
        console.error("Error cargando datos del backend:", err);
        // Si hay error al cargar datos, desautenticar
        localStorage.removeItem("token");
        setIsAuthenticated(false);
      }
    };

    fetchData();
  }, [isAuthenticated]);

  return (
    <Router>
      <div className="App">
        <Header
          isAuthenticated={isAuthenticated}
          setIsAuthenticated={setIsAuthenticated}
        />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/login"
              element={<Login setIsAuthenticated={setIsAuthenticated} />}
            />
            <Route path="/register" element={<Register />} />

            {/* Rutas protegidas - requieren autenticación */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Dashboard
                    userBalance={userBalance}
                    userExpenses={userExpenses}
                    userIncomes={userIncomes}
                    totalSaved={savingsGoals.reduce(
                      (sum, goal) => sum + (goal.current || 0),
                      0
                    )}
                    savingsGoals={savingsGoals}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/budget"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Budget
                    userBalance={userBalance}
                    setUserBalance={setUserBalance}
                    userExpenses={userExpenses}
                    setUserExpenses={setUserExpenses}
                    userIncomes={userIncomes}
                    setUserIncomes={setUserIncomes}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/goals"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Goals
                    savingsGoals={savingsGoals}
                    setSavingsGoals={setSavingsGoals}
                    userIncomes={userIncomes}
                    userExpenses={userExpenses}
                  />
                </ProtectedRoute>
              }
            />
            {/* Ruta legacy - redirigir /savings a /goals */}
            <Route
              path="/savings"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Goals
                    savingsGoals={savingsGoals}
                    setSavingsGoals={setSavingsGoals}
                    userIncomes={userIncomes}
                    userExpenses={userExpenses}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/education"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Education />
                </ProtectedRoute>
              }
            />
            <Route
              path="/gamification"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Gamification />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Notifications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/statistics"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Statistics
                    userExpenses={userExpenses}
                    totalSaved={savingsGoals.reduce(
                      (sum, goal) => sum + (goal.current || 0),
                      0
                    )}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Profile />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
