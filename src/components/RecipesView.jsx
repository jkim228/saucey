import { useState } from 'react'
import { MessageBar } from './MessageBar'
import { RecipeEditor } from './RecipeEditor'
import { TagPill, TagToggles } from './TagPill'

const ROW_CLASS = 'border-b border-surface-border last:border-b-0'

export function RecipesView({ recipes, editor, tagOptions, onAddTag }) {
  const { editing, deleted, getIngredients, getTags, open, close, save, remove, undoRemove } =
    editor
  const [pickedTags, setFilterTags] = useState([])
  // Only tags some recipe has are offered as filters; a pick whose tag is no longer used drops out.
  const filterOptions = tagOptions.filter((tag) => recipes.some((name) => getTags(name).includes(tag)))
  const filterTags = pickedTags.filter((tag) => filterOptions.includes(tag))
  // A recipe shows only when it has every tag picked in the filter.
  const shown = [...recipes]
    .reverse()
    .filter((name) => filterTags.every((tag) => getTags(name).includes(tag)))

  function renderEditor() {
    return (
      <li key={editing.name ?? 'new'} className={`${ROW_CLASS} p-2`}>
        <RecipeEditor
          name={editing.name}
          initialText={editing.text}
          initialServings={editing.servings}
          initialTags={editing.tags}
          tagOptions={tagOptions}
          onAddTag={onAddTag}
          onSave={save}
          onDelete={remove}
          onClose={close}
        />
      </li>
    )
  }

  return (
    <>
      {filterOptions.length > 0 && (
        <TagToggles
          label="Filter by tag"
          options={filterOptions}
          selected={filterTags}
          onChange={setFilterTags}
          className="mx-5 mt-4"
        />
      )}
      <section
        aria-label="Recipes"
        className="mx-4 mt-3 rounded-2xl border border-surface-border bg-white shadow-card"
      >
        {editing?.name !== null && shown.length === 0 && (
          <p className="px-4 py-4 text-sm font-medium italic text-ink-muted">
            No recipes with {filterTags.length === 1 ? 'this tag' : 'all these tags'}
          </p>
        )}
        <ul>
          {editing?.name === null && renderEditor()}
          {shown.map((name) => {
            if (editing?.name === name) return renderEditor()
            const recipeIngredients = getIngredients(name)
            return (
              <li key={name} className={ROW_CLASS}>
                <button
                  type="button"
                  data-recipe-trigger
                  aria-label={`Edit ${name}`}
                  onClick={() => open(name)}
                  className="flex w-full flex-col px-4 py-3.5 text-left transition-colors duration-200 ease-out active:bg-surface-inset"
                >
                  <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="font-display text-xl text-butter-text">{name}</span>
                    {getTags(name).map((tag) => (
                      <TagPill key={tag} tag={tag} />
                    ))}
                  </span>
                  {recipeIngredients.length > 0 && (
                    <span className="mt-0.5 w-full truncate text-sm font-medium text-ink-muted">
                      {recipeIngredients.join(' · ')}
                    </span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      {deleted && <MessageBar text="Recipe deleted" onUndo={undoRemove} />}
    </>
  )
}
