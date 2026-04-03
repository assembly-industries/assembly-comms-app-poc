import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, Sparkle, Check, ArrowDown, ArrowUp,
  ArrowsLeftRight, Buildings, Users, ChartBar, Briefcase,
  ShieldCheck, Megaphone, Code, CurrencyDollar,
  ListChecks, Clock, Lightning,
  CaretDown, CaretRight,
} from '@phosphor-icons/react'
import { Nav } from '../components/Nav'
import { PrototypeBanner } from '../components/shared/PrototypeBanner'

/* ─── Types ─── */
interface PlaybookEntry {
  id: string
  title: string
  owner: string
  frequency: string
  mode: 'async' | 'sync' | 'both'
  direction: 'pull' | 'push' | 'both'
  color: string
  accentBg: string
  steps: { label: string; type: 'pull' | 'push' | 'sync'; desc: string }[]
  outcome: string
  timeSaved: string
  replaces: string
}

interface Department {
  id: string
  name: string
  icon: React.ReactNode
  color: string
  bg: string
  flows: string[]
  sessionCount: string
}

/* ─── Department data ─── */
const DEPARTMENTS: Department[] = [
  {
    id: 'leadership',
    name: 'Leadership',
    icon: <Buildings size={18} />,
    color: 'text-violet-700',
    bg: 'bg-violet-50 border-violet-200',
    flows: ['OKR check-ins', 'Board prep', 'All-hands cascade', 'Strategic decisions'],
    sessionCount: '8–20/mo',
  },
  {
    id: 'ops',
    name: 'Operations',
    icon: <Briefcase size={18} />,
    color: 'text-brand-indigo',
    bg: 'bg-brand-ghost border-brand-indigo/20',
    flows: ['Vendor onboarding', 'COI renewals', 'SOP distribution', 'Supplier recertification'],
    sessionCount: '30–80/mo',
  },
  {
    id: 'hr',
    name: 'HR & People',
    icon: <Users size={18} />,
    color: 'text-pink-600',
    bg: 'bg-pink-50 border-pink-200',
    flows: ['New hire onboarding', 'Performance reviews', 'Benefits enrollment', 'Training cycles'],
    sessionCount: '20–60/mo',
  },
  {
    id: 'sales',
    name: 'Sales & CS',
    icon: <ChartBar size={18} />,
    color: 'text-green-700',
    bg: 'bg-green-50 border-green-200',
    flows: ['Client intake', 'QBR prep', 'NPS collection', 'Renewal risk review'],
    sessionCount: '15–50/mo',
  },
  {
    id: 'product',
    name: 'Product & Eng',
    icon: <Code size={18} />,
    color: 'text-teal-600',
    bg: 'bg-teal-50 border-teal-200',
    flows: ['Sprint recaps', 'User research', 'Stakeholder sign-offs', 'Incident debriefs'],
    sessionCount: '10–30/mo',
  },
  {
    id: 'finance',
    name: 'Finance & Legal',
    icon: <CurrencyDollar size={18} />,
    color: 'text-orange-600',
    bg: 'bg-orange-50 border-orange-200',
    flows: ['Budget reviews', 'Audit evidence', 'Contract sign-offs', 'Policy attestation'],
    sessionCount: '10–25/mo',
  },
  {
    id: 'marketing',
    name: 'Marketing',
    icon: <Megaphone size={18} />,
    color: 'text-rose-600',
    bg: 'bg-rose-50 border-rose-200',
    flows: ['Campaign briefs', 'Performance updates', 'Partner comms', 'Content approvals'],
    sessionCount: '10–30/mo',
  },
  {
    id: 'compliance',
    name: 'Compliance',
    icon: <ShieldCheck size={18} />,
    color: 'text-amber-700',
    bg: 'bg-amber-50 border-amber-200',
    flows: ['Annual attestations', 'SOC 2 evidence', 'License verification', 'DPIA follow-ups'],
    sessionCount: '10–20/mo',
  },
]

