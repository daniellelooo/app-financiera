# Prototipo App Financiera

## Descripción General

Esta es una aplicación web financiera desarrollada como prototipo para ayudar a los usuarios a gestionar sus finanzas personales. Permite registrar ingresos, gastos, ahorros, metas de ahorro, visualizar estadísticas, y próximamente contará con una sección educativa, recomendaciones inteligentes y logros/retos para motivar el aprendizaje y la mejora financiera.

## Tecnologías Utilizadas

- **Frontend:** React (Vite), Victory (gráficas), lucide-react (iconos)
- **Backend:** Node.js + Express
- **Base de datos:** PostgreSQL
- **Autenticación:** JWT (JSON Web Token)
- **Estilos:** CSS personalizado

## Estructura del Proyecto

```
prototipo-appfinanciera/
├── index.html
├── package.json
├── public/
│   └── vite.svg
├── src/
│   ├── App.css
│   ├── App.jsx
│   ├── counter.js
│   ├── javascript.svg
│   ├── main.jsx
│   ├── style.css
│   ├── components/
│   │   └── Header.jsx
│   └── pages/
│       ├── Budget.jsx
│       ├── Dashboard.jsx
│       ├── Education.jsx
│       ├── Home.jsx
│       ├── Login.jsx
│       ├── Profile.jsx
│       ├── Savings.jsx
│       └── Statistics.jsx
```

## Funcionalidades Actuales

- **Registro y autenticación de usuarios** (JWT)
- **Dashboard** con tarjetas resumen de:
  - Saldo
  - Gastos
  - Ahorros
  - Logros
  - Metas activas
  - Lecciones completadas
- **Actividad financiera reciente** (incluye ingresos, gastos y movimientos de ahorro)
- **CRUD de ingresos, gastos y metas de ahorro**
- **Estadísticas**:
  - Gráficas de gastos por categoría (VictoryPie)
  - Resumen de ingresos/gastos/ahorros (VictoryBar)
  - Resumen del mes: progreso de la meta de ahorro más avanzada, categoría top, días sin gastos extras
  - Análisis simple de salud financiera
  - Recomendaciones básicas
- **Persistencia de datos** en PostgreSQL
- **Integración frontend-backend**
- **Interfaz responsiva y moderna**

## Principales Mejoras Realizadas Recientemente

- Se migró toda la lógica de Dashboard y Estadísticas para que usen datos reales y no valores quemados.
- Se integró la actividad de ahorros en la sección de actividad reciente.
- Se agregaron tarjetas de resumen para metas activas y lecciones completadas.
- Se corrigieron errores de JSX y se limpió la estructura de los componentes.
- Se mejoró la sección "Resumen del Mes" en Estadísticas para mostrar datos relevantes y dinámicos.
- Se garantizó que toda la información mostrada provenga de la base de datos o props, evitando variables globales y datos simulados.

## Cosas Generales que Hemos Hecho

- Implementación de backend con Express y PostgreSQL.
- Autenticación segura con JWT.
- CRUD completo para ingresos, gastos y metas de ahorro.
- Refactorización del frontend para consumir datos reales.
- Visualización de estadísticas y resúmenes financieros.
- Limpieza y mejora de la estructura de los componentes React.
- Integración de iconografía y gráficas modernas.

## Lo que Falta / Próximos Pasos

- **Sección educativa funcional:** Lecciones, quizzes y recursos interactivos.
- **Recomendaciones inteligentes con IA:** Sugerencias personalizadas basadas en hábitos y datos reales.
- **Pulir el frontend:** Mejorar la estética, animaciones, y experiencia de usuario.
- **Agregar logros y retos:** Sistema de gamificación para motivar el aprendizaje y la mejora financiera.
- **Notificaciones y alertas inteligentes.**
- **Mejorar la gestión de metas de ahorro:** Visualización de progreso, edición y cierre de metas.
- **Optimización de rendimiento y seguridad.**

## Instalación y Ejecución

1. Clona el repositorio:
   ```bash
   git clone <repo-url>
   ```
2. Instala las dependencias en el frontend y backend:
   ```bash
   cd prototipo-appfinanciera/frontend
   npm install
   cd ../backend
   npm install
   ```
3. Configura las variables de entorno (ver `.env.example` en backend).
4. Inicia el backend:
   ```bash
   npm run dev
   ```
5. Inicia el frontend:
   ```bash
   cd ../frontend
   npm run dev
   ```
6. Accede a la app en `http://localhost:5173`

## Contribución

¡Las contribuciones son bienvenidas! Por favor, abre un issue o pull request para sugerencias, mejoras o reportar bugs.

## Licencia

MIT
