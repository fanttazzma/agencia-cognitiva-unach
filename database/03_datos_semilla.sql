-- 1. Insertar Usuarios de Prueba (Los 3 roles del sistema)
INSERT INTO usuarios (nombre_completo, correo, rol) VALUES 
('Ing. Carlos Pérez', 'docente.carlos@unach.mx', 'Docente'),
('Estudiante Prueba', 'estudiante@unach.mx', 'Estudiante'),
('Coordinación Académica', 'coordinacion@unach.mx', 'Coordinacion');

-- 2. Insertar Materia de Prueba
INSERT INTO materias (nombre_materia, semestre) VALUES 
('Ingeniería de Software Estructurada', 5);

-- 3. Crear una Cédula de Rastro Inicial (En estado 'Borrador')
-- Asumimos que Carlos (id 1) es el docente y el Estudiante (id 2) es el alumno. La materia es la id 1.
INSERT INTO cedula_rastro (id_estudiante, id_docente, id_materia, periodo_lectivo, estado) VALUES 
(2, 1, 1, 'Agosto-Diciembre 2026', 'Borrador');

-- 4. Insertar el Andamiaje Pedagógico (Lo que configuró el docente para iniciar el reto)
-- Se vincula a la cédula id 1
INSERT INTO reto_andamiaje (id_cedula, tipo_reto, descripcion_reto, andamiaje_pedagogico) VALUES 
(1, 'Reto Situado', 'Desarrollar una propuesta de sistema web para la gestión de tutorías.', 'Investigar patrones de diseño MVC. Utilizar IA solo para generación de ideas iniciales y documentar los prompts.');

-- 5. Insertar datos en la Bitácora de IA (Simulando que el alumno ya empezó a trabajar)
INSERT INTO bitacora_interacciones (id_cedula, actor, prompt_ingresado, respuesta_clave_obtenida) VALUES 
(1, 'IA Generativa', 'Explícame el patrón de diseño MVC como si fuera un estudiante de quinto semestre', 'El patrón MVC (Modelo-Vista-Controlador) divide tu aplicación en tres partes lógicas...'),
(1, 'IA Generativa', 'Dame 3 ideas de bases de datos para un sistema de tutorías', '1. PostgreSQL para relaciones robustas. 2. MongoDB para flexibilidad. 3. Firebase para tiempo real.');

-- 6. Insertar un Giro Cognitivo de prueba
INSERT INTO giro_cognitivo (id_cedula, duda_emergente, error_o_fallo, rectificacion_hallazgo) VALUES 
(1, '¿Debería usar MongoDB o PostgreSQL?', 'Iba a usar MongoDB porque la IA me lo sugirió por ser flexible, pero me di cuenta que las tutorías y alumnos son datos altamente relacionales.', 'Decidí utilizar PostgreSQL para mantener la integridad referencial de los alumnos y tutores.');