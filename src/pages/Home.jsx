import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiArrowRight, HiFire, HiBolt, HiOutlineShieldCheck } from 'react-icons/hi2'
import { SiTensorflow, SiJavascript, SiApple, SiRocket } from 'react-icons/si'
import Button from '../components/Button.jsx'
import ArticleCard from '../components/ArticleCard.jsx'
import { useArticles } from '../context/ArticlesContext.jsx'
import { CATEGORIES } from '../data/sampleArticles.js'

const catIcons = {
  AI: SiTensorflow,
  Programming: SiJavascript,
  Gadget: SiApple,
  'Cyber Security': HiOutlineShieldCheck,
  Startup: SiRocket,
}

export default function Home() {
  const { trending, latest, loading, refreshLike } = useArticles()

  return (
    <div className="container">
      <section className="hero">
        <div className="hero-grid">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="pill" style={{ marginBottom: '1rem', display: 'inline-flex' }}>
              <HiBolt aria-hidden />
              Katalog Teknologi Modern
            </span>
            <h1>Insight IT, desain premium, tanpa PHP & SQL</h1>
            <p className="hero-lead">
              Baca topik yang lagi relevan—AI, coding, gadget, keamanan, sampai startup. Tanpa
              basa-basi: fokus ke inti biar cepat dapat arah, bukan cuma judul yang menggoda.
            </p>
            <div className="cta-row">
              <Link to="/articles">
                <Button>
                  Explore Artikel <HiArrowRight />
                </Button>
              </Link>
            </div>
          </motion.div>
          <motion.div
            className="hero-visual glass"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, delay: 0.08 }}
          >
            <img
              src="https://picsum.photos/id/1060/1400/900"
              alt=""
              referrerPolicy="no-referrer"
              decoding="async"
            />
          </motion.div>
        </div>
      </section>

      <section style={{ marginBottom: '2.5rem' }}>
        <h2 className="section-title">
          <HiFire style={{ verticalAlign: '-3px', marginRight: 8 }} />
          Trending
        </h2>
        {loading ? (
          <div className="grid-articles">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="glass skeleton" style={{ height: 280 }} />
            ))}
          </div>
        ) : (
          <div className="grid-articles">
            {trending.map((a, i) => (
              <ArticleCard key={a.id} article={a} index={i} onLikeToggle={refreshLike} />
            ))}
          </div>
        )}
      </section>

      <section style={{ marginBottom: '2.5rem' }}>
        <h2 className="section-title">Artikel Terbaru</h2>
        <div className="grid-articles">
          {loading
            ? [1, 2, 3].map((i) => <div key={i} className="glass skeleton" style={{ height: 280 }} />)
            : latest.slice(0, 6).map((a, i) => (
                <ArticleCard key={a.id} article={a} index={i} onLikeToggle={refreshLike} />
              ))}
        </div>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 className="section-title">Kategori</h2>
        <div className="category-grid">
          {CATEGORIES.map((c, idx) => {
            const Ico = catIcons[c.id] || SiJavascript
            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
              >
                <Link to={`/articles?category=${encodeURIComponent(c.id)}`} className="category-tile glass">
                  <span className="icon-wrap">
                    <Ico aria-hidden title={c.label} />
                  </span>
                  <strong>{c.label}</strong>
                  <span className="muted" style={{ fontSize: '0.85rem' }}>
                    Lihat artikel
                  </span>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
