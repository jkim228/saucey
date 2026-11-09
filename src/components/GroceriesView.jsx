import { GroceryAddBox } from './GroceryAddBox'
import { GroceryItem } from './GroceryItem'
import { MessageBar } from './MessageBar'
import { SuggestedIngredients } from './SuggestedIngredients'
import { getOpeningIndex } from '../lib/dates'
import { findRecipe, parseItemLines } from '../lib/recipes'
import { getSuggestions } from '../lib/suggestions'

export function GroceriesView({ groceries, plan }) {
  const {
    items,
    isAdding,
    message,
    toggleItem,
    removeItem,
    clearAll,
    undoClear,
    openAdd,
    addItem,
  } = groceries
  // Only meals from today onward; on a weekend that's the whole upcoming week.
  const { matched, unmatched } = getSuggestions({
    slots: plan.slots,
    recipes: plan.recipes,
    ingredients: plan.ingredients,
    listNames: items.map((item) => item.name),
    startIndex: getOpeningIndex(new Date()),
  })

  /** Saves comma-separated `text` as the dish's recipe, adding to the recipe if it already exists. */
  function addDishRecipe(dish, text) {
    const name = findRecipe(plan.recipes, dish) ?? dish
    const existing = plan.ingredients[name] ?? []
    const ingredients = parseItemLines([...existing, ...text.split(',')].join('\n'))
    plan.saveRecipe(name, ingredients, plan.getRecipeServings(name), plan.getRecipeTags(name))
  }

  return (
    <>
      <section
        aria-labelledby="groceries-title"
        className="mx-4 mt-5 rounded-2xl border border-surface-border bg-paper shadow-card"
      >
        <header className="flex items-center justify-between border-b border-surface-border pl-4 pr-1">
          <h2 id="groceries-title" className="py-3.5 font-display text-2xl text-ink-day">
            Groceries
          </h2>
          {items.length > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="h-11 px-3 font-serif text-sm italic text-ink-muted"
            >
              Clear all
            </button>
          )}
        </header>

        <div
          className={`mx-3 border-dashed border-surface-dashed ${items.length > 0 ? 'border-b' : ''}`}
        >
          {isAdding ? (
            <GroceryAddBox groceries={groceries} />
          ) : (
            <button
              type="button"
              data-grocery-add-trigger
              aria-label="Add items"
              onClick={openAdd}
              className="flex h-12 w-full items-center gap-2.5 px-2 font-serif text-[15px] italic text-action"
            >
              <span
                aria-hidden="true"
                className="flex h-5 w-5 items-center justify-center rounded-full border border-dashed border-action text-xs not-italic"
              >
                +
              </span>
              Quick add items or ingredients…
            </button>
          )}
        </div>

        {items.length > 0 && (
          <ul className="px-3">
            {items.map((item) => (
              <GroceryItem
                key={item.id}
                item={item}
                onToggle={() => toggleItem(item.id)}
                onRemove={() => removeItem(item.id)}
              />
            ))}
          </ul>
        )}

        {/* A thin peach-and-grey band along the card's bottom edge, inside its rounded corners. */}
        <div
          aria-hidden="true"
          className="h-1.5 rounded-b-[15px] bg-gradient-to-r from-butter-border via-surface-control to-butter-border"
        />
      </section>

      <SuggestedIngredients
        matched={matched}
        unmatched={unmatched}
        onAdd={addItem}
        onAddRecipe={addDishRecipe}
      />

      {message && <MessageBar text={message.text} onUndo={message.undoItems && undoClear} />}
    </>
  )
}
