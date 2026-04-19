import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db, isFirebaseConfigured } from './firebase'
import {
  isDemoAdminSession,
  demoAdminUser,
  endDemoAdminSession,
} from './demoAuth.js'

/**
 * Domain untuk identitas Firebase (RFC: .invalid aman untuk uji/internal).
 * Bisa di-override: VITE_AUTH_EMAIL_DOMAIN=domainkamu.com
 * Catatan: Firebase Email/Password tetap menyimpan identitas sebagai email (wajib ada @ di backend Firebase).
 * Di form login Anda hanya mengisi User — tanpa mengetik @.
 */
export function getAuthEmailDomain() {
  const d = import.meta.env.VITE_AUTH_EMAIL_DOMAIN
  if (typeof d === 'string' && d.trim()) return d.trim().toLowerCase()
  return 'catalog.invalid'
}

export function userToAuthEmail(loginId) {
  const slug = String(loginId)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9._-]/g, '')
  if (!slug) throw new Error('User tidak valid')
  return `${slug}@${getAuthEmailDomain()}`
}

export function getAuthorDisplayName(user) {
  if (!user) return 'Admin'
  const dn = user.displayName?.trim()
  if (dn) return dn
  const email = user.email || ''
  const at = email.indexOf('@')
  if (at > 0) return email.slice(0, at)
  return 'Admin'
}

export function subscribeAuth(callback) {
  if (!isFirebaseConfigured || !auth) {
    const emit = () => {
      if (isDemoAdminSession()) {
        callback(demoAdminUser)
      } else {
        callback(null)
      }
    }
    emit()
    window.addEventListener('it-catalog-demo-auth', emit)
    return () => window.removeEventListener('it-catalog-demo-auth', emit)
  }
  return onAuthStateChanged(auth, (user) => callback(user))
}

export async function loginEmailPassword(email, password) {
  if (!auth) throw new Error('Firebase Auth tidak tersedia')
  return signInWithEmailAndPassword(auth, email, password)
}

/** Login admin: kolom User + password (Firebase: user@<domain>). */
export async function loginWithUserPassword(loginId, password) {
  if (!auth) throw new Error('Firebase Auth tidak tersedia')
  const email = userToAuthEmail(loginId)
  return signInWithEmailAndPassword(auth, email, password)
}

export async function logoutUser() {
  if (isDemoAdminSession()) {
    endDemoAdminSession()
    return
  }
  if (!auth) return
  await signOut(auth)
}

export async function fetchUserRole(uid) {
  if (uid === demoAdminUser.uid) return 'admin'
  if (!isFirebaseConfigured || !db) return 'guest'
  const snap = await getDoc(doc(db, 'users', uid))
  if (!snap.exists()) return 'guest'
  return snap.data().role || 'guest'
}
