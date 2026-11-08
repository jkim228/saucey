# Bottom Menu Bar

## User Story

As someone planning my week, I want a menu bar at the bottom of the screen, so I can move between my grocery list, weekly schedule and recipes with one tap.

## Requirements

### Layout

- [x] A menu bar stays fixed at the bottom of the screen, always visible while the page scrolls
- [x] It shows three icons: a calendar on the left, a grocery list in the middle and a recipe book on the right
- [x] Icons have no visible text labels, but screen readers announce each one as "Grocery list", "Weekly schedule" or "Recipes"
  - The list icon is now announced as "Groceries", as described in Groceries
- [x] The selected icon is amber, and the other two are muted
- [x] The menu bar never covers the end of the page content, including the day dots and an open editing panel
+ The icons are the line-style list, calendar and chef's-hat recipe book icons you provided
+ On phones with a home indicator, the menu bar extends beneath it so the icons stay clear of it

### Switching tabs

- [x] Tapping an icon switches to its screen and makes that icon the selected one
- [x] Tapping the selected icon does nothing
- [x] Switching away from the calendar while a meal slot panel is open closes the panel without saving
- [x] Coming back to the calendar shows the same day you were looking at before you left
- [x] Reloading or reopening the app opens the tab you used last
+ If the calendar opens after a reload, it still starts on today (or Monday on weekends), as the Weekly Schedule requires
+ The selected tab is saved on this device only, like the meal plan

### Placeholder screens

- [x] The calendar tab shows the weekly schedule as it works today
- [x] The Grocery list and Recipes tabs show placeholder screens for now
  - The Recipes tab's placeholder is replaced by recipe cards, as described in Add New Recipe, and only Grocery list stays a placeholder
  - The Grocery list placeholder is replaced by the Groceries list, so neither tab is a placeholder anymore
- [x] A placeholder screen keeps the mascot and Saucey title at the top, with the screen's name, such as "Grocery list", in place of the week range
  - Groceries shows only the mascot and title at the top, because its card has its own "Groceries" header
- [x] Below the name, a placeholder screen shows a short centered "Coming soon" message
+ The Grocery list screen will be built with the Ingredients feature, and Recipes with Add new recipe
  - The list is built as Groceries instead, and Ingredients is left for quick-add suggestions
