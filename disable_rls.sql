-- =============================================================
-- DESHABILITAR ROW-LEVEL SECURITY (RLS) EN SUPABASE
-- =============================================================
-- Esto permite que cualquier invitado pueda confirmar su asistencia
-- y dejar mensajes sin requerir inicio de sesión.

ALTER TABLE confirmaciones DISABLE ROW LEVEL SECURITY;
ALTER TABLE mensajes DISABLE ROW LEVEL SECURITY;
ALTER TABLE canciones_sugeridas DISABLE ROW LEVEL SECURITY;
ALTER TABLE fotografias DISABLE ROW LEVEL SECURITY;
ALTER TABLE configuracion_general DISABLE ROW LEVEL SECURITY;
ALTER TABLE evento DISABLE ROW LEVEL SECURITY;
ALTER TABLE enlaces DISABLE ROW LEVEL SECURITY;
ALTER TABLE regalos DISABLE ROW LEVEL SECURITY;
ALTER TABLE musica DISABLE ROW LEVEL SECURITY;
ALTER TABLE historial_cambios DISABLE ROW LEVEL SECURITY;
