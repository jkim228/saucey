import { useState } from 'react'

const TAG_PILL_CLASS = 'rounded-full px-2.5 text-xs font-bold'

/** A recipe tag as shown next to the recipe's name. */
export function TagPill({ tag }) {
  return <span className={`${TAG_PILL_CLASS} bg-butter py-0.5 text-butter-text`}>{tag}</span>
}

/**
 * Every tag in `options` as a pill that turns amber when on; `selected` keeps `options` order.
 * With `onAdd`, a dashed + at the end lets the user name a new tag.
 */
export function TagToggles({ label, options, selected, onChange, onAdd, className = '' }) {
  function toggle(tag) {
    onChange(
      options.filter((option) =>
        option === tag ? !selected.includes(tag) : selected.includes(option),
      ),
    )
  }

  return (
    <div
      role="group"
      aria-label={label}
      className={`flex flex-wrap items-center gap-1.5 ${className}`}
    >
      {options.map((tag) => {
        const isOn = selected.includes(tag)
        return (
          <button
            key={tag}
            type="button"
            aria-pressed={isOn}
            onClick={() => toggle(tag)}
            className={`${TAG_PILL_CLASS} relative h-7 border transition-colors duration-200 ease-out after:absolute after:-inset-y-2 after:inset-x-0 ${
              isOn
                ? 'border-butter bg-butter text-butter-text'
                : 'border-surface-dashed bg-white text-ink-muted'
            }`}
          >
            {tag}
          </button>
        )
      })}
      {onAdd && <TagAdder onAdd={onAdd} />}
    </div>
  )
}

/** A dashed + that turns into a small text field; Enter adds the tag, Escape or a blank cancels. */
function TagAdder({ onAdd }) {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState('')

  function finish() {
    if (name.trim()) onAdd(name)
    setName('')
    setIsOpen(false)
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter') {
      event.preventDefault()
      finish()
    } else if (event.key === 'Escape') {
      setName('')
      setIsOpen(false)
    }
  }

  if (!isOpen) {
    return (
      <button
        type="button"
        aria-label="Add a tag"
        onClick={() => setIsOpen(true)}
        className="relative flex h-7 w-7 items-center justify-center rounded-full border border-dashed border-ink-muted text-sm leading-none text-ink-muted transition-colors duration-200 ease-out after:absolute after:-inset-2 active:scale-[0.97]"
      >
        <span aria-hidden="true">+</span>
      </button>
    )
  }

  return (
    <input
      type="text"
      autoFocus
      aria-label="New tag name"
      placeholder="new tag"
      maxLength={20}
      autoComplete="off"
      value={name}
      onChange={(event) => setName(event.target.value)}
      onKeyDown={handleKeyDown}
      onBlur={finish}
      className={`${TAG_PILL_CLASS} h-7 w-24 border border-dashed border-ink-muted bg-white text-ink-day placeholder:font-medium placeholder:text-ink-muted`}
    />
  )
}
