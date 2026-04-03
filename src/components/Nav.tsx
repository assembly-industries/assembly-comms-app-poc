import { Link, useLocation } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import { List, X, CaretDown } from '@phosphor-icons/react'
import { LogoVoiceWaveIcon } from '../pages/LogoOptionsPage'

const navLinks = [
  { label: 'How It Works', href: '/#modes' },
  { label: 'Use Cases', href: '/use-cases' },
]

const coreLinks = [
  { label: 'Dispatcher', href: '/app/dispatcher' },
  { label: 'Live Call', href: '/app/sync' },
  { label: 'Async Chat', href: '/app/async' },
  { label: 'Sessions', href: '/app/sessions' },
  { label: 'Contacts', href: '/app/contacts' },
]

const moreLinks = [
  { label: 'ICP Explorer', href: '/app/icp' },
  { label: 'Push vs Pull', href: '/app/push-pull' },
  { label: 'Session Viewer', href: '/app/session-viewer' },
  { label: 'User Experience', href: '/app/user-experience' },
  { label: 'Daily Usage & PLG', href: '/app/daily-usage' },
]

const allProtoLinks = [...coreLinks, ...moreLinks]

export function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const moreRef = useRef<HTMLDivElement>(null)
  const location = useLocation()
  const isApp = location.pathname.startsWith('/app')

  // Close "More" dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const isMoreActive = moreLinks.some(l => location.pathname === l.href)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
      <div className="section-container">
        <div className="flex items-center justify-between h-14">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <LogoVoiceWaveIcon size={30} />
            <span className="font-bold text-gray-900 text-base tracking-tight" style={{ letterSpacing: '-0.02em' }}>Comms</span>
          </Link>

          {/* Marketing nav */}
          {!isApp && (
            <div className="hidden md:flex items-center gap-7">
              {navLinks.map(l => (
                l.href.startsWith('/') && !l.href.startsWith('/#')
                  ? <Link key={l.href} to={l.href} className="text-sm font-medium text-gray-400 hover:text-brand-indigo transition-colors">{l.label}</Link>
                  : <a key={l.href} href={l.href} className="text-sm font-medium text-gray-400 hover:text-brand-indigo transition-colors">{l.label}</a>
              ))}
              <Link to="/developer" className="text-sm font-medium text-gray-400 hover:text-brand-indigo transition-colors">Developers</Link>
            </div>
          )}

          {/* App nav */}
          {isApp && (
            <div className="hidden md:flex items-center gap-0.5">
              {coreLinks.map(l => (
                <Link key={l.href} to={l.href}
                  className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                    location.pathname === l.href
                      ? 'bg-brand-ghost text-brand-indigo'
                      : 'text-gray-400 hover:text-brand-indigo hover:bg-gray-50'
                  }`}>
                  {l.label}
                </Link>
              ))}

              {/* More dropdown */}
              <div ref={moreRef} className="relative">
                <button
                  onClick={() => setMoreOpen(v => !v)}
                  className={`flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                    isMoreActive || moreOpen
                      ? 'bg-brand-ghost text-brand-indigo'
                      : 'text-gray-400 hover:text-brand-indigo hover:bg-gray-50'
                  }`}>
                  More <CaretDown size={11} weight="bold" className={`transition-transform ${moreOpen ? 'rotate-180' : ''}`} />
                </button>

                {moreOpen && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-50">
                    {moreLinks.map(l => (
                      <Link key={l.href} to={l.href}
                        onClick={() => setMoreOpen(false)}
                        className={`block px-4 py-2.5 text-sm font-medium transition-colors ${
                          location.pathname === l.href
                            ? 'text-brand-indigo bg-brand-ghost'
                            : 'text-gray-600 hover:text-brand-indigo hover:bg-gray-50'
                        }`}>
                        {l.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            {isApp
              ? <Link to="/" className="text-sm font-medium text-gray-400 hover:text-brand-indigo transition-colors">← Back</Link>
              : <Link to="/app/dispatcher" className="btn-secondary py-2 text-sm">Open App</Link>
            }
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden p-1.5 text-gray-400" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={18} weight="bold" /> : <List size={18} weight="bold" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 space-y-1">
          {(isApp ? allProtoLinks : navLinks).map(l => (
            l.href.startsWith('/') && !l.href.startsWith('/#')
              ? <Link key={l.href} to={l.href} className="block text-sm font-medium text-gray-600 py-2 hover:text-brand-indigo" onClick={() => setMenuOpen(false)}>{l.label}</Link>
              : <a key={l.href} href={l.href} className="block text-sm font-medium text-gray-600 py-2 hover:text-brand-indigo" onClick={() => setMenuOpen(false)}>{l.label}</a>
          ))}
          {!isApp && (
            <Link to="/developer" className="block text-sm font-medium text-gray-600 py-2 hover:text-brand-indigo" onClick={() => setMenuOpen(false)}>Developers</Link>
          )}
          <div className="pt-3 border-t border-gray-100">
            <Link to="/app/dispatcher" className="btn-primary w-full justify-center text-sm" onClick={() => setMenuOpen(false)}>Open App</Link>
          </div>
        </div>
      )}
    </nav>
  )
}
