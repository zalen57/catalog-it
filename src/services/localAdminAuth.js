const SESSION_KEY = 'it-catalog-admin-session'
export const ADMIN_AUTH_EVENT = 'it-catalog-admin-auth'

export const localAdminUser = {
  uid: 'local-admin',
  email: 'admin@local',
  displayName: 'Admin',
}

export function getAdminCredentials() {
  const username = import.meta.env.VITE_ADMIN_USERNAME?.trim() || 'admin'
  const password =
    typeof import.meta.env.VITE_ADMIN_PASSWORD === 'string'
      ? import.meta.env.VITE_ADMIN_PASSWORD
      : 'admin'
  return { username, password }
}

export function isLocalAdminSession() {
  try {
    return sessionStorage.getItem(SESSION_KEY) === '1'
  } catch {
    return false
  }
}

function notifyAuthChange() {
  window.dispatchEvent(new Event(ADMIN_AUTH_EVENT))
}

export function loginLocalAdmin(username, password) {
  const creds = getAdminCredentials()
  const u = String(username ?? '').trim()
  const p = String(password ?? '')
  if (u !== creds.username || p !== creds.password) {
    throw new Error('Username atau password salah')
  }
  try {
    sessionStorage.setItem(SESSION_KEY, '1')
    localAdminUser.displayName = u
    notifyAuthChange()
  } catch {
    throw new Error('Penyimpanan sesi tidak tersedia (mode private?). Coba tab biasa.')
  }
  return localAdminUser
}

export function endLocalAdminSession() {
  try {
    sessionStorage.removeItem(SESSION_KEY)
  } catch {
    /* ignore */
  }
  notifyAuthChange()
}
