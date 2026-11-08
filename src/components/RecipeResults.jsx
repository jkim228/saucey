import { useLayoutEffect, useState } from 'react'
import { createPortal } from 'react-dom'

const MAX_LIST_HEIGHT = 220
const VIEWPORT_MARGIN = 8

/** Renders outside the carousel, whose scrolling would otherwise clip the list. */
export function RecipeResults({ anchorRef, recipes, onSelect }) {
  const [position, setPosition] = useState(null)

  useLayoutEffect(() => {
    function updatePosition() {
      const { left, bottom, width } = anchorRef.current.getBoundingClientRect()
      const top = bottom + 4
      setPosition({
        left,
        top,
        width,
        maxHeight: Math.min(MAX_LIST_HEIGHT, window.innerHeight - top - VIEWPORT_MARGIN),
      })
    }

    updatePosition()
    window.addEventListener('scroll', updatePosition, true)
    window.addEventListener('resize', updatePosition)
    return () => {
      window.removeEventListener('scroll', updatePosition, true)
      window.removeEventListener('resize', updatePosition)
    }
  }, [anchorRef])

  if (!position) return null

  return createPortal(
    <ul
      data-slot-panel
      aria-label="Matching recipes"
      style={position}
      className="fixed z-50 overflow-y-auto rounded-xl border border-surface-border bg-white py-1 font-sans shadow-card"
    >
      {recipes.map((recipe) => (
        <li key={recipe}>
          <button
            type="button"
            onClick={() => onSelect(recipe)}
            className="flex min-h-11 w-full items-center px-2.5 text-left text-xs font-bold text-butter-text hover:bg-butter"
          >
            {recipe}
          </button>
        </li>
      ))}
    </ul>,
    document.body,
  )
}
