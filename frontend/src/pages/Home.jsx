import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  PiggyBank,
  TrendingUp,
  Target,
  BookOpen,
  Trophy,
  Smartphone,
} from "lucide-react";

const Home = () => {
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem" }}>
      <section
        className="hero"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          borderRadius: 16,
          padding: "3rem 2rem 2.5rem 2rem",
          textAlign: "center",
          marginBottom: "2.5rem",
          boxShadow: "0 4px 24px 0 rgba(102,126,234,0.15)",
        }}
      >
        <h1
          style={{
            fontSize: "3rem",
            fontWeight: 800,
            margin: 0,
            letterSpacing: "-1px",
          }}
        >
          FinanSmart
        </h1>
        <h2
          style={{
            fontSize: "1.7rem",
            fontWeight: 500,
            margin: "1rem 0 1.5rem 0",
            letterSpacing: "-0.5px",
          }}
        >
          Educación Financiera para Jóvenes
        </h2>
        <p
          style={{
            fontSize: "1.2rem",
            maxWidth: 600,
            margin: "0 auto 2rem auto",
            opacity: 0.95,
          }}
        >
          Aprende a manejar tu dinero de manera inteligente con nuestra app
          móvil diseñada especialmente para estudiantes.
        </p>
        <Link
          to="/login"
          className="btn btn-primary"
          style={{
            fontSize: "1.1rem",
            padding: "0.9rem 2.2rem",
            borderRadius: 30,
            fontWeight: 600,
            boxShadow: "0 2px 12px 0 rgba(102,126,234,0.15)",
            marginTop: 10,
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          Comenzar mi educación financiera
          <ArrowRight size={20} style={{ verticalAlign: "middle" }} />
        </Link>
      </section>

      <div
        className="dashboard"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
          marginBottom: "2.5rem",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "2rem",
            width: "100%",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <div
            className="card"
            style={{
              flex: 1,
              minWidth: 260,
              maxWidth: 370,
              background: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
              color: "#333",
              boxShadow: "0 2px 12px 0 rgba(253,160,133,0.10)",
            }}
          >
            <PiggyBank
              size={48}
              style={{ marginBottom: "1rem", color: "#ff9800" }}
            />
            <h3 className="card-title">Registro de Ingresos</h3>
            <p>
              Registra tus ingresos de manera personalizada: mesada, trabajos de
              medio tiempo, becas y más.
            </p>
          </div>
          <div
            className="card"
            style={{
              flex: 1,
              minWidth: 260,
              maxWidth: 370,
              background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
              color: "#333",
              boxShadow: "0 2px 12px 0 rgba(168,237,234,0.10)",
            }}
          >
            <TrendingUp
              size={48}
              style={{ marginBottom: "1rem", color: "#667eea" }}
            />
            <h3 className="card-title">Análisis Inteligente</h3>
            <p>
              IA que analiza tus hábitos de consumo y te da recomendaciones
              personalizadas para mejorar.
            </p>
          </div>
          <div
            className="card"
            style={{
              flex: 1,
              minWidth: 260,
              maxWidth: 370,
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              color: "white",
              boxShadow: "0 2px 12px 0 rgba(240,147,251,0.10)",
            }}
          >
            <Target size={48} style={{ marginBottom: "1rem", color: "#fff" }} />
            <h3 className="card-title">Retos de Ahorro</h3>
            <p>
              Desafíos gamificados que te motivan a ahorrar y crear buenos
              hábitos financieros.
            </p>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            gap: "2rem",
            width: "100%",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <div
            className="card"
            style={{
              flex: 1,
              minWidth: 260,
              maxWidth: 370,
              background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
              color: "#333",
              boxShadow: "0 2px 12px 0 rgba(67,233,123,0.10)",
            }}
          >
            <BookOpen
              size={48}
              style={{ marginBottom: "1rem", color: "#009688" }}
            />
            <h3 className="card-title">Educación Financiera</h3>
            <p>
              Módulos educativos sobre presupuesto, interés compuesto, inversión
              y finanzas personales.
            </p>
          </div>
          <div
            className="card"
            style={{
              flex: 1,
              minWidth: 260,
              maxWidth: 370,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              boxShadow: "0 2px 12px 0 rgba(102,126,234,0.10)",
            }}
          >
            <Trophy size={48} style={{ marginBottom: "1rem", color: "#fff" }} />
            <h3 className="card-title">Gamificación</h3>
            <p>
              Obtén logros, sube de nivel y compite sanamente mientras aprendes
              sobre finanzas.
            </p>
          </div>
          <div
            className="card"
            style={{
              flex: 1,
              minWidth: 260,
              maxWidth: 370,
              background: "linear-gradient(135deg, #f7971e 0%, #ffd200 100%)",
              color: "#333",
              boxShadow: "0 2px 12px 0 rgba(255,210,0,0.10)",
            }}
          >
            <Smartphone
              size={48}
              style={{ marginBottom: "1rem", color: "#fbc02d" }}
            />
            <h3 className="card-title">Diseño Móvil</h3>
            <p>
              Interfaz intuitiva y fácil de usar, diseñada especialmente para
              dispositivos móviles.
            </p>
          </div>
        </div>
      </div>

      <div
        className="card"
        style={{
          background: "linear-gradient(135deg, #fff 0%, #e3e6ff 100%)",
          color: "#333",
          boxShadow: "0 2px 16px 0 rgba(102,126,234,0.08)",
          border: "none",
          maxWidth: 1100,
          margin: "0 auto 2.5rem auto",
          padding: "2.5rem 2rem",
          borderRadius: 18,
          textAlign: "left",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-start",
          gap: "2.5rem",
        }}
      >
        <div style={{ flex: 2, minWidth: 280 }}>
          <h2
            className="card-title"
            style={{
              fontWeight: 700,
              fontSize: "2rem",
              color: "#667eea",
              marginBottom: 18,
            }}
          >
            ¿Por qué FinanSmart?
          </h2>
          <p style={{ fontSize: "1.1rem", marginBottom: 12 }}>
            En Latinoamérica y Colombia, muchos jóvenes universitarios no saben
            cómo hacer un presupuesto, qué es el interés compuesto o cómo
            desarrollar hábitos de ahorro. Esto los hace vulnerables al
            sobreendeudamiento y a vivir al límite de sus ingresos.
          </p>
          <p style={{ fontSize: "1.1rem", marginBottom: 18 }}>
            <strong>FinanSmart</strong> no es solo otra app bancaria. Es una
            herramienta educativa que te acompaña desde la adolescencia para
            formar una relación saludable con el dinero, usando tecnología
            moderna y metodologías pedagógicas probadas.
          </p>
        </div>
        <div style={{ flex: 1, minWidth: 220 }}>
          <h3
            style={{
              marginTop: "0",
              marginBottom: "1.2rem",
              color: "#333",
              fontWeight: 600,
            }}
          >
            Beneficios principales:
          </h3>
          <ul
            style={{
              fontSize: "1.08rem",
              lineHeight: 1.7,
              padding: 0,
              listStyle: "none",
            }}
          >
            <li style={{ marginBottom: 8 }}>
              📚 Educación financiera adaptada a tu edad y contexto
            </li>
            <li style={{ marginBottom: 8 }}>
              🎯 Metas de ahorro personalizadas y alcanzables
            </li>
            <li style={{ marginBottom: 8 }}>
              🤖 Recomendaciones inteligentes basadas en IA
            </li>
            <li style={{ marginBottom: 8 }}>
              🎮 Aprendizaje gamificado y divertido
            </li>
            <li style={{ marginBottom: 8 }}>
              📊 Estadísticas visuales de tu progreso financiero
            </li>
            <li style={{ marginBottom: 8 }}>
              🛡️ Herramientas para evitar el sobreendeudamiento
            </li>
          </ul>
        </div>
      </div>

      <div
        className="card"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          border: "none",
          borderRadius: 18,
          boxShadow: "0 2px 16px 0 rgba(102,126,234,0.10)",
          maxWidth: 1100,
          margin: "0 auto 2rem auto",
          padding: "2.5rem 2rem",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "2.5rem",
        }}
      >
        <div style={{ flex: 2, minWidth: 280 }}>
          <h2
            className="card-title"
            style={{ fontWeight: 700, fontSize: "2rem", marginBottom: 18 }}
          >
            Comienza tu educación financiera hoy
          </h2>
          <p style={{ fontSize: "1.15rem", marginBottom: 18 }}>
            Únete a miles de jóvenes que ya están construyendo un futuro
            financiero sólido.
            <br />
            La educación financiera temprana es la clave para la estabilidad
            económica futura.
          </p>
        </div>
        <div
          style={{
            flex: 1,
            minWidth: 220,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Link
            to="/login"
            className="btn btn-secondary"
            style={{
              fontSize: "1.1rem",
              padding: "1.1rem 2.5rem",
              borderRadius: 30,
              fontWeight: 600,
              boxShadow: "0 2px 12px 0 rgba(255,255,255,0.10)",
              marginTop: 10,
              display: "inline-block",
            }}
          >
            Crear mi cuenta gratis
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
