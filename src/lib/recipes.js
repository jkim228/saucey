/** Recipes, ingredients and grocery items are all saved lowercase. */
export function toLower(text) {
  return text.toLowerCase()
}

/** Returns the recipe whose name matches, ignoring capitalization, or undefined. */
export function findRecipe(recipes, name) {
  const key = name.trim().toLowerCase()
  return recipes.find((recipe) => recipe.toLowerCase() === key)
}

// "-", "•" or "*" bullets, or "1." / "1)" numbering; numbers need a space after, so "1.5 lb" stays.
const LIST_MARKER = /^(?:[-•*]\s*|\d+[.)]\s+)/

/** Like parseIngredients, but also strips the list markers pasted lists come with. */
export function parseItemLines(text) {
  const lines = text.split('\n').map((line) => line.trim().replace(LIST_MARKER, ''))
  return parseIngredients(lines.join('\n'))
}

/**
 * Turns one-ingredient-per-line text into a clean lowercase list: blank lines dropped, spaces
 * trimmed, and repeats kept once.
 * @param {string} text
 * @returns {string[]}
 */
export function parseIngredients(text) {
  const seen = new Set()
  return text
    .split('\n')
    .map((line) => toLower(line.trim().replace(/\s+/g, ' ')))
    .filter((line) => {
      const key = line.toLowerCase()
      if (!line || seen.has(key)) return false
      seen.add(key)
      return true
    })
}
