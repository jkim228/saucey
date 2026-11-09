import { useState } from 'react'

const LABEL = 'font-label text-[13px] font-normal uppercase tracking-wider text-ink-muted'

/**
 * Planned dishes with their recipe ingredients as "+ ingredient" chips that add to the list,
 * then dishes with nothing to suggest, each followed by "+ Add recipe", which opens a box for
 * that dish's ingredients.
 */
export function SuggestedIngredients({ matched, unmatched, onAdd, onAddRecipe }) {
  const [openDish, setOpenDish] = useState(null)

  if (matched.length === 0 && unmatched.length === 0) return null

  return (
    <section aria-label="Suggested" className="mx-4 mt-6 px-1">
      <ul className="flex flex-col gap-4">
        {matched.map(({ dish, ingredients }) => (
          <li key={dish}>
            <p className={LABEL}>{dish}</p>
            <ul aria-label={`${dish} ingredients`} className="mt-2 flex flex-wrap gap-2">
              {ingredients.map((ingredient) => (
                <li key={ingredient}>
                  <button
                    type="button"
                    aria-label={`Add ${ingredient}`}
                    onClick={() => onAdd(ingredient)}
                    className="h-8 rounded-full border border-surface-dashed bg-surface-border px-3 text-xs font-medium text-ink-muted transition-all duration-200 ease-out [@media(hover:hover)]:hover:border-butter-border [@media(hover:hover)]:hover:text-butter-text active:scale-[0.97]"
                  >
                    + {ingredient}
                  </button>
                </li>
              ))}
            </ul>
          </li>
        ))}
        {unmatched.map((dish) => (
          <li key={dish}>
            <p className={LABEL}>{dish}</p>
            {openDish === dish ? (
              <DishRecipeBox
                dish={dish}
                onSubmit={(text) => {
                  onAddRecipe(dish, text)
                  setOpenDish(null)
                }}
                onCancel={() => setOpenDish(null)}
              />
            ) : (
              <button type="button" onClick={() => setOpenDish(dish)} className={`${LABEL} mt-1 pl-3`}>
                + Add recipe
              </button>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}

/** One-line box for a dish's ingredients, separated by commas, with an inline Add button. */
function DishRecipeBox({ dish, onSubmit, onCancel }) {
  const [text, setText] = useState('')
  const isEmpty = text.replace(/,/g, '').trim() === ''

  function handleSubmit(event) {
    event.preventDefault()
    if (!isEmpty) onSubmit(text)
  }

  return (
    <form
      aria-label={`Add recipe for ${dish}`}
      onSubmit={handleSubmit}
      onKeyDown={(event) => event.key === 'Escape' && onCancel()}
      className="mt-2 flex gap-2 pl-3"
    >
      <input
        autoFocus
        aria-label={`Ingredients for ${dish}`}
        placeholder="Ingredients, separated by commas"
        value={text}
        onChange={(event) => setText(event.target.value)}
        className="h-8 min-w-0 flex-1 rounded-lg border border-stone-300 bg-white px-2 text-sm focus-visible:border-ink-label/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink-label/10 font-medium text-stone-900 placeholder:text-ink-muted"
      />
      <button
        type="submit"
        disabled={isEmpty}
        className="relative h-8 shrink-0 rounded-lg bg-action px-3 text-[11px] font-bold text-white transition-all duration-200 ease-out after:absolute after:inset-x-0 after:-inset-y-1.5 active:scale-[0.98] disabled:bg-stone-200 disabled:text-ink-muted"
      >
        Add
      </button>
    </form>
  )
}
