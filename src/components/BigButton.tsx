import { type ButtonHTMLAttributes } from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean
  color?: 'sleep' | 'feed' | 'awake' | 'diaper'
  size?: 'lg' | 'xl'
}

const colors = {
  sleep:  { on: 'bg-sleep text-white',   off: 'bg-sleep/10 text-sleep' },
  feed:   { on: 'bg-feed text-white',     off: 'bg-feed/10 text-feed' },
  awake:  { on: 'bg-awake text-white',   off: 'bg-awake/10 text-awake' },
  diaper: { on: 'bg-diaper text-white', off: 'bg-diaper/10 text-diaper' },
}

export function BigButton({ active, color = 'sleep', size = 'xl', children, className = '', ...props }: Props) {
  const c = colors[color]
  const s = size === 'xl'
    ? 'w-40 h-40 text-lg rounded-full'
    : 'w-28 h-28 text-base rounded-full'
  return (
    <button
      {...props}
      className={`
        ${s} ${active ? c.on : c.off}
        font-semibold transition-all duration-200
        active:scale-95 flex flex-col items-center justify-center gap-2
        ${className}
      `}
    >
      {children}
    </button>
  )
}
