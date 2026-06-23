import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'

interface Props {
  value: number        // Unix ms
  onChange: (ms: number) => void
  label?: string
}

function toDatetimeLocal(ms: number): string {
  const d = new Date(ms)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export function TimeAdjuster({ value, onChange, label }: Props) {
  const { t } = useTranslation()
  const [maxTime, setMaxTime] = useState<string>()

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMaxTime(toDatetimeLocal(Date.now()))
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const ms = new Date(e.target.value).getTime()
    if (!isNaN(ms)) onChange(ms)
  }

  return (
    <div className="flex flex-col gap-1">
      {label && <p className="text-xs text-white/40">{label}</p>}
      <input
        type="datetime-local"
        value={toDatetimeLocal(value)}
        onChange={handleChange}
        max={maxTime}
        className="bg-slate-800 text-white rounded-xl px-4 py-3 text-base outline-none
                   focus:ring-2 focus:ring-feed [color-scheme:dark]"
      />
      <p className="text-xs text-white/30">{t('common.timeAdjustHint')}</p>
    </div>
  )
}
