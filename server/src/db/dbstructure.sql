-- ============================================================
-- FLOURISH — Schema de base de datos
-- ============================================================

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE tipo_habito AS ENUM ('POSITIVO', 'NEGATIVO');
CREATE TYPE ciclo_habitacion AS ENUM ('DIA', 'NOCHE', 'AMANECER');
CREATE TYPE clima_habitacion AS ENUM ('SOLEADO', 'LLUVIOSO', 'NUBLADO');

-- ============================================================
-- USUARIO
-- ============================================================

CREATE TABLE Usuario (
    id_usuario        SERIAL PRIMARY KEY,
    nombre_usuario    VARCHAR(50)  NOT NULL,
    email_usuario     VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(300) NOT NULL,
    fecha_creacion    DATE         NOT NULL DEFAULT CURRENT_DATE
);

-- ============================================================
-- HABITACION
-- ============================================================

CREATE TABLE Habitacion (
    id_habitacion     SERIAL PRIMARY KEY,
    momentum_general  DOUBLE PRECISION NOT NULL DEFAULT 0,
    ciclo_actual      ciclo_habitacion NOT NULL DEFAULT 'DIA',
    clima_actual      clima_habitacion NOT NULL DEFAULT 'SOLEADO',
    id_usuario_habitacion INT NOT NULL UNIQUE,

    CONSTRAINT fk_habitacion_usuario
        FOREIGN KEY (id_usuario_habitacion)
        REFERENCES Usuario (id_usuario)
        ON DELETE CASCADE
);

-- ============================================================
-- IDENTIDAD
-- ============================================================

CREATE TABLE Identidad (
    id_identidad        SERIAL PRIMARY KEY,
    nombre_identidad    VARCHAR(50)      NOT NULL,
    nivel_identidad     INT              NOT NULL DEFAULT 1,
    xp_actual_identidad DOUBLE PRECISION NOT NULL DEFAULT 0,
    id_usuario_identidad INT             NOT NULL,

    CONSTRAINT fk_identidad_usuario
        FOREIGN KEY (id_usuario_identidad)
        REFERENCES Usuario (id_usuario)
        ON DELETE CASCADE
);

-- ============================================================
-- HABITO
-- ============================================================

CREATE TABLE Habito (
    id_habito           SERIAL PRIMARY KEY,
    nombre_habito       VARCHAR(50)      NOT NULL,
    tipo_habito         tipo_habito      NOT NULL,
    momentum_habito     DOUBLE PRECISION NOT NULL DEFAULT 0,
    xp_total_habito     DOUBLE PRECISION NOT NULL DEFAULT 0,
    sistema_habito      JSONB            NOT NULL,
    dias_semana         INT[]            NOT NULL DEFAULT '{}',
    id_usuario_habito   INT              NOT NULL,

    CONSTRAINT fk_habito_usuario
        FOREIGN KEY (id_usuario_habito)
        REFERENCES Usuario (id_usuario)
        ON DELETE CASCADE
);

-- ============================================================
-- ELEMENTO
-- ============================================================

CREATE TABLE Elemento (
    id_elemento          SERIAL PRIMARY KEY,
    nombre_elemento      VARCHAR(50)      NOT NULL,
    fase_elemento        INT              NOT NULL DEFAULT 1,
    grid_col             INT              NOT NULL,
    grid_fila            INT              NOT NULL,
    xp_fase_actual_elemento DOUBLE PRECISION NOT NULL DEFAULT 0,
    id_habito_elemento   INT              NOT NULL UNIQUE,

    CONSTRAINT fk_elemento_habito
        FOREIGN KEY (id_habito_elemento)
        REFERENCES Habito (id_habito)
        ON DELETE CASCADE
);

-- ============================================================
-- HABITO_IDENTIDAD (tabla pivote N:M)
-- ============================================================

CREATE TABLE Habito_Identidad (
    id_habit_identidad      SERIAL PRIMARY KEY,
    id_identidad            INT NOT NULL,
    id_habito               INT NOT NULL,

    CONSTRAINT fk_habitoidentidad_identidad
        FOREIGN KEY (id_identidad)
        REFERENCES Identidad (id_identidad)
        ON DELETE CASCADE,

    CONSTRAINT fk_habitoidentidad_habito
        FOREIGN KEY (id_habito)
        REFERENCES Habito (id_habito)
        ON DELETE CASCADE,

    -- Evita duplicados en la relación
    CONSTRAINT uq_habito_identidad UNIQUE (id_identidad, id_habito)
);

-- ============================================================
-- REGISTRO DIARIO
-- ============================================================

CREATE TABLE RegistroDiario (
    id_registro         SERIAL PRIMARY KEY,
    check_realizado     BOOLEAN          NOT NULL,
    fecha               DATE             NOT NULL DEFAULT CURRENT_DATE,
    xp_registro         DOUBLE PRECISION NOT NULL DEFAULT 0,
    momentum_instante   DOUBLE PRECISION NOT NULL DEFAULT 0,
    id_habito           INT              NOT NULL,

    CONSTRAINT fk_registro_habito
        FOREIGN KEY (id_habito)
        REFERENCES Habito (id_habito)
        ON DELETE CASCADE,

    -- Un hábito solo puede tener un registro por día
    CONSTRAINT uq_registro_habito_fecha UNIQUE (id_habito, fecha)
);

-- ============================================================
-- ÍNDICES
-- ============================================================

-- Consultas frecuentes: hábitos de un usuario
CREATE INDEX idx_habito_usuario ON Habito (id_usuario_habito);

-- Consultas frecuentes: registros de un hábito
CREATE INDEX idx_registro_habito ON RegistroDiario (id_habito);

-- Consultas frecuentes: registros por fecha
CREATE INDEX idx_registro_fecha ON RegistroDiario (fecha);

-- Identidades de un usuario
CREATE INDEX idx_identidad_usuario ON Identidad (id_usuario_identidad);