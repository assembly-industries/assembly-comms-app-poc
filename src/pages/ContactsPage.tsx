import { useState, useMemo } from 'react'
import {
  MagnifyingGlass, Sparkle, Clock, Users, ArrowRight,
  EnvelopeSimple, DeviceMobileCamera, Phone,
  ChatTeardropText as _ChatTeardropText,
  Plus, X,
} from '@phosphor-icons/react'
import { Link } from 'react-router-dom'
import { Nav } from '../components/Nav'
import { PrototypeBanner } from '../components/shared/PrototypeBanner'

/* ─── Types ─── */
type EngagementScore = 'A' | 'B' | 'C' | 'D'
type ContactStatus = 'active' | 'inactive' | 'flagged'
interface ContactSession { id: string; title: string; date: string; status: 'complete' | 'active' | 'exception'; outcome?: string }
interface Contact {
  id: string; name: string; email: string; phone: string
  company?: string; role?: string; tags: string[]
  status: ContactStatus; engagementScore: EngagementScore
  responseRate: number; avgResponseHours: number
  preferredChannel: 'email' | 'sms' | 'phone'
  bestTime: string
  sessionsTotal: number; sessionsCompleted: number
  lastActivity: string
  channelStats: { email: number; sms: number; phone: number }
  recentSessions: ContactSession[]
  aiInsight: string
}

