import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { App } from '../../App'
import { STARTER_RECIPES } from '../../data/week'
import { savePlan } from '../../lib/storage'
import { SAMPLE_SLOTS, seedSampleWeek } from './testPlan'

function button(name) {
  return screen.getByRole('button', { name })
}

function menuButton(name) {
  return within(screen.getByRole('navigation', { name: 'Main' })).getByRole('button', { name })
}

function recipesGrid() {
  return within(screen.getByRole('region', { name: 'Recipes' }))
}

/** List order as the rows' accessible names. */
function cardNames() {
  return recipesGrid()
    .getAllByRole('button')
    .map((card) => card.getAttribute('aria-label'))
}

function ingredientsBox() {
  return screen.getByRole('textbox', { name: 'Ingredients' })
}

async function openRecipes(user) {
  render(<App />)
  await user.click(menuButton('Recipes'))
}

async function createRecipe(user, name, ingredients) {
  await user.click(button('New Recipe'))
  await user.type(screen.getByRole('textbox', { name: 'Recipe name' }), name)
  if (ingredients) await user.type(ingredientsBox(), ingredients)
  await user.click(button('Save'))
}

describe('Add new recipe', () => {
  beforeEach(seedSampleWeek)

  describe('recipe cards', () => {
    it('shows a New Recipe button beside the Recipes heading, with no dish count', async () => {
      const user = userEvent.setup()
      await openRecipes(user)

      const heading = screen.getByText('Recipes', { selector: 'p' })
      expect(heading.parentElement).toContainElement(button('New Recipe'))
      expect(screen.queryByText(/\d+ Dish(es)?/)).not.toBeInTheDocument()
    })

    it('lists recipes newest first, with the name only when there are no ingredients', async () => {
      const user = userEvent.setup()
      await openRecipes(user)

      expect(cardNames()).toEqual(['Edit lasagna', 'Edit kimchi jjigae', 'Edit caldo verde'])
      expect(button('Edit lasagna')).toHaveTextContent(/^lasagna$/)
    })

    it('lists ingredients under the name, separated by dots', async () => {
      savePlan({
        weekKey: '2026-11-09',
        slots: SAMPLE_SLOTS,
        recipes: STARTER_RECIPES,
        ingredients: { Lasagna: ['garlic', 'onion', 'white wine'] },
      })
      const user = userEvent.setup()
      await openRecipes(user)

      expect(button('Edit lasagna')).toHaveTextContent('lasagnagarlic · onion · white wine')
    })
  })

  describe('editing ingredients', () => {
    it('saves one ingredient per line, cleaning up blanks, spaces and repeats', async () => {
      const user = userEvent.setup()
      await openRecipes(user)

      await user.click(button('Edit lasagna'))
      await user.type(ingredientsBox(), '  garlic \n\nOnion\nonion\nbéchamel   sauce')
      await user.click(button('Save'))

      expect(screen.queryByRole('form', { name: 'Edit lasagna' })).not.toBeInTheDocument()
      expect(button('Edit lasagna')).toHaveTextContent('garlic · onion · béchamel sauce')
    })

    it('reopens a card with its ingredients one per line', async () => {
      const user = userEvent.setup()
      await openRecipes(user)

      await user.click(button('Edit lasagna'))
      await user.type(ingredientsBox(), 'garlic\nonion')
      await user.click(button('Save'))
      await user.click(button('Edit lasagna'))

      expect(ingredientsBox()).toHaveValue('garlic\nonion')
    })

    it.each([
      ['the [x]', (user) => user.click(button('Close'))],
      ['Escape', (user) => user.keyboard('{Escape}')],
      ['tapping outside', (user) => user.click(screen.getByText('Saucey'))],
    ])('closes without saving with %s', async (_, close) => {
      const user = userEvent.setup()
      await openRecipes(user)

      await user.click(button('Edit lasagna'))
      await user.type(ingredientsBox(), 'garlic')
      await close(user)

      expect(screen.queryByRole('form', { name: 'Edit lasagna' })).not.toBeInTheDocument()
      expect(button('Edit lasagna')).toHaveTextContent(/^lasagna$/)
    })

    it('closes without saving when switching tabs', async () => {
      const user = userEvent.setup()
      await openRecipes(user)

      await user.click(button('Edit lasagna'))
      await user.type(ingredientsBox(), 'garlic')
      await user.click(menuButton('Weekly schedule'))
      await user.click(menuButton('Recipes'))

      expect(screen.queryByRole('form', { name: 'Edit lasagna' })).not.toBeInTheDocument()
      expect(button('Edit lasagna')).toHaveTextContent(/^lasagna$/)
    })

    it('keeps only one card open, discarding the first card’s edits', async () => {
      const user = userEvent.setup()
      await openRecipes(user)

      await user.click(button('Edit lasagna'))
      await user.type(ingredientsBox(), 'garlic')
      await user.click(button('Edit caldo verde'))

      expect(screen.getAllByRole('form')).toHaveLength(1)
      expect(screen.getByRole('form', { name: 'Edit caldo verde' })).toBeInTheDocument()
      expect(button('Edit lasagna')).toHaveTextContent(/^lasagna$/)
    })

    it('keeps ingredients after a reload', async () => {
      const user = userEvent.setup()
      const view = render(<App />)
      await user.click(menuButton('Recipes'))

      await user.click(button('Edit lasagna'))
      await user.type(ingredientsBox(), 'garlic')
      await user.click(button('Save'))
      view.unmount()
      render(<App />)

      expect(button('Edit lasagna')).toHaveTextContent('garlic')
    })
  })

  describe('creating a recipe', () => {
    it('disables Save until a name is entered', async () => {
      const user = userEvent.setup()
      await openRecipes(user)

      await user.click(button('New Recipe'))

      expect(button('Save')).toBeDisabled()
      await user.type(screen.getByRole('textbox', { name: 'Recipe name' }), 'bibimbap')
      expect(button('Save')).toBeEnabled()
    })

    it('adds the new recipe first and makes it available in slot search', async () => {
      const user = userEvent.setup()
      await openRecipes(user)

      await createRecipe(user, 'bibimbap', 'rice\nspinach')

      expect(cardNames()[0]).toEqual('Edit bibimbap')
      expect(button('Edit bibimbap')).toHaveTextContent('rice · spinach')

      await user.click(menuButton('Weekly schedule'))
      await user.click(button('Edit Monday lunch: lasagna'))
      await user.clear(screen.getByRole('textbox', { name: 'Search or add recipe' }))
      await user.type(screen.getByRole('textbox', { name: 'Search or add recipe' }), 'bibim')
      expect(button('bibimbap')).toBeInTheDocument()
    })

    it('opens the existing card instead of creating a duplicate', async () => {
      const user = userEvent.setup()
      await openRecipes(user)

      await createRecipe(user, 'lasagna', 'garlic')

      expect(screen.getByRole('form', { name: 'Edit lasagna' })).toBeInTheDocument()
      expect(ingredientsBox()).toHaveValue('garlic')
      await user.click(button('Close'))
      expect(cardNames()).toHaveLength(STARTER_RECIPES.length)
    })
  })

  describe('servings', () => {
    function servingsValue() {
      return screen.getByRole('group', { name: 'Servings' }).querySelector('output').textContent
    }

    it('starts every recipe at 1, keeps a change on Save and drops it on close', async () => {
      const user = userEvent.setup()
      await openRecipes(user)

      await user.click(button('Edit lasagna'))
      expect(servingsValue()).toBe('1')
      expect(button('Fewer servings')).toBeDisabled()

      await user.click(button('More servings'))
      await user.click(button('More servings'))
      await user.click(button('Close'))
      await user.click(button('Edit lasagna'))
      expect(servingsValue()).toBe('1')

      await user.click(button('More servings'))
      await user.click(button('Save'))
      await user.click(button('Edit lasagna'))
      expect(servingsValue()).toBe('2')
    })

    it('shows the counter on a new recipe and saves its count', async () => {
      const user = userEvent.setup()
      await openRecipes(user)

      await user.click(button('New Recipe'))
      expect(servingsValue()).toBe('1')
      await user.type(screen.getByRole('textbox', { name: 'Recipe name' }), 'bibimbap')
      await user.click(button('More servings'))
      await user.click(button('Save'))

      expect(recipesGrid().queryByText(/serv/i)).not.toBeInTheDocument()
      await user.click(button('Edit bibimbap'))
      expect(servingsValue()).toBe('2')
    })
  })

  describe('tags', () => {
    function tagButton(name) {
      return within(screen.getByRole('group', { name: 'Tags' })).getByRole('button', { name })
    }

    function rowTags(name) {
      return [...button(`Edit ${name}`).querySelectorAll('.bg-butter')].map((pill) => pill.textContent)
    }

    it('offers only the four tags, saves picks in a fixed order and shows them on the row', async () => {
      const user = userEvent.setup()
      await openRecipes(user)

      await user.click(button('Edit lasagna'))
      const options = within(screen.getByRole('group', { name: 'Tags' })).getAllByRole('button')
      expect(options.map((option) => option.textContent)).toEqual(['easy', 'lunch', 'dinner', '2+'])
      expect(options.every((option) => option.getAttribute('aria-pressed') === 'false')).toBe(true)

      await user.click(tagButton('2+'))
      await user.click(tagButton('easy'))
      expect(tagButton('easy')).toHaveAttribute('aria-pressed', 'true')
      await user.click(button('Save'))

      expect(rowTags('lasagna')).toEqual(['easy', '2+'])
      expect(rowTags('caldo verde')).toEqual([])
    })

    it('turns on 2+ when servings go above 1, and saves it even if untoggled', async () => {
      const user = userEvent.setup()
      await openRecipes(user)

      await user.click(button('Edit lasagna'))
      await user.click(button('More servings'))
      expect(tagButton('2+')).toHaveAttribute('aria-pressed', 'true')

      await user.click(tagButton('2+'))
      await user.click(button('Save'))
      expect(rowTags('lasagna')).toEqual(['2+'])
    })

    it('adds 2+ to recipes saved earlier with more than 1 serving', async () => {
      savePlan({
        weekKey: '2026-11-09',
        slots: SAMPLE_SLOTS,
        recipes: STARTER_RECIPES,
        ingredients: {},
        servings: { Lasagna: 4, 'caldo verde': 1 },
        tags: { lasagna: ['dinner'] },
      })
      const user = userEvent.setup()
      await openRecipes(user)

      expect(rowTags('lasagna')).toEqual(['dinner', '2+'])
      expect(rowTags('caldo verde')).toEqual([])
    })

    it('leaves 2+ off a 1-serving recipe unless picked', async () => {
      const user = userEvent.setup()
      await openRecipes(user)

      await user.click(button('Edit lasagna'))
      await user.click(button('More servings'))
      await user.click(button('Fewer servings'))
      await user.click(tagButton('2+'))
      await user.click(button('Save'))
      expect(rowTags('lasagna')).toEqual([])
    })

    it('drops tag changes when the recipe closes without saving, and can untag', async () => {
      const user = userEvent.setup()
      await openRecipes(user)

      await user.click(button('Edit lasagna'))
      await user.click(tagButton('lunch'))
      await user.click(button('Close'))
      expect(rowTags('lasagna')).toEqual([])

      await user.click(button('Edit lasagna'))
      await user.click(tagButton('lunch'))
      await user.click(button('Save'))
      await user.click(button('Edit lasagna'))
      await user.click(tagButton('lunch'))
      await user.click(button('Save'))
      expect(rowTags('lasagna')).toEqual([])
    })

    it('keeps tags after a reload', async () => {
      const user = userEvent.setup()
      const view = render(<App />)
      await user.click(menuButton('Recipes'))
      await createRecipe(user, 'bibimbap')
      await user.click(button('Edit bibimbap'))
      await user.click(tagButton('dinner'))
      await user.click(button('Save'))

      view.unmount()
      render(<App />)
      expect(rowTags('bibimbap')).toEqual(['dinner'])
    })
  })

  describe('filtering by tag', () => {
    function filterButton(name) {
      return within(screen.getByRole('group', { name: 'Filter by tag' })).getByRole('button', { name })
    }

    async function tagRecipe(user, name, tags) {
      await user.click(button(`Edit ${name}`))
      const group = within(screen.getByRole('group', { name: 'Tags' }))
      for (const tag of tags) await user.click(group.getByRole('button', { name: tag }))
      await user.click(button('Save'))
    }

    it('shows only recipes with every picked tag, and all recipes when none are picked', async () => {
      const user = userEvent.setup()
      await openRecipes(user)
      await tagRecipe(user, 'lasagna', ['easy', 'dinner'])
      await tagRecipe(user, 'caldo verde', ['dinner'])

      await user.click(filterButton('dinner'))
      expect(filterButton('dinner')).toHaveAttribute('aria-pressed', 'true')
      expect(cardNames()).toEqual(['Edit lasagna', 'Edit caldo verde'])

      await user.click(filterButton('easy'))
      expect(cardNames()).toEqual(['Edit lasagna'])

      await user.click(filterButton('easy'))
      await user.click(filterButton('dinner'))
      expect(cardNames()).toHaveLength(STARTER_RECIPES.length)
    })

    it('says so when no recipe has the picked tags', async () => {
      const user = userEvent.setup()
      await openRecipes(user)

      await user.click(filterButton('2+'))

      expect(recipesGrid().queryAllByRole('button')).toEqual([])
      expect(screen.getByText('No recipes with this tag')).toBeInTheDocument()
    })
  })

  describe('deleting', () => {
    it('deletes the open recipe right away, and Undo brings it back in place with its details', async () => {
      const user = userEvent.setup()
      await openRecipes(user)
      await user.click(button('Edit lasagna'))
      await user.type(ingredientsBox(), 'ricotta')
      await user.click(button('Save'))
      const before = cardNames()

      await user.click(button('Edit lasagna'))
      await user.click(button('Delete'))

      expect(cardNames()).not.toContain('Edit lasagna')
      expect(screen.getByRole('status')).toHaveTextContent('Recipe deleted')

      await user.click(within(screen.getByRole('status')).getByRole('button', { name: 'Undo' }))
      expect(cardNames()).toEqual(before)
      expect(button('Edit lasagna')).toHaveTextContent('ricotta')
    })

    it('has no Delete on a recipe that is still being created', async () => {
      const user = userEvent.setup()
      await openRecipes(user)

      await user.click(button('New Recipe'))

      expect(screen.queryByRole('button', { name: 'Delete' })).not.toBeInTheDocument()
    })

    it('keeps the dish in planned slots, and the recipe is gone from slot search', async () => {
      const user = userEvent.setup()
      await openRecipes(user)
      await user.click(button('Edit lasagna'))
      await user.click(button('Delete'))

      await user.click(menuButton('Weekly schedule'))
      await user.click(button('Edit Monday lunch: lasagna'))
      const search = screen.getByRole('textbox', { name: 'Search or add recipe' })
      await user.clear(search)
      await user.type(search, 'Las')

      expect(screen.queryByRole('list', { name: 'Matching recipes' })).not.toBeInTheDocument()
    })
  })

  describe('adding a tag', () => {
    function filterGroup() {
      return within(screen.getByRole('group', { name: 'Filter by tag' }))
    }

    async function addTag(user, text) {
      await user.click(button('Add a tag'))
      await user.type(screen.getByRole('textbox', { name: 'New tag name' }), text)
    }

    it('adds a lowercase tag to the filter and the editor, kept after a reload', async () => {
      const user = userEvent.setup()
      const view = render(<App />)
      await user.click(menuButton('Recipes'))

      await addTag(user, 'Vegan{Enter}')

      const names = () => filterGroup().getAllByRole('button').map((pill) => pill.textContent)
      expect(names()).toEqual(['easy', 'lunch', 'dinner', '2+', 'vegan', '+'])

      await user.click(button('Edit lasagna'))
      const tags = within(screen.getByRole('group', { name: 'Tags' }))
      await user.click(tags.getByRole('button', { name: 'vegan' }))
      await user.click(button('Save'))

      view.unmount()
      render(<App />)
      await user.click(filterGroup().getByRole('button', { name: 'vegan' }))
      expect(cardNames()).toEqual(['Edit lasagna'])
    })

    it('ignores blank names and tags that already exist, and Escape cancels', async () => {
      const user = userEvent.setup()
      await openRecipes(user)
      const count = () => filterGroup().getAllByRole('button').length

      await addTag(user, 'EASY{Enter}')
      expect(count()).toBe(5)

      await addTag(user, '   {Enter}')
      expect(count()).toBe(5)

      await addTag(user, 'spicy{Escape}')
      expect(count()).toBe(5)
      expect(button('Add a tag')).toBeInTheDocument()
    })
  })
})
