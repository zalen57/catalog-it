export const DEMO_SESSION_KEY = 'it-catalog-demo-admin'

export const demoAdminUser = {
  uid: 'local-demo-admin',
  email: 'demo@local',
  displayName: 'Demo Admin',
}

export function isDemoAdminSession() {
  try {
    return sessionStorage.getItem(DEMO_SESSION_KEY) === '1'
  } catch {
    return false
  }
}

export function startDemoAdminSession() {
  try {
    sessionStorage.setItem(DEMO_SESSION_KEY, '1')
    window.dispatchEvent(new Event('it-catalog-demo-auth'))
  } catch {
    alert('Penyimpanan sesi tidak tersedia (mode private?). Coba tab biasa atau aktifkan Firebase lewat .env.')
  }
}

export function endDemoAdminSession() {
  sessionStorage.removeItem(DEMO_SESSION_KEY)
  window.dispatchEvent(new Event('it-catalog-demo-auth'))
}
