import React, { useState, useEffect } from "react";
import { User, Mail } from "lucide-react";

const Profile = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);

  // Obtener datos del usuario desde el backend
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setUserData({
            name: data.name || "Usuario",
            email: data.email,
          });
        }
      } catch (error) {
        console.error("Error cargando perfil:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="card">
        <p style={{ textAlign: "center", padding: "2rem" }}>
          Cargando perfil...
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <h1 className="card-title" style={{ marginBottom: "2rem" }}>
          Mi Perfil
        </h1>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "2rem",
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          {/* Avatar */}
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: "140px",
                height: "140px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1rem auto",
                boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
              }}
            >
              <User size={70} color="white" />
            </div>
            <h2 style={{ margin: "0 0 0.5rem 0", fontSize: "1.8rem" }}>
              {userData.name}
            </h2>
            <p style={{ margin: 0, color: "#888", fontSize: "0.95rem" }}>
              Miembro desde 2025
            </p>
          </div>

          {/* Información del usuario */}
          <div style={{ width: "100%" }}>
            <div className="form-group">
              <label className="form-label">
                <User
                  size={18}
                  style={{ marginRight: "8px", verticalAlign: "middle" }}
                />
                Nombre Completo
              </label>
              <p
                style={{
                  margin: "0.5rem 0",
                  padding: "0.75rem 1rem",
                  background: "#f8f9fa",
                  borderRadius: "8px",
                  fontSize: "1rem",
                }}
              >
                {userData.name}
              </p>
            </div>

            <div className="form-group">
              <label className="form-label">
                <Mail
                  size={18}
                  style={{ marginRight: "8px", verticalAlign: "middle" }}
                />
                Correo Electrónico
              </label>
              <p
                style={{
                  margin: "0.5rem 0",
                  padding: "0.75rem 1rem",
                  background: "#f8f9fa",
                  borderRadius: "8px",
                  fontSize: "1rem",
                }}
              >
                {userData.email}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tarjeta de estadísticas rápidas */}
      <div
        className="card"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
        }}
      >
        <h3 className="card-title" style={{ color: "white" }}>
          ¡Bienvenido a FinanSmart!
        </h3>
        <p style={{ margin: "1rem 0", fontSize: "1.05rem", lineHeight: "1.6" }}>
          Estás tomando el control de tus finanzas personales. Sigue registrando
          tus ingresos y gastos para obtener análisis más precisos y
          recomendaciones personalizadas.
        </p>
      </div>
    </div>
  );
};

export default Profile;
