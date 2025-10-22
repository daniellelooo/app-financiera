import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, LogOut, PiggyBank, Bell, Moon, Sun } from "lucide-react";

const Header = ({
  isAuthenticated,
  setIsAuthenticated,
  isDarkMode,
  toggleTheme,
}) => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");

  // Obtener el nombre del usuario desde el backend
  useEffect(() => {
    const fetchUserName = async () => {
      if (!isAuthenticated) {
        setUserName("");
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          // Usar el nombre real del usuario
          setUserName(data.name || "Usuario");
        }
      } catch (error) {
        console.error("Error obteniendo perfil:", error);
      }
    };

    fetchUserName();
  }, [isAuthenticated]);

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserName("");
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          <PiggyBank
            size={24}
            style={{ marginRight: "8px", verticalAlign: "middle" }}
          />
          FinanSmart
        </Link>

        <nav className="nav">
          <Link to="/" className="nav-link">
            Inicio
          </Link>

          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="nav-link">
                Dashboard
              </Link>
              <Link to="/budget" className="nav-link">
                Presupuesto
              </Link>
              <Link to="/goals" className="nav-link">
                Metas
              </Link>
              <Link to="/education" className="nav-link">
                Educación
              </Link>
              <Link to="/gamification" className="nav-link">
                Juegos
              </Link>
              <Link to="/statistics" className="nav-link">
                Estadísticas
              </Link>
              <Link
                to="/notifications"
                className="nav-link"
                title="Notificaciones"
              >
                <Bell size={20} />
              </Link>
              <button
                onClick={toggleTheme}
                className="nav-link"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "0.5rem",
                  display: "flex",
                  alignItems: "center",
                }}
                title={isDarkMode ? "Modo Claro" : "Modo Oscuro"}
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <Link to="/profile" className="nav-link">
                <User
                  size={18}
                  style={{ marginRight: "5px", verticalAlign: "middle" }}
                />
                {userName ? userName.split(" ")[0] : "Perfil"}
              </Link>
              <button onClick={handleLogout} className="btn btn-secondary">
                <LogOut
                  size={18}
                  style={{ marginRight: "5px", verticalAlign: "middle" }}
                />
                Cerrar Sesión
              </button>
            </>
          ) : (
            <>
              <button
                onClick={toggleTheme}
                className="nav-link"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "0.5rem",
                  display: "flex",
                  alignItems: "center",
                }}
                title={isDarkMode ? "Modo Claro" : "Modo Oscuro"}
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <Link
                to="/login"
                className="btn btn-primary"
                style={{ marginRight: "0.5rem" }}
              >
                Iniciar Sesión
              </Link>
              <Link to="/register" className="btn btn-secondary">
                Registrarse
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
