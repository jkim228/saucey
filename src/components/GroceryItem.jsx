import { useRef, useState } from 'react'

// How far left a row must be dragged before letting go deletes it.
const DELETE_DISTANCE_PX = 96
// Movement needed before a drag counts as a horizontal swipe rather than a tap or scroll.
const SWIPE_START_PX = 8
const SLIDE_OUT_MS = 180

/** A grocery row: tap to check off, swipe left (or press Delete/Backspace) to remove. */
export function GroceryItem({ item, onToggle, onRemove }) {
  const isChecked = item.checkedAt !== null
  const [offset, setOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)
  const dragRef = useRef(null)
  const didSwipeRef = useRef(false)

  function handlePointerDown(event) {
    if (isLeaving) return
    dragRef.current = { x: event.clientX, y: event.clientY, offset: 0, isSwiping: false }
    didSwipeRef.current = false
  }

  function handlePointerMove(event) {
    const drag = dragRef.current
    if (!drag) return
    const dx = event.clientX - drag.x
    const dy = event.clientY - drag.y

    if (!drag.isSwiping) {
      // A mostly vertical drag is a scroll, so let the page have it.
      if (Math.abs(dy) > SWIPE_START_PX && Math.abs(dy) > Math.abs(dx)) {
        dragRef.current = null
        return
      }
      if (Math.abs(dx) < SWIPE_START_PX) return
      drag.isSwiping = true
      didSwipeRef.current = true
      setIsDragging(true)
      event.currentTarget.setPointerCapture?.(event.pointerId)
    }
    drag.offset = Math.min(0, dx)
    setOffset(drag.offset)
  }

  function handlePointerUp() {
    const drag = dragRef.current
    dragRef.current = null
    if (!drag?.isSwiping) return
    setIsDragging(false)
    if (drag.offset > -DELETE_DISTANCE_PX) {
      setOffset(0)
      return
    }
    setIsLeaving(true)
    setTimeout(onRemove, SLIDE_OUT_MS)
  }

  // A swipe ends with a click on the row, which shouldn't also check the item off.
  function handleClick(event) {
    if (!didSwipeRef.current) return
    event.preventDefault()
    didSwipeRef.current = false
  }

  function handleKeyDown(event) {
    if (event.key === 'Delete' || event.key === 'Backspace') onRemove()
  }

  return (
    <li className="relative overflow-hidden border-b border-surface-border last:border-b-0">
      {/* Only rendered mid-swipe, so its red can't show at the row's edges while at rest. */}
      {(offset < 0 || isLeaving) && (
        <div
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-end bg-red-600 pr-4 text-sm font-bold text-white"
        >
          Delete
        </div>
      )}
      <label
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onClick={handleClick}
        style={{ transform: isLeaving ? 'translateX(-100%)' : `translateX(${offset}px)` }}
        className={`relative flex min-h-12 cursor-pointer touch-pan-y select-none items-center gap-3.5 bg-paper pl-2 pr-3 ${
          isDragging ? '' : 'transition-transform duration-200 ease-out'
        }`}
      >
        <input
          type="checkbox"
          checked={isChecked}
          onChange={onToggle}
          onKeyDown={handleKeyDown}
          className="peer sr-only"
        />
        <span
          aria-hidden="true"
          className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border-[1.5px] border-stone-300 text-white transition-colors duration-200 ease-out peer-checked:border-brand peer-checked:bg-brand peer-focus-visible:ring-2 peer-focus-visible:ring-butter-edge"
        >
          {isChecked && (
            <svg viewBox="0 0 12 12" className="h-3 w-3">
              <polyline
                points="2.5,6.5 5,9 9.5,3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </span>
        <span
          className={`py-3.5 font-serif text-[16px] leading-snug ${
            isChecked ? 'text-ink-muted line-through' : 'text-stone-900'
          }`}
        >
          {item.name}
        </span>
      </label>
    </li>
  )
}
