# Add New Recipe

## User Story

As someone planning my week, I want to keep a list of ingredients with each recipe, so that later my grocery list can suggest them whenever I plan that recipe.

## Requirements

Latest design: `docs/design/recipes_v2.png`

### Recipe list

- [x] The Recipes tab shows every recipe as a row in a single list card
- [x] Each row shows only the dish name, with its ingredients on one line underneath, separated by dots
  - A recipe with more than 1 serving also shows its serving count beside the name
- [x] Ingredients too long for one line are cut off with an ellipsis
- [x] A row with no ingredients shows only the dish name
- [x] Rows are ordered newest first
- [x] The "Recipes" heading shows the number of dishes on its right, such as "8 Dishes"
  - The count is removed, and the New Recipe button takes its place on the right of the heading
- [ ] A recipe with more than 1 serving shows its count beside the dish name, such as "4 serv"
- [ ] A recipe with 1 serving shows no count
+ Follows the design's layout in the app's own colors and design system, without its per-row +, tags, cooking time, dish type or search bar
+ This replaces the two-column grid of small cards, which listed ingredients separated by commas
+ Starter recipes count as the oldest, and recipes created by assigning a new name to a slot count as new
+ This replaces the Recipes placeholder screen from the Bottom Menu Bar, keeping the mascot, title and "Recipes" heading at the top

### Editing ingredients

- [x] Tapping a row opens it for editing in place, with a text box listing one ingredient per line
- [x] Only one recipe can be open at a time, and opening another closes the current one without saving
- [x] Save keeps the changes and closes the recipe
- [x] An [x], tapping outside, pressing Escape or switching tabs closes the recipe without saving
- [x] On save, blank lines are dropped, extra spaces are trimmed, and repeats that differ only by capitalization are kept once
- [x] Ingredients are names only, with no amounts
- [x] Ingredients are saved on this device along with the recipes
  - Each recipe's serving count is saved too
- [ ] An open recipe shows a servings pill beside its name, such as "− 4 serv +"
- [ ] Every recipe starts at 1 serving, including recipes saved before servings existed
- [ ] Tapping + adds one serving, up to a maximum of 10
- [ ] Tapping − removes one serving, down to a minimum of 1
- [ ] Save keeps the servings change, and closing without saving discards it, the same as ingredients
+ The serving count only records how many servings the recipe makes, and it doesn't change the servings of any meal slot
+ The recipe name can't be changed, and recipes can't be deleted
  - Recipes can now be deleted, as described in Deleting a recipe

### Creating a recipe

- [x] A "New Recipe" button sits at the top right, on the same row as the Saucey title
  - It now sits on the right of the "Recipes" heading, where the dish count was
- [x] Tapping it opens a blank recipe at the top of the list, with a name field and an ingredients box
+ This replaces the dashed + card that sat first in the grid
- [ ] A new recipe shows the same servings pill beside its name field, starting at 1
- [x] Save is disabled until a name is entered
- [x] Saving creates the recipe, which appears first in the list
- [x] A new recipe is available in meal slot search right away
- [x] Entering the name of an existing recipe, even with different capitalization, opens that recipe for editing, and no new recipe is created
+ The match is checked when you tap Save, and any ingredients you typed are added below the recipe's saved ones, unsaved until you tap Save again

### Servings

- [x] An open recipe shows a servings counter at the right of the dish name, on the same row
- [x] A new recipe shows the counter at the right of its name field
- [x] The counter is the same − 1 + pill as the meal slot panel's, with no visible label, and screen readers announce it as "Servings"
- [x] Every recipe starts at 1 serving, and the count can go up but never below 1
+ This includes the starter recipes, recipes saved before this change, and recipes created by assigning a new name to a slot
- [x] A servings change is kept only when you tap Save, and closing with [x], Escape, tapping outside or switching tabs throws it away
- [x] The recipe list row doesn't show servings

### Tags

- [x] A recipe can have any of four tags: "easy", "lunch", "dinner" and "2+"
- [x] An open recipe shows all four tags as pills under its name, and tapping one turns it on or off
- [x] Tag changes are kept only when you tap Save, like ingredients and servings
- [x] The recipe list shows a recipe's tags as amber pills right after its name, always in the order easy, lunch, dinner, 2+
- [x] A recipe with no tags shows only its name
- [x] Tags are saved on this device along with the recipe
- [ ] A recipe with more than 1 serving is always saved with the "2+" tag, even if it was switched off
- [ ] Raising servings above 1 in an open recipe switches the 2+ pill on right away
- [ ] Recipes saved before this change with more than 1 serving get the 2+ tag the next time the app opens, keeping their other tags
+ Lowering servings back to 1 doesn't switch 2+ off, and a 1-serving recipe can still have 2+ if you pick it
+ You can't create your own tags yet
  - You can now add your own tags, as described in Adding a tag

### Filtering by tag

- [x] A row of the four tag pills sits between the "Recipes" heading and the recipe list
  - The row now shows only tags that at least one recipe has, in the usual tag order, and is hidden when no recipe has a tag
- [x] Tapping a tag turns it amber and shows only recipes with that tag, and tapping it again turns it off
- [x] With more than one tag on, only recipes that have every one of them show
- [x] With no tags on, every recipe shows
- [x] When no recipe matches, the list says "No recipes with this tag" (or "all these tags")
- [ ] A picked filter drops out when no recipe has its tag anymore
+ The filter resets when you leave the Recipes tab or reload
+ Tapping a filter tag while a recipe is open closes it without saving, like tapping anywhere else outside it

### Deleting a recipe

- [x] An open recipe shows a small "Delete" text button at the bottom of its card, under Save
- [x] A recipe that's still being created has no Delete
- [x] Tapping Delete removes the recipe right away, with no confirmation, and closes it
- [x] A message bar then shows "Recipe deleted · Undo" for about 5 seconds
- [x] Undo brings the recipe back in its old place, with its ingredients, servings and tags
- [x] A deleted recipe no longer appears in meal slot search or gives grocery suggestions
- [x] Meal slots that already have the deleted recipe keep showing its name
+ Assigning that name to a slot again creates a new, empty recipe

### Adding a tag

- [x] The tag filter row ends with a small + in a dashed circle
  - The + now sits at the end of an open recipe's tag pills, and the filter row has no +
- [x] Tapping it turns it into a small text field, and Enter adds the typed tag
- [x] A new tag appears after the built-in ones, in the filter row and in every recipe's tag pills
  - It appears in the filter row only once a recipe has it
- [x] New tags are saved lowercase on this device and kept across reloads
- [x] A blank name, or one that matches an existing tag, adds nothing
  - A name that matches an existing tag switches that tag on for the open recipe
- [x] Escape cancels, and tapping away adds whatever was typed
  - Escape cancels only the tag field, and the recipe stays open
- [ ] A tag added in an open recipe is switched on for that recipe, and kept when you tap Save
- [ ] Tapping the + doesn't close the open recipe
+ Tags can't be renamed or deleted yet
  - Replaced by the lines below, so typed ingredients are no longer added to the existing recipe
- [x] Saving a new recipe whose name matches an existing one doesn't create it
- [x] A message bar says the recipe already exists, such as "Risotto already exists"
- [x] The existing recipe then opens for editing exactly as saved, and the ingredients and servings typed for the new recipe are discarded

## Out of Scope

- The grocery list and its quick-add suggestions
  - The grocery list is now covered by Groceries, and quick-add suggestions are still out of scope
  - Quick-add suggestions are now covered by Suggested Ingredients in Groceries
+ When the grocery list is built, it will suggest ingredients only from recipes in slots from today onward
