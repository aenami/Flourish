import { createFileRoute } from '@tanstack/react-router'
import { AlertCircle, Brain, Plus, Sparkles, TrendingDown, TrendingUp } from 'lucide-react'
import { useEffect, useState } from 'react'

import { DashboardLayout } from '#/components/DashboardLayout'
import { HabitCard } from '#/components/HabitCard'
import type { HabitData } from '#/components/HabitCard'
import { api } from '#/services/Api'
import { CreateSelectView } from './components/-CreateSelectView'
import { CreatePositiveForm } from './components/-CreatePositiveForm'
import { CreateNegativeForm } from './components/-CreateNegativeForm'

export const Route = createFileRoute('/Habits/')({
  component: HabitsPage,
})

interface HabitsResponse {
  positivos: HabitData[]
  negativos: HabitData[]
}

type TabType = 'Todos' | 'Activos' | 'Por hacer'

interface Identidad {
  id_identidad: number
  nombre_identidad: string
}

function HabitsPage() {
  const [habits, setHabits] = useState<HabitsResponse | null>(null)
  const [identities, setIdentities] = useState<Identidad[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<TabType>('Todos')
  
  // Vistas del flujo de creación
  const [view, setView] = useState<'list' | 'create-select' | 'create-positive' | 'create-negative'>('list')

  const fetchHabits = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await api.get('/habits')
      if (response && response.data) {
        setHabits(response.data)
      } else {
        throw new Error('No se recibió la estructura de datos esperada')
      }
    } catch (err) {
      console.error('Error fetching habits:', err)
      setError(err instanceof Error ? err.message : 'No fue posible conectar con el servidor.')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchIdentities = async () => {
    try {
      const response = await api.get('/identities')
      if (response && Array.isArray(response.data)) {
        setIdentities(response.data)
      }
    } catch (err) {
      console.error('Error al cargar identidades:', err)
    }
  }

  // Obtener datos iniciales
  useEffect(() => {
    fetchHabits()
    fetchIdentities()
  }, [])

  // Filtrado lógico de hábitos en base a la pestaña seleccionada
  const getFilteredHabits = () => {
    if (!habits) return { positivos: [], negativos: [] }

    const today = new Date().getDay() // 0 = Domingo, 1 = Lunes ... 6 = Sábado
    const todayValue = today === 0 ? 7 : today

    let positivos = habits.positivos
    let negativos = habits.negativos

    if (activeTab === 'Activos') {
      // Activos: hábitos con momentum mayor a 0
      positivos = positivos.filter((h) => h.momentum_habito > 0)
      negativos = negativos.filter((h) => h.momentum_habito > 0)
    } else if (activeTab === 'Por hacer') {
      // Por hacer: hábitos programados para el día de hoy
      positivos = positivos.filter((h) => h.dias_semana.includes(todayValue))
      negativos = negativos.filter((h) => h.dias_semana.includes(todayValue))
    }

    return { positivos, negativos }
  }

  const { positivos: filteredPositivos, negativos: filteredNegativos } = getFilteredHabits()
  const tabs: TabType[] = ['Todos', 'Activos', 'Por hacer']

  // -------------------------------------------------------------
  // VISTA DE SELECCIÓN DE CAMINO
  // -------------------------------------------------------------
  if (view === 'create-select') {
    return (
      <DashboardLayout>
        <CreateSelectView
          onBack={() => setView('list')}
          onSelectPositive={() => setView('create-positive')}
          onSelectNegative={() => setView('create-negative')}
        />
      </DashboardLayout>
    )
  }

  // -------------------------------------------------------------
  // VISTA DE CREACIÓN DE HÁBITO POSITIVO
  // -------------------------------------------------------------
  if (view === 'create-positive') {
    const usedElementNames = habits
      ? [
          ...habits.positivos.map((h) => h.elemento?.nombre_elemento),
          ...habits.negativos.map((h) => h.elemento?.nombre_elemento),
        ].filter((name): name is string => typeof name === 'string' && name !== '')
      : []

    return (
      <DashboardLayout>
        <CreatePositiveForm
          onCancel={() => setView('create-select')}
          onSaveSuccess={() => {
            fetchHabits()
            setView('list')
          }}
          identities={identities}
          refreshIdentities={fetchIdentities}
          usedElementNames={usedElementNames}
        />
      </DashboardLayout>
    )
  }

  // -------------------------------------------------------------
  // VISTA DE CREACIÓN DE HÁBITO NEGATIVO
  // -------------------------------------------------------------
  if (view === 'create-negative') {
    const usedElementNames = habits
      ? [
          ...habits.positivos.map((h) => h.elemento?.nombre_elemento),
          ...habits.negativos.map((h) => h.elemento?.nombre_elemento),
        ].filter((name): name is string => typeof name === 'string' && name !== '')
      : []

    return (
      <DashboardLayout>
        <CreateNegativeForm
          onCancel={() => setView('create-select')}
          onSaveSuccess={() => {
            fetchHabits()
            setView('list')
          }}
          identities={identities}
          refreshIdentities={fetchIdentities}
          usedElementNames={usedElementNames}
        />
      </DashboardLayout>
    )
  }

  // -------------------------------------------------------------
  // VISTA: Listado Normal de Hábitos
  // -------------------------------------------------------------
  return (
    <DashboardLayout>
      {/* Encabezado Principal */}
      <header className="flex flex-wrap items-center justify-between gap-5 border-b border-white/5 pb-6">
        <div>
          <h1 className="font-sans text-3xl font-extrabold text-on-surface tracking-tight md:text-4xl">
            Mis Hábitos
          </h1>
          <p className="mt-2 font-sans text-sm font-semibold text-primary">
            Tus acciones diarias, tu futuro.
          </p>
        </div>

        {/* Tab Controls & Add Button */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Segmented Controls */}
          <div className="inline-flex rounded-xl bg-surface-container-lowest/80 p-1 border border-white/5 backdrop-blur-md">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-lg px-4 py-2 font-sans text-xs font-bold transition-all duration-200 ${
                  activeTab === tab
                    ? 'bg-surface-bright text-on-surface shadow-md'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Add Habit Button */}
          <button
            onClick={() => setView('create-select')}
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 font-label text-sm font-bold text-on-primary shadow-[0_12px_28px_rgba(247,187,126,0.14)] transition duration-200 hover:-translate-y-0.5 hover:bg-primary-fixed"
          >
            <Plus size={18} strokeWidth={2.4} />
            <span>Añadir Hábito</span>
          </button>
        </div>
      </header>

      {/* Contenido Principal en dos columnas */}
      {isLoading ? (
        // Skeleton Loader
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="h-6 w-48 rounded bg-white/5 animate-pulse" />
            <div className="h-32 rounded-2xl bg-white/2 animate-pulse" />
            <div className="h-32 rounded-2xl bg-white/2 animate-pulse" />
          </div>
          <div className="space-y-6">
            <div className="h-6 w-48 rounded bg-white/5 animate-pulse" />
            <div className="h-32 rounded-2xl bg-white/2 animate-pulse" />
          </div>
        </div>
      ) : error ? (
        // Error State
        <div className="mt-12 flex flex-col items-center justify-center text-center p-8 rounded-2xl border border-error/20 bg-error/5 max-w-lg mx-auto">
          <AlertCircle className="text-error mb-4" size={42} />
          <h3 className="font-sans text-base font-bold text-on-surface">Error al cargar hábitos</h3>
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
      ) : (habits && habits.positivos.length === 0 && habits.negativos.length === 0) ? (
        // Empty State General de Hábitos
        <div className="mt-12 max-w-xl mx-auto text-center relative overflow-hidden rounded-2xl border border-white/5 bg-surface-container-low/40 p-8 md:p-12 shadow-2xl backdrop-blur-xl">
          <div className="absolute right-0 top-0 -z-10 size-48 rounded-full bg-primary/5 blur-[50px]" />
          
          <div className="mx-auto size-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(247,187,126,0.1)] animate-pulse">
            <Sparkles size={28} />
          </div>

          <h2 className="font-sans text-lg font-bold text-on-surface">No tienes hábitos creados por el momento</h2>
          <p className="mt-3 font-sans text-sm leading-relaxed text-on-surface-variant/80">
            Este es el comienzo de tu santuario digital. Define un hábito introspectivo para forjar una nueva identidad y ver evolucionar tu espacio personal progresivamente.
          </p>

          {/* Botón Card Placeholder */}
          <div 
            onClick={() => setView('create-select')}
            className="mt-8 border border-dashed border-white/10 rounded-2xl bg-white/1 hover:bg-white/3 hover:border-primary/30 p-6 transition flex items-center gap-4 text-left cursor-pointer group"
          >
            <div className="grid size-11 place-items-center rounded-xl bg-white/5 text-on-surface-variant group-hover:bg-primary/20 group-hover:text-primary transition duration-200">
              <Plus size={20} strokeWidth={2.4} />
            </div>
            <div>
              <h4 className="font-sans text-sm font-bold text-on-surface group-hover:text-primary transition duration-200">
                Crear mi primer hábito
              </h4>
              <p className="mt-1 font-sans text-xs text-on-surface-variant/60 leading-normal">
                Define tu señal, acción y recompensas para iniciar la evolución.
              </p>
            </div>
          </div>
        </div>
      ) : (
        // Data Grid
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.25fr_1fr]">
          {/* Columna Izquierda: Hábitos Positivos */}
          <section className="space-y-6">
            <div className="flex items-center gap-2.5 font-sans text-lg font-bold text-on-surface">
              <TrendingUp size={22} className="text-secondary" />
              <h2>Hábitos Positivos</h2>
            </div>

            {filteredPositivos.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/5 bg-white/1 p-8 text-center">
                <p className="font-sans text-sm text-on-surface-variant/60">
                  No hay hábitos positivos activos en esta lista.
                </p>
              </div>
            ) : (
              <div className="grid gap-5">
                {filteredPositivos.map((habit) => (
                  <HabitCard key={habit.id_habito} habit={habit} />
                ))}
              </div>
            )}
          </section>

          {/* Columna Derecha: Hábitos a Eliminar */}
          <section className="space-y-6">
            <div className="flex items-center gap-2.5 font-sans text-lg font-bold text-on-surface">
              <TrendingDown size={22} className="text-error" />
              <h2>Hábitos a Eliminar</h2>
            </div>

            {filteredNegativos.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/5 bg-white/1 p-8 text-center">
                <p className="font-sans text-sm text-on-surface-variant/60">
                  No hay hábitos negativos activos en esta lista.
                </p>
              </div>
            ) : (
              <div className="grid gap-5">
                {filteredNegativos.map((habit) => (
                  <HabitCard key={habit.id_habito} habit={habit} />
                ))}
              </div>
            )}

            {/* Banner Inspiracional */}
            <div className="relative mt-8 overflow-hidden rounded-2xl border border-white/5 bg-surface-container-low/40 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]">
              {/* Decorative Background Icon */}
              <Brain className="absolute -right-6 -bottom-6 size-36 text-white/1 pointer-events-none" />
              
              <div className="relative flex items-start gap-4">
                <div className="grid size-9 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Sparkles size={16} />
                </div>
                <div className="flex-1 text-left">
                  <h4 className="font-label text-sm font-bold text-on-surface tracking-wide">
                    Cada decisión cuenta.
                  </h4>
                  <p className="mt-2 font-sans text-xs leading-relaxed text-on-surface-variant">
                    Sigue construyendo tu mejor versión paso a paso. La constancia supera la intensidad.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </DashboardLayout>
  )
}
