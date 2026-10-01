-- 1. Tipos de datos ENUM para controlar los estados y roles
CREATE TYPE rol_usuario AS ENUM ('Estudiante', 'Docente', 'Coordinacion');
CREATE TYPE estado_cedula AS ENUM ('Borrador', 'En_Revision_Etica', 'Listo_Defensa', 'Evaluado');

-- 2. Tabla de Usuarios (Agnóstica, sirve para los 3 perfiles)
CREATE TABLE usuarios (
    id_usuario SERIAL PRIMARY KEY,
    nombre_completo VARCHAR(150) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    rol rol_usuario NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabla de Materias / Unidades de Aprendizaje
CREATE TABLE materias (
    id_materia SERIAL PRIMARY KEY,
    nombre_materia VARCHAR(150) NOT NULL,
    semestre INT NOT NULL
);

-- 4. LA ENTIDAD CENTRAL: Cédula de Rastro Intelectual
CREATE TABLE cedula_rastro (
    id_cedula SERIAL PRIMARY KEY,
    id_estudiante INT REFERENCES usuarios(id_usuario),
    id_docente INT REFERENCES usuarios(id_usuario),
    id_materia INT REFERENCES materias(id_materia),
    periodo_lectivo VARCHAR(50) NOT NULL, -- Ej: "Agosto-Diciembre 2026"
    estado estado_cedula DEFAULT 'Borrador',
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
