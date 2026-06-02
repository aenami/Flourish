import {
  Activity,
  Apple,
  ArrowLeft,
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
  Smartphone,
  Sparkles,
  Timer,
  Target,
  Zap,
  AlertTriangle,
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

interface CreateNegativeFormProps {
  onCancel: () => void
  onSaveSuccess: () => void
  identities: Identidad[]
  refreshIdentities: () => Promise<void>
  usedElementNames: string[]
}

export function CreateNegativeForm({
  onCancel,
  onSaveSuccess,
  identities,
  refreshIdentities,
}: CreateNegativeFormProps) {
  // Stepper state (1 a 5)
  const [currentStep, setCurrentStep] = useState(1)

  // Paso 1: La Señal
  const [detonante, setDetonante] = useState('')
  const [evasion, setEvasion] = useState('')

  // Paso 2: El Deseo
  const [deseo, setDeseo] = useState('')
  const [reduccion, setReduccion] = useState('')

  // Paso 3: La Acción
  const [accionEvitar, setAccionEvitar] = useState('')
  const [friccion, setFriccion] = useState('')

  // Paso 4: El Costo
  const [consecuencia, setConsecuencia] = useState('')
  const [compromiso, setCompromiso] = useState('')

  // Paso 5: La Identidad (Contrato)
  const [nombreHabito, setNombreHabito] = useState('')
  const [idIdentidad, setIdIdentidad] = useState('')
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5, 6, 7])
  const [selectedIcon, setSelectedIcon] = useState('CheckCircle')

  // Modal de Identidad
  const [showIdentityModal, setShowIdentityModal] = useState(false)

  // Estado para mensajes de error de validación
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const daysOfWeek = [
    { label: 'L', value: 1 },
    { label: 'M', value: 2 },
    { label: 'X', value: 3 },
    { label: 'J', value: 4 },
    { label: 'V', value: 5 },
    { label: 'S', value: 6 },
    { label: 'D', value: 7 },
  ]

  const stepsMetadata = [
    { num: 1, name: 'Identidad', icon: Fingerprint },
    { num: 2, name: 'Señal', icon: Target },
    { num: 3, name: 'Deseo', icon: Heart },
    { num: 4, name: 'Acción', icon: Zap },
    { num: 5, name: 'Costo', icon: AlertTriangle },
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
      e.target.value = idIdentidad
    } else {
      setIdIdentidad(val)
    }
  }

  const handleIdentityCreated = async (newId: string) => {
    await refreshIdentities()
    setIdIdentidad(newId)
  }

  const handleNextStep = () => {
    setErrorMessage(null)
    if (currentStep === 1) {
      if (!nombreHabito.trim()) {
        setErrorMessage('Por favor, introduce el nombre del hábito.')
        return
      }
      if (selectedDays.length === 0) {
        setErrorMessage('Por favor, selecciona al menos un día de control.')
        return
      }
    } else if (currentStep === 2) {
      if (!detonante.trim() || !evasion.trim()) {
        setErrorMessage('Por favor, completa la información de La Señal para continuar.')
        return
      }
    } else if (currentStep === 3) {
      if (!deseo.trim() || !reduccion.trim()) {
        setErrorMessage('Por favor, completa la información del Deseo para continuar.')
        return
      }
    } else if (currentStep === 4) {
      if (!accionEvitar.trim() || !friccion.trim()) {
        setErrorMessage('Por favor, completa la información de La Acción para continuar.')
        return
      }
    }
    setCurrentStep((prev) => Math.min(prev + 1, 5))
  }

  const handlePrevStep = () => {
    setErrorMessage(null)
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSaveHabit = async () => {
    setErrorMessage(null)
    if (!consecuencia.trim() || !compromiso.trim()) {
      setErrorMessage('Por favor, completa la información del Costo para guardar el hábito.')
      return
    }

    // Compilamos los campos detallados en las claves del sistema esperadas por el backend y HabitCard
    const payload = {
      nombre_habito: nombreHabito.trim(),
      tipo_habito: 'NEGATIVO',
      sistema_habito: {
        senal: `Detonante: ${detonante.trim()}\n→ Evasión: ${evasion.trim()}`,
        emocion: `Deseo: ${deseo.trim()}\n→ Reducción: ${reduccion.trim()}`,
        accion: `Acción a evitar: ${accionEvitar.trim()}\n→ Fricción: ${friccion.trim()}`,
        consecuencia: `Consecuencia: ${consecuencia.trim()}\n→ Compromiso: ${compromiso.trim()}`,
        objetivo: 'Evitar recaídas',
        icono: selectedIcon,
      },
      dias_semana: selectedDays,
      id_identidad: idIdentidad ? Number(idIdentidad) : null,
      nombre_elemento: 'Personalizado', // Omitimos visual element dinámico para hábitos negativos
    }

    try {
      const response = await api.post('/habits', payload)
      if (response && !response.error) {
        onSaveSuccess()
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Error al guardar el hábito')
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

        <h2 className="font-sans text-lg font-bold text-on-surface">Desmontar un Hábito</h2>

        <div className="size-9" /> {/* Placeholder para equilibrar */}
      </header>

      {errorMessage && (
        <div className="mt-6 max-w-3xl mx-auto px-4">
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-error/25 bg-error/10 p-4 text-sm text-error relative overflow-hidden backdrop-blur-md">
            <div className="flex items-center gap-3">
              <AlertTriangle size={18} className="shrink-0" />
              <span className="font-sans font-medium text-left leading-normal">{errorMessage}</span>
            </div>
            <button 
              type="button"
              onClick={() => setErrorMessage(null)}
              className="text-error/60 hover:text-error transition font-sans font-bold text-xs px-2 py-1 rounded-lg hover:bg-error/10 cursor-pointer"
            >
              Descartar
            </button>
          </div>
        </div>
      )}

      {/* Bloque de Títulos del Formulario */}
      <div className="mt-10 text-left max-w-3xl mx-auto px-4">
        <h2 className="font-sans text-3xl font-extrabold text-on-surface tracking-tight">
          Desmontar un Hábito
        </h2>
        <p className="mt-3 font-sans text-sm leading-relaxed text-on-surface-variant/80">
          La deconstrucción de un hábito negativo requiere honestidad radical. Entiende las causas para poder erradicarlo.
        </p>
      </div>

      {/* Stepper superior */}
      <div className="mt-8 max-w-3xl mx-auto px-4">
        {/* Barra de progreso segmentada */}
        <div className="grid grid-cols-5 gap-2.5 h-1.5 rounded-full overflow-hidden bg-white/5 p-0.5">
          {stepsMetadata.map((step) => {
            const isActiveOrPassed = step.num <= currentStep
            return (
              <div
                key={step.num}
                className={`h-full rounded-full transition-all duration-300 ${
                  isActiveOrPassed ? 'bg-primary' : 'bg-white/5'
                }`}
              />
            )
          })}
        </div>

        {/* Pestañas de navegación */}
        <div className="mt-6 flex flex-wrap gap-2.5">
          {stepsMetadata.map((step) => {
            const StepIcon = step.icon
            const isCurrent = step.num === currentStep
            return (
              <button
                key={step.num}
                type="button"
                onClick={() => {
                  setErrorMessage(null)
                  // Permitir navegar atrás de forma libre, y adelante solo si los pasos previos están completos
                  if (step.num < currentStep) {
                    setCurrentStep(step.num)
                  } else if (step.num > currentStep) {
                    // Validar paso actual para poder avanzar
                    if (currentStep === 1 && nombreHabito.trim() && selectedDays.length > 0) {
                      setCurrentStep(step.num)
                    } else if (currentStep === 2 && detonante.trim() && evasion.trim()) {
                      setCurrentStep(step.num)
                    } else if (currentStep === 3 && deseo.trim() && reduccion.trim()) {
                      setCurrentStep(step.num)
                    } else if (currentStep === 4 && accionEvitar.trim() && friccion.trim()) {
                      setCurrentStep(step.num)
                    } else {
                      setErrorMessage('Por favor, completa la información del paso actual antes de continuar.')
                    }
                  }
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border font-sans text-xs font-bold transition duration-200 ${
                  isCurrent
                    ? 'border-primary bg-primary/10 text-primary shadow-[0_0_12px_rgba(247,187,126,0.1)]'
                    : 'border-white/5 bg-surface-container-low/40 text-on-surface-variant/80 hover:border-white/10 hover:text-on-surface'
                }`}
              >
                <StepIcon size={14} />
                <span>{step.name}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Contenedor del Paso Activo */}
      <div className="mt-8 max-w-3xl mx-auto px-4 mb-24">
        <div className="relative overflow-hidden rounded-3xl border bg-[#18191b] p-6 shadow-xl border-l-4 border-primary">
          
           {/* PASO 2: LA SEÑAL */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-xl bg-[#2f271d] text-primary border border-[#4d3d2c]/35 shadow-md">
                  <Target size={20} />
                </div>
                <div>
                  <h3 className="font-sans text-base font-bold text-on-surface">2. La Señal</h3>
                  <p className="font-sans text-xs text-on-surface-variant/60">
                    ¿Qué dispara este comportamiento? ¿Dónde estás, qué hora es, con quién estás?
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant/75 mb-2">
                    Identifica el detonante
                  </label>
                  <textarea
                    placeholder="Ej: Cuando llego a casa cansado del trabajo..."
                    value={detonante}
                    onChange={(e) => setDetonante(e.target.value)}
                    className="w-full h-24 bg-surface-container-lowest/30 border border-white/5 rounded-2xl p-4 shadow-inner text-sm text-on-surface placeholder:text-on-surface-variant/35 resize-none outline-none focus:border-primary/40 transition"
                  />
                </div>

                <div>
                  <label className="block font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant/75 mb-2">
                    Plan de evasión (Hazlo invisible)
                  </label>
                  <textarea
                    placeholder="¿Cómo vas a evitar exponerte a esta señal?"
                    value={evasion}
                    onChange={(e) => setEvasion(e.target.value)}
                    className="w-full h-24 bg-surface-container-lowest/30 border border-white/5 rounded-2xl p-4 shadow-inner text-sm text-on-surface placeholder:text-on-surface-variant/35 resize-none outline-none focus:border-primary/40 transition"
                  />
                </div>
              </div>
            </div>
          )}

          {/* PASO 3: EL DESEO */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-xl bg-[#2f271d] text-primary border border-[#4d3d2c]/35 shadow-md">
                  <Heart size={20} />
                </div>
                <div>
                  <h3 className="font-sans text-base font-bold text-on-surface">3. El Deseo</h3>
                  <p className="font-sans text-xs text-on-surface-variant/60">
                    ¿Qué necesidad crees que satisface este comportamiento? ¿Qué recompensa buscas?
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant/75 mb-2">
                    Describe el deseo / necesidad
                  </label>
                  <textarea
                    placeholder="Ej: Necesito distraerme del aburrimiento o relajarme del estrés acumulado..."
                    value={deseo}
                    onChange={(e) => setDeseo(e.target.value)}
                    className="w-full h-24 bg-surface-container-lowest/30 border border-white/5 rounded-2xl p-4 shadow-inner text-sm text-on-surface placeholder:text-on-surface-variant/35 resize-none outline-none focus:border-primary/40 transition"
                  />
                </div>

                <div>
                  <label className="block font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant/75 mb-2">
                    Plan de reducción (Hazlo poco atractivo)
                  </label>
                  <textarea
                    placeholder="¿Cómo puedes replantear este deseo o hacerlo ver poco atractivo?"
                    value={reduccion}
                    onChange={(e) => setReduccion(e.target.value)}
                    className="w-full h-24 bg-surface-container-lowest/30 border border-white/5 rounded-2xl p-4 shadow-inner text-sm text-on-surface placeholder:text-on-surface-variant/35 resize-none outline-none focus:border-primary/40 transition"
                  />
                </div>
              </div>
            </div>
          )}

          {/* PASO 4: LA ACCIÓN */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-xl bg-[#2f271d] text-primary border border-[#4d3d2c]/35 shadow-md">
                  <Zap size={20} />
                </div>
                <div>
                  <h3 className="font-sans text-base font-bold text-on-surface">4. La Acción</h3>
                  <p className="font-sans text-xs text-on-surface-variant/60">
                    ¿Cuál es el comportamiento específico que quieres eliminar?
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant/75 mb-2">
                    Define la acción a evitar
                  </label>
                  <textarea
                    placeholder="Ej: Revisar el teléfono apenas entro a la cama..."
                    value={accionEvitar}
                    onChange={(e) => setAccionEvitar(e.target.value)}
                    className="w-full h-24 bg-surface-container-lowest/30 border border-white/5 rounded-2xl p-4 shadow-inner text-sm text-on-surface placeholder:text-on-surface-variant/35 resize-none outline-none focus:border-primary/40 transition"
                  />
                </div>

                <div>
                  <label className="block font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant/75 mb-2">
                    Plan de fricción (Hazlo difícil)
                  </label>
                  <textarea
                    placeholder="¿Cómo vas a añadir obstáculos físicos o digitales para dificultar la acción?"
                    value={friccion}
                    onChange={(e) => setFriccion(e.target.value)}
                    className="w-full h-24 bg-surface-container-lowest/30 border border-white/5 rounded-2xl p-4 shadow-inner text-sm text-on-surface placeholder:text-on-surface-variant/35 resize-none outline-none focus:border-primary/40 transition"
                  />
                </div>
              </div>
            </div>
          )}

          {/* PASO 5: EL COSTO */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-xl bg-[#2f271d] text-primary border border-[#4d3d2c]/35 shadow-md">
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <h3 className="font-sans text-base font-bold text-on-surface">5. El Costo</h3>
                  <p className="font-sans text-xs text-on-surface-variant/60">
                    ¿Qué consecuencia negativa tiene esta acción sobre tu vida?
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant/75 mb-2">
                    Costo / Consecuencia (Hazlo insatisfactorio)
                  </label>
                  <textarea
                    placeholder="Ej: Pierdo 1 hora de sueño y amanezco cansado al día siguiente..."
                    value={consecuencia}
                    onChange={(e) => setConsecuencia(e.target.value)}
                    className="w-full h-24 bg-surface-container-lowest/30 border border-white/5 rounded-2xl p-4 shadow-inner text-sm text-on-surface placeholder:text-on-surface-variant/35 resize-none outline-none focus:border-primary/40 transition"
                  />
                </div>

                <div>
                  <label className="block font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant/75 mb-2">
                    Plan de castigo o compromiso
                  </label>
                  <textarea
                    placeholder="¿Qué penalización tendrás o a qué socio de compromiso reportarás?"
                    value={compromiso}
                    onChange={(e) => setCompromiso(e.target.value)}
                    className="w-full h-24 bg-surface-container-lowest/30 border border-white/5 rounded-2xl p-4 shadow-inner text-sm text-on-surface placeholder:text-on-surface-variant/35 resize-none outline-none focus:border-primary/40 transition"
                  />
                </div>
              </div>
            </div>
          )}

          {/* PASO 1: LA IDENTIDAD */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-xl bg-[#2f271d] text-primary border border-[#4d3d2c]/35 shadow-md">
                  <Fingerprint size={20} />
                </div>
                <div>
                  <h3 className="font-sans text-base font-bold text-on-surface">1. El Contrato de Identidad</h3>
                  <p className="font-sans text-xs text-on-surface-variant/60">
                    Asocia este hábito a la identidad que quieres proteger y define su horario.
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                {/* Selector de Identidades */}
                <div>
                  <label className="block font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant/75 mb-2">
                    Identidad que quieres proteger
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
                    Nombre del Hábito a Eliminar
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Evitar revisar redes en la cama"
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
                              : 'border-white/5 bg-surface-container-lowest text-on-surface-variant/80 hover:border-white/10 hover:bg-white/2 hover:text-on-surface'
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
                    Días de control de la semana
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
          )}

          {/* Botones de navegación del Stepper */}
          <div className="mt-8 pt-5 border-t border-white/5 flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                className="inline-flex h-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-5 font-sans text-xs font-bold text-on-surface hover:bg-white/10 transition duration-200"
              >
                Volver
              </button>
            ) : (
              <div />
            )}

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="inline-flex h-10 items-center justify-center rounded-xl bg-primary px-6 font-sans text-xs font-bold text-on-primary shadow-lg hover:bg-primary-fixed transition duration-200"
              >
                Siguiente
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSaveHabit}
                className="inline-flex h-10 items-center justify-center rounded-xl bg-primary px-6 font-sans text-xs font-bold text-on-primary shadow-lg hover:bg-primary-fixed transition duration-200"
              >
                Guardar Hábito
              </button>
            )}
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
