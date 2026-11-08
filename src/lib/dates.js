const SATURDAY = 6
const SUNDAY = 0

function padTwo(value) {
  return String(value).padStart(2, '0')
}

function isWeekend(date) {
  return date.getDay() === SATURDAY || date.getDay() === SUNDAY
}

/** Returns the Monday of the week on screen as YYYY-MM-DD; weekends use the upcoming week. */
export function getWeekKey(now) {
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const daysFromMonday = (now.getDay() + 6) % 7
  monday.setDate(monday.getDate() + (isWeekend(now) ? 7 - daysFromMonday : -daysFromMonday))
  return `${monday.getFullYear()}-${padTwo(monday.getMonth() + 1)}-${padTwo(monday.getDate())}`
}

/** Returns today's position in Monday–Friday, or Monday on a weekend. */
export function getOpeningIndex(now) {
  return isWeekend(now) ? 0 : now.getDay() - 1
}

function getWeekDates(weekKey, dayCount) {
  const [year, month, day] = weekKey.split('-').map(Number)
  return Array.from({ length: dayCount }, (_, index) => new Date(year, month - 1, day + index))
}

function getMonthLabel(date) {
  return date.toLocaleDateString('en-US', { month: 'short' })
}

/** Returns a label such as "Nov 9" for each day of the week, starting from its Monday. */
export function getDateLabels(weekKey, dayCount) {
  return getWeekDates(weekKey, dayCount).map(
    (date) => `${getMonthLabel(date)} ${date.getDate()}`,
  )
}

/** Returns a label such as "Nov 2–6", or "Nov 30–Dec 4" when the week spans two months. */
export function getWeekRangeLabel(weekKey, dayCount) {
  const dates = getWeekDates(weekKey, dayCount)
  const first = dates[0]
  const last = dates[dates.length - 1]
  const lastMonth = last.getMonth() === first.getMonth() ? '' : `${getMonthLabel(last)} `
  return `${getMonthLabel(first)} ${first.getDate()}–${lastMonth}${last.getDate()}`
}
