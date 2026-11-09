import { RECIPE_TAGS, withServingsTag } from '../data/tags'
import { DAYS, MEALS } from '../data/week'
import { toLower } from './recipes'

const STORAGE_KEY = 'meal-matrix'
const TAB_STORAGE_KEY = 'meal-matrix-tab'
const GROCERIES_STORAGE_KEY = 'meal-matrix-groceries'

function isValidSlot(slot) {
  if (slot?.type === 'empty' || slot?.type === 'planned') return true
  return (
    slot?.type === 'recipe' &&
    typeof slot.recipe === 'string' &&
    Number.isInteger(slot.servings) &&
    slot.servings >= 1
  )
}

function isStringList(value) {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
}

/** Plans saved before ingredients existed have none, which is still valid. */
function isValidIngredients(ingredients) {
  if (ingredients === undefined) return true
  return (
    typeof ingredients === 'object' &&
    ingredients !== null &&
    Object.values(ingredients).every(isStringList)
  )
}

/** Plans saved before recipe servings existed have none; a missing recipe counts as 1. */
function isValidServings(servings) {
  if (servings === undefined) return true
  return (
    typeof servings === 'object' &&
    servings !== null &&
    Object.values(servings).every((count) => Number.isInteger(count) && count >= 1)
  )
}

/** Plans saved before tags existed have none; unknown tags are dropped on load instead. */
function isValidTags(tags) {
  if (tags === undefined) return true
  return typeof tags === 'object' && tags !== null && Object.values(tags).every(isStringList)
}

/** Tags the user added, kept lowercase and once each, after the built-in ones. */
function cleanCustomTags(customTags = []) {
  const custom = customTags.map(toLower).filter((tag) => !RECIPE_TAGS.includes(tag))
  return [...new Set(custom)]
}

function cleanTags(tags = {}, customTags = []) {
  const options = [...RECIPE_TAGS, ...customTags]
  return Object.fromEntries(
    Object.entries(tags).map(([name, list]) => {
      const lower = list.map(toLower)
      return [name, options.filter((tag) => lower.includes(tag))]
    }),
  )
}

function isValidPlan(plan) {
  return (
    typeof plan?.weekKey === 'string' &&
    isStringList(plan.recipes) &&
    isValidIngredients(plan.ingredients) &&
    isValidServings(plan.servings) &&
    isValidTags(plan.tags) &&
    (plan.customTags === undefined || isStringList(plan.customTags)) &&
    DAYS.every((day) => MEALS.every((meal) => isValidSlot(plan.slots?.[day.key]?.[meal.key])))
  )
}

/** Keys a map by lowercase recipe name; the first entry wins if two names now match. */
function lowerKeys(map = {}, lowerValue = (value) => value) {
  const result = {}
  for (const [key, value] of Object.entries(map)) {
    const name = toLower(key)
    if (!(name in result)) result[name] = lowerValue(value)
  }
  return result
}

/** Lowercases recipe names everywhere they appear, and ingredients, in a plan saved before. */
function lowercasePlan(plan) {
  const slots = Object.fromEntries(
    Object.entries(plan.slots).map(([day, meals]) => [
      day,
      Object.fromEntries(
        Object.entries(meals).map(([meal, slot]) => [
          meal,
          slot.type === 'recipe' ? { ...slot, recipe: toLower(slot.recipe) } : slot,
        ]),
      ),
    ]),
  )
  return {
    ...plan,
    slots,
    recipes: [...new Set(plan.recipes.map(toLower))],
    ingredients: lowerKeys(plan.ingredients, (list) => [...new Set(list.map(toLower))]),
    servings: lowerKeys(plan.servings),
    tags: lowerKeys(plan.tags),
  }
}

/** Recipes saved with more than 1 serving before "2+" was added for them get it now. */
function addServingsTags(plan) {
  const tags = { ...plan.tags }
  for (const [name, count] of Object.entries(plan.servings)) {
    if (count > 1) tags[name] = withServingsTag(tags[name] ?? [], count)
  }
  return { ...plan, tags: cleanTags(tags, plan.customTags) }
}

/** Returns the saved plan, or null if there is none or it can't be read. */
export function loadPlan() {
  try {
    const plan = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if (!isValidPlan(plan)) return null
    const customTags = cleanCustomTags(plan.customTags)
    return addServingsTags(
      lowercasePlan({
        ingredients: {},
        servings: {},
        ...plan,
        customTags,
        tags: cleanTags(plan.tags, customTags),
      }),
    )
  } catch {
    return null
  }
}

/** Returns whether the plan was saved. */
export function savePlan(plan) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plan))
    return true
  } catch {
    return false
  }
}

function isValidGroceryItem(item) {
  return (
    typeof item?.id === 'string' &&
    typeof item.name === 'string' &&
    (item.checkedAt === null || Number.isInteger(item.checkedAt))
  )
}

/** Returns the saved grocery list, or null if there is none or it can't be read. */
export function loadGroceries() {
  try {
    const items = JSON.parse(localStorage.getItem(GROCERIES_STORAGE_KEY))
    if (!Array.isArray(items) || !items.every(isValidGroceryItem)) return null
    // Saved lowercase from now on; two items that now match keep only the first.
    const seen = new Set()
    return items
      .map((item) => ({ ...item, name: toLower(item.name) }))
      .filter((item) => !seen.has(item.name) && seen.add(item.name))
  } catch {
    return null
  }
}

/** Returns whether the grocery list was saved. */
export function saveGroceries(items) {
  try {
    localStorage.setItem(GROCERIES_STORAGE_KEY, JSON.stringify(items))
    return true
  } catch {
    return false
  }
}

/** Returns the last tab used, or null if there is none or it isn't one of `tabKeys`. */
export function loadTab(tabKeys) {
  try {
    const tab = localStorage.getItem(TAB_STORAGE_KEY)
    return tabKeys.includes(tab) ? tab : null
  } catch {
    return null
  }
}

/** Saves the tab; a failure only means the app opens on the default tab next time. */
export function saveTab(tab) {
  try {
    localStorage.setItem(TAB_STORAGE_KEY, tab)
  } catch {
    // Nothing to do: the tab isn't worth a warning like the meal plan is.
  }
}
