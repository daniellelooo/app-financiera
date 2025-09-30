import React, { useState } from "react";
import { UserPlus, User, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Error al registrar");
        return;
      }
      setSuccess("Registro exitoso. Ahora puedes iniciar sesión.");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError("Error de conexión con el servidor");
    }
  };

  return (
    <div className="card form">
      <h2 className="card-title" style={{ textAlign: "center" }}>
        <UserPlus
          size={32}
          style={{ marginRight: "10px", verticalAlign: "middle" }}
        />
        Registrarse
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
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
          />
        </div>
        <div className="form-group">
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
          />
        </div>
        <div className="form-group">
          <label className="form-label">
            <Lock
              size={18}
              style={{ marginRight: "8px", verticalAlign: "middle" }}
            />
            Confirmar Contraseña
          </label>
          <input
            type="password"
            name="confirmPassword"
            className="form-input"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="••••••••"
            required
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: "100%" }}
        >
          Registrarse
        </button>
        {error && (
          <div style={{ color: "red", marginTop: "1rem", textAlign: "center" }}>
            {error}
          </div>
        )}
        {success && (
          <div
            style={{ color: "green", marginTop: "1rem", textAlign: "center" }}
          >
            {success}
          </div>
        )}
      </form>
    </div>
  );
};

export default Register;
