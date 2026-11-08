import { useEffect, useState } from 'react'
import { parseItemLines, toLower } from '../lib/recipes'
import { loadGroceries, saveGroceries } from '../lib/storage'

const MESSAGE_DURATION_MS = 5000

function describeAdd(addedCount, skippedCount) {
  if (addedCount === 0) return 'Already on your list'
  const added = `Added ${addedCount}`
  if (skippedCount > 0) return `${added} · ${skippedCount} already on list`
  return `${added} ${addedCount === 1 ? 'item' : 'items'}`
}

/**
 * The grocery list, saved on this device. Lives above the Groceries tab, so the add box keeps
 * its text while another tab is open.
 */
export function useGroceries() {
  const [items, setItems] = useState(() => loadGroceries() ?? [])
  const [hasSaveError, setHasSaveError] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [draft, setDraft] = useState('')
  // `undoItems` holds the list from before Clear all, while Undo is offered.
  const [message, setMessage] = useState(null)

  useEffect(() => {
    setHasSaveError(!saveGroceries(items))
  }, [items])

  useEffect(() => {
    if (!message) return
    const timer = setTimeout(() => setMessage(null), MESSAGE_DURATION_MS)
    return () => clearTimeout(timer)
  }, [message])

  // Unchecked items keep the order they were added in; checked ones sink in the order checked.
  const uncheckedItems = items.filter((item) => item.checkedAt === null)
  const checkedItems = items
    .filter((item) => item.checkedAt !== null)
    .sort((a, b) => a.checkedAt - b.checkedAt)

  function toggleItem(id) {
    setItems((current) => {
      const lastCheckedAt = Math.max(0, ...current.map((item) => item.checkedAt ?? 0))
      return current.map((item) => {
        if (item.id !== id) return item
        return { ...item, checkedAt: item.checkedAt === null ? lastCheckedAt + 1 : null }
      })
    })
  }

  function removeItem(id) {
    setItems((current) => current.filter((item) => item.id !== id))
  }

  function clearAll() {
    setMessage({ text: 'List cleared', undoItems: items })
    setItems([])
  }

  function undoClear() {
    if (message?.undoItems) setItems(message.undoItems)
    setMessage(null)
  }

  function addItems() {
    const lines = parseItemLines(draft)
    const existing = new Set(items.map((item) => item.name.toLowerCase()))
    const newNames = lines.filter((line) => !existing.has(line.toLowerCase()))
    const newItems = newNames.map((name) => ({ id: crypto.randomUUID(), name, checkedAt: null }))

    setItems((current) => [...current, ...newItems])
    setMessage({ text: describeAdd(newNames.length, lines.length - newNames.length) })
    cancelAdd()
  }

  /** Adds one item from a suggestion chip, with no message; an item already listed is skipped. */
  function addItem(itemName) {
    const name = toLower(itemName)
    setItems((current) => {
      if (current.some((item) => item.name.toLowerCase() === name.toLowerCase())) return current
      return [...current, { id: crypto.randomUUID(), name, checkedAt: null }]
    })
  }

  function openAdd() {
    setIsAdding(true)
  }

  function cancelAdd() {
    setDraft('')
    setIsAdding(false)
  }

  return {
    items: [...uncheckedItems, ...checkedItems],
    hasSaveError,
    isAdding,
    draft,
    message,
    setDraft,
    toggleItem,
    removeItem,
    clearAll,
    undoClear,
    addItems,
    addItem,
    openAdd,
    cancelAdd,
  }
}
