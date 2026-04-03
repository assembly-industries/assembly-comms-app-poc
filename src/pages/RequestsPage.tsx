import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  EnvelopeSimple, VideoCamera, Phone, Clock, Check,
  CalendarBlank, ListChecks, ArrowRight, Bell, Sparkle,
  Warning, CaretLeft, CaretRight, Circle, MagnifyingGlass,
  X,
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
  blockColor: string   // tailwind bg class for calendar block
  tagColor: string     // for deadline tag
  mode: RequestMode
  status: RequestStatus
  summary: string
  estimatedTime: string
  dueDayIndex?: number      // 0=Mon … 6=Sun
  dueDateDisplay?: string
  meetingDayIndex?: number
  meetingHour?: number      // 24h
  meetingMinute?: number
  meetingDuration?: number  // minutes
  meetingTimeLabel?: string
  channel?: 'video' | 'phone'
}

/* ─── Extended mock data — week of Jan 13 2025 ─── */
const REQUESTS: CommsRequest[] = [
  // ── Sync sessions ──
  {
    id: 's1',
    title: 'Team Standup',
    from: 'Team Ops',
    fromInitials: 'TO',
    blockColor: 'bg-slate-500',
    tagColor: 'bg-slate-100 text-slate-700',
    mode: 'sync', status: 'pending',
    summary: 'Weekly async-to-sync standup. Blockers surfaced from last night\'s status collection, quick decisions needed.',
    estimatedTime: '15 min',
    meetingDayIndex: 0, meetingHour: 9, meetingMinute: 0, meetingDuration: 15,
    meetingTimeLabel: '9:00 AM', channel: 'video',
  },
  {
    id: 's2',
    title: 'Vendor Call — Atlas Supply',
    from: 'Operations',
    fromInitials: 'OP',
    blockColor: 'bg-brand-indigo',
    tagColor: 'bg-brand-ghost text-brand-indigo',
    mode: 'sync', status: 'pending',
    summary: 'Review Q1 contract renewal terms. Atlas requesting 8% price increase — need to negotiate before Jan 20 deadline.',
    estimatedTime: '30 min',
    meetingDayIndex: 0, meetingHour: 14, meetingMinute: 0, meetingDuration: 30,
    meetingTimeLabel: '2:00 PM', channel: 'phone',
  },
  {
    id: 's3',
    title: 'Engineering Screen — Maria Chen',
    from: 'Stacked HR',
    fromInitials: 'SH',
    blockColor: 'bg-violet-500',
    tagColor: 'bg-violet-100 text-violet-700',
    mode: 'sync', status: 'pending',
    summary: '30-min structured technical screen. System design + problem-solving + culture fit. Rubric-scored.',
    estimatedTime: '30 min',
    meetingDayIndex: 1, meetingHour: 10, meetingMinute: 0, meetingDuration: 30,
    meetingTimeLabel: '10:00 AM', channel: 'video',
  },
  {
    id: 's4',
    title: '1:1 Check-in',
    from: 'Maya Rodriguez',
    fromInitials: 'MR',
    blockColor: 'bg-teal-500',
    tagColor: 'bg-teal-100 text-teal-700',
    mode: 'sync', status: 'pending',
    summary: 'Monthly 1:1. Agenda pre-built from your last 30 days of sessions — goals, blockers, feedback.',
    estimatedTime: '30 min',
    meetingDayIndex: 1, meetingHour: 15, meetingMinute: 0, meetingDuration: 30,
    meetingTimeLabel: '3:00 PM', channel: 'video',
  },
  {
    id: 's5',
    title: 'Client Discovery — NexGen',
    from: 'CS Team',
    fromInitials: 'CS',
    blockColor: 'bg-green-600',
    tagColor: 'bg-green-100 text-green-700',
    mode: 'sync', status: 'pending',
    summary: 'Pre-kickoff discovery. Goals, stakeholders, constraints, success criteria. Primary point of contact.',
    estimatedTime: '45 min',
    meetingDayIndex: 2, meetingHour: 10, meetingMinute: 0, meetingDuration: 45,
    meetingTimeLabel: '10:00 AM', channel: 'video',
  },
  {
    id: 's6',
    title: 'Product Roadmap Review',
    from: 'Product Team',
    fromInitials: 'PT',
    blockColor: 'bg-cyan-600',
    tagColor: 'bg-cyan-100 text-cyan-700',
    mode: 'sync', status: 'pending',
    summary: 'Q1 roadmap alignment session. Prioritization decisions needed for 3 competing initiatives.',
    estimatedTime: '45 min',
    meetingDayIndex: 2, meetingHour: 14, meetingMinute: 30, meetingDuration: 45,
    meetingTimeLabel: '2:30 PM', channel: 'video',
  },
  {
    id: 's7',
    title: 'Sales Role-play Session',
    from: 'Sales Enablement',
    fromInitials: 'SE',
    blockColor: 'bg-orange-500',
    tagColor: 'bg-orange-100 text-orange-700',
    mode: 'sync', status: 'pending',
    summary: 'Live 30-min objection handling drill. Enterprise prospect pushing back on price. Scored against Q3 rubric.',
    estimatedTime: '30 min',
    meetingDayIndex: 3, meetingHour: 13, meetingMinute: 0, meetingDuration: 30,
    meetingTimeLabel: '1:00 PM', channel: 'phone',
  },
  {
    id: 's8',
    title: 'Client Strategy — NexGen',
    from: 'Account Management',
    fromInitials: 'AM',
    blockColor: 'bg-emerald-600',
    tagColor: 'bg-emerald-100 text-emerald-700',
    mode: 'sync', status: 'pending',
    summary: 'Quarterly strategy session. Q4 outcomes review + Q1 success plan. Decision needed on scope expansion.',
    estimatedTime: '60 min',
    meetingDayIndex: 3, meetingHour: 15, meetingMinute: 0, meetingDuration: 60,
    meetingTimeLabel: '3:00 PM', channel: 'video',
  },
  {
    id: 's9',
    title: 'Benefits Enrollment Q&A',
    from: 'People Ops',
    fromInitials: 'PO',
    blockColor: 'bg-pink-500',
    tagColor: 'bg-pink-100 text-pink-700',
    mode: 'sync', status: 'pending',
    summary: 'Optional live Q&A for employees with complex benefits questions before the Jan 31 deadline.',
    estimatedTime: '20 min',
    meetingDayIndex: 4, meetingHour: 11, meetingMinute: 0, meetingDuration: 20,
    meetingTimeLabel: '11:00 AM', channel: 'video',
  },
  {
    id: 's10',
    title: 'Sprint Retrospective',
    from: 'Engineering Team',
    fromInitials: 'ET',
    blockColor: 'bg-indigo-600',
    tagColor: 'bg-indigo-100 text-indigo-700',
    mode: 'sync', status: 'pending',
    summary: 'Sprint 24 retro. AI-generated agenda from the async retro survey responses collected Thursday.',
    estimatedTime: '45 min',
    meetingDayIndex: 4, meetingHour: 14, meetingMinute: 0, meetingDuration: 45,
    meetingTimeLabel: '2:00 PM', channel: 'video',
  },

  // ── Async requests ──
  {
    id: 'a1',
    title: 'Vendor NDA — Atlas Supply',
    from: 'Legal',
    fromInitials: 'LG',
    blockColor: 'bg-brand-indigo',
    tagColor: 'bg-brand-ghost text-brand-indigo',
    mode: 'async', status: 'pending',
    summary: 'Review and e-sign the updated NDA for Atlas Supply before the contract call Monday afternoon.',
    estimatedTime: '8 min',
    dueDayIndex: 0, dueDateDisplay: 'Mon Jan 13',
  },
  {
    id: 'a2',
    title: 'Engineering Screen',
    from: 'Stacked HR',
    fromInitials: 'SH',
    blockColor: 'bg-violet-500',
    tagColor: 'bg-violet-100 text-violet-700',
    mode: 'async', status: 'pending',
    summary: 'Structured 20-min technical screen. 5 dimensions, rubric-scored. Complete before the sync on Tue.',
    estimatedTime: '20 min',
    dueDayIndex: 1, dueDateDisplay: 'Tue Jan 14',
  },
  {
    id: 'a3',
    title: 'COI Renewal — Harbor Health',
    from: 'Harbor Health Supply',
    fromInitials: 'HH',
    blockColor: 'bg-red-500',
    tagColor: 'bg-red-100 text-red-600',
    mode: 'async', status: 'overdue',
    summary: 'Upload updated COI. Required: GL coverage ≥ $2M, Harbor Health as additional insured. Overdue.',
    estimatedTime: '10 min',
    dueDayIndex: 1, dueDateDisplay: '⚠ Overdue · Jan 10',
  },
  {
    id: 'a4',
    title: 'Security Awareness Training',
    from: 'IT & Security',
    fromInitials: 'IT',
    blockColor: 'bg-amber-600',
    tagColor: 'bg-amber-100 text-amber-700',
    mode: 'async', status: 'in-progress',
    summary: 'Annual security training module. Phishing, password hygiene, data handling. 15 min, knowledge check at end.',
    estimatedTime: '15 min',
    dueDayIndex: 2, dueDateDisplay: 'Wed Jan 15',
  },
  {
    id: 'a5',
    title: 'Candidate Feedback — Derek M.',
    from: 'Stacked HR',
    fromInitials: 'SH',
    blockColor: 'bg-violet-500',
    tagColor: 'bg-violet-100 text-violet-700',
    mode: 'async', status: 'pending',
    summary: 'Structured feedback on Derek Mills\' engineering screen. Rate 4 dimensions before Thu panel decision.',
    estimatedTime: '6 min',
    dueDayIndex: 3, dueDateDisplay: 'Thu Jan 16',
  },
  {
    id: 'a6',
    title: 'Q4 Product Training',
    from: 'Helix CRM Enablement',
    fromInitials: 'HC',
    blockColor: 'bg-cyan-600',
    tagColor: 'bg-cyan-100 text-cyan-700',
    mode: 'async', status: 'in-progress',
    summary: 'Complete the Q4 pipeline feature module and pass the knowledge check (≥80%) for certification.',
    estimatedTime: '25 min',
    dueDayIndex: 3, dueDateDisplay: 'Thu Jan 16',
  },
  {
    id: 'a7',
    title: 'Weekly Standup',
    from: 'Team Ops (recurring)',
    fromInitials: 'TO',
    blockColor: 'bg-slate-500',
    tagColor: 'bg-slate-100 text-slate-600',
    mode: 'async', status: 'pending',
    summary: 'This week\'s status: what did you ship? what\'s blocked? what\'s your focus for the rest of the week?',
    estimatedTime: '5 min',
    dueDayIndex: 4, dueDateDisplay: 'Fri Jan 17 · recurring',
  },
  {
    id: 'a8',
    title: 'Q1 Budget Attestation',
    from: 'Finance',
    fromInitials: 'FN',
    blockColor: 'bg-orange-500',
    tagColor: 'bg-orange-100 text-orange-700',
    mode: 'async', status: 'pending',
    summary: 'Confirm your Q1 budget allocations are correct and sign off before the finance close on Jan 17.',
    estimatedTime: '10 min',
    dueDayIndex: 4, dueDateDisplay: 'Fri Jan 17',
  },
  {
    id: 'a9',
    title: 'Benefits Open Enrollment',
    from: 'People Ops',
    fromInitials: 'PO',
    blockColor: 'bg-pink-500',
    tagColor: 'bg-pink-100 text-pink-700',
    mode: 'async', status: 'pending',
    summary: 'Review 2025 plan options, compare coverage, ask questions, and submit your election. Deadline is firm.',
    estimatedTime: '15 min',
    dueDayIndex: 5, dueDateDisplay: 'Jan 31 deadline',
  },
  {
    id: 'a10',
    title: 'Policy Attestation — Data Privacy',
    from: 'Legal & Compliance',
    fromInitials: 'LC',
    blockColor: 'bg-green-600',
    tagColor: 'bg-green-100 text-green-700',
    mode: 'async', status: 'complete',
    summary: 'Annual data privacy policy review and e-signature. Required for all full-time employees.',
    estimatedTime: '12 min',
    dueDayIndex: 0, dueDateDisplay: 'Completed Jan 9',
  },
]

