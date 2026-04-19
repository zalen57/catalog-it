const KEY = 'it-catalog-bookmarks'

export function getBookmarkIds() {
  try {
    const raw = localStorage.getItem(KEY)
    const arr = raw ? JSON.parse(raw) : []
    return Array.isArray(arr) ? arr : []
  } catch {
    return []
  }
}

export function isBookmarked(id) {
  return getBookmarkIds().includes(id)
}

export function toggleBookmark(id) {
  const set = new Set(getBookmarkIds())
  if (set.has(id)) set.delete(id)
  else set.add(id)
  localStorage.setItem(KEY, JSON.stringify([...set]))
  return set.has(id)
}
