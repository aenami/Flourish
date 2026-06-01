import { Link, createFileRoute } from '@tanstack/react-router'
import { CheckSquare, Heart, Sparkles } from 'lucide-react'

import { DashboardLayout } from '#/components/DashboardLayout'

export const Route = createFileRoute('/Home/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <DashboardLayout>
      <header className="border-b border-white/5 pb-6">
        <h1 className="font-sans text-3xl font-extrabold text-on-surface tracking-tight md:text-4xl">
          Mi Santuario
        </h1>
        <p className="mt-2 font-sans text-sm font-semibold text-primary">
          Un refugio tranquilo para tu evolución personal.
        </p>
      </header>

      <div className="mt-10 max-w-2xl space-y-6">
        {/* Welcome Card */}
        <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-surface-container-low/50 p-6 shadow-xl backdrop-blur-xl">
          {/* Ambient Glow */}
          <div className="absolute right-0 top-0 -z-10 size-48 rounded-full bg-primary/5 blur-[50px]" />

          <div className="flex items-start gap-4">
            <div className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
              <Heart size={20} className="animate-pulse" />
            </div>
            <div className="flex-1">
              <h2 className="font-sans text-lg font-bold text-on-surface">Bienvenido a Flourish</h2>
              <p className="mt-2 font-sans text-sm leading-relaxed text-on-surface-variant/80">
                Este es tu espacio seguro para desconectarte del ruido exterior y enfocarte en lo que realmente importa: tu identidad y tus hábitos diarios.
              </p>
              
              <div className="mt-6 flex flex-wrap gap-4">
                <Link
                  to="/Habits"
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-5 font-label text-xs font-bold text-on-primary shadow-lg transition duration-200 hover:bg-primary-fixed hover:-translate-y-0.5"
                >
                  <CheckSquare size={14} />
                  <span>Gestionar Hábitos</span>
                </Link>
                <Link
                  to="/Identities"
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 font-label text-xs font-bold text-on-surface transition duration-200 hover:bg-white/10"
                >
                  <Sparkles size={14} />
                  <span>Ver Identidades</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
