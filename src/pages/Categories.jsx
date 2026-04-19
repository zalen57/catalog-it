import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiOutlineShieldCheck } from 'react-icons/hi2'
import { SiTensorflow, SiJavascript, SiApple, SiRocket } from 'react-icons/si'
import { CATEGORIES } from '../data/sampleArticles.js'
import { useArticles } from '../context/ArticlesContext.jsx'

const catIcons = {
  AI: SiTensorflow,
  Programming: SiJavascript,
  Gadget: SiApple,
  'Cyber Security': HiOutlineShieldCheck,
  Startup: SiRocket,
}

export default function Categories() {
  const { articles } = useArticles()

  return (
    <div className="container">
      <h1 className="section-title">Kategori</h1>
      <p className="muted" style={{ marginBottom: '1.5rem' }}>
        Pilih domain teknologi — setiap tile memakai logo brand/ikon yang relevan.
      </p>
      <div className="category-grid">
        {CATEGORIES.map((c, idx) => {
          const Ico = catIcons[c.id] || SiJavascript
          const count = articles.filter((a) => a.category === c.id).length
          return (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.06 }}
            >
              <Link to={`/articles?category=${encodeURIComponent(c.id)}`} className="category-tile glass">
                <span className="icon-wrap">
                  <Ico aria-hidden />
                </span>
                <strong>{c.label}</strong>
                <span className="muted" style={{ fontSize: '0.85rem' }}>
                  {count} artikel
                </span>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
