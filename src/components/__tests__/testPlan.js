import { vi } from 'vitest'
import { STARTER_RECIPES } from '../../data/week'
import { savePlan } from '../../lib/storage'

export function setToday(isoDate) {
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(new Date(`${isoDate}T12:00:00`))
}

function recipeSlot(recipe) {
  return { type: 'recipe', recipe, servings: 1 }
}

export const SAMPLE_SLOTS = {
  MON: { lunch: recipeSlot('lasagna'), dinner: recipeSlot('lasagna') },
  TUE: { lunch: recipeSlot('kimchi jjigae'), dinner: recipeSlot('kimchi jjigae') },
  WED: { lunch: recipeSlot('caldo verde'), dinner: recipeSlot('caldo verde') },
  THU: { lunch: recipeSlot('lasagna'), dinner: recipeSlot('caldo verde') },
  FRI: { lunch: recipeSlot('kimchi jjigae'), dinner: recipeSlot('lasagna') },
}

/** Starts on Monday, Nov 9, 2026 with a saved plan for that week. */
export function seedSampleWeek() {
  setToday('2026-11-09')
  savePlan({ weekKey: '2026-11-09', slots: SAMPLE_SLOTS, recipes: STARTER_RECIPES })
}
