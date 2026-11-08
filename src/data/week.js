export const MEALS = [
  { key: 'lunch', label: 'Lunch' },
  { key: 'dinner', label: 'Dinner' },
]

export const DAYS = [
  { key: 'MON', name: 'Monday' },
  { key: 'TUE', name: 'Tuesday' },
  { key: 'WED', name: 'Wednesday' },
  { key: 'THU', name: 'Thursday' },
  { key: 'FRI', name: 'Friday' },
]

export const STARTER_RECIPES = ['caldo verde', 'kimchi jjigae', 'lasagna']

export function createEmptySlots() {
  return Object.fromEntries(
    DAYS.map((day) => [day.key, { lunch: { type: 'empty' }, dinner: { type: 'empty' } }]),
  )
}
