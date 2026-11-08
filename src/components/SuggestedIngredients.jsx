/** Planned dishes with their recipe ingredients as "+ ingredient" chips that add to the list. */
export function SuggestedIngredients({ suggestions, onAdd }) {
  if (suggestions.length === 0) return null

  return (
    <section aria-label="Suggested" className="mx-4 mt-6 px-1">
      <ul className="flex flex-col gap-4">
        {suggestions.map(({ dish, ingredients }) => (
          <li key={dish}>
            <p className="font-label text-[13px] font-normal uppercase tracking-wider text-ink-muted">{dish}</p>
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
      </ul>
    </section>
  )
}
