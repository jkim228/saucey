import { SlotPanel } from './SlotPanel'

const TRIGGER_CLASS =
  'flex h-[60px] w-full items-center rounded-xl transition-all duration-200 ease-out hover:shadow-card active:scale-[0.98]'

export function MealSlot({ day, meal, plan }) {
  const { recipes, getRecipeServings, openSlot, assignRecipe, markPlanned, removeSlot, openPanel, closePanel } = plan
  const slot = day.slots[meal.key]
  const title = `${day.name} ${meal.label.toLowerCase()}`
  const isOpen = openSlot?.dayKey === day.day && openSlot?.meal === meal.key

  return (
    <div>
      <p className="px-1 pb-1.5 font-label text-[11px] font-bold uppercase leading-none tracking-wider text-ink-label">
        {meal.label}
      </p>
      {isOpen ? (
        <SlotPanel
          title={title}
          slot={slot}
          recipes={recipes}
          getRecipeServings={getRecipeServings}
          onAssign={(name, servings) => assignRecipe(day.day, meal.key, name, servings)}
          onPlanned={() => markPlanned(day.day, meal.key)}
          onRemove={() => removeSlot(day.day, meal.key)}
          onClose={closePanel}
        />
      ) : (
        <SlotTrigger slot={slot} title={title} onOpen={() => openPanel(day.day, meal.key)} />
      )}
    </div>
  )
}

function SlotTrigger({ slot, title, onOpen }) {
  if (slot.type === 'empty') {
    return (
      <button
        type="button"
        data-slot-trigger
        aria-label={`Add to ${title}`}
        onClick={onOpen}
        className={`${TRIGGER_CLASS} justify-center border-[1.5px] border-dashed border-surface-dashed bg-surface-inset text-xl font-medium text-ink-muted`}
      >
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
      {slot.recipe}
    </button>
  )
}
