import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { MEALS } from '../data/week'
import { getOpeningIndex } from '../lib/dates'
import { DayCard } from './DayCard'
import { WeekendCard } from './WeekendCard'

/** Stays mounted while hidden behind another tab, so it can return to the same day. */
export function DayCarousel({ plan, isVisible }) {
  const { days, weekKey } = plan
  const [activeIndex, setActiveIndex] = useState(() => getOpeningIndex(new Date()))
  const trackRef = useRef(null)
  const targetIndexRef = useRef(null)
  const lastIndex = days.length - 1
  const openDayKey = plan.openSlot?.dayKey
  // A slot counts as planned once it has a recipe or is marked Planned.
  const mealCount = days.length * MEALS.length
  const plannedCount = days.reduce(
    (count, day) => count + MEALS.filter((meal) => day.slots[meal.key].type !== 'empty').length,
    0,
  )

  useLayoutEffect(() => {
    const openingIndex = getOpeningIndex(new Date())
    targetIndexRef.current = null
    setActiveIndex(openingIndex)
    trackRef.current.scrollTo({ left: openingIndex * getStep(), behavior: 'instant' })
  }, [weekKey])

  // A hidden track loses its scroll position, so put the day back when the tab returns.
  useLayoutEffect(() => {
    if (!isVisible) return
    targetIndexRef.current = null
    trackRef.current.scrollTo({ left: activeIndex * getStep(), behavior: 'instant' })
  }, [isVisible])

  useEffect(() => {
    if (openDayKey) goTo(days.findIndex((day) => day.day === openDayKey))
  }, [openDayKey])

  function getStep() {
    const [first, second] = trackRef.current.children
    return second.offsetLeft - first.offsetLeft
  }

  function goTo(index) {
    if (index < 0 || index > lastIndex || index === activeIndex) return
    targetIndexRef.current = index
    setActiveIndex(index)
    trackRef.current.scrollTo({ left: index * getStep() })
  }

  /** Follows swipes; ignores in-between positions while a dot animates the track. */
  function handleScroll() {
    const current = Math.round(trackRef.current.scrollLeft / getStep())
    if (targetIndexRef.current !== null) {
      if (current !== targetIndexRef.current) return
      targetIndexRef.current = null
    }
    setActiveIndex(Math.min(current, lastIndex))
  }

  function handleManualScroll() {
    targetIndexRef.current = null
  }

  return (
    <section aria-labelledby="weekly-schedule-title" className="mt-5">
      <div className="flex items-center justify-between px-4 pl-6">
        <h2
          id="weekly-schedule-title"
          className="font-label text-xs font-bold uppercase tracking-widest text-ink-muted"
        >
          Weekly Schedule
        </h2>
        <p className="flex h-7 items-center rounded-full border border-neutral-border bg-neutral px-3 font-label text-xs font-bold text-neutral-text">
          {plannedCount}/{mealCount} meals planned
        </p>
      </div>

      <div
        ref={trackRef}
        onScroll={handleScroll}
        onTouchStart={handleManualScroll}
        onWheel={handleManualScroll}
        className="mt-3 flex items-start snap-x snap-mandatory scroll-pl-4 gap-3 overflow-x-auto px-4 pb-2 pt-0.5 [mask-image:linear-gradient(to_right,transparent,black_16px)] [scrollbar-width:none] motion-safe:scroll-smooth [&::-webkit-scrollbar]:hidden"
      >
        {days.map((day) => (
          <DayCard key={day.day} day={day} plan={plan} />
        ))}
        <WeekendCard date={plan.saturdayDate} isFridayOpen={openDayKey === 'FRI'} />
      </div>

      <div className="-mt-3 flex items-center justify-center">
        {days.map((day, index) => {
          const isActive = index === activeIndex
          return (
            <button
              key={day.day}
              type="button"
              aria-label={`Show ${day.name}`}
              aria-current={isActive ? 'true' : undefined}
              onClick={() => goTo(index)}
              className="flex h-11 items-center px-[3px]"
            >
              <span
                className={`block rounded-full transition-all duration-200 ease-out ${
                  isActive ? 'h-2 w-2.5 bg-brand' : 'h-1.5 w-1.5 bg-ink-faint'
                }`}
              />
            </button>
          )
        })}
      </div>
    </section>
  )
}