/* ─── Playbook entries ─── */
const PLAYBOOK: PlaybookEntry[] = [
  {
    id: 'standup',
    title: 'Weekly Standup Loop',
    owner: 'Team leads / Operations',
    frequency: 'Weekly',
    mode: 'both',
    direction: 'both',
    color: 'text-teal-600',
    accentBg: 'bg-teal-50',
    steps: [
      { label: 'Pull: status collection', type: 'pull', desc: 'Async session sent to each team member Monday morning — what did you ship? what\'s blocked? what\'s your focus this week?' },
      { label: 'AI synthesis', type: 'push', desc: 'Comms aggregates responses, surfaces blockers, flags at-risk items, and generates a structured team digest.' },
      { label: 'Push: digest distributed', type: 'push', desc: 'Queryable recap pushed to all stakeholders — managers, execs, or cross-functional partners can ask questions against it.' },
      { label: 'Sync: escalations only', type: 'sync', desc: 'Only if blockers are flagged does a 15-minute sync get triggered — otherwise the whole cycle is async.' },
    ],
    outcome: 'Full team visibility, blockers surfaced, decisions logged — all before Tuesday 9 AM',
    timeSaved: '3–5 hrs/week vs live standup meetings',
    replaces: 'Daily standup meetings + status Slack threads + end-of-week recap emails',
  },
  {
    id: 'onboarding',
    title: 'New Hire Onboarding (30 days)',
    owner: 'HR & People / Hiring Manager',
    frequency: 'Per hire',
    mode: 'both',
    direction: 'both',
    color: 'text-pink-600',
    accentBg: 'bg-pink-50',
    steps: [
      { label: 'Day 0: Push orientation brief', type: 'push', desc: 'Company overview, team intro, tools setup — new hire reviews at their pace with AI answering every question before Day 1.' },
      { label: 'Day 1: Pull — document collection', type: 'pull', desc: 'I-9, direct deposit, emergency contact, equipment preferences — all collected in a single structured async session.' },
      { label: 'Week 1: Push — role & context briefs', type: 'push', desc: 'Manager shares team OKRs, current projects, key stakeholders, and unwritten rules as a queryable briefing.' },
      { label: 'Day 30: Sync — check-in call', type: 'sync', desc: '30-minute structured sync with manager — agenda auto-generated from the new hire\'s 30-day activity and any flagged questions.' },
    ],
    outcome: 'Fully documented hire, faster time-to-productivity, consistent experience across every new employee',
    timeSaved: '4–6 hrs of manager time vs manual onboarding coordination',
    replaces: 'New hire packet emails + HR form chase + onboarding call scheduling',
  },
  {
    id: 'project-cycle',
    title: 'Project Kickoff to Close',
    owner: 'Project Manager / Team Lead',
    frequency: 'Per project',
    mode: 'both',
    direction: 'both',
    color: 'text-brand-indigo',
    accentBg: 'bg-brand-ghost',
    steps: [
      { label: 'Kickoff: Pull — requirements gathering', type: 'pull', desc: 'Async session to each stakeholder collecting goals, constraints, success criteria, and dependencies before a single meeting.' },
      { label: 'Kickoff sync: structured agenda', type: 'sync', desc: 'Kickoff call with AI-generated agenda from the collected requirements — skip what\'s already aligned, focus on what needs resolution.' },
      { label: 'Weekly: Push — status digest', type: 'push', desc: 'Project status pushed to stakeholders weekly. Queryable — no reply-all needed. Decisions logged.' },
      { label: 'Blocker escalations: async-first', type: 'pull', desc: 'When blockers emerge, structured async session collects input from decision-makers before scheduling a sync.' },
      { label: 'Close: Pull — retrospective', type: 'pull', desc: 'Async retro session to all participants — what worked, what didn\'t, what to change. AI synthesizes themes.' },
    ],
    outcome: 'Aligned kickoff, real-time visibility, documented decisions, structured retro — all in one session chain',
    timeSaved: '2–4 hrs/week per project in status meetings',
    replaces: 'Requirements docs + status meetings + update emails + retro facilitation',
  },
  {
    id: 'performance-review',
    title: 'Performance Review Cycle',
    owner: 'HR / People Ops',
    frequency: 'Quarterly or annual',
    mode: 'both',
    direction: 'both',
    color: 'text-violet-600',
    accentBg: 'bg-violet-50',
    steps: [
      { label: 'Pull: self-assessments', type: 'pull', desc: 'Structured async session to each employee — reflection questions against their goals, rubric, and growth areas.' },
      { label: 'Pull: peer feedback', type: 'pull', desc: 'Structured async session to 3–5 peers per employee — specific competency-based questions, not free-form text.' },
      { label: 'AI synthesis: manager brief', type: 'push', desc: 'Comms generates a structured brief per employee combining self-assessment + peer feedback + prior session context.' },
      { label: 'Sync: 1-on-1 review meeting', type: 'sync', desc: 'Manager and employee meet with AI-generated agenda. Notes, agreements, and development plan captured in session.' },
      { label: 'Push: outcome + next cycle goals', type: 'push', desc: 'Session outcome pushed to HR systems and to the employee as a record — closing the loop.' },
    ],
    outcome: 'Consistent, fair reviews at scale. Manager prep time cut in half. Every decision documented.',
    timeSaved: '1–2 hrs per review vs manual coordination',
    replaces: 'Google Forms self-review + peer feedback email chains + manager prep meetings',
  },
  {
    id: 'okr-checkin',
    title: 'OKR & Goal Check-ins',
    owner: 'Leadership / Chiefs of Staff',
    frequency: 'Monthly or quarterly',
    mode: 'both',
    direction: 'both',
    color: 'text-orange-600',
    accentBg: 'bg-orange-50',
    steps: [
      { label: 'Pull: progress collection', type: 'pull', desc: 'Async session to each team or individual — structured update against each key result with confidence scores and blockers.' },
      { label: 'AI synthesis: executive digest', type: 'push', desc: 'Comms generates a company OKR scorecard ranked by confidence, blockers surfaced, and suggested conversation agenda.' },
      { label: 'Push: all-hands brief', type: 'push', desc: 'Leadership pushes the synthesized OKR state to the full company as a queryable brief before the all-hands.' },
      { label: 'Sync: leadership discussion', type: 'sync', desc: 'Only time needed for a live session is for decisions — agenda pre-built from the data already collected.' },
    ],
    outcome: 'Real-time OKR visibility, no update theater, decisions made with full context',
    timeSaved: '2–3 days vs manual OKR aggregation and slide prep',
    replaces: 'OKR spreadsheet updates + leadership prep calls + all-hands deck preparation',
  },
  {
    id: 'sop-distribution',
    title: 'SOP & Policy Distribution',
    owner: 'Operations / Compliance / Legal',
    frequency: 'On update or annually',
    mode: 'async',
    direction: 'push',
    color: 'text-amber-700',
    accentBg: 'bg-amber-50',
    steps: [
      { label: 'Push: interactive SOP brief', type: 'push', desc: 'New or updated SOP pushed to all relevant team members as a structured briefing — section-by-section with AI answering questions inline.' },
      { label: 'Pull: comprehension check', type: 'pull', desc: 'Short knowledge check per section — not just "I read it" but verification that key points were understood.' },
      { label: 'Pull: acknowledgment + signature', type: 'pull', desc: 'Formal attestation collected at the end with timestamp — audit-ready record per employee.' },
      { label: 'Push: exceptions escalated', type: 'push', desc: 'Anyone who doesn\'t complete within 72 hours is flagged and their manager is notified automatically.' },
    ],
    outcome: 'Confirmed comprehension, signed attestations, zero manual chase, audit trail per person',
    timeSaved: 'Eliminates the entire "did everyone read the policy?" problem',
    replaces: 'Policy emails + "please confirm receipt" replies + attestation spreadsheets',
  },
  {
    id: 'client-rhythm',
    title: 'Customer Success Rhythm',
    owner: 'Customer Success / Account Management',
    frequency: 'Monthly + per milestone',
    mode: 'both',
    direction: 'both',
    color: 'text-green-700',
    accentBg: 'bg-green-50',
    steps: [
      { label: 'Monthly: Push — performance brief', type: 'push', desc: 'Client receives structured monthly usage and outcome report — queryable, not a PDF attachment. They ask questions directly.' },
      { label: 'Quarterly: Pull — QBR prep', type: 'pull', desc: 'Async session collecting stakeholder goals, concerns, and priorities before the QBR — so the meeting focuses on decisions, not data.' },
      { label: 'Sync: QBR meeting', type: 'sync', desc: 'QBR with AI-generated agenda from the collected input. Outcomes and next steps captured in session.' },
      { label: 'Ongoing: Pull — NPS & pulse', type: 'pull', desc: 'Lightweight async session every 60 days — sentiment, blockers, expansion signals. No survey fatigue because it\'s structured and fast.' },
    ],
    outcome: 'Informed clients, proactive risk signals, expansion opportunities surfaced before renewal',
    timeSaved: '3–4 hrs of CS prep per account per quarter',
    replaces: 'Monthly email reports + QBR prep calls + NPS survey tools + renewal prep meetings',
  },
  {
    id: 'allhands',
    title: 'All-Hands Communication Cascade',
    owner: 'Leadership / Chief of Staff',
    frequency: 'Monthly',
    mode: 'both',
    direction: 'push',
    color: 'text-rose-600',
    accentBg: 'bg-rose-50',
    steps: [
      { label: 'Push: pre-read brief', type: 'push', desc: 'Company updates distributed as a queryable brief 48 hours before the all-hands — employees ask questions in advance so leadership can address them live.' },
      { label: 'Sync: all-hands meeting', type: 'sync', desc: 'Meeting time focused on discussion and decisions, not information delivery. AI-generated agenda from the pre-read questions.' },
      { label: 'Push: post-all-hands recap', type: 'push', desc: 'Structured recap pushed to anyone who missed it — queryable, with decisions and action items clearly marked.' },
      { label: 'Pull: follow-up questions', type: 'pull', desc: 'Open session for employees to submit questions or concerns after processing — fed into the next cycle.' },
    ],
    outcome: 'Engaged all-hands, pre-answered questions, documented decisions, inclusive for remote/async employees',
    timeSaved: '4–6 hrs of prep per cycle; meeting time cut by 30–40%',
    replaces: 'All-hands deck + live Q&A (unanswered) + "did you watch the recording?" + follow-up Slack threads',
  },
]

