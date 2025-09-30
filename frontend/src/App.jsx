import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Budget from "./pages/Budget";
import Savings from "./pages/Savings";
import Education from "./pages/Education";
import Statistics from "./pages/Statistics";
import Register from "./pages/Register";
import "./App.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(() => {
    // Mantener sesión si hay token en localStorage
    return !!localStorage.getItem("token");
  });
  // Mantener sesión iniciada tras recargar
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !isAuthenticated) setIsAuthenticated(true);
    if (!token && isAuthenticated) setIsAuthenticated(false);
  }, []);
  const [userBalance, setUserBalance] = React.useState(0);
  const [userExpenses, setUserExpenses] = React.useState([]);
  const [userIncomes, setUserIncomes] = React.useState([]);
  // Cargar incomes, expenses y savingsGoals del backend y calcular balance al iniciar sesión o recargar
  const [savingsGoals, setSavingsGoals] = React.useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        // Ingresos
        const resIncomes = await fetch(
          `${import.meta.env.VITE_API_URL}/api/incomes`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const incomes = await resIncomes.json();
        setUserIncomes(Array.isArray(incomes) ? incomes : []);
        // Gastos
        const resExpenses = await fetch(
          `${import.meta.env.VITE_API_URL}/api/expenses`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const expenses = await resExpenses.json();
        setUserExpenses(Array.isArray(expenses) ? expenses : []);
        // Metas de ahorro
        const resGoals = await fetch(
          `${import.meta.env.VITE_API_URL}/api/goals`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
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
            <Route
              path="/dashboard"
              element={
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
              }
            />
            <Route
              path="/budget"
              element={
                <Budget
                  userBalance={userBalance}
                  setUserBalance={setUserBalance}
                  userExpenses={userExpenses}
                  setUserExpenses={setUserExpenses}
                  userIncomes={userIncomes}
                  setUserIncomes={setUserIncomes}
                />
              }
            />
            <Route
              path="/savings"
              element={
                <Savings
                  savingsGoals={savingsGoals}
                  setSavingsGoals={setSavingsGoals}
                />
              }
            />
            <Route path="/education" element={<Education />} />
            <Route
              path="/statistics"
              element={
                <Statistics
                  userExpenses={userExpenses}
                  totalSaved={savingsGoals.reduce(
                    (sum, goal) => sum + (goal.current || 0),
                    0
                  )}
                />
              }
            />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