/* ─── Constants ─── */
const DAYS = ['Mon 13', 'Tue 14', 'Wed 15', 'Thu 16', 'Fri 17', 'Sat 18', 'Sun 19']
const HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]
const HOUR_LABEL: Record<number, string> = { 8: '8 AM', 9: '9 AM', 10: '10 AM', 11: '11 AM', 12: '12 PM', 13: '1 PM', 14: '2 PM', 15: '3 PM', 16: '4 PM', 17: '5 PM', 18: '6 PM' }
const CELL_H = 64
const TODAY_IDX = 3 // Thu = "today" in our mock

const STATUS_STYLE: Record<RequestStatus, string> = {
  'pending': 'bg-gray-100 text-gray-600',
  'in-progress': 'bg-blue-50 text-blue-700',
  'overdue': 'bg-red-50 text-red-600',
  'complete': 'bg-green-50 text-green-700',
}
const STATUS_LABEL: Record<RequestStatus, string> = {
  'pending': 'Pending', 'in-progress': 'In progress', 'overdue': 'Overdue', 'complete': 'Complete',
}

/* ─── Request card (list view) ─── */
function RequestCard({ r }: { r: CommsRequest }) {
  const ModeIcon = r.mode === 'sync' ? (r.channel === 'video' ? VideoCamera : Phone) : EnvelopeSimple
  const isOverdue = r.status === 'overdue'
  const isComplete = r.status === 'complete'

  return (
    <div className={`bg-white rounded-2xl border transition-all ${isOverdue ? 'border-red-200 bg-red-50/30' : isComplete ? 'border-gray-100 opacity-55' : 'border-gray-200 hover:border-brand-indigo/30 hover:shadow-sm'}`}>
      <div className="px-5 py-3.5 flex items-start gap-4">
        <div className={`w-8 h-8 rounded-xl ${r.blockColor} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>
          {r.fromInitials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-gray-900 text-sm">{r.title}</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${STATUS_STYLE[r.status]}`}>{STATUS_LABEL[r.status]}</span>
              </div>
              <div className="text-xs text-gray-400 mt-0.5">{r.from}</div>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-400 shrink-0">
              <ModeIcon size={10} />
              <span>{r.mode === 'sync' ? r.meetingTimeLabel : r.dueDateDisplay}</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1.5 leading-relaxed line-clamp-1">{r.summary}</p>
          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center gap-1 text-[10px] text-gray-400"><Clock size={9} /> {r.estimatedTime}</div>
            {!isComplete && (
              <Link to={r.mode === 'async' ? '/app/async' : '/app/sync'}
                className={`ml-auto text-[10px] font-bold px-2.5 py-1 rounded-lg transition-colors ${isOverdue ? 'bg-red-500 text-white' : 'bg-brand-indigo text-white hover:bg-brand-light'}`}>
                {r.mode === 'sync' ? 'Join' : 'Complete'} →
              </Link>
            )}
            {isComplete && <div className="ml-auto text-[10px] text-green-600 font-semibold flex items-center gap-1"><Check size={9} weight="bold" /> Done</div>}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Calendar view ─── */
function CalendarView() {
  const syncReqs = REQUESTS.filter(r => r.mode === 'sync' && r.meetingDayIndex !== undefined)
  const asyncReqs = REQUESTS.filter(r => r.mode === 'async' && r.dueDayIndex !== undefined && r.status !== 'complete')

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden select-none">

      {/* Day header row */}
      <div className="grid border-b border-gray-100" style={{ gridTemplateColumns: '52px repeat(7, 1fr)' }}>
        <div className="border-r border-gray-100" />
        {DAYS.map((d, i) => (
          <div key={d} className={`border-r border-gray-100 last:border-r-0 text-center py-2 ${i === TODAY_IDX ? 'bg-brand-indigo' : ''}`}>
            <div className={`text-[10px] font-bold uppercase tracking-wider ${i === TODAY_IDX ? 'text-white/70' : 'text-gray-400'}`}>{d.slice(0, 3)}</div>
            <div className={`text-base font-bold mt-0.5 ${i === TODAY_IDX ? 'text-white' : 'text-gray-800'}`}>{d.slice(4)}</div>
          </div>
        ))}
      </div>

      {/* Async deadlines row — like Google Calendar "all-day" */}
      <div className="grid border-b border-gray-100 bg-gray-50/80" style={{ gridTemplateColumns: '52px repeat(7, 1fr)' }}>
        <div className="border-r border-gray-100 flex items-center justify-center">
          <span className="text-[9px] font-bold text-gray-300 uppercase tracking-wider" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>Due</span>
        </div>
        {Array.from({ length: 7 }, (_, i) => {
          const dayItems = asyncReqs.filter(r => r.dueDayIndex === i)
          return (
            <div key={i} className={`border-r border-gray-100 last:border-r-0 p-1 min-h-[36px] ${i === TODAY_IDX ? 'bg-brand-ghost/20' : ''}`}>
              {dayItems.map(r => (
                <div key={r.id} className={`text-[10px] font-semibold px-1.5 py-0.5 rounded mb-0.5 truncate flex items-center gap-1 ${r.status === 'overdue' ? 'bg-red-100 text-red-600' : r.tagColor}`}>
                  {r.status === 'overdue' && <Warning size={8} weight="fill" />}
                  {r.title}
                </div>
              ))}
            </div>
          )
        })}
      </div>

      {/* Time grid */}
      <div className="grid overflow-auto max-h-[480px]" style={{ gridTemplateColumns: '52px repeat(7, 1fr)' }}>

        {/* Hour labels */}
        <div className="border-r border-gray-100">
          {HOURS.map(h => (
            <div key={h} className="flex items-start justify-end pr-2 pt-1" style={{ height: `${CELL_H}px` }}>
              <span className="text-[10px] text-gray-300 font-semibold">{HOUR_LABEL[h]}</span>
            </div>
          ))}
        </div>

        {/* Day columns */}
        {Array.from({ length: 7 }, (_, dayIdx) => {
          const daySessions = syncReqs.filter(r => r.meetingDayIndex === dayIdx)
          return (
            <div key={dayIdx} className={`relative border-r border-gray-100 last:border-r-0 ${dayIdx === TODAY_IDX ? 'bg-brand-ghost/10' : ''}`}
              style={{ height: `${HOURS.length * CELL_H}px` }}>

              {/* Hour grid lines */}
              {HOURS.map((_, hi) => (
                <div key={hi} className="absolute w-full border-b border-gray-50" style={{ top: `${hi * CELL_H}px`, height: `${CELL_H}px` }} />
              ))}

              {/* Today line (Thu = dayIdx 3, ~10:30 AM) */}
              {dayIdx === TODAY_IDX && (
                <div className="absolute w-full flex items-center z-20" style={{ top: `${(10.5 - 8) * CELL_H}px` }}>
                  <div className="w-2 h-2 rounded-full bg-red-400 -ml-1 shrink-0" />
                  <div className="flex-1 h-px bg-red-400" />
                </div>
              )}

              {/* Sync session blocks */}
              {daySessions.map(r => {
                const startFrac = (r.meetingHour! - 8) + (r.meetingMinute ?? 0) / 60
                const durFrac = (r.meetingDuration ?? 30) / 60
                const top = startFrac * CELL_H
                const height = Math.max(durFrac * CELL_H - 3, 28)
                const ChanIcon = r.channel === 'video' ? VideoCamera : Phone

                return (
                  <div key={r.id}
                    className={`absolute left-0.5 right-0.5 rounded-lg overflow-hidden z-10 cursor-pointer hover:brightness-95 transition-all ${r.blockColor}`}
                    style={{ top: `${top + 2}px`, height: `${height}px` }}>
                    <div className="px-2 py-1.5 h-full flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-1 mb-0.5">
                          <ChanIcon size={8} className="text-white/70" weight="bold" />
                          <span className="text-[9px] text-white/70 font-semibold">{r.meetingTimeLabel}</span>
                        </div>
                        <div className="text-[11px] font-bold text-white leading-tight">{r.title}</div>
                      </div>
                      {height > 44 && (
                        <div className="text-[9px] text-white/50 truncate mt-0.5">{r.from}</div>
                      )}
                    </div>
                  </div>
                )
              })}
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
  const [search, setSearch] = useState('')

  const overdue = REQUESTS.filter(r => r.status === 'overdue')
  const pending = REQUESTS.filter(r => r.status === 'pending' || r.status === 'in-progress')
  const complete = REQUESTS.filter(r => r.status === 'complete')

  const filtered = useMemo(() => {
    let list = REQUESTS
    if (filter === 'async') list = list.filter(r => r.mode === 'async')
    else if (filter === 'sync') list = list.filter(r => r.mode === 'sync')
    else if (filter === 'overdue') list = list.filter(r => r.status === 'overdue')
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(r =>
        r.title.toLowerCase().includes(q) ||
        r.from.toLowerCase().includes(q) ||
        r.summary.toLowerCase().includes(q)
      )
    }
    return list
  }, [filter, search])

  const sections = [
    { label: 'Overdue', items: filtered.filter(r => r.status === 'overdue'), accent: 'text-red-500' },
    { label: 'Up next', items: filtered.filter(r => r.status === 'pending' || r.status === 'in-progress'), accent: 'text-gray-700' },
    { label: 'Completed', items: filtered.filter(r => r.status === 'complete'), accent: 'text-gray-400' },
  ].filter(s => s.items.length > 0)

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB]">
      <Nav />

      {/* Header */}
      <div className="bg-white border-b border-gray-100 pt-20 px-6">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-center justify-between py-4 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Requests</h1>
              <p className="text-sm text-gray-400 mt-0.5">
                {pending.length} pending
                {overdue.length > 0 && <span className="text-red-500 font-semibold"> · {overdue.length} overdue</span>}
                <span> · {complete.length} complete · week of Jan 13</span>
              </p>
            </div>

            {/* View toggle */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 shrink-0">
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

          {/* Search + filters */}
          <div className="flex items-center gap-3 pb-4">
            <div className="relative flex-1 max-w-xs">
              <MagnifyingGlass size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search requests..."
                className="w-full pl-8 pr-8 py-2 text-sm rounded-xl border border-gray-200 bg-white outline-none focus:border-brand-indigo/40 focus:ring-2 focus:ring-brand-indigo/10"
                style={{ boxShadow: 'none' }}
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500">
                  <X size={12} />
                </button>
              )}
            </div>

            <div className="flex gap-1.5">
              {([
                { id: 'all', label: 'All' },
                { id: 'async', label: 'Async' },
                { id: 'sync', label: 'Sync' },
                { id: 'overdue', label: 'Overdue' },
              ] as const).map(f => (
                <button key={f.id} onClick={() => setFilter(f.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${filter === f.id ? 'bg-brand-indigo text-white border-brand-indigo' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}>
                  {f.label}
                </button>
              ))}
            </div>

            {/* Stats */}
            <div className="ml-auto flex items-center gap-2 shrink-0">
              {[
                { icon: EnvelopeSimple, val: REQUESTS.filter(r => r.mode === 'async' && r.status !== 'complete').length, label: 'async', color: 'text-orange-500' },
                { icon: VideoCamera, val: REQUESTS.filter(r => r.mode === 'sync').length, label: 'sync', color: 'text-brand-indigo' },
                { icon: Warning, val: overdue.length, label: 'overdue', color: 'text-red-500' },
              ].map(s => (
                <div key={s.label} className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5">
                  <s.icon size={12} className={s.color} />
                  <span className={`text-xs font-bold ${s.color}`}>{s.val}</span>
                  <span className="text-[10px] text-gray-400 hidden sm:block">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 max-w-[1200px] mx-auto w-full px-6 py-6">

        {view === 'calendar' ? (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <button className="p-1.5 rounded-lg border border-gray-200 hover:border-gray-300 text-gray-400"><CaretLeft size={14} /></button>
                <span className="text-sm font-bold text-gray-900">Week of Jan 13, 2025</span>
                <button className="p-1.5 rounded-lg border border-gray-200 hover:border-gray-300 text-gray-400"><CaretRight size={14} /></button>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5"><span className="w-3 h-1.5 rounded-sm bg-gray-300" /><span className="text-gray-500">Async deadline (all-day)</span></div>
                <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-brand-indigo" /><span className="text-gray-500">Sync session</span></div>
                <div className="flex items-center gap-1.5"><span className="w-3 h-1 bg-red-400 rounded-full" /><span className="text-gray-500">Now</span></div>
              </div>
            </div>
            <CalendarView />
          </div>
        ) : (
          <div className="space-y-5">
            {search && (
              <div className="text-sm text-gray-500">
                {filtered.length} result{filtered.length !== 1 ? 's' : ''} for "<strong className="text-gray-800">{search}</strong>"
              </div>
            )}
            {filtered.length === 0 ? (
              <div className="text-center py-12 text-sm text-gray-400">No requests match your search.</div>
            ) : (
              sections.map(section => (
                <div key={section.label}>
                  <div className={`text-xs font-bold uppercase tracking-wider mb-2.5 ${section.accent}`}>{section.label} · {section.items.length}</div>
                  <div className="space-y-2">
                    {section.items.map(r => <RequestCard key={r.id} r={r} />)}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Concept explainer */}
        <div className="mt-8 bg-brand-shaft rounded-2xl px-6 py-5">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-8 h-8 rounded-xl bg-brand-indigo flex items-center justify-center shrink-0">
              <Sparkle size={14} weight="fill" className="text-white" />
            </div>
            <div>
              <div className="font-bold text-white mb-0.5">What is a Comms Request?</div>
              <p className="text-sm text-white/50 leading-relaxed max-w-2xl">
                When someone dispatches a Comms session to you, it lands here — not in email, not Slack. A structured task with context, deadline or meeting time, and a defined outcome.
              </p>
            </div>
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { icon: <EnvelopeSimple size={13} className="text-orange-400" />, label: 'Async', desc: 'Complete at your pace before the due date. Shown in calendar as a deadline.' },
              { icon: <VideoCamera size={13} className="text-brand-pale" />, label: 'Sync', desc: 'Live session at a specific time. Blocks your calendar like a meeting.' },
              { icon: <Bell size={13} className="text-yellow-400" />, label: 'Auto follow-up', desc: 'If you don\'t act, Comms follows up automatically. Nothing gets lost.' },
            ].map(c => (
              <div key={c.label} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                <div className="flex items-center gap-2 mb-1.5">{c.icon}<span className="text-xs font-bold text-white">{c.label}</span></div>
                <p className="text-xs text-white/40 leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 grid sm:grid-cols-2 gap-4">
          <div className="bg-white border border-gray-200 rounded-2xl px-5 py-4">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Circle size={9} weight="fill" className="text-brand-indigo" /> For the person assigning
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">Instead of "hey can you do X?", dispatch a Comms session. The recipient gets a structured request — and you get completion tracking, auto follow-up, and a structured response.</p>
            <Link to="/app/dispatcher" className="text-xs font-semibold text-brand-indigo flex items-center gap-1 mt-3 hover:text-brand-light transition-colors">Dispatch a request <ArrowRight size={10} weight="bold" /></Link>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl px-5 py-4">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Circle size={9} weight="fill" className="text-orange-500" /> For the person completing
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">All your Comms requests in one place — sortable, searchable, with full context. Sync sessions block your calendar. Async tasks show due dates. Nothing gets lost.</p>
            <div className="text-xs text-gray-400 mt-3">This view is your Requests inbox.</div>
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
