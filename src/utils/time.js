export function toMillis(ts) {
  if (!ts) return Date.now()
  if (typeof ts?.seconds === 'number') return ts.seconds * 1000
  if (typeof ts?.toMillis === 'function') return ts.toMillis()
  if (ts instanceof Date) return ts.getTime()
  return Date.now()
}

export function formatDate(ts) {
  const d = new Date(toMillis(ts))
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
