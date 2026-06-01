import { Link, useRouterState } from '@tanstack/react-router'
import {
  BarChart3,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  Home,
  Leaf,
  Menu,
  Settings,
  Sparkles,
  X,
} from 'lucide-react'
import { useState } from 'react'
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

  // Persistir la preferencia en localStorage (aplica principalmente en desktop)
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('sidebar-collapsed') === 'true'
    }
    return false
  })

  const toggleSidebar = () => {
    setIsCollapsed((prev) => {
      const next = !prev
      localStorage.setItem('sidebar-collapsed', String(next))
      return next
    })
  }

  const navItems = [
    { label: 'Home', to: '/Home', icon: Home },
    { label: 'Hábitos', to: '/Habits', icon: CheckSquare },
    { label: 'Identidades', to: '/Identities', icon: Sparkles },
    { label: 'Estadísticas', to: '/Home', icon: BarChart3, isPlaceholder: true },
    { label: 'Ajustes', to: '/Home', icon: Settings, isPlaceholder: true },
  ]

  return (
    <div className="flex min-h-screen bg-surface font-sans text-on-surface flex-col lg:flex-row">
      {/* 📱 Cabecera Móvil (Solo visible en dispositivos móviles cuando el sidebar está colapsado) */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-white/5 bg-surface-container-lowest/80 px-5 backdrop-blur-md sticky top-0 z-30 lg:hidden">
        {/* Botón de Hamburguesa */}
        <button
          onClick={() => setIsCollapsed(false)}
          className="grid size-10 place-items-center rounded-xl border border-white/5 bg-white/[0.02] text-on-surface hover:bg-white/5 transition"
          title="Abrir menú"
        >
          <Menu size={20} />
        </button>

        {/* Brand/Logo Centrado en Móvil */}
        <div className="flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-lg bg-primary text-on-primary">
            <Leaf size={16} fill="currentColor" />
          </span>
          <span className="font-label text-lg font-bold tracking-tight text-on-surface">
            Habitum
          </span>
        </div>

        {/* Mini Avatar Derecha */}
        <div className="size-9 rounded-full border border-primary/20 bg-primary/10 flex items-center justify-center font-label text-xs font-bold text-primary uppercase">
          {nombreUsuario.substring(0, 2)}
        </div>
      </header>

      {/* 🪐 Sidebar Izquierdo (Diseño dual: Colapsable en Desktop + Drawer Full-Screen en Móvil) */}
      <aside
        className={`bg-surface-container-lowest shadow-[2px_0_12px_rgba(0,0,0,0.4)] transition-all duration-300 ease-in-out lg:relative lg:flex lg:flex-col border-r border-white/5 ${
          // Clases de Drawer en Móvil (Full-screen overlay cuando está abierto, totalmente oculto cuando está cerrado)
          isCollapsed
            ? 'hidden w-0 p-0 overflow-hidden lg:flex lg:w-20 lg:p-4'
            : 'fixed inset-0 z-50 flex w-full h-full flex-col p-6 backdrop-blur-2xl bg-surface-container-lowest/95 lg:fixed lg:z-auto lg:h-auto lg:w-64 lg:p-6'
        }`}
      >
        {/* Brand / Logo + Botón de Cerrar (Mobile X / Desktop Arrow) */}
        <div className={`flex items-center ${isCollapsed ? 'justify-center py-4' : 'justify-between py-4'}`}>
          <div className="flex items-center gap-3">
            <span
              className={`grid size-10 place-items-center rounded-xl bg-primary text-on-primary shadow-[0_10px_24px_rgba(247,187,126,0.18)] transition-all duration-300 ${
                isCollapsed ? 'scale-95' : ''
              }`}
            >
              <Leaf size={20} fill="currentColor" />
            </span>
            {!isCollapsed && (
              <span className="font-label text-2xl font-bold tracking-tight text-on-surface">
                Habitum
              </span>
            )}
          </div>

          {/* Botones de Cierre / Contracción */}
          {!isCollapsed && (
            <>
              {/* Desktop Collapse Arrow */}
              <button
                onClick={toggleSidebar}
                className="hidden lg:grid size-8 place-items-center rounded-lg text-on-surface-variant/80 hover:bg-white/5 hover:text-on-surface transition duration-200"
                title="Colapsar menú"
              >
                <ChevronLeft size={18} />
              </button>

              {/* Mobile Close X (Drawer Full Screen) */}
              <button
                onClick={() => setIsCollapsed(true)}
                className="grid lg:hidden size-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-on-surface hover:bg-white/10 transition"
                title="Cerrar menú"
              >
                <X size={20} />
              </button>
            </>
          )}
        </div>

        {/* Botón de Expansión Arrow en Desktop (Solo visible cuando está colapsado y es pantalla grande) */}
        {isCollapsed && (
          <button
            onClick={toggleSidebar}
            className="hidden lg:grid mx-auto mt-2 size-9 place-items-center rounded-xl border border-white/5 bg-white/[0.02] text-on-surface hover:bg-white/5 transition duration-200"
            title="Expandir menú"
          >
            <ChevronRight size={18} />
          </button>
        )}

        {/* Navigation List */}
        <nav className={`mt-8 flex-1 space-y-2.5 ${isCollapsed ? 'flex flex-col items-center' : 'flex flex-col justify-center lg:justify-start lg:block'}`}>
          {navItems.map((item) => {
            const Icon = item.icon
            const isPathActive = currentPath === item.to || (currentPath === '/' && item.to === '/Home')
            const isActive = isPathActive && !item.isPlaceholder

            return (
              <Link
                key={item.label}
                to={item.to}
                title={isCollapsed ? item.label : undefined}
                // Al hacer clic en un enlace en móvil, cerramos automáticamente el Drawer
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    setIsCollapsed(true)
                  }
                }}
                className={`group relative flex items-center transition duration-200 ${
                  isCollapsed
                    ? `justify-center size-12 rounded-xl ${
                        isActive ? 'bg-primary/15 text-primary' : 'text-on-surface-variant/80 hover:bg-white/[0.03] hover:text-on-surface'
                      }`
                    : `gap-4.5 w-full rounded-xl px-4.5 py-4 lg:py-3.5 font-label text-lg lg:text-base font-semibold ${
                        isActive
                          ? 'bg-primary/15 text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]'
                          : 'text-on-surface-variant/80 hover:bg-white/[0.03] hover:text-on-surface'
                      }`
                }`}
              >
                <Icon
                  size={isCollapsed ? 20 : 22}
                  className={`transition duration-200 lg:size-5 ${
                    isActive ? 'text-primary' : 'text-on-surface-variant/70 group-hover:text-on-surface'
                  }`}
                />
                
                {/* Texto de Navegación (Solo si no está colapsado) */}
                {!isCollapsed && <span>{item.label}</span>}
                
                {/* Distintivo de "Pronto" (Solo si no está colapsado) */}
                {!isCollapsed && item.isPlaceholder && (
                  <span className="ml-auto rounded-md bg-white/5 px-1.5 py-0.5 font-sans text-[10px] font-medium text-on-surface-variant/50">
                    Pronto
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Perfil del Usuario en el Fondo */}
        <footer className={`mt-auto border-t border-white/5 pt-6 ${isCollapsed ? 'flex justify-center' : 'flex justify-start lg:block'}`}>
          <div className="flex items-center gap-4 animate-fade-in" title={isCollapsed ? `Bienvenido, ${nombreUsuario}` : undefined}>
            <div className="relative size-11 shrink-0 rounded-full border border-primary/20 bg-primary/10 shadow-[0_0_15px_rgba(247,187,126,0.08)] flex items-center justify-center font-label text-base font-bold text-primary uppercase">
              {nombreUsuario.substring(0, 2)}
            </div>
            
            {/* Detalles de Perfil (Solo si no está colapsado) */}
            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <h4 className="truncate font-sans text-sm font-bold text-on-surface leading-tight">
                  Bienvenido, {nombreUsuario}
                </h4>
                <p className="truncate font-sans text-[11px] font-semibold text-on-surface-variant/60 leading-normal mt-0.5">
                  Estás construyendo tu mejor versión.
                </p>
              </div>
            )}
          </div>
        </footer>
      </aside>

      {/* Contenido Derecho */}
      <main className="relative flex-1 min-h-screen overflow-x-hidden bg-surface bg-[radial-gradient(circle_at_70%_15%,rgba(172,206,191,0.04),transparent_48rem)] flex flex-col">
        {/* Glow ambient background elements */}
        <div className="pointer-events-none absolute right-[10%] top-[10%] size-96 rounded-full bg-secondary/5 blur-[90px]" />
        
        <div className="relative flex-1 p-5 md:p-8 lg:p-11">
          {children}
        </div>
      </main>
    </div>
  )
}
