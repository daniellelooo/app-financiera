-- Script para limpiar la base de datos y empezar de cero
-- Ejecutar este script en PostgreSQL antes de probar el nuevo sistema de registro

-- Eliminar todos los datos relacionados (respetar las foreign keys)
DELETE FROM goals;
DELETE FROM expenses;
DELETE FROM incomes;
DELETE FROM users;

-- Reiniciar los contadores de IDs
ALTER SEQUENCE users_id_seq RESTART WITH 1;
ALTER SEQUENCE incomes_id_seq RESTART WITH 1;
ALTER SEQUENCE expenses_id_seq RESTART WITH 1;
ALTER SEQUENCE goals_id_seq RESTART WITH 1;

-- Verificar que las tablas estén vacías
SELECT 'Users:' as tabla, COUNT(*) as registros FROM users
UNION ALL
SELECT 'Incomes:', COUNT(*) FROM incomes
UNION ALL
SELECT 'Expenses:', COUNT(*) FROM expenses
UNION ALL
SELECT 'Goals:', COUNT(*) FROM goals;
