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
