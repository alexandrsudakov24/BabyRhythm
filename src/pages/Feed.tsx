import { useState, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { startOfDay } from "date-fns"
import { Layout } from "../components/Layout"
import { EventRow } from "../components/EventRow"
import { TimeAdjuster } from "../components/TimeAdjuster"
import { useBaby } from "../contexts/BabyContext"
import { useAuth } from "../contexts/AuthContext"
import { addEvent } from "../lib/firestore"
import { formatAgo, formatDuration } from "../lib/time"
import type { BabyEvent } from "../types"

const FEED_TYPES: BabyEvent["feedType"][] = ["breast_left", "breast_right", "bottle", "solid"]

export function Feed() {
  const { t, i18n } = useTranslation()
  const { user } = useAuth()
  const { baby, events } = useBaby()

  const [sheet, setSheet] = useState(false)
  const [feedType, setFeedType] = useState<BabyEvent["feedType"]>("breast_left")
  const [amountMl, setAmountMl] = useState("")
  const [feedTime, setFeedTime] = useState(Date.now())
  const [saving, setSaving] = useState(false)

  const todayStart = useMemo(() => startOfDay(new Date()).getTime(), [])
  const feedings = useMemo(
    () => events.filter(e => e.type === "feed" && e.startTime >= todayStart),
    [events, todayStart],
  )
  const lastFeed = events.find(e => e.type === "feed")
  const intervalMs = lastFeed ? Date.now() - lastFeed.startTime : null

  const openSheet = () => {
    setFeedTime(Date.now())
    setAmountMl("")
    setFeedType("breast_left")
    setSheet(true)
  }

  const logFeed = async () => {
    if (!user || !baby) return
    setSaving(true)
    await addEvent(user.uid, baby.id, {
      type: "feed",
      startTime: feedTime,
      endTime: feedTime,
      feedType,
      amountMl: amountMl ? Number(amountMl) : undefined,
    })
    setSaving(false)
    setSheet(false)
  }

  return (
    <Layout title={t("feed.title")}>
      <div className="bg-slate-900 rounded-2xl px-4 py-5 mt-4 flex justify-between items-center">
        <div>
          <p className="text-xs text-white/40">{t("feed.lastFeed")}</p>
          <p className="text-lg font-bold text-white/90">
            {lastFeed ? formatAgo(lastFeed.startTime, i18n.language) : "—"}
          </p>
        </div>
        {intervalMs && (
          <div className="text-right">
            <p className="text-xs text-white/40">{t("feed.interval")}</p>
            <p className="text-lg font-bold text-feed">{formatDuration(intervalMs, t)}</p>
          </div>
        )}
      </div>

      <div className="flex justify-center py-8">
        <button
          onClick={openSheet}
          className="w-36 h-36 rounded-full bg-feed/10 text-feed flex flex-col items-center justify-center gap-1 text-sm font-semibold active:scale-95 transition-transform"
        >
          <span className="text-4xl">🍼</span>
          <span>{t("feed.log")}</span>
        </button>
      </div>

      <h2 className="text-sm font-semibold text-white/50 mb-2 uppercase tracking-wider">{t("feed.history")}</h2>
      {feedings.length === 0
        ? <p className="text-white/30 text-sm text-center py-6">{t("dashboard.noData")}</p>
        : <div className="bg-slate-900 rounded-2xl px-4 divide-y divide-white/5">
            {feedings.map(e => <EventRow key={e.id} event={e} />)}
          </div>
      }

      {sheet && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSheet(false)} />
          <div className="relative w-full bg-slate-900 rounded-t-3xl px-5 pt-5 pb-10 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-2" />
            <h3 className="text-base font-bold text-white">{t("feed.log")}</h3>

            <div className="grid grid-cols-2 gap-2">
              {FEED_TYPES.map(ft => (
                <button
                  key={ft}
                  onClick={() => setFeedType(ft)}
                  className={`py-3 rounded-xl text-sm font-medium transition-colors ${feedType === ft ? "bg-feed text-white" : "bg-slate-800 text-white/60"}`}
                >
                  {t(`feed.type.${ft}`)}
                </button>
              ))}
            </div>

            {(feedType === "bottle" || feedType === "solid") && (
              <input
                type="number"
                inputMode="numeric"
                placeholder={t("feed.amount")}
                value={amountMl}
                onChange={e => setAmountMl(e.target.value)}
                className="bg-slate-800 text-white rounded-xl px-4 py-3 text-base placeholder:text-white/30 outline-none focus:ring-2 focus:ring-feed"
              />
            )}

            <TimeAdjuster
              value={feedTime}
              onChange={setFeedTime}
              label={t("feed.time")}
            />

            <button
              onClick={logFeed}
              disabled={saving}
              className="w-full bg-feed text-white font-semibold rounded-xl py-3 disabled:opacity-40 active:scale-95 transition-transform"
            >
              {saving ? "…" : t("feed.save")}
            </button>
          </div>
        </div>
      )}
    </Layout>
  )
}
