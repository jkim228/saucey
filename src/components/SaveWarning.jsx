export function SaveWarning() {
  return (
    <p
      role="alert"
      className="mx-4 mt-3 rounded-xl bg-red-100 px-3 py-2 text-xs font-medium text-red-800"
    >
      Your changes can't be saved, so they won't be kept after a reload.
    </p>
  )
}
