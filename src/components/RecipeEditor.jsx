import { useEffect, useState } from 'react'
import { ServingsCounter } from './ServingsCounter'
import { TagToggles } from './TagPill'
import { withServingsTag } from '../data/tags'

const FIELD_CLASS =
  'w-full rounded-lg border border-stone-300 bg-white px-2 text-sm font-medium text-stone-900 placeholder:text-ink-muted'

/** An open recipe card spanning both grid columns. `name` is null while creating a recipe. */
export function RecipeEditor({
  name,
  initialText,
  initialServings,
  initialTags,
  tagOptions,
  onAddTag,
  onSave,
  onDelete,
  onClose,
}) {
  const isNew = name === null
  const [nameValue, setNameValue] = useState('')
  const [text, setText] = useState(initialText)
  const [servings, setServings] = useState(initialServings)
  const [tags, setTags] = useState(initialTags)
  const title = isNew ? 'New recipe' : name
  const canSave = !isNew || nameValue.trim() !== ''

  useEffect(() => {
    function handleDocumentClick(event) {
      // A click that swapped its own button out (like the tag +) has already left the page by
      // now, so it can't be told apart from an outside click; it came from inside, so ignore it.
      if (!event.target.isConnected) return
      if (event.target.closest('[data-recipe-editor], [data-recipe-trigger]')) return
      onClose()
    }

    document.addEventListener('click', handleDocumentClick)
    return () => document.removeEventListener('click', handleDocumentClick)
  }, [onClose])

  function handleSubmit(event) {
    event.preventDefault()
    if (canSave) onSave(nameValue.trim(), text, servings, tags)
  }

  /** Going above 1 serving turns on "2+", so the pill shows what saving will do. */
  function handleServingsChange(value) {
    setServings(value)
    setTags((current) => withServingsTag(current, value))
  }

  /** A tag named here is created and switched on for this recipe. */
  function handleAddTag(tagName) {
    const tag = onAddTag(tagName)
    if (tag) setTags((current) => (current.includes(tag) ? current : [...current, tag]))
  }

  function handleKeyDown(event) {
    if (event.key === 'Escape') onClose()
  }

  return (
    <form
      data-recipe-editor
      aria-label={isNew ? 'New recipe' : `Edit ${name}`}
      onSubmit={handleSubmit}
      onKeyDown={handleKeyDown}
      className="relative flex flex-col gap-2 rounded-xl border border-surface-border bg-surface-inset p-[11px] shadow-card"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute right-0 top-0 flex h-11 w-11 items-center justify-center text-lg leading-none text-ink-muted"
      >
        <span aria-hidden="true">×</span>
      </button>

      <div className="mr-8 flex items-center gap-2">
        {isNew ? (
          <input
            type="text"
            autoFocus
            aria-label="Recipe name"
            placeholder="Recipe name"
            autoComplete="off"
            value={nameValue}
            onChange={(event) => setNameValue(event.target.value)}
            className={`${FIELD_CLASS} h-11 min-w-0 flex-1 font-bold`}
          />
        ) : (
          <p className="min-w-0 break-words py-1.5 pl-1.5 font-display text-xl text-butter-text">
            {title}
          </p>
        )}
        <ServingsCounter variant="pill" value={servings} onChange={handleServingsChange} />
      </div>

      <TagToggles
        label="Tags"
        options={tagOptions}
        selected={tags}
        onChange={setTags}
        onAdd={handleAddTag}
        className="px-1.5"
      />

      <textarea
        autoFocus={!isNew}
        aria-label="Ingredients"
        placeholder="One ingredient per line"
        rows={5}
        value={text}
        onChange={(event) => setText(event.target.value)}
        className={`${FIELD_CLASS} resize-none py-2 leading-snug`}
      />

      <button
        type="submit"
        disabled={!canSave}
        className="relative h-8 rounded-lg bg-action text-[11px] font-bold text-white transition-all duration-200 ease-out after:absolute after:inset-x-0 after:-inset-y-1.5 active:scale-[0.98] disabled:bg-stone-200 disabled:text-ink-muted"
      >
        Save
      </button>

      {!isNew && (
        <button
          type="button"
          onClick={onDelete}
          className="mx-auto h-8 px-3 text-xs font-medium text-ink-muted underline-offset-2 hover:underline"
        >
          Delete
        </button>
      )}
    </form>
  )
}
