/** Cek apa yang terbaca Vite (tanpa menampilkan nilai rahasia). */

const KEYS = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
]

export function getFirebaseEnvChecklist() {
  return KEYS.map((key) => {
    const short = key.replace(/^VITE_FIREBASE_/, '').toLowerCase().replace(/_/g, ' ')
    const val = import.meta.env[key]
    const ok = typeof val === 'string' && val.trim().length > 0
    return { key, ok, short }
  })
}

export function isFirebaseEnvComplete() {
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID
  const appId = import.meta.env.VITE_FIREBASE_APP_ID
  return (
    typeof apiKey === 'string' &&
    apiKey.trim().length > 0 &&
    typeof projectId === 'string' &&
    projectId.trim().length > 0 &&
    typeof appId === 'string' &&
    appId.trim().length > 0
  )
}
