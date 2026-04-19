const KEY = 'it-catalog-liked'

function read() {
  try {
    const raw = localStorage.getItem(KEY)
    const o = raw ? JSON.parse(raw) : {}
    return o && typeof o === 'object' ? o : {}
  } catch {
    return {}
  }
}

export function hasLiked(id) {
  return Boolean(read()[id])
}

export function setLiked(id, liked) {
  const o = read()
  if (liked) o[id] = true
  else delete o[id]
  localStorage.setItem(KEY, JSON.stringify(o))
}
