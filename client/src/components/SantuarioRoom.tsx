import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { getSpritePath, getElementDetails } from '#/utils/elementRegistry'

export interface ElementRoomData {
  id_elemento: number
  nombre_elemento: string
  fase_elemento: number
  grid_col: number | null
  grid_fila: number | null
  xp_fase_actual_elemento: number
  id_habito_elemento: number
  habito?: {
    nombre_habito: string
    tipo_habito: 'POSITIVO' | 'NEGATIVO'
  }
}

interface SantuarioRoomProps {
  elements: ElementRoomData[] | null
  isEditMode: boolean
  onMoveElement: (idElemento: number, col: number | null, fila: number | null) => void
  selectedElementId: number | null
  onSelectElement: (idElemento: number | null) => void
}

export function SantuarioRoom({
  elements,
  isEditMode,
  onMoveElement,
  selectedElementId,
  onSelectElement,
}: SantuarioRoomProps) {

  // Configuración de la rejilla (5x5)
  const gridSize = 5

  // Mapeo isométrico a porcentajes
  const mapGridToIsometric = (col: number, fila: number) => {
    // Coordenadas base calibradas con el fondo habitacion.png (1324x1188 uncropped)
    const baseX = 47 // Centro X (en %)
    const baseY = 25.8 // Altura Y inicial (en %)
    const stepX = 7.4 // Desplazamiento horizontal (en %)
    const stepY = 3.7 // Desplazamiento vertical (en %)

    return {
      left: `${baseX + (col - fila) * stepX}%`,
      top: `${baseY + (col + fila) * stepY}%`,
    }
  }

  // Helper para color del halo de edición / glow
  const getGlowColor = (nombre: string) => {
    const details = getElementDetails(nombre, 1)
    if (details.key === 'libro') return 'shadow-[0_0_20px_rgba(172,206,191,0.4)] border-[#accebf]/30'
    if (details.key === 'mancuerna') return 'shadow-[0_0_20px_rgba(235,194,70,0.4)] border-[#ebc246]/30'
    return 'shadow-[0_0_20px_rgba(247,187,126,0.4)] border-primary/30'
  }

  // Generamos todos los puntos posibles de la rejilla para el modo edición
  const gridCells = []
  for (let c = 1; c <= gridSize; c++) {
    for (let f = 1; f <= gridSize; f++) {
      gridCells.push({ col: c, fila: f })
    }
  }

  return (
    <div className="relative w-full max-w-3xl mx-auto bg-transparent">
      {/* 1. Habitación Base */}
      <div className="relative w-full aspect-[1324/1188] select-none pointer-events-none">
        <img
          src="/assets/habitacion/habitacion.png"
          alt="Santuario Visual Base"
          className="w-full h-full object-cover"
        />
      </div>

      {/* 4. Blueprint Grid Overlay (Solo en Modo Edición) */}
      <AnimatePresence>
        {isEditMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 pointer-events-auto"
          >
            {/* Dibujar celdas del grid */}
            {gridCells.map(({ col, fila }) => {
              const pos = mapGridToIsometric(col, fila)
              const isOccupied = elements?.some(
                (e) => e.grid_col === col && e.grid_fila === fila && e.id_elemento !== selectedElementId
              )

              return (
                <button
                  key={`cell-${col}-${fila}`}
                  onClick={() => {
                    if (selectedElementId && !isOccupied) {
                      onMoveElement(selectedElementId, col, fila)
                      onSelectElement(null) // Deseleccionar tras mover
                    }
                  }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 size-6 rounded-full border border-dashed transition duration-200 cursor-pointer flex items-center justify-center ${
                    selectedElementId
                      ? isOccupied
                        ? 'bg-error/15 border-error/40 cursor-not-allowed'
                        : 'bg-primary/20 border-primary/60 hover:scale-125 hover:bg-primary/40'
                      : 'bg-white/5 border-white/10 hover:border-white/30'
                  }`}
                  style={{ left: pos.left, top: pos.top }}
                  title={`Casilla ${col}, ${fila}`}
                >
                  <div className={`size-1.5 rounded-full ${selectedElementId && !isOccupied ? 'bg-primary animate-ping' : 'bg-white/30'}`} />
                </button>
              )}
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. Renderizado de Elementos Visuales */}
      <div className="absolute inset-0 z-25 pointer-events-auto">
        {elements?.filter(e => e.grid_col !== null && e.grid_fila !== null).map((elem) => {
          const col = elem.grid_col ?? 1
          const fila = elem.grid_fila ?? 1
          const pos = mapGridToIsometric(col, fila)
          const sprite = getSpritePath(elem.nombre_elemento, elem.fase_elemento)
          const isSelected = selectedElementId === elem.id_elemento

          return (
            <div
              key={elem.id_elemento}
              onClick={() => {
                if (isEditMode) {
                  onSelectElement(isSelected ? null : elem.id_elemento)
                }
              }}
              className={`absolute -translate-x-1/2 -translate-y-[80%] transition-all duration-500 ${
                isEditMode ? 'cursor-pointer hover:scale-105' : ''
              }`}
              style={{ left: pos.left, top: pos.top }}
            >
              {/* Contenedor Glow / Halo */}
              <div
                className={`relative p-2 rounded-2xl border transition-all duration-300 ${
                  isEditMode
                    ? isSelected
                      ? 'bg-primary/10 border-primary shadow-[0_0_25px_rgba(247,187,126,0.3)] scale-110'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                    : 'border-transparent'
                }`}
              >
                {/* Visual rendering: Sprite image vs Orbit icon */}
                {sprite ? (
                  <motion.img
                    src={sprite}
                    alt={elem.nombre_elemento}
                    animate={isEditMode ? {} : { y: [0, -3, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 3 + (elem.id_elemento % 2),
                      ease: 'easeInOut',
                    }}
                    className={`size-22 sm:size-26 object-contain filter drop-shadow-[0_10px_15px_rgba(0,0,0,0.5)] ${
                      !isEditMode ? 'hover:drop-shadow-[0_10px_20px_rgba(247,187,126,0.15)]' : ''
                    }`}
                  />
                ) : (
                  (() => {
                    const details = getElementDetails(elem.nombre_elemento, elem.fase_elemento);
                    const IconComponent = details.icon;
                    return (
                      <div className={`size-16 sm:size-20 rounded-full bg-linear-to-br from-white/2 to-white/0 border border-white/10 flex items-center justify-center backdrop-blur-sm ${getGlowColor(elem.nombre_elemento)}`}>
                        <IconComponent className={`${details.iconColor} ${details.key === 'yoga' ? 'animate-pulse' : ''}`} size={28} />
                      </div>
                    );
                  })()
                )}

                {/* Badge indicador del paso de edición */}
                {isEditMode && isSelected && (
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-primary text-on-primary font-label text-[9px] font-black px-2 py-0.5 rounded-md shadow-lg tracking-wider uppercase">
                    Seleccionado
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* 6. Indicador del Modo Edición */}
      <AnimatePresence>
        {isEditMode && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="absolute bottom-5 inset-x-5 z-40 bg-surface-container-high/90 border border-white/5 px-4 py-2.5 rounded-2xl shadow-xl backdrop-blur-md flex items-center justify-between gap-4 pointer-events-auto"
          >
            <div className="text-left">
              <h4 className="font-sans text-xs font-bold text-on-surface">Diseño del Santuario</h4>
              <p className="font-sans text-[10px] text-on-surface-variant/70 leading-normal mt-0.5">
                {selectedElementId
                  ? 'Selecciona un círculo vacío de la rejilla para reubicar este elemento.'
                  : 'Haz clic sobre un objeto de la habitación para seleccionarlo y moverlo.'}
              </p>
            </div>
            {selectedElementId && (
              <button
                onClick={() => onSelectElement(null)}
                className="bg-white/5 hover:bg-white/10 text-on-surface border border-white/10 rounded-lg px-2.5 py-1 font-sans text-[10px] font-bold transition cursor-pointer"
              >
                Deseleccionar
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
