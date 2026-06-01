import { Eye, EyeOff } from 'lucide-react'

type AuthPasswordToggleProps = {
  isVisible: boolean
  labelWhenHidden: string
  labelWhenVisible: string
  onToggle: () => void
  size?: number
}

export function AuthPasswordToggle({
  isVisible,
  labelWhenHidden,
  labelWhenVisible,
  onToggle,
  size = 20,
}: AuthPasswordToggleProps) {
  return (
    <button
      aria-label={isVisible ? labelWhenVisible : labelWhenHidden}
      className="grid size-9 place-items-center rounded-lg text-on-surface-variant transition hover:bg-primary/10 hover:text-primary"
      onClick={onToggle}
      type="button"
    >
      {isVisible ? <Eye size={size} /> : <EyeOff size={size} />}
    </button>
  )
}
