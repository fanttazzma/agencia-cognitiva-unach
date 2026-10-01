-- 1. Ficha 1: Reto y Andamiaje (Configurado por el docente)
CREATE TABLE reto_andamiaje (
    id_reto SERIAL PRIMARY KEY,
    id_cedula INT REFERENCES cedula_rastro(id_cedula) ON DELETE CASCADE,
    tipo_reto VARCHAR(100) NOT NULL,
    descripcion_reto TEXT NOT NULL,
    andamiaje_pedagogico TEXT NOT NULL
);

-- 2. Ficha 1 (Módulo 1.2): Bitácora de Interacción IA / Humanos 
-- Esta tabla permite "N" registros de prompts por cada cédula
CREATE TABLE bitacora_interacciones (
    id_interaccion SERIAL PRIMARY KEY,
    id_cedula INT REFERENCES cedula_rastro(id_cedula) ON DELETE CASCADE,
    actor VARCHAR(50) DEFAULT 'IA Generativa', -- Puede ser IA, Experto, Líder comunitario
    prompt_ingresado TEXT NOT NULL,
    respuesta_clave_obtenida TEXT NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Ficha 2 (Módulo 2.3): Documentación del Giro Cognitivo
CREATE TABLE giro_cognitivo (
    id_giro SERIAL PRIMARY KEY,
    id_cedula INT REFERENCES cedula_rastro(id_cedula) ON DELETE CASCADE,
    duda_emergente TEXT NOT NULL,
    error_o_fallo TEXT NOT NULL,
    rectificacion_hallazgo TEXT NOT NULL
);