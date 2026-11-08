import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { App } from '../../App'
import { seedSampleWeek } from './testPlan'

function button(name) {
  return screen.getByRole('button', { name })
}

function menuButton(name) {
  return within(screen.getByRole('navigation', { name: 'Main' })).getByRole('button', { name })
}

function addBox() {
  return screen.getByRole('textbox', { name: 'Items to add' })
}

/** Item names in the order shown, each marked when checked. */
function listedItems() {
  return screen
    .queryAllByRole('checkbox')
    .map((box) => `${box.closest('label').textContent}${box.checked ? ' ✓' : ''}`)
}

function status() {
  return screen.getByRole('status')
}

async function openGroceries(user) {
  const view = render(<App />)
  await user.click(menuButton('Groceries'))
  return view
}

/** Drags an item's row left by `distance` pixels with a finger, then lifts it. */
async function swipeLeft(user, name, distance) {
  const row = screen.getByRole('checkbox', { name }).closest('label')
  await user.pointer([
    { keys: '[TouchA>]', target: row, coords: { clientX: 300, clientY: 20 } },
    { pointerName: 'TouchA', target: row, coords: { clientX: 300 - distance / 2, clientY: 20 } },
    { pointerName: 'TouchA', target: row, coords: { clientX: 300 - distance, clientY: 20 } },
    { keys: '[/TouchA]', target: row },
  ])
}

async function addItems(user, text) {
  await user.click(button('Add items'))
  await user.type(addBox(), text)
  await user.click(button('Add'))
}

