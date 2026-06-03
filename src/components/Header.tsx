import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import './Header.css'

export function Header() {
  return (
    <header className="app-header">
      <div className="header-inner">
        <Link to="/" className="header-logo">
          <Heart className="logo-heart" fill="var(--seal)" stroke="var(--seal)" />
          <span>心连心</span>
        </Link>
        <nav className="header-nav">
          <Link to="/">留言板</Link>
          <Link to="/write" className="btn btn-seal">✉ 写信</Link>
        </nav>
      </div>
    </header>
  )
}
