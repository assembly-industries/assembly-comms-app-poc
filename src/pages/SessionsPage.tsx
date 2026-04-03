import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  MagnifyingGlass, Archive, CaretRight, Check, Clock,
  Users, ArrowRight, Link as LinkIcon, Brain, DownloadSimple, X,
  Sparkle, Star
} from '@phosphor-icons/react'
import { Nav } from '../components/Nav'
import { PrototypeBanner } from '../components/shared/PrototypeBanner'

interface Session {
  id: string
  title: string
  cat: 'Collect' | 'Test' | 'Review' | 'Train'
  status: 'complete' | 'active' | 'archived'
  participants: number
  done: number
  date: string
  summary: string
  tags: string[]
  keyFindings: string[]
  generatedAction: string
}

const SESSIONS: Session[] = [
  {
    id: 's1',
    title: 'Vendor Onboarding — Q4 2024',
    cat: 'Collect',
    status: 'complete',
    participants: 18,
    done: 18,
    date: 'Oct 12, 2024',
    summary: 'Collected W-9, insurance certificates, and signed NDAs from all 18 contractors ahead of the Q4 project kickoff.',
    tags: ['vendors', 'onboarding', 'documents'],
    keyFindings: [
      '18/18 W-9 forms collected and filed',
      '18/18 NDAs signed via e-sign — all on record',
      '18/18 insurance certificates verified',
      '3 follow-ups required (all automated, avg 2.3 days)',
    ],
    generatedAction: 'All 18 contractors cleared to start Q4 project. Insurance expiry reminders set for renewal dates.',
  },
  {
    id: 's2',
    title: 'Engineering Screens — Jan 2025',
    cat: 'Test',
    status: 'active',
    participants: 12,
    done: 7,
    date: 'Jan 8, 2025',
    summary: 'Structured 20-min async screening interviews for backend engineering candidates. STAR-format, scored on technical depth, problem-solving, and communication.',
    tags: ['hiring', 'engineering', 'interview'],
    keyFindings: [
      'Alex Torres: 88/100 — Advance to final round',
      'Maria Chen: 84/100 — Advance to final round',
      'James Park: 71/100 — Hold for consideration',
      '4 candidates still pending (follow-ups sent)',
    ],
    generatedAction: 'Draft final-round invites for Alex Torres and Maria Chen. Send polite decline to 3 others once all screens complete.',
  },
  {
    id: 's3',
    title: 'Team Roadmap Brainstorm — Feb 2025',
    cat: 'Collect',
    status: 'complete',
    participants: 14,
    done: 14,
    date: 'Feb 2, 2025',
    summary: 'Async idea collection from 14 team members for the Q2 product roadmap. 47 unique ideas surfaced and categorized.',
    tags: ['roadmap', 'product', 'team'],
    keyFindings: [
      '47 unique ideas collected from 14 participants',
      'Top theme: developer tooling (8 independent mentions)',
      '3 high-priority items identified by vote weight',
      'Zero duplicate-chase needed — 100% participation',
    ],
    generatedAction: 'Q2 roadmap draft pre-populated with top 3 items. Voting summary exported to Notion. Follow-on planning session suggested.',
  },
  {
    id: 's4',
    title: 'Q1 Compliance Training — Mar 2025',
    cat: 'Review',
    status: 'active',
    participants: 40,
    done: 24,
    date: 'Mar 1, 2025',
    summary: 'Company-wide walkthrough of updated data handling policy. Employees confirm understanding per section, with attestation record.',
    tags: ['compliance', 'training', 'policy'],
    keyFindings: [
      '24/40 employees attested — all on legal record',
      '4 employees failed comprehension check — flagged',
      'Average module completion time: 8 min',
      '16 follow-ups scheduled before Mar 15 deadline',
    ],
    generatedAction: 'Flagged employees scheduled for a re-review session. HR notified. Deadline reminder emails queued for 16 pending.',
  },
  {
    id: 's5',
    title: 'New Hire Onboarding — Mar 2025',
    cat: 'Collect',
    status: 'complete',
    participants: 3,
    done: 3,
    date: 'Mar 5, 2025',
    summary: 'Document collection and identity verification for 3 new engineering hires. Covers ID, I-9, direct deposit, and equipment form.',
    tags: ['hiring', 'onboarding', 'documents'],
    keyFindings: [
      '3/3 new hires fully onboarded in under 24 hours',
      'All I-9 forms verified and filed',
      'Direct deposit forms submitted to payroll',
      'Equipment requests forwarded to IT same day',
    ],
    generatedAction: 'All 3 hires ready for Day 1. IT provisioning orders placed. Welcome emails with first-week schedule queued.',
  },
  {
    id: 's6',
    title: 'Sales Role-Play Coaching — Q1 2025',
    cat: 'Train',
    status: 'complete',
    participants: 6,
    done: 6,
    date: 'Feb 20, 2025',
    summary: 'AI-facilitated role-play for 6 sales reps. Each practiced a cold-to-close scenario and received a rubric-scored coaching debrief.',
    tags: ['sales', 'training', 'coaching'],
    keyFindings: [
      'Average score: 72/100 across 6 reps',
      'Weakest area: objection handling (avg 58/100)',
      'Strongest area: rapport building (avg 84/100)',
      '2 reps recommended for advanced follow-up session',
    ],
    generatedAction: 'Advanced objection handling session proposed for 2 reps. Coaching summary emailed to manager. Follow-up session date suggested.',
  },
]

