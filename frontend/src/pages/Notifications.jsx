import React, { useState, useEffect } from "react";
import {
  Bell,
  CheckCircle,
  AlertTriangle,
  Info,
  Trash2,
  CheckCheck,
  TrendingUp,
  Target,
  BookOpen,
  DollarSign,
  RefreshCw,
} from "lucide-react";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, unread, read

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/notifications`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error("Error cargando notificaciones:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/notifications/count`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        const data = await res.json();
        setUnreadCount(data.count);
      }
    } catch (error) {
      console.error("Error contando notificaciones:", error);
    }
  };

  const checkBudgetAlerts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/notifications/check-budget-alerts`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        const data = await res.json();
        if (data.count > 0) {
          alert(
            `Se encontraron ${data.count} nueva(s) alerta(s) de presupuesto`
          );
          fetchNotifications();
          fetchUnreadCount();
        } else {
          alert("No se encontraron alertas de presupuesto");
        }
      }
    } catch (error) {
      console.error("Error verificando alertas:", error);
    }
  };

  const checkGoalsReminders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/api/notifications/check-goals-reminders`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        const data = await res.json();
        if (data.count > 0) {
          alert(
            `Se encontraron ${data.count} nuevo(s) recordatorio(s) de metas`
          );
          fetchNotifications();
          fetchUnreadCount();
        } else {
          alert("No hay recordatorios de metas pendientes");
        }
      }
    } catch (error) {
      console.error("Error verificando recordatorios:", error);
    }
  };

  const generateWeeklyTip = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/notifications/generate-weekly-tip`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          alert(`Nuevo consejo generado: ${data.tip.title}`);
          fetchNotifications();
          fetchUnreadCount();
        } else {
          alert(data.message || "Ya tienes un consejo generado esta semana");
        }
      }
    } catch (error) {
      console.error("Error generando consejo:", error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/api/notifications/mark-read/${notificationId}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        setNotifications(
          notifications.map((n) =>
            n.id === notificationId ? { ...n, is_read: true } : n
          )
        );
        setUnreadCount(Math.max(0, unreadCount - 1));
      }
    } catch (error) {
      console.error("Error marcando como leída:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/notifications/mark-all-read`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        setNotifications(notifications.map((n) => ({ ...n, is_read: true })));
        setUnreadCount(0);
      }
    } catch (error) {
      console.error("Error marcando todas como leídas:", error);
    }
  };

  const deleteNotification = async (notificationId) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta notificación?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/notifications/${notificationId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        const notification = notifications.find((n) => n.id === notificationId);
        if (notification && !notification.is_read) {
          setUnreadCount(Math.max(0, unreadCount - 1));
        }
        setNotifications(notifications.filter((n) => n.id !== notificationId));
      }
    } catch (error) {
      console.error("Error eliminando notificación:", error);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "budget_warning":
      case "budget_exceeded":
        return <AlertTriangle size={24} color="#ff9800" />;
      case "goal_progress":
      case "goal_deadline":
      case "goal_overdue":
        return <Target size={24} color="#2196f3" />;
      case "achievement":
        return <CheckCircle size={24} color="#4caf50" />;
      case "education":
        return <BookOpen size={24} color="#9c27b0" />;
      case "tip":
        return <Info size={24} color="#00bcd4" />;
      default:
        return <Bell size={24} color="#667eea" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "#f44336";
      case "medium":
        return "#ff9800";
      case "low":
      default:
        return "#4caf50";
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.is_read;
    if (filter === "read") return n.is_read;
    return true;
  });

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <p>Cargando notificaciones...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Bell size={32} color="#667eea" />
          <h1 style={{ margin: 0 }}>Notificaciones</h1>
          {unreadCount > 0 && (
            <span
              style={{
                backgroundColor: "#f44336",
                color: "white",
                borderRadius: "50%",
                width: "28px",
                height: "28px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              {unreadCount}
            </span>
          )}
        </div>

        <button
          onClick={markAllAsRead}
          disabled={unreadCount === 0}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.5rem 1rem",
            backgroundColor: unreadCount === 0 ? "#ccc" : "#667eea",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: unreadCount === 0 ? "not-allowed" : "pointer",
          }}
        >
          <CheckCheck size={18} />
          Marcar todas como leídas
        </button>
      </div>

      {/* Action Buttons */}
      <div className="card" style={{ marginBottom: "2rem" }}>
        <h3 className="card-title">
          <RefreshCw size={24} />
          Verificar Alertas
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "1rem",
          }}
        >
          <button
            onClick={checkBudgetAlerts}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              padding: "1rem",
              backgroundColor: "#ff9800",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            <DollarSign size={20} />
            Verificar Presupuesto
          </button>

          <button
            onClick={checkGoalsReminders}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              padding: "1rem",
              backgroundColor: "#2196f3",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            <Target size={20} />
            Verificar Metas
          </button>

          <button
            onClick={generateWeeklyTip}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              padding: "1rem",
              backgroundColor: "#9c27b0",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            <Info size={20} />
            Consejo Semanal
          </button>
        </div>
      </div>

      {/* Filter Buttons */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "1rem",
        }}
      >
        <button
          onClick={() => setFilter("all")}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: filter === "all" ? "#667eea" : "#f0f0f0",
            color: filter === "all" ? "white" : "#333",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Todas ({notifications.length})
        </button>
        <button
          onClick={() => setFilter("unread")}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: filter === "unread" ? "#667eea" : "#f0f0f0",
            color: filter === "unread" ? "white" : "#333",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          No leídas ({unreadCount})
        </button>
        <button
          onClick={() => setFilter("read")}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: filter === "read" ? "#667eea" : "#f0f0f0",
            color: filter === "read" ? "white" : "#333",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Leídas ({notifications.length - unreadCount})
        </button>
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
          <Bell size={64} color="#ccc" style={{ margin: "0 auto 1rem" }} />
          <h3 style={{ color: "#999" }}>
            {filter === "all"
              ? "No tienes notificaciones"
              : filter === "unread"
              ? "No tienes notificaciones sin leer"
              : "No tienes notificaciones leídas"}
          </h3>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className="card"
              style={{
                backgroundColor: notification.is_read ? "#fafafa" : "white",
                borderLeft: `4px solid ${getPriorityColor(
                  notification.priority
                )}`,
                position: "relative",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  alignItems: "flex-start",
                }}
              >
                {/* Icon */}
                <div style={{ flexShrink: 0, marginTop: "0.25rem" }}>
                  {getIcon(notification.type)}
                </div>

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <h3
                    style={{
                      margin: "0 0 0.5rem 0",
                      fontSize: "18px",
                      fontWeight: notification.is_read ? "normal" : "bold",
                    }}
                  >
                    {notification.title}
                  </h3>
                  <p style={{ margin: "0 0 0.5rem 0", color: "#666" }}>
                    {notification.message}
                  </p>
                  <p style={{ margin: 0, fontSize: "12px", color: "#999" }}>
                    {new Date(notification.created_at).toLocaleString("es-ES", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </div>

                {/* Actions */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                    flexShrink: 0,
                  }}
                >
                  {!notification.is_read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      style={{
                        padding: "0.5rem",
                        backgroundColor: "#4caf50",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      title="Marcar como leída"
                    >
                      <CheckCircle size={18} />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notification.id)}
                    style={{
                      padding: "0.5rem",
                      backgroundColor: "#f44336",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    title="Eliminar"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info Card */}
      <div
        className="card"
        style={{ marginTop: "2rem", backgroundColor: "#e3f2fd" }}
      >
        <h3 className="card-title" style={{ color: "#1976d2" }}>
          <Info size={24} />
          Sobre las Notificaciones
        </h3>
        <ul style={{ margin: 0, paddingLeft: "1.5rem", color: "#1976d2" }}>
          <li>
            Las alertas de presupuesto se verifican cuando gastas más del 80% en
            una categoría
          </li>
          <li>
            Los recordatorios de metas te avisan cuando estás cerca de
            completarlas o si hay fechas límite cercanas
          </li>
          <li>
            Recibirás notificaciones automáticas cuando desbloquees logros en el
            sistema de gamificación
          </li>
          <li>
            Puedes verificar manualmente las alertas usando los botones de
            arriba
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Notifications;
