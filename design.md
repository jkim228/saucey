Design System Specification: Saucey

1. Overview & Brand Philosophy

Saucey is an editorial, batch-cooking-centric weekly meal planning system. It bridges nourishing home cooking with effortless schedule orchestration. 
The aesthetic is tactile, warm, culinary, and clean—departing from sterile productivity software in favor of warm butter, amber tones, organic neutrals, and calm typography reminiscent of a modern culinary journal.



2. Color System & Tokens

Primary Brand & Warm Accents





Amber Primary (amber-600 / #B8643F): Brand identity accent, active day markers, primary focus indicators.



Amber Glow / Highlights (amber-500 / #F59E0B): Subtle hover states, secondary highlights.



Dark Amber (amber-700 / #97482A): High-contrast icons, borders, and structured divider marks.

Culinary Meal State Tokens (As specified in palette reference)





Primary / Selected Recipe (#FDEED8 / Warm Peach, border #F0D3AA):





Background: #FDEED8



Text: #7A3518 (Dark warm brown)



Border: #F5CE7C / #D9A27A (Subtle warm crust border)



Meaning: Active cooked batch / assigned recipe.



Unselected / Empty Slot (#FBF9F5 / Cream Alabaster):





Background: #F9F8F5 or #FFFFFF



Border: #E5E2DA (Dashed 1.5px border)



Text: #A8A29E / #78716C



Meaning: Open, unplanned lunch/dinner slot ready for assignment.



Skipped / Planned Eating Out (#E3DDE0 / Dusty Lavender):





Background: #E3DDE0



Border: #DAD3E3



Text: #695856



Meaning: "Planned" (eating out, skipping, or covered meal slot).

Surfaces & Backgrounds





App Canvas Background: #FFFDF9 to #FAF7F2 (Warm porcelain / stone neutral).



Surface Container Low (Day Cards & Drawers): #FFFFFF with soft inset borders (#F2EEE6).



Surface Container High (Extras / Banks): #F7F4EE to #F3EFE7.



Dimmed Backdrop: rgba(28, 25, 23, 0.35) with backdrop blur (blur-sm).

Recipe Category / Tag Accents





Stew / Kimchi Accents: #FEE2E2 / text #991B1B (Soft rose broth).



Green / Herb Accents (e.g. Caldo Verde): #DCFCE7 / text #166534 (Fresh garden herb).



3. Typography & Hierarchy

Font Family





Display Font: Gloock for headings, day names and recipe/dish names (single weight, never faux-bolded).



Serif Font: Newsreader for italic text (Clear all, Quick add) and grocery item names.



Label Font: DM Sans for uppercase section labels (SAUCEY, WEEKLY SCHEDULE, LUNCH, DINNER, ADD A DISH, suggested dish names).



Primary Font: Modern Neo-Grotesque sans-serif (Inter, -apple-system, BlinkMacSystemFont, sans-serif) for labels, body text and controls, with high legibility at micro scales.



Display / Day Header: High-tracking uppercase bold styling (tracking-wider, font-bold).

Type Scale





Display / Week Title: ~26px, Gloock, #5A3E2B.



Section Kicker: 11px / text-xs, uppercase, tracking-widest, font-bold, #78716C (Stone-500).



Day Header (MON, TUE): 16px, Gloock, uppercase, tracking-wider, #5A3E2B.



Date Tag (Nov 9): 16px, Gloock, right-aligned, #5A3E2B (same as the day name).



Slot Time/Type Kicker (LUNCH, DINNER): 11px / font-bold, uppercase, tracking-wider, #A65F44, sitting straight in the day card with no inner container.



Recipe Title: 16px – 20px, Gloock, #7A3518 on a selected slot or #5A3E2B in lists.



Body & Captions: 12px – 13px, font-medium, #78716C (Stone-500).



4. Spacing, Layout & Elevation

Layout Principles





Target Device: Desktop responsive container with dedicated compact mobile column preview (~390px - 440px viewport frame).



Day Carousel / Deck: Two full day cards visible side-by-side on screen (w-[47%] - w-[48%]), enabling immediate contrast between today and tomorrow.



Rhythm: Compact vertical spacing to eliminate dead scroll areas while honoring minimum 44px touch targets.



Corner Radii:





App Icon / Outer Modal: rounded-3xl (24px - 32px)



Day Cards: rounded-2xl (16px - 20px)



Meal Slots & Pills: rounded-xl (12px)



Status Counters & Chips: rounded-full (9999px)

Elevation & Shadows





Card Shadow: 0 2px 8px -2px rgba(45, 42, 38, 0.05), 0 1px 3px rgba(45, 42, 38, 0.04)



Modal Dialog: 0 20px 40px -12px rgba(45, 42, 38, 0.16), 0 8px 16px -4px rgba(45, 42, 38, 0.08)



App Icon Soft Shadow: 0 18px 22px rgba(217, 119, 6, 0.18)



5. Components & State Architecture

1. Header & Progress Badge





Current Week Title: Nov 9 – 13



Dynamic Planned Counter Pill (neutral grey: #EBE8DE background, #DDD8CE border, #57534E text):





X/10 planned (5 days × 2 slots/day)



Pill background #FEF3C7 (Amber-100) with #92400E text.



Updates dynamically whenever a recipe is assigned, marked as planned, or cleared.



Mode Toggle: Light/Dark theme button in header.

2. Day Cards (Editorial Day Card Deck)





Structure:





Header: Left-aligned Day (MON), Right-aligned Date (NOV 9).



Slots: Two vertical slots for LUNCH and DINNER.



Slot States:





Empty (+): Dashed border, centered + sign.



Assigned Recipe: Warm butter card, dish title, portion badge.



Planned: Dusty lavender card, "Planned" text (eating out).

3. Quick Action Modal / Drawer





Trigger: Tap any empty + slot or active meal card.



Context Header: e.g., Mon, Nov 9 · Lunch with × dismissal.



Section 1: From Extras:





Interactive chip pills (e.g. Lasagna ×3, Kimchi jjigae ×3, Caldo verde ×2).



One-tap assignment that automatically decrements stock in the Extras bank.



Section 2: Add a Dish:





Search text input with autofill match.



Multiplier stepper ("How many meals does this make?") starting at 1.



Add & assign CTA: fills current slot, dumps leftovers (n > 1) into Extras.



Section 3: Actions:





Mark as planned: neutral eating out state.



Clear slot: resets slot to empty.

4. Extras Bank (Bottom Drawer / Shelf)





Collapsible tray with total extra servings counter (8 servings).



Interactive leftover badges with remove (×) capability.



Descriptive helper: "Leftover portions ready to assign. Tap any extra to place it in your grid, or tap × if you shared or froze it."



6. Accessibility & Interactivity Rules





All text meets WCAG AA contrast (minimum 4.5:1 ratio against warm butter and neutral backgrounds).



Tap targets adhere to 44×44px minimum sizing.



Clear visual state feedback: hover elevation, active compression (scale-[0.98]), and smooth transitions (transition-all duration-200 ease-out).