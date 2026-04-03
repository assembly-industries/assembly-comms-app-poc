import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Lock, Sparkle, ArrowRight, Check, Users, Clock,
  ChartBar, ChatTeardropText, Copy,
  Microphone,
} from '@phosphor-icons/react'
import { Nav } from '../components/Nav'
import { PrototypeBanner } from '../components/shared/PrototypeBanner'

/* ─── Session data ─── */
const SESSION = {
  id: 'ENG-001',
  title: 'Engineering Screens — Jan 2025',
  cat: 'Test',
  sharedBy: 'Stacked HR',
  sharedByInitials: 'SH',
  sharedByColor: 'from-[#7c3aed] to-[#4f46e5]',
  date: 'Jan 8, 2025',
  participants: 12,
  completed: 8,
  mode: 'Async · Email',
  summary: 'Structured 20-minute async screening for backend engineering candidates. Each candidate was assessed across 5 dimensions — technical depth, problem-solving, communication, collaboration, and culture fit — using a STAR-format rubric. Sessions were dispatched simultaneously to 12 candidates; 8 have completed.',
  findings: [
    { name: 'Alex Torres', score: 88, status: 'Advance', highlight: true },
    { name: 'Maria Chen', score: 84, status: 'Advance', highlight: true },
    { name: 'James Park', score: 71, status: 'Hold', highlight: false },
    { name: 'Priya Nair', score: 68, status: 'Hold', highlight: false },
    { name: 'Derek Mills', score: 62, status: 'Decline', highlight: false },
    { name: 'Jordan Lee', score: null, status: 'Pending', highlight: false },
    { name: 'Sam Patel', score: null, status: 'Pending', highlight: false },
    { name: 'Chris Murphy', score: null, status: 'Pending', highlight: false },
  ],
  rubric: [
    { dimension: 'Technical depth', weight: '30%', avg: 74 },
    { dimension: 'Problem-solving', weight: '25%', avg: 71 },
    { dimension: 'Communication', weight: '20%', avg: 82 },
    { dimension: 'Collaboration', weight: '15%', avg: 78 },
    { dimension: 'Culture fit', weight: '10%', avg: 85 },
  ],
  followUps: [
    '4 automated follow-up emails sent (Jordan, Sam, Chris, Taylor)',
    'Alex Torres and Maria Chen flagged for fast-track final round',
    'Decline drafts staged for 3 candidates — pending manager review',
  ],
  outcome: 'Shortlist ready: Torres (88) and Chen (84) advance. 3 hold candidates paused. 4 screenings still pending — follow-ups sent.',
}

/* ─── Q&A engine ─── */
interface QAMessage { role: 'user' | 'ai'; text: string }

const SCRIPTED: Array<{ patterns: string[]; answer: string }> = [
  {
    patterns: ['highest', 'best', 'top', 'score'],
    answer: 'Alex Torres scored highest at **88/100**, followed by Maria Chen at **84/100**. Both are recommended to advance to the final round. The rubric assessed 5 dimensions — Torres scored particularly well on Technical Depth (26/30) and Culture Fit (18/20).',
  },
  {
    patterns: ['pending', 'not complete', 'missing', 'still'],
    answer: '4 candidates haven\'t completed their screening yet: **Jordan Lee, Sam Patel, Chris Murphy**, and a 4th slot. Automated follow-up emails have been sent to all four. The session will remain open until all complete or the deadline passes.',
  },
  {
    patterns: ['criteria', 'rubric', 'dimension', 'assess', 'measured'],
    answer: 'The screening uses a **5-dimension rubric**: Technical Depth (30%), Problem-Solving (25%), Communication (20%), Collaboration (15%), and Culture Fit (10%). Scores are out of 20 per dimension. The average across all completed screens is **74.3/100**. Communication is the strongest dimension (avg 82), Problem-Solving the weakest (avg 71).',
  },
  {
    patterns: ['average', 'avg', 'mean', 'overall'],
    answer: 'The average score across the 8 completed screenings is **74.3/100**. If you separate by recommendation: the 2 "Advance" candidates averaged 86/100, and the 3 "Hold" candidates averaged 67/100. The 3 "Decline" candidates averaged 52/100.',
  },
  {
    patterns: ['decline', 'reject', 'no', 'pass'],
    answer: '**Derek Mills (62), and 2 others** are flagged for decline. Decline email drafts have been staged and are pending manager review before sending. The system won\'t auto-send declines until a dispatcher approves them.',
  },
  {
    patterns: ['advance', 'hire', 'final', 'next'],
    answer: '**Alex Torres and Maria Chen** are recommended for the final round. Torres applied for the senior backend role; Chen for the principal engineer track. Both completed the session in under 18 minutes with strong STAR-format answers. Final round invites are staged and ready to send.',
  },
  {
    patterns: ['follow', 'remind', 'chase'],
    answer: '4 automated follow-up emails have been sent. The session is configured for a max of 3 follow-ups per candidate, spaced 48 hours apart. If a candidate doesn\'t respond after the 3rd follow-up, their slot is flagged as an **exception** and closed.',
  },
  {
    patterns: ['time', 'how long', 'duration', 'complete'],
    answer: 'Average session completion time was **14.3 minutes** for the 8 who completed it. The session was designed for ~20 minutes. Torres was fastest at 11 minutes; Park took the longest at 19 minutes. All responses were via the async web app link — no downloads required.',
  },
]

function getAIAnswer(question: string): string {
  const q = question.toLowerCase()
  for (const entry of SCRIPTED) {
    if (entry.patterns.some(p => q.includes(p))) return entry.answer
  }
  return 'That\'s a good question. Based on the session data I have access to, I can see scores, status, and follow-up logs for each candidate. Try asking about specific scores, pending candidates, rubric dimensions, or recommended next steps.'
}

function renderAnswer(text: string) {
  return text.split('**').map((part, i) =>
    i % 2 === 1 ? <strong key={i} className="text-gray-900 font-semibold">{part}</strong> : <span key={i}>{part}</span>
  )
}

