export type EventType = 'sleep' | 'feed' | 'awake' | 'diaper'

export interface BabyEvent {
  id: string
  type: EventType
  startTime: number   // Unix ms
  endTime?: number | null   // null = ongoing
  notes?: string
  // feed-specific
  feedType?: 'breast_left' | 'breast_right' | 'bottle' | 'solid'
  amountMl?: number
  // diaper-specific
  diaperType?: 'wet' | 'dirty' | 'both'
}

export interface Baby {
  id: string
  name: string
  birthDate: string   // ISO yyyy-MM-dd
  userId: string
}

export interface UserProfile {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
}

export interface DailySummary {
  date: string          // yyyy-MM-dd
  totalSleepMs: number
  sleepSessions: number
  totalFeedCount: number
  longestSleepMs: number
  longestAwakeMs: number
}
