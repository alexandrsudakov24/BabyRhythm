/** Age in months from birthDate string (yyyy-MM-dd) */
export function ageInMonths(birthDate: string): number {
  const birth = new Date(birthDate)
  const now   = new Date()
  return (now.getFullYear() - birth.getFullYear()) * 12
    + now.getMonth() - birth.getMonth()
}

/** Recommended awake window in ms based on age in months */
export function recommendedAwakeWindow(ageMonths: number): number {
  if (ageMonths < 2)  return 60 * 60_000
  if (ageMonths < 4)  return 90 * 60_000
  if (ageMonths < 6)  return 2 * 60 * 60_000
  if (ageMonths < 9)  return 2.5 * 60 * 60_000
  if (ageMonths < 12) return 3 * 60 * 60_000
  if (ageMonths < 18) return 4 * 60 * 60_000
  return 5 * 60 * 60_000
}
