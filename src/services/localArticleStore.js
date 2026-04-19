import { SAMPLE_ARTICLES } from '../data/sampleArticles.js'
import { toMillis } from '../utils/time.js'

const KEY = 'it-catalog-local-articles-v1'
export const LOCAL_ARTICLES_EVENT = 'it-catalog-local-articles-change'

function readRaw() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const arr = JSON.parse(raw)
    return Array.isArray(arr) ? arr : null
  } catch {
    return null
  }
}

/** Daftar artikel untuk publik & admin (urut terbaru). */
export function getArticlesDisplayList() {
  const local = readRaw()
  if (local && local.length > 0) {
    return [...local].sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt))
  }
  return SAMPLE_ARTICLES
}

function writeAndNotify(list) {
  localStorage.setItem(KEY, JSON.stringify(list))
  window.dispatchEvent(new CustomEvent(LOCAL_ARTICLES_EVENT))
}

/** Salin sample ke localStorage lalu kembalikan array yang bisa dimutasi. */
function getMutableList() {
  const raw = readRaw()
  if (raw && raw.length > 0) return [...raw]
  return JSON.parse(JSON.stringify(SAMPLE_ARTICLES))
}

function commit(list) {
  writeAndNotify(list)
}

export function subscribeLocalArticleChanges(handler) {
  const fn = () => handler()
  window.addEventListener(LOCAL_ARTICLES_EVENT, fn)
  const onStorage = (e) => {
    if (e.key === KEY) fn()
  }
  window.addEventListener('storage', onStorage)
  return () => {
    window.removeEventListener(LOCAL_ARTICLES_EVENT, fn)
    window.removeEventListener('storage', onStorage)
  }
}

export function getArticleLocal(id) {
  return getArticlesDisplayList().find((a) => a.id === id) || null
}

export function createArticleLocal(payload) {
  const list = getMutableList()
  const id = crypto.randomUUID()
  const article = {
    ...payload,
    id,
    views: 0,
    likes: 0,
    createdAt: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 },
  }
  commit([article, ...list])
  return id
}

export function updateArticleLocal(id, payload) {
  const list = getMutableList()
  const idx = list.findIndex((a) => a.id === id)
  if (idx === -1) throw new Error('Artikel tidak ditemukan')
  list[idx] = { ...list[idx], ...payload, id }
  commit(list)
}

export function removeArticleLocal(id) {
  const list = getMutableList().filter((a) => a.id !== id)
  commit(list)
}

export function incrementViewsLocal(id) {
  const list = getMutableList()
  const idx = list.findIndex((a) => a.id === id)
  if (idx === -1) return
  list[idx] = { ...list[idx], views: (list[idx].views ?? 0) + 1 }
  commit(list)
}

export function toggleLikeLocal(id, delta) {
  const list = getMutableList()
  const idx = list.findIndex((a) => a.id === id)
  if (idx === -1) return
  list[idx] = { ...list[idx], likes: Math.max(0, (list[idx].likes ?? 0) + delta) }
  commit(list)
}

export function readCoverAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(String(r.result))
    r.onerror = () => reject(new Error('Gagal membaca file'))
    r.readAsDataURL(file)
  })
}
