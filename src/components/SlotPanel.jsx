import { useEffect, useRef, useState } from 'react'
import { RecipeResults } from './RecipeResults'

const ACTION_CLASS =
  'transition-all duration-200 ease-out active:scale-[0.98] disabled:active:scale-100'

const LABEL_TONE = {
  recipe: 'tracking-wider text-ink-label',
  empty: 'tracking-wider text-neutral-text',
  planned: 'tracking-[0.18em] text-neutral-text',
}

export function SlotPanel({
  title,
  mealLabel,
  slot,
  recipes,
  getRecipeServings,
  onAssign,
  onPlanned,
  onRemove,
  onClose,
}) {
  const [query, setQuery] = useState(slot.type === 'recipe' ? slot.recipe : '')
  // There's no counter in the panel; the slot still keeps a servings count behind the scenes.
  const [servings, setServings] = useState(slot.type === 'recipe' ? slot.servings : 1)
  const [isListOpen, setIsListOpen] = useState(false)
  const rowRef = useRef(null)
  const inputRef = useRef(null)

  const name = query.trim()
  const matches = recipes.filter((recipe) => recipe.toLowerCase().includes(name.toLowerCase()))
  const isExactMatch = matches.length === 1 && matches[0].toLowerCase() === name.toLowerCase()
  const hasResults = isListOpen && name !== '' && matches.length > 0 && !isExactMatch

  // Focus without letting the browser scroll the day track, which would stop the tapped day
  // short of sliding all the way to the left.
  useEffect(() => {
    inputRef.current.focus({ preventScroll: true })
  }, [])

  useEffect(() => {
    function handleDocumentClick(event) {
      // A control that removes itself when clicked (the trash icon) is gone from the page by
      // the time the click reaches the document, so it can't be an outside click.
      if (!event.target.isConnected) return
      if (event.target.closest('[data-slot-panel], [data-slot-trigger]')) return
      onClose()
    }

    document.addEventListener('click', handleDocumentClick)
    return () => document.removeEventListener('click', handleDocumentClick)
  }, [onClose])

  // Saving with the search bar cleared empties a slot that had a recipe or was Planned.
  const canSave = name !== '' || slot.type !== 'empty'

  function handleSubmit(event) {
    event.preventDefault()
    if (name) onAssign(name, servings)
    else if (canSave) onRemove()
  }

  function handleClear() {
    setQuery('')
    setIsListOpen(false)
    inputRef.current.focus({ preventScroll: true })
  }

  function handleQueryChange(event) {
    setQuery(event.target.value)
    setIsListOpen(true)
  }

  /** A slot without a recipe takes the chosen recipe's servings; a filled slot keeps its count. */
  function handleSelect(recipe) {
    setQuery(recipe)
    setIsListOpen(false)
    if (slot.type !== 'recipe') setServings(getRecipeServings(recipe))
  }

  function handleKeyDown(event) {
    if (event.key === 'Escape') onClose()
  }

  return (
    <form
      data-slot-panel
      aria-label={`Edit ${title}`}
      onSubmit={handleSubmit}
      onKeyDown={handleKeyDown}
      className="relative flex flex-1 flex-col rounded-xl border border-surface-border bg-surface-inset px-[7px] pb-[7px] pt-[11px] shadow-card"
    >
      {/* Matches the slot's own label: terracotta with a recipe, dark gray when empty or Planned. */}
      <p
        className={`h-4 px-0.5 font-label text-[11px] font-bold uppercase leading-4 ${LABEL_TONE[slot.type]}`}
      >
        {mealLabel}
      </p>
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute -right-2 -top-1 flex h-11 w-11 items-center justify-center text-lg leading-none text-ink-muted"
      >
        <span aria-hidden="true">×</span>
      </button>

      {/* The search sits in the middle of the space between the label and the buttons. */}
      <div className="flex flex-1 flex-col justify-center py-3">
        <div ref={rowRef} className="relative flex gap-1">
          <input
            ref={inputRef}
            type="text"
            aria-label="Search or add recipe"
            placeholder="Search…"
            autoComplete="off"
            value={query}
            onChange={handleQueryChange}
            className="h-11 min-w-0 flex-1 rounded-lg border border-stone-300 bg-white pl-1.5 pr-9 text-xs font-medium text-stone-900 placeholder:text-ink-muted focus-visible:border-ink-label/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-label/10"
          />
          {query !== '' && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={handleClear}
              className="absolute inset-y-0 right-0 flex w-9 items-center justify-center rounded-r-lg text-ink-muted transition-colors hover:text-stone-700"
            >
              <TrashIcon />
            </button>
          )}
        </div>
        {hasResults && <RecipeResults anchorRef={rowRef} recipes={matches} onSelect={handleSelect} />}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-pressed={slot.type === 'planned'}
          onClick={onPlanned}
          className={`${ACTION_CLASS} flex h-11 shrink-0 items-center gap-1 px-1.5 text-[13px] font-medium text-ink-muted aria-pressed:text-stone-800`}
        >
          <CutleryIcon />
          Planned
        </button>
        <button
          type="submit"
          disabled={!canSave}
          className={`${ACTION_CLASS} h-11 flex-1 rounded-xl bg-action text-[15px] font-bold text-white shadow-[0_3px_8px_rgba(151,72,42,0.25)] disabled:bg-stone-200 disabled:text-ink-muted disabled:shadow-none`}
        >
          Assign
        </button>
      </div>
    </form>
  )
}

function CutleryIcon() {
  return (
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 512 512" fill="currentColor">
      {/* Fork: a square head with three slots between the tines, narrowing into a round-ended handle */}
      <path d="M98 8h22v104a9 9 0 0 0 18 0V8h22v104a9 9 0 0 0 18 0V8h22v104a9 9 0 0 0 18 0V8h20a8 8 0 0 1 8 8v140c0 30-20 52-45 58v240a33 33 0 0 1-66 0V214c-25-6-45-28-45-58V16a8 8 0 0 1 8-8z" />
      {/* Knife: a curved blade along a straight spine, stepping in to the handle */}
      <path d="M412 4a10 10 0 0 1 10 10v440a35 35 0 0 1-70 0V318c0-5-3-9-7-11l-30-16c-3-2-5-5-5-9V108C310 50 356 4 412 4z" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M2.5 4h11M6.5 4V2.5h3V4M4 4l.7 9.2c.05.5.45.8.95.8h4.7c.5 0 .9-.3.95-.8L12 4M6.7 6.5v5M9.3 6.5v5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
