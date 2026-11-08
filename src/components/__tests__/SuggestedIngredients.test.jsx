import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { App } from '../../App'
import { createEmptySlots } from '../../data/week'
import { saveGroceries, savePlan } from '../../lib/storage'
import { setToday } from './testPlan'

const RECIPES = ['risotto', 'mushroom', 'rice', 'lasagna']
const INGREDIENTS = {
  Risotto: ['arborio rice', 'parmesan', 'stock'],
  Mushroom: ['cremini', 'Parmesan'],
  Rice: ['jasmine rice'],
  Lasagna: ['ricotta', 'lasagna sheets'],
}

function recipeSlot(recipe) {
  return { type: 'recipe', recipe, servings: 1 }
}

/** Seeds Nov 9–13, 2026 with `slots` placed over an empty week, opening on `today`. */
function seed(slots, { today = '2026-11-09', groceries = [] } = {}) {
  setToday(today)
  const week = createEmptySlots()
  for (const [day, meals] of Object.entries(slots)) Object.assign(week[day], meals)
  savePlan({ weekKey: '2026-11-09', slots: week, recipes: RECIPES, ingredients: INGREDIENTS })
  saveGroceries(groceries.map((name, index) => ({ id: `g${index}`, name, checkedAt: null })))
}

async function openGroceries() {
  const user = userEvent.setup()
  render(<App />)
  await user.click(within(screen.getByRole('navigation', { name: 'Main' })).getByRole('button', { name: 'Groceries' }))
  return user
}

function suggested() {
  return screen.queryByRole('region', { name: 'Suggested' })
}

/** Each dish with its chip labels, in the order shown. */
function dishes() {
  return within(suggested())
    .getAllByRole('list', { name: / ingredients$/ })
    .map((list) => [
      list.getAttribute('aria-label').replace(/ ingredients$/, ''),
      within(list).getAllByRole('button').map((chip) => chip.textContent.replace(/^\+ /, '')),
    ])
}

function listedItems() {
  return screen.queryAllByRole('checkbox').map((box) => box.closest('label').textContent)
}

describe('Suggested ingredients', () => {
  afterEach(() => vi.useRealTimers())

  it('combines every recipe a dish name contains as whole words, without repeats', async () => {
    seed({ MON: { lunch: recipeSlot('mushroom risotto'), dinner: recipeSlot('licorice tart') } })
    await openGroceries()

    expect(dishes()).toEqual([
      ['mushroom risotto', ['arborio rice', 'parmesan', 'stock', 'cremini']],
    ])
  })

  it('lists dishes in slot order from today onward, each dish once', async () => {
    seed(
      {
        MON: { lunch: recipeSlot('lasagna') },
        WED: { dinner: recipeSlot('fried rice') },
        THU: { lunch: recipeSlot('risotto'), dinner: recipeSlot('fried rice') },
      },
      { today: '2026-11-11' },
    )
    await openGroceries()

    expect(dishes().map(([dish]) => dish)).toEqual(['fried rice', 'risotto'])
  })

  it('adds a tapped chip to the list with no message, and the chip goes away', async () => {
    seed({ MON: { lunch: recipeSlot('lasagna') } }, { groceries: ['eggs'] })
    const user = await openGroceries()

    await user.click(screen.getByRole('button', { name: 'Add ricotta' }))

    expect(listedItems()).toEqual(['eggs', 'ricotta'])
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    expect(dishes()).toEqual([['lasagna', ['lasagna sheets']]])
  })

  it('hides ingredients already on the list, and the section when nothing is left', async () => {
    seed({ MON: { lunch: recipeSlot('lasagna') } }, { groceries: ['RICOTTA', 'lasagna sheets'] })
    await openGroceries()

    expect(suggested()).not.toBeInTheDocument()
  })

  it('brings a chip back when its item is cleared from the list', async () => {
    seed({ MON: { lunch: recipeSlot('lasagna') } }, { groceries: ['ricotta', 'lasagna sheets'] })
    const user = await openGroceries()

    await user.click(screen.getByRole('button', { name: 'Clear all' }))

    expect(dishes()).toEqual([['lasagna', ['ricotta', 'lasagna sheets']]])
  })

  it('shows nothing for planned or empty slots, or dishes with no matching recipe', async () => {
    seed({ MON: { lunch: { type: 'planned' }, dinner: recipeSlot('tacos') } })
    await openGroceries()

    expect(suggested()).not.toBeInTheDocument()
  })
})
