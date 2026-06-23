import { useMemo, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { Layout } from "../components/Layout"
import { EventRow } from "../components/EventRow"
import { useBaby } from "../contexts/BabyContext"
import { formatDuration, formatAgo } from "../lib/time"
import { startOfDay } from "date-fns"

export function Dashboard() {
  const { t, i18n } = useTranslation()
  const { events } = useBaby()
  const [now, setNow] = useState(0)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(Date.now())
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const todayStart = useMemo(() => startOfDay(new Date()).getTime(), [])
  const todayEvents = useMemo(
    () => events.filter(e => e.startTime >= todayStart),
    [events, todayStart],
  )

  const totalSleepMs = useMemo(() =>
    todayEvents
      .filter(e => e.type === "sleep" && e.endTime)
      .reduce((sum, e) => sum + (e.endTime! - e.startTime), 0),
    [todayEvents],
  )

  const lastFeed   = events.find(e => e.type === "feed")
  const feedCount  = todayEvents.filter(e => e.type === "feed").length
  const activeSleep = events.find(e => e.type === "sleep" && !e.endTime)
  const activeAwake = events.find(e => e.type === "awake" && !e.endTime)
  const awakeMs = useMemo(
    () => activeAwake ? now - activeAwake.startTime : null,
    [activeAwake, now],
  )

  const stats = [
    { label: t("dashboard.totalSleep"), value: totalSleepMs ? formatDuration(totalSleepMs, t) : "—", icon: "🌙", color: "text-sleep" },
    { label: t("dashboard.feedCount"),  value: feedCount > 0 ? String(feedCount) : "—",          icon: "🍼", color: "text-feed" },
    { label: t("dashboard.awakeFor"),   value: awakeMs ? formatDuration(awakeMs, t) : "—",       icon: "☀️",  color: "text-awake" },
    { label: t("dashboard.lastFeed"),   value: lastFeed ? formatAgo(lastFeed.startTime, i18n.language) : "—", icon: "⏱️", color: "text-white/60" },
  ]

  return (
    <Layout title={t("dashboard.title")}>
      {activeSleep && (
        <div className="mt-4 bg-sleep/10 border border-sleep/30 rounded-2xl px-4 py-3 flex items-center gap-3">
          <span className="text-2xl animate-pulse">🌙</span>
          <div>
            <p className="text-sm font-semibold text-sleep">{t("sleep.sleeping")}</p>
            <p className="text-xs text-white/40">{formatAgo(activeSleep.startTime, i18n.language)}</p>
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 gap-3 mt-4">
        {stats.map(s => (
          <div key={s.label} className="bg-slate-900 rounded-2xl px-4 py-4">
            <div className="text-xl mb-1">{s.icon}</div>
            <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-white/40 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="mt-6">
        <h2 className="text-sm font-semibold text-white/50 mb-2 uppercase tracking-wider">
          {t("sleep.history")}
        </h2>
        {todayEvents.length === 0
          ? <p className="text-white/30 text-sm text-center py-8">{t("dashboard.noData")}</p>
          : <div className="bg-slate-900 rounded-2xl px-4 divide-y divide-white/5">
              {todayEvents.slice(0, 10).map(e => <EventRow key={e.id} event={e} />)}
            </div>
        }
      </div>
    </Layout>
  )
}
