import { createFileRoute } from '@tanstack/react-router'
import { AlertCircle, BookOpen, Brain, Dumbbell, Fingerprint, Plus, Sparkles, TrendingUp } from 'lucide-react'
import { useEffect, useState } from 'react'

import { DashboardLayout } from '#/components/DashboardLayout'
import { api } from '#/services/Api'

export const Route = createFileRoute('/Identities/')({
  component: IdentitiesPage,
})

interface Identidad {
  id_identidad: number
  nombre_identidad: string
  nivel_identidad: number
  xp_actual_identidad: number
  momentum: number
  racha: number
}

function IdentitiesPage() {
  const [identities, setIdentities] = useState<Identidad[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Obtener identidades al cargar la pantalla
  useEffect(() => {
    async function fetchIdentities() {
      setIsLoading(true)
      setError(null)
      try {
        const response = await api.get('/identities')
        if (response && Array.isArray(response.data)) {
          setIdentities(response.data)
        } else {
          throw new Error('No se recibió la estructura de datos esperada')
        }
      } catch (err) {
        console.error('Error fetching identities:', err)
        setError(err instanceof Error ? err.message : 'No fue posible conectar con el servidor.')
      } finally {
        setIsLoading(false)
      }
    }
    fetchIdentities()
  }, [])

  // Helper para asignar los estilos, subtítulos e iconos temáticos según el nombre de la identidad
  const getIdentityDetails = (name: string, racha: number) => {
    const lowercaseName = name.toLowerCase()
    
    if (lowercaseName.includes('lector') || lowercaseName.includes('leer') || lowercaseName.includes('lectura')) {
      return {
        subtitle: 'Sabiduría y Enfoque',
        icon: <BookOpen size={20} className="text-secondary" />,
        iconBg: 'bg-[#1b2b24] border border-[#2e5241]/35',
        themeProgressBg: 'bg-[#accebf]',
        themeCircleStroke: 'stroke-[#accebf]',
        themeText: 'text-[#accebf]',
        streakText: racha > 0 ? `Racha de ${racha} días` : 'Listo para leer',
        glowStyle: 'shadow-[0_0_20px_rgba(172,206,191,0.06)]'
      }
    }
    
    if (lowercaseName.includes('deport') || lowercaseName.includes('atleta') || lowercaseName.includes('gym') || lowercaseName.includes('ejercicio') || lowercaseName.includes('entrena')) {
      return {
        subtitle: 'Energía y Vitalidad',
        icon: <Dumbbell size={20} className="text-[#ebc246]" />,
        iconBg: 'bg-[#332a15] border border-[#594924]/35',
        themeProgressBg: 'bg-[#ebc246]',
        themeCircleStroke: 'stroke-[#ebc246]',
        themeText: 'text-[#ebc246]',
        streakText: racha > 0 ? `Racha de ${racha} días` : 'Recuperando ritmo',
        glowStyle: 'shadow-[0_0_20px_rgba(235,194,70,0.06)]'
      }
    }

    // Default / Personalizado
    return {
      subtitle: 'Disciplina y Crecimiento',
      icon: <Sparkles size={20} className="text-primary" />,
      iconBg: 'bg-[#2f271d] border border-[#4d3d2c]/35',
      themeProgressBg: 'bg-[#f7bb7e]',
      themeCircleStroke: 'stroke-[#f7bb7e]',
      themeText: 'text-[#f7bb7e]',
      streakText: racha > 0 ? `Racha de ${racha} días` : 'Forjando camino',
      glowStyle: 'shadow-[0_0_20px_rgba(247,187,126,0.06)]'
    }
  }

  return (
    <DashboardLayout>
      {/* Encabezado Principal */}
      <header className="flex flex-wrap items-center justify-between gap-5 border-b border-white/5 pb-6">
        <div>
          <h1 className="font-sans text-3xl font-extrabold text-on-surface tracking-tight md:text-4xl">
            Mis Identidades
          </h1>
          <p className="mt-2 font-sans text-sm font-semibold text-primary">
            Quién eres determina lo que logras.
          </p>
        </div>

        {/* Add Identity Button */}
        <button
          onClick={() => alert('¡Pronto! Podrás forjar nuevas identidades en la siguiente fase de desarrollo.')}
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 font-label text-sm font-bold text-on-primary shadow-[0_12px_28px_rgba(247,187,126,0.14)] transition duration-200 hover:-translate-y-0.5 hover:bg-primary-fixed"
        >
          <Plus size={18} strokeWidth={2.4} />
          <span>Forjar Identidad</span>
        </button>
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
          <h3 className="font-sans text-base font-bold text-on-surface">Error al cargar identidades</h3>
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
      ) : (!identities || identities.length === 0) ? (
        // Empty State Espectacular de Identidades
        <div className="mt-12 max-w-xl mx-auto text-center relative overflow-hidden rounded-2xl border border-white/5 bg-surface-container-low/40 p-8 md:p-12 shadow-2xl backdrop-blur-xl">
          <div className="absolute right-0 top-0 -z-10 size-48 rounded-full bg-primary/5 blur-[50px]" />
          
          <div className="mx-auto size-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(247,187,126,0.1)] animate-pulse">
            <Fingerprint size={28} />
          </div>

          <h2 className="font-sans text-lg font-bold text-on-surface">No has forjado identidades aún</h2>
          <p className="mt-3 font-sans text-sm leading-relaxed text-on-surface-variant/80">
            James Clear, en *Hábitos Atómicos*, nos enseña que el cambio de conducta más duradero es el **cambio de identidad**. Define quién quieres llegar a ser y vincula tus hábitos cotidianos a esa aspiración para guiar tu metamorfosis personal progresiva.
          </p>

          {/* Botón Card Placeholder */}
          <div 
            onClick={() => alert('¡Pronto! Podrás forjar y personalizar tus identidades en la siguiente fase de desarrollo.')}
            className="mt-8 border border-dashed border-white/10 rounded-2xl bg-white/1 hover:bg-white/3 hover:border-primary/30 p-6 transition flex items-center gap-4 text-left cursor-pointer group"
          >
            <div className="grid size-11 place-items-center rounded-xl bg-white/5 text-on-surface-variant group-hover:bg-primary/20 group-hover:text-primary transition duration-200">
              <Plus size={20} strokeWidth={2.4} />
            </div>
            <div>
              <h4 className="font-sans text-sm font-bold text-on-surface group-hover:text-primary transition duration-200">
                Añadir mi primera identidad
              </h4>
              <p className="mt-1 font-sans text-xs text-on-surface-variant/60 leading-normal">
                Comienza a definir tus arquetipos (ej. Lector, Atleta, Escritor) para potenciar tu constancia.
              </p>
            </div>
          </div>
        </div>
      ) : (
        // Grid de Identidades matching the exact design mock
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 items-stretch">
          {identities.map((identity) => {
            const xpNeeded = Math.round(100 * Math.pow(1.12, identity.nivel_identidad))
            const xpProgress = Math.min(identity.xp_actual_identidad, xpNeeded)
            const progressPercentage = Math.max((xpProgress / xpNeeded) * 100, 2)
            const details = getIdentityDetails(identity.nombre_identidad, identity.racha)

            return (
              <div 
                key={identity.id_identidad}
                className={`group relative overflow-hidden rounded-3xl border border-white/5 bg-[#18191b] shadow-[0_8px_32px_rgba(0,0,0,0.3)] flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:border-white/10 hover:shadow-[0_16px_40px_rgba(0,0,0,0.5)] ${details.glowStyle}`}
              >
                {/* 1. Imagen / Contenedor Superior (Fondo Oscuro Estilizado con Rejilla Isométrica) */}
                <div className="w-full h-44 relative border-b border-white/5">
                  {/* Contenedor interno recortado con overflow-hidden */}
                  <div className="absolute inset-0 rounded-t-[22px] overflow-hidden">
                    {/* Gradiente oscuro profundo de fondo */}
                    <div className="absolute inset-0 bg-linear-to-br from-[#1c1e20] to-[#0a0c0d]" />
                    
                    {/* Rejilla Isométrica Blueprint de fondo */}
                    <div className="absolute inset-0 opacity-15">
                      <svg width="100%" height="100%">
                        <defs>
                          <pattern id="isoGrid" width="40" height="24" patternUnits="userSpaceOnUse">
                            <path d="M0 12 L20 0 L40 12 L20 24 Z" fill="none" stroke="white" strokeWidth="0.5" />
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#isoGrid)" />
                      </svg>
                    </div>

                    {/* Foco radial de luz en el centro (Spotlight) */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.035)_0%,transparent_70%)]" />

                    {/* Gradiente de difuminación (Fade-out) en la parte inferior para fusionar suavemente la imagen con la tarjeta */}
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-[#18191b] via-[#18191b]/50 to-transparent pointer-events-none z-10" />
                  </div>

                  {/* Icono de Círculo Flotante Solapado (colocado fuera del div con overflow-hidden para evitar cortes y con z-20 alto) */}
                  <div className={`absolute left-6 -bottom-6 z-20 grid size-12 place-items-center rounded-xl backdrop-blur-md shadow-lg transition-transform duration-300 group-hover:scale-105 ${details.iconBg}`}>
                    {details.icon}
                  </div>
                </div>

                {/* 2. Cuerpo de la Tarjeta */}
                <div className="p-6 pt-8 flex-1 flex flex-col justify-between">
                  {/* Fila de Título, Subtítulo y Nivel */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-sans text-2xl font-bold text-on-surface tracking-tight group-hover:text-primary transition duration-200">
                        {identity.nombre_identidad}
                      </h3>
                      <p className="mt-1 font-sans text-xs font-semibold text-on-surface-variant/60">
                        {details.subtitle}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="font-sans text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/40">
                        Nivel
                      </span>
                      <span className="block font-label text-3xl font-extrabold text-primary-fixed-dim leading-none mt-1 shadow-sm">
                        {identity.nivel_identidad}
                      </span>
                    </div>
                  </div>

                  {/* Sección de Momentum con Indicador Circular */}
                  <div className="my-6 flex items-center gap-3.5 bg-white/1.5 border border-white/5 rounded-2xl p-3 shadow-inner">
                    <div className="relative size-9 flex items-center justify-center">
                      {/* SVG Circular Progress Ring */}
                      <svg className="size-9 -rotate-90">
                        <circle
                          cx="18"
                          cy="18"
                          r="15"
                          className="stroke-white/5 fill-none"
                          strokeWidth="3"
                        />
                        <circle
                          cx="18"
                          cy="18"
                          r="15"
                          className={`${details.themeCircleStroke} fill-none transition-all duration-500`}
                          strokeWidth="3"
                          strokeDasharray={94.2}
                          strokeDashoffset={94.2 - (94.2 * identity.momentum) / 100}
                          strokeLinecap="round"
                        />
                      </svg>
                      {/* Icono de tendencia central */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <TrendingUp size={13} className={details.themeText} />
                      </div>
                    </div>

                    <div>
                      <h4 className="font-sans text-sm font-bold text-on-surface leading-tight">
                        {identity.momentum}% Momentum
                      </h4>
                      <p className={`mt-0.5 font-sans text-[11px] font-bold ${details.themeText}`}>
                        {details.streakText}
                      </p>
                    </div>
                  </div>

                  {/* 3. Barra de Progreso XP al Pie */}
                  <div className="border-t border-white/5 pt-4">
                    <div className="flex items-baseline justify-between font-sans text-xs">
                      <span className="font-semibold text-on-surface-variant/50">XP Actual</span>
                      <span className="font-bold text-on-surface-variant/80">
                        {Math.round(xpProgress).toLocaleString()} / {xpNeeded.toLocaleString()} XP
                      </span>
                    </div>
                    {/* Barra horizontal */}
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

          {/* 4. Tarjeta placeholder "Nueva Identidad" matching the mockup */}
          <div 
            onClick={() => alert('¡Pronto! En la siguiente fase de desarrollo podrás forjar y personalizar tus identidades.')}
            className="group min-h-95 rounded-3xl border border-dashed border-white/10 hover:border-primary/30 bg-white/0.5 hover:bg-white/1.5 p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)]"
          >
            {/* Botón Circular Central con Doble Anillo */}
            <div className="size-12 rounded-full border border-white/10 bg-white/4 flex items-center justify-center text-on-surface shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition-all duration-300 group-hover:scale-105 group-hover:bg-white/8 group-hover:border-primary/30 group-hover:text-primary">
              <Plus size={20} strokeWidth={2.4} />
            </div>

            <h3 className="font-sans text-base font-bold text-on-surface mt-5 group-hover:text-primary transition-colors duration-200">
              Nueva Identidad
            </h3>
            
            <p className="mt-2 font-sans text-xs leading-relaxed text-on-surface-variant/50 max-w-50">
              Crea nuevas identidades al definir tus hábitos
            </p>
          </div>
        </div>
      )}

      {/* Frase Motivadora al Pie */}
      <footer className="mt-12 text-center max-w-md mx-auto opacity-40 hover:opacity-60 transition duration-300">
        <Brain className="mx-auto size-5 text-on-surface-variant mb-2" />
        <p className="font-sans text-[11px] italic leading-relaxed text-on-surface-variant">
          "Cada acción que realizas es un voto a favor del tipo de persona en la que deseas convertirte."
        </p>
      </footer>
    </DashboardLayout>
  )
}
