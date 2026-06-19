import {
  createContext, useContext, useEffect, useState,
  useCallback, type ReactNode,
} from 'react'
import { useAuth } from './AuthContext'
import { getBabies, createBaby, subscribeEvents } from '../lib/firestore'
import type { Baby, BabyEvent } from '../types'

interface BabyCtx {
  baby: Baby | null
  events: BabyEvent[]
  loading: boolean
  createProfile: (name: string, birthDate: string) => Promise<void>
}

const BabyContext = createContext<BabyCtx | null>(null)

export function BabyProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [baby, setBaby]     = useState<Baby | null>(null)
  const [events, setEvents] = useState<BabyEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { setBaby(null); setEvents([]); setLoading(false); return }
    getBabies(user.uid).then(babies => {
      setBaby(babies[0] ?? null)
      setLoading(false)
    })
  }, [user])

  useEffect(() => {
    if (!user || !baby) return
    const unsub = subscribeEvents(user.uid, baby.id, setEvents)
    return unsub
  }, [user, baby])

  const createProfile = useCallback(async (name: string, birthDate: string) => {
    if (!user) return
    const id = await createBaby(user.uid, { name, birthDate })
    setBaby({ id, name, birthDate, userId: user.uid })
  }, [user])

  return (
    <BabyContext.Provider value={{ baby, events, loading, createProfile }}>
      {children}
    </BabyContext.Provider>
  )
}

export function useBaby() {
  const ctx = useContext(BabyContext)
  if (!ctx) throw new Error('useBaby must be inside BabyProvider')
  return ctx
}
