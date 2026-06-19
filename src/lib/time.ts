import { format, formatDistanceToNow } from 'date-fns'
import { ru, enUS } from 'date-fns/locale'

export function getLocale(lang: string) {
  return lang.startsWith('ru') ? ru : enUS
}

export function formatDuration(ms: number, t: (k: string) => string): string {
  if (ms < 60_000) return t('common.just_now')
  const h = Math.floor(ms / 3_600_000)
  const m = Math.floor((ms % 3_600_000) / 60_000)
  if (h === 0) return `${m} ${t('common.min')}`
  if (m === 0) return `${h} ${t('common.h')}`
  return `${h} ${t('common.h')} ${m} ${t('common.min')}`
}

export function formatAgo(ts: number, lang: string): string {
  return formatDistanceToNow(ts, { addSuffix: true, locale: getLocale(lang) })
}

export function formatTime(ts: number): string {
  return format(ts, 'HH:mm')
}

export function formatDate(ts: number, lang: string): string {
  return format(ts, 'dd MMM', { locale: getLocale(lang) })
}
