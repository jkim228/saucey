/** A brief message floating just above the bottom menu bar, with an optional Undo. */
export function MessageBar({ text, onUndo }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[calc(3.5rem+env(safe-area-inset-bottom)+0.75rem)] flex justify-center px-4">
      <p
        role="status"
        className="pointer-events-auto flex items-center rounded-full bg-ink-day pl-4 text-sm font-medium text-white shadow-card"
      >
        <span className={onUndo ? '' : 'py-2.5 pr-4'}>{text}</span>
        {onUndo && (
          <>
            <span aria-hidden="true" className="px-1.5 text-white/60">
              ·
            </span>
            <button type="button" onClick={onUndo} className="h-10 pr-4 font-bold text-butter">
              Undo
            </button>
          </>
        )}
      </p>
    </div>
  )
}
