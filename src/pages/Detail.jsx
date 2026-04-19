import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  HiOutlineArrowLeft,
  HiOutlineShare,
  HiOutlineBookmark,
  HiBookmark,
  HiOutlineHeart,
  HiHeart,
  HiOutlineEye,
} from 'react-icons/hi2'
import Button from '../components/Button.jsx'
import { getArticle, incrementViews, toggleLike } from '../services/articleService'
import { formatDate } from '../utils/time'
import { isBookmarked, toggleBookmark } from '../utils/bookmarks'
import { hasLiked, setLiked } from '../utils/likesLocal'

export default function Detail() {
  const { id } = useParams()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [bm, setBm] = useState(false)
  const [liked, setLikedState] = useState(false)
  const [detailImgBroken, setDetailImgBroken] = useState(false)

  useEffect(() => {
    setDetailImgBroken(false)
  }, [id])

  useEffect(() => {
    let alive = true
    ;(async () => {
      setLoading(true)
      const a = await getArticle(id)
      if (!alive) return
      setArticle(a)
      setBm(isBookmarked(id))
      setLikedState(hasLiked(id))
      setLoading(false)
    })()
    return () => {
      alive = false
    }
  }, [id])

  useEffect(() => {
    if (!article?.id) return
    const k = `it-catalog-viewed:${article.id}`
    if (sessionStorage.getItem(k)) return
    sessionStorage.setItem(k, '1')
    incrementViews(article.id)
  }, [article])

  const onShare = async () => {
    const url = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({ title: article.title, url })
      } else {
        await navigator.clipboard.writeText(url)
        alert('Link disalin ke clipboard.')
      }
    } catch {
      /* user cancelled */
    }
  }

  const onBookmark = () => {
    const next = toggleBookmark(article.id)
    setBm(next)
  }

  const onLike = async () => {
    const next = !liked
    setLikedState(next)
    setLiked(article.id, next)
    await toggleLike(article.id, next ? 1 : -1)
    setArticle((a) => (a ? { ...a, likes: Math.max(0, (a.likes ?? 0) + (next ? 1 : -1)) } : a))
  }

  if (loading) {
    return (
      <div className="container">
        <div className="glass skeleton" style={{ height: 420, marginBottom: 16 }} />
        <div className="skeleton" style={{ height: 28, width: '60%', marginBottom: 12 }} />
        <div className="skeleton" style={{ height: 14, width: '40%' }} />
      </div>
    )
  }

  if (!article) {
    return (
      <div className="container">
        <p>Artikel tidak ditemukan.</p>
        <Link to="/articles">← Kembali</Link>
      </div>
    )
  }

  return (
    <div className="container">
      <Link to="/articles" className="muted" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        <HiOutlineArrowLeft />
        Kembali
      </Link>
      <motion.article initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="detail-cover glass">
          {article.image && !detailImgBroken ? (
            <img
              src={article.image}
              alt=""
              referrerPolicy="no-referrer"
              decoding="async"
              onError={() => setDetailImgBroken(true)}
            />
          ) : (
            <div className="detail-cover-placeholder" aria-hidden />
          )}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center', marginBottom: '0.75rem' }}>
          <span className="pill">{article.category}</span>
          <span className="muted">
            {article.author} · {formatDate(article.createdAt)}
          </span>
          <span className="muted" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <HiOutlineEye aria-hidden />
            {article.views ?? 0} views
          </span>
        </div>
        <h1 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.4rem)', margin: '0 0 1rem' }}>{article.title}</h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
          {(article.tags || []).map((t) => (
            <span key={t} className="pill">
              #{t}
            </span>
          ))}
        </div>
        <div className="detail-actions">
          <Button onClick={onLike}>
            {liked ? <HiHeart /> : <HiOutlineHeart />}
            Suka ({article.likes ?? 0})
          </Button>
          <Button className="ghost" onClick={onBookmark}>
            {bm ? <HiBookmark /> : <HiOutlineBookmark />}
            Bookmark
          </Button>
          <Button className="ghost" onClick={onShare}>
            <HiOutlineShare />
            Share
          </Button>
        </div>
        <div className="article-body glass" style={{ padding: '1.25rem 1.5rem' }} dangerouslySetInnerHTML={{ __html: article.content }} />
      </motion.article>
    </div>
  )
}
