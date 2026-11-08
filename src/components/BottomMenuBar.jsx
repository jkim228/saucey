import { TABS } from '../data/tabs'

export function BottomMenuBar({ activeTab, onSelect }) {
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 border-t border-surface-border bg-white pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="mx-auto flex w-full max-w-[456px]">
        {TABS.map((tab) => {
          const isActive = tab.key === activeTab
          return (
            <li key={tab.key} className="flex-1">
              <button
                type="button"
                aria-label={tab.label}
                aria-current={isActive ? 'page' : undefined}
                onClick={() => onSelect(tab.key)}
                className={`flex h-14 w-full items-center justify-center transition-colors duration-200 ease-out ${
                  isActive ? 'text-brand' : 'text-ink-muted'
                }`}
              >
                {/* The icon file is a stencil, so it takes the button's text color. */}
                <span
                  aria-hidden="true"
                  className="h-6 w-6 bg-current [mask-repeat:no-repeat] [mask-size:contain]"
                  style={{ maskImage: `url(${tab.icon})`, WebkitMaskImage: `url(${tab.icon})` }}
                />
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
