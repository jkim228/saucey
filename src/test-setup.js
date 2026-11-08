import '@testing-library/jest-dom/vitest'
import { afterEach, beforeEach, vi } from 'vitest'

// jsdom has no layout or scrolling, so scrollTo doesn't exist on elements.
Element.prototype.scrollTo = () => {}

beforeEach(() => {
  localStorage.clear()
})

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})
