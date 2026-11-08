import { useEffect, useState } from 'react'
import { findRecipe, parseIngredients } from '../lib/recipes'

const UNDO_DURATION_MS = 5000

/**
 * Which recipe is open for editing. Lives in App because the header's New Recipe button opens
 * it, and switching tabs closes it.
 */
export function useRecipeEditor(plan) {
  const { recipes, ingredients, getRecipeServings, getRecipeTags, saveRecipe } = plan
  // null when nothing is open; `name` is null for a recipe that hasn't been created yet.
  const [editing, setEditing] = useState(null)
  // What Undo needs after a delete, while "Recipe deleted · Undo" is showing.
  const [deleted, setDeleted] = useState(null)

  useEffect(() => {
    if (!deleted) return
    const timer = setTimeout(() => setDeleted(null), UNDO_DURATION_MS)
    return () => clearTimeout(timer)
  }, [deleted])

  function getIngredients(name) {
    return ingredients[name] ?? []
  }

  function open(name) {
    setEditing({
      name,
      text: getIngredients(name).join('\n'),
      servings: getRecipeServings(name),
      tags: getRecipeTags(name),
    })
  }

  function openNew() {
    setEditing({ name: null, text: '', servings: 1, tags: [] })
  }

  function close() {
    setEditing(null)
  }

  /** A new recipe named after an existing one opens that recipe instead, keeping what was typed. */
  function save(name, text, servings, tags) {
    const existing = editing.name === null ? findRecipe(recipes, name) : undefined
    if (existing) {
      const merged = [...getIngredients(existing), text.trim()].filter(Boolean).join('\n')
      setEditing({
        name: existing,
        text: merged,
        servings: getRecipeServings(existing),
        tags: getRecipeTags(existing),
      })
      return
    }
    saveRecipe(editing.name ?? name, parseIngredients(text), servings, tags)
    close()
  }

  /** Deletes the open recipe right away; Undo is offered for a few seconds. */
  function remove() {
    setDeleted(plan.deleteRecipe(editing.name))
    close()
  }

  function undoRemove() {
    if (deleted) plan.restoreRecipe(deleted)
    setDeleted(null)
  }

  return {
    editing,
    deleted,
    getIngredients,
    getTags: getRecipeTags,
    open,
    openNew,
    close,
    save,
    remove,
    undoRemove,
  }
}
