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
      className="grid size-9 place-items-center rounded-lg text-[#d5c3b5] transition hover:bg-[#f7bb7e]/10 hover:text-[#f7bb7e]"
      onClick={onToggle}
      type="button"
    >
      {isVisible ? <Eye size={size} /> : <EyeOff size={size} />}
    </button>
  )
}
