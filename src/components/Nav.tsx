import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { List, X } from '@phosphor-icons/react'
import { LogoVoiceWaveIcon } from '../pages/LogoOptionsPage'

const navLinks = [
  { label: 'How It Works', href: '/#modes' },
  { label: 'Use Cases', href: '/use-cases' },
]

const protoLinks = [
  { label: 'Dispatcher', href: '/app/dispatcher' },
  { label: 'Live Call', href: '/app/sync' },
  { label: 'Async Chat', href: '/app/async' },
  { label: 'Comms Sessions', href: '/app/sessions' },
  { label: 'Contacts', href: '/app/contacts' },
  { label: 'Session Viewer', href: '/app/session-viewer' },
  { label: 'User Experience', href: '/app/user-experience' },
  { label: 'Daily Usage', href: '/app/daily-usage' },
]

export function Nav() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const isApp = location.pathname.startsWith('/app')

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
      <div className="section-container">
        <div className="flex items-center justify-between h-14">
          <Link to="/" className="flex items-center gap-2 group">
            <LogoVoiceWaveIcon size={30} />
            <span className="font-bold text-gray-900 text-base tracking-tight" style={{ letterSpacing: '-0.02em' }}>Comms</span>
            <span className="text-xs font-semibold text-brand-light bg-brand-ghost px-2 py-0.5 rounded-full hidden sm:block">by Assembly</span>
          </Link>

          {!isApp && (
            <div className="hidden md:flex items-center gap-7">
              {navLinks.map(l => (
                l.href.startsWith('/') && !l.href.startsWith('/#')
                  ? <Link key={l.href} to={l.href} className="text-sm font-medium text-gray-400 hover:text-brand-indigo transition-colors">{l.label}</Link>
                  : <a key={l.href} href={l.href} className="text-sm font-medium text-gray-400 hover:text-brand-indigo transition-colors">{l.label}</a>
              ))}
              <Link to="/developer" className="text-sm font-medium text-gray-400 hover:text-brand-indigo transition-colors">
                Developers
              </Link>
            </div>
          )}

          {isApp && (
            <div className="hidden md:flex items-center gap-1">
              {protoLinks.map(l => (
                <Link
                  key={l.href}
                  to={l.href}
                  className={`text-sm font-medium px-3.5 py-1.5 rounded-lg transition-colors ${
                    location.pathname === l.href
                      ? 'bg-brand-ghost text-brand-indigo'
                      : 'text-gray-400 hover:text-brand-indigo hover:bg-gray-50'
                  }`}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          )}

          <div className="hidden md:flex items-center gap-3">
            {isApp
              ? <Link to="/" className="text-sm font-medium text-gray-400 hover:text-brand-indigo transition-colors">← Back to site</Link>
              : <>
                  <Link to="/app/dispatcher" className="btn-secondary py-2 text-sm">Open App</Link>
                </>
            }
          </div>

          <button className="md:hidden p-1.5 text-gray-400" onClick={() => setOpen(!open)}>
            {open ? <X size={18} weight="bold" /> : <List size={18} weight="bold" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 space-y-2">
          {(isApp ? protoLinks : navLinks).map(l => (
            l.href.startsWith('/') && !l.href.startsWith('/#')
              ? <Link key={l.href} to={l.href} className="block text-sm font-medium text-gray-600 py-1.5" onClick={() => setOpen(false)}>{l.label}</Link>
              : <a key={l.href} href={l.href} className="block text-sm font-medium text-gray-600 py-1.5" onClick={() => setOpen(false)}>{l.label}</a>
          ))}
          {!isApp && (
            <Link to="/developer" className="block text-sm font-medium text-gray-600 py-1.5" onClick={() => setOpen(false)}>Developers</Link>
          )}
          <div className="pt-3 border-t border-gray-100">
            <Link to="/app/dispatcher" className="btn-primary w-full justify-center text-sm" onClick={() => setOpen(false)}>Open App</Link>
          </div>
        </div>
      )}
    </nav>
  )
}
