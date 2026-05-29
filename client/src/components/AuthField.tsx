import type { ComponentPropsWithoutRef, ReactNode } from 'react'

type AuthFieldProps = {
  autoComplete: string
  compact?: boolean
  helperText?: string
  icon: ReactNode
  inputMode?: ComponentPropsWithoutRef<'input'>['inputMode']
  label: string
  onChange: (value: string) => void
  placeholder: string
  trailing?: ReactNode
  type: ComponentPropsWithoutRef<'input'>['type']
  value: string
}

export function AuthField({
  autoComplete,
  compact = false,
  helperText,
  icon,
  inputMode,
  label,
  onChange,
  placeholder,
  trailing,
  type,
  value,
}: AuthFieldProps) {
  return (
    <label
      className={
        compact
          ? 'grid gap-1 font-["Plus_Jakarta_Sans"] text-xs font-semibold text-[#d5c3b5]'
          : 'grid gap-2 font-["Plus_Jakarta_Sans"] text-sm font-semibold text-[#d5c3b5]'
      }
    >
      <span>{label}</span>
      <div
        className={
          compact
            ? 'grid min-h-10 grid-cols-[auto_minmax(0,1fr)_auto] items-center rounded-lg border border-white/10 bg-[#0c0e10] px-3 text-[#d5c3b5] transition focus-within:border-[#f7bb7e]/60 focus-within:bg-[#121416] focus-within:shadow-[0_0_0_4px_rgba(247,187,126,0.08)]'
            : 'grid min-h-14 grid-cols-[auto_minmax(0,1fr)_auto] items-center rounded-lg border border-white/10 bg-[#282a2c] px-4 text-[#d5c3b5] transition focus-within:border-[#f7bb7e]/60 focus-within:bg-[#333537] focus-within:shadow-[0_0_0_4px_rgba(247,187,126,0.08)]'
        }
      >
        {icon}
        <input
          autoComplete={autoComplete}
          className="min-w-0 bg-transparent px-3 font-['Manrope'] text-[#e2e2e5] outline-none placeholder:text-[#9d8e81]/70"
          inputMode={inputMode}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          type={type}
          value={value}
        />
        {trailing}
      </div>
      {helperText ? <small className="text-[11px] font-semibold text-[#9d8e81]">{helperText}</small> : null}
    </label>
  )
}
