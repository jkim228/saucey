import { MEALS } from '../data/week'
import { MealSlot } from './MealSlot'

export function DayCard({ day, plan }) {
  const { name, day: dayLabel, date } = day

  return (
    <article
      aria-label={name}
      className="w-day-card shrink-0 snap-start rounded-2xl border border-surface-border bg-white px-2.5 pb-2.5 pt-3 shadow-card"
    >
      <header className="flex items-baseline justify-between border-b border-surface-border px-1 pb-2.5">
        <span className="font-display text-base uppercase tracking-wider text-ink-day">
          {dayLabel}
        </span>
        <span className="font-display text-base text-ink-day">{date}</span>
      </header>
      <div className="mt-2.5 flex flex-col gap-3">
        {MEALS.map((meal) => (
          <MealSlot key={meal.key} day={day} meal={meal} plan={plan} />
        ))}
      </div>
    </article>
  )
}
