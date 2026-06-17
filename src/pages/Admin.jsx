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
  HiOutlineLockClosed,
  HiOutlineUser,
} from 'react-icons/hi2'
import { motion, AnimatePresence } from 'framer-motion'
import 'react-quill/dist/quill.snow.css'
import Button from '../components/Button.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useArticles } from '../context/ArticlesContext.jsx'
import { loginAdmin, getAuthorDisplayName } from '../services/authService'
import {
  createArticle,
  updateArticle,
  removeArticle,
  uploadCover,
  getArticle,
} from '../services/articleService'
import { CATEGORIES } from '../data/sampleArticles.js'

const ReactQuill = lazy(() => import('react-quill'))

export default function Admin() {
  const { user, isAdmin, loading: authLoading, firebaseReady, logout } = useAuth()
  const { articles } = useArticles()

  const [username, setUsername] = useState('')
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
      await loginAdmin(username, password)
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
    return (
      <div className="admin-login-page">
        <div className="admin-login-card glass">
          <div className="admin-login-header">
            <div className="admin-login-icon">
              <HiOutlineLockClosed />
            </div>
            <h1>Panel Admin</h1>
            <p className="muted">Masuk untuk mengelola artikel katalog</p>
          </div>
          <form className="admin-form" onSubmit={onLogin} autoComplete="on">
            <div className="field">
              <label htmlFor="admin-user">Username</label>
              <div className="admin-input-wrap">
                <HiOutlineUser className="admin-input-icon" aria-hidden />
                <input
                  id="admin-user"
                  name="username"
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="field">
              <label htmlFor="admin-pw">Password</label>
              <div className="admin-input-wrap">
                <HiOutlineLockClosed className="admin-input-icon" aria-hidden />
                <input
                  id="admin-pw"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            {authErr && <p className="admin-login-error">{authErr}</p>}
            <Button type="submit" disabled={busy} style={{ width: '100%', marginTop: 4 }}>
              {busy ? 'Memproses…' : 'Masuk'}
            </Button>
          </form>
          <Link to="/" className="admin-login-back">
            <HiOutlineArrowLeft /> Kembali ke beranda
          </Link>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="container">
        <h1 className="section-title">Akses ditolak</h1>
        <p className="muted">Sesi admin tidak valid. Silakan masuk ulang.</p>
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
          <div className="admin-sidebar-head">
            <div style={{ fontWeight: 800 }}>Panel Admin</div>
            <div className="admin-sidebar-user muted">
              {getAuthorDisplayName(user)}
              {!firebaseReady && (
                <span className="pill" style={{ fontSize: '0.65rem', marginLeft: 6 }}>
                  Lokal
                </span>
              )}
            </div>
          </div>
          <button type="button" className={section === 'dash' ? 'active' : ''} onClick={() => setSection('dash')}>
            <HiOutlineSquares2X2 />
            Dashboard
          </button>
          <button
            type="button"
            className={section === 'articles' ? 'active' : ''}
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
            className={section === 'editor' ? 'active' : ''}
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
