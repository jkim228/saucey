/** The built-in recipe tags, in the order they're shown; tags the user adds come after these. */
export const RECIPE_TAGS = ['easy', 'lunch', 'dinner', '2+']

/** The tag every recipe with more than one serving is saved with. */
export const SERVINGS_TAG = '2+'

/** `tags` plus "2+" when `servings` is more than 1. */
export function withServingsTag(tags, servings) {
  return servings > 1 && !tags.includes(SERVINGS_TAG) ? [...tags, SERVINGS_TAG] : tags
}
