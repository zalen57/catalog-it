import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  increment,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  getDoc,
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage, isFirebaseConfigured } from './firebase'
import { SAMPLE_ARTICLES } from '../data/sampleArticles'
import {
  getArticlesDisplayList,
  subscribeLocalArticleChanges,
  getArticleLocal,
  createArticleLocal,
  updateArticleLocal,
  removeArticleLocal,
  incrementViewsLocal,
  toggleLikeLocal,
  readCoverAsDataUrl,
} from './localArticleStore.js'

const COL = 'articles'

function mapDoc(d) {
  const data = d.data()
  return { id: d.id, ...data }
}

export function subscribeArticles(callback, onError) {
  if (!isFirebaseConfigured || !db) {
    const emit = () => callback(getArticlesDisplayList())
    emit()
    return subscribeLocalArticleChanges(emit)
  }
  const q = query(collection(db, COL), orderBy('createdAt', 'desc'))
  return onSnapshot(
    q,
    (snap) => callback(snap.docs.map(mapDoc)),
    (e) => {
      onError?.(e)
      callback(SAMPLE_ARTICLES)
    },
  )
}

export async function getArticle(id) {
  if (!isFirebaseConfigured || !db) {
    return getArticleLocal(id)
  }
  const d = await getDoc(doc(db, COL, id))
  if (!d.exists()) return null
  return mapDoc(d)
}

export async function incrementViews(id) {
  if (!isFirebaseConfigured || !db) {
    incrementViewsLocal(id)
    return
  }
  await updateDoc(doc(db, COL, id), { views: increment(1) })
}

export async function toggleLike(id, delta) {
  if (!isFirebaseConfigured || !db) {
    toggleLikeLocal(id, delta)
    return
  }
  await updateDoc(doc(db, COL, id), { likes: increment(delta) })
}

export async function createArticle(payload) {
  if (!isFirebaseConfigured || !db) {
    return createArticleLocal(payload)
  }
  const refDoc = await addDoc(collection(db, COL), {
    ...payload,
    views: 0,
    likes: 0,
    createdAt: serverTimestamp(),
  })
  return refDoc.id
}

export async function updateArticle(id, payload) {
  if (!isFirebaseConfigured || !db) {
    updateArticleLocal(id, payload)
    return
  }
  await updateDoc(doc(db, COL, id), { ...payload, updatedAt: serverTimestamp() })
}

export async function removeArticle(id) {
  if (!isFirebaseConfigured || !db) {
    removeArticleLocal(id)
    return
  }
  await deleteDoc(doc(db, COL, id))
}

export async function uploadCover(file, articleIdHint = 'draft') {
  if (isFirebaseConfigured && storage) {
    const safeName = file.name.replace(/[^\w.-]+/g, '_')
    const path = `covers/${articleIdHint}/${Date.now()}_${safeName}`
    const r = ref(storage, path)
    await uploadBytes(r, file)
    return getDownloadURL(r)
  }
  return readCoverAsDataUrl(file)
}