const MODE_COLOR = {
  async: 'bg-orange-50 text-orange-600 border-orange-200',
  sync: 'bg-brand-ghost text-brand-indigo border-brand-indigo/20',
  both: 'bg-green-50 text-green-700 border-green-200',
}
const DIR_COLOR = {
  pull: 'bg-brand-ghost text-brand-indigo',
  push: 'bg-orange-50 text-orange-600',
  both: 'bg-green-50 text-green-700',
}
const STEP_COLOR = {
  pull: 'border-brand-indigo/30 bg-brand-ghost/50',
  push: 'border-orange-200 bg-orange-50/50',
  sync: 'border-violet-200 bg-violet-50/50',
}
const STEP_ICON = {
  pull: <ArrowDown size={10} weight="bold" />,
  push: <ArrowUp size={10} weight="bold" />,
  sync: <ArrowsLeftRight size={10} weight="bold" />,
}

/* ─── Playbook entry card ─── */
function PlaybookCard({ entry }: { entry: PlaybookEntry }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`bg-white rounded-2xl border border-gray-200 overflow-hidden transition-all ${open ? 'shadow-sm' : ''}`}>
      <button onClick={() => setOpen(v => !v)}
        className="w-full text-left px-5 py-4 flex items-center gap-4 hover:bg-gray-50/50 transition-colors">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${entry.accentBg}`}>
          <ListChecks size={16} className={entry.color} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-gray-900 text-sm">{entry.title}</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${MODE_COLOR[entry.mode]}`}>{entry.mode}</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${DIR_COLOR[entry.direction]}`}>{entry.direction}</span>
          </div>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="text-xs text-gray-400">{entry.owner}</span>
            <span className="text-xs text-gray-300">·</span>
            <span className="text-xs text-gray-400">{entry.frequency}</span>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-xs text-green-600 font-semibold hidden sm:block">{entry.timeSaved}</div>
          {open ? <CaretDown size={14} className="text-gray-400" /> : <CaretRight size={14} className="text-gray-400" />}
        </div>
      </button>

      {open && (
        <div className="border-t border-gray-100 px-5 py-5 space-y-5">
          {/* Steps */}
          <div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">The flow</div>
            <div className="space-y-2">
              {entry.steps.map((step, i) => (
                <div key={i} className={`flex items-start gap-3 rounded-xl border px-4 py-3 ${STEP_COLOR[step.type]}`}>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${step.type === 'pull' ? 'bg-brand-indigo text-white' : step.type === 'push' ? 'bg-orange-500 text-white' : 'bg-violet-500 text-white'}`}>
                    {STEP_ICON[step.type]}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-700">{step.label}</div>
                    <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-3">
            <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3">
              <div className="text-xs font-bold text-green-700 mb-1 flex items-center gap-1"><Check size={10} weight="bold" /> Outcome</div>
              <p className="text-xs text-green-900 leading-relaxed">{entry.outcome}</p>
            </div>
            <div className="bg-brand-ghost border border-brand-indigo/20 rounded-xl px-4 py-3">
              <div className="text-xs font-bold text-brand-indigo mb-1 flex items-center gap-1"><Clock size={10} /> Time saved</div>
              <p className="text-xs text-gray-700 leading-relaxed">{entry.timeSaved}</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <div className="text-xs font-bold text-red-500 mb-1">Replaces</div>
              <p className="text-xs text-red-900 leading-relaxed">{entry.replaces}</p>
            </div>
          </div>

          <Link to="/app/dispatcher" className="text-xs font-semibold text-brand-indigo flex items-center gap-1 hover:text-brand-light transition-colors">
            Start this playbook in Dispatcher <ArrowRight size={11} weight="bold" />
          </Link>
        </div>
      )}
    </div>
  )
}

