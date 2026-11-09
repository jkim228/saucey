import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { App } from '../../App'
import { seedSampleWeek } from './testPlan'

const MONDAY_LUNCH = 'Edit Monday lunch: lasagna'
const MONDAY_DINNER = 'Edit Monday dinner: lasagna'

function button(name) {
  return screen.getByRole('button', { name })
}

function searchBar() {
  return screen.getByRole('textbox', { name: 'Search or add recipe' })
}

it('has no servings counter in the Add a dish panel', async () => {
  seedSampleWeek()
  const user = userEvent.setup()
  render(<App />)
  await user.click(screen.getByRole('button', { name: MONDAY_LUNCH }))
  expect(screen.queryByRole('group', { name: 'Servings' })).not.toBeInTheDocument()
})

describe('Recipe slot', () => {
  let user

  beforeEach(() => {
    seedSampleWeek()
    user = userEvent.setup()
    render(<App />)
  })

  describe('opening and closing the panel', () => {
    it('opens a panel when a slot is tapped and closes it with [x] without saving', async () => {
      await user.click(button(MONDAY_LUNCH))
      expect(screen.getByRole('form', { name: 'Edit Monday lunch' })).toBeInTheDocument()

      await user.clear(searchBar())
      await user.type(searchBar(), 'soup')
      await user.click(button('Close'))

      expect(screen.queryByRole('form')).not.toBeInTheDocument()
      expect(button(MONDAY_LUNCH)).toBeInTheDocument()
    })

    it('keeps one panel open at a time and discards edits when switching slots', async () => {
      await user.click(button(MONDAY_LUNCH))
      await user.clear(searchBar())
      await user.type(searchBar(), 'soup')

      await user.click(button(MONDAY_DINNER))

      expect(screen.getAllByRole('form')).toHaveLength(1)
      expect(screen.getByRole('form', { name: 'Edit Monday dinner' })).toBeInTheDocument()
      expect(button(MONDAY_LUNCH)).toBeInTheDocument()
    })

    it('closes without saving when tapping outside the panel', async () => {
      await user.click(button(MONDAY_LUNCH))
      await user.click(screen.getByRole('heading', { name: 'Weekly Schedule' }))

      expect(screen.queryByRole('form')).not.toBeInTheDocument()
    })
  })

  describe('searching and assigning', () => {
    it('swaps the recipe by choosing a search result', async () => {
      await user.click(button(MONDAY_LUNCH))
      expect(searchBar()).toHaveValue('lasagna')

      await user.clear(searchBar())
      await user.type(searchBar(), 'cal')
      await user.click(button('caldo verde'))
      expect(searchBar()).toHaveValue('caldo verde')

      await user.click(button('Assign'))

      expect(screen.queryByRole('form')).not.toBeInTheDocument()
      expect(button('Edit Monday lunch: caldo verde')).toBeInTheDocument()
    })

    it('disables Assign until the search bar contains a name', async () => {
      await user.click(button(MONDAY_LUNCH))
      await user.clear(searchBar())
      expect(button('Assign')).toBeDisabled()

      await user.type(searchBar(), '   ')
      expect(button('Assign')).toBeDisabled()
    })

    it('creates a new recipe that appears in later searches', async () => {
      await user.click(button(MONDAY_LUNCH))
      await user.clear(searchBar())
      await user.type(searchBar(), 'pho')
      await user.click(button('Assign'))
      expect(button('Edit Monday lunch: pho')).toBeInTheDocument()

      await user.click(button(MONDAY_DINNER))
      await user.clear(searchBar())
      await user.type(searchBar(), 'P')

      expect(button('pho')).toBeInTheDocument()
    })

    it('treats names differing only by capitalization as the same recipe', async () => {
      await user.click(button(MONDAY_LUNCH))
      await user.clear(searchBar())
      await user.type(searchBar(), 'CALDO VERDE')
      await user.click(button('Assign'))

      expect(button('Edit Monday lunch: caldo verde')).toBeInTheDocument()
    })
  })

  describe('removing', () => {
    it('empties the slot immediately, and the recipe stays available in search', async () => {
      await user.click(button(MONDAY_LUNCH))
      await user.click(button('Remove'))

      expect(screen.queryByRole('form')).not.toBeInTheDocument()
      await user.click(button('Add to Monday lunch'))
      expect(screen.queryByRole('button', { name: 'Remove' })).not.toBeInTheDocument()

      await user.type(searchBar(), 'Lasa')
      expect(button('lasagna')).toBeInTheDocument()
    })
  })

  describe('planned state', () => {
    it('replaces the recipe with one tap, and can be removed to empty the slot', async () => {
      await user.click(button(MONDAY_LUNCH))
      await user.click(button('Planned'))

      expect(screen.queryByRole('form')).not.toBeInTheDocument()
      await user.click(button('Edit Monday lunch: Planned'))
      await user.click(button('Remove'))

      expect(button('Add to Monday lunch')).toBeInTheDocument()
    })
  })
})
