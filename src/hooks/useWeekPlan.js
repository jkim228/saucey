import { useEffect, useState } from 'react'
import { DAYS, STARTER_RECIPES, createEmptySlots } from '../data/week'
import { getDateLabels, getWeekKey, getWeekRangeLabel } from '../lib/dates'
import { RECIPE_TAGS } from '../data/tags'
import { findRecipe, toLower } from '../lib/recipes'
import { loadPlan, savePlan } from '../lib/storage'

function createInitialPlan() {
  const weekKey = getWeekKey(new Date())
  const saved = loadPlan()
  if (!saved) {
    return {
      weekKey,
      slots: createEmptySlots(),
      recipes: STARTER_RECIPES,
      ingredients: {},
      servings: {},
      tags: {},
      customTags: [],
    }
  }
  if (saved.weekKey !== weekKey) return { ...saved, weekKey, slots: createEmptySlots() }
  return saved
}

export function useWeekPlan() {
  const [plan, setPlan] = useState(createInitialPlan)
  const [openSlot, setOpenSlot] = useState(null)
  const [hasSaveError, setHasSaveError] = useState(false)
  const { weekKey, slots, recipes, ingredients, servings, tags, customTags = [] } = plan
  const tagOptions = [...RECIPE_TAGS, ...customTags]

  useEffect(() => {
    setHasSaveError(!savePlan(plan))
  }, [plan])

  useEffect(() => {
    function handleReturn() {
      if (document.visibilityState === 'hidden') return
      const currentWeekKey = getWeekKey(new Date())
      if (currentWeekKey === weekKey) return
      setPlan((current) => ({ ...current, weekKey: currentWeekKey, slots: createEmptySlots() }))
      setOpenSlot(null)
    }

    document.addEventListener('visibilitychange', handleReturn)
    window.addEventListener('focus', handleReturn)
    window.addEventListener('pageshow', handleReturn)
    return () => {
      document.removeEventListener('visibilitychange', handleReturn)
      window.removeEventListener('focus', handleReturn)
      window.removeEventListener('pageshow', handleReturn)
    }
  }, [weekKey])

  const dateLabels = getDateLabels(weekKey, DAYS.length + 1)
  const days = DAYS.map((day, index) => ({
    name: day.name,
    day: day.key,
    date: dateLabels[index],
    slots: slots[day.key],
  }))

  function saveSlot(dayKey, meal, slot) {
    setPlan((current) => ({
      ...current,
      slots: {
        ...current.slots,
        [dayKey]: { ...current.slots[dayKey], [meal]: slot },
      },
    }))
    setOpenSlot(null)
  }

  /** Fills a slot, reusing a recipe that differs only by capitalization or creating a new one. */
  function assignRecipe(dayKey, meal, recipeName, servings) {
    const name = toLower(recipeName.trim())
    const existing = findRecipe(recipes, name)
    if (!existing) {
      setPlan((current) => ({ ...current, recipes: [...current.recipes, name] }))
    }
    saveSlot(dayKey, meal, { type: 'recipe', recipe: existing ?? name, servings })
  }

  /** A recipe's servings, which start at 1 until changed in the recipe editor. */
  function getRecipeServings(recipeName) {
    const name = findRecipe(recipes, recipeName)
    return (name && servings[name]) ?? 1
  }

  /** Adds a tag every recipe can use; blank names and ones that already exist are ignored. */
  function addTag(tagName) {
    const tag = toLower(tagName.trim().replace(/\s+/g, ' '))
    if (!tag) return
    setPlan((current) => {
      const existing = [...RECIPE_TAGS, ...(current.customTags ?? [])]
      if (existing.includes(tag)) return current
      return { ...current, customTags: [...(current.customTags ?? []), tag] }
    })
  }

  /** A recipe's tags, in the order tagOptions lists them. */
  function getRecipeTags(recipeName) {
    return tags[recipeName] ?? []
  }

  /** Replaces a recipe's ingredients, servings and tags, creating the recipe first if its name is new. */
  function saveRecipe(recipeName, recipeIngredients, recipeServings = 1, recipeTags = []) {
    setPlan((current) => {
      const name = findRecipe(current.recipes, recipeName) ?? toLower(recipeName.trim())
      const isNew = !current.recipes.includes(name)
      return {
        ...current,
        recipes: isNew ? [...current.recipes, name] : current.recipes,
        ingredients: { ...current.ingredients, [name]: recipeIngredients },
        servings: { ...current.servings, [name]: recipeServings },
        tags: { ...current.tags, [name]: recipeTags },
      }
    })
  }

  /** Deletes a recipe and returns what Undo needs to put it back. Slots keep the dish name. */
  function deleteRecipe(name) {
    const snapshot = {
      name,
      index: recipes.indexOf(name),
      ingredients: ingredients[name],
      servings: servings[name],
      tags: tags[name],
    }
    setPlan((current) => {
      const without = (map) =>
        Object.fromEntries(Object.entries(map).filter(([key]) => key !== name))
      return {
        ...current,
        recipes: current.recipes.filter((recipe) => recipe !== name),
        ingredients: without(current.ingredients),
        servings: without(current.servings),
        tags: without(current.tags),
      }
    })
    return snapshot
  }

  /** Puts a deleted recipe back in its old place, unless one with its name was made since. */
  function restoreRecipe(snapshot) {
    setPlan((current) => {
      if (findRecipe(current.recipes, snapshot.name)) return current
      const restored = [...current.recipes]
      restored.splice(snapshot.index, 0, snapshot.name)
      const withEntry = (map, value) =>
        value === undefined ? map : { ...map, [snapshot.name]: value }
      return {
        ...current,
        recipes: restored,
        ingredients: withEntry(current.ingredients, snapshot.ingredients),
        servings: withEntry(current.servings, snapshot.servings),
        tags: withEntry(current.tags, snapshot.tags),
      }
    })
  }

  function markPlanned(dayKey, meal) {
    saveSlot(dayKey, meal, { type: 'planned' })
  }

  function removeSlot(dayKey, meal) {
    saveSlot(dayKey, meal, { type: 'empty' })
  }

  function openPanel(dayKey, meal) {
    setOpenSlot({ dayKey, meal })
  }

  function closePanel() {
    setOpenSlot(null)
  }

  return {
    weekKey,
    slots,
    weekLabel: getWeekRangeLabel(weekKey, DAYS.length),
    days,
    saturdayDate: dateLabels[DAYS.length],
    recipes,
    ingredients,
    getRecipeServings,
    getRecipeTags,
    tagOptions,
    addTag,
    openSlot,
    hasSaveError,
    assignRecipe,
    saveRecipe,
    deleteRecipe,
    restoreRecipe,
    markPlanned,
    removeSlot,
    openPanel,
    closePanel,
  }
}