/* ─── Main page ─── */
export function PlaybookPage() {
  const [activeDept, setActiveDept] = useState<string | null>(null)
  const dept = DEPARTMENTS.find(d => d.id === activeDept)

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB]">
      <Nav />

      {/* Hero */}
      <div className="bg-brand-shaft pt-20 pb-12 px-6">
        <div className="max-w-[1100px] mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white/70 text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20 mb-5">
            <Sparkle size={11} weight="fill" className="text-brand-pale" /> Vision
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight max-w-3xl">
            The Comms Company Playbook
          </h1>
          <p className="text-lg text-white/60 max-w-2xl leading-relaxed mb-8">
            What does it look like when a modern company runs its entire internal and external communication through Comms — structured, tracked, outcome-driven? Every update shared, every task delegated, every decision documented.
          </p>
          <div className="grid sm:grid-cols-3 gap-3 max-w-2xl">
            {[
              { label: 'Fewer status meetings', value: '70%', sub: 'replaced by async sessions' },
              { label: 'Hours saved per person', value: '4–6', sub: 'per week in coordination overhead' },
              { label: 'Decisions documented', value: '100%', sub: 'every outcome in a session record' },
            ].map(s => (
              <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-center">
                <div className="text-2xl font-bold text-white">{s.value}</div>
                <div className="text-xs font-bold text-white/60 mt-0.5">{s.label}</div>
                <div className="text-[10px] text-white/30 mt-0.5">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1100px] mx-auto w-full px-6 py-10 space-y-12">

        {/* ── The problem today ── */}
        <section className="grid md:grid-cols-2 gap-5">
          <div className="bg-red-50 border border-red-200 rounded-2xl px-6 py-6">
            <div className="text-xs font-bold text-red-500 uppercase tracking-wider mb-4">How most companies communicate today</div>
            <div className="space-y-3">
              {[
                ['Email threads', 'Status updates buried in replies nobody reads'],
                ['Slack messages', '"Hey, can you do X?" — lost in 48 hours'],
                ['Recurring meetings', 'Status theater that could be an async update'],
                ['Google Forms', 'Sent once, forgotten, <30% completion rate'],
                ['Shared docs', 'Created, updated once, never read again'],
                ['Verbal assignments', '"I thought you were handling that" — every week'],
              ].map(([tool, pain]) => (
                <div key={tool} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5 text-red-400 text-[10px] font-bold">✕</div>
                  <div>
                    <span className="text-sm font-semibold text-gray-900">{tool} </span>
                    <span className="text-sm text-gray-500">— {pain}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-2xl px-6 py-6">
            <div className="text-xs font-bold text-green-700 uppercase tracking-wider mb-4">How a Comms-native company communicates</div>
            <div className="space-y-3">
              {[
                ['Structured sessions', 'Every communication has an agenda, outcome, and record'],
                ['Pull for input', 'Need status? Dispatch — don\'t ask, collect'],
                ['Push for information', 'Share updates as queryable briefs, not walls of text'],
                ['Sync only when necessary', 'Meetings for decisions and relationships, not information transfer'],
                ['Automated follow-up', 'Nothing falls through — non-responses are tracked and escalated'],
                ['Institutional memory', 'Every session is searchable context for the next decision'],
              ].map(([tool, benefit]) => (
                <div key={tool} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={9} weight="bold" className="text-white" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-900">{tool} </span>
                    <span className="text-sm text-gray-500">— {benefit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Company map ── */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-1">Every team. One system.</h2>
          <p className="text-sm text-gray-500 mb-5">Click a department to see which Comms flows they run.</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            {DEPARTMENTS.map(d => (
              <button key={d.id} onClick={() => setActiveDept(activeDept === d.id ? null : d.id)}
                className={`text-left px-4 py-4 rounded-2xl border transition-all ${activeDept === d.id ? `${d.bg} shadow-sm` : 'bg-white border-gray-200 hover:border-gray-300'}`}>
                <div className={`mb-2 ${activeDept === d.id ? d.color : 'text-gray-500'}`}>{d.icon}</div>
                <div className="font-bold text-gray-900 text-sm">{d.name}</div>
                <div className="text-xs text-gray-400 mt-0.5">{d.sessionCount} sessions</div>
              </button>
            ))}
          </div>

          {dept && (
            <div className={`rounded-2xl border px-5 py-4 ${dept.bg}`}>
              <div className={`text-xs font-bold uppercase tracking-wider mb-3 ${dept.color}`}>{dept.name} — key Comms flows</div>
              <div className="flex flex-wrap gap-2">
                {dept.flows.map(f => (
                  <span key={f} className="bg-white text-gray-700 text-sm font-medium px-3.5 py-1.5 rounded-full border border-gray-200 shadow-sm">{f}</span>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* ── A day in the life ── */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-1">A Monday at a Comms-native company</h2>
          <p className="text-sm text-gray-500 mb-5">What actually happens — without a single status meeting.</p>
          <div className="relative">
            <div className="absolute left-[88px] top-0 bottom-0 w-px bg-gray-200" />
            <div className="space-y-4">
              {[
                { time: '7:30 AM', actor: 'Comms', action: 'Sends weekly standup requests to all 24 team members. Each person has until 10 AM.', type: 'pull', who: 'Auto' },
                { time: '8:45 AM', actor: 'You', action: 'Complete your 4-minute standup session — shipped X, blocked on Y, focus is Z.', type: 'pull', who: 'Team' },
                { time: '9:15 AM', actor: 'Comms', action: 'Aggregates all 19 responses so far. Surfaces 2 blockers, 1 at-risk deadline, and generates a team digest.', type: 'push', who: 'Auto' },
                { time: '9:30 AM', actor: 'You', action: 'Read the team digest in 3 minutes. Ask one question about the blocker — AI answers from context.', type: 'push', who: 'You' },
                { time: '10:00 AM', actor: 'Comms', action: 'Sends a queryable performance brief to the 3 enterprise clients with this week\'s usage stats.', type: 'push', who: 'CS' },
                { time: '11:00 AM', actor: 'You', action: 'One 30-min sync to resolve the flagged blocker — agenda pre-built, only the people who need to be there.', type: 'sync', who: 'Eng' },
                { time: '2:00 PM', actor: 'Comms', action: 'Sends the new SOP to the 12 ops team members. Each person completes a 10-min interactive brief at their pace.', type: 'push', who: 'Ops' },
                { time: '4:30 PM', actor: 'Comms', action: '11/12 SOP completions recorded. One person flagged — their manager notified automatically.', type: 'pull', who: 'Auto' },
                { time: '5:00 PM', actor: 'You', action: 'Review your Requests inbox — 2 new async sessions to complete this week. Both due Thursday.', type: 'pull', who: 'You' },
              ].map((item, i) => {
                const colors = {
                  pull: 'bg-brand-indigo',
                  push: 'bg-orange-500',
                  sync: 'bg-violet-500',
                }
                return (
                  <div key={i} className="flex items-start gap-4 relative">
                    <div className="w-[80px] text-right shrink-0 pt-2.5">
                      <span className="text-xs font-semibold text-gray-400">{item.time}</span>
                    </div>
                    <div className={`w-3 h-3 rounded-full mt-2.5 shrink-0 z-10 relative ${colors[item.type as keyof typeof colors]}`} />
                    <div className="flex-1 bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-gray-700">{item.actor}</span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full text-white ${colors[item.type as keyof typeof colors]}`}>{item.type}</span>
                        <span className="text-[10px] text-gray-300 ml-auto">{item.who}</span>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">{item.action}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="mt-4 bg-green-50 border border-green-200 rounded-xl px-5 py-3 text-sm text-green-800">
            <strong>Result:</strong> Full team visibility, 2 blockers resolved, SOP distributed and 92% confirmed, 3 client updates sent, 30 minutes of meetings — and it's not even Tuesday.
          </div>
        </section>

        {/* ── Playbook entries ── */}
        <section>
          <div className="flex items-end justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">The playbook — 8 core workflows</h2>
              <p className="text-sm text-gray-500">Expand any workflow to see the full Comms flow, steps, and what it replaces.</p>
            </div>
            <div className="flex items-center gap-4 text-xs shrink-0">
              <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-brand-indigo" /><span className="text-gray-500">Pull</span></div>
              <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-orange-500" /><span className="text-gray-500">Push</span></div>
              <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-violet-500" /><span className="text-gray-500">Sync</span></div>
            </div>
          </div>
          <div className="space-y-2">
            {PLAYBOOK.map(entry => <PlaybookCard key={entry.id} entry={entry} />)}
          </div>
        </section>

        {/* ── Adoption path ── */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-1">How companies get here</h2>
          <p className="text-sm text-gray-500 mb-5">The adoption path isn't big-bang. It's one workflow at a time, then a team, then a company.</p>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                phase: 'Phase 1',
                label: 'One workflow, one team',
                timeline: 'Week 1–2',
                color: 'text-brand-indigo',
                bg: 'bg-brand-ghost border-brand-indigo/20',
                steps: [
                  'Pick the most painful manual process (usually document collection or standup)',
                  'Run it through Comms for one team — 5–20 people',
                  'Show the outcome: completion rate, time saved, structured record',
                  'The result becomes the internal case study',
                ],
              },
              {
                phase: 'Phase 2',
                label: 'Cross-functional spread',
                timeline: 'Month 1–2',
                color: 'text-violet-600',
                bg: 'bg-violet-50 border-violet-200',
                steps: [
                  'The champion shares the outcome → adjacent team wants to try it',
                  'HR adds onboarding. CS adds client intake. Ops adds vendor management.',
                  'Comms becomes the default for "I need something from someone"',
                  'Session sharing creates viral loops — viewers become dispatchers',
                ],
              },
              {
                phase: 'Phase 3',
                label: 'Company-wide standard',
                timeline: 'Month 3–6',
                color: 'text-green-700',
                bg: 'bg-green-50 border-green-200',
                steps: [
                  '"Use Comms for this" becomes the default response to coordination requests',
                  'Leadership runs OKRs and all-hands through Comms',
                  'New hires experience Comms on Day 0 — it\'s part of how the company works',
                  'Session history becomes institutional memory — searchable, context-rich',
                ],
              },
            ].map(phase => (
              <div key={phase.phase} className={`rounded-2xl border px-5 py-5 ${phase.bg}`}>
                <div className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${phase.color}`}>{phase.phase} · {phase.timeline}</div>
                <h3 className="font-bold text-gray-900 text-base mb-4">{phase.label}</h3>
                <div className="space-y-2">
                  {phase.steps.map((s, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[9px] font-bold text-white ${phase.color.replace('text-', 'bg-')}`}>{i + 1}</div>
                      <span className="text-sm text-gray-600 leading-relaxed">{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── The shift ── */}
        <section className="bg-brand-shaft rounded-2xl px-6 py-8">
          <div className="text-xs font-bold text-brand-pale/50 uppercase tracking-wider mb-4">The fundamental shift</div>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {[
              {
                label: 'Old mental model',
                color: 'text-red-300',
                items: [
                  '"I\'ll shoot them a message and hope they respond"',
                  '"Let\'s schedule a meeting to align on this"',
                  '"Did you see my email about X?"',
                  '"I think we decided Y in that call, but I\'m not sure"',
                  '"We need to follow up with 30 people about this"',
                ],
              },
              {
                label: 'Comms mental model',
                color: 'text-green-400',
                items: [
                  '"I\'ll dispatch a session — they\'ll respond, or Comms will follow up"',
                  '"What actually needs a live discussion? Everything else is async"',
                  '"The session brief went out — it\'s queryable, everyone can ask questions"',
                  '"The outcome is in the session record — timestamped, attributed"',
                  '"The follow-up is configured — it runs automatically until done"',
                ],
              },
            ].map(col => (
              <div key={col.label}>
                <div className={`text-xs font-bold uppercase tracking-wider mb-3 ${col.color}`}>{col.label}</div>
                <div className="space-y-2">
                  {col.items.map(item => (
                    <div key={item} className="flex items-start gap-2 text-sm text-white/60">
                      <span className="w-1 h-1 rounded-full bg-white/20 mt-2 shrink-0" />
                      <em>"{item.replace(/^"/, '').replace(/"$/, '')}"</em>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white/10 border border-white/20 rounded-xl px-5 py-4">
            <div className="flex items-start gap-3">
              <Lightning size={16} weight="fill" className="text-yellow-400 shrink-0 mt-0.5" />
              <p className="text-sm text-white/80 leading-relaxed">
                The shift isn't about replacing human connection — it's about making every structured interaction intentional. The conversations that matter most get <strong className="text-white">more</strong> human attention because the routine coordination that used to drain the day is handled automatically. Comms gives you your time back to spend on the work that actually requires you.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-white border border-gray-200 rounded-2xl px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <div className="font-bold text-gray-900 text-lg mb-1">Start your first playbook workflow</div>
            <p className="text-sm text-gray-500">Pick any workflow from this playbook and dispatch your first session in under 5 minutes.</p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Link to="/app/dispatcher" className="btn-primary whitespace-nowrap">
              Open Dispatcher <ArrowRight size={13} weight="bold" />
            </Link>
            <Link to="/use-cases" className="btn-secondary whitespace-nowrap text-sm py-2.5">
              See all use cases
            </Link>
          </div>
        </section>

      </div>

      <PrototypeBanner
        title="Prototype: Company Playbook"
        description="How a Comms-native company runs operations, project management, and team communication end-to-end."
      />
    </div>
  )
}
