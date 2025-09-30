import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, LogOut, PiggyBank } from "lucide-react";

const Header = ({ isAuthenticated, setIsAuthenticated }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    setIsAuthenticated(false);
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
              <Link to="/savings" className="nav-link">
                Ahorros
              </Link>
              <Link to="/education" className="nav-link">
                Educación
              </Link>
              <Link to="/statistics" className="nav-link">
                Estadísticas
              </Link>
              <Link to="/profile" className="nav-link">
                <User
                  size={18}
                  style={{ marginRight: "5px", verticalAlign: "middle" }}
                />
                Perfil
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