/* ─── Main page ─── */
export function SessionViewerPage() {
  const [messages, setMessages] = useState<QAMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showFreeBanner, setShowFreeBanner] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showAll, setShowAll] = useState(false)
  const chatBottom = useRef<HTMLDivElement>(null)

  const SUGGESTED = [
    'Who scored highest?',
    'Which candidates are still pending?',
    'What criteria were used?',
    'Who is recommended to advance?',
  ]

  useEffect(() => {
    if (messages.length >= 1) {
      const t = setTimeout(() => setShowFreeBanner(true), 800)
      return () => clearTimeout(t)
    }
  }, [messages])

  useEffect(() => {
    chatBottom.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  function ask(q: string) {
    if (!q.trim()) return
    setMessages(m => [...m, { role: 'user', text: q }])
    setInput('')
    setLoading(true)
    setTimeout(() => {
      setMessages(m => [...m, { role: 'ai', text: getAIAnswer(q) }])
      setLoading(false)
    }, 900)
  }

  const visibleFindings = showAll ? SESSION.findings : SESSION.findings.slice(0, 5)
  const completedFindings = SESSION.findings.filter(f => f.score !== null)
  const avgScore = Math.round(completedFindings.reduce((a, f) => a + (f.score ?? 0), 0) / completedFindings.length)

  return (
    <div className="h-screen flex flex-col bg-[#F9FAFB]">
      <Nav />

      <div className="flex-1 min-h-0 overflow-hidden pt-14 flex flex-col">

        {/* Session header bar */}
        <div className="bg-white border-b border-gray-100 px-6 py-3 flex items-center gap-4 shrink-0">
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${SESSION.sharedByColor} flex items-center justify-center shrink-0`}>
              <span className="text-[10px] font-bold text-white">{SESSION.sharedByInitials}</span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-gray-900 truncate">{SESSION.title}</span>
                <span className="text-[10px] font-semibold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1">
                  <Lock size={9} /> View only
                </span>
              </div>
              <div className="text-xs text-gray-400">Shared by {SESSION.sharedBy} · {SESSION.date}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={() => setCopied(true)}
              className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-brand-indigo px-3 py-1.5 border border-gray-200 rounded-lg hover:border-brand-indigo/30 transition-all">
              <Copy size={12} />
              {copied ? 'Copied!' : 'Copy link'}
            </button>
          </div>
        </div>

        {/* Main layout */}
        <div className="flex-1 min-h-0 grid lg:grid-cols-[1fr_400px] overflow-hidden">

          {/* Left: Session outcome */}
          <div className="overflow-y-auto px-6 py-6 space-y-5 border-r border-gray-100">

            {/* Stats strip */}
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'Participants', value: SESSION.participants, icon: Users },
                { label: 'Completed', value: `${SESSION.completed}/${SESSION.participants}`, icon: Check },
                { label: 'Avg score', value: `${avgScore}/100`, icon: ChartBar },
                { label: 'Mode', value: SESSION.mode, icon: Clock },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-center">
                  <Icon size={13} className="text-brand-indigo mx-auto mb-1" />
                  <div className="text-sm font-bold text-gray-900">{value}</div>
                  <div className="text-[10px] text-gray-400">{label}</div>
                </div>
              ))}
            </div>

            {/* Outcome */}
            <div className="bg-green-50 border border-green-200 rounded-2xl px-5 py-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                  <Check size={9} weight="bold" className="text-white" />
                </div>
                <span className="text-xs font-bold text-green-700 uppercase tracking-wider">Session Outcome</span>
              </div>
              <p className="text-sm text-green-900 leading-relaxed">{SESSION.outcome}</p>
            </div>

            {/* Summary */}
            <div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Summary</div>
              <p className="text-sm text-gray-600 leading-relaxed">{SESSION.summary}</p>
            </div>

            {/* Candidate results */}
            <div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Candidate results</div>
              <div className="space-y-2">
                {visibleFindings.map(f => (
                  <div key={f.name} className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${f.highlight ? 'border-brand-indigo/20 bg-brand-ghost' : 'border-gray-100 bg-white'}`}>
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0 text-xs font-bold text-gray-600">
                      {f.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-gray-900">{f.name}</div>
                      {f.score !== null ? (
                        <div className="mt-1 w-24 h-1 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-brand-indigo rounded-full" style={{ width: `${f.score}%` }} />
                        </div>
                      ) : null}
                    </div>
                    <div className="text-right shrink-0">
                      {f.score !== null ? (
                        <div className="text-sm font-bold text-gray-900">{f.score}<span className="text-xs text-gray-400 font-normal">/100</span></div>
                      ) : null}
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        f.status === 'Advance' ? 'bg-green-100 text-green-700' :
                        f.status === 'Hold' ? 'bg-yellow-100 text-yellow-700' :
                        f.status === 'Decline' ? 'bg-red-100 text-red-600' :
                        'bg-gray-100 text-gray-500'
                      }`}>{f.status}</span>
                    </div>
                  </div>
                ))}
                {!showAll && SESSION.findings.length > 5 && (
                  <button onClick={() => setShowAll(true)} className="w-full text-xs text-brand-indigo font-semibold py-2 hover:text-brand-light transition-colors">
                    Show all {SESSION.findings.length} candidates
                  </button>
                )}
              </div>
            </div>

            {/* Rubric breakdown */}
            <div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Score by dimension (avg)</div>
              <div className="space-y-2.5 bg-white border border-gray-200 rounded-2xl px-4 py-4">
                {SESSION.rubric.map(r => (
                  <div key={r.dimension} className="flex items-center gap-3">
                    <div className="w-36 shrink-0">
                      <div className="text-xs font-medium text-gray-700">{r.dimension}</div>
                      <div className="text-[10px] text-gray-400">{r.weight} of score</div>
                    </div>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-indigo rounded-full" style={{ width: `${r.avg}%` }} />
                    </div>
                    <span className="text-xs font-bold text-gray-700 w-8 text-right">{r.avg}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Follow-up log */}
            <div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Follow-up log</div>
              <div className="space-y-1.5">
                {SESSION.followUps.map(f => (
                  <div key={f} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="w-1 h-1 rounded-full bg-brand-indigo mt-2 shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: AI Q&A panel */}
          <div className="flex flex-col bg-white overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-brand-indigo flex items-center justify-center">
                <ChatTeardropText size={14} weight="duotone" className="text-white" />
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900">Ask this session anything</div>
                <div className="text-xs text-gray-400">AI answers from session data · no account needed</div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0">
              {messages.length === 0 && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-400 text-center py-2">Ask a question about this session, or pick one below.</p>
                  <div className="space-y-2">
                    {SUGGESTED.map(s => (
                      <button key={s} onClick={() => ask(s)}
                        className="w-full text-left text-sm px-3.5 py-2.5 bg-gray-50 hover:bg-brand-ghost border border-gray-200 hover:border-brand-indigo/30 rounded-xl text-gray-600 hover:text-brand-indigo transition-all">
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start gap-2'}`}>
                  {m.role === 'ai' && (
                    <div className="w-6 h-6 rounded-lg bg-brand-indigo flex items-center justify-center shrink-0 mt-0.5">
                      <Sparkle size={11} weight="fill" className="text-white" />
                    </div>
                  )}
                  <div className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    m.role === 'user' ? 'bg-brand-indigo text-white rounded-br-none' : 'bg-gray-100 text-gray-700 rounded-tl-none'
                  }`}>
                    {m.role === 'ai' ? renderAnswer(m.text) : m.text}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex gap-2 items-start">
                  <div className="w-6 h-6 rounded-lg bg-brand-indigo flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkle size={11} weight="fill" className="text-white" />
                  </div>
                  <div className="bg-gray-100 rounded-xl rounded-tl-none px-3.5 py-2.5">
                    <div className="flex gap-1">
                      {[0, 1, 2].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatBottom} />
            </div>

            {/* Input */}
            <div className="px-4 pb-4 shrink-0">
              <form onSubmit={e => { e.preventDefault(); ask(input) }} className="flex gap-2 items-end">
                <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 flex items-center gap-2">
                  <Microphone size={13} className="text-gray-400 shrink-0" />
                  <input value={input} onChange={e => setInput(e.target.value)}
                    placeholder="Ask about scores, candidates, criteria..."
                    className="bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none flex-1"
                    style={{ boxShadow: 'none' }}
                  />
                </div>
                <button type="submit" disabled={!input.trim()}
                  className="w-9 h-9 rounded-xl bg-brand-indigo flex items-center justify-center disabled:opacity-30 hover:bg-brand-light transition-colors shrink-0">
                  <ArrowRight size={14} className="text-white" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Free sessions banner — slides in after first Q&A */}
      {showFreeBanner && (
        <div className="shrink-0 bg-gradient-to-r from-brand-shaft to-[#1e3a8a] border-t border-white/10 px-6 py-3 flex items-center gap-4">
          <div className="w-8 h-8 rounded-xl bg-brand-indigo/40 flex items-center justify-center shrink-0">
            <Sparkle size={15} weight="fill" className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold text-white">Run your own sessions — 10 free, on us</div>
            <div className="text-xs text-white/60 mt-0.5">You're viewing a shared Comms Session. Start dispatching your own in 30 seconds — no card required.</div>
          </div>
          <div className="flex gap-2 shrink-0">
            <Link to="/app/dispatcher" className="bg-white text-brand-indigo text-xs font-bold px-4 py-2 rounded-xl hover:bg-brand-ghost transition-colors flex items-center gap-1.5">
              Start free <ArrowRight size={11} weight="bold" />
            </Link>
            <button onClick={() => setShowFreeBanner(false)} className="text-white/40 hover:text-white/60 text-xs px-2">Dismiss</button>
          </div>
        </div>
      )}

      <PrototypeBanner
        title="Session Viewer — Prototype"
        description="Shared Comms Sessions: view-only access + AI Q&A for anyone with the link. No account required."
      />
    </div>
  )
}
