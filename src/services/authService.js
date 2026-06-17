import { signOut } from 'firebase/auth'
import { auth } from './firebase'
import {
  isLocalAdminSession,
  localAdminUser,
  endLocalAdminSession,
  loginLocalAdmin,
  ADMIN_AUTH_EVENT,
} from './localAdminAuth.js'

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
  const emit = () => {
    callback(isLocalAdminSession() ? localAdminUser : null)
  }
  emit()
  window.addEventListener(ADMIN_AUTH_EVENT, emit)
  return () => window.removeEventListener(ADMIN_AUTH_EVENT, emit)
}

export async function loginAdmin(username, password) {
  return loginLocalAdmin(username, password)
}

export async function logoutUser() {
  endLocalAdminSession()
  if (auth) {
    try {
      await signOut(auth)
    } catch {
      /* ignore */
    }
  }
}

export async function fetchUserRole(uid) {
  if (uid === localAdminUser.uid) return 'admin'
  return 'guest'
}
