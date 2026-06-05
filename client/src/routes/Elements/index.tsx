import { createFileRoute, Link } from '@tanstack/react-router'
import {
  AlertCircle,
  BookOpen,
  Dumbbell,
  Leaf,
  Plus,
  Sparkles,
} from 'lucide-react'
import { useEffect, useState } from 'react'

import { DashboardLayout } from '#/components/DashboardLayout'
import { api } from '#/services/Api'

export const Route = createFileRoute('/Elements/')({
  component: ElementsPage,
})

interface ElementData {
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

function ElementsPage() {
  const [elements, setElements] = useState<ElementData[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Cargar elementos del usuario al montar el componente
  useEffect(() => {
    async function fetchElements() {
      setIsLoading(true)
      setError(null)
      try {
        const response = await api.get('/elements')
        if (response && Array.isArray(response.data)) {
          setElements(response.data)
        } else {
          throw new Error('No se recibió la estructura de datos esperada')
        }
      } catch (err) {
        console.error('Error fetching elements:', err)
        setError(err instanceof Error ? err.message : 'No fue posible conectar con el servidor.')
      } finally {
        setIsLoading(false)
      }
    }
    fetchElements()
  }, [])

  // Helper para asignar los estilos, descripciones y configuraciones visuales de cada elemento
  const getElementDetails = (nombreElemento: string, fase: number) => {
    const name = nombreElemento.toLowerCase()

    if (name.includes('libro')) {
      const phases = [
        { name: 'Libro simple', desc: 'Un libro cerrado sobre una mesa oscura. El comienzo de la curiosidad.' },
        { name: 'Pequeña colección', desc: 'Tres libros apilados. Tu interés por aprender se empieza a notar.' },
        { name: 'Biblioteca organizada', desc: 'Una estantería de madera. Tu conocimiento está bien estructurado.' },
        { name: 'Espacio intelectual', desc: 'Escritorio con tintero, velas y pluma. La sabiduría guía tus días.' },
      ]
      const currentPhase = phases[fase - 1] || { name: 'Objeto en evolución', desc: 'Tu elemento se está forjando.' }

      return {
        typeLabel: 'Intelecto y Foco',
        phaseName: currentPhase.name,
        phaseDesc: currentPhase.desc,
        icon: BookOpen,
        iconColor: 'text-[#accebf]',
        iconBg: 'bg-[#1b2b24] border border-[#2e5241]/35',
        themeProgressBg: 'bg-[#accebf]',
        themeText: 'text-[#accebf]',
        glowStyle: 'shadow-[0_0_25px_rgba(172,206,191,0.05)]',
        hasSprite: true,
        spriteFolder: 'libro',
      }
    }

    if (name.includes('mancuerna')) {
      const phases = [
        { name: 'Mancuerna simple', desc: 'Una mancuerna de metal. El compromiso inicial con tu cuerpo.' },
        { name: 'Par de pesas', desc: 'Varias pesas organizadas. Tu fuerza física va en aumento.' },
        { name: 'Banco de entrenamiento', desc: 'Área de fuerza con soporte. La disciplina esculpe tu físico.' },
        { name: 'Gimnasio personal', desc: 'Espacio completo con barras y discos. El templo de la disciplina.' },
      ]
      const currentPhase = phases[fase - 1] || { name: 'Objeto en evolución', desc: 'Tu elemento se está forjando.' }

      return {
        typeLabel: 'Fuerza y Disciplina',
        phaseName: currentPhase.name,
        phaseDesc: currentPhase.desc,
        icon: Dumbbell,
        iconColor: 'text-[#ebc246]',
        iconBg: 'bg-[#332a15] border border-[#594924]/35',
        themeProgressBg: 'bg-[#ebc246]',
        themeText: 'text-[#ebc246]',
        glowStyle: 'shadow-[0_0_25px_rgba(235,194,70,0.05)]',
        hasSprite: false,
        spriteFolder: 'mancuerna',
      }
    }

    if (name.includes('yoga') || name.includes('esterilla')) {
      const phases = [
        { name: 'Esterilla enrollada', desc: 'Una esterilla en la esquina. El espacio de calma esperando ser abierto.' },
        { name: 'Esterilla abierta con incienso', desc: 'Incienso encendido. Creando la atmósfera de paz interior.' },
        { name: 'Rincón de meditación', desc: 'Cojín de zafu y plantas de bambú. Tu santuario de introspección.' },
        { name: 'Altar zen avanzado', desc: 'Campanas tibetanas, velas y luz tenue. Armonía espiritual total.' },
      ]
      const currentPhase = phases[fase - 1] || { name: 'Objeto en evolución', desc: 'Tu elemento se está forjando.' }

      return {
        typeLabel: 'Calma y Bienestar',
        phaseName: currentPhase.name,
        phaseDesc: currentPhase.desc,
        icon: Sparkles,
        iconColor: 'text-primary',
        iconBg: 'bg-[#2f271d] border border-[#4d3d2c]/35',
        themeProgressBg: 'bg-primary',
        themeText: 'text-primary',
        glowStyle: 'shadow-[0_0_25px_rgba(247,187,126,0.05)]',
        hasSprite: false,
        spriteFolder: 'yoga',
      }
    }

    // Default / Personalizado
    const defaultPhases = [
      { name: 'Objeto Fase 1', desc: 'Comienzo de un nuevo ciclo en tu habitación.' },
      { name: 'Objeto Fase 2', desc: 'Tu constancia está moldeando el entorno.' },
      { name: 'Objeto Fase 3', desc: 'La habitación refleja tu crecimiento.' },
      { name: 'Objeto Fase 4', desc: 'Representación máxima de tu consistencia.' },
    ]
    const currentPhase = defaultPhases[fase - 1] || { name: 'Objeto en evolución', desc: 'Tu elemento se está forjando.' }

    return {
      typeLabel: 'Crecimiento Personal',
      phaseName: currentPhase.name,
      phaseDesc: currentPhase.desc,
      icon: Leaf,
      iconColor: 'text-[#accebf]',
      iconBg: 'bg-white/5 border border-white/10',
      themeProgressBg: 'bg-primary',
      themeText: 'text-primary',
      glowStyle: 'shadow-[0_0_25px_rgba(255,255,255,0.02)]',
      hasSprite: false,
      spriteFolder: 'personalizado',
    }
  }

  return (
    <DashboardLayout>
      {/* Encabezado Principal */}
      <header className="flex flex-wrap items-center justify-between gap-5 border-b border-white/5 pb-6">
        <div>
          <h1 className="font-sans text-3xl font-extrabold text-on-surface tracking-tight md:text-4xl">
            Santuario Visual
          </h1>
          <p className="mt-2 font-sans text-sm font-semibold text-primary">
            Tu progreso diario moldeando tu espacio personal.
          </p>
        </div>
      </header>

      {/* Contenido Principal */}
      {isLoading ? (
        // Skeleton Loader
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="h-96 rounded-3xl bg-white/2 animate-pulse border border-white/5" />
          <div className="h-96 rounded-3xl bg-white/2 animate-pulse border border-white/5" />
          <div className="h-96 rounded-3xl bg-white/2 animate-pulse border border-white/5" />
        </div>
      ) : error ? (
        // Error State
        <div className="mt-12 flex flex-col items-center justify-center text-center p-8 rounded-2xl border border-error/20 bg-error/5 max-w-lg mx-auto">
          <AlertCircle className="text-error mb-4" size={42} />
          <h3 className="font-sans text-base font-bold text-on-surface">Error al cargar elementos</h3>
          <p className="mt-2 font-sans text-sm text-on-surface-variant leading-relaxed">
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 rounded-lg bg-surface-bright px-4 py-2 font-sans text-xs font-bold text-on-surface hover:bg-surface-container-highest transition"
          >
            Reintentar
          </button>
        </div>
      ) : !elements || elements.length === 0 ? (
        // Empty State
        <div className="mt-12 max-w-xl mx-auto text-center relative overflow-hidden rounded-2xl border border-white/5 bg-surface-container-low/40 p-8 md:p-12 shadow-2xl backdrop-blur-xl">
          <div className="absolute right-0 top-0 -z-10 size-48 rounded-full bg-primary/5 blur-[50px]" />

          <div className="mx-auto size-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(247,187,126,0.1)] animate-pulse">
            <Leaf size={28} />
          </div>

          <h2 className="font-sans text-lg font-bold text-on-surface">Tu Habitación está vacía</h2>
          <p className="mt-3 font-sans text-sm leading-relaxed text-on-surface-variant/80">
            Los elementos visuales son las manifestaciones físicas de tus hábitos. Al crear y cumplir hábitos positivos o negativos, irás desbloqueando y evolucionando objetos como libros, mancuernas y cojines de meditación para dar vida a tu espacio.
          </p>

          <Link
            to="/Habits"
            className="mt-8 border border-dashed border-white/10 rounded-2xl bg-white/1 hover:bg-white/3 hover:border-primary/30 p-6 transition flex items-center gap-4 text-left group"
          >
            <div className="grid size-11 place-items-center rounded-xl bg-white/5 text-on-surface-variant group-hover:bg-primary/20 group-hover:text-primary transition duration-200">
              <Plus size={20} strokeWidth={2.4} />
            </div>
            <div>
              <h4 className="font-sans text-sm font-bold text-on-surface group-hover:text-primary transition duration-200">
                Crear un hábito con representación visual
              </h4>
              <p className="mt-1 font-sans text-xs text-on-surface-variant/60 leading-normal">
                Define un hábito positivo de lectura o entrenamiento físico para comenzar.
              </p>
            </div>
          </Link>
        </div>
      ) : (
        // Grid de Elementos
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
          {elements.map((elem) => {
            const xpNeeded = elem.fase_elemento === 1 ? 100 : elem.fase_elemento === 2 ? 200 : 400
            const progressPercentage = elem.fase_elemento >= 4 ? 100 : Math.max((elem.xp_fase_actual_elemento / xpNeeded) * 100, 2)
            const details = getElementDetails(elem.nombre_elemento, elem.fase_elemento)
            const Icon = details.icon

            return (
              <div
                key={elem.id_elemento}
                className={`group relative overflow-hidden rounded-3xl border border-white/5 bg-[#18191b] shadow-[0_8px_32px_rgba(0,0,0,0.3)] flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:border-white/10 hover:shadow-[0_16px_40px_rgba(0,0,0,0.5)] ${details.glowStyle}`}
              >
                {/* 1. Visual Showcase Header */}
                <div className="w-full h-48 relative border-b border-white/5">
                  <div className="absolute inset-0 rounded-t-[22px] overflow-hidden">
                    {/* Dark gradient base */}
                    <div className="absolute inset-0 bg-linear-to-br from-[#1c1e20] to-[#0a0c0d]" />

                    {/* Isometric Grid Blueprint Backdrop */}
                    <div className="absolute inset-0 opacity-15">
                      <svg width="100%" height="100%">
                        <defs>
                          <pattern id="isoGridElements" width="40" height="24" patternUnits="userSpaceOnUse">
                            <path d="M0 12 L20 0 L40 12 L20 24 Z" fill="none" stroke="white" strokeWidth="0.5" />
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#isoGridElements)" />
                      </svg>
                    </div>

                    {/* Spotlight glow radial */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.035)_0%,transparent_70%)]" />

                    {/* Bottom fade-out */}
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-[#18191b] via-[#18191b]/50 to-transparent pointer-events-none z-10" />

                    {/* Render Sprite Image if available, otherwise beautiful gradient layout */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      {details.hasSprite ? (
                        <img
                          src={`/assets/elements/${details.spriteFolder}/fase_${elem.fase_elemento}.png`}
                          alt={elem.nombre_elemento}
                          className="size-36 object-contain z-10 transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="relative size-24 rounded-2xl bg-linear-to-br from-white/2 to-white/0.5 border border-white/5 flex items-center justify-center shadow-inner group">
                          <div className="absolute inset-0 bg-radial from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <Icon size={42} className={`${details.iconColor} z-10 transition-transform duration-300 group-hover:scale-110`} />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Solapping badge for phase */}
                  <div className="absolute right-4 top-4 z-20 rounded-lg bg-surface-container-highest/80 border border-white/5 px-2.5 py-1 font-sans text-[10px] font-bold text-on-surface shadow-sm backdrop-blur-md">
                    Fase {elem.fase_elemento}
                  </div>

                  {/* Icon category bottom left */}
                  <div className={`absolute left-6 -bottom-6 z-20 grid size-12 place-items-center rounded-xl backdrop-blur-md shadow-lg transition-transform duration-300 group-hover:scale-105 ${details.iconBg}`}>
                    <Icon size={20} className={details.iconColor} />
                  </div>
                </div>

                {/* 2. Card Content */}
                <div className="p-6 pt-8 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Header: Title and Type */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-sans text-xl font-bold text-on-surface tracking-tight group-hover:text-primary transition duration-200">
                          {elem.nombre_elemento}
                        </h3>
                        <p className="mt-1 font-sans text-xs font-semibold text-on-surface-variant/60">
                          {details.typeLabel}
                        </p>
                      </div>
                    </div>

                    {/* Associated Habit Info */}
                    {elem.habito && (
                      <div className="mt-4 border border-white/5 rounded-xl bg-white/1.5 p-3 text-left">
                        <span className="font-sans text-[9px] font-bold uppercase tracking-wider text-on-surface-variant/40 block">
                          HÁBITO VINCULADO
                        </span>
                        <div className="mt-1.5 flex items-center justify-between gap-2">
                          <span className="font-sans text-xs font-bold text-on-surface truncate">
                            {elem.habito.nombre_habito}
                          </span>
                          <span
                            className={`rounded-md px-1.5 py-0.5 font-sans text-[9px] font-bold uppercase ${
                              elem.habito.tipo_habito === 'POSITIVO'
                                ? 'bg-secondary/10 text-secondary'
                                : 'bg-error/10 text-error'
                            }`}
                          >
                            {elem.habito.tipo_habito === 'POSITIVO' ? 'Positivo' : 'Negativo'}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Description of current phase */}
                    <p className="mt-4 font-sans text-xs leading-relaxed text-on-surface-variant/80">
                      {details.phaseDesc}
                    </p>
                  </div>

                  {/* 3. Level Progression Bar */}
                  <div className="border-t border-white/5 pt-4 mt-6">
                    <div className="flex items-baseline justify-between font-sans text-xs">
                      <span className="font-semibold text-on-surface-variant/50">Progreso de Fase</span>
                      {elem.fase_elemento < 4 ? (
                        <span className="font-bold text-on-surface-variant/80">
                          {elem.xp_fase_actual_elemento} / {xpNeeded} XP
                        </span>
                      ) : (
                        <span className="font-bold text-primary">Fase Máxima</span>
                      )}
                    </div>
                    {/* Horizontal progression bar */}
                    <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-white/5 p-0.5">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${details.themeProgressBg} shadow-[0_0_10px_rgba(247,187,126,0.15)]`}
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Footer message */}
      <footer className="mt-12 text-center max-w-md mx-auto opacity-40 hover:opacity-60 transition duration-300 pb-8">
        <Leaf className="mx-auto size-5 text-on-surface-variant mb-2" />
        <p className="font-sans text-[11px] italic leading-relaxed text-on-surface-variant">
          "Los objetos en tu santuario son testimonios silenciosos de tu perseverancia."
        </p>
      </footer>
    </DashboardLayout>
  )
}
