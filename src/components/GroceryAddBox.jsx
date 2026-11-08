import { useEffect } from 'react'

/** Replaces the "+ Add" trigger. Its text lives in useGroceries, so it survives tab switches. */
export function GroceryAddBox({ groceries }) {
  const { draft, setDraft, addItems, cancelAdd } = groceries
  const isEmpty = draft.trim() === ''

  // Tapping outside closes only an empty box, so a half-typed list isn't lost.
  useEffect(() => {
    function handleDocumentClick(event) {
      if (!isEmpty) return
      if (event.target.closest('[data-grocery-add], [data-grocery-add-trigger]')) return
      cancelAdd()
    }

    document.addEventListener('click', handleDocumentClick)
    return () => document.removeEventListener('click', handleDocumentClick)
  }, [isEmpty, cancelAdd])

  function handleSubmit(event) {
    event.preventDefault()
    if (!isEmpty) addItems()
  }

  function handleKeyDown(event) {
    if (event.key === 'Escape') cancelAdd()
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) handleSubmit(event)
  }

  return (
    <form
      data-grocery-add
      aria-label="Add items"
      onSubmit={handleSubmit}
      onKeyDown={handleKeyDown}
      className="flex flex-col gap-2 py-3"
    >
      <textarea
        autoFocus
        aria-label="Items to add"
        placeholder="One item per line"
        rows={4}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        className="w-full resize-none rounded-lg border border-stone-300 bg-white px-2 py-2 text-sm font-medium leading-snug text-stone-900 placeholder:text-ink-muted"
      />
      <button
        type="submit"
        disabled={isEmpty}
        className="relative h-8 rounded-lg bg-action text-[11px] font-bold text-white transition-all duration-200 ease-out after:absolute after:inset-x-0 after:-inset-y-1.5 active:scale-[0.98] disabled:bg-stone-200 disabled:text-ink-muted"
      >
        Add
      </button>
    </form>
  )
}
