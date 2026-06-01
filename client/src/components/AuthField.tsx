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
          ? 'grid gap-1.5 font-label text-[13px] font-semibold text-on-surface-variant'
          : 'grid gap-2 font-label text-sm font-semibold text-on-surface-variant'
      }
    >
      <span>{label}</span>
      <div
        className={
          compact
            ? 'grid min-h-11 grid-cols-[auto_minmax(0,1fr)_auto] items-center rounded-lg border border-white/10 bg-surface-container-lowest px-3.5 text-on-surface-variant transition focus-within:border-primary/60 focus-within:bg-surface focus-within:shadow-[0_0_0_4px_rgba(247,187,126,0.08)]'
            : 'grid min-h-14 grid-cols-[auto_minmax(0,1fr)_auto] items-center rounded-lg border border-white/10 bg-surface-container-high px-4 text-on-surface-variant transition focus-within:border-primary/60 focus-within:bg-surface-container-highest focus-within:shadow-[0_0_0_4px_rgba(247,187,126,0.08)]'
        }
      >
        {icon}
        <input
          autoComplete={autoComplete}
          className="min-w-0 bg-transparent px-3 font-sans text-on-surface outline-none placeholder:text-outline/70"
          inputMode={inputMode}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          type={type}
          value={value}
        />
        {trailing}
      </div>
      {helperText ? <small className="text-xs font-semibold text-outline">{helperText}</small> : null}
    </label>
  )
}
