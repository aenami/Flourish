-- CreateEnum
CREATE TYPE "ciclo_habitacion" AS ENUM ('DIA', 'NOCHE', 'AMANECER');

-- CreateEnum
CREATE TYPE "tipo_habito" AS ENUM ('POSITIVO', 'NEGATIVO');

-- CreateEnum
CREATE TYPE "clima_habitacion" AS ENUM ('SOLEADO', 'LLUVIOSO', 'NUBLADO');

-- CreateTable
CREATE TABLE "Usuario" (
    "id_usuario" SERIAL NOT NULL,
    "nombre_usuario" TEXT NOT NULL,
    "email_usuario" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "fecha_creacion_usuario" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "Habitacion" (
    "id_habitacion" SERIAL NOT NULL,
    "momentum_general_habitacion" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "ciclo_actual_habitacion" "ciclo_habitacion" NOT NULL DEFAULT 'DIA',
    "clima_actual_habitacion" "clima_habitacion" NOT NULL DEFAULT 'SOLEADO',
    "id_usuario_habitacion" INTEGER NOT NULL,

    CONSTRAINT "Habitacion_pkey" PRIMARY KEY ("id_habitacion")
);

-- CreateTable
CREATE TABLE "Identidad" (
    "id_identidad" SERIAL NOT NULL,
    "nombre_identidad" TEXT NOT NULL,
    "nivel_identidad" INTEGER NOT NULL DEFAULT 1,
    "xp_actual_identidad" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "id_usuario_identidad" INTEGER NOT NULL,

    CONSTRAINT "Identidad_pkey" PRIMARY KEY ("id_identidad")
);

-- CreateTable
CREATE TABLE "Habito" (
    "id_habito" SERIAL NOT NULL,
    "nombre_habito" TEXT NOT NULL,
    "tipo_habito" "tipo_habito" NOT NULL,
    "momentum_habito" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "xp_total_habito" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "sistema_habito" JSONB NOT NULL,
    "dias_semana" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "id_usuario_habito" INTEGER NOT NULL,

    CONSTRAINT "Habito_pkey" PRIMARY KEY ("id_habito")
);

-- CreateTable
CREATE TABLE "Elemento" (
    "id_elemento" SERIAL NOT NULL,
    "nombre_elemento" TEXT NOT NULL,
    "fase_elemento" INTEGER NOT NULL DEFAULT 0,
    "grid_col" INTEGER,
    "grid_fila" INTEGER,
    "xp_fase_actual_elemento" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "id_habito_elemento" INTEGER NOT NULL,

    CONSTRAINT "Elemento_pkey" PRIMARY KEY ("id_elemento")
);

-- CreateTable
CREATE TABLE "HabitoIdentidad" (
    "id_habitoIdentidad" SERIAL NOT NULL,
    "id_identidad_habitoIdentidad" INTEGER NOT NULL,
    "id_habito_habitoIdentidad" INTEGER NOT NULL,

    CONSTRAINT "HabitoIdentidad_pkey" PRIMARY KEY ("id_habitoIdentidad")
);

-- CreateTable
CREATE TABLE "RegistroDiario" (
    "id_registro" SERIAL NOT NULL,
    "check_realizado_registro" BOOLEAN NOT NULL,
    "fecha_registro" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "xp_registro" DOUBLE PRECISION NOT NULL,
    "momentum_instante_registro" DOUBLE PRECISION NOT NULL,
    "id_habito_registro" INTEGER NOT NULL,

    CONSTRAINT "RegistroDiario_pkey" PRIMARY KEY ("id_registro")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_usuario_key" ON "Usuario"("email_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "Habitacion_id_usuario_habitacion_key" ON "Habitacion"("id_usuario_habitacion");

-- CreateIndex
CREATE INDEX "Identidad_id_usuario_identidad_idx" ON "Identidad"("id_usuario_identidad");

-- CreateIndex
CREATE INDEX "Habito_id_usuario_habito_idx" ON "Habito"("id_usuario_habito");

-- CreateIndex
CREATE UNIQUE INDEX "Elemento_id_habito_elemento_key" ON "Elemento"("id_habito_elemento");

-- CreateIndex
CREATE INDEX "RegistroDiario_id_habito_registro_idx" ON "RegistroDiario"("id_habito_registro");

-- CreateIndex
CREATE INDEX "RegistroDiario_fecha_registro_idx" ON "RegistroDiario"("fecha_registro");

-- AddForeignKey
ALTER TABLE "Habitacion" ADD CONSTRAINT "Habitacion_id_usuario_habitacion_fkey" FOREIGN KEY ("id_usuario_habitacion") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Identidad" ADD CONSTRAINT "Identidad_id_usuario_identidad_fkey" FOREIGN KEY ("id_usuario_identidad") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Habito" ADD CONSTRAINT "Habito_id_usuario_habito_fkey" FOREIGN KEY ("id_usuario_habito") REFERENCES "Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Elemento" ADD CONSTRAINT "Elemento_id_habito_elemento_fkey" FOREIGN KEY ("id_habito_elemento") REFERENCES "Habito"("id_habito") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HabitoIdentidad" ADD CONSTRAINT "HabitoIdentidad_id_identidad_habitoIdentidad_fkey" FOREIGN KEY ("id_identidad_habitoIdentidad") REFERENCES "Identidad"("id_identidad") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HabitoIdentidad" ADD CONSTRAINT "HabitoIdentidad_id_habito_habitoIdentidad_fkey" FOREIGN KEY ("id_habito_habitoIdentidad") REFERENCES "Habito"("id_habito") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegistroDiario" ADD CONSTRAINT "RegistroDiario_id_habito_registro_fkey" FOREIGN KEY ("id_habito_registro") REFERENCES "Habito"("id_habito") ON DELETE RESTRICT ON UPDATE CASCADE;
