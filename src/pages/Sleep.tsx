import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { startOfDay } from "date-fns"
import { Layout } from "../components/Layout"
import { BigButton } from "../components/BigButton"
import { TimerDisplay } from "../components/TimerDisplay"
import { EventRow } from "../components/EventRow"
import { useActiveSession } from "../hooks/useActiveSession"
import { useBaby } from "../contexts/BabyContext"
import { formatDuration } from "../lib/time"

export function Sleep() {
  const { t } = useTranslation()
  const { active, elapsed, start, stop } = useActiveSession("sleep")
  const { events } = useBaby()

  const todayStart = useMemo(() => startOfDay(new Date()).getTime(), [])
  const todaySleeps = useMemo(
    () => events.filter(e => e.type === "sleep" && e.startTime >= todayStart),
    [events, todayStart],
  )
  const totalMs = useMemo(
    () => todaySleeps.filter(e => e.endTime).reduce((s, e) => s + (e.endTime! - e.startTime), 0),
    [todaySleeps],
  )

  return (
    <Layout title={t("sleep.title")}>
      <div className="flex flex-col items-center gap-6 py-8">
        <BigButton active={!!active} color="sleep" onClick={active ? stop : start}>
          <span className="text-3xl">{active ? "🌙" : "😴"}</span>
          <span className="text-xs font-semibold">{active ? t("sleep.stop") : t("sleep.start")}</span>
        </BigButton>
        {active && (
          <div className="text-center">
            <p className="text-xs text-white/60 mb-2">{t("sleep.sleeping")}</p>
            <TimerDisplay ms={elapsed} className="text-3xl text-sleep font-bold" />
          </div>
        )}
      </div>
      <div className="bg-slate-900 rounded-2xl px-4 py-4 flex justify-between items-center mb-4">
        <div>
          <p className="text-xs text-white/60">{t("sleep.total")}</p>
          <p className="text-lg font-bold text-sleep mt-1">{formatDuration(totalMs, t)}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-white/60">{t("sleep.sessions")}</p>
          <p className="text-lg font-bold text-white/80 mt-1">{todaySleeps.length}</p>
        </div>
      </div>
      <h2 className="text-xs font-semibold text-white/60 mb-3 uppercase tracking-wider">{t("sleep.history")}</h2>
      {todaySleeps.length === 0
        ? <p className="text-white/50 text-sm text-center py-6">{t("dashboard.noData")}</p>
        : <div className="bg-slate-900 rounded-2xl px-4 divide-y divide-white/5">
            {todaySleeps.map(e => <EventRow key={e.id} event={e} />)}
          </div>
      }
    </Layout>
  )
}