const catColors: Record<Session['cat'], string> = {
  Collect: 'bg-blue-50 text-blue-700 border-blue-100',
  Test: 'bg-violet-50 text-violet-700 border-violet-100',
  Review: 'bg-green-50 text-green-700 border-green-100',
  Train: 'bg-orange-50 text-orange-700 border-orange-100',
}

export function SessionsPage() {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Session | null>(null)
  const [contextPrompt, setContextPrompt] = useState<string | null>(null)
  const navigate = useNavigate()

  const filtered = SESSIONS.filter(s =>
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.tags.some(t => t.includes(search.toLowerCase())) ||
    s.cat.toLowerCase().includes(search.toLowerCase())
  )

  function useAsContext(s: Session) {
    const prompt = `Based on the "${s.title}" session — `
    setContextPrompt(prompt)
  }

  if (contextPrompt !== null) {
    return (
      <div className="h-screen flex flex-col bg-[#F8F9FC]">
        <Nav />
        <div className="flex-1 flex items-center justify-center pt-14">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xl p-8 max-w-md w-full mx-4 space-y-5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-ghost flex items-center justify-center">
                <Brain size={16} weight="duotone" className="text-brand-indigo" />
              </div>
              <div>
                <div className="font-bold text-brand-shaft">Use as context</div>
                <div className="text-xs text-gray-400">Session sent to Dispatcher</div>
              </div>
            </div>
            <div className="bg-brand-ghost rounded-xl px-4 py-3 text-sm font-medium text-brand-indigo">
              "{contextPrompt}"
            </div>
            <p className="text-sm text-gray-500">Your Work Dispatcher is pre-loaded with this session as context. Continue the conversation there.</p>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/app/dispatcher')}
                className="btn-primary flex-1 justify-center"
              >
                Open Dispatcher <ArrowRight size={14} />
              </button>
              <button onClick={() => setContextPrompt(null)} className="btn-secondary py-2 px-4">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-[#F8F9FC]">
      <Nav />
      <div className="flex flex-1 min-h-0 overflow-hidden pt-14">

        {/* Main list */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header + search */}
          <div className="bg-white border-b border-gray-100 px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <Archive size={18} className="text-brand-indigo" />
                <div>
                  <h1 className="font-bold text-gray-900 text-lg">Comms Sessions</h1>
                  <p className="text-sm text-gray-400 mt-0.5">Every Comms you've sent — with outcomes, history, and follow-up records.</p>
                </div>
              </div>
              <Link to="/app/dispatcher" className="btn-primary">
                <Sparkle size={14} weight="fill" /> New session
              </Link>
            </div>

            {/* Session concept explainer */}
            <div className="bg-brand-ghost border border-brand-indigo/15 rounded-2xl px-5 py-4 mb-4">
              <div className="text-xs font-bold text-brand-indigo uppercase tracking-wider mb-2">What is a Comms Session?</div>
              <p className="text-sm text-gray-600 leading-relaxed mb-3">
                When you accept a Comms draft and hit send, a <strong className="text-gray-800">Comms Session</strong> is created. It tracks who received it, handles all follow-ups automatically, and stores everything that comes back. When the work is done, the outcome is attached and lives here on record.
              </p>
              <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                {[
                  'Tracks responses per person',
                  'Sends follow-ups automatically',
                  'Flags exceptions (no-shows / non-completions)',
                  'Outcome attached when done',
                  'Reusable as context in future dispatches',
                ].map(point => (
                  <span key={point} className="flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-brand-indigo inline-block" />{point}
                  </span>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-3 mb-4">
              {[
                { label: 'Total sessions', value: SESSIONS.length, color: 'text-brand-indigo' },
                { label: 'Active', value: SESSIONS.filter(s => s.status === 'active').length, color: 'text-yellow-600' },
                { label: 'Complete', value: SESSIONS.filter(s => s.status === 'complete').length, color: 'text-green-600' },
                { label: 'Participants', value: SESSIONS.reduce((a, s) => a + s.participants, 0), color: 'text-violet-600' },
              ].map(stat => (
                <div key={stat.label} className="bg-[#F9FAFB] rounded-xl px-4 py-3">
                  <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <div className="flex-1 flex items-center gap-2 bg-[#F3F4F6] rounded-xl px-4 py-2.5">
                <MagnifyingGlass size={15} className="text-gray-400 shrink-0" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search sessions, tags, categories..."
                  className="bg-transparent text-[15px] text-gray-800 placeholder-gray-400 outline-none flex-1"
                />
                {search && <button onClick={() => setSearch('')} className="text-gray-400 hover:text-gray-700"><X size={14} /></button>}
              </div>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2">
            {filtered.map(s => (
              <button
                key={s.id}
                onClick={() => setSelected(s === selected ? null : s)}
                className={`w-full text-left bg-white rounded-2xl border px-5 py-4 flex items-center gap-4 hover:border-brand-indigo/20 transition-all ${
                  selected?.id === s.id ? 'border-brand-indigo/30 shadow-md' : 'border-gray-100 shadow-sm'
                }`}
              >
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-gray-900">{s.title}</span>
                    <span className={`pill text-xs border ${catColors[s.cat]}`}>{s.cat}</span>
                    {s.status === 'active' && <span className="pill pill-active text-xs"><div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Active</span>}
                  </div>
                  <p className="text-sm text-gray-400 truncate">{s.summary}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1.5"><Users size={11} /> {s.participants} participants</span>
                    <span className="flex items-center gap-1.5"><Check size={11} weight="bold" /> {s.done}/{s.participants} complete</span>
                    <span className="flex items-center gap-1.5"><Clock size={11} /> {s.date}</span>
                    {s.tags.slice(0, 2).map(t => (
                      <span key={t} className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{t}</span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <div className="text-base font-bold text-brand-indigo">{Math.round((s.done / s.participants) * 100)}%</div>
                    <div className="w-16 h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                      <div className="h-full bg-brand-indigo rounded-full" style={{ width: `${(s.done / s.participants) * 100}%` }} />
                    </div>
                  </div>
                  <CaretRight size={15} weight="bold" className={`transition-transform ${selected?.id === s.id ? 'rotate-90 text-brand-indigo' : 'text-gray-300'}`} />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Detail panel */}
        {selected && (
          <div className="w-80 bg-white border-l border-gray-100 flex flex-col shrink-0 overflow-y-auto">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <span className="font-bold text-gray-900">Session Detail</span>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-700"><X size={15} /></button>
            </div>

            <div className="p-5 space-y-5">
              <div>
                <div className="font-bold text-gray-900 text-base leading-snug">{selected.title}</div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <span className={`pill text-xs border ${catColors[selected.cat]}`}>{selected.cat}</span>
                  <span className={`pill text-xs ${selected.status === 'complete' ? 'pill-done' : 'pill-active'}`}>
                    {selected.status === 'complete' ? 'Complete' : 'Active'}
                  </span>
                </div>
              </div>

              <p className="text-sm text-gray-500 leading-relaxed">{selected.summary}</p>

              {/* Key findings */}
              <div>
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Key Findings</div>
                <div className="space-y-2.5">
                  {selected.keyFindings.map((f, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                      <Check size={12} weight="bold" className="text-green-500 shrink-0 mt-0.5" />
                      {f}
                    </div>
                  ))}
                </div>
              </div>

              {/* Generated action */}
              <div>
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Generated Action</div>
                <div className="flex items-start gap-2.5 bg-brand-ghost rounded-xl px-4 py-3">
                  <Star size={14} weight="fill" className="text-brand-indigo shrink-0 mt-0.5" />
                  <p className="text-sm text-brand-shaft leading-relaxed">{selected.generatedAction}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Participants', value: `${selected.done}/${selected.participants}` },
                  { label: 'Date', value: selected.date },
                  { label: 'Completion', value: `${Math.round((selected.done / selected.participants) * 100)}%` },
                  { label: 'Category', value: selected.cat },
                ].map(f => (
                  <div key={f.label} className="bg-[#F9FAFB] rounded-xl px-3 py-2.5">
                    <div className="text-xs text-gray-400 mb-1">{f.label}</div>
                    <div className="text-sm font-semibold text-gray-800">{f.value}</div>
                  </div>
                ))}
              </div>

              {/* Tags */}
              <div>
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Tags</div>
                <div className="flex flex-wrap gap-1.5">
                  {selected.tags.map(t => (
                    <span key={t} className="bg-gray-100 text-gray-500 text-xs px-2.5 py-1 rounded-full font-medium">#{t}</span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Reuse This Outcome</div>

                <button
                  onClick={() => useAsContext(selected)}
                  className="w-full bg-brand-ghost hover:bg-brand-secondary/30 border border-brand-indigo/20 rounded-xl px-4 py-3.5 text-left transition-colors"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <Brain size={14} weight="duotone" className="text-brand-indigo" />
                    <span className="text-sm font-semibold text-brand-indigo">Use as context</span>
                  </div>
                  <p className="text-xs text-gray-500">Bring this outcome into the Dispatcher to build a new session on top of it.</p>
                </button>

                <button
                  onClick={() => useAsContext(selected)}
                  className="w-full bg-[#F9FAFB] hover:bg-gray-100 border border-gray-200 rounded-xl px-4 py-3.5 text-left transition-colors"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <LinkIcon size={14} className="text-gray-500" />
                    <span className="text-sm font-semibold text-gray-600">Chain to new session</span>
                  </div>
                  <p className="text-xs text-gray-400">Create a follow-on session referencing this outcome and participants.</p>
                </button>

                <button className="w-full flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 px-4 py-2.5 transition-colors">
                  <DownloadSimple size={13} /> Export outcome report
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <PrototypeBanner title="Sessions Library" description="Click a session to explore" />
    </div>
  )
}
