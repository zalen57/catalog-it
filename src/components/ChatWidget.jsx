import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  HiOutlineChatBubbleLeftRight,
  HiOutlinePaperAirplane,
  HiOutlineXMark,
  HiOutlineSparkles,
} from 'react-icons/hi2'
import { sendChatMessage } from '../services/chatbotService'

const geminiConfigured = Boolean(import.meta.env.VITE_GEMINI_API_KEY?.trim())

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [messages, setMessages] = useState(() => [
    {
      role: 'bot',
      text: geminiConfigured
        ? 'Halo! Saya asisten IT Catalog — Gemini sudah terhubung. Tanya seputar teknologi, cloud, atau keamanan.'
        : 'Halo! Saya asisten IT Catalog (jawaban singkat lokal). Untuk Gemini: isi VITE_GEMINI_API_KEY di .env, lalu jalankan npm run build:xampp atau restart npm run dev, lalu refresh halaman.',
    },
  ])
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  const send = async () => {
    const text = input.trim()
    if (!text || busy) return
    setInput('')
    const userMsg = { role: 'user', text }
    setMessages((m) => [...m, userMsg])
    setBusy(true)
    const reply = await sendChatMessage(text, messages)
    setMessages((m) => [...m, { role: 'bot', text: reply }])
    setBusy(false)
  }

  return (
    <>
      <motion.button
        type="button"
        className="chat-launcher"
        onClick={() => setOpen((o) => !o)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.96 }}
        aria-label={open ? 'Tutup chat' : 'Buka chat'}
      >
        {open ? <HiOutlineXMark /> : <HiOutlineChatBubbleLeftRight />}
      </motion.button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="chat-panel"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 420, damping: 32 }}
          >
            <div className="chat-head">
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <HiOutlineSparkles aria-hidden />
                IT Assistant
              </span>
              <span className="muted" style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                {geminiConfigured ? 'Gemini' : 'Lokal'}
              </span>
            </div>
            <div className="chat-messages">
              {messages.map((m, i) => (
                <div key={i} className={`chat-bubble ${m.role}`}>
                  {m.text}
                </div>
              ))}
              {busy && <div className="chat-bubble bot">…</div>}
              <div ref={endRef} />
            </div>
            <div className="chat-input-row">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Tulis pertanyaan…"
                onKeyDown={(e) => e.key === 'Enter' && send()}
              />
              <button type="button" className="button" style={{ padding: '10px 14px' }} onClick={send} disabled={busy}>
                <HiOutlinePaperAirplane />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
