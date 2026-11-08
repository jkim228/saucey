# Weekly Schedule

## User Story

As someone planning my week, I want each day card to have more room while still seeing that another day follows, so meals are easy to read and edit and I know I can keep moving through the week.

## Requirements

### Day card layout

- [x] Lunch and Dinner sit straight in the day card, each with its label above its slot, with no inner container around them
- [x] The day name shows in a bold serif, and the date in an italic serif, such as "Nov 10"
  - The date now uses the same font, size and color as the day name, not italic
- [x] A slot with a recipe shows a warm peach card with the dish name in a bold serif
- [x] Day cards are wider, so one full day card and about half of the next day show at once
- [x] The next day's card is cut off at the edge of the screen
- [x] Moving through the week keeps this layout, with the current day fully visible and half of the following day showing
- [x] Tapping a slot on the partly visible card brings that day fully into view, so its editing panel is on screen
- [x] A placeholder Saturday card shows beside Friday, the same width as the other day cards and cut off at the edge of the screen, with no slots
- [x] The Saturday card shows "it's the freakin weekend!" in italics, with "weekend!" on its own line, inside a container matching the Lunch and Dinner ones
  - Lunch and Dinner no longer have their own containers, so the text sits straight in the Saturday card
- [x] The screen edge cuts the text so it reads "it's the frea" and "weeken"
+ The screen edge also hides the Saturday date, because the card can't be swiped into full view
- [x] The Saturday card can't be tapped or edited, and has no page dot
- [x] The Saturday card always matches Friday's height, growing when a Friday panel opens
- [x] Friday is the last stop, so the Saturday card can't move to the left position
+ This replaces the two full cards side by side described in design.md
- [x] A pill at the right of the "Weekly Schedule" label shows how many of the week's 10 meals are planned, such as "3/10 meals planned"
- [x] A slot counts as planned when it has a recipe or is marked Planned, and the count updates right away
+ The pill replaces the previous and next day arrows, so days are reached by swiping or tapping the page dots

### Dates

- [x] Day cards show the real dates of the current Monday–Friday week
- [x] On Saturday and Sunday, day cards show the upcoming Monday–Friday week
- [x] The week's date range shows at the top of the screen, such as "Nov 2–6"
- [x] A week spanning two months shows both months, such as "Nov 30–Dec 4"

### Opening day

- [x] On a weekday, the app opens with today's card on the left
- [x] On Saturday and Sunday, the app opens on Monday of the upcoming week
- [x] Earlier days in the week can still be viewed and edited
  - Returning from another tab in the bottom menu bar shows the same day as before, but a reload opens on today again
+ You can only plan the week on screen, because the dates don't move to the next week until Saturday
