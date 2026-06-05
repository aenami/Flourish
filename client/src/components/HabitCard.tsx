import { AnimatePresence, motion } from 'framer-motion'
import {
  Activity,
  AlertTriangle,
  Apple,
  BookOpen,
  Brain,
  Briefcase,
  CheckCircle,
  ChevronDown,
  Coffee,
  Compass,
  Dumbbell,
  Flame,
  Gamepad2,
  GlassWater,
  GraduationCap,
  Heart,
  Moon,
  MoreVertical,
  Music,
  PenTool,
  Smartphone,
  Sparkles,
  Timer,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { getSpritePath, getElementDetails } from '#/utils/elementRegistry'

import { checkHabit, relapseHabit } from '#/services/habitsService'

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
    icono?: string
  }
  dias_semana: number[]
  identidad?: string | null
  dias_completados?: number[]
  dias_recaidos?: number[]
  elemento?: {
    nombre_elemento: string
    fase_elemento: number
    xp_fase_actual_elemento: number
  } | null
}

interface HabitCardProps {
  habit: HabitData
}

export function HabitCard({ habit }: HabitCardProps) {
  // Obtener el día actual (Lunes = 1, Domingo = 7)
  const todayIndex = new Date().getDay()
  const todayValue = todayIndex === 0 ? 7 : todayIndex

  const [isOpen, setIsOpen] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Estados locales para la interacción de Check y Recaída en tiempo real
  const [isCheckedToday, setIsCheckedToday] = useState(() => habit.dias_completados?.includes(todayValue) || false)
  const [isRelapsedToday, setIsRelapsedToday] = useState(() => habit.dias_recaidos?.includes(todayValue) || false)
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



  // Filtrar los días para mostrar ÚNICAMENTE los que el usuario definió
  const activeDays = daysOfWeek.filter((day) => habit.dias_semana.includes(day.value))

  // Obtener la clase de color según el tipo de icono y hábito
  const getIconColorClass = (iconName: string) => {
    if (!isPositive) return 'text-error'
    
    const secondaryIcons = ['BookOpen', 'GraduationCap', 'PenTool', 'Briefcase']
    const primaryIcons = ['Dumbbell', 'Activity', 'Flame', 'Timer', 'Compass']
    const tertiaryIcons = ['Sparkles', 'Brain', 'Heart', 'Moon', 'Coffee', 'GlassWater', 'Music']
    
    if (secondaryIcons.includes(iconName)) return 'text-secondary'
    if (primaryIcons.includes(iconName)) return 'text-primary'
    if (tertiaryIcons.includes(iconName)) return 'text-tertiary'
    return 'text-secondary' // default positive
  }

  // Elegir icono por nombre de hábito de forma inteligente o recuperarlo de base de datos
  const getIcon = () => {
    // 1. Intentar cargar el icono guardado en el sistema del hábito
    const savedIconName = habit.sistema_habito.icono

    const iconMap: Record<string, React.ComponentType<{ className?: string; size?: number }> | undefined> = {
      BookOpen,
      Dumbbell,
      Sparkles,
      Smartphone,
      Gamepad2,
      CheckCircle,
      Heart,
      Brain,
      Apple,
      Flame,
      Coffee,
      GlassWater,
      Moon,
      Activity,
      Timer,
      GraduationCap,
      Compass,
      PenTool,
      Music,
      Briefcase,
    }

    if (savedIconName && iconMap[savedIconName]) {
      const IconComponent = iconMap[savedIconName]
      return <IconComponent className={getIconColorClass(savedIconName)} size={20} />
    }

    // 2. Fallback de selección inteligente por nombre (retrocompatibilidad)
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
    return <CheckCircle className={isPositive ? 'text-secondary' : 'text-error'} size={20} />
  }

  // Clases dinámicas del contenedor de iconos según el tipo de hábito
  const iconContainerClass = isPositive
    ? 'bg-secondary/10 shadow-[0_0_15px_rgba(172,206,191,0.06)]'
    : 'bg-error/10 shadow-[0_0_15px_rgba(255,180,171,0.06)]'

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-surface-container-low/90 p-5 shadow-[0_8px_32px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.02)] transition-colors duration-200 hover:border-white/10 hover:bg-surface-container/95">
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
            const isCompleted = habit.dias_completados?.includes(day.value) || (isToday && isCheckedToday)
            const isRelapsed = habit.dias_recaidos?.includes(day.value) || (isToday && isRelapsedToday)

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
                  ? 'bg-gradient-to-r from-secondary/80 to-secondary shadow-[0_0_10px_rgba(172,206,191,0.25)]'
                  : 'bg-gradient-to-r from-error/80 to-error shadow-[0_0_10px_rgba(255,180,171,0.25)]'
              }`}
              style={{ width: `${Math.max(currentMomentum, 2)}%` }}
            />
          </div>
        </div>

        {/* Botón de Acción */}
        {isPositive ? (
          <button
            onClick={async () => {
              if (!isCheckedToday) {
                try {
                  const res = await checkHabit(habit.id_habito)
                  if (!res.error) {
                    setIsCheckedToday(true)
                    setCurrentMomentum(res.data.momentum_habito)
                  }
                } catch (err) {
                  alert(err instanceof Error ? err.message : 'Error al registrar el check')
                }
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
            onClick={async () => {
              if (!isRelapsedToday) {
                try {
                  const res = await relapseHabit(habit.id_habito)
                  if (!res.error) {
                    setIsRelapsedToday(true)
                    setCurrentMomentum(res.data.momentum_habito)
                  }
                } catch (err) {
                  alert(err instanceof Error ? err.message : 'Error al registrar la recaída')
                }
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
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{ willChange: 'height, opacity' }}
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
              {habit.elemento && (() => {
                const sprite = getSpritePath(habit.elemento.nombre_elemento, habit.elemento.fase_elemento);
                const details = getElementDetails(habit.elemento.nombre_elemento, habit.elemento.fase_elemento);
                const IconComponent = details.icon;
                const phaseInfo = details.phases[habit.elemento.fase_elemento - 1] || { name: 'Objeto en evolución' };
                const xpNeeded = habit.elemento.fase_elemento === 1 ? 100 : habit.elemento.fase_elemento === 2 ? 200 : 400;
                
                return (
                  <div className="col-span-2 border-t border-white/5 pt-4 mt-1 flex flex-col sm:flex-row gap-4 items-center">
                    {/* Vista previa isométrica */}
                    <div className="size-24 rounded-2xl bg-gradient-to-br from-[#1c1e20] to-[#0a0c0d] border border-white/5 flex items-center justify-center relative overflow-hidden shrink-0 shadow-inner">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.035)_0%,transparent_70%)]" />
                      {sprite ? (
                        <img
                          src={sprite}
                          alt="Evolución visual del elemento"
                          className="size-20 object-contain relative z-10"
                        />
                      ) : (
                        <div className="relative z-10 text-on-surface-variant/40 flex flex-col items-center">
                          <IconComponent size={28} className={details.iconColor} />
                        </div>
                      )}
                    </div>

                    {/* Detalles de Progresión */}
                    <div className="flex-1 w-full text-left">
                      <span className="font-bold uppercase tracking-wider text-on-surface-variant/50 text-[9px] block">
                        Evolución Visual del Elemento
                      </span>
                      <h4 className="mt-1 font-sans text-sm font-bold text-on-surface">
                        {habit.elemento.nombre_elemento}
                      </h4>
                      <p className="font-sans text-xs text-on-surface-variant/75 mt-0.5 font-medium">
                        Fase {habit.elemento.fase_elemento}: {phaseInfo.name}
                      </p>

                      {/* Barra de progreso de fase */}
                      {habit.elemento.fase_elemento < 4 ? (
                        <div className="mt-3">
                          <div className="flex items-center justify-between font-label text-[10px] text-on-surface-variant/50 font-bold">
                            <span>XP de Fase</span>
                            <span>
                              {habit.elemento.xp_fase_actual_elemento} / {xpNeeded} XP
                            </span>
                          </div>
                          <div className="mt-1 h-1.5 rounded-full bg-white/5 p-0.5 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-primary/80 to-primary shadow-[0_0_8px_rgba(247,187,126,0.15)] transition-all duration-500"
                              style={{
                                width: `${(habit.elemento.xp_fase_actual_elemento / xpNeeded) * 100}%`
                              }}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="mt-3 inline-flex items-center gap-1.5 bg-primary/10 border border-primary/20 rounded-lg px-2.5 py-1 text-primary font-label text-[10px] font-bold">
                          <Sparkles size={11} />
                          <span>Fase Máxima Alcanzada</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
