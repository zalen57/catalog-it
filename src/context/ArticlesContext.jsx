import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { subscribeArticles, toggleLike } from '../services/articleService'
import { toMillis } from '../utils/time'

const ArticlesContext = createContext(null)

export function ArticlesProvider({ children }) {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const unsub = subscribeArticles(
      (data) => {
        setArticles(data)
        setLoading(false)
        setError(null)
      },
      (e) => {
        console.error(e)
        setError(e?.message || 'Gagal memuat artikel')
        setLoading(false)
      },
    )
    return unsub
  }, [])

  const refreshLike = async (id, delta) => {
    try {
      await toggleLike(id, delta)
    } catch (e) {
      console.warn(e)
    }
  }

  const value = useMemo(
    () => ({
      articles,
      loading,
      error,
      refreshLike,
      trending: [...articles].sort((a, b) => (b.views ?? 0) - (a.views ?? 0)).slice(0, 4),
      latest: [...articles].sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt)),
    }),
    [articles, loading, error],
  )

  return <ArticlesContext.Provider value={value}>{children}</ArticlesContext.Provider>
}

export function useArticles() {
  const ctx = useContext(ArticlesContext)
  if (!ctx) throw new Error('useArticles outside ArticlesProvider')
  return ctx
}
