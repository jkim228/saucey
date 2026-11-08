const STEP_CLASS =
  'flex h-full w-5 items-center justify-center text-sm font-bold text-stone-700 disabled:text-stone-300'

const PILL_STEP_CLASS =
  'relative flex h-full w-6 items-center justify-center text-sm text-ink-muted transition-colors duration-200 ease-out after:absolute after:-inset-2 disabled:text-ink-faint'

/** `pill` is the rounded "− 4 servings +" style used next to a recipe's name. */
export function ServingsCounter({ value, onChange, variant = 'box' }) {
  const isPill = variant === 'pill'
  const stepClass = isPill ? PILL_STEP_CLASS : STEP_CLASS

  return (
    <div
      role="group"
      aria-label="Servings"
      className={
        isPill
          ? 'flex h-7 shrink-0 items-center rounded-full border border-surface-dashed bg-surface-inset px-0.5'
          : 'flex h-11 shrink-0 items-center rounded-lg border border-stone-300 bg-white'
      }
    >
      <button
        type="button"
        aria-label="Fewer servings"
        disabled={value === 1}
        onClick={() => onChange(value - 1)}
        className={stepClass}
      >
        <span aria-hidden="true">−</span>
      </button>
      {isPill ? (
        <span className="whitespace-nowrap px-1 text-xs font-semibold text-ink-day">
          <output>{value}</output> {value === 1 ? 'serving' : 'servings'}
        </span>
      ) : (
        <output className="min-w-3 text-center text-xs font-bold text-stone-700">{value}</output>
      )}
      <button
        type="button"
        aria-label="More servings"
        onClick={() => onChange(value + 1)}
        className={stepClass}
      >
        <span aria-hidden="true">+</span>
      </button>
    </div>
  )
}
