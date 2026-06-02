import { Fingerprint, X } from 'lucide-react'
import { useState } from 'react'
import { api } from '#/services/Api'

interface IdentityModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateSuccess: (newIdentityId: string) => Promise<void>
}

export function IdentityModal({ isOpen, onClose, onCreateSuccess }: IdentityModalProps) {
  const [newIdentityName, setNewIdentityName] = useState('')
  const [isCreatingIdentity, setIsCreatingIdentity] = useState(false)

  if (!isOpen) return null

  const handleCreateIdentitySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newIdentityName.trim()) return

    setIsCreatingIdentity(true)
    try {
      const response = await api.post('/identities', {
        nombre_identidad: newIdentityName.trim(),
      })
      if (response && !response.error) {
        await onCreateSuccess(String(response.data.id_identidad))
        setNewIdentityName('')
        onClose()
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al crear la identidad')
    } finally {
      setIsCreatingIdentity(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="w-full max-w-sm rounded-3xl border border-white/5 bg-[#18191b] p-6 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={() => {
            setNewIdentityName('')
            onClose()
          }}
          className="absolute right-4 top-4 text-on-surface-variant/60 hover:text-on-surface p-1 rounded-lg hover:bg-white/5 transition"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3">
          <div className="grid size-9 place-items-center rounded-lg bg-primary/10 text-primary">
            <Fingerprint size={18} />
          </div>
          <h3 className="font-sans text-base font-bold text-on-surface">
            Nueva Identidad
          </h3>
        </div>

        <p className="mt-3 font-sans text-xs text-on-surface-variant/70 leading-relaxed">
          Forja una nueva identidad personal a la cual vincular tus hábitos constructivos cotidianos.
        </p>

        <form onSubmit={handleCreateIdentitySubmit} className="mt-5 space-y-4">
          <div>
            <label className="block font-label text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/50 mb-1.5">
              Nombre de la Identidad
            </label>
            <input
              type="text"
              required
              placeholder="Ej. Lector, Atleta, Escritor"
              value={newIdentityName}
              onChange={(e) => setNewIdentityName(e.target.value)}
              className="w-full h-10 rounded-lg border border-white/5 bg-surface-container-lowest px-3 font-sans text-xs text-on-surface placeholder:text-on-surface-variant/35 outline-hidden focus:border-primary/50 transition"
            />
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={() => {
                setNewIdentityName('')
                onClose()
              }}
              className="rounded-lg border border-white/5 px-4 h-9 font-sans text-xs font-bold text-on-surface-variant hover:text-on-surface transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isCreatingIdentity}
              className="rounded-lg bg-primary px-4 h-9 font-label text-xs font-bold text-on-primary hover:bg-primary-fixed shadow-md transition disabled:opacity-50"
            >
              {isCreatingIdentity ? 'Creando...' : 'Confirmar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
