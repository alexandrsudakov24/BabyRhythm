import { useTranslation } from 'react-i18next'
import { formatTime, formatDuration } from '../lib/time'
import type { BabyEvent } from '../types'

const typeColor: Record<string, string> = {
  sleep:  'bg-sleep/10 text-sleep',
  feed:   'bg-feed/10 text-feed',
  awake:  'bg-awake/10 text-awake',
  diaper: 'bg-diaper/10 text-diaper',
}
const typeIcon: Record<string, string> = {
  sleep: '🌙', feed: '🍼', awake: '☀️', diaper: '🟡',
}

interface Props { event: BabyEvent }

export function EventRow({ event }: Props) {
  const { t } = useTranslation()
  const dur = event.endTime ? event.endTime - event.startTime : null
  return (
    <div className="flex items-center gap-3 py-2">
      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${typeColor[event.type]}`}>
        {typeIcon[event.type]}
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-white/90 capitalize">{t(`${event.type}.title`)}</div>
        <div className="text-xs text-white/50">{formatTime(event.startTime)}{event.endTime ? ` – ${formatTime(event.endTime)}` : ' →'}</div>
      </div>
      {dur && (
        <span className="text-xs text-white/60 shrink-0">{formatDuration(dur, t)}</span>
      )}
    </div>
  )
}
