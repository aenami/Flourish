import { Leaf } from 'lucide-react'

type AuthBrandProps = {
  compact?: boolean
}

export function AuthBrand({ compact = false }: AuthBrandProps) {
  const iconSize = compact ? 16 : 22

  return (
    <div className="relative z-10 inline-flex items-center gap-2 text-[#e2e2e5]">
      <span
        className={
          compact
            ? 'grid size-7 place-items-center rounded-lg bg-[#f7bb7e] text-[#2c1600] shadow-[0_10px_26px_rgba(247,187,126,0.14)]'
            : 'grid size-11 place-items-center rounded-xl bg-[#f7bb7e] text-[#2c1600] shadow-[0_14px_34px_rgba(247,187,126,0.16)]'
        }
      >
        <Leaf size={iconSize} fill="currentColor" />
      </span>
      <strong
        className={
          compact
            ? 'font-["Manrope"] text-base font-bold leading-none tracking-normal'
            : 'font-["Manrope"] text-3xl font-bold leading-none tracking-normal'
        }
      >
        Flourish
      </strong>
    </div>
  )
}
