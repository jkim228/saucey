# Groceries

Latest design: `docs/design/groceries_v1.png`

## User Story

As someone planning my week, I want a simple grocery list I can add to quickly and check off while shopping, so I know what's left to buy.

## Requirements

### Groceries Tab (v1)

- [x] The top of the tab shows only the mascot and Saucey title, with no big heading under them
- [x] The list sits in a white card with "Groceries" as its header
- [x] "Clear all" sits at the right of the card header, in small italic text
  - "Clear all" now sits at the bottom right of the card, under the last item, so the header can show the counts
  - "Clear all" is back at the right of the card header, in line with "Groceries", and the counts are removed
- [x] The list updates live, with no page refresh, when items are added, checked off or removed
- [x] The list is saved on this device and kept across reloads and weeks until you clear it
+ The page follows the app's own style (Inter font, white card), not the serif font in the design, and uses square checkboxes instead of the design's round ones
  - The app now uses a serif font for headings and dish names, so the "Groceries" header and suggested dish names are serif
  - The card now follows the design more closely: item names are serif, checkboxes are round, and the card is a warm off-white
+ The bottom menu bar's list icon is renamed from "Grocery list" to "Groceries"
+ No count of items still to buy is shown
  - The header now shows "4 items to buy" next to the title and "1 of 5 gathered" on the right, hidden while the list is empty
  - The counts are removed again, so no count is shown

### My List

- [x] Lists every item you've added
- [x] Each item row shows a square checkbox and the item name, with no remove (×) control
  - The checkbox is now round
- [x] Checking an item strikes it through and moves it to the bottom of the list
- [x] Unchecking an item returns it to its old spot among the unchecked items
- [x] Swiping an item left reveals a red Delete area, and letting go far enough deletes it immediately, with no confirmation or Undo
- [x] A short swipe snaps the item back, and a swipe never checks the item off
- [x] Scrolling up and down over the list still scrolls the page
+ On a computer, dragging a row left with the mouse works the same way, and pressing Delete or Backspace removes the focused item
+ This replaces the × remove control
- [x] Shows a "+ Add" trigger below the last item, at the bottom of the list
  - The "+ Add" trigger now sits at the top of the list, just under the card header, above the first item
  - It now reads "Quick add items or ingredients…" in italic serif
- [x] The "+ Add" trigger stays visible when the list is empty

### Clear all

- [x] Clear all removes every item, checked or not, right away
- [x] A message bar then shows "List cleared · Undo" for about 5 seconds
- [x] Undo brings back every item in its old order, with its checked state
- [x] Clear all is hidden while the list is empty

### Add Items Input

- [x] Tapping "+ Add" opens a multi-line text box in place of the trigger, with the cursor already in the box
- [x] The placeholder text reads "One item per line"
- [x] Pressing Enter starts a new line and does not submit
- [x] An "Add" button below the text box submits, and so does Cmd/Ctrl + Enter
- [x] The "Add" button is disabled while the box is empty or contains only spaces
- [x] Each non-empty line becomes one item, so "chicken", "tomato" and "rice" on three lines add 3 items
- [x] Only line breaks split items, and commas and other punctuation stay in the name, so "tomatoes, canned" is one item
- [x] Spaces are trimmed from the start and end of each line
- [x] Blank lines are skipped
- [x] Leading list markers such as "-", "•", "*" or "1." are stripped, so pasted lists come in clean
- [x] Repeated lines in the same entry are added once, ignoring capitalization
- [x] Lines that match an item already on the list are skipped, ignoring capitalization
- [x] New items are added to the bottom of the unchecked items, in the order they were typed
- [x] After submitting, the message bar briefly confirms the result, such as "Added 3 items" or "Added 2 · 1 already on list"
- [x] After submitting, the box clears and closes, and the "+ Add" trigger comes back
- [x] Pressing Escape, or tapping outside the box while it's empty, cancels and closes it
- [x] Tapping outside while the box has text keeps it open, so a half-typed list isn't lost
- [x] Switching tabs and coming back keeps the box open with its text
+ If every line is already on the list, the message bar says "Already on your list" and the box still closes
+ Text kept across a tab switch is lost on a reload
+ A number counts as a list marker only when a space follows it, so "1.5 lb beef" stays whole
+ Repeated spaces inside an item are collapsed to one, as with recipe ingredients
+ Escape cancels even when the box has text, discarding it

### Empty State

- [x] When the list is empty, it shows "Nothing on your list yet" above the "+ Add" trigger
  - The message now shows below the "+ Add" trigger, since the trigger is at the top
  - The message is removed, so an empty list shows only the "+ Add" trigger

### Suggested Ingredients

- [x] Suggestions come only from dishes in meal slots from today through Friday, and earlier days drop off
- [x] A dish gets suggestions from every saved recipe whose name appears in the dish name as whole words, ignoring capitalization
+ "Mushroom risotto" matches a "Risotto" recipe, and a "Rice" recipe matches "Fried rice" but not "Licorice tart"
+ A dish whose name is exactly a recipe's name matches that recipe
- [x] When a dish matches more than one recipe, their ingredients are combined under that dish, and repeats that differ only by capitalization appear once
- [x] A dish planned in more than one slot appears only once
- [x] Planned slots and empty slots don't give suggestions
- [x] A Suggested section sits below the Groceries card, with a small uppercase "SUGGESTED" label
  - The "SUGGESTED" label is removed, so the section starts with the first dish name, shown in grey
  - Dish names use the same sans font as the ingredient chips, in all caps and regular (not bold) weight
- [x] Each dish shows its name, followed by its ingredients as "+ ingredient" chips
- [x] Dishes are listed in slot order, earliest day first and lunch before dinner
- [x] The dish name is a label only, and tapping it does nothing
- [x] Chips appear in the same order as the recipe's ingredients
+ Chips follow the pantry staples style in the screenshot you shared, and the rest of Groceries keeps its current style
- [x] Tapping a chip adds that ingredient to the bottom of the unchecked items
- [x] Tapping a chip shows no message bar
- [x] An ingredient already on the list, checked or not, isn't suggested, ignoring capitalization
- [x] If an ingredient is removed from the list, its chip comes back as long as the dish is still planned from today onward
- [x] Suggestions update live when meals are assigned, swapped or removed, when recipe ingredients change, and when the list changes
- [x] A dish with no chips left is hidden
- [x] When no dish has chips left, the whole Suggested section is hidden, label included

## Out of Scope

- Quick-add suggestions from planned recipes' ingredients
  - Now covered by Suggested Ingredients
- A count of items still to buy
  - Now shown in the card header
  - Removed again, so it's out of scope
