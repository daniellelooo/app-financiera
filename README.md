# Prototipo App Financiera

## Descripción General

Aplicación web para la gestión de finanzas personales. Permite registrar ingresos, gastos, ahorros y metas, visualizar estadísticas y próximamente contará con sección educativa, recomendaciones inteligentes y gamificación.

## Tecnologías

- **Frontend:** React (Vite), Victory, lucide-react
- **Backend:** Node.js + Express
- **Base de datos:** PostgreSQL
- **Autenticación:** JWT
- **IA local:** Ollama (modelos open source como llama2)

## Estructura del Proyecto

```
prototipo-appfinanciera/
├── backend/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   └── pages/
│   ├── package.json
│   └── ...
├── README.md
└── ...
```

## Funcionalidades

- Registro y autenticación de usuarios
- Dashboard con tarjetas resumen (saldo, gastos, ahorros, logros, metas activas, lecciones completadas)
- Actividad financiera reciente (ingresos, gastos, ahorros)
- CRUD de ingresos, gastos y metas de ahorro
- Estadísticas: gráficas, resumen del mes, salud financiera
- Persistencia en PostgreSQL
- Interfaz responsiva

## Mejoras Recientes

- Dashboard y estadísticas usan datos reales
- Actividad de ahorros integrada en actividad reciente
- Tarjetas de metas activas y lecciones completadas
- Corrección de errores de JSX y limpieza de componentes
- Resumen del mes dinámico y relevante

## Pendientes / Próximos Pasos

- Sección educativa funcional (lecciones, quizzes)
- Recomendaciones inteligentes con IA
- Mejorar estética y experiencia de usuario
- Agregar logros y retos (gamificación)
- Notificaciones y alertas inteligentes
- Mejorar gestión de metas de ahorro

## IA Local con Ollama

La funcionalidad de sugerencias inteligentes usa Ollama como motor de IA local (no requiere API key ni conexión a OpenAI).

### Instalación de Ollama

1. Descarga e instala Ollama desde [https://ollama.com/download](https://ollama.com/download)
2. Abre una terminal y ejecuta:

```bash
ollama pull llama2
ollama run llama2
```

(Puedes usar otros modelos como mistral, phi, etc.) 3. Deja la terminal abierta con el modelo corriendo. 4. El backend se conectará automáticamente a `http://localhost:11434`.

### Notas

- El archivo `backend/.env` ya no debe contener claves de OpenAI ni subirse al repositorio.
- Si necesitas IA en la nube, adapta el backend para usar Gemini, OpenAI, etc.

## Instalación y Flujo de Trabajo para el Equipo

### 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPO>
```

### 2. Instalar dependencias

```bash
cd prototipo-appfinanciera/frontend
npm install
cd ../backend
npm install
```

### 3. Configurar variables de entorno

Revisar y completar los archivos `.env` necesarios en backend y frontend.

### 4. Levantar el backend

```bash
cd backend
npm run dev
# (Asegúrate de que Ollama esté corriendo en otra terminal)
```

### 5. Levantar el frontend

```bash
cd ../frontend
npm run dev
```

### 6. Flujo de trabajo para cambios

- Crea una nueva rama para tu funcionalidad o corrección:
  ```bash
  git checkout -b nombre-de-tu-rama
  ```
- Realiza tus cambios y haz commit:
  ```bash
  git add .
  git commit -m "Descripción clara del cambio"
  ```
- Sube tu rama al repositorio remoto:
  ```bash
  git push origin nombre-de-tu-rama
  ```
- Abre un Pull Request en GitHub para revisión y merge.

### 7. Mantener tu rama actualizada

Antes de subir cambios, asegúrate de actualizar tu rama con la rama principal:

```bash
git checkout main
git pull origin main
git checkout nombre-de-tu-rama
git merge main
```

---

Para dudas técnicas o de flujo de trabajo, consulta con el equipo.
