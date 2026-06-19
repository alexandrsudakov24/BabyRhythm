import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { startOfDay } from 'date-fns'
import { Layout } from '../components/Layout'
import { BigButton } from '../components/BigButton'
import { TimerDisplay } from '../components/TimerDisplay'
import { EventRow } from '../components/EventRow'
import { useActiveSession } from '../hooks/useActiveSession'
import { useBaby } from '../contexts/BabyContext'
import { formatDuration } from '../lib/time'
import { recommendedAwakeWindow, ageInMonths } from '../lib/baby'

export function Awake() {
  const { t } = useTranslation()
  const { active, elapsed, start, stop } = useActiveSession('awake')
  const { events, baby } = useBaby()

  const todayStart = useMemo(() => startOfDay(new Date()).getTime(), [])
  const todayAwakes = useMemo(
    () => events.filter(e => e.type === 'awake' && e.startTime >= todayStart),
    [events, todayStart],
  )

  const recWindow = baby ? recommendedAwakeWindow(ageInMonths(baby.birthDate)) : null
  const pct = recWindow && elapsed ? Math.min(100, Math.round((elapsed / recWindow) * 100)) : 0
  const overWindow = elapsed > (recWindow ?? Infinity)

  return (
    <Layout title={t('awake.title')}>
      <div className="flex flex-col items-center gap-6 py-10">
        <BigButton
          active={!!active}
          color="awake"
          onClick={active ? stop : start}
        >
          <span className="text-3xl">{active ? '\u2600\ufe0f' : '\U0001f634'}</span>
          <span className="text-sm">{active ? t('awake.stop') : t('awake.start')}</span>
        </BigButton>

        {active && (
          <div className="w-full max-w-xs flex flex-col items-center gap-3">
            <div className="text-center">
              <p className="text-xs text-white/40 mb-1">{t('awake.duration')}</p>
              <TimerDisplay ms={elapsed} className={`text-3xl font-bold ${overWindow ? 'text-red-400' : 'text-awake'}`} />
            </div>

            {recWindow && (
              <div className="w-full">
                <div className="flex justify-between text-xs text-white/40 mb-1">
                  <span>{t('awake.windowTip')}</span>
                  <span>{pct}%</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${overWindow ? 'bg-red-500' : 'bg-awake'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="text-xs text-white/30 mt-1 text-center">
                  {t('awake.windowTip')}: {formatDuration(recWindow, t)}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <h2 className="text-sm font-semibold text-white/50 mb-2 uppercase tracking-wider">{t('awake.history')}</h2>
      {todayAwakes.length === 0
        ? <p className="text-white/30 text-sm text-center py-6">{t('dashboard.noData')}</p>
        : <div className="bg-slate-900 rounded-2xl px-4 divide-y divide-white/5">
            {todayAwakes.map(e => <EventRow key={e.id} event={e} />)}
          </div>
      }
    </Layout>
  )
}
