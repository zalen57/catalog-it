import { FaLinkedin } from 'react-icons/fa6'
import { SiGithub, SiX } from 'react-icons/si'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <span>© {new Date().getFullYear()} IT Tech Catalog — React · Firebase · No PHP/SQL</span>
        <span style={{ display: 'flex', gap: '0.75rem' }}>
          <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub">
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
