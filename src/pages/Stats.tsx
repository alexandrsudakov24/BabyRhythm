import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { startOfDay, subDays, format } from 'date-fns'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts'
import { Layout } from '../components/Layout'
import { useBaby } from '../contexts/BabyContext'
import { formatDuration, getLocale } from '../lib/time'

export function Stats() {
  const { t, i18n } = useTranslation()
  const { events } = useBaby()
  const locale = getLocale(i18n.language)

  // Build last-7-days sleep chart data
  const chartData = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const day = subDays(new Date(), 6 - i)
      const dayStart = startOfDay(day).getTime()
      const dayEnd   = dayStart + 86_400_000
      const totalMs  = events
        .filter(e => e.type === 'sleep' && e.endTime && e.startTime >= dayStart && e.startTime < dayEnd)
        .reduce((s, e) => s + (e.endTime! - e.startTime), 0)
      return {
        label: format(day, 'EEE', { locale }),
        hours: Math.round(totalMs / 36_000) / 100,  // 2 decimals
        ms: totalMs,
      }
    })
  }, [events, locale])

  const avgSleepMs = useMemo(() => {
    const days = chartData.filter(d => d.ms > 0)
    return days.length ? days.reduce((s, d) => s + d.ms, 0) / days.length : 0
  }, [chartData])

  const longestSleepMs = useMemo(() =>
    events
      .filter(e => e.type === 'sleep' && e.endTime)
      .reduce((max, e) => Math.max(max, e.endTime! - e.startTime), 0),
    [events],
  )

  const avgFeedsPerDay = useMemo(() => {
    const days = new Set(
      events.filter(e => e.type === 'feed').map(e => format(new Date(e.startTime), 'yyyy-MM-dd'))
    ).size || 1
    return (events.filter(e => e.type === 'feed').length / days).toFixed(1)
  }, [events])

  const longestAwakeMs = useMemo(() =>
    events
      .filter(e => e.type === 'awake' && e.endTime)
      .reduce((max, e) => Math.max(max, e.endTime! - e.startTime), 0),
    [events],
  )

  return (
    <Layout title={t('stats.title')}>
      <p className="text-xs text-white/40 mt-4 mb-3 uppercase tracking-wider">{t('stats.week')}</p>

      {/* Bar chart */}
      <div className="bg-slate-900 rounded-2xl px-2 py-4 mb-4">
        <p className="text-xs text-white/40 mb-3 px-2">{t('stats.sleepChart')}</p>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={chartData} barSize={28}>
            <XAxis dataKey="label" tick={{ fill: '#ffffff50', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis hide domain={[0, 'auto']} />
            <Tooltip
              contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 12, fontSize: 12 }}
              labelStyle={{ color: '#ffffff80' }}
              formatter={(v: number) => [`${v}h`, '']}
            />
            <Bar dataKey="hours" radius={[6, 6, 0, 0]}>
              {chartData.map((d, i) => (
                <Cell key={i} fill={d.hours > 0 ? '#6366f1' : '#1e293b'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: t('stats.avgSleep'),    value: formatDuration(avgSleepMs, t),    icon: '🌙' },
          { label: t('stats.avgFeeds'),    value: avgFeedsPerDay,                   icon: '🍼' },
          { label: t('stats.longestSleep'),value: formatDuration(longestSleepMs, t),icon: '💤' },
          { label: t('stats.longestAwake'),value: formatDuration(longestAwakeMs, t),icon: '☀️' },
        ].map(c => (
          <div key={c.label} className="bg-slate-900 rounded-2xl px-4 py-4">
            <div className="text-xl mb-1">{c.icon}</div>
            <div className="text-lg font-bold text-white/90">{c.value}</div>
            <div className="text-xs text-white/40 mt-0.5">{c.label}</div>
          </div>
        ))}
      </div>
    </Layout>
  )
}
