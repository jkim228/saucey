import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { App } from '../../App'
import { seedSampleWeek } from './testPlan'

function getMenu() {
  return within(screen.getByRole('navigation', { name: 'Main' }))
}

function expectSelectedTab(name) {
  expect(getMenu().getByRole('button', { name })).toHaveAttribute('aria-current', 'page')
}

describe('BottomMenuBar', () => {
  beforeEach(seedSampleWeek)

  it('shows weekly schedule, groceries and recipes in order, opening on the schedule', () => {
    render(<App />)

    const names = getMenu()
      .getAllByRole('button')
      .map((button) => button.getAttribute('aria-label'))
    expect(names).toEqual(['Weekly schedule', 'Groceries', 'Recipes'])
    expectSelectedTab('Weekly schedule')
    expect(screen.getByText('Nov 9–13')).toBeInTheDocument()
  })

  it('switches to the Groceries screen, hiding the schedule', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(getMenu().getByRole('button', { name: 'Groceries' }))

    expectSelectedTab('Groceries')
    expect(screen.getByRole('heading', { name: 'Groceries' })).toBeInTheDocument()
    expect(screen.getByText('Saucey')).toBeInTheDocument()
    expect(screen.queryByText('Nov 9–13')).not.toBeInTheDocument()
    expect(screen.queryByRole('article', { name: 'Monday' })).not.toBeInTheDocument()
  })

  it('closes an open panel without saving when switching tabs', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Edit Monday lunch: lasagna' }))
    await user.clear(screen.getByRole('textbox', { name: 'Search or add recipe' }))
    await user.type(screen.getByRole('textbox', { name: 'Search or add recipe' }), 'caldo verde')
    await user.click(getMenu().getByRole('button', { name: 'Recipes' }))
    await user.click(getMenu().getByRole('button', { name: 'Weekly schedule' }))

    expect(screen.queryByRole('form', { name: 'Edit Monday lunch' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Edit Monday lunch: lasagna' })).toBeInTheDocument()
  })

  it('returns to the same day after visiting another tab', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Show Wednesday' }))
    await user.click(getMenu().getByRole('button', { name: 'Groceries' }))
    await user.click(getMenu().getByRole('button', { name: 'Weekly schedule' }))

    expect(screen.getByRole('button', { name: 'Show Wednesday' })).toHaveAttribute(
      'aria-current',
      'true',
    )
  })

  it('reopens on the last tab used', async () => {
    const user = userEvent.setup()
    const { unmount } = render(<App />)

    await user.click(getMenu().getByRole('button', { name: 'Recipes' }))
    unmount()
    render(<App />)

    expectSelectedTab('Recipes')
    expect(screen.getByRole('button', { name: 'Edit lasagna' })).toBeInTheDocument()
  })
})
