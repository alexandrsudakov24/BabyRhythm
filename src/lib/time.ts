import { format, formatDistanceToNow, differenceInMinutes, differenceInHours } from 'date-fns'
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

/** Age in months from birthDate string (yyyy-MM-dd) */
export function ageInMonths(birthDate: string): number {
  const birth = new Date(birthDate)
  const now   = new Date()
  return (now.getFullYear() - birth.getFullYear()) * 12
    + now.getMonth() - birth.getMonth()
}

/** Recommended awake window in ms based on age in months */
export function recommendedAwakeWindow(ageMonths: number): number {
  if (ageMonths < 2)  return 60 * 60_000
  if (ageMonths < 4)  return 90 * 60_000
  if (ageMonths < 6)  return 2 * 60 * 60_000
  if (ageMonths < 9)  return 2.5 * 60 * 60_000
  if (ageMonths < 12) return 3 * 60 * 60_000
  if (ageMonths < 18) return 4 * 60 * 60_000
  return 5 * 60 * 60_000
}
