import { motion, AnimatePresence } from 'framer-motion'
import { Fingerprint, Sparkles, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'

export interface IdentityInfo {
  id_identidad: number
  nombre_identidad: string
  nivel_identidad: number
  xp_actual_identidad: number
  momentum?: number
}

interface IdentityStatusWidgetProps {
  identities: IdentityInfo[] | null
  momentum: number
}

export function IdentityStatusWidget({ identities, momentum }: IdentityStatusWidgetProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Rotación automática entre identidades cada 5 segundos
  useEffect(() => {
    if (!identities || identities.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex === identities.length - 1 ? 0 : prevIndex + 1))
    }, 5000)

    return () => clearInterval(interval)
  }, [identities])

  if (!identities || identities.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto rounded-3xl border border-dashed border-white/10 bg-surface-container-lowest/40 p-4 flex items-center justify-center gap-3 backdrop-blur-md shadow-xl text-on-surface-variant/60">
        <Sparkles size={16} className="text-primary animate-pulse" />
        <span className="font-sans text-xs font-semibold">
          Forja una identidad en la pestaña de Hábitos para visualizar tu evolución
        </span>
      </div>
    )
  }

  const currentIdentity = identities[currentIndex]
  // Calcular XP requerida para el siguiente nivel con la fórmula exponencial: 100 * (1.12 ^ nivel)
  const xpNeeded = Math.round(100 * Math.pow(1.12, currentIdentity.nivel_identidad))
  const progressPercentage = Math.min((currentIdentity.xp_actual_identidad / xpNeeded) * 100, 100)

  // Mapeamos un subtítulo representativo basado en el nivel
  const getSubLabel = (level: number) => {
    if (level < 5) return 'Iniciante'
    if (level < 10) return 'Enfoque'
    if (level < 20) return 'Constancia'
    if (level < 40) return 'Maestría'
    return 'Sabiduría Trascendente'
  }

  return (
    <div className="w-full max-w-2xl mx-auto relative group">
      {/* Contenedor Principal Glassmorphic */}
      <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-surface-container-low/75 p-4.5 shadow-[0_24px_50px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.03)] backdrop-blur-xl flex items-center justify-between gap-5 select-none transition-all duration-300 hover:border-white/10">
        {/* Glow de Fondo */}
        <div className="absolute -left-12 -top-12 -z-10 size-32 rounded-full bg-primary/5 blur-[40px] pointer-events-none" />

        {/* Sección Izquierda: Identidad e Icono */}
        <div className="flex items-center gap-4.5 min-w-0">
          <div className="size-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 shadow-inner">
            <Fingerprint size={22} className="stroke-[1.8]" />
          </div>
          <div className="min-w-0 text-left">
            <span className="font-bold uppercase tracking-wider text-on-surface-variant/40 text-[9px] block">
              Identidad
            </span>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIdentity.id_identidad}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="font-sans text-base font-extrabold text-on-surface leading-tight truncate">
                  {currentIdentity.nombre_identidad}
                </h3>
                <span className="font-sans text-[11px] font-bold text-primary/80">
                  Nivel {currentIdentity.nivel_identidad} - {getSubLabel(currentIdentity.nivel_identidad)}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Sección Central: Barra de XP */}
        <div className="flex-1 hidden md:block max-w-[200px] lg:max-w-xs text-left">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIdentity.id_identidad}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-full flex items-center justify-between font-label text-[10px] text-on-surface-variant/50 font-bold mb-1.5">
                <span>Progreso</span>
                <span>
                  {Math.round(currentIdentity.xp_actual_identidad)} / {xpNeeded} XP
                </span>
              </div>
              <div className="h-2 rounded-full bg-white/5 p-0.5 overflow-hidden border border-white/5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary/80 to-primary shadow-[0_0_8px_rgba(247,187,126,0.2)] transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Separador vertical */}
        <div className="h-9 w-px bg-white/5 hidden sm:block" />

        {/* Sección Derecha: Momentum de la Identidad */}
        <div className="flex items-center gap-3 text-left shrink-0">
          <div className="size-9 rounded-xl bg-secondary/15 border border-secondary/20 flex items-center justify-center text-secondary shadow-[0_0_12px_rgba(172,206,191,0.08)]">
            <Zap size={16} fill="currentColor" className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-baseline gap-1 leading-none min-w-[90px]">
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentIdentity.id_identidad}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="font-sans text-lg font-black text-on-surface inline-block"
                >
                  {Math.round(currentIdentity.momentum ?? momentum)}%
                </motion.span>
              </AnimatePresence>
              <span className="font-bold text-[8px] tracking-wider text-secondary uppercase self-center ml-1">
                Momentum
              </span>
            </div>
            <span className="font-sans text-[9px] text-on-surface-variant/45 block mt-0.5 font-bold">
              Rendimiento general
            </span>
          </div>
        </div>


      </div>
    </div>
  )
}
