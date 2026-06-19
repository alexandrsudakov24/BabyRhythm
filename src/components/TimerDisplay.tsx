interface Props { ms: number; className?: string }

export function TimerDisplay({ ms, className = '' }: Props) {
  const h = Math.floor(ms / 3_600_000)
  const m = Math.floor((ms % 3_600_000) / 60_000)
  const s = Math.floor((ms % 60_000) / 1_000)
  const pad = (n: number) => String(n).padStart(2, '0')
  return (
    <span className={`font-mono tabular-nums ${className}`}>
      {h > 0 && <>{pad(h)}:</>}{pad(m)}:{pad(s)}
    </span>
  )
}
