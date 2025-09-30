import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, User, Lock } from "lucide-react";

const Login = ({ setIsAuthenticated }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Error de autenticación");
        return;
      }
      const data = await res.json();
      localStorage.setItem("token", data.token);
      setIsAuthenticated(true);
      navigate("/dashboard");
    } catch (err) {
      setError("Error de conexión con el servidor");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e3e6ff 0%, #fff 100%)",
        paddingTop: "3.5rem",
        display: "block",
      }}
    >
      <div
        className="card form"
        style={{
          maxWidth: 380,
          width: "100%",
          margin: "0 auto",
          padding: "2.5rem 2rem 2rem 2rem",
          borderRadius: 16,
          boxShadow: "0 4px 24px 0 rgba(102,126,234,0.10)",
          background: "white",
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
        }}
      >
        <h2 className="card-title" style={{ textAlign: "center" }}>
          <LogIn
            size={32}
            style={{ marginRight: "10px", verticalAlign: "middle" }}
          />
          Iniciar Sesión
        </h2>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.7rem",
            marginTop: "1.2rem",
          }}
        >
          <div
            className="form-group"
            style={{
              marginBottom: 0,
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            <label className="form-label">
              <User
                size={18}
                style={{ marginRight: "8px", verticalAlign: "middle" }}
              />
              Correo Electrónico
            </label>
            <input
              type="email"
              name="email"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              placeholder="usuario@ejemplo.com"
              required
              style={{
                fontSize: "1rem",
                padding: "0.8rem 1.1rem",
                borderRadius: 8,
                border: "1px solid #ddd",
                marginTop: 2,
                width: "97%",
                marginLeft: "auto",
                marginRight: "auto",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div
            className="form-group"
            style={{
              marginBottom: 0,
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            <label className="form-label">
              <Lock
                size={18}
                style={{ marginRight: "8px", verticalAlign: "middle" }}
              />
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              className="form-input"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              style={{
                fontSize: "1rem",
                padding: "0.8rem 1.1rem",
                borderRadius: 8,
                border: "1px solid #ddd",
                marginTop: 2,
                width: "97%",
                marginLeft: "auto",
                marginRight: "auto",
                boxSizing: "border-box",
              }}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{
              width: "100%",
              fontSize: "1.1rem",
              padding: "0.9rem",
              borderRadius: 8,
              marginTop: 8,
            }}
          >
            Ingresar
          </button>
          {error && (
            <div
              style={{ color: "red", marginTop: "1rem", textAlign: "center" }}
            >
              {error}
            </div>
          )}
        </form>

        {/* Enlace a registro si el usuario no tiene cuenta */}
        <div
          style={{
            marginTop: "2rem",
            textAlign: "center",
            fontSize: "0.95rem",
            color: "#666",
          }}
        >
          ¿No tienes cuenta?{" "}
          <a href="/register" style={{ color: "#667eea", fontWeight: 500 }}>
            Regístrate aquí
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
