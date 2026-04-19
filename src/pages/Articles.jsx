import { useMemo, useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { HiOutlineMagnifyingGlass } from 'react-icons/hi2'
import ArticleCard from '../components/ArticleCard.jsx'
import { useArticles } from '../context/ArticlesContext.jsx'
import { CATEGORIES } from '../data/sampleArticles.js'

export default function Articles() {
  const { articles, loading, refreshLike } = useArticles()
  const [params, setParams] = useSearchParams()
  const [q, setQ] = useState(params.get('q') || '')

  const category = params.get('category') || 'all'

  useEffect(() => {
    setQ(params.get('q') || '')
  }, [params])

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return articles.filter((a) => {
      const catOk = category === 'all' || a.category === category
      if (!needle) return catOk
      const blob = `${a.title} ${a.category} ${(a.tags || []).join(' ')}`.toLowerCase()
      return catOk && blob.includes(needle)
    })
  }, [articles, q, category])

  return (
    <div className="container">
      <h1 className="section-title" style={{ marginBottom: '0.5rem' }}>
        Artikel
      </h1>
      <p className="muted" style={{ marginBottom: '1.25rem' }}>
        Filter kategori & pencarian realtime — data dari Firestore saat Firebase aktif.
      </p>
      <div className="search-field glass" style={{ marginBottom: '1.25rem' }}>
        <HiOutlineMagnifyingGlass size={22} aria-hidden />
        <input
          value={q}
          onChange={(e) => {
            const v = e.target.value
            setQ(v)
            const next = new URLSearchParams(params)
            if (v) next.set('q', v)
            else next.delete('q')
            setParams(next, { replace: true })
          }}
          placeholder="Cari judul, tag, atau kategori…"
          aria-label="Cari artikel"
        />
      </div>
      <div className="filter-row">
        <button
          type="button"
          className={`filter-chip ${category === 'all' ? 'active' : ''}`}
          onClick={() => {
            const next = new URLSearchParams(params)
            next.delete('category')
            setParams(next, { replace: true })
          }}
        >
          Semua
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            className={`filter-chip ${category === c.id ? 'active' : ''}`}
            onClick={() => {
              const next = new URLSearchParams(params)
              next.set('category', c.id)
              setParams(next, { replace: true })
            }}
          >
            {c.label}
          </button>
        ))}
      </div>
      {loading ? (
        <div className="grid-articles">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="glass skeleton" style={{ height: 300 }} />
          ))}
        </div>
      ) : (
        <div className="grid-articles">
          {filtered.map((a, i) => (
            <ArticleCard key={a.id} article={a} index={i} onLikeToggle={refreshLike} />
          ))}
        </div>
      )}
      {!loading && filtered.length === 0 && <p className="muted">Tidak ada artikel cocok.</p>}
    </div>
  )
}
