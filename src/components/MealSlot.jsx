import { SlotPanel } from './SlotPanel'

const TRIGGER_CLASS =
  'relative flex min-h-[60px] w-full flex-1 items-center rounded-xl transition-all duration-200 ease-out hover:shadow-card active:scale-[0.98]'

export function MealSlot({ day, meal, plan }) {
  const {
    recipes,
    getRecipeServings,
    openSlot,
    assignRecipe,
    markPlanned,
    removeSlot,
    openPanel,
    closePanel,
  } = plan
  const slot = day.slots[meal.key]
  const title = `${day.name} ${meal.label.toLowerCase()}`
  const isOpen = openSlot?.dayKey === day.day && openSlot?.meal === meal.key

  return (
    <div className="flex flex-1 flex-col">
      {isOpen ? (
        <SlotPanel
          title={title}
          mealLabel={meal.label}
          slot={slot}
          recipes={recipes}
          getRecipeServings={getRecipeServings}
          onAssign={(name, servings) => assignRecipe(day.day, meal.key, name, servings)}
          onPlanned={() => markPlanned(day.day, meal.key)}
          onRemove={() => removeSlot(day.day, meal.key)}
          onClose={closePanel}
        />
      ) : (
        <SlotTrigger
          slot={slot}
          title={title}
          mealLabel={meal.label}
          onOpen={() => openPanel(day.day, meal.key)}
        />
      )}
    </div>
  )
}

/** Sits in the card's top-left corner, where the open panel shows the same label. */
function MealLabel({ children, variant = 'recipe' }) {
  // Only a slot with a recipe gets the terracotta label; empty and Planned slots are dark gray.
  const tone = {
    recipe: 'tracking-wider text-ink-label',
    empty: 'tracking-wider text-neutral-text',
    planned: 'tracking-[0.18em] text-neutral-text',
  }[variant]

  return (
    <span
      className={`absolute left-[9px] top-[11px] font-label text-[11px] font-bold uppercase leading-4 ${tone}`}
    >
      {children}
    </span>
  )
}

function SlotTrigger({ slot, title, mealLabel, onOpen }) {
  if (slot.type === 'empty') {
    return (
      <button
        type="button"
        data-slot-trigger
        aria-label={`Add to ${title}`}
        onClick={onOpen}
        className={`${TRIGGER_CLASS} justify-center border-[1.5px] border-dashed border-surface-dashed bg-surface-inset text-xl font-medium text-ink-muted`}
      >
        <MealLabel variant="empty">{mealLabel}</MealLabel>
        <span aria-hidden="true">+</span>
      </button>
    )
  }

  if (slot.type === 'planned') {
    return (
      <button
        type="button"
        data-slot-trigger
        aria-label={`Edit ${title}: Planned`}
        onClick={onOpen}
        className={`${TRIGGER_CLASS} border border-planned-border bg-planned px-3 text-left font-display text-base text-planned-text`}
      >
        <MealLabel variant="planned">{mealLabel}</MealLabel>
        planned!
      </button>
    )
  }

  return (
    <button
      type="button"
      data-slot-trigger
      aria-label={`Edit ${title}: ${slot.recipe}`}
      onClick={onOpen}
      className={`${TRIGGER_CLASS} border border-butter-border bg-butter px-3 text-left font-display text-[17px] leading-tight text-butter-text`}
    >
      <MealLabel>{mealLabel}</MealLabel>
      {slot.recipe}
    </button>
  )
}
