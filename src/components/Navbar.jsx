import { useEffect, useState } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import {
  HiOutlineSquares2X2,
  HiOutlineNewspaper,
  HiOutlineFolder,
  HiOutlineMoon,
  HiOutlineSun,
  HiOutlineMagnifyingGlass,
  HiOutlineShieldCheck,
  HiBars3,
  HiXMark,
} from 'react-icons/hi2'
import { SiReact, SiFirebase } from 'react-icons/si'
import { useTheme } from '../context/ThemeContext'

const linkClass = ({ isActive }) => (isActive ? 'active' : undefined)

const navItems = [
  { to: '/', end: true, label: 'Home', icon: HiOutlineSquares2X2 },
  { to: '/articles', label: 'Artikel', icon: HiOutlineNewspaper },
  { to: '/categories', label: 'Kategori', icon: HiOutlineFolder },
  { to: '/admin', label: 'Admin', icon: HiOutlineShieldCheck },
]

export default function Navbar() {
  const { dark, toggle } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.classList.toggle('nav-drawer-open', menuOpen)
    return () => document.body.classList.remove('nav-drawer-open')
  }, [menuOpen])

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 840) setMenuOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const goSearch = () => {
    navigate('/articles')
    setMenuOpen(false)
  }

  return (
    <header className="nav-wrap">
      <div className="glass nav-inner">
        <NavLink to="/" className="nav-brand" onClick={() => setMenuOpen(false)}>
          <SiReact aria-hidden style={{ fontSize: 'clamp(1.35rem, 4vw, 1.75rem)', color: '#60A5FA' }} />
          <span className="nav-brand-text">IT Catalog</span>
          <SiFirebase title="Firebase" aria-label="Firebase stack" className="nav-brand-fire" />
        </NavLink>

        <nav className="nav-links nav-links-desktop" aria-label="Utama">
          {navItems.map(({ to, end, label, icon: Ico }) => (
            <NavLink key={to} to={to} className={linkClass} end={end}>
              <Ico aria-hidden />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="nav-tools">
          <button
            type="button"
            className="nav-icon-btn nav-tool-search"
            onClick={() => navigate('/articles')}
            aria-label="Cari artikel"
          >
            <HiOutlineMagnifyingGlass size={22} />
          </button>
          <button type="button" className="nav-icon-btn" onClick={toggle} aria-label="Toggle dark mode">
            {dark ? <HiOutlineSun size={22} /> : <HiOutlineMoon size={22} />}
          </button>
          <button
            type="button"
            className="nav-burger"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-controls="mobile-drawer"
            aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'}
          >
            {menuOpen ? <HiXMark size={26} /> : <HiBars3 size={26} />}
          </button>
        </div>
      </div>

      <div
        id="mobile-drawer"
        className={`nav-drawer ${menuOpen ? 'is-open' : ''}`}
        aria-hidden={!menuOpen}
      >
        <div className="nav-drawer-inner glass">
          <nav className="nav-drawer-links" aria-label="Menu mobile">
            {navItems.map(({ to, end, label, icon: Ico }) => (
              <NavLink key={to} to={to} className={linkClass} end={end} onClick={() => setMenuOpen(false)}>
                <Ico aria-hidden />
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="nav-drawer-tools">
            <button type="button" className="button nav-drawer-search" onClick={goSearch}>
              <HiOutlineMagnifyingGlass size={20} />
              Cari artikel
            </button>
          </div>
        </div>
      </div>
      {menuOpen && <button type="button" className="nav-backdrop" aria-label="Tutup menu" onClick={() => setMenuOpen(false)} />}
    </header>
  )
}
