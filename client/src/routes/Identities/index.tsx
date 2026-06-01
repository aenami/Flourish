import { createFileRoute } from '@tanstack/react-router'
import { Sparkles } from 'lucide-react'

import { DashboardLayout } from '#/components/DashboardLayout'

export const Route = createFileRoute('/Identities/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <DashboardLayout>
      <header className="border-b border-white/5 pb-6">
        <h1 className="font-sans text-3xl font-extrabold text-on-surface tracking-tight md:text-4xl">
          Mis Identidades
        </h1>
        <p className="mt-2 font-sans text-sm font-semibold text-primary">
          Quién eres determina lo que logras.
        </p>
      </header>

      <div className="mt-10 max-w-2xl text-left">
        <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-surface-container-low/50 p-6 shadow-xl backdrop-blur-xl">
          <div className="flex items-start gap-4">
            <div className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="font-sans text-lg font-bold text-on-surface">Evolución de Identidad</h2>
              <p className="mt-2 font-sans text-sm leading-relaxed text-on-surface-variant/80">
                Esta sección mostrará los niveles de tus identidades (como *Lector*, *Atleta* o *Zen*). Cada vez que completes hábitos asociados a una identidad, ganarás experiencia para subirla de nivel y transformar tu identidad personal.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
