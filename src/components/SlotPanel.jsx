import { useEffect, useRef, useState } from 'react'
import { RecipeResults } from './RecipeResults'
import { ServingsCounter } from './ServingsCounter'

const ACTION_CLASS =
  'relative h-8 rounded-lg text-[11px] font-bold transition-all duration-200 ease-out active:scale-[0.98] after:absolute after:inset-x-0 after:-inset-y-1.5'

export function SlotPanel({ title, slot, recipes, getRecipeServings, onAssign, onPlanned, onRemove, onClose }) {
  const [query, setQuery] = useState(slot.type === 'recipe' ? slot.recipe : '')
  const [servings, setServings] = useState(slot.type === 'recipe' ? slot.servings : 1)
  const [isListOpen, setIsListOpen] = useState(false)
  const rowRef = useRef(null)

  const name = query.trim()
  const matches = recipes.filter((recipe) => recipe.toLowerCase().includes(name.toLowerCase()))
  const isExactMatch = matches.length === 1 && matches[0].toLowerCase() === name.toLowerCase()
  const hasResults = isListOpen && name !== '' && matches.length > 0 && !isExactMatch

  useEffect(() => {
    function handleDocumentClick(event) {
      if (event.target.closest('[data-slot-panel], [data-slot-trigger]')) return
      onClose()
    }

    document.addEventListener('click', handleDocumentClick)
    return () => document.removeEventListener('click', handleDocumentClick)
  }, [onClose])

  function handleSubmit(event) {
    event.preventDefault()
    if (name) onAssign(name, servings)
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
      className="relative rounded-xl border border-surface-border bg-surface-inset px-[7px] pb-[7px] pt-[11px] shadow-card"
    >
      <p className="mb-3.5 h-4 px-0.5 font-label text-[11px] font-bold uppercase leading-4 tracking-wider text-ink-muted">
        Add a dish
      </p>
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute -right-2 -top-1 flex h-11 w-11 items-center justify-center text-lg leading-none text-ink-muted"
      >
        <span aria-hidden="true">×</span>
      </button>

      <div ref={rowRef} className="flex gap-1">
        <input
          type="text"
          autoFocus
          aria-label="Search or add recipe"
          placeholder="Search…"
          autoComplete="off"
          value={query}
          onChange={handleQueryChange}
          className="h-11 min-w-0 flex-1 rounded-lg border border-stone-300 bg-white px-1.5 text-xs font-medium text-stone-900 placeholder:text-ink-muted"
        />
        <ServingsCounter value={servings} onChange={setServings} />
      </div>
      {hasResults && <RecipeResults anchorRef={rowRef} recipes={matches} onSelect={handleSelect} />}

      <div className="mt-1.5 flex gap-1 border-t border-surface-border pt-1.5">
        {slot.type !== 'empty' && (
          <button
            type="button"
            onClick={onRemove}
            className={`${ACTION_CLASS} flex-auto border border-stone-300 bg-white text-stone-700`}
          >
            Remove
          </button>
        )}
        <button
          type="button"
          aria-pressed={slot.type === 'planned'}
          onClick={onPlanned}
          className={`${ACTION_CLASS} flex-auto border border-planned-border bg-planned text-planned-text`}
        >
          Planned
        </button>
        <button
          type="submit"
          disabled={!name}
          className={`${ACTION_CLASS} flex-auto bg-action text-white disabled:bg-stone-200 disabled:text-ink-muted`}
        >
          Assign
        </button>
      </div>
    </form>
  )
}
