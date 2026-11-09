import { MEALS } from '../data/week'

const CELL_CLASS =
  'flex min-h-[60px] w-full flex-1 items-center rounded-xl px-[5px] text-left transition-all duration-200 ease-out active:scale-[0.98]'

/** The whole week at a glance: a column per weekday, lunch above dinner. */
export function WeekGrid({ days, onSelectSlot }) {
  return (
    <div
      role="group"
      aria-label="Week at a glance"
      className="mx-4 mb-4 mt-3 flex flex-auto gap-1.5 rounded-2xl border border-surface-border bg-white p-2 shadow-card"
    >
      {days.map((day, index) => (
        <div
          key={day.day}
          role="group"
          aria-label={`${day.name} at a glance`}
          className="flex min-w-0 flex-1 flex-col"
        >
          <div className="flex flex-col items-center border-b border-surface-border pb-2 pt-1">
            <span className="font-display text-sm uppercase tracking-wider text-ink-day">
              {day.day}
            </span>
            <span className="font-display text-xs text-ink-day">{day.date}</span>
          </div>
          <div className="mt-2 flex flex-1 flex-col gap-1.5">
            {MEALS.map((meal) => (
              <WeekCell
                key={meal.key}
                slot={day.slots[meal.key]}
                title={`${day.name} ${meal.label.toLowerCase()}`}
                onSelect={() => onSelectSlot(index, day.day, meal.key)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function WeekCell({ slot, title, onSelect }) {
  const props = { type: 'button', 'data-slot-trigger': true, onClick: onSelect }

  if (slot.type === 'empty') {
    return (
      <button
        {...props}
        aria-label={`Add to ${title}`}
        className={`${CELL_CLASS} justify-center border-[1.5px] border-dashed border-surface-dashed bg-surface-inset text-lg font-medium text-ink-muted`}
      >
        <span aria-hidden="true">+</span>
      </button>
    )
  }

  if (slot.type === 'planned') {
    return (
      <button
        {...props}
        aria-label={`Edit ${title}: Planned`}
        className={`${CELL_CLASS} border border-planned-border bg-planned font-display text-[13px] text-planned-text`}
      >
        planned!
      </button>
    )
  }

  return (
    <button
      {...props}
      aria-label={`Edit ${title}: ${slot.recipe}`}
      className={`${CELL_CLASS} border border-butter-border bg-butter font-display text-[13px] leading-tight text-butter-text hyphens-auto [overflow-wrap:anywhere]`}
    >
      {slot.recipe}
    </button>
  )
}
