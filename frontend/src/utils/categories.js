import { categoryIconMap, getCategoryStyle } from './categoryIconMap'

export const CATEGORY_COLORS = Object.fromEntries(
  Object.entries(categoryIconMap).map(([category, config]) => [category, [config.background, config.color]]),
)

export const CLASSES = ['1A', '1B', '2A', '2B', '3A', '3B', '4A', '4B', '5A', '5B', '6A', '6B']

export function categoryStyle(category) {
  return getCategoryStyle(category)
}
