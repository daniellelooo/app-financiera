import React, { useState, useEffect } from "react";
import {
  Trophy,
  Target,
  Flame,
  Award,
  Star,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

const Gamification = () => {
  const [profile, setProfile] = useState(null);
  const [challenges, setChallenges] = useState([]);
  const [badges, setBadges] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    refreshAllData();
  }, []);

  const refreshAllData = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      // Primero refrescar desafíos y badges
      await fetch(
        `${import.meta.env.VITE_API_URL}/api/gamification/refresh-challenges`,
        {
          method: "POST",
          headers,
        }
      );

      // Luego cargar todos los datos actualizados
      await fetchGamificationData();
    } catch (error) {
      console.error("Error refrescando datos:", error);
      await fetchGamificationData(); // Intentar cargar aunque falle el refresh
    }
  };

  const fetchGamificationData = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      // Cargar perfil
      const profileRes = await fetch(
        `${import.meta.env.VITE_API_URL}/api/gamification/profile`,
        { headers }
      );
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setProfile(profileData);
      }

      // Cargar desafíos
      const challengesRes = await fetch(
        `${import.meta.env.VITE_API_URL}/api/gamification/challenges`,
        { headers }
      );
      if (challengesRes.ok) {
        const challengesData = await challengesRes.json();
        setChallenges(challengesData);
      }

      // Cargar badges
      const badgesRes = await fetch(
        `${import.meta.env.VITE_API_URL}/api/gamification/badges`,
        { headers }
      );
      if (badgesRes.ok) {
        const badgesData = await badgesRes.json();
        setBadges(badgesData);
      }

      // Cargar ranking
      const leaderboardRes = await fetch(
        `${import.meta.env.VITE_API_URL}/api/gamification/leaderboard`,
        { headers }
      );
      if (leaderboardRes.ok) {
        const leaderboardData = await leaderboardRes.json();
        setLeaderboard(leaderboardData);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error cargando datos de gamificación:", error);
      setLoading(false);
    }
  };

  const resetBadges = async () => {
    if (
      !confirm(
        "¿Estás seguro de reiniciar las insignias? Esto recalculará todas las insignias correctamente."
      )
    ) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/gamification/reset-badges`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        alert("✅ Insignias reiniciadas correctamente");
        await refreshAllData();
      } else {
        alert("❌ Error al reiniciar insignias");
      }
    } catch (error) {
      console.error("Error reiniciando insignias:", error);
      alert("❌ Error de conexión");
    }
  };

  const updateStreak = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/gamification/update-streak`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        const data = await res.json();
        alert(`¡Racha actualizada! ${data.pointsEarned} puntos ganados`);
        fetchGamificationData();
      } else {
        const error = await res.json();
        alert(error.message || "Ya registraste actividad hoy");
      }
    } catch (error) {
      console.error("Error actualizando racha:", error);
    }
  };

  if (loading) {
    return (
      <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
        <p>Cargando gamificación...</p>
      </div>
    );
  }

  const levelProgress = profile ? ((profile.points % 1000) / 1000) * 100 : 0;
  const pointsToNextLevel = profile ? 1000 - (profile.points % 1000) : 1000;

  return (
    <div>
      {/* Header de Perfil */}
      <div
        className="card"
        style={{
          background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
          color: "white",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background decoration */}
        <div
          style={{
            position: "absolute",
            top: "-50%",
            right: "-10%",
            width: "300px",
            height: "300px",
            background: "rgba(255,255,255,0.1)",
            borderRadius: "50%",
            filter: "blur(40px)",
          }}
        ></div>

        <h1
          className="card-title"
          style={{ color: "white", marginBottom: "2rem", position: "relative" }}
        >
          <Trophy
            size={32}
            style={{ marginRight: "10px", verticalAlign: "middle" }}
          />
          Tu Perfil de Juego
        </h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "2rem",
            position: "relative",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                position: "relative",
                display: "inline-block",
              }}
            >
              {/* Circular progress ring */}
              <svg
                width="120"
                height="120"
                style={{ transform: "rotate(-90deg)" }}
              >
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="8"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="url(#levelGradient)"
                  strokeWidth="8"
                  strokeDasharray={`${(levelProgress / 100) * 314} 314`}
                  strokeLinecap="round"
                  style={{ transition: "stroke-dasharray 0.5s ease" }}
                />
                <defs>
                  <linearGradient
                    id="levelGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#4caf50" />
                    <stop offset="100%" stopColor="#8bc34a" />
                  </linearGradient>
                </defs>
              </svg>
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  fontSize: "2rem",
                  fontWeight: "bold",
                }}
              >
                {profile?.level || 1}
              </div>
            </div>
            <div
              style={{
                marginTop: "1rem",
                fontSize: "1.2rem",
                fontWeight: "600",
              }}
            >
              Nivel {profile?.level || 1}
            </div>
            <div style={{ opacity: 0.9, marginTop: "0.5rem" }}>
              {profile?.points || 0} puntos
            </div>
            <div
              style={{ fontSize: "0.85rem", marginTop: "0.5rem", opacity: 0.9 }}
            >
              {pointsToNextLevel} para siguiente nivel
            </div>
          </div>

          <div style={{ textAlign: "center" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.2)",
                marginBottom: "1rem",
                animation:
                  profile?.current_streak > 0 ? "pulse 2s infinite" : "none",
              }}
            >
              <Flame
                size={48}
                style={{
                  filter: "drop-shadow(0 0 10px rgba(255,255,255,0.5))",
                }}
              />
            </div>
            <div style={{ fontSize: "2.5rem", fontWeight: "bold" }}>
              {profile?.current_streak || 0}
            </div>
            <div style={{ opacity: 0.9 }}>Días de racha</div>
            <div
              style={{ fontSize: "0.85rem", marginTop: "0.5rem", opacity: 0.9 }}
            >
              Mejor: {profile?.best_streak || 0} días
            </div>
          </div>

          <div style={{ textAlign: "center" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.2)",
                marginBottom: "1rem",
              }}
            >
              <Award size={48} />
            </div>
            <div style={{ fontSize: "2.5rem", fontWeight: "bold" }}>
              {badges.filter((b) => b.earned_at).length}/{badges.length}
            </div>
            <div style={{ opacity: 0.9 }}>Insignias desbloqueadas</div>
          </div>
        </div>

        <button
          onClick={updateStreak}
          className="btn"
          style={{
            marginTop: "2rem",
            background: "white",
            color: "#f5576c",
            fontWeight: "bold",
            border: "none",
          }}
        >
          <Zap
            size={18}
            style={{ marginRight: "8px", verticalAlign: "middle" }}
          />
          Registrar Actividad de Hoy
        </button>
      </div>

      {/* Desafíos Activos */}
      <div className="card">
        <h3 className="card-title">
          <Target
            size={24}
            style={{ marginRight: "10px", verticalAlign: "middle" }}
          />
          Desafíos Activos
        </h3>

        <div style={{ display: "grid", gap: "1rem" }}>
          {challenges.map((challenge) => {
            const progress = challenge.progress || 0;
            const progressPercent = (progress / challenge.target) * 100;
            const isCompleted = challenge.completed;

            return (
              <div
                key={challenge.id}
                className="card"
                style={{
                  background: isCompleted
                    ? "linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)"
                    : "white",
                  border: isCompleted
                    ? "2px solid #28a745"
                    : "1px solid #e0e0e0",
                  position: "relative",
                  overflow: "visible",
                  transition: "all 0.3s ease",
                }}
              >
                {/* Header con ícono, título y puntos */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "1rem",
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", flex: 1 }}
                  >
                    <div
                      style={{
                        fontSize: "2.5rem",
                        marginRight: "15px",
                        filter: isCompleted ? "none" : "grayscale(0%)",
                        transform: isCompleted ? "scale(1.1)" : "scale(1)",
                        transition: "all 0.3s ease",
                      }}
                    >
                      {challenge.icon}
                    </div>
                    <div>
                      <h4
                        style={{
                          margin: 0,
                          fontSize: "1.2rem",
                          marginBottom: "0.25rem",
                        }}
                      >
                        {challenge.title}
                      </h4>
                      {isCompleted && (
                        <div
                          style={{
                            display: "inline-block",
                            background:
                              "linear-gradient(135deg, #28a745, #20c997)",
                            color: "white",
                            padding: "0.3rem 0.8rem",
                            borderRadius: "15px",
                            fontSize: "0.75rem",
                            fontWeight: "bold",
                            boxShadow: "0 2px 8px rgba(40, 167, 69, 0.3)",
                          }}
                        >
                          ✅ Completado
                        </div>
                      )}
                    </div>
                  </div>
                  <div
                    style={{
                      background: "linear-gradient(135deg, #ffd700, #ffed4e)",
                      padding: "0.6rem 1.2rem",
                      borderRadius: "20px",
                      fontSize: "1.1rem",
                      fontWeight: "bold",
                      color: "#333",
                      boxShadow: "0 3px 12px rgba(255, 215, 0, 0.4)",
                      whiteSpace: "nowrap",
                      marginLeft: "1rem",
                    }}
                  >
                    +{challenge.reward_points} pts
                  </div>
                </div>

                {/* Descripción */}
                <p
                  style={{
                    margin: "0 0 1.25rem 0",
                    color: "#666",
                    fontSize: "0.95rem",
                    lineHeight: "1.5",
                  }}
                >
                  {challenge.description}
                </p>

                {/* Barra de progreso mejorada */}
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "0.75rem",
                      fontSize: "0.95rem",
                      fontWeight: "600",
                      color: "#555",
                    }}
                  >
                    <span>Progreso</span>
                    <span
                      style={{
                        fontSize: "1rem",
                        color: isCompleted ? "#28a745" : "#667eea",
                        fontWeight: "bold",
                      }}
                    >
                      {progress} / {challenge.target}
                    </span>
                  </div>
                  <div
                    style={{
                      width: "100%",
                      height: "28px",
                      backgroundColor: "#e9ecef",
                      borderRadius: "14px",
                      overflow: "hidden",
                      boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${Math.min(progressPercent, 100)}%`,
                        background: isCompleted
                          ? "linear-gradient(90deg, #28a745, #20c997)"
                          : "linear-gradient(90deg, #667eea, #764ba2)",
                        borderRadius: "14px",
                        transition: "width 0.5s ease",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 2px 8px rgba(102, 126, 234, 0.4)",
                      }}
                    >
                      <span
                        style={{
                          color: "white",
                          fontSize: "0.9rem",
                          fontWeight: "bold",
                          textShadow: "0 1px 2px rgba(0,0,0,0.2)",
                        }}
                      >
                        {progressPercent.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {challenges.length === 0 && (
            <p style={{ textAlign: "center", color: "#666", padding: "2rem" }}>
              No hay desafíos activos en este momento
            </p>
          )}
        </div>
      </div>

      {/* Insignias */}
      <div className="card">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <h3 className="card-title" style={{ marginBottom: 0 }}>
            <Award
              size={24}
              style={{ marginRight: "10px", verticalAlign: "middle" }}
            />
            Colección de Insignias
          </h3>
          <button
            onClick={resetBadges}
            style={{
              padding: "0.6rem 1.2rem",
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              color: "white",
              border: "none",
              borderRadius: "12px",
              fontSize: "0.9rem",
              fontWeight: "600",
              cursor: "pointer",
              boxShadow: "0 4px 15px rgba(245, 87, 108, 0.3)",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 6px 20px rgba(245, 87, 108, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 4px 15px rgba(245, 87, 108, 0.3)";
            }}
          >
            🔄 Recalcular Insignias
          </button>
        </div>

        <div className="dashboard">
          {badges.map((badge, index) => {
            const isEarned = badge.earned_at !== null;

            return (
              <div
                key={badge.id}
                className="card"
                style={{
                  textAlign: "center",
                  opacity: isEarned ? 1 : 0.5,
                  border: isEarned ? "3px solid #ffd700" : "1px solid #e0e0e0",
                  transform: isEarned ? "scale(1)" : "scale(0.95)",
                  transition: "all 0.3s ease",
                  boxShadow: isEarned
                    ? "0 8px 25px rgba(255, 215, 0, 0.4)"
                    : "0 2px 10px rgba(0,0,0,0.05)",
                  position: "relative",
                  overflow: "hidden",
                  animation: isEarned
                    ? `fadeInUp 0.5s ease ${index * 0.1}s backwards`
                    : "none",
                }}
                onMouseEnter={(e) => {
                  if (isEarned) {
                    e.currentTarget.style.transform =
                      "scale(1.05) translateY(-5px)";
                    e.currentTarget.style.boxShadow =
                      "0 12px 35px rgba(255, 215, 0, 0.5)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (isEarned) {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 25px rgba(255, 215, 0, 0.4)";
                  }
                }}
              >
                {isEarned && (
                  <>
                    {/* Glow effect */}
                    <div
                      style={{
                        position: "absolute",
                        top: "-50%",
                        left: "-50%",
                        width: "200%",
                        height: "200%",
                        background:
                          "radial-gradient(circle, rgba(255,215,0,0.1) 0%, transparent 70%)",
                        animation: "pulse 3s infinite",
                        pointerEvents: "none",
                      }}
                    ></div>
                    {/* Sparkle corner */}
                    <div
                      style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        fontSize: "1.5rem",
                        animation: "sparkle 2s infinite",
                      }}
                    >
                      ✨
                    </div>
                  </>
                )}

                <div
                  style={{
                    fontSize: "5rem",
                    marginBottom: "1rem",
                    filter: isEarned ? "none" : "grayscale(100%)",
                    opacity: isEarned ? 1 : 0.3,
                    transition: "all 0.3s ease",
                    position: "relative",
                  }}
                >
                  {badge.icon}
                </div>
                <h4
                  style={{
                    margin: "0 0 0.5rem 0",
                    fontSize: "1.1rem",
                    fontWeight: "700",
                  }}
                >
                  {badge.name}
                </h4>
                <p
                  style={{
                    margin: "0 0 1rem 0",
                    fontSize: "0.9rem",
                    color: "#666",
                    lineHeight: "1.5",
                  }}
                >
                  {badge.description}
                </p>

                {isEarned ? (
                  <div
                    style={{
                      padding: "0.6rem 1.2rem",
                      background:
                        "linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)",
                      borderRadius: "25px",
                      fontSize: "0.85rem",
                      fontWeight: "bold",
                      color: "#333",
                      boxShadow: "0 4px 15px rgba(255, 215, 0, 0.3)",
                      display: "inline-block",
                    }}
                  >
                    ✨ Desbloqueada
                  </div>
                ) : (
                  <div
                    style={{
                      padding: "0.6rem 1.2rem",
                      background: "#f5f5f5",
                      borderRadius: "25px",
                      fontSize: "0.85rem",
                      color: "#999",
                      display: "inline-block",
                    }}
                  >
                    🔒 Bloqueada
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Ranking */}
      <div className="card">
        <h3 className="card-title">
          <Users
            size={24}
            style={{ marginRight: "10px", verticalAlign: "middle" }}
          />
          Tabla de Clasificación
        </h3>

        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "separate",
              borderSpacing: "0 0.5rem",
            }}
          >
            <thead>
              <tr
                style={{
                  background:
                    "linear-gradient(135deg, #f5f7fa 0%, #e8ebf0 100%)",
                  borderRadius: "8px",
                }}
              >
                <th
                  style={{
                    padding: "1rem",
                    textAlign: "left",
                    fontWeight: "700",
                    color: "#333",
                    borderTopLeftRadius: "8px",
                    borderBottomLeftRadius: "8px",
                  }}
                >
                  Posición
                </th>
                <th
                  style={{
                    padding: "1rem",
                    textAlign: "left",
                    fontWeight: "700",
                    color: "#333",
                  }}
                >
                  Usuario
                </th>
                <th
                  style={{
                    padding: "1rem",
                    textAlign: "center",
                    fontWeight: "700",
                    color: "#333",
                  }}
                >
                  Nivel
                </th>
                <th
                  style={{
                    padding: "1rem",
                    textAlign: "center",
                    fontWeight: "700",
                    color: "#333",
                  }}
                >
                  Puntos
                </th>
                <th
                  style={{
                    padding: "1rem",
                    textAlign: "center",
                    fontWeight: "700",
                    color: "#333",
                    borderTopRightRadius: "8px",
                    borderBottomRightRadius: "8px",
                  }}
                >
                  Racha
                </th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((user, index) => {
                const isTopThree = index < 3;
                const bgGradient =
                  index === 0
                    ? "linear-gradient(135deg, #fff9e6 0%, #ffe6a8 100%)"
                    : index === 1
                    ? "linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)"
                    : index === 2
                    ? "linear-gradient(135deg, #fff0e6 0%, #ffe0cc 100%)"
                    : "white";

                return (
                  <tr
                    key={index}
                    style={{
                      background: bgGradient,
                      boxShadow: isTopThree
                        ? "0 4px 15px rgba(0,0,0,0.08)"
                        : "0 2px 8px rgba(0,0,0,0.05)",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow =
                        "0 6px 20px rgba(0,0,0,0.12)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = isTopThree
                        ? "0 4px 15px rgba(0,0,0,0.08)"
                        : "0 2px 8px rgba(0,0,0,0.05)";
                    }}
                  >
                    <td
                      style={{
                        padding: "1rem",
                        borderTopLeftRadius: "8px",
                        borderBottomLeftRadius: "8px",
                      }}
                    >
                      <div
                        style={{
                          width: "45px",
                          height: "45px",
                          borderRadius: "50%",
                          background: isTopThree
                            ? "linear-gradient(135deg, #ffd700, #ffed4e)"
                            : "linear-gradient(135deg, #e0e0e0, #c8c8c8)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: "bold",
                          fontSize: "1.2rem",
                          color: isTopThree ? "#333" : "#666",
                          boxShadow: isTopThree
                            ? "0 4px 10px rgba(255, 215, 0, 0.4)"
                            : "none",
                        }}
                      >
                        {index === 0
                          ? "🥇"
                          : index === 1
                          ? "🥈"
                          : index === 2
                          ? "🥉"
                          : index + 1}
                      </div>
                    </td>
                    <td
                      style={{
                        padding: "1rem",
                        fontWeight: "700",
                        fontSize: "1rem",
                        color: "#333",
                      }}
                    >
                      {user.name}
                    </td>
                    <td style={{ padding: "1rem", textAlign: "center" }}>
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          background:
                            "linear-gradient(135deg, #fff9e6, #ffed4e)",
                          padding: "0.4rem 0.8rem",
                          borderRadius: "20px",
                          fontWeight: "700",
                          color: "#333",
                        }}
                      >
                        <Star
                          size={16}
                          style={{
                            color: "#ffd700",
                            marginRight: "4px",
                          }}
                        />
                        {user.level}
                      </div>
                    </td>
                    <td
                      style={{
                        padding: "1rem",
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: "1.1rem",
                        color: "#667eea",
                      }}
                    >
                      {user.points.toLocaleString()}
                    </td>
                    <td
                      style={{
                        padding: "1rem",
                        textAlign: "center",
                        borderTopRightRadius: "8px",
                        borderBottomRightRadius: "8px",
                      }}
                    >
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          background:
                            "linear-gradient(135deg, #ffe6e6, #ff9999)",
                          padding: "0.4rem 0.8rem",
                          borderRadius: "20px",
                          fontWeight: "700",
                          color: "#333",
                        }}
                      >
                        <Flame
                          size={16}
                          style={{
                            color: "#ff6b6b",
                            marginRight: "4px",
                          }}
                        />
                        {user.current_streak}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {leaderboard.length === 0 && (
            <p style={{ textAlign: "center", color: "#666", padding: "2rem" }}>
              No hay datos de ranking disponibles
            </p>
          )}
        </div>
      </div>

      {/* Consejos */}
      <div
        className="card"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
        }}
      >
        <h3 className="card-title" style={{ color: "white" }}>
          <TrendingUp
            size={24}
            style={{ marginRight: "10px", verticalAlign: "middle" }}
          />
          Consejos para Ganar Más Puntos
        </h3>

        <ul style={{ lineHeight: "2", margin: 0, paddingLeft: "1.5rem" }}>
          <li>
            Registra tus gastos e ingresos diariamente para mantener tu racha 🔥
          </li>
          <li>Completa desafíos mensuales para ganar grandes recompensas 🎯</li>
          <li>Avanza en las lecciones de educación financiera 📚</li>
          <li>
            Alcanza tus metas de ahorro para desbloquear insignias especiales 🏆
          </li>
          <li>Cada 1000 puntos subes de nivel - ¡sigue acumulando! ⭐</li>
        </ul>
      </div>
    </div>
  );
};

export default Gamification;
