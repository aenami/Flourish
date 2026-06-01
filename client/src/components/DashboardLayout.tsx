import { Link, useRouterState } from '@tanstack/react-router'
import { BarChart3, CheckSquare, Home, Leaf, Settings, Sparkles } from 'lucide-react'
import type { ReactNode } from 'react'

import { tokenManager } from '../utils/tokenManager'

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname
  const user = tokenManager.getUser()
  const nombreUsuario = user?.nombre || 'Alex'

  const navItems: {
    label: string
    to: '/Home' | '/Habits' | '/Identities'
    icon: React.ComponentType<{ size?: number; className?: string }>
    isPlaceholder?: boolean
  }[] = [
    { label: 'Home', to: '/Home', icon: Home },
    { label: 'Hábitos', to: '/Habits', icon: CheckSquare },
    { label: 'Identidades', to: '/Identities', icon: Sparkles },
    { label: 'Estadísticas', to: '/Home', icon: BarChart3, isPlaceholder: true },
    { label: 'Ajustes', to: '/Home', icon: Settings, isPlaceholder: true },
  ]

  return (
    <div className="grid min-h-screen bg-surface font-sans text-on-surface lg:grid-cols-[16rem_1fr]">
      {/* Sidebar Izquierdo */}
      <aside className="relative flex flex-col border-r border-white/5 bg-surface-container-lowest p-6 shadow-[2px_0_12px_rgba(0,0,0,0.4)]">
        {/* Brand/Logo */}
        <div className="flex items-center gap-3 py-4">
          <span className="grid size-10 place-items-center rounded-xl bg-primary text-on-primary shadow-[0_10px_24px_rgba(247,187,126,0.18)]">
            <Leaf size={20} fill="currentColor" />
          </span>
          <span className="font-label text-2xl font-bold tracking-tight text-on-surface">
            Habitum
          </span>
        </div>

        {/* Navigation List */}
        <nav className="mt-10 flex-1 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isPathActive = currentPath === item.to || (currentPath === '/' && item.to === '/Home')
            // Si es un placeholder, le damos un estilo atenuado o redirigimos temporalmente
            const isActive = isPathActive && !item.isPlaceholder

            return (
              <Link
                key={item.label}
                to={item.to}
                className={`group flex items-center gap-4.5 rounded-xl px-4.5 py-3.5 font-label text-base font-semibold transition duration-200 ${
                  isActive
                    ? 'bg-primary/15 text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]'
                    : 'text-on-surface-variant/80 hover:bg-white/3 hover:text-on-surface'
                }`}
              >
                <Icon
                  size={20}
                  className={`transition duration-200 ${
                    isActive ? 'text-primary' : 'text-on-surface-variant/70 group-hover:text-on-surface'
                  }`}
                />
                <span>{item.label}</span>
                {item.isPlaceholder && (
                  <span className="ml-auto rounded-md bg-white/5 px-1.5 py-0.5 font-sans text-[10px] font-medium text-on-surface-variant/50">
                    Pronto
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Perfil del Usuario en el Fondo */}
        <footer className="mt-auto border-t border-white/5 pt-6">
          <div className="flex items-center gap-4">
            <div className="relative size-11 rounded-full border border-primary/20 bg-primary/10 shadow-[0_0_15px_rgba(247,187,126,0.08)] flex items-center justify-center font-label text-base font-bold text-primary uppercase">
              {nombreUsuario.substring(0, 2)}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="truncate font-sans text-sm font-bold text-on-surface leading-tight">
                Bienvenido, {nombreUsuario}
              </h4>
              <p className="truncate font-sans text-[11px] font-semibold text-on-surface-variant/60 leading-normal mt-0.5">
                Estás construyendo tu mejor versión.
              </p>
            </div>
          </div>
        </footer>
      </aside>

      {/* Contenido Derecho */}
      <main className="relative flex flex-col overflow-x-hidden bg-surface bg-[radial-gradient(circle_at_70%_15%,rgba(172,206,191,0.04),transparent_48rem)]">
        {/* Glow ambient background elements */}
        <div className="pointer-events-none absolute right-[10%] top-[10%] size-96 rounded-full bg-secondary/5 blur-[90px]" />
        
        <div className="relative flex-1 p-6 md:p-8 lg:p-11">
          {children}
        </div>
      </main>
    </div>
  )
}
