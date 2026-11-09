/** Clips a full-width card at the screen edge, so Friday stays the carousel's last stop. Stretches to the day cards' height. */
export function WeekendCard({ date }) {
  return (
    <div className="-ml-2 -mr-4 box-content flex w-weekend-card shrink-0 overflow-x-clip pl-2">
      <article
        aria-label="Saturday"
        className="flex w-[200%] shrink-0 flex-col rounded-2xl border border-surface-border bg-white px-2.5 pb-2.5 pt-3 shadow-card"
      >
        <header className="flex items-baseline justify-between border-b border-surface-border px-1 pb-2.5">
          <span className="font-display text-base uppercase tracking-wider text-ink-day">SAT</span>
          <span className="font-display text-base text-ink-day">{date}</span>
        </header>
        <p className="mt-1 flex flex-1 flex-col items-center justify-center px-2 text-center text-sm font-medium italic text-ink-muted">
          {/* Each shift puts the card's midpoint, where the screen cuts it off, after "frea" and "weeken". */}
          <span className="-translate-x-[27.5px]">it's the freakin</span>{' '}
          <span className="-translate-x-[19px]">weekend!</span>
        </p>
      </article>
    </div>
  )
}
