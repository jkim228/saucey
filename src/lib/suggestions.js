import { DAYS, MEALS } from '../data/week'

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/** Whether `recipe` appears in `dish` as whole words, ignoring capitalization. */
export function containsRecipeName(dish, recipe) {
  const name = recipe.trim()
  if (!name) return false
  const pattern = new RegExp(`(^|[^\\p{L}\\p{N}])${escapeRegExp(name)}($|[^\\p{L}\\p{N}])`, 'iu')
  return pattern.test(dish)
}

/**
 * Dishes planned from `startIndex` (a position in Monday–Friday) onward, in slot order, each with
 * the ingredients of every recipe its name contains that aren't on the grocery list yet.
 * Dishes left with nothing to suggest are dropped.
 * @returns {{ dish: string, ingredients: string[] }[]}
 */
export function getSuggestions({ slots, recipes, ingredients, listNames, startIndex }) {
  const onList = new Set(listNames.map((name) => name.toLowerCase()))
  const seenDishes = new Set()
  const suggestions = []

  for (const day of DAYS.slice(startIndex)) {
    for (const meal of MEALS) {
      const slot = slots[day.key]?.[meal.key]
      if (slot?.type !== 'recipe') continue
      const dish = slot.recipe
      if (seenDishes.has(dish.toLowerCase())) continue
      seenDishes.add(dish.toLowerCase())

      const seenIngredients = new Set()
      const dishIngredients = recipes
        .filter((recipe) => containsRecipeName(dish, recipe))
        .flatMap((recipe) => ingredients[recipe] ?? [])
        .filter((ingredient) => {
          const key = ingredient.toLowerCase()
          if (onList.has(key) || seenIngredients.has(key)) return false
          seenIngredients.add(key)
          return true
        })

      if (dishIngredients.length > 0) suggestions.push({ dish, ingredients: dishIngredients })
    }
  }
  return suggestions
}
