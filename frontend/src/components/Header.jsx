import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const isAuthenticated = false // TODO: Implement auth state

  return (
    <header style={{
      background: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(12px)',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <div className="container">
        <div className="flex items-center justify-between" style={{ height: '64px' }}>
          {/* Logo */}
          <Link to="/" style={{
            fontSize: '18px',
            fontWeight: '600',
            color: 'var(--black)',
            textDecoration: 'none'
          }}>
            Blogio
          </Link>

          {/* Desktop Navigation */}
          <nav className="flex items-center gap-8 hidden-mobile">
            <Link to="/" style={{
              color: 'var(--gray-600)',
              fontSize: '14px',
              fontWeight: '500',
              textDecoration: 'none',
              transition: 'color 0.15s ease'
            }}
            onMouseEnter={(e) => e.target.style.color = 'var(--black)'}
            onMouseLeave={(e) => e.target.style.color = 'var(--gray-600)'}
            >
              Home
            </Link>
            <Link to="/posts" style={{
              color: 'var(--gray-600)',
              fontSize: '14px',
              fontWeight: '500',
              textDecoration: 'none',
              transition: 'color 0.15s ease'
            }}
            onMouseEnter={(e) => e.target.style.color = 'var(--black)'}
            onMouseLeave={(e) => e.target.style.color = 'var(--gray-600)'}
            >
              Articles
            </Link>
            <Link to="/about" style={{
              color: 'var(--gray-600)',
              fontSize: '14px',
              fontWeight: '500',
              textDecoration: 'none',
              transition: 'color 0.15s ease'
            }}
            onMouseEnter={(e) => e.target.style.color = 'var(--black)'}
            onMouseLeave={(e) => e.target.style.color = 'var(--gray-600)'}
            >
              About
            </Link>
            
            <div style={{ width: '1px', height: '20px', background: 'var(--gray-200)' }}></div>
            
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link to="/create" className="btn btn-primary">
                  Write
                </Link>
                <button className="btn btn-ghost">Profile</button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="btn btn-ghost">
                  Sign in
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Sign up
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="btn btn-ghost hidden-desktop"
            style={{ padding: '8px' }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="hidden-desktop" style={{
            paddingTop: '16px',
            paddingBottom: '16px'
          }}>
            <nav className="flex flex-col gap-4">
              <Link to="/" onClick={() => setMobileMenuOpen(false)} style={{
                color: 'var(--gray-600)',
                fontSize: '14px',
                fontWeight: '500',
                padding: '8px 0'
              }}>
                Home
              </Link>
              <Link to="/posts" onClick={() => setMobileMenuOpen(false)} style={{
                color: 'var(--gray-600)',
                fontSize: '14px',
                fontWeight: '500',
                padding: '8px 0'
              }}>
                Articles
              </Link>
              <Link to="/about" onClick={() => setMobileMenuOpen(false)} style={{
                color: 'var(--gray-600)',
                fontSize: '14px',
                fontWeight: '500',
                padding: '8px 0'
              }}>
                About
              </Link>
              
              <div style={{ height: '1px', background: 'var(--gray-100)', margin: '8px 0' }}></div>
              
              {isAuthenticated ? (
                <div className="flex flex-col gap-2">
                  <Link to="/create" className="btn btn-primary" onClick={() => setMobileMenuOpen(false)}>
                    Write
                  </Link>
                  <button className="btn btn-secondary">Profile</button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link to="/login" className="btn btn-secondary" onClick={() => setMobileMenuOpen(false)}>
                    Sign in
                  </Link>
                  <Link to="/register" className="btn btn-primary" onClick={() => setMobileMenuOpen(false)}>
                    Sign up
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header