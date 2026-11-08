export function NewRecipeButton({ onClick }) {
  return (
    <button
      type="button"
      data-recipe-trigger
      onClick={onClick}
      className="relative flex h-8 items-center gap-1.5 rounded-full bg-action pl-3 pr-3.5 text-sm font-bold text-white shadow-card transition-all duration-200 ease-out after:absolute after:inset-x-0 after:-inset-y-1.5 active:scale-[0.98]"
    >
      <span aria-hidden="true" className="text-lg leading-none">
        +
      </span>
      New Recipe
    </button>
  )
}