/* ─── Mock data ─── */
const CONTACTS: Contact[] = [
  {
    id: 'c1', name: 'Alex Torres', email: 'alex.torres@constructiq.com', phone: '(512) 555-0182',
    company: 'ConstructIQ LLC', role: 'Operations Lead', tags: ['vendor', 'Q4', 'construction'],
    status: 'active', engagementScore: 'A', responseRate: 94, avgResponseHours: 2.8,
    preferredChannel: 'email', bestTime: 'Mon–Thu, 9–11 AM',
    sessionsTotal: 4, sessionsCompleted: 4, lastActivity: 'Jan 8, 2025',
    channelStats: { email: 96, sms: 70, phone: 88 },
    recentSessions: [
      { id: 's1', title: 'Vendor Onboarding — Q4 2024', date: 'Oct 12', status: 'complete', outcome: 'All docs collected & verified' },
      { id: 's2', title: 'COI Renewal — Jan 2025', date: 'Jan 8', status: 'complete', outcome: 'Policy renewed, new cert on file' },
    ],
    aiInsight: "Responds to 94% of first-touch emails within 3 hours. Highest engagement Mon–Tue mornings. Never needed more than 1 follow-up. SMS opens but rarely replies — use email.",
  },
  {
    id: 'c2', name: 'Maria Chen', email: 'mchen@vertexllc.io', phone: '(415) 555-0247',
    company: 'Vertex Solutions LLC', role: 'Principal Consultant', tags: ['vendor', 'engineering', 'Q1'],
    status: 'active', engagementScore: 'A', responseRate: 89, avgResponseHours: 5.1,
    preferredChannel: 'email', bestTime: 'Tue & Wed, 10 AM–12 PM',
    sessionsTotal: 3, sessionsCompleted: 3, lastActivity: 'Jan 12, 2025',
    channelStats: { email: 91, sms: 44, phone: 76 },
    recentSessions: [
      { id: 's3', title: 'Engineering Screen — Jan 2025', date: 'Jan 8', status: 'complete', outcome: '84/100 — Advance to final round' },
    ],
    aiInsight: "Strong responder -- replies within 5 hrs on average. Prefers email; phone works well for urgent follow-ups. Avoid SMS -- 44% open rate suggests she doesn't monitor that channel.",
  },
  {
    id: 'c3', name: 'James Park', email: 'james.park@pm.me', phone: '(628) 555-0039',
    role: 'Independent Contractor', tags: ['vendor', 'freelance'],
    status: 'active', engagementScore: 'B', responseRate: 77, avgResponseHours: 14.3,
    preferredChannel: 'sms', bestTime: 'Fri afternoons or weekends',
    sessionsTotal: 2, sessionsCompleted: 2, lastActivity: 'Dec 18, 2024',
    channelStats: { email: 65, sms: 88, phone: 60 },
    recentSessions: [
      { id: 's4', title: 'Vendor Onboarding — Q4 2024', date: 'Oct 14', status: 'complete', outcome: 'W-9 + NDA collected' },
    ],
    aiInsight: "James responds best to SMS (88% response rate vs 65% email). Typically replies on Friday afternoons or weekends. Takes 14 hrs on average -- give a 2-day window before first follow-up.",
  },
  {
    id: 'c4', name: 'Priya Nair', email: 'p.nair@harborhealthsupply.com', phone: '(718) 555-0091',
    company: 'Harbor Health Supply Co.', role: 'Procurement Manager', tags: ['vendor', 'supply chain', 'key account'],
    status: 'active', engagementScore: 'A', responseRate: 98, avgResponseHours: 1.4,
    preferredChannel: 'email', bestTime: 'Any weekday, 8 AM–5 PM',
    sessionsTotal: 7, sessionsCompleted: 7, lastActivity: 'Mar 1, 2025',
    channelStats: { email: 98, sms: 82, phone: 94 },
    recentSessions: [
      { id: 's5', title: 'Q1 Compliance Verification', date: 'Mar 1', status: 'complete', outcome: 'All 14 items PASS' },
      { id: 's6', title: 'Annual COI Renewal', date: 'Jan 15', status: 'complete', outcome: 'New certificate on file' },
    ],
    aiInsight: "Priya is your highest-engagement contact -- 98% response rate, avg reply in 84 minutes. All channels work equally well. Responds any weekday during business hours. No optimization needed.",
  },
  {
    id: 'c5', name: 'Kevin Okafor', email: 'kokafor@gmail.com', phone: '(202) 555-0318',
    role: 'Job Applicant', tags: ['candidate', 'engineering', 'Q1-hiring'],
    status: 'flagged', engagementScore: 'D', responseRate: 22, avgResponseHours: 72,
    preferredChannel: 'phone', bestTime: 'Unknown -- low engagement across all channels',
    sessionsTotal: 2, sessionsCompleted: 0, lastActivity: 'Jan 9, 2025',
    channelStats: { email: 20, sms: 28, phone: 42 },
    recentSessions: [
      { id: 's7', title: 'Engineering Screen — Jan 2025', date: 'Jan 9', status: 'exception', outcome: 'Closed after 3 follow-ups with no response' },
    ],
    aiInsight: "Kevin has not completed any sessions. Phone has the best (but still low) success rate at 42%. Exception was flagged after 3 unanswered follow-ups. Consider archiving if no response after direct outreach.",
  },
  {
    id: 'c6', name: 'Sofia Reyes', email: 'sofia.r@nexgenhealth.org', phone: '(305) 555-0574',
    company: 'NexGen Health Partners', role: 'Clinical Operations Dir.', tags: ['client', 'healthcare', 'enterprise'],
    status: 'active', engagementScore: 'B', responseRate: 81, avgResponseHours: 8.6,
    preferredChannel: 'email', bestTime: 'Wed & Thu, 2–5 PM',
    sessionsTotal: 3, sessionsCompleted: 2, lastActivity: 'Feb 28, 2025',
    channelStats: { email: 83, sms: 55, phone: 70 },
    recentSessions: [
      { id: 's8', title: 'Client Intake — Veridian Care', date: 'Feb 10', status: 'complete', outcome: 'Discovery complete, brief synced to CS' },
      { id: 's9', title: 'Enterprise Pilot Scope', date: 'Feb 28', status: 'active', outcome: undefined },
    ],
    aiInsight: "Sofia replies consistently on Wednesday and Thursday afternoons. Email is primary; she opens SMS but replies rarely. Prefers concise messages -- long session briefs get lower completion rates.",
  },
  {
    id: 'c7', name: 'Tom Walters', email: 'twalters@bridgewaterlaw.com', phone: '(312) 555-0882',
    company: 'Bridgewater Legal', role: 'Managing Partner', tags: ['vendor', 'legal', 'retainer'],
    status: 'inactive', engagementScore: 'C', responseRate: 61, avgResponseHours: 26.1,
    preferredChannel: 'phone', bestTime: 'Mon mornings before 10 AM',
    sessionsTotal: 4, sessionsCompleted: 2, lastActivity: 'Nov 30, 2024',
    channelStats: { email: 55, sms: 30, phone: 74 },
    recentSessions: [
      { id: 's10', title: 'Contract Review — Nov 2024', date: 'Nov 30', status: 'complete', outcome: 'Review complete, 2 redlines noted' },
      { id: 's11', title: 'NDA Batch — Oct 2024', date: 'Oct 5', status: 'exception', outcome: 'Escalated after 2 follow-ups -- completed via phone' },
    ],
    aiInsight: "Tom is responsive by phone (74%) but hard to reach by email. Monday mornings work best -- avoid Fridays. Consider calling first for time-sensitive sessions, using email as a backup record.",
  },
  {
    id: 'c8', name: 'Aisha Johnson', email: 'aisha.j@stackedhr.co', phone: '(646) 555-0431',
    company: 'Stacked HR', role: 'Head of People', tags: ['client', 'HR', 'hiring'],
    status: 'active', engagementScore: 'A', responseRate: 91, avgResponseHours: 4.2,
    preferredChannel: 'email', bestTime: 'Any weekday before 3 PM',
    sessionsTotal: 8, sessionsCompleted: 8, lastActivity: 'Mar 3, 2025',
    channelStats: { email: 93, sms: 66, phone: 82 },
    recentSessions: [
      { id: 's12', title: 'Candidate Screening — Warehouse Leads', date: 'Mar 3', status: 'active', outcome: undefined },
      { id: 's13', title: 'Support Hiring Loop', date: 'Feb 15', status: 'complete', outcome: '3 shortlisted, 2 advancing' },
    ],
    aiInsight: "Aisha is a power user -- 8 completed sessions, 91% response rate. She forwards Comms links to her team who then complete them. Fast responder any weekday before 3 PM. One of your most valuable contacts.",
  },
  {
    id: 'c9', name: 'Derek Mills', email: 'd.mills@independenttech.io', phone: '(503) 555-0217',
    role: 'Freelance Engineer', tags: ['candidate', 'engineering', 'backend'],
    status: 'active', engagementScore: 'B', responseRate: 83, avgResponseHours: 6.5,
    preferredChannel: 'email', bestTime: 'Evenings or weekends',
    sessionsTotal: 1, sessionsCompleted: 1, lastActivity: 'Jan 10, 2025',
    channelStats: { email: 85, sms: 78, phone: 50 },
    recentSessions: [
      { id: 's14', title: 'Engineering Screen — Jan 2025', date: 'Jan 10', status: 'complete', outcome: '79/100 — Hold' },
    ],
    aiInsight: "Derek typically responds in the evenings or on weekends -- likely working during business hours. Email and SMS both work well. Phone calls go unanswered. Give him a 24-hr window before follow-ups.",
  },
  {
    id: 'c10', name: 'Linda Zhao', email: 'lzhao@solarisegroup.com', phone: '(858) 555-0763',
    company: 'Solaris Group', role: 'Compliance Officer', tags: ['client', 'compliance', 'healthcare'],
    status: 'active', engagementScore: 'A', responseRate: 97, avgResponseHours: 2.1,
    preferredChannel: 'email', bestTime: 'Tue–Fri, 8 AM–12 PM',
    sessionsTotal: 5, sessionsCompleted: 5, lastActivity: 'Mar 5, 2025',
    channelStats: { email: 98, sms: 62, phone: 88 },
    recentSessions: [
      { id: 's15', title: 'SOC 2 Evidence Collection', date: 'Mar 5', status: 'complete', outcome: '40/40 items PASS — audit pack ready' },
      { id: 's16', title: 'Privacy DPIA Follow-ups', date: 'Feb 20', status: 'active', outcome: undefined },
    ],
    aiInsight: "Linda is extremely reliable -- 97% rate, replies in about 2 hours. Works best Tuesday through Friday mornings. Avoid Monday mornings (she attends all-hands). She uses email exclusively for work communication.",
  },
]

