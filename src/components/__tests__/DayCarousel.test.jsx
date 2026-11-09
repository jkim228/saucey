import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { App } from '../../App'
import { SAMPLE_SLOTS, seedSampleWeek, setToday } from './testPlan'

const SAMPLE_DAYS = [
  { name: 'Monday', day: 'MON', date: 'Nov 9' },
  { name: 'Tuesday', day: 'TUE', date: 'Nov 10' },
  { name: 'Wednesday', day: 'WED', date: 'Nov 11' },
  { name: 'Thursday', day: 'THU', date: 'Nov 12' },
  { name: 'Friday', day: 'FRI', date: 'Nov 13' },
]

function expectActiveDay(name) {
  expect(screen.getByRole('button', { name: `Show ${name}` })).toHaveAttribute(
    'aria-current',
    'true',
  )
}

function expectDate(name, date) {
  expect(within(screen.getByRole('article', { name })).getByText(date)).toBeInTheDocument()
}

describe('DayCarousel', () => {
  describe('with a saved week', () => {
    beforeEach(seedSampleWeek)

    it('shows every weekday with its date, lunch and dinner', () => {
      render(<App />)

      SAMPLE_DAYS.forEach(({ name, day, date }) => {
        const card = within(screen.getByRole('article', { name }))
        expect(card.getByText(day)).toBeInTheDocument()
        expect(card.getByText(date)).toBeInTheDocument()
        expect(card.getByText('Lunch')).toBeInTheDocument()
        expect(card.getByText('Dinner')).toBeInTheDocument()
        expect(card.getAllByText(SAMPLE_SLOTS[day].lunch.recipe).length).toBeGreaterThan(0)
        expect(card.getAllByText(SAMPLE_SLOTS[day].dinner.recipe).length).toBeGreaterThan(0)
      })
    })

    it('shows how many of the 10 meals are planned, counting recipes and Planned slots', async () => {
      const user = userEvent.setup()
      render(<App />)
      expect(screen.getByText('10/10 meals planned')).toBeInTheDocument()

      await user.click(screen.getByRole('button', { name: 'Edit Monday lunch: lasagna' }))
      await user.click(screen.getByRole('button', { name: 'Remove' }))
      expect(screen.getByText('9/10 meals planned')).toBeInTheDocument()

      await user.click(screen.getByRole('button', { name: 'Add to Monday lunch' }))
      await user.click(screen.getByRole('button', { name: 'Planned' }))
      expect(screen.getByText('10/10 meals planned')).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: 'Next day' })).not.toBeInTheDocument()
    })

    it('brings a day fully into view when one of its slots is opened', async () => {
      const user = userEvent.setup()
      render(<App />)

      await user.click(screen.getByRole('button', { name: 'Edit Tuesday lunch: kimchi jjigae' }))

      expectActiveDay('Tuesday')
    })

    it('brings a day into focus when its card is tapped', async () => {
      const user = userEvent.setup()
      render(<App />)

      await user.click(screen.getByRole('article', { name: 'Tuesday' }))

      expectActiveDay('Tuesday')
    })

    it('shows the whole week when the meals planned pill is tapped', async () => {
      const user = userEvent.setup()
      render(<App />)

      await user.click(screen.getByRole('button', { name: '10/10 meals planned' }))

      const week = screen.getByRole('group', { name: 'Week at a glance' })
      SAMPLE_DAYS.forEach(({ name, day, date }) => {
        const column = within(within(week).getByRole('group', { name: `${name} at a glance` }))
        expect(column.getByText(day)).toBeInTheDocument()
        expect(column.getByText(date)).toBeInTheDocument()
        expect(column.getAllByText(SAMPLE_SLOTS[day].lunch.recipe).length).toBeGreaterThan(0)
        expect(column.getAllByText(SAMPLE_SLOTS[day].dinner.recipe).length).toBeGreaterThan(0)
        expect(column.queryByText('Lunch')).not.toBeInTheDocument()
      })
      expect(screen.queryByRole('article', { name: 'Monday' })).not.toBeInTheDocument()

      await user.click(screen.getByRole('button', { name: '10/10 meals planned' }))
      expect(screen.queryByRole('group', { name: 'Week at a glance' })).not.toBeInTheDocument()
      expect(screen.getByRole('article', { name: 'Monday' })).toBeInTheDocument()
    })

    it('returns to a day with the meal open when a meal in the week view is tapped', async () => {
      const user = userEvent.setup()
      render(<App />)

      await user.click(screen.getByRole('button', { name: '10/10 meals planned' }))
      await user.click(screen.getByRole('button', { name: 'Edit Thursday dinner: caldo verde' }))

      expect(screen.queryByRole('group', { name: 'Week at a glance' })).not.toBeInTheDocument()
      expect(screen.getByRole('form', { name: 'Edit Thursday dinner' })).toBeInTheDocument()
      expectActiveDay('Thursday')
    })

    it('jumps to a day when its dot is tapped', async () => {
      const user = userEvent.setup()
      render(<App />)

      await user.click(screen.getByRole('button', { name: 'Show Wednesday' }))

      expectActiveDay('Wednesday')
    })
  })

  describe('dates and opening day', () => {
    it('opens on today and shows the current week on a weekday', () => {
      setToday('2026-11-11')
      render(<App />)

      expectActiveDay('Wednesday')
      expectDate('Monday', 'Nov 9')
      expectDate('Friday', 'Nov 13')
    })

    it.each(['2026-11-14', '2026-11-15'])(
      'opens on Monday of the upcoming week on the weekend of %s',
      (today) => {
        setToday(today)
        render(<App />)

        expectActiveDay('Monday')
        expectDate('Monday', 'Nov 16')
        expectDate('Friday', 'Nov 20')
      },
    )

    it('shows the right dates in a week that spans two months', () => {
      setToday('2026-12-01')
      render(<App />)

      expectDate('Monday', 'Nov 30')
      expectDate('Tuesday', 'Dec 1')
      expect(screen.getByText('Nov 30–Dec 4')).toBeInTheDocument()
    })

    it.each([
      ['a weekday', '2026-11-06', 'Nov 2–6'],
      ['a weekend', '2026-11-07', 'Nov 9–13'],
    ])('shows the week range at the top on %s', (_, today, range) => {
      setToday(today)
      render(<App />)

      expect(screen.getByText(range)).toBeInTheDocument()
    })

    it('shows a Saturday placeholder with no slots after Friday', async () => {
      setToday('2026-11-06')
      render(<App />)
      const saturday = within(screen.getByRole('article', { name: 'Saturday' }))

      expect(saturday.getByText('SAT')).toBeInTheDocument()
      expect(saturday.getByText('Nov 7')).toBeInTheDocument()
      expect(saturday.getByText("it's the freakin")).toBeInTheDocument()
      expect(saturday.getByText('weekend!')).toBeInTheDocument()
      expect(saturday.queryByRole('button')).not.toBeInTheDocument()

      expectActiveDay('Friday')
      expect(screen.queryByRole('button', { name: 'Show Saturday' })).not.toBeInTheDocument()
    })

    it('keeps earlier days in the week viewable and editable', async () => {
      setToday('2026-11-11')
      const user = userEvent.setup()
      render(<App />)

      await user.click(screen.getByRole('button', { name: 'Add to Monday lunch' }))

      expect(screen.getByRole('form', { name: 'Edit Monday lunch' })).toBeInTheDocument()
    })
  })
})
