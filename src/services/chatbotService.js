/**
 * Chatbot: Gemini jika VITE_GEMINI_API_KEY diset.
 * Pakai v1beta (field systemInstruction). Default gemini-2.5-flash: 2.0-flash sering 429 kuota free tier.
 */
const DEFAULT_MODEL = 'gemini-2.5-flash'

function normalizeModelId(raw) {
  const s = String(raw ?? '').trim()
  if (!s) return DEFAULT_MODEL
  return s.replace(/^models\//, '')
}

const IT_FAQ = [
  {
    keys: ['firebase', 'firestore', 'hosting'],
    text:
      'Firebase cocok untuk app tanpa backend tradisional: Firestore untuk data, Auth untuk login, Storage untuk file, dan Hosting untuk deploy statis.',
  },
  {
    keys: ['react', 'vite', 'frontend'],
    text:
      'React + Vite memberikan dev experience cepat dan bundle modern. Pisahkan UI, services, dan routing agar mudah di-scale.',
  },
  {
    keys: ['security', 'zero trust', 'cyber'],
    text:
      'Mulai dari dasar: MFA, patch rutin, least privilege, dan monitoring log. Zero Trust berarti verifikasi berkelanjutan, bukan sekali login.',
  },
  {
    keys: ['ai', 'llm', 'machine learning'],
    text:
      'LLM bagus untuk asisten, tapi perlu guardrail: validasi output, rate limit, dan jangan expose API key tanpa pembatasan di konsol cloud.',
  },
  {
    keys: ['startup', 'mvp', 'pitch'],
    text:
      'MVP fokus ke satu pain point kuat, ukur retention, lalu iterasi. Pitch deck: masalah → insight → solusi → traction.',
  },
]

function localReply(userMessage) {
  const q = userMessage.toLowerCase()
  for (const row of IT_FAQ) {
    if (row.keys.some((k) => q.includes(k))) return row.text
  }
  return (
    'Saya asisten IT Catalog (mode offline). Tanya tentang React, Firebase, keamanan, AI, atau startup. ' +
    'Untuk jawaban AI Gemini, pastikan VITE_GEMINI_API_KEY di .env lalu build ulang (XAMPP: npm run build:xampp).'
  )
}

function buildContents(message, priorMessages) {
  const mapped = priorMessages.map((m) => ({
    role: m.role === 'user' ? 'user' : 'model',
    parts: [{ text: m.text }],
  }))
  let contents = [...mapped, { role: 'user', parts: [{ text: message }] }]
  while (contents.length > 0 && contents[0].role === 'model') {
    contents = contents.slice(1)
  }
  if (contents.length === 0) {
    contents = [{ role: 'user', parts: [{ text: message }] }]
  }
  return contents
}

async function geminiReply(message, priorMessages) {
  const key = import.meta.env.VITE_GEMINI_API_KEY?.trim()
  if (!key) return localReply(message)

  const model = normalizeModelId(import.meta.env.VITE_GEMINI_MODEL?.trim() || DEFAULT_MODEL)
  const systemInstruction = {
    parts: [
      {
        text:
          'Kamu asisten katalog teknologi IT. Jawab singkat, jelas, bahasa Indonesia, tone profesional ramah. ' +
          'Jika user bertanya di luar IT, arahkan kembali ke topik teknologi.',
      },
    ],
  }

  const contents = buildContents(message, priorMessages.slice(-12))
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ systemInstruction, contents }),
  })

  const raw = await res.text()
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${raw.slice(0, 200)}`)
  }

  let data
  try {
    data = JSON.parse(raw)
  } catch {
    throw new Error('Respons Gemini bukan JSON')
  }

  const text =
    data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') ||
    data?.error?.message ||
    'Maaf, tidak ada balasan (cek safety / prompt).'
  return String(text).trim()
}

export async function sendChatMessage(message, priorMessages) {
  const trimmed = message.trim()
  if (!trimmed) return ''
  const hasKey = Boolean(import.meta.env.VITE_GEMINI_API_KEY?.trim())
  try {
    return await geminiReply(trimmed, priorMessages)
  } catch (e) {
    if (import.meta.env.DEV) console.error('[Gemini]', e)
    if (hasKey) {
      const detail = String(e?.message || 'error')
      const quota =
        /\b429\b/.test(detail) ||
        /quota|rate limit|RESOURCE_EXHAUSTED/i.test(detail)
      const hint = quota
        ? ' Kuota/rate limit (sering di free tier untuk gemini-2.0-flash). Coba VITE_GEMINI_MODEL=gemini-2.5-flash lalu restart dev / build ulang.'
        : ' Coba VITE_GEMINI_MODEL=gemini-2.5-flash, cek pembatasan HTTP referrer di Google AI Studio, lalu restart dev / build ulang.'
      return (
        'Maaf, Gemini gagal membalas. Key terdeteksi — cek model, kuota, atau pembatasan key. Detail: ' +
        detail.slice(0, 280) +
        hint
      )
    }
    return localReply(trimmed)
  }
}
