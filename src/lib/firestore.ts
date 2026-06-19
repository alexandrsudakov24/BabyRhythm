import {
  collection, doc, addDoc, updateDoc, getDocs,
  query, where, orderBy, limit, onSnapshot,
  type Unsubscribe,
} from 'firebase/firestore'
import { db } from './firebase'
import type { BabyEvent, Baby } from '../types'

// ── Collections ────────────────────────────────────────────────
export const babiesCol   = (uid: string) => collection(db, 'users', uid, 'babies')
export const eventsCol   = (uid: string, babyId: string) =>
  collection(db, 'users', uid, 'babies', babyId, 'events')

// ── Baby ───────────────────────────────────────────────────────
export async function createBaby(uid: string, data: Omit<Baby, 'id' | 'userId'>) {
  const ref = await addDoc(babiesCol(uid), { ...data, userId: uid })
  return ref.id
}

export async function getBabies(uid: string): Promise<Baby[]> {
  const snap = await getDocs(babiesCol(uid))
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Baby))
}

// ── Utils ──────────────────────────────────────────────────────
/** Strip undefined values — Firestore rejects them */
function clean<T extends object>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined)
  ) as Partial<T>
}

// ── Events ─────────────────────────────────────────────────────
export async function addEvent(
  uid: string, babyId: string,
  data: Omit<BabyEvent, 'id'>,
): Promise<string> {
  const ref = await addDoc(eventsCol(uid, babyId), clean(data))
  return ref.id
}

export async function endEvent(
  uid: string, babyId: string,
  eventId: string, endTime: number,
) {
  await updateDoc(doc(eventsCol(uid, babyId), eventId), { endTime })
}

export async function updateEventNotes(
  uid: string, babyId: string,
  eventId: string, notes: string,
) {
  await updateDoc(doc(eventsCol(uid, babyId), eventId), { notes })
}

/** Live subscription to recent events (last 7 days) */
export function subscribeEvents(
  uid: string, babyId: string,
  callback: (events: BabyEvent[]) => void,
): Unsubscribe {
  const since = Date.now() - 7 * 24 * 60 * 60 * 1000
  const q = query(
    eventsCol(uid, babyId),
    where('startTime', '>=', since),
    orderBy('startTime', 'desc'),
    limit(200),
  )
  return onSnapshot(q, snap => {
    const events = snap.docs.map(d => ({ id: d.id, ...d.data() } as BabyEvent))
    callback(events)
  })
}

/** Get active (ongoing) session of given type */
export async function getActiveEvent(
  uid: string, babyId: string, type: BabyEvent['type'],
): Promise<BabyEvent | null> {
  const q = query(
    eventsCol(uid, babyId),
    where('type', '==', type),
    where('endTime', '==', null),
    limit(1),
  )
  const snap = await getDocs(q)
  if (snap.empty) return null
  const d = snap.docs[0]
  return { id: d.id, ...d.data() } as BabyEvent
}
