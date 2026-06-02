import {
  Activity,
  Apple,
  ArrowLeft,
  Award,
  BookOpen,
  Brain,
  Briefcase,
  CheckCircle,
  Coffee,
  Compass,
  Dumbbell,
  Fingerprint,
  Flame,
  Gamepad2,
  GlassWater,
  GraduationCap,
  Heart,
  Moon,
  Music,
  PenTool,
  Plus,
  Settings,
  Smartphone,
  Sparkles,
  Timer,
} from 'lucide-react'
import { useState } from 'react'
import { api } from '#/services/Api'
import { IdentityModal } from './-IdentityModal'

interface Identidad {
  id_identidad: number
  nombre_identidad: string
}

const HABIT_ICONS_LIST = [
  { name: 'BookOpen', icon: BookOpen, label: 'Lectura' },
  { name: 'Dumbbell', icon: Dumbbell, label: 'Deporte' },
  { name: 'Sparkles', icon: Sparkles, label: 'Zen/Mente' },
  { name: 'Smartphone', icon: Smartphone, label: 'Pantalla' },
  { name: 'Gamepad2', icon: Gamepad2, label: 'Ocio/Juego' },
  { name: 'CheckCircle', icon: CheckCircle, label: 'General' },
  { name: 'Heart', icon: Heart, label: 'Salud' },
  { name: 'Brain', icon: Brain, label: 'Foco' },
  { name: 'Apple', icon: Apple, label: 'Dieta' },
  { name: 'Flame', icon: Flame, label: 'Reto' },
  { name: 'Coffee', icon: Coffee, label: 'Rutina' },
  { name: 'GlassWater', icon: GlassWater, label: 'Agua' },
  { name: 'Moon', icon: Moon, label: 'Sueño' },
  { name: 'Activity', icon: Activity, label: 'Cardio' },
  { name: 'Timer', icon: Timer, label: 'Tiempo' },
  { name: 'GraduationCap', icon: GraduationCap, label: 'Estudio' },
  { name: 'Compass', icon: Compass, label: 'Viaje' },
  { name: 'PenTool', icon: PenTool, label: 'Crear' },
  { name: 'Music', icon: Music, label: 'Música' },
  { name: 'Briefcase', icon: Briefcase, label: 'Trabajo' },
]

interface CreatePositiveFormProps {
  onCancel: () => void
  onSaveSuccess: () => void
  identities: Identidad[]
  refreshIdentities: () => Promise<void>
  usedElementNames: string[]
}

