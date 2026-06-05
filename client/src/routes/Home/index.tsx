import { createFileRoute, Link } from '@tanstack/react-router'
import { AlertCircle, Leaf, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'

import { DashboardLayout } from '#/components/DashboardLayout'
import { IdentityStatusWidget } from '#/components/IdentityStatusWidget'
import type { IdentityInfo } from '#/components/IdentityStatusWidget'
import { RoomControls } from '#/components/RoomControls'
import { SantuarioRoom } from '#/components/SantuarioRoom'
import type { ElementRoomData } from '#/components/SantuarioRoom'
import { api } from '#/services/Api'
import {
  getRoomDetails,
  updateElementPosition,
} from '#/services/roomService'
import type { RoomData } from '#/services/roomService'

export const Route = createFileRoute('/Home/')({
  component: RouteComponent,
})

function RouteComponent() {
  const [identities, setIdentities] = useState<IdentityInfo[] | null>(null)
  const [elements, setElements] = useState<ElementRoomData[] | null>(null)
  const [room, setRoom] = useState<RoomData | null>(null)

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)

  // Cargar todos los datos al montar el componente
  useEffect(() => {
    async function fetchDashboardData() {
      setIsLoading(true)
      setError(null)
      try {
        // Ejecutamos las llamadas en paralelo para un tiempo de carga veloz
        const [roomResponse, elementsResponse, identitiesResponse] = await Promise.all([
          getRoomDetails(),
          api.get('/elements'),
          api.get('/identities'),
        ])

        if (!roomResponse.error) {
          setRoom(roomResponse.data)
        } else {
          throw new Error('Fallo al recuperar la configuración de la habitación.')
        }

        if (elementsResponse && Array.isArray(elementsResponse.data)) {
          setElements(elementsResponse.data)
        } else {
          throw new Error('Fallo al recuperar los elementos del Santuario.')
        }

        if (identitiesResponse && Array.isArray(identitiesResponse.data)) {
          setIdentities(identitiesResponse.data)
        } else {
          throw new Error('Fallo al recuperar el listado de identidades.')
        }
      } catch (err) {
        console.error('Error fetching dashboard details:', err)
        setError(
          err instanceof Error ? err.message : 'No fue posible cargar el estado del Santuario.'
        )
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])



  // Mueve un elemento en la rejilla isométrica y lo guarda en base de datos
  const handleMoveElement = async (idElemento: number, col: number | null, fila: number | null) => {
    if (!elements) return
    const prevElementsState = [...elements]

    // Actualizamos localmente de manera optimista para una transición instantánea
    setElements(
      elements.map((el) =>
        el.id_elemento === idElemento ? { ...el, grid_col: col, grid_fila: fila } : el
      )
    )

    try {
      const response = await updateElementPosition(idElemento, {
        grid_col: col,
        grid_fila: fila,
      })
      if (response.error) {
        throw new Error(response.message || 'Error al guardar la posición del elemento')
      }
    } catch (err) {
      console.error('Fallo al mover el elemento:', err)
      // Revertimos al estado original en caso de fallo
      setElements(prevElementsState)
    }
  }

  const [selectedElementId, setSelectedElementId] = useState<number | null>(null)

  return (
    <DashboardLayout>
      {/* Cuerpo del Dashboard */}
      {isLoading ? (
        // Skeleton Loaders
        <div className="mt-8 space-y-6">
          <div className="h-20 w-full max-w-2xl mx-auto rounded-2xl bg-white/2 animate-pulse border border-white/5" />
          <div className="h-[400px] w-full max-w-3xl mx-auto rounded-3xl bg-white/2 animate-pulse border border-white/5" />
          <div className="h-16 w-full max-w-2xl mx-auto rounded-2xl bg-white/2 animate-pulse border border-white/5" />
        </div>
      ) : error ? (
        // Banner de Error
        <div className="mt-12 flex flex-col items-center justify-center text-center p-8 rounded-2xl border border-error/20 bg-error/5 max-w-lg mx-auto">
          <AlertCircle className="text-error mb-4" size={42} />
          <h3 className="font-sans text-base font-bold text-on-surface">Error al inicializar el Santuario</h3>
          <p className="mt-2 font-sans text-sm text-on-surface-variant leading-relaxed">
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 rounded-lg bg-surface-bright px-4 py-2 font-sans text-xs font-bold text-on-surface hover:bg-surface-container-highest transition cursor-pointer"
          >
            Reintentar
          </button>
        </div>
      ) : (
        // Sección Principal Activa
        <div className="mt-4 space-y-6">
          {/* A. Widget de Identidades y Momentum */}
          <IdentityStatusWidget
            identities={identities}
            momentum={room ? room.momentum_general_habitacion : 0}
          />

          {/* B. Vista de Habitación Dinámica (Split en Modo Edición) */}
          <div className={`grid gap-6 items-stretch ${isEditMode ? 'lg:grid-cols-[1fr_280px]' : 'grid-cols-1'}`}>
            <div className="w-full">
              <SantuarioRoom
                elements={elements}
                isEditMode={isEditMode}
                onMoveElement={handleMoveElement}
                selectedElementId={selectedElementId}
                onSelectElement={setSelectedElementId}
              />
            </div>

            {/* Sidebar del Inventario de Diseño */}
            {isEditMode && (
              <div className="rounded-3xl border border-white/5 bg-[#18191b]/50 p-4.5 text-left shadow-xl flex flex-col justify-start min-h-[350px] backdrop-blur-md">
                <div className="border-b border-white/5 pb-3.5 mb-4">
                  <h3 className="font-sans text-sm font-extrabold text-on-surface">Objetos Disponibles</h3>
                  <p className="font-sans text-[10px] text-on-surface-variant/50 leading-normal mt-1 font-semibold">
                    Haz clic en un elemento y colócalo pulsando en cualquier círculo vacío de la rejilla.
                  </p>
                </div>

                {/* Unplaced elements list (Inventory) */}
                <div className="flex-1 space-y-2.5 overflow-y-auto max-h-[340px] pr-1 premium-scrollbar">
                  <span className="font-bold uppercase tracking-wider text-on-surface-variant/30 text-[8px] block mb-1">
                    Inventario ({elements?.filter((e) => e.grid_col === null).length || 0})
                  </span>
                  {elements
                    ?.filter((e) => e.grid_col === null)
                    .map((elem) => {
                      const isSelected = selectedElementId === elem.id_elemento
                      return (
                        <div
                          key={elem.id_elemento}
                          onClick={() => setSelectedElementId(isSelected ? null : elem.id_elemento)}
                          className={`group p-3 rounded-xl border transition-all duration-300 cursor-pointer text-left flex items-center justify-between gap-3 ${
                            isSelected
                              ? 'bg-primary/10 border-primary shadow-[0_0_12px_rgba(247,187,126,0.1)]'
                              : 'bg-white/2 border-white/5 hover:bg-white/5 hover:border-white/10'
                          }`}
                        >
                          <div className="min-w-0">
                            <h4 className="font-sans text-xs font-bold text-on-surface truncate group-hover:text-primary transition duration-200">
                              {elem.nombre_elemento}
                            </h4>
                            <span className="font-sans text-[9px] text-on-surface-variant/50 block font-semibold mt-0.5">
                              Fase {elem.fase_elemento}
                            </span>
                          </div>
                          <div
                            className={`rounded-lg p-1.5 transition ${
                              isSelected
                                ? 'bg-primary text-on-primary'
                                : 'bg-white/5 text-on-surface-variant group-hover:bg-primary/20 group-hover:text-primary'
                            }`}
                          >
                            <Plus size={11} strokeWidth={2.5} />
                          </div>
                        </div>
                      )
                    })}

                  {elements?.filter((e) => e.grid_col === null).length === 0 && (
                    <p className="font-sans text-[10px] text-on-surface-variant/40 italic text-center py-4">
                      No tienes objetos en el inventario.
                    </p>
                  )}

                  {/* Placed elements list */}
                  <div className="pt-4 border-t border-white/5 mt-4">
                    <span className="font-bold uppercase tracking-wider text-on-surface-variant/30 text-[8px] block mb-2">
                      En Habitación ({elements?.filter((e) => e.grid_col !== null).length || 0})
                    </span>
                    <div className="space-y-2">
                      {elements
                        ?.filter((e) => e.grid_col !== null)
                        .map((elem) => (
                          <div
                            key={elem.id_elemento}
                            className="p-2.5 rounded-xl border border-white/5 bg-[#0c0e10]/30 flex items-center justify-between gap-3"
                          >
                            <div className="min-w-0">
                              <h4 className="font-sans text-xs font-bold text-on-surface truncate">
                                {elem.nombre_elemento}
                              </h4>
                              <span className="font-sans text-[9px] text-on-surface-variant/40 block mt-0.5">
                                Posición: {elem.grid_col}, {elem.grid_fila}
                              </span>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleMoveElement(elem.id_elemento, null, null)
                              }}
                              className="bg-error/10 hover:bg-error/25 text-error rounded-lg px-2 py-1 font-sans text-[9px] font-bold transition cursor-pointer"
                              title="Desmontar y enviar al inventario"
                            >
                              Quitar
                            </button>
                          </div>
                        ))}
                      {elements?.filter((e) => e.grid_col !== null).length === 0 && (
                        <p className="font-sans text-[10px] text-on-surface-variant/40 italic text-center py-2">
                          Ningún objeto colocado.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* C. Controles de Ambiente y Rejilla */}
          <RoomControls
            isEditMode={isEditMode}
            onToggleEdit={() => setIsEditMode(!isEditMode)}
          />

          {/* D. Nota al pie de contemplación cuando no se edita */}
          {!isEditMode && elements && elements.length > 0 && (
            <div className="text-center opacity-40 hover:opacity-75 transition duration-300">
              <span className="font-sans text-[10px] leading-normal font-semibold text-on-surface-variant">
                Tip: Haz clic en "Organizar Habitación" para mover tus elementos desbloqueados a la casilla que prefieras o guardarlos.
              </span>
            </div>
          )}

          {/* E. Estado Alternativo: Habitación vacía */}
          {(!elements || elements.length === 0) && (
            <div className="max-w-xl mx-auto text-center border border-dashed border-white/10 rounded-2xl bg-surface-container-low/20 p-6 flex flex-col items-center">
              <div className="size-11 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-3">
                <Leaf size={20} />
              </div>
              <h4 className="font-sans text-sm font-bold text-on-surface">No hay objetos en tu habitación</h4>
              <p className="mt-1 font-sans text-xs text-on-surface-variant/70 leading-normal max-w-sm">
                Crea hábitos positivos o negativos y asóciales una representación visual para ver cómo cobra vida tu habitación.
              </p>
              <Link
                to="/Habits"
                className="mt-4 inline-flex items-center gap-1.5 bg-primary/10 border border-primary/20 hover:bg-primary/20 text-primary rounded-lg px-3 py-1.5 font-sans text-[11px] font-bold transition"
              >
                <Plus size={12} />
                <span>Empezar con un Hábito</span>
              </Link>
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  )
}
