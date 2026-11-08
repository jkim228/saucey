# Save Data

## User Story

As someone planning my week, I want my meal plan and recipes saved automatically on my device, so they're still there when I come back, and each new week starts fresh.

## Requirements

### Saving

- [x] The meal plan and recipes are saved automatically after every change, with no save button
- [x] Saved data is still there after reloading or reopening the app
- [x] Data is saved on this device only, with no accounts or sign-in
  - The last tab used in the bottom menu bar is also saved on this device
  - The grocery list is also saved on this device
- [x] Each slot's recipe, servings count and Planned state are saved
- [x] Recipes created by assigning a new name are saved
  - Recipes created on the Recipes tab, and every recipe's ingredients, are saved too
  - Each recipe's servings count is saved too
  - Every recipe's serving count is saved too
- [x] Unsaved edits in an open panel aren't saved
+ Your phone and computer each keep a separate plan
+ Clearing browser data erases the saved plan and recipes
+ With two tabs open, the most recent save wins

### Lowercase

- [x] Recipe names, ingredients and grocery items are always saved in lowercase, however they're typed
- [x] Recipes, ingredients, meal slots and grocery items saved before this change turn lowercase the next time the app opens
- [x] If two saved names become the same once lowercased, only the first is kept
+ The starter recipes are now "lasagna", "kimchi jjigae" and "caldo verde"

### When saving fails

- [x] If changes can't be saved, a brief warning says they won't be kept after a reload
- [x] The app keeps working after a failed save
- [x] If saved data is damaged, the app starts with an empty week and the starter recipes
+ The warning stays on screen until a save succeeds, so it doesn't reappear with every change

### First use

- [x] A first-time user sees an empty week, with every slot showing the dashed + state
- [x] Lasagna, Kimchi jjigae and Caldo verde are available in search as starter recipes

### Clearing for a new week

- [x] When the dates move to a new week, all slots clear automatically
- [x] The plan clears without a message
- [x] A cleared plan can't be recovered
- [x] Recipes aren't affected when the plan clears
  - The grocery list isn't affected either, and it stays until you clear it
- [x] If the app is open when the week changes, the dates and slots update the next time you return to it
- [x] If a panel is open when the update happens, it closes and its unsaved edits are lost
+ The week changes at midnight on Friday night, in the device's time zone
+ Clearing also erases servings counts, so the Extras section will need to decide what happens to leftovers at the end of a week

## Out of Scope

- Syncing between devices
- Viewing past or future weeks
- Deleting recipes
  - Recipes can now be deleted, as described in Add New Recipe
