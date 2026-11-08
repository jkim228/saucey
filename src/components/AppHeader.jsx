import mascot from '../assets/mascot.png'

/** `action` sits at the right of the heading, such as Recipes' New Recipe button. */
export function AppHeader({ heading, action }) {
  return (
    <header className="px-5 pt-2.5">
      <div className="flex items-center gap-2">
        <img src={mascot} alt="" className="h-9 w-9 rounded-full" />
        <h1 className="font-label text-xs font-bold uppercase tracking-widest text-ink-muted">Saucey</h1>
      </div>
      {heading && (
        <div className="mt-3 flex items-center justify-between px-1">
          <p className="font-display text-[1.65rem] text-ink-day">{heading}</p>
          {action}
        </div>
      )}
    </header>
  )
}