/* ─── Helpers ─── */
const scoreColor: Record<EngagementScore, string> = {
  A: 'bg-green-50 text-green-700 border-green-200',
  B: 'bg-blue-50 text-blue-700 border-blue-200',
  C: 'bg-orange-50 text-orange-700 border-orange-200',
  D: 'bg-red-50 text-red-700 border-red-200',
}
const statusColor: Record<ContactStatus, string> = {
  active: 'bg-green-400',
  inactive: 'bg-gray-300',
  flagged: 'bg-red-400',
}
const channelIcon = { email: EnvelopeSimple, sms: DeviceMobileCamera, phone: Phone }

function initials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

/* ─── Contact row ─── */
function ContactRow({ c, selected, onClick }: { c: Contact; selected: boolean; onClick: () => void }) {
  const Icon = channelIcon[c.preferredChannel]
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3.5 border-b border-gray-100 transition-colors flex items-center gap-3 ${selected ? 'bg-brand-ghost border-l-2 border-l-brand-indigo' : 'hover:bg-gray-50'}`}
    >
      {/* Avatar */}
      <div className="relative shrink-0">
        <div className="w-9 h-9 rounded-full bg-brand-indigo/10 flex items-center justify-center text-xs font-bold text-brand-indigo">{initials(c.name)}</div>
        <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${statusColor[c.status]}`} />
      </div>
      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-900 truncate">{c.name}</span>
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${scoreColor[c.engagementScore]}`}>{c.engagementScore}</span>
        </div>
        <div className="text-xs text-gray-400 truncate mt-0.5">{c.company ?? c.role}</div>
      </div>
      {/* Stats */}
      <div className="shrink-0 text-right">
        <div className="text-xs font-bold text-gray-700">{c.responseRate}%</div>
        <div className="flex items-center gap-0.5 justify-end mt-0.5">
          <Icon size={10} className="text-gray-400" />
          <span className="text-[10px] text-gray-400">{c.preferredChannel}</span>
        </div>
      </div>
    </button>
  )
}

/* ─── Contact detail panel ─── */
function ContactDetail({ c, onClose }: { c: Contact; onClose: () => void }) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="shrink-0 px-6 py-5 border-b border-gray-100">
        <div className="flex items-start gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-brand-indigo/10 flex items-center justify-center text-base font-bold text-brand-indigo">{initials(c.name)}</div>
            <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${statusColor[c.status]}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-bold text-gray-900 text-lg">{c.name}</h2>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${scoreColor[c.engagementScore]}`}>Score {c.engagementScore}</span>
            </div>
            {c.role && <div className="text-sm text-gray-500 mt-0.5">{c.role}{c.company ? ` · ${c.company}` : ''}</div>}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {c.tags.map(t => <span key={t} className="text-[11px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{t}</span>)}
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 shrink-0"><X size={16} /></button>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-gray-600">
            <EnvelopeSimple size={12} className="text-gray-400" />{c.email}
          </div>
          <div className="flex items-center gap-1.5 text-gray-600">
            <Phone size={12} className="text-gray-400" />{c.phone}
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-5 space-y-5">

          {/* Engagement metrics */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Response rate', value: `${c.responseRate}%`, sub: 'all time' },
              { label: 'Avg reply time', value: c.avgResponseHours >= 24 ? `${(c.avgResponseHours/24).toFixed(1)}d` : `${c.avgResponseHours}h`, sub: 'to first touch' },
              { label: 'Sessions', value: `${c.sessionsCompleted}/${c.sessionsTotal}`, sub: 'completed' },
            ].map(m => (
              <div key={m.label} className="bg-gray-50 rounded-xl px-3 py-2.5 text-center">
                <div className="text-lg font-bold text-gray-900">{m.value}</div>
                <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mt-0.5">{m.label}</div>
                <div className="text-[10px] text-gray-400">{m.sub}</div>
              </div>
            ))}
          </div>

          {/* AI Optimization insights */}
          <div className="bg-brand-shaft rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-lg bg-brand-indigo flex items-center justify-center">
                <Sparkle size={12} weight="fill" className="text-white" />
              </div>
              <span className="text-xs font-bold text-white uppercase tracking-wider">AI Optimization Insights</span>
            </div>
            <p className="text-sm text-white/80 leading-relaxed">{c.aiInsight}</p>
            <div className="mt-3 flex items-center gap-2 text-xs text-white/50">
              <Clock size={11} />
              <span>Best time to reach: <span className="text-white/80 font-semibold">{c.bestTime}</span></span>
            </div>
          </div>

          {/* Channel performance */}
          <div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Channel response rates</div>
            <div className="space-y-2">
              {(['email', 'sms', 'phone'] as const).map(ch => {
                const CIcon = channelIcon[ch]
                const rate = c.channelStats[ch]
                const isPreferred = c.preferredChannel === ch
                return (
                  <div key={ch} className="flex items-center gap-3">
                    <div className={`flex items-center gap-1.5 w-20 shrink-0 ${isPreferred ? 'text-brand-indigo' : 'text-gray-500'}`}>
                      <CIcon size={12} />
                      <span className="text-xs font-medium capitalize">{ch}</span>
                      {isPreferred && <span className="text-[9px] text-brand-indigo font-bold">✓</span>}
                    </div>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${rate >= 80 ? 'bg-green-400' : rate >= 60 ? 'bg-brand-indigo' : rate >= 40 ? 'bg-orange-400' : 'bg-red-300'}`}
                        style={{ width: `${rate}%` }} />
                    </div>
                    <span className="text-xs font-bold text-gray-700 w-8 shrink-0 text-right">{rate}%</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Session history */}
          <div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Session history</div>
            {c.recentSessions.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-4">No sessions yet.</p>
            ) : (
              <div className="space-y-2">
                {c.recentSessions.map(s => (
                  <div key={s.id} className="flex items-start gap-3 px-3.5 py-3 bg-white border border-gray-100 rounded-xl">
                    <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${s.status === 'complete' ? 'bg-green-400' : s.status === 'active' ? 'bg-brand-indigo animate-pulse' : 'bg-red-400'}`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-800 leading-snug truncate">{s.title}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{s.date}</div>
                      {s.outcome && <div className="text-xs text-gray-600 mt-1 italic">{s.outcome}</div>}
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${s.status === 'complete' ? 'bg-green-50 text-green-700' : s.status === 'active' ? 'bg-blue-50 text-blue-700' : 'bg-red-50 text-red-600'}`}>
                      {s.status === 'exception' ? 'Exception' : s.status === 'complete' ? 'Done' : 'Active'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="bg-brand-ghost rounded-2xl p-4">
            <div className="text-sm font-bold text-brand-shaft mb-1.5">Dispatch new comms to {c.name.split(' ')[0]}</div>
            <p className="text-xs text-gray-500 mb-3 leading-relaxed">
              Based on their history, best approach: <strong className="text-gray-700">{c.preferredChannel}</strong> on <strong className="text-gray-700">{c.bestTime}</strong>.
            </p>
            <Link to="/app/dispatcher" className="btn-primary text-xs py-2.5 w-full justify-center">
              Open Work Dispatcher <ArrowRight size={13} weight="bold" />
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}

/* ─── Main page ─── */
export function ContactsPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'flagged' | 'inactive'>('all')
  const [selected, setSelected] = useState<Contact | null>(CONTACTS[0])

  const filtered = useMemo(() => {
    let list = CONTACTS
    if (filter !== 'all') list = list.filter(c => c.status === filter)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.company?.toLowerCase().includes(q) ||
        c.role?.toLowerCase().includes(q) ||
        c.tags.some(t => t.includes(q))
      )
    }
    return list
  }, [search, filter])

  const avgResponseRate = Math.round(CONTACTS.reduce((a, c) => a + c.responseRate, 0) / CONTACTS.length)
  const activeCount = CONTACTS.filter(c => c.status === 'active').length
  const flaggedCount = CONTACTS.filter(c => c.status === 'flagged').length

  return (
    <div className="h-screen flex flex-col bg-[#F9FAFB]">
      <Nav />
      <div className="flex flex-1 min-h-0 overflow-hidden pt-14">

        {/* ── Left column: list ── */}
        <div className="w-80 bg-white border-r border-gray-100 flex flex-col shrink-0">

          {/* Header */}
          <div className="px-5 pt-5 pb-4 border-b border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="font-bold text-gray-900 text-lg">Contacts</div>
                <div className="text-xs text-gray-400 mt-0.5">{CONTACTS.length} people · {avgResponseRate}% avg response</div>
              </div>
              <button className="w-8 h-8 rounded-xl bg-brand-ghost flex items-center justify-center hover:bg-brand-secondary transition-colors">
                <Plus size={14} className="text-brand-indigo" />
              </button>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[
                { label: 'Active', value: activeCount, color: 'text-green-600' },
                { label: 'Avg response', value: `${avgResponseRate}%`, color: 'text-brand-indigo' },
                { label: 'Flagged', value: flaggedCount, color: 'text-red-500' },
              ].map(s => (
                <div key={s.label} className="bg-gray-50 rounded-xl px-2.5 py-2 text-center">
                  <div className={`text-base font-bold ${s.color}`}>{s.value}</div>
                  <div className="text-[10px] text-gray-400">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Search */}
            <div className="relative mb-3">
              <MagnifyingGlass size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search contacts..."
                className="w-full pl-8 pr-3 py-2.5 text-sm rounded-xl border border-gray-200 bg-white outline-none focus:border-brand-indigo/40 focus:ring-2 focus:ring-brand-indigo/10"
                style={{ boxShadow: 'none' }}
              />
            </div>

            {/* Filter pills */}
            <div className="flex gap-1.5">
              {(['all', 'active', 'flagged', 'inactive'] as const).map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors capitalize ${filter === f ? 'bg-brand-indigo text-white border-brand-indigo' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="text-center py-12 text-sm text-gray-400">No contacts match your search.</div>
            ) : (
              filtered.map(c => (
                <ContactRow key={c.id} c={c} selected={selected?.id === c.id} onClick={() => setSelected(c)} />
              ))
            )}
          </div>
        </div>

        {/* ── Right panel: detail ── */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {selected ? (
            <ContactDetail c={selected} onClose={() => setSelected(null)} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center px-12">
              <div className="w-14 h-14 rounded-2xl bg-brand-ghost flex items-center justify-center mb-4">
                <Users size={24} weight="duotone" className="text-brand-indigo" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">Select a contact</h3>
              <p className="text-sm text-gray-500 max-w-xs leading-relaxed">Click any contact to see their engagement profile, AI optimization insights, and session history.</p>
            </div>
          )}
        </div>
      </div>

      <PrototypeBanner
        title="Prototype: Contacts"
        description="Your comms network -- engagement scores, AI optimization insights, channel stats, and session history per person."
      />
    </div>
  )
}
