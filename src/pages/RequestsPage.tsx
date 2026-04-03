import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  EnvelopeSimple, VideoCamera, Phone, Clock, Check,
  CalendarBlank, ListChecks, ArrowRight, Bell, Sparkle,
  Warning, CaretLeft, CaretRight, Circle,
} from '@phosphor-icons/react'
import { Nav } from '../components/Nav'
import { PrototypeBanner } from '../components/shared/PrototypeBanner'

/* ─── Types ─── */
type RequestMode = 'async' | 'sync'
type RequestStatus = 'pending' | 'in-progress' | 'overdue' | 'complete'

interface CommsRequest {
  id: string
  title: string
  from: string
  fromInitials: string
  fromColor: string
  mode: RequestMode
  status: RequestStatus
  summary: string
  estimatedTime: string
  // Async
  dueDate?: string
  dueDateDisplay?: string
  dueDayIndex?: number // 0=Mon … 6=Sun for calendar placement
  // Sync
  meetingDate?: string
  meetingTime?: string
  meetingDayIndex?: number
  meetingHour?: number // 24h for calendar row
  meetingDuration?: number // minutes
  channel?: string
}

/* ─── Mock data — week of Jan 13 2025 ─── */
const REQUESTS: CommsRequest[] = [
  {
    id: 'r1',
    title: 'Engineering Screen',
    from: 'Stacked HR',
    fromInitials: 'SH',
    fromColor: 'from-violet-500 to-indigo-500',
    mode: 'async',
    status: 'pending',
    summary: 'Structured 20-minute technical screen. 5 sections: system design, problem-solving, communication, collaboration, culture fit.',
    estimatedTime: '20 min',
    dueDate: 'Jan 15',
    dueDateDisplay: 'Wed Jan 15',
    dueDayIndex: 2,
  },
  {
    id: 'r2',
    title: 'COI Renewal — Harbor Health',
    from: 'Harbor Health Supply',
    fromInitials: 'HH',
    fromColor: 'from-teal-500 to-green-500',
    mode: 'async',
    status: 'overdue',
    summary: 'Upload your updated Certificate of Insurance. Required: GL coverage ≥ $2M, Harbor Health as additional insured.',
    estimatedTime: '10 min',
    dueDate: 'Jan 10',
    dueDateDisplay: 'Overdue · was Jan 10',
    dueDayIndex: 0,
  },
  {
    id: 'r3',
    title: 'Q4 Product Training',
    from: 'Helix CRM Enablement',
    fromInitials: 'HC',
    fromColor: 'from-blue-500 to-cyan-500',
    mode: 'async',
    status: 'in-progress',
    summary: 'Complete the Q4 pipeline feature module and pass the knowledge check (≥80%) to maintain your certification.',
    estimatedTime: '25 min',
    dueDate: 'Jan 18',
    dueDateDisplay: 'Sat Jan 18',
    dueDayIndex: 5,
  },
  {
    id: 'r4',
    title: 'Benefits Open Enrollment',
    from: 'People Ops',
    fromInitials: 'PO',
    fromColor: 'from-pink-500 to-rose-500',
    mode: 'async',
    status: 'pending',
    summary: 'Review your 2025 plan options, compare coverage and costs, ask questions, and submit your election. Deadline is firm.',
    estimatedTime: '15 min',
    dueDate: 'Jan 31',
    dueDateDisplay: 'Jan 31',
    dueDayIndex: 4,
  },
  {
    id: 'r5',
    title: 'Sales Role-play Session',
    from: 'Sales Enablement',
    fromInitials: 'SE',
    fromColor: 'from-orange-500 to-amber-500',
    mode: 'sync',
    status: 'pending',
    summary: 'Live 30-min objection handling drill. Scenario: enterprise prospect pushing back on price. Scored against your Q3 rubric.',
    estimatedTime: '30 min',
    meetingDate: 'Thu Jan 16',
    meetingTime: '2:00 PM',
    meetingDayIndex: 3,
    meetingHour: 14,
    meetingDuration: 30,
    channel: 'Phone',
  },
  {
    id: 'r6',
    title: 'Client Discovery — NexGen Health',
    from: 'CS Team',
    fromInitials: 'CS',
    fromColor: 'from-green-600 to-emerald-500',
    mode: 'sync',
    status: 'pending',
    summary: 'Pre-kickoff discovery session. Agenda: goals, stakeholders, constraints, success criteria. You\'re the primary point of contact.',
    estimatedTime: '45 min',
    meetingDate: 'Fri Jan 17',
    meetingTime: '10:00 AM',
    meetingDayIndex: 4,
    meetingHour: 10,
    meetingDuration: 45,
    channel: 'Video',
  },
  {
    id: 'r7',
    title: 'Policy Attestation — Data Privacy',
    from: 'Legal & Compliance',
    fromInitials: 'LC',
    fromColor: 'from-red-500 to-rose-600',
    mode: 'async',
    status: 'complete',
    summary: 'Review the updated data privacy policy and sign your attestation. Required for all full-time employees annually.',
    estimatedTime: '12 min',
    dueDate: 'Jan 8',
    dueDateDisplay: 'Completed Jan 9',
    dueDayIndex: 1,
  },
  {
    id: 'r8',
    title: 'Weekly Standup Check-in',
    from: 'Team Ops (recurring)',
    fromInitials: 'TO',
    fromColor: 'from-gray-500 to-slate-600',
    mode: 'async',
    status: 'pending',
    summary: 'This week\'s status: What did you ship? What\'s blocked? What\'s your focus for the rest of the week?',
    estimatedTime: '5 min',
    dueDate: 'Jan 17',
    dueDateDisplay: 'Fri Jan 17 · recurring',
    dueDayIndex: 4,
  },
]

