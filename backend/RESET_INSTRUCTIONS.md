# 🔧 Instrucciones para Resetear la Base de Datos

## Opción 1: Usando pgAdmin

1. Abre pgAdmin
2. Conéctate a tu servidor PostgreSQL
3. Navega a: Databases > appfinanciera
4. Click derecho > Query Tool
5. Abre el archivo `reset_database.sql` y copia su contenido
6. Pega el contenido y ejecuta (botón ▶️ o F5)

## Opción 2: Usando la terminal (psql)

```bash
# Navega a la carpeta backend
cd backend

# Ejecuta el script SQL
psql -U postgres -d appfinanciera -f reset_database.sql

# Si te pide contraseña, es la que configuraste (probablemente: 1234)
```

## Opción 3: Conectarte manualmente

```bash
# Conéctate a PostgreSQL
psql -U postgres -d appfinanciera

# Luego copia y pega cada comando del archivo reset_database.sql uno por uno
```

## ✅ Verificación

Después de ejecutar el script, deberías ver:

```
tabla    | registros
---------+----------
Users:   |        0
Incomes: |        0
Expenses:|        0
Goals:   |        0
```

## 🚀 Después del reset

1. Inicia el servidor: `npm run dev` (desde la raíz del proyecto)
2. Ve a http://localhost:5173/register
3. Regístrate con tu nombre completo, email y contraseña
4. ¡Listo! Ahora deberías ver tu nombre en el header
