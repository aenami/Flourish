import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertTriangle,
  BookOpen,
  CheckCircle,
  ChevronDown,
  Dumbbell,
  Gamepad2,
  MoreVertical,
  Smartphone,
  Sparkles,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

export interface HabitData {
  id_habito: number
  nombre_habito: string
  tipo_habito: 'POSITIVO' | 'NEGATIVO'
  momentum_habito: number
  xp_total_habito: number
  sistema_habito: {
    senal: string
    atractivo?: string
    emocion?: string
    accion: string
    recompensa?: string
    consecuencia?: string
    objetivo?: string
  }
  dias_semana: number[]
  identidad?: string | null
}

interface HabitCardProps {
  habit: HabitData
}

export function HabitCard({ habit }: HabitCardProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Estados locales para la interacción de Check y Recaída en tiempo real
  const [isCheckedToday, setIsCheckedToday] = useState(false)
  const [isRelapsedToday, setIsRelapsedToday] = useState(false)
  const [currentMomentum, setCurrentMomentum] = useState(habit.momentum_habito)

  // Cerrar el menú de tres puntos si se hace clic afuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const isPositive = habit.tipo_habito === 'POSITIVO'
  const sys = habit.sistema_habito

  // Mapear días en español
  const daysOfWeek = [
    { label: 'L', value: 1 },
    { label: 'M', value: 2 },
    { label: 'X', value: 3 },
    { label: 'J', value: 4 },
    { label: 'V', value: 5 },
    { label: 'S', value: 6 },
    { label: 'D', value: 7 },
  ]

  // Obtener el día actual (Lunes = 1, Domingo = 7)
  const todayIndex = new Date().getDay()
  const todayValue = todayIndex === 0 ? 7 : todayIndex

  // Filtrar los días para mostrar ÚNICAMENTE los que el usuario definió
  const activeDays = daysOfWeek.filter((day) => habit.dias_semana.includes(day.value))

  // Elegir icono por nombre de hábito de forma inteligente
  const getIcon = () => {
    const name = habit.nombre_habito.toLowerCase()
    if (name.includes('leer') || name.includes('lectura')) {
      return <BookOpen className="text-secondary" size={20} />
    }
    if (name.includes('ejercicio') || name.includes('entrenar') || name.includes('físico')) {
      return <Dumbbell className="text-primary" size={20} />
    }
    if (name.includes('medit') || name.includes('zen') || name.includes('respir')) {
      return <Sparkles className="text-tertiary" size={20} />
    }
    if (name.includes('redes') || name.includes('celular') || name.includes('teléfono')) {
      return <Smartphone className="text-error" size={20} />
    }
    if (name.includes('juego') || name.includes('consola') || name.includes('videojuego')) {
      return <Gamepad2 className="text-error" size={20} />
    }
    return <CheckCircle className="text-primary" size={20} />
  }

  // Clases dinámicas del contenedor de iconos según el tipo de hábito
  const iconContainerClass = isPositive
    ? 'bg-secondary/10 shadow-[0_0_15px_rgba(172,206,191,0.06)]'
    : 'bg-error/10 shadow-[0_0_15px_rgba(255,180,171,0.06)]'

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-surface-container-low/50 p-5 shadow-[0_8px_32px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.02)] backdrop-blur-xl transition hover:border-white/10 hover:bg-surface-container/60">
      {/* Encabezado de la Tarjeta */}
      <div className="flex items-start justify-between gap-3">
        {/* Contenido Principal Izquierdo */}
        <div className="flex flex-1 items-center gap-4">
          <div className={`grid size-11 place-items-center rounded-xl ${iconContainerClass}`}>
            {getIcon()}
          </div>
          <div>
            <h3 className="font-sans text-base font-bold text-on-surface leading-tight">
              {habit.nombre_habito}
            </h3>
            {isPositive ? (
              <span className="mt-1.5 inline-flex items-center rounded-md bg-white/5 px-2 py-0.5 font-sans text-xs font-semibold text-on-surface-variant">
                Identidad: {habit.identidad || 'General'}
              </span>
            ) : (
              <span className="mt-1.5 inline-flex items-center rounded-md bg-error/10 px-2 py-0.5 font-sans text-xs font-semibold text-error/95">
                {sys.objetivo || 'Evitar recaídas'}
              </span>
            )}
          </div>
        </div>

        {/* Controles de la Derecha (Chevron, Menú 3 puntos) */}
        <div className="flex items-center gap-2">
          {/* Botón Chevron para expandir/colapsar */}
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className="grid size-8 place-items-center rounded-lg text-on-surface-variant/80 transition hover:bg-white/5 hover:text-on-surface"
            aria-label="Expandir detalles"
          >
            <ChevronDown
              size={18}
              className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Menú de Tres Puntos (Context Menu) */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu((prev) => !prev)}
              className="grid size-8 place-items-center rounded-lg text-on-surface-variant/80 transition hover:bg-white/5 hover:text-on-surface"
              aria-label="Opciones de hábito"
            >
              <MoreVertical size={18} />
            </button>

            {/* Dropdown del Menú */}
            <AnimatePresence>
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -5 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-9 z-50 min-w-36 rounded-xl border border-white/5 bg-surface-container-highest p-1.5 shadow-xl backdrop-blur-xl"
                >
                  <button
                    onClick={() => {
                      alert('Ocurrirá en la siguiente fase: Editar hábito')
                      setShowMenu(false)
                    }}
                    className="w-full rounded-lg px-3 py-2 text-left font-sans text-xs font-semibold text-on-surface hover:bg-white/5 transition"
                  >
                    Editar hábito
                  </button>
                  <button
                    onClick={() => {
                      alert('Ocurrirá en la siguiente fase: Eliminar hábito')
                      setShowMenu(false)
                    }}
                    className="w-full rounded-lg px-3 py-2 text-left font-sans text-xs font-semibold text-error hover:bg-error/10 transition"
                  >
                    Eliminar hábito
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Sección Intermedia: Progreso, Días y Botón */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/5 pt-4">
        {/* Días Programados (ÚNICAMENTE LOS DEFINIDOS POR EL USUARIO) */}
        <div className="flex items-center gap-1.5">
          {activeDays.map((day) => {
            const isToday = day.value === todayValue
            const isCompleted = isToday && isCheckedToday
            const isRelapsed = isToday && isRelapsedToday

            // Clases de estilo dinámicas para el día programado
            let dayStyleClass = ''
            if (isPositive) {
              if (isCompleted) {
                // Si el día es hoy y ya se hizo check: brilla intensamente
                dayStyleClass = 'bg-secondary text-on-secondary shadow-[0_0_15px_rgba(172,206,191,0.7)] border-none'
              } else {
                // Días definidos pero no completados / días pasados/futuros programados
                dayStyleClass = 'bg-secondary/10 text-secondary border border-secondary/15 hover:bg-secondary/20'
              }
            } else {
              if (isRelapsed) {
                // Si hubo recaída hoy: brilla en rojo
                dayStyleClass = 'bg-error text-on-error shadow-[0_0_15px_rgba(255,180,171,0.7)] border-none'
              } else {
                // Hábito negativo evitado correctamente
                dayStyleClass = 'bg-error/10 text-error border border-error/15 hover:bg-error/20'
              }
            }

            return (
              <span
                key={day.label}
                className={`grid size-7 place-items-center rounded-full font-label text-[10.5px] font-bold transition duration-300 ${dayStyleClass}`}
                title={isToday ? 'Día de hoy' : 'Día programado'}
              >
                {day.label}
              </span>
            )
          })}
        </div>

        {/* Momentum & Progreso */}
        <div className="flex-1 min-w-32">
          <div className="flex items-baseline justify-between font-label text-xs">
            <span className="font-bold text-on-surface">{currentMomentum}%</span>
            <span className="font-bold tracking-wider text-on-surface-variant/60 uppercase text-[9px]">
              MOMENTUM
            </span>
          </div>
          {/* Progress bar container */}
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/4 p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isPositive
                  ? 'bg-linear-to-r from-secondary/80 to-secondary shadow-[0_0_10px_rgba(172,206,191,0.25)]'
                  : 'bg-linear-to-r from-error/80 to-error shadow-[0_0_10px_rgba(255,180,171,0.25)]'
              }`}
              style={{ width: `${Math.max(currentMomentum, 2)}%` }}
            />
          </div>
        </div>

        {/* Botón de Acción */}
        {isPositive ? (
          <button
            onClick={() => {
              if (!isCheckedToday) {
                setIsCheckedToday(true)
                setCurrentMomentum((prev) => Math.min(prev + 10, 100))
              }
            }}
            disabled={isCheckedToday}
            className={`inline-flex h-9 items-center justify-center gap-1.5 rounded-lg px-4 font-label text-xs font-bold transition duration-200 ${
              isCheckedToday
                ? 'bg-secondary/15 text-secondary border border-secondary/20 cursor-not-allowed shadow-none'
                : 'bg-primary text-on-primary shadow-[0_8px_20px_rgba(247,187,126,0.12)] hover:-translate-y-0.5 hover:bg-primary-fixed'
            }`}
          >
            <CheckCircle size={14} />
            <span>{isCheckedToday ? 'Completado' : 'Check'}</span>
          </button>
        ) : (
          <button
            onClick={() => {
              if (!isRelapsedToday) {
                setIsRelapsedToday(true)
                setCurrentMomentum((prev) => Math.max(prev - 10, 0))
              }
            }}
            disabled={isRelapsedToday}
            className={`inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border px-4 font-label text-xs font-bold transition duration-200 ${
              isRelapsedToday
                ? 'border-error/10 bg-error/5 text-error-container/40 cursor-not-allowed'
                : 'border-error/20 bg-error/5 text-error hover:bg-error/15 hover:border-error/30 hover:-translate-y-0.5'
            }`}
          >
            <AlertTriangle size={14} />
            <span>{isRelapsedToday ? 'Recaída registrada' : 'Recaída'}</span>
          </button>
        )}
      </div>

      {/* Detalle Desplegable con Motion */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="mt-5 grid grid-cols-2 gap-4 border-t border-white/5 pt-5 text-left font-sans text-xs">
              <div>
                <span className="font-bold uppercase tracking-wider text-on-surface-variant/50 text-[9px]">
                  SEÑAL
                </span>
                <p className="mt-1 font-semibold text-on-surface-variant leading-relaxed">
                  {sys.senal}
                </p>
              </div>

              <div>
                <span className="font-bold uppercase tracking-wider text-on-surface-variant/50 text-[9px]">
                  {isPositive ? 'ATRACTIVO' : 'EMOCIÓN'}
                </span>
                <p className="mt-1 font-semibold text-on-surface-variant leading-relaxed">
                  {isPositive ? sys.atractivo : sys.emocion}
                </p>
              </div>

              <div className="col-span-2 border-t border-white/5 pt-3">
                <span className="font-bold uppercase tracking-wider text-on-surface-variant/50 text-[9px]">
                  ACCIÓN
                </span>
                <p className="mt-1 font-semibold text-on-surface-variant leading-relaxed">
                  {sys.accion}
                </p>
              </div>

              <div className="col-span-2 border-t border-white/5 pt-3">
                <span className="font-bold uppercase tracking-wider text-on-surface-variant/50 text-[9px]">
                  {isPositive ? 'RECOMPENSA' : 'CONSECUENCIA'}
                </span>
                <p
                  className={`mt-1 font-bold leading-relaxed ${
                    isPositive ? 'text-primary' : 'text-error'
                  }`}
                >
                  {isPositive ? sys.recompensa : sys.consecuencia}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
