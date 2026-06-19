import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useBaby } from '../contexts/BabyContext'
import { addEvent, endEvent } from '../lib/firestore'
import type { BabyEvent } from '../types'

/** Manages start/stop for a single event type with a live elapsed timer */
export function useActiveSession(type: BabyEvent['type']) {
  const { user } = useAuth()
  const { baby, events } = useBaby()
  const [elapsed, setElapsed] = useState(0)

  // Find the active (ongoing) session from the live events list
  const active = events.find(e => e.type === type && e.endTime == null) ?? null

  useEffect(() => {
    if (!active) { setElapsed(0); return }
    const tick = () => setElapsed(Date.now() - active.startTime)
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [active])

  const start = useCallback(async () => {
    if (!user || !baby || active) return
    await addEvent(user.uid, baby.id, { type, startTime: Date.now(), endTime: null })
  }, [user, baby, active, type])

  const stop = useCallback(async () => {
    if (!user || !baby || !active) return
    await endEvent(user.uid, baby.id, active.id, Date.now())
  }, [user, baby, active])

  return { active, elapsed, start, stop }
}
