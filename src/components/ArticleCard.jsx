import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  HiOutlineEye,
  HiOutlineHeart,
  HiHeart,
  HiOutlineBookmark,
  HiBookmark,
} from 'react-icons/hi2'
import { formatDate } from '../utils/time'
import { isBookmarked, toggleBookmark } from '../utils/bookmarks'
import { hasLiked, setLiked } from '../utils/likesLocal'
import { useState } from 'react'

export default function ArticleCard({ article, onLikeToggle, index = 0 }) {
  const [bookmarked, setBookmarked] = useState(() => isBookmarked(article.id))
  const [liked, setLikedState] = useState(() => hasLiked(article.id))
  const [coverBroken, setCoverBroken] = useState(false)

  const onBookmark = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const next = toggleBookmark(article.id)
    setBookmarked(next)
  }

  const onLike = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    const next = !liked
    setLikedState(next)
    setLiked(article.id, next)
    const delta = next ? 1 : -1
    await onLikeToggle?.(article.id, delta)
  }

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: index * 0.05 }}
      whileHover={{ y: -6 }}
      className="glass article-card"
    >
      <Link to={`/articles/${article.id}`} className="article-card__link">
        <div className="article-card__media">
          {!coverBroken && article.image ? (
            <img
              src={article.image}
              alt=""
              loading="lazy"
              referrerPolicy="no-referrer"
              decoding="async"
              onError={() => setCoverBroken(true)}
            />
          ) : null}
          {(coverBroken || !article.image) && <div className="article-card__placeholder" aria-hidden />}
          <span className="pill article-card__cat">{article.category}</span>
        </div>
        <div className="article-card__body">
          <h3>{article.title}</h3>
          <p className="muted article-card__meta">
            {article.author} · {formatDate(article.createdAt)}
          </p>
          <div className="article-card__actions">
            <span className="stat">
              <HiOutlineEye aria-hidden />
              {article.views ?? 0}
            </span>
            <button type="button" className="icon-btn" onClick={onLike} aria-label="Suka">
              {liked ? <HiHeart /> : <HiOutlineHeart />}
              <span>{article.likes ?? 0}</span>
            </button>
            <button type="button" className="icon-btn" onClick={onBookmark} aria-label="Bookmark">
              {bookmarked ? <HiBookmark /> : <HiOutlineBookmark />}
            </button>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}