export function CreatePositiveForm({
  onCancel,
  onSaveSuccess,
  identities,
  refreshIdentities,
  usedElementNames,
}: CreatePositiveFormProps) {
  // Formulario de Creación
  const [nombreHabito, setNombreHabito] = useState('')
  const [idIdentidad, setIdIdentidad] = useState('')
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5, 6, 7])
  const [selectedIcon, setSelectedIcon] = useState('CheckCircle')

  // Las 4 leyes del comportamiento
  const [senal, setSenal] = useState('')
  const [atractivo, setAtractivo] = useState('')
  const [accion, setAccion] = useState('')
  const [recompensa, setRecompensa] = useState('')

  // Manifiesto Visual selection (Paso 3)
  const [nombreElemento, setNombreElemento] = useState(() => {
    const available = ['Libro Antiguo', 'Mancuerna', 'Esterilla Yoga'].find(
      (name) => !usedElementNames.includes(name)
    )
    return available || 'Personalizado'
  })

  const visualElementsList = [
    {
      name: 'Libro Antiguo',
      icon: BookOpen,
      iconColor: 'text-[#accebf]',
      isUsed: usedElementNames.includes('Libro Antiguo'),
    },
    {
      name: 'Mancuerna',
      icon: Dumbbell,
      iconColor: 'text-[#ebc246]',
      isUsed: usedElementNames.includes('Mancuerna'),
    },
    {
      name: 'Esterilla Yoga',
      icon: Sparkles,
      iconColor: 'text-primary',
      isUsed: usedElementNames.includes('Esterilla Yoga'),
    },
    {
      name: 'Personalizado',
      icon: Plus,
      iconColor: 'text-on-surface-variant/40',
      isUsed: false,
    },
  ]

  // Modal de Identidad
  const [showIdentityModal, setShowIdentityModal] = useState(false)

  const daysOfWeek = [
    { label: 'L', value: 1 },
    { label: 'M', value: 2 },
    { label: 'X', value: 3 },
    { label: 'J', value: 4 },
    { label: 'V', value: 5 },
    { label: 'S', value: 6 },
    { label: 'D', value: 7 },
  ]

  const toggleDay = (val: number) => {
    if (selectedDays.includes(val)) {
      setSelectedDays(selectedDays.filter((d) => d !== val))
    } else {
      setSelectedDays([...selectedDays, val])
    }
  }

  const handleIdentityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value
    if (val === 'NEW_IDENTITY') {
      setShowIdentityModal(true)
      // reset selector temporarily
      e.target.value = idIdentidad
    } else {
      setIdIdentidad(val)
    }
  }

  const handleIdentityCreated = async (newId: string) => {
    await refreshIdentities()
    setIdIdentidad(newId)
  }

  const handleSaveHabit = async () => {
    if (!nombreHabito.trim()) {
      alert('Por favor, introduce el nombre del hábito')
      return
    }

    if (selectedDays.length === 0) {
      alert('Por favor, selecciona al menos un día programado')
      return
    }

    if (!senal.trim() || !accion.trim()) {
      alert('Por favor, completa los campos de La Señal y La Acción en la sección Diseña el Sistema')
      return
    }

    const payload = {
      nombre_habito: nombreHabito.trim(),
      tipo_habito: 'POSITIVO',
      sistema_habito: {
        senal: senal.trim(),
        atractivo: atractivo.trim(),
        accion: accion.trim(),
        recompensa: recompensa.trim(),
        icono: selectedIcon,
      },
      dias_semana: selectedDays,
      id_identidad: idIdentidad ? Number(idIdentidad) : null,
      nombre_elemento: nombreElemento,
    }

    try {
      const response = await api.post('/habits', payload)
      if (response && !response.error) {
        onSaveSuccess()
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al guardar el hábito')
    }
  }

  return (
    <div className="w-full">
      {/* Cabecera del Formulario */}
      <header className="flex items-center justify-between border-b border-white/5 pb-5">
        <button
          onClick={onCancel}
          className="inline-flex items-center gap-2 rounded-xl border border-white/5 bg-surface-container-low/50 px-4 py-2 font-sans text-xs font-bold text-on-surface-variant hover:text-on-surface hover:bg-surface-container/80 transition duration-200"
        >
          <ArrowLeft size={15} />
          <span>Cancelar</span>
        </button>

        <h2 className="font-sans text-lg font-bold text-on-surface">Nuevo Hábito</h2>

        <button
          onClick={handleSaveHabit}
          className="inline-flex h-9 items-center justify-center rounded-xl bg-primary px-5 font-label text-xs font-bold text-on-primary shadow-lg hover:-translate-y-0.5 hover:bg-primary-fixed transition duration-200"
        >
          Guardar
        </button>
      </header>

      {/* Bloque de Títulos del Formulario */}
      <div className="mt-12 text-center max-w-2xl mx-auto px-4">
        <h2 className="font-sans text-3xl font-extrabold text-on-surface tracking-tight md:text-4xl">
          Forja un Nuevo Camino
        </h2>
        <p className="mt-3 font-sans text-sm leading-relaxed text-on-surface-variant/80">
          Diseña tu entorno digital y define la persona en la que te quieres convertir mediante pequeñas acciones diarias.
        </p>
      </div>

      {/* Secciones del Formulario */}
      <div className="mt-12 max-w-3xl mx-auto space-y-8 mb-20 px-4">
        
        {/* SECCIÓN 1: Define tu Identidad */}
        <div className="relative overflow-hidden rounded-[24px] border border-white/5 bg-[#18191b] p-6 shadow-xl border-l-4 border-[#f7bb7e]">
          <div className="flex items-start gap-4">
            <div className="grid size-10 place-items-center rounded-xl bg-[#2f271d] text-[#f7bb7e] border border-[#4d3d2c]/35 shadow-md">
              <Fingerprint size={20} />
            </div>
            <div className="flex-1">
              <h3 className="font-sans text-base font-bold text-on-surface">
                1. Define tu Identidad
              </h3>
              <p className="font-sans text-xs font-semibold text-on-surface-variant/50 mt-0.5">
                ¿En quién te quieres convertir?
              </p>

              {/* Campos */}
              <div className="mt-6 space-y-5">
                {/* Selector de Identidades */}
                <div>
                  <label className="block font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant/75 mb-2">
                    Identidad que quieres encarnar
                  </label>
                  <select
                    value={idIdentidad}
                    onChange={handleIdentityChange}
                    className="w-full h-11 rounded-xl border border-white/5 bg-surface-container-lowest px-4 font-sans text-sm text-on-surface outline-none focus:border-primary/50 transition"
                  >
                    <option value="">Selecciona una identidad</option>
                    {identities.map((id) => (
                      <option key={id.id_identidad} value={id.id_identidad}>
                        {id.nombre_identidad}
                      </option>
                    ))}
                    <option value="NEW_IDENTITY" className="text-primary font-bold">
                      + Crear nueva identidad...
                    </option>
                  </select>
                </div>

                {/* Nombre del Hábito */}
                <div>
                  <label className="block font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant/75 mb-2">
                    Nombre del Hábito
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Leer 10 páginas al día"
                    value={nombreHabito}
                    onChange={(e) => setNombreHabito(e.target.value)}
                    className="w-full h-11 rounded-xl border border-white/5 bg-surface-container-lowest px-4 font-sans text-sm text-on-surface placeholder:text-on-surface-variant/35 outline-none focus:border-primary/50 transition"
                  />
                </div>

                {/* Icono del Hábito */}
                <div>
                  <label className="block font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant/75 mb-3">
                    Icono del Hábito
                  </label>
                  <div className="grid grid-cols-5 gap-2.5 rounded-2xl border border-white/5 bg-surface-container-lowest/50 p-4 max-h-56 overflow-y-auto premium-scrollbar">
                    {HABIT_ICONS_LIST.map((item) => {
                      const IconComp = item.icon
                      const isSelected = selectedIcon === item.name
                      return (
                        <button
                          key={item.name}
                          type="button"
                          onClick={() => setSelectedIcon(item.name)}
                          title={item.label}
                          className={`flex flex-col items-center justify-center p-3 rounded-xl border transition duration-200 cursor-pointer ${
                            isSelected
                              ? 'border-primary bg-primary/10 text-primary shadow-[0_0_12px_rgba(247,187,126,0.12)]'
                              : 'border-white/5 bg-surface-container-lowest text-on-surface-variant/80 hover:border-white/10 hover:bg-white/[0.02] hover:text-on-surface'
                          }`}
                        >
                          <IconComp size={20} />
                          <span className="text-[9px] font-sans font-semibold mt-1.5 truncate max-w-full">
                            {item.label}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Días Programados */}
                <div>
                  <label className="block font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant/75 mb-2">
                    Días programados de la semana
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {daysOfWeek.map((day) => {
                      const isSelected = selectedDays.includes(day.value)
                      return (
                        <button
                          key={day.value}
                          type="button"
                          onClick={() => toggleDay(day.value)}
                          className={`grid size-9 place-items-center rounded-full font-label text-xs font-bold transition duration-200 ${
                            isSelected
                              ? 'bg-primary text-on-primary shadow-md'
                              : 'bg-white/5 border border-white/10 text-on-surface-variant hover:bg-white/10'
                          }`}
                        >
                          {day.label}
                        </button>
                      )
                    })}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* SECCIÓN 2: Diseña el Sistema */}
        <div className="relative overflow-hidden rounded-[24px] border border-white/5 bg-[#18191b] p-6 shadow-xl border-l-4 border-[#accebf]">
          <div className="flex items-start gap-4">
            <div className="grid size-10 place-items-center rounded-xl bg-[#1b2b24] text-[#accebf] border border-[#2e5241]/35 shadow-md">
              <Settings size={20} />
            </div>
            <div className="flex-1">
              <h3 className="font-sans text-base font-bold text-on-surface">
                2. Diseña el Sistema
              </h3>
              <p className="font-sans text-xs font-semibold text-on-surface-variant/50 mt-0.5">
                Las 4 leyes del cambio de comportamiento.
              </p>

              {/* Grid del Sistema */}
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                {/* La Señal */}
                <div className="bg-surface-container-lowest/30 border border-white/5 rounded-2xl p-4 shadow-inner">
                  <label className="block font-label text-[11px] font-extrabold uppercase tracking-wider text-secondary mb-2">
                    La Señal (Hacerlo Obvio)
                  </label>
                  <textarea
                    placeholder="¿Cuándo y dónde lo harás? Ej. Después de tomar el café por la mañana."
                    value={senal}
                    onChange={(e) => setSenal(e.target.value)}
                    className="w-full h-20 bg-transparent font-sans text-xs text-on-surface placeholder:text-on-surface-variant/35 resize-none outline-none"
                  />
                </div>

                {/* El Anhelo */}
                <div className="bg-surface-container-lowest/30 border border-white/5 rounded-2xl p-4 shadow-inner">
                  <label className="block font-label text-[11px] font-extrabold uppercase tracking-wider text-secondary mb-2">
                    El Anhelo (Hacerlo Atractivo)
                  </label>
                  <textarea
                    placeholder="¿Cómo lo vincularás a algo que ya disfrutas? Ej. Leeré junto a la ventana."
                    value={atractivo}
                    onChange={(e) => setAtractivo(e.target.value)}
                    className="w-full h-20 bg-transparent font-sans text-xs text-on-surface placeholder:text-on-surface-variant/35 resize-none outline-none"
                  />
                </div>

                {/* La Respuesta */}
                <div className="bg-surface-container-lowest/30 border border-white/5 rounded-2xl p-4 shadow-inner">
                  <label className="block font-label text-[11px] font-extrabold uppercase tracking-wider text-secondary mb-2">
                    La Respuesta (Hacerlo Sencillo)
                  </label>
                  <textarea
                    placeholder="¿Cuál es la versión de 2 minutos? Ej. Solo abrir el libro y leer el título del capítulo."
                    value={accion}
                    onChange={(e) => setAccion(e.target.value)}
                    className="w-full h-20 bg-transparent font-sans text-xs text-on-surface placeholder:text-on-surface-variant/35 resize-none outline-none"
                  />
                </div>

                {/* La Recompensa */}
                <div className="bg-surface-container-lowest/30 border border-white/5 rounded-2xl p-4 shadow-inner">
                  <label className="block font-label text-[11px] font-extrabold uppercase tracking-wider text-secondary mb-2">
                    La Recompensa (Hacerlo Satisfactorio)
                  </label>
                  <textarea
                    placeholder="¿Qué satisfacción inmediata obtendrás? Ej. Marcar la casilla con orgullo."
                    value={recompensa}
                    onChange={(e) => setRecompensa(e.target.value)}
                    className="w-full h-20 bg-transparent font-sans text-xs text-on-surface placeholder:text-on-surface-variant/35 resize-none outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECCIÓN 3: Manifiesto Visual */}
        <div className="relative overflow-hidden rounded-[24px] border border-white/5 bg-[#18191b] p-6 shadow-xl border-l-4 border-[#ebc246]">
          <div className="flex items-start gap-4">
            <div className="grid size-10 place-items-center rounded-xl bg-[#332a15] text-[#ebc246] border border-[#594924]/35 shadow-md">
              <Award size={20} />
            </div>
            <div className="flex-1">
              <h3 className="font-sans text-base font-bold text-on-surface">
                3. Manifiesto Visual
              </h3>
              <p className="font-sans text-xs font-semibold text-on-surface-variant/50 mt-0.5">
                Elige el objeto que representará este hábito en tu Santuario Digital.
              </p>

              {/* Colección de Items Placeholder */}
              <div className="mt-6 grid gap-4 grid-cols-2 sm:grid-cols-4">
                {visualElementsList.map((elem) => {
                  const Icon = elem.icon
                  const isSelected = nombreElemento === elem.name

                  if (elem.isUsed) {
                    return (
                      <div
                        key={elem.name}
                        className="relative rounded-2xl border border-white/5 bg-surface-container-lowest/30 p-3 text-center opacity-40 cursor-not-allowed"
                        title="Este elemento ya se encuentra asociado a otro hábito activo."
                      >
                        <div className="aspect-square rounded-xl bg-gradient-to-br from-[#1c1e20] to-[#0a0c0d] relative flex items-center justify-center overflow-hidden border border-white/5 mb-3">
                          <Icon size={24} className="text-on-surface-variant/20" />
                        </div>
                        <span className="font-sans text-xs font-bold text-on-surface-variant/60 block truncate">
                          {elem.name}
                        </span>
                        <span className="mt-1.5 inline-block rounded-md bg-white/5 px-2 py-0.5 font-sans text-[9px] font-semibold text-on-surface-variant/50">
                          En Uso
                        </span>
                      </div>
                    )
                  }

                  return (
                    <div
                      key={elem.name}
                      onClick={() => setNombreElemento(elem.name)}
                      className={`group rounded-2xl border bg-surface-container-lowest p-3 text-center cursor-pointer transition-all duration-300 ${
                        isSelected
                          ? 'border-primary shadow-[0_0_15px_rgba(247,187,126,0.15)] bg-surface-container/60'
                          : 'border-white/5 hover:border-white/10 hover:bg-white/[0.02]'
                      }`}
                    >
                      <div className="aspect-square rounded-xl bg-gradient-to-br from-[#1c1e20] to-[#0a0c0d] relative flex items-center justify-center overflow-hidden border border-white/5 mb-3">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.035)_0%,transparent_70%)]" />
                        <Icon size={24} className={`${elem.iconColor} group-hover:scale-110 transition duration-300`} />
                      </div>
                      <span className="font-sans text-xs font-bold text-on-surface block truncate">
                        {elem.name}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* MODAL CREAR NUEVA IDENTIDAD */}
      <IdentityModal
        isOpen={showIdentityModal}
        onClose={() => setShowIdentityModal(false)}
        onCreateSuccess={handleIdentityCreated}
      />
    </div>
  )
}
