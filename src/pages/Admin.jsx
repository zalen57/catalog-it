import { useEffect, useState, Suspense, lazy } from 'react'
import { Link } from 'react-router-dom'
import {
  HiOutlineSquares2X2,
  HiOutlineNewspaper,
  HiOutlinePlusCircle,
  HiOutlineArrowLeft,
  HiOutlineEye,
  HiOutlineTrash,
  HiOutlinePencilSquare,
  HiOutlineXMark,
} from 'react-icons/hi2'
import { motion, AnimatePresence } from 'framer-motion'
import 'react-quill/dist/quill.snow.css'
import Button from '../components/Button.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useArticles } from '../context/ArticlesContext.jsx'
import { loginWithUserPassword, getAuthorDisplayName, getAuthEmailDomain } from '../services/authService'
import {
  createArticle,
  updateArticle,
  removeArticle,
  uploadCover,
  getArticle,
} from '../services/articleService'
import { CATEGORIES } from '../data/sampleArticles.js'
import { startDemoAdminSession, demoAdminUser } from '../services/demoAuth.js'
import { getFirebaseEnvChecklist } from '../utils/firebaseEnvStatus.js'

const ReactQuill = lazy(() => import('react-quill'))

export default function Admin() {
  const { user, isAdmin, loading: authLoading, firebaseReady, logout } = useAuth()
  const { articles } = useArticles()

  const [adminUser, setAdminUser] = useState('')
  const [password, setPassword] = useState('')
  const [authErr, setAuthErr] = useState('')
  const [busy, setBusy] = useState(false)

  const [section, setSection] = useState('dash')
  const [editingId, setEditingId] = useState(null)

  const [title, setTitle] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0].id)
  const [imageUrl, setImageUrl] = useState('')
  const [file, setFile] = useState(null)
  const [content, setContent] = useState('')
  const [tags, setTags] = useState('')
  const [preview, setPreview] = useState(false)

  useEffect(() => {
    if (section !== 'editor') return
    if (!editingId) {
      setTitle('')
      setCategory(CATEGORIES[0].id)
      setImageUrl('')
      setFile(null)
      setContent('')
      setTags('')
      return
    }
    let alive = true
    ;(async () => {
      const a = await getArticle(editingId)
      if (!alive || !a) return
      setTitle(a.title || '')
      setCategory(a.category || CATEGORIES[0].id)
      setImageUrl(a.image || '')
      setContent(a.content || '')
      setTags((a.tags || []).join(', '))
    })()
    return () => {
      alive = false
    }
  }, [section, editingId])

  const onLogin = async (e) => {
    e.preventDefault()
    setAuthErr('')
    setBusy(true)
    try {
      await loginWithUserPassword(adminUser, password)
    } catch (err) {
      setAuthErr(err?.message || 'Login gagal')
    }
    setBusy(false)
  }

  const onPickFile = (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setImageUrl(URL.createObjectURL(f))
  }

  const publish = async () => {
    setBusy(true)
    try {
      let img = imageUrl
      if (file) {
        img = await uploadCover(file, editingId || 'new')
      }
      const tagArr = tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
      const payload = {
        title,
        category,
        image: img,
        content,
        tags: tagArr,
        author: getAuthorDisplayName(user),
      }
      if (editingId) await updateArticle(editingId, payload)
      else await createArticle(payload)
      setSection('articles')
      setEditingId(null)
    } catch (err) {
      alert(err?.message || 'Gagal menyimpan')
    }
    setBusy(false)
  }

  const onDelete = async (id) => {
    if (!confirm('Hapus artikel ini?')) return
    setBusy(true)
    try {
      await removeArticle(id)
    } catch (e) {
      alert(e?.message || 'Gagal menghapus')
    }
    setBusy(false)
  }

  if (authLoading) {
    return (
      <div className="container">
        <div className="glass skeleton" style={{ height: 200 }} />
      </div>
    )
  }

  if (!user) {
    if (!firebaseReady) {
      const checklist = getFirebaseEnvChecklist()
      return (
        <div className="container" style={{ maxWidth: 520 }}>
          <h1 className="section-title">Admin</h1>
          <div className="glass" style={{ padding: '1.25rem', marginBottom: '1rem' }}>
            <p className="muted" style={{ marginTop: 0 }}>
              Aplikasi <strong>tidak melihat</strong> konfigurasi Firebase yang lengkap. Biasanya bukan karena Firebase
              belum dibuat di Console, tapi karena <strong>variabel lingkungan tidak ikut ke build</strong> atau{' '}
              <strong>nama variabel salah</strong>.
            </p>
            <ul className="muted" style={{ margin: '0.75rem 0', paddingLeft: '1.2rem', fontSize: '0.9rem' }}>
              <li>
                File harus bernama persis <code>.env</code> di folder yang sama dengan <code>package.json</code>{' '}
                (bukan cuma <code>.env.example</code>). Di Windows sering file jadi <code>.env.txt</code> — cek di File
                Explorer (aktifkan “ekstensi nama file”).
              </li>
              <li>
                Nama variabel wajib diawali <code>VITE_</code>, misalnya <code>VITE_FIREBASE_API_KEY</code>. Tanpa{' '}
                <code>VITE_</code>, Vite <strong>tidak</strong> memasukkannya ke aplikasi.
              </li>
              <li>
                Kalau kamu buka lewat <strong>XAMPP + folder dist/</strong>: isi <code>.env</code> hanya dipakai{' '}
                <strong>saat</strong> menjalankan <code>npm run build:xampp</code>. Setelah mengubah <code>.env</code>,{' '}
                <strong>build ulang</strong> lalu refresh — <code>.env</code> tidak di-copy ke Apache; yang dibaca
                browser cuma file di <code>dist/</code>.
              </li>
              <li>
                Mode <code>npm run dev</code>: setelah edit <code>.env</code>, stop server (Ctrl+C) lalu{' '}
                <code>npm run dev</code> lagi.
              </li>
            </ul>
            <p style={{ marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>
              Yang terbaca di bundle saat ini (tanpa menampilkan secret):
            </p>
            <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.85rem', listStyle: 'none', paddingInlineStart: 0 }}>
              {checklist.map((row) => (
                <li key={row.key} style={{ marginBottom: 4 }}>
                  {row.ok ? '✓' : '✗'} <code>{row.key}</code>
                </li>
              ))}
            </ul>
            <p className="muted" style={{ marginBottom: 0, marginTop: '0.75rem', fontSize: '0.9rem' }}>
              <strong>Atau</strong> pakai <strong>mode demo</strong> di bawah — admin jalan tanpa Firebase (data di
              browser).
            </p>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
            <Button
              type="button"
              onClick={() => {
                startDemoAdminSession()
              }}
            >
              Masuk mode demo admin
            </Button>
            <Link to="/" className="button ghost" style={{ display: 'inline-flex' }}>
              <HiOutlineArrowLeft /> Kembali
            </Link>
          </div>
        </div>
      )
    }

    const authDomain = getAuthEmailDomain()
    return (
      <div className="container" style={{ maxWidth: 440 }}>
        <h1 className="section-title">Admin Login</h1>
        <form className="glass admin-form" style={{ padding: '1.25rem' }} onSubmit={onLogin} autoComplete="on">
          <div className="field">
            <label htmlFor="admin-user">User</label>
            <input
              id="admin-user"
              name="user"
              type="text"
              inputMode="text"
              autoComplete="username"
              placeholder="contoh: admin"
              value={adminUser}
              onChange={(e) => setAdminUser(e.target.value)}
              required
            />
            <p className="muted" style={{ fontSize: '0.8rem', marginTop: 6, marginBottom: 0 }}>
              Di form ini cukup isi <strong>User</strong> (tanpa mengetik @). Login memakai{' '}
              <code>
                user@{authDomain}
              </code>{' '}
              secara otomatis. Satu kali di Firebase → Authentication, buat Email akun = User Anda + @ + domain (
              contoh <code>admin@{authDomain}</code>). Ubah domain lewat variabel{' '}
              <code>VITE_AUTH_EMAIL_DOMAIN</code> di file <code>.env</code> bila default tidak diterima.
            </p>
          </div>
          <div className="field">
            <label htmlFor="pw">Password</label>
            <input
              id="pw"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <p className="muted" style={{ fontSize: '0.8rem', marginTop: 6, marginBottom: 0 }}>
              Password tidak disimpan teks di Firestore kami; Firebase Auth meng-hash di server (standar keamanan).
            </p>
          </div>
          {authErr && <p style={{ color: '#f87171', fontSize: '0.9rem' }}>{authErr}</p>}
          <Button type="submit" disabled={busy}>
            Masuk
          </Button>
        </form>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="container">
        <h1 className="section-title">Akses ditolak</h1>
        <p className="muted">
          {user?.uid === demoAdminUser.uid
            ? 'Sesi demo tidak valid. Coba keluar lalu masuk lagi.'
            : 'Akun ini belum memiliki role admin di Firestore collection users.'}
        </p>
        <Button className="ghost" onClick={() => logout()}>
          Logout
        </Button>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="admin-shell glass" style={{ borderRadius: 18, overflow: 'hidden' }}>
        <aside className="admin-sidebar">
          <div style={{ fontWeight: 800, marginBottom: 12, display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
            Panel
            {!firebaseReady && (
              <span className="pill" style={{ fontSize: '0.7rem' }}>
                Mode demo
              </span>
            )}
          </div>
          <button type="button" onClick={() => setSection('dash')}>
            <HiOutlineSquares2X2 />
            Dashboard
          </button>
          <button
            type="button"
            onClick={() => {
              setSection('articles')
              setEditingId(null)
            }}
          >
            <HiOutlineNewspaper />
            Artikel
          </button>
          <button
            type="button"
            onClick={() => {
              setEditingId(null)
              setSection('editor')
            }}
          >
            <HiOutlinePlusCircle />
            Tambah Artikel
          </button>
          <button type="button" className="ghost" onClick={() => logout()} style={{ marginTop: 24 }}>
            Logout
          </button>
        </aside>
        <div className="admin-main">
          {section === 'dash' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="section-title">Dashboard</h2>
              <div className="grid-articles" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))' }}>
                <div className="glass" style={{ padding: '1rem' }}>
                  <div className="muted">Total artikel</div>
                  <div style={{ fontSize: '2rem', fontWeight: 800 }}>{articles.length}</div>
                </div>
                <div className="glass" style={{ padding: '1rem' }}>
                  <div className="muted">Total views</div>
                  <div style={{ fontSize: '2rem', fontWeight: 800 }}>
                    {articles.reduce((s, a) => s + (a.views || 0), 0)}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          {section === 'articles' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="section-title">Kelola Artikel</h2>
              <div style={{ overflowX: 'auto' }}>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Judul</th>
                      <th>Kategori</th>
                      <th>Views</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {articles.map((a) => (
                      <tr key={a.id}>
                        <td>{a.title}</td>
                        <td>{a.category}</td>
                        <td>{a.views ?? 0}</td>
                        <td>
                          <div className="table-actions">
                            <button
                              type="button"
                              className="nav-icon-btn"
                              title="Edit"
                              onClick={() => {
                                setEditingId(a.id)
                                setSection('editor')
                              }}
                            >
                              <HiOutlinePencilSquare />
                            </button>
                            <button
                              type="button"
                              className="nav-icon-btn"
                              title="Hapus"
                              onClick={() => onDelete(a.id)}
                              disabled={busy}
                            >
                              <HiOutlineTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
          {section === 'editor' && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                <h2 className="section-title" style={{ marginBottom: 0 }}>
                  {editingId ? 'Edit Artikel' : 'Tambah Artikel'}
                </h2>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <Button className="ghost" type="button" onClick={() => setPreview(true)}>
                    <HiOutlineEye /> Preview
                  </Button>
                  <Button type="button" onClick={publish} disabled={busy || !title.trim()}>
                    Publish
                  </Button>
                </div>
              </div>
              <div className="admin-form" style={{ marginTop: 20 }}>
                <div className="field">
                  <label>Judul</label>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div className="field">
                  <label>Cover image</label>
                  <input type="file" accept="image/*" onChange={onPickFile} />
                  {imageUrl && (
                    <img src={imageUrl} alt="" referrerPolicy="no-referrer" style={{ marginTop: 10, borderRadius: 12, maxHeight: 180 }} />
                  )}
                </div>
                <div className="field">
                  <label>Kategori</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label>Tags (pisahkan koma)</label>
                  <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="AI, Cloud" />
                </div>
                <div className="field">
                  <label>Konten</label>
                  <Suspense fallback={<div className="skeleton" style={{ height: 260 }} />}>
                    <ReactQuill theme="snow" value={content} onChange={setContent} />
                  </Suspense>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
      <AnimatePresence>
        {preview && (
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 100,
              background: 'rgba(0,0,0,0.55)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 16,
            }}
            onClick={() => setPreview(false)}
          >
            <motion.div
              className="glass"
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: 800, width: '100%', maxHeight: '90vh', overflow: 'auto', padding: '1.25rem' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <strong>Preview</strong>
                <button type="button" className="nav-icon-btn" onClick={() => setPreview(false)} aria-label="Tutup">
                  <HiOutlineXMark />
                </button>
              </div>
              {imageUrl && (
                <div className="detail-cover">
                  <img src={imageUrl} alt="" referrerPolicy="no-referrer" />
                </div>
              )}
              <h2>{title || '(tanpa judul)'}</h2>
              <div className="article-body" dangerouslySetInnerHTML={{ __html: content || '<p>(kosong)</p>' }} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