/* ─── Helpers ─── */
const STATUS_STYLE: Record<RequestStatus, string> = {
  'pending': 'bg-gray-100 text-gray-600',
  'in-progress': 'bg-blue-50 text-blue-700',
  'overdue': 'bg-red-50 text-red-600',
  'complete': 'bg-green-50 text-green-700',
}
const STATUS_LABEL: Record<RequestStatus, string> = {
  'pending': 'Pending',
  'in-progress': 'In progress',
  'overdue': 'Overdue',
  'complete': 'Complete',
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]
const HOUR_LABELS: Record<number, string> = { 8: '8 AM', 9: '9 AM', 10: '10 AM', 11: '11 AM', 12: '12 PM', 13: '1 PM', 14: '2 PM', 15: '3 PM', 16: '4 PM', 17: '5 PM', 18: '6 PM' }
const CELL_H = 56 // px per hour row

/* ─── Request card (list view) ─── */
function RequestCard({ r }: { r: CommsRequest }) {
  const ModeIcon = r.mode === 'sync' ? (r.channel === 'Video' ? VideoCamera : Phone) : EnvelopeSimple
  const isOverdue = r.status === 'overdue'
  const isComplete = r.status === 'complete'

  return (
    <div className={`bg-white rounded-2xl border transition-all ${isOverdue ? 'border-red-200' : isComplete ? 'border-gray-100 opacity-60' : 'border-gray-200 hover:border-brand-indigo/30 hover:shadow-sm'}`}>
      <div className="px-5 py-4 flex items-start gap-4">
        {/* Avatar */}
        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${r.fromColor} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
          {r.fromInitials}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-gray-900 text-sm">{r.title}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_STYLE[r.status]}`}>{STATUS_LABEL[r.status]}</span>
              </div>
              <div className="text-xs text-gray-400 mt-0.5">{r.from}</div>
            </div>
            <div className={`flex items-center gap-1 text-xs font-semibold shrink-0 ${r.mode === 'sync' ? 'text-brand-indigo' : 'text-gray-500'}`}>
              <ModeIcon size={11} />
              {r.mode === 'sync' ? r.meetingDate : r.dueDateDisplay}
            </div>
          </div>

          <p className="text-sm text-gray-500 mt-2 leading-relaxed line-clamp-2">{r.summary}</p>

          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Clock size={11} /> {r.estimatedTime}
            </div>
            {r.mode === 'sync' && r.meetingTime && (
              <div className="flex items-center gap-1 text-xs text-brand-indigo font-semibold">
                <CalendarBlank size={11} /> {r.meetingTime}
              </div>
            )}
            {!isComplete && (
              <Link to={r.mode === 'async' ? '/app/async' : '/app/sync'}
                className={`ml-auto text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${isOverdue ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-brand-indigo text-white hover:bg-brand-light'}`}>
                {r.mode === 'sync' ? 'Join session' : 'Complete now'} →
              </Link>
            )}
            {isComplete && (
              <div className="ml-auto flex items-center gap-1 text-xs text-green-600 font-semibold">
                <Check size={11} weight="bold" /> Done
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Calendar view ─── */
function CalendarView() {
  const syncRequests = REQUESTS.filter(r => r.mode === 'sync' && r.meetingDayIndex !== undefined)
  const asyncRequests = REQUESTS.filter(r => r.mode === 'async' && r.dueDayIndex !== undefined && r.status !== 'complete')

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      {/* Day headers */}
      <div className="grid border-b border-gray-100" style={{ gridTemplateColumns: '56px repeat(7, 1fr)' }}>
        <div className="border-r border-gray-100" />
        {DAYS.map((d, i) => (
          <div key={d} className={`text-center py-3 border-r border-gray-100 last:border-r-0 ${i === 3 ? 'bg-brand-ghost' : ''}`}>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">{d}</div>
            <div className={`text-base font-bold mt-0.5 ${i === 3 ? 'text-brand-indigo' : 'text-gray-900'}`}>{12 + i}</div>
          </div>
        ))}
      </div>

      {/* Async deadline row */}
      <div className="grid border-b border-gray-100 bg-orange-50/50" style={{ gridTemplateColumns: '56px repeat(7, 1fr)' }}>
        <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider flex items-center justify-center px-1 border-r border-gray-100">
          <span className="rotate-[-90deg]">Due</span>
        </div>
        {DAYS.map((_, i) => {
          const dayRequests = asyncRequests.filter(r => r.dueDayIndex === i)
          return (
            <div key={i} className={`min-h-[40px] border-r border-gray-100 last:border-r-0 p-1 ${i === 3 ? 'bg-brand-ghost/30' : ''}`}>
              {dayRequests.map(r => (
                <div key={r.id} className={`text-[10px] font-semibold px-1.5 py-0.5 rounded mb-0.5 truncate ${r.status === 'overdue' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-700'}`}>
                  {r.title}
                </div>
              ))}
            </div>
          )
        })}
      </div>

      {/* Time grid */}
      <div className="relative overflow-hidden" style={{ height: `${HOURS.length * CELL_H}px` }}>
        {/* Hour rows */}
        {HOURS.map((h, hi) => (
          <div key={h} className="grid absolute w-full border-b border-gray-50" style={{ gridTemplateColumns: '56px repeat(7, 1fr)', top: `${hi * CELL_H}px`, height: `${CELL_H}px` }}>
            <div className="text-[10px] text-gray-300 font-semibold px-2 pt-1 border-r border-gray-100">{HOUR_LABELS[h]}</div>
            {DAYS.map((_, i) => (
              <div key={i} className={`border-r border-gray-50 last:border-r-0 ${i === 3 ? 'bg-brand-ghost/10' : ''}`} />
            ))}
          </div>
        ))}

        {/* Sync session blocks */}
        {syncRequests.map(r => {
          if (r.meetingHour === undefined || r.meetingDayIndex === undefined) return null
          const topOffset = (r.meetingHour - 8) * CELL_H
          const height = ((r.meetingDuration ?? 30) / 60) * CELL_H

          const ModeIcon = r.channel === 'Video' ? VideoCamera : Phone

          return (
            <div key={r.id}
              className="absolute rounded-xl overflow-hidden cursor-pointer hover:brightness-95 transition-all z-10"
              style={{
                top: `${topOffset + 2}px`,
                height: `${height - 4}px`,
                left: `calc(56px + ${r.meetingDayIndex * (100 / 7)}% + 2px)`,
                width: `calc(${100 / 7}% - 10px)`,
              }}>
              <div className={`h-full bg-gradient-to-br ${r.fromColor} p-2`}>
                <div className="flex items-center gap-1 mb-0.5">
                  <ModeIcon size={9} className="text-white/80" weight="bold" />
                  <span className="text-[9px] font-bold text-white/80 uppercase tracking-wider">Sync · {r.meetingTime}</span>
                </div>
                <div className="text-xs font-bold text-white leading-tight truncate">{r.title}</div>
                <div className="text-[9px] text-white/60 truncate">{r.from}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ─── Main page ─── */
export function RequestsPage() {
  const [view, setView] = useState<'list' | 'calendar'>('list')
  const [filter, setFilter] = useState<'all' | 'async' | 'sync' | 'overdue'>('all')

  const overdue = REQUESTS.filter(r => r.status === 'overdue')
  const pending = REQUESTS.filter(r => r.status === 'pending' || r.status === 'in-progress')
  const complete = REQUESTS.filter(r => r.status === 'complete')

  const filtered = filter === 'all' ? REQUESTS
    : filter === 'async' ? REQUESTS.filter(r => r.mode === 'async')
    : filter === 'sync' ? REQUESTS.filter(r => r.mode === 'sync')
    : REQUESTS.filter(r => r.status === 'overdue')

  const sections = view === 'list' ? [
    { label: 'Overdue', items: filtered.filter(r => r.status === 'overdue'), accent: 'text-red-500' },
    { label: 'Up next', items: filtered.filter(r => r.status === 'pending' || r.status === 'in-progress'), accent: 'text-gray-700' },
    { label: 'Completed', items: filtered.filter(r => r.status === 'complete'), accent: 'text-gray-400' },
  ].filter(s => s.items.length > 0) : []

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB]">
      <Nav />

      {/* Header */}
      <div className="bg-white border-b border-gray-100 pt-20 pb-0 px-6">
        <div className="max-w-[1100px] mx-auto">
          <div className="flex items-end justify-between pb-4 pt-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Requests</h1>
              <p className="text-sm text-gray-400 mt-0.5">
                {pending.length} pending · {overdue.length > 0 ? <span className="text-red-500 font-semibold">{overdue.length} overdue · </span> : null}{complete.length} complete
              </p>
            </div>

            {/* View toggle */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
              <button onClick={() => setView('list')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${view === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>
                <ListChecks size={14} /> List
              </button>
              <button onClick={() => setView('calendar')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${view === 'calendar' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>
                <CalendarBlank size={14} /> Calendar
              </button>
            </div>
          </div>

          {/* Stats strip */}
          <div className="flex gap-3 pb-4">
            {[
              { label: 'Async requests', value: REQUESTS.filter(r => r.mode === 'async').length, icon: EnvelopeSimple, color: 'text-gray-700' },
              { label: 'Sync sessions', value: REQUESTS.filter(r => r.mode === 'sync').length, icon: VideoCamera, color: 'text-brand-indigo' },
              { label: 'Overdue', value: overdue.length, icon: Warning, color: 'text-red-500' },
              { label: 'This week', value: REQUESTS.filter(r => r.status !== 'complete').length, icon: CalendarBlank, color: 'text-gray-700' },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2">
                <s.icon size={13} className={s.color} />
                <span className={`text-sm font-bold ${s.color}`}>{s.value}</span>
                <span className="text-xs text-gray-400">{s.label}</span>
              </div>
            ))}
          </div>

          {/* Filter pills (list view only) */}
          {view === 'list' && (
            <div className="flex gap-1.5 pb-0 border-t border-gray-100 pt-3">
              {([
                { id: 'all', label: 'All' },
                { id: 'async', label: 'Async' },
                { id: 'sync', label: 'Sync' },
                { id: 'overdue', label: 'Overdue' },
              ] as const).map(f => (
                <button key={f.id} onClick={() => setFilter(f.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all mb-3 ${filter === f.id ? 'bg-brand-indigo text-white border-brand-indigo' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}>
                  {f.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 max-w-[1100px] mx-auto w-full px-6 py-6">

        {view === 'list' ? (
          <div className="space-y-6">
            {sections.map(section => (
              <div key={section.label}>
                <div className={`text-xs font-bold uppercase tracking-wider mb-3 ${section.accent}`}>{section.label} · {section.items.length}</div>
                <div className="space-y-2">
                  {section.items.map(r => <RequestCard key={r.id} r={r} />)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>
            {/* Calendar nav */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <button className="p-1.5 rounded-lg border border-gray-200 hover:border-gray-300 text-gray-400"><CaretLeft size={14} /></button>
                <span className="text-sm font-bold text-gray-900">Week of Jan 13, 2025</span>
                <button className="p-1.5 rounded-lg border border-gray-200 hover:border-gray-300 text-gray-400"><CaretRight size={14} /></button>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-orange-100 border border-orange-200" /><span className="text-gray-500">Async deadline</span></div>
                <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-gradient-to-br from-violet-500 to-indigo-500" /><span className="text-gray-500">Sync session</span></div>
              </div>
            </div>
            <CalendarView />
          </div>
        )}

        {/* Concept explainer */}
        <div className="mt-8 bg-brand-shaft rounded-2xl px-6 py-6">
          <div className="flex items-start gap-4 mb-5">
            <div className="w-10 h-10 rounded-xl bg-brand-indigo flex items-center justify-center shrink-0">
              <Sparkle size={16} weight="fill" className="text-white" />
            </div>
            <div>
              <div className="font-bold text-white text-lg mb-1">What is a Comms Request?</div>
              <p className="text-sm text-white/60 leading-relaxed max-w-2xl">
                When someone dispatches a Comms session to you, it appears here as a request — structured, time-aware, and with everything you need to complete it. Not an email. Not a Slack message. A clear task with context, deadline or meeting time, and a defined outcome.
              </p>
            </div>
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              {
                icon: <EnvelopeSimple size={14} className="text-orange-400" />,
                label: 'Async requests',
                desc: 'Complete at your pace — before the due date. A structured conversation waits for you whenever you\'re ready.',
              },
              {
                icon: <VideoCamera size={14} className="text-brand-pale" />,
                label: 'Sync sessions',
                desc: 'Appear as calendar blocks at a specific time. A live agent-led session runs at that moment.',
              },
              {
                icon: <Bell size={14} className="text-yellow-400" />,
                label: 'Automatic follow-ups',
                desc: 'If you don\'t act, Comms follows up automatically — so nothing falls through the cracks on either side.',
              },
            ].map(c => (
              <div key={c.label} className="bg-white/5 border border-white/10 rounded-xl px-4 py-4">
                <div className="flex items-center gap-2 mb-2">
                  {c.icon}
                  <span className="text-xs font-bold text-white uppercase tracking-wider">{c.label}</span>
                </div>
                <p className="text-xs text-white/50 leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Delegation angle */}
        <div className="mt-4 grid sm:grid-cols-2 gap-4">
          <div className="bg-white border border-gray-200 rounded-2xl px-5 py-5">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Circle size={10} weight="fill" className="text-brand-indigo" /> For the person assigning
            </div>
            <p className="text-sm text-gray-600 leading-relaxed mb-3">
              Instead of a Slack message ("hey can you do X by Friday?"), you dispatch a Comms session. The recipient gets a structured request with context, clear ask, and deadline — and you get completion tracking, follow-up automation, and a structured response when they're done.
            </p>
            <Link to="/app/dispatcher" className="text-xs font-semibold text-brand-indigo flex items-center gap-1 hover:text-brand-light transition-colors">
              Dispatch a request <ArrowRight size={11} weight="bold" />
            </Link>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl px-5 py-5">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Circle size={10} weight="fill" className="text-orange-500" /> For the person completing
            </div>
            <p className="text-sm text-gray-600 leading-relaxed mb-3">
              Instead of searching through email or Slack to find what you need to do, your Comms requests are in one place — sortable, filterable, with context attached. Sync sessions block your calendar. Async tasks show due dates. Nothing gets lost.
            </p>
            <div className="text-xs text-gray-400">This view — your Requests inbox — is what that looks like.</div>
          </div>
        </div>

      </div>

      <PrototypeBanner
        title="Prototype: Requests"
        description="The recipient-side of Comms — incoming tasks, sync sessions, and async deadlines in a list and calendar view."
      />
    </div>
  )
}
