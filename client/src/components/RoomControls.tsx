import { LayoutGrid } from 'lucide-react'

interface RoomControlsProps {
  isEditMode: boolean
  onToggleEdit: () => void
}

export function RoomControls({
  isEditMode,
  onToggleEdit,
}: RoomControlsProps) {
  return (
    <div className="w-full max-w-2xl mx-auto flex items-center justify-center bg-surface-container-low/40 border border-white/5 p-4 rounded-2xl backdrop-blur-md shadow-xl select-none mt-6">
      <button
        onClick={onToggleEdit}
        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl border transition-all duration-300 font-sans text-xs font-bold cursor-pointer ${
          isEditMode
            ? 'bg-primary text-on-primary border-primary shadow-[0_0_15px_rgba(247,187,126,0.25)] hover:scale-103'
            : 'bg-white/5 border-white/10 text-on-surface hover:bg-white/10'
        }`}
        title={isEditMode ? 'Guardar Cambios' : 'Editar posiciones de objetos'}
      >
        <LayoutGrid size={15} />
        <span>{isEditMode ? 'Finalizar Edición' : 'Organizar Habitación'}</span>
      </button>
    </div>
  )
}
