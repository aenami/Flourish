import { ArrowLeft, ArrowRight, Ban, Plus, TrendingUp } from 'lucide-react'

interface CreateSelectViewProps {
  onBack: () => void
  onSelectPositive: () => void
}

export function CreateSelectView({ onBack, onSelectPositive }: CreateSelectViewProps) {
  return (
    <div className="w-full">
      {/* Botón superior izquierdo de retroceso */}
      <header className="flex items-center justify-between border-b border-white/5 pb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-xl border border-white/5 bg-surface-container-low/50 px-4 py-2 font-sans text-xs font-bold text-on-surface-variant hover:text-on-surface hover:bg-surface-container/80 transition duration-200"
        >
          <ArrowLeft size={16} />
          <span>Volver a hábitos</span>
        </button>
      </header>

      {/* Bloque central de selección */}
      <div className="mt-16 flex flex-col items-center justify-center text-center max-w-4xl mx-auto px-4">
        {/* Icono central de más con fondo naranja */}
        <div className="relative flex items-center justify-center">
          <div className="absolute size-18 rounded-full border border-primary/10 animate-ping opacity-25" />
          <div className="size-12 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-[0_8px_24px_rgba(247,187,126,0.25)] relative z-10">
            <Plus size={20} strokeWidth={2.6} />
          </div>
        </div>

        <h2 className="mt-6 font-sans text-3xl font-extrabold text-on-surface tracking-tight md:text-4xl">
          Elige tu camino
        </h2>
        
        <p className="mt-4 font-sans text-sm leading-relaxed text-on-surface-variant/80 max-w-xl mx-auto">
          Cada acción que tomas es un voto por la persona en la que te quieres convertir. ¿Qué ciclo comenzarás o terminarás hoy?
        </p>

        {/* Rejilla de opciones */}
        <div className="mt-12 w-full grid gap-8 md:grid-cols-2 text-left items-stretch mb-12">
          {/* Opción 1: Hábito Positivo */}
          <div 
            onClick={onSelectPositive}
            className="group relative overflow-hidden rounded-[24px] border border-white/5 bg-[#18191b] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.25)] transition-all duration-300 hover:-translate-y-1.5 hover:border-white/10 hover:shadow-[0_16px_40px_rgba(0,0,0,0.45)] hover:bg-[#1e2022] cursor-pointer"
          >
            <div className="size-12 rounded-xl bg-secondary/10 border border-secondary/15 flex items-center justify-center text-secondary mb-6 shadow-[0_0_15px_rgba(172,206,191,0.04)]">
              <TrendingUp size={22} />
            </div>
            <h3 className="font-sans text-xl font-bold text-on-surface tracking-tight">
              Crear Hábito Positivo
            </h3>
            <p className="mt-3 font-sans text-xs leading-relaxed text-on-surface-variant/60 font-medium leading-normal">
              Construye una nueva identidad paso a paso. Añade una acción constructiva a tu rutina diaria que te acerque a tus metas a largo plazo.
            </p>
            <div className="mt-8 inline-flex items-center gap-1 font-label text-xs font-bold text-[#f7bb7e] group-hover:text-primary-fixed transition duration-200">
              <span>Empezar a construir</span>
              <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
            </div>
          </div>

          {/* Opción 2: Hábito Negativo */}
          <div 
            onClick={() => alert('¡Pronto! En la siguiente fase diseñaremos el formulario de hábitos negativos.')}
            className="group relative overflow-hidden rounded-[24px] border border-white/5 bg-[#18191b] p-8 shadow-[0_8px_32px_rgba(0,0,0,0.25)] transition-all duration-300 hover:-translate-y-1.5 hover:border-white/10 hover:shadow-[0_16px_40px_rgba(0,0,0,0.45)] hover:bg-[#1e2022] cursor-pointer"
          >
            <div className="size-12 rounded-xl bg-error/10 border border-error/15 flex items-center justify-center text-error mb-6 shadow-[0_0_15px_rgba(255,180,171,0.04)]">
              <Ban size={20} />
            </div>
            <h3 className="font-sans text-xl font-bold text-on-surface tracking-tight">
              Eliminar Hábito Negativo
            </h3>
            <p className="mt-3 font-sans text-xs leading-relaxed text-on-surface-variant/60 font-medium leading-normal">
              Rompe un ciclo que ya no te sirve. Identifica las señales, interrumpe la rutina y recupera el control sobre tus acciones automáticas.
            </p>
            <div className="mt-8 inline-flex items-center gap-1 font-label text-xs font-bold text-[#f7bb7e] group-hover:text-primary-fixed transition duration-200">
              <span>Comenzar a romper</span>
              <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
