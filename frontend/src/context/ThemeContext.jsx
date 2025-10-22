import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const theme = {
    isDarkMode,
    colors: isDarkMode
      ? {
          // Modo Oscuro - Colores sutiles
          background: "#1a1a2e",
          cardBackground: "#16213e",
          text: "#e4e4e7",
          textSecondary: "#a1a1aa",
          border: "#27374d",
          primary: "#6366f1",
          primaryLight: "#818cf8",
          success: "#4ade80",
          successLight: "#86efac",
          warning: "#fbbf24",
          warningLight: "#fcd34d",
          danger: "#f87171",
          dangerLight: "#fca5a5",
          cardHover: "#1e2a47",
          inputBackground: "#0f1729",
          shadowLight: "rgba(0, 0, 0, 0.3)",
          shadowMedium: "rgba(0, 0, 0, 0.5)",
        }
      : {
          // Modo Claro
          background: "#f5f7fa",
          cardBackground: "#ffffff",
          text: "#1f2937",
          textSecondary: "#6b7280",
          border: "#e5e7eb",
          primary: "#667eea",
          primaryLight: "#764ba2",
          success: "#4caf50",
          successLight: "#66bb6a",
          warning: "#ff9800",
          warningLight: "#ffc107",
          danger: "#f44336",
          dangerLight: "#ef5350",
          cardHover: "#f9fafb",
          inputBackground: "#ffffff",
          shadowLight: "rgba(0, 0, 0, 0.1)",
          shadowMedium: "rgba(0, 0, 0, 0.2)",
        },
  };

  return (
    <ThemeContext.Provider value={{ ...theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