describe('Groceries', () => {
  beforeEach(seedSampleWeek)

  describe('empty list', () => {
    it('shows only the card header and the + Add trigger, with no message or Clear all', async () => {
      const user = userEvent.setup()
      await openGroceries(user)

      expect(screen.getByRole('heading', { name: 'Groceries' })).toBeInTheDocument()
      expect(screen.queryByText('Nothing on your list yet')).not.toBeInTheDocument()
      expect(button('Add items')).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: 'Clear all' })).not.toBeInTheDocument()
    })
  })

  describe('adding items', () => {
    it('opens a focused box with the right placeholder and disables Add while blank', async () => {
      const user = userEvent.setup()
      await openGroceries(user)

      await user.click(button('Add items'))

      expect(addBox()).toHaveFocus()
      expect(addBox()).toHaveAttribute('placeholder', 'One item per line')
      expect(button('Add')).toBeDisabled()
      await user.type(addBox(), '   ')
      expect(button('Add')).toBeDisabled()
    })

    it('adds one item per line, cleaning up spaces, blanks, markers and repeats', async () => {
      const user = userEvent.setup()
      await openGroceries(user)

      await addItems(user, '  - chicken \n\n• tomatoes, canned\n* rice\n2. rice\n1.5 lb beef')

      expect(listedItems()).toEqual(['chicken', 'tomatoes, canned', 'rice', '1.5 lb beef'])
      expect(status()).toHaveTextContent('Added 4 items')
      expect(screen.queryByRole('form', { name: 'Add items' })).not.toBeInTheDocument()
      expect(button('Add items')).toBeInTheDocument()
    })

    it('starts a new line on Enter and submits with Cmd/Ctrl + Enter', async () => {
      const user = userEvent.setup()
      await openGroceries(user)

      await user.click(button('Add items'))
      await user.type(addBox(), 'milk{Enter}eggs')
      expect(addBox()).toHaveValue('milk\neggs')
      await user.keyboard('{Meta>}{Enter}{/Meta}')

      expect(listedItems()).toEqual(['milk', 'eggs'])
    })

    it('skips items already on the list and says so', async () => {
      const user = userEvent.setup()
      await openGroceries(user)

      await addItems(user, 'milk')
      await addItems(user, 'MILK\neggs\nbread')
      expect(listedItems()).toEqual(['milk', 'eggs', 'bread'])
      expect(status()).toHaveTextContent('Added 2 · 1 already on list')

      await addItems(user, 'eggs')
      expect(status()).toHaveTextContent('Already on your list')
    })

    it('adds new items below unchecked items but above checked ones', async () => {
      const user = userEvent.setup()
      await openGroceries(user)

      await addItems(user, 'milk\neggs')
      await user.click(screen.getByRole('checkbox', { name: 'milk' }))
      await addItems(user, 'bread')

      expect(listedItems()).toEqual(['eggs', 'bread', 'milk ✓'])
    })
  })

  describe('closing the add box', () => {
    it('cancels with Escape, even with text', async () => {
      const user = userEvent.setup()
      await openGroceries(user)

      await user.click(button('Add items'))
      await user.type(addBox(), 'milk')
      await user.keyboard('{Escape}')

      expect(screen.queryByRole('form', { name: 'Add items' })).not.toBeInTheDocument()
      expect(listedItems()).toEqual([])
    })

    it('closes on an outside tap only while empty', async () => {
      const user = userEvent.setup()
      await openGroceries(user)

      await user.click(button('Add items'))
      await user.type(addBox(), 'milk')
      await user.click(screen.getByText('Saucey'))
      expect(addBox()).toHaveValue('milk')

      await user.clear(addBox())
      await user.click(screen.getByText('Saucey'))
      expect(screen.queryByRole('form', { name: 'Add items' })).not.toBeInTheDocument()
    })

    it('keeps the box and its text when switching tabs and coming back', async () => {
      const user = userEvent.setup()
      await openGroceries(user)

      await user.click(button('Add items'))
      await user.type(addBox(), 'milk')
      await user.click(menuButton('Recipes'))
      await user.click(menuButton('Groceries'))

      expect(addBox()).toHaveValue('milk')
    })
  })

  describe('my list', () => {
    it('moves a checked item to the bottom, and returns it to its old spot when unchecked', async () => {
      const user = userEvent.setup()
      await openGroceries(user)

      await addItems(user, 'milk\neggs\nbread')
      await user.click(screen.getByRole('checkbox', { name: 'milk' }))
      expect(listedItems()).toEqual(['eggs', 'bread', 'milk ✓'])

      await user.click(screen.getByRole('checkbox', { name: 'eggs' }))
      expect(listedItems()).toEqual(['bread', 'milk ✓', 'eggs ✓'])

      await user.click(screen.getByRole('checkbox', { name: 'milk' }))
      expect(listedItems()).toEqual(['milk', 'bread', 'eggs ✓'])
    })

    it('has no remove button on item rows', async () => {
      const user = userEvent.setup()
      await openGroceries(user)

      await addItems(user, 'milk')

      expect(screen.queryByRole('button', { name: /remove/i })).not.toBeInTheDocument()
    })

    it('deletes an item swiped far enough left, without checking it off', async () => {
      const user = userEvent.setup()
      await openGroceries(user)

      await addItems(user, 'milk\neggs')
      await swipeLeft(user, 'milk', 200)

      await waitFor(() => expect(listedItems()).toEqual(['eggs']))
    })

    it('keeps an item after a short swipe, without checking it off', async () => {
      const user = userEvent.setup()
      await openGroceries(user)

      await addItems(user, 'milk')
      await swipeLeft(user, 'milk', 40)

      expect(listedItems()).toEqual(['milk'])
    })

    it('deletes the focused item with the Delete key', async () => {
      const user = userEvent.setup()
      await openGroceries(user)

      await addItems(user, 'milk\neggs')
      screen.getByRole('checkbox', { name: 'milk' }).focus()
      await user.keyboard('{Delete}')

      expect(listedItems()).toEqual(['eggs'])
    })

    it('clears every item and brings them back with Undo', async () => {
      const user = userEvent.setup()
      await openGroceries(user)

      await addItems(user, 'milk\neggs\nbread')
      await user.click(screen.getByRole('checkbox', { name: 'milk' }))
      await user.click(button('Clear all'))

      expect(listedItems()).toEqual([])
      expect(status()).toHaveTextContent('List cleared')

      await user.click(within(status()).getByRole('button', { name: 'Undo' }))
      expect(listedItems()).toEqual(['eggs', 'bread', 'milk ✓'])
    })

    it('keeps the list and checked items after a reload', async () => {
      const user = userEvent.setup()
      const view = await openGroceries(user)

      await addItems(user, 'milk\neggs')
      await user.click(screen.getByRole('checkbox', { name: 'milk' }))
      view.unmount()
      render(<App />)

      expect(listedItems()).toEqual(['eggs', 'milk ✓'])
    })
  })

  it('saves items typed with capitals in lowercase', async () => {
    const user = userEvent.setup()
    await openGroceries(user)

    await addItems(user, 'San Marzano Tomatoes\nMILK')

    expect(listedItems()).toEqual(['san marzano tomatoes', 'milk'])
  })
})
