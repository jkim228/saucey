# Recipe Slot

## User Story

As someone planning my week, I want to edit a meal slot right on its day card, so I can assign, swap or remove a recipe, or mark the meal as planned, without leaving the schedule.

## Requirements

### Opening and closing the panel

- [x] Tapping any meal slot opens an inline editing panel inside that slot
- [x] Only one panel can be open at a time
- [x] The panel has an [x] in its top-right corner that closes it without saving
- [x] Tapping another slot closes the current panel without saving and opens the new one
- [x] Tapping outside the panel closes it without saving
  - Switching to another tab in the bottom menu bar also closes the panel without saving
- [x] Unsaved edits are discarded with no prompt
+ The [x] replaces the Cancel button from the design
+ Pressing Escape also closes the panel without saving

### Panel layout

- [x] The panel shows an "Add a dish" label at the top
- [x] The search bar and servings counter sit on one row at the same height
  - The servings counter is removed from the panel, so the search bar fills the row
- [x] The servings counter has no visible label, but screen readers announce it as "Servings"
- [x] A row of actions sits below the search row, with Assign where Cancel was in the design
- [x] On an empty slot, the action row shows Planned and Assign
- [x] On a slot with a recipe or the Planned state, the action row shows Remove, Planned and Assign
- [x] Only the card with the open panel grows, and the neighboring day card keeps its height
+ The action label is "Planned", replacing "Planned / Eating out"
+ The servings − and + buttons are narrower than the 44px minimum tap target in design.md, a deliberate choice so they fit beside the search bar
+ The search placeholder is shortened to "Search…" to fit, and screen readers still announce "Search or add recipe"
+ Remove, Planned and Assign stay on one row

### Searching and assigning

- [x] Typing in the search bar shows matching recipes in a list floating under it
- [x] The floating list doesn't change the height of the panel or card
- [x] Choosing a result puts that recipe in the search bar
- [x] Assign fills the slot with the recipe and closes the panel
- [x] Assign is disabled until the search bar contains a recipe name
- [x] Assigning a name that doesn't match a recipe creates a new recipe with that name
- [x] A newly created recipe appears in later searches
  - Recipes created on the Recipes tab also appear in search
- [x] Names that differ only by capitalization count as the same recipe
+ Richer recipe details are left for the Add new recipe feature
+ Assign uses the darker amber from design.md, because the design's lighter amber doesn't meet the required contrast with white text

### Servings

- The panel no longer shows a servings counter. Slots still keep a count behind the scenes: an empty slot takes the chosen recipe's servings, and a filled slot keeps its count

- [x] The servings counter starts at 1 and can't go below 1
  - Choosing a recipe from search on an empty slot starts the counter at that recipe's servings, as described in Add New Recipe
- [x] The servings count is saved with the slot's assignment
- [x] A count above 1 doesn't create leftovers or fill other slots
- [x] A slot that already has a recipe or a servings count keeps its count when you pick a different recipe
- [x] Changing a recipe's servings later doesn't change slots that already have it assigned
+ The Extras section will use the saved count later
+ The count shows only in the panel, not on the recipe card

### Swapping and removing

- [x] A slot with a recipe opens with its recipe and servings already filled in
- [x] Assigning a different recipe replaces the current one
- [x] Remove immediately empties the slot and closes the panel, with no confirmation or Undo
- [x] A removed recipe stays available in search
- [x] An empty slot shows a dashed border with a centered +

### Planned state

- [x] One tap on Planned sets the slot to Planned and closes the panel
- [x] Planned replaces any recipe already in the slot, with no confirmation
- [x] A Planned slot shows a neutral putty card with the text "Planned"
  - The card now reads "planned!" in lowercase, on a dusty lavender background
- [x] Tapping a Planned slot reopens the panel to assign a recipe or remove the Planned state
- [x] Removing the Planned state returns the slot to empty

## Out of Scope

- Trading recipes between two slots
