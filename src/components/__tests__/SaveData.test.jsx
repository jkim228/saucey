import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { App } from '../../App'
import { createEmptySlots } from '../../data/week'
import { loadGroceries, loadPlan, saveGroceries, savePlan } from '../../lib/storage'
import { seedSampleWeek, setToday } from './testPlan'

const SLOT_COUNT = 10

function button(name) {
  return screen.getByRole('button', { name })
}

function searchBar() {
  return screen.getByRole('textbox', { name: 'Search or add recipe' })
}

function emptySlots() {
  return screen.getAllByRole('button', { name: /^Add to / })
}

function reload(view) {
  view.unmount()
  return render(<App />)
}

async function assignNewRecipe(user, slotName, recipe) {
  await user.click(button(slotName))
  await user.type(searchBar(), recipe)
  await user.click(button('Assign'))
}

describe('Save data', () => {
  describe('first use', () => {
    it('starts with an empty week and the starter recipes in search', async () => {
      setToday('2026-11-09')
      const user = userEvent.setup()
      render(<App />)
      expect(emptySlots()).toHaveLength(SLOT_COUNT)

      await user.click(button('Add to Monday lunch'))
      await user.type(searchBar(), 'a')

      expect(button('caldo verde')).toBeInTheDocument()
      expect(button('kimchi jjigae')).toBeInTheDocument()
      expect(button('lasagna')).toBeInTheDocument()
    })
  })

  describe('saving', () => {
    it('keeps recipes and Planned slots after a reload', async () => {
      setToday('2026-11-09')
      const user = userEvent.setup()
      const view = render(<App />)

      await user.click(button('Add to Monday lunch'))
      await user.type(searchBar(), 'lasagna')
      await user.click(button('Assign'))
      await user.click(button('Add to Monday dinner'))
      await user.click(button('Planned'))

      reload(view)

      expect(button('Edit Monday dinner: Planned')).toBeInTheDocument()
      expect(button('Edit Monday lunch: lasagna')).toBeInTheDocument()
    })

    it('keeps new recipes after a reload', async () => {
      setToday('2026-11-09')
      const user = userEvent.setup()
      const view = render(<App />)
      await assignNewRecipe(user, 'Add to Monday lunch', 'pho')

      reload(view)

      await user.click(button('Add to Monday dinner'))
      await user.type(searchBar(), 'P')
      expect(button('pho')).toBeInTheDocument()
    })

    it('does not save unsaved edits in an open panel', async () => {
      setToday('2026-11-09')
      const user = userEvent.setup()
      const view = render(<App />)
      await user.click(button('Add to Monday lunch'))
      await user.type(searchBar(), 'pho')

      reload(view)

      expect(emptySlots()).toHaveLength(SLOT_COUNT)
    })
  })

  describe('when saving fails', () => {
    it('warns and keeps working', async () => {
      setToday('2026-11-09')
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('Storage is full')
      })
      const user = userEvent.setup()
      render(<App />)

      expect(screen.getByRole('alert')).toHaveTextContent("won't be kept after a reload")

      await assignNewRecipe(user, 'Add to Monday lunch', 'pho')
      expect(button('Edit Monday lunch: pho')).toBeInTheDocument()
    })

    it('shows no warning when saving works', () => {
      setToday('2026-11-09')
      render(<App />)

      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })

    it.each([
      ['unreadable', 'not json{'],
      ['incomplete', '{"weekKey":"2026-11-09","recipes":["pho"],"slots":{"MON":{}}}'],
    ])('starts with an empty week and starter recipes if saved data is %s', async (_, saved) => {
      setToday('2026-11-09')
      localStorage.setItem('meal-matrix', saved)
      const user = userEvent.setup()
      render(<App />)

      expect(emptySlots()).toHaveLength(SLOT_COUNT)
      await user.click(button('Add to Monday lunch'))
      await user.type(searchBar(), 'a')
      expect(button('lasagna')).toBeInTheDocument()
    })
  })

  describe('clearing for a new week', () => {
    it('clears all slots but keeps recipes when reopened in a new week', async () => {
      setToday('2026-11-09')
      const user = userEvent.setup()
      const view = render(<App />)
      await assignNewRecipe(user, 'Add to Monday lunch', 'pho')

      setToday('2026-11-16')
      reload(view)

      expect(emptySlots()).toHaveLength(SLOT_COUNT)
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
      await user.click(button('Add to Monday lunch'))
      await user.type(searchBar(), 'P')
      expect(button('pho')).toBeInTheDocument()
    })

    it('does not clear the plan within the same week', () => {
      seedSampleWeek()
      setToday('2026-11-13')
      render(<App />)

      expect(button('Edit Monday lunch: lasagna')).toBeInTheDocument()
    })

    it('clears from Saturday, when the dates move to the upcoming week', () => {
      seedSampleWeek()
      setToday('2026-11-14')
      render(<App />)

      expect(emptySlots()).toHaveLength(SLOT_COUNT)
    })

    it('updates only when you return, closing any open panel', async () => {
      seedSampleWeek()
      const user = userEvent.setup()
      render(<App />)
      await user.click(button('Edit Monday lunch: lasagna'))

      setToday('2026-11-14')
      expect(screen.getByRole('form')).toBeInTheDocument()
      expect(screen.getByText('Nov 9')).toBeInTheDocument()

      act(() => {
        window.dispatchEvent(new Event('focus'))
      })

      expect(screen.queryByRole('form')).not.toBeInTheDocument()
      expect(screen.getByText('Nov 16')).toBeInTheDocument()
      expect(emptySlots()).toHaveLength(SLOT_COUNT)
    })
  })

  describe('lowercase', () => {
    it('lowercases recipes, ingredients, slots and grocery items saved before', () => {
      setToday('2026-11-09')
      const slots = createEmptySlots()
      slots.MON.lunch = { type: 'recipe', recipe: 'Chicken Wrap', servings: 2 }
      savePlan({
        weekKey: '2026-11-09',
        slots,
        recipes: ['Chicken Wrap', 'Lasagna'],
        ingredients: { 'Chicken Wrap': ['Tortilla', 'Chicken'] },
        servings: { 'Chicken Wrap': 2 },
        tags: { Lasagna: ['dinner'] },
      })
      saveGroceries([
        { id: 'a', name: 'Milk', checkedAt: null },
        { id: 'b', name: 'milk', checkedAt: null },
      ])

      const plan = loadPlan()
      expect(plan.recipes).toEqual(['chicken wrap', 'lasagna'])
      expect(plan.slots.MON.lunch.recipe).toBe('chicken wrap')
      expect(plan.ingredients).toEqual({ 'chicken wrap': ['tortilla', 'chicken'] })
      expect(plan.servings).toEqual({ 'chicken wrap': 2 })
      expect(plan.tags).toEqual({ lasagna: ['dinner'], 'chicken wrap': ['2+'] })
      expect(loadGroceries().map((item) => item.name)).toEqual(['milk'])
    })

    it('saves new recipes typed with capitals in lowercase', async () => {
      setToday('2026-11-09')
      const user = userEvent.setup()
      render(<App />)

      await assignNewRecipe(user, 'Add to Monday lunch', 'Mushie Risotto')

      expect(button('Edit Monday lunch: mushie risotto')).toBeInTheDocument()
      expect(loadPlan().recipes).toContain('mushie risotto')
    })
  })
})
