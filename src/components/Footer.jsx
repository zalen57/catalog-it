import { FaLinkedin } from 'react-icons/fa6'
import { SiGithub, SiX } from 'react-icons/si'
import { LIVE_SITE_URL, REPO_URL } from '../config/siteLinks.js'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <span>
          © {new Date().getFullYear()} IT Tech Catalog — React · Firebase · No PHP/SQL
          {' · '}
          <a href={LIVE_SITE_URL} target="_blank" rel="noreferrer">
            Live
          </a>
        </span>
        <span style={{ display: 'flex', gap: '0.75rem' }}>
          <a href={REPO_URL} target="_blank" rel="noreferrer" aria-label="GitHub repo">
            <SiGithub size={22} />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">
            <FaLinkedin size={22} />
          </a>
          <a href="https://x.com" target="_blank" rel="noreferrer" aria-label="X">
            <SiX size={20} />
          </a>
        </span>
      </div>
    </footer>
  )
}
