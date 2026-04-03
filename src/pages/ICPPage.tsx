import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Buildings, ArrowRight, Check,
  Sparkle, X, Target, ChartLineUp, Warning,
  Funnel,
} from '@phosphor-icons/react'
import { Nav } from '../components/Nav'
import { PrototypeBanner } from '../components/shared/PrototypeBanner'

/* ─── Types ─── */
interface ICPSegment {
  id: string
  name: string
  role: string
  industry: string[]
  companySize: string
  painPoints: string[]
  trigger: string
  useCases: string[]
  avgSessionsPerMonth: string
  fitScore: number
  fitLabel: 'Perfect fit' | 'Strong fit' | 'Good fit' | 'Partial fit'
  color: string
  accentBg: string
  quote: string
  quoteBy: string
  antiPattern?: string
}

/* ─── Segment data ─── */
const SEGMENTS: ICPSegment[] = [
  {
    id: 'ops',
    name: 'Operations & Vendor Management',
    role: 'COO, Head of Operations, Procurement Manager',
    industry: ['Construction', 'Healthcare', 'Supply Chain', 'Real Estate', 'Professional Services'],
    companySize: '50–500 employees',
    painPoints: [
      'Chasing vendors and contractors for documents over email',
      'Manual follow-up and tracking across dozens of people',
      'No audit trail when compliance issues arise',
      'Onboarding new vendors takes weeks of back-and-forth',
    ],
    trigger: 'A compliance audit, a new vendor class, or a scaling moment where the ops team can\'t manually manage every outreach.',
    useCases: ['Vendor onboarding', 'COI / insurance verification', 'W-9 and NDA collection', 'Supplier recertification', 'Contract document collection'],
    avgSessionsPerMonth: '20–80',
    fitScore: 98,
    fitLabel: 'Perfect fit',
    color: 'text-brand-indigo',
    accentBg: 'bg-brand-ghost',
    quote: 'We used to spend 3 hours a week chasing vendors for certificates. Now it runs itself.',
    quoteBy: 'Head of Operations, ConstructIQ LLC',
  },
  {
    id: 'hr',
    name: 'HR, People Ops & Talent',
    role: 'Head of People, HR Manager, TA Lead, Recruiter',
    industry: ['Tech', 'Staffing', 'Healthcare', 'Retail', 'Logistics'],
    companySize: '30–1,000 employees',
    painPoints: [
      'Screening high volume of candidates without burning the team',
      'Inconsistent interview quality across different interviewers',
      'Slow onboarding experience for new hires and contractors',
      'Training completion rates are low; no visibility into who\'s done',
    ],
    trigger: 'A hiring surge, a new contractor program, or a compliance training cycle where manual coordination breaks down.',
    useCases: ['Candidate screening', 'Technical assessments', 'Contractor onboarding', 'Training & certification', 'Policy acknowledgment'],
    avgSessionsPerMonth: '30–150',
    fitScore: 96,
    fitLabel: 'Perfect fit',
    color: 'text-violet-600',
    accentBg: 'bg-violet-50',
    quote: 'We screened 80 candidates in 3 days without a single recruiter call. Comms handled the entire first round.',
    quoteBy: 'Head of People, Stacked HR',
  },
  {
    id: 'cs',
    name: 'Customer Success & Sales',
    role: 'VP CS, Account Executive, Client Partner, Customer Ops',
    industry: ['SaaS', 'Consulting', 'Financial Services', 'Healthcare IT', 'Legal'],
    companySize: '20–500 employees',
    painPoints: [
      'Discovery calls take too long; clients come underprepared',
      'QBR prep requires manual data gathering from multiple stakeholders',
      'NPS and satisfaction surveys have <15% response rates',
      'Inconsistent client intake across the team',
    ],
    trigger: 'Growing account book where the team can\'t do deep discovery on every account, or a structured process is needed for onboarding or renewals.',
    useCases: ['Client intake & discovery', 'QBR prep', 'NPS & satisfaction', 'Renewal risk review', 'Product feedback collection'],
    avgSessionsPerMonth: '15–60',
    fitScore: 89,
    fitLabel: 'Strong fit',
    color: 'text-green-700',
    accentBg: 'bg-green-50',
    quote: 'Our kickoff calls are now 30 minutes instead of 90 because clients complete async intake first. Game changer.',
    quoteBy: 'VP Customer Success, NexGen Health Partners',
  },
  {
    id: 'compliance',
    name: 'Compliance, Legal & Risk',
    role: 'Chief Compliance Officer, General Counsel, Risk Manager',
    industry: ['Healthcare', 'Finance', 'Real Estate', 'Legal', 'Government', 'Insurance'],
    companySize: '100–5,000 employees',
    painPoints: [
      'Annual policy reviews require attestation from hundreds of employees',
      'SOC 2 / HIPAA evidence gathering is manual and stressful at audit time',
      'No reliable way to verify understanding — just checkbox "I agree"',
      'License and certification tracking is spreadsheet-based',
    ],
    trigger: 'An upcoming audit, a new regulation, or an incident that surfaces gaps in documentation and attestation records.',
    useCases: ['Policy review & attestation', 'SOC 2 / HIPAA evidence collection', 'License verification', 'DPIA follow-ups', 'Compliance certification'],
    avgSessionsPerMonth: '10–40',
    fitScore: 93,
    fitLabel: 'Perfect fit',
    color: 'text-orange-600',
    accentBg: 'bg-orange-50',
    quote: 'We closed a SOC 2 audit in 2 weeks instead of 2 months. Every evidence item was already collected and timestamped.',
    quoteBy: 'Compliance Officer, Solaris Group',
  },
  {
    id: 'ld',
    name: 'Learning & Development',
    role: 'L&D Manager, Training Coordinator, Enablement Lead',
    industry: ['Enterprise Tech', 'Healthcare', 'Financial Services', 'Retail', 'Manufacturing'],
    companySize: '200–10,000 employees',
    painPoints: [
      'LMS completion rates are low and there\'s no engagement data',
      'Role-play and simulation training requires scheduling expensive facilitators',
      'Reps learn the material but can\'t apply it in real conversations',
      'Training programs have no feedback loop or adaptive improvement',
    ],
    trigger: 'A product launch, a skills gap identified in performance reviews, or a compliance deadline that requires measured training completion.',
    useCases: ['Product training & certification', 'Sales role-play simulation', 'Manager conversation coaching', 'Compliance micro-modules', 'Knowledge checks'],
    avgSessionsPerMonth: '50–500',
    fitScore: 85,
    fitLabel: 'Strong fit',
    color: 'text-blue-600',
    accentBg: 'bg-blue-50',
    quote: 'We ran a 120-person product launch training with zero facilitators. Every rep was certified before launch day.',
    quoteBy: 'Enablement Lead, Helix CRM',
  },
  {
    id: 'agency',
    name: 'Agencies & Professional Services',
    role: 'Agency Owner, Project Manager, Delivery Lead',
    industry: ['Marketing', 'Design', 'Consulting', 'Law', 'Accounting', 'PR'],
    companySize: '5–200 employees',
    painPoints: [
      'Client briefings are inconsistent across project managers',
      'Chasing clients for approvals, feedback, and assets eats hours',
      'Onboarding new clients is manual and varies by PM',
      'Hard to run structured retros and capture learnings at scale',
    ],
    trigger: 'Growing client base where the manual process doesn\'t scale, or a quality issue that surfaces inconsistent intake and briefing.',
    useCases: ['Client intake & briefing', 'Asset collection', 'Approval workflows', 'Project retros', 'Contractor screening'],
    avgSessionsPerMonth: '10–50',
    fitScore: 82,
    fitLabel: 'Good fit',
    color: 'text-pink-600',
    accentBg: 'bg-pink-50',
    quote: 'Every new client now goes through the same 8-step intake. Our kickoffs are sharper and our scopes are tighter.',
    quoteBy: 'Agency Owner, Bridgewater Creative',
  },
  {
    id: 'pm',
    name: 'Project & Program Managers',
    role: 'Project Manager, Program Manager, Delivery Manager, PMO Lead',
    industry: ['Tech', 'Construction', 'Consulting', 'Healthcare', 'Government', 'Finance'],
    companySize: '20–2,000 employees',
    painPoints: [
      'Getting status updates from stakeholders requires constant manual chasing',
      'Requirements and sign-offs get lost across email threads and Slack messages',
      'Retrospective learnings are captured inconsistently or not at all',
      'Cross-functional dependencies slip because nobody has a structured check-in',
      'Change approvals and stakeholder reviews take weeks of calendar coordination',
    ],
    trigger: 'A project that slipped because of missed dependencies, a stakeholder who wasn\'t aligned, or a team growing past the point where ad-hoc updates still work.',
    useCases: ['Stakeholder status check-ins', 'Requirements & sign-off collection', 'Risk and blocker capture', 'Project retros', 'Change approval workflows', 'Vendor milestone verification'],
    avgSessionsPerMonth: '10–60',
    fitScore: 87,
    fitLabel: 'Strong fit',
    color: 'text-teal-600',
    accentBg: 'bg-teal-50',
    quote: 'I used to spend Friday afternoons chasing 12 people for status. Now Comms runs a structured check-in on Thursday and I have a summary waiting for me.',
    quoteBy: 'Program Manager, Infrastructure Division',
  },
  {
    id: 'founder',
    name: 'Founders & Early-Stage Execs',
    role: 'Founder, CEO, COO, Head of Growth, VP Operations (seed to Series B)',
    industry: ['SaaS', 'Fintech', 'Healthcare', 'B2B Services', 'Marketplace', 'Proptech'],
    companySize: '2–80 employees',
    painPoints: [
      'Customer discovery interviews are ad hoc — no consistent questions, no structured output',
      'Early hiring is slow and inconsistent; every screen is different',
      'No ops headcount to run structured onboarding or feedback loops',
      'Feedback from early users gets scattered across calls, emails, and Notion',
      'Investor updates and board prep require manually pulling from 10 different sources',
    ],
    trigger: 'Closing a seed round and needing to move fast, hitting product-market fit questions that require structured customer data, or scaling a process the founder was doing manually.',
    useCases: ['Customer discovery interviews', 'Early user feedback collection', 'Candidate screening at small scale', 'Investor update prep', 'Pilot customer onboarding', 'Co-founder / advisor reference checks'],
    avgSessionsPerMonth: '5–30',
    fitScore: 83,
    fitLabel: 'Good fit',
    color: 'text-amber-600',
    accentBg: 'bg-amber-50',
    quote: 'I was doing every customer interview myself. Comms let me run structured discovery with 40 users in a week and get a ranked summary back. That\'s not possible otherwise at our stage.',
    quoteBy: 'Founder, B2B SaaS startup (Series A)',
  },
]

/* ─── Fit calculator ─── */
const QUESTIONS = [
  {
    id: 'role',
    question: 'What\'s your primary role?',
    options: [
      { label: 'Operations / Procurement', icon: '⚙️', segments: ['ops', 'compliance'] },
      { label: 'HR / People / Talent', icon: '👥', segments: ['hr'] },
      { label: 'Customer Success / Sales', icon: '🤝', segments: ['cs'] },
      { label: 'Compliance / Legal', icon: '⚖️', segments: ['compliance'] },
      { label: 'Learning & Development', icon: '📚', segments: ['ld'] },
      { label: 'Agency / Consulting', icon: '🎯', segments: ['agency'] },
      { label: 'Project / Program Management', icon: '📋', segments: ['pm', 'agency'] },
      { label: 'Founder / Early-stage Exec', icon: '🚀', segments: ['founder', 'cs', 'hr'] },
    ],
  },
  {
    id: 'pain',
    question: 'What\'s your biggest bottleneck right now?',
    options: [
      { label: 'Collecting documents from external parties', icon: '📄', segments: ['ops', 'compliance', 'agency'] },
      { label: 'Screening or interviewing at volume', icon: '🔍', segments: ['hr', 'founder'] },
      { label: 'Training completion & retention', icon: '📈', segments: ['ld', 'hr'] },
      { label: 'Client intake & discovery', icon: '💼', segments: ['cs', 'agency', 'founder'] },
      { label: 'Attestation & compliance records', icon: '✅', segments: ['compliance', 'ops'] },
      { label: 'Stakeholder updates & sign-offs', icon: '📋', segments: ['pm', 'agency', 'founder'] },
      { label: 'Following up on anything, at scale', icon: '📬', segments: ['ops', 'hr', 'cs', 'ld', 'agency', 'compliance', 'pm', 'founder'] },
    ],
  },
  {
    id: 'scale',
    question: 'How many people do you need to communicate with monthly?',
    options: [
      { label: '1–20 people', icon: '👤', segments: ['agency', 'cs', 'founder'] },
      { label: '20–100 people', icon: '👥', segments: ['ops', 'cs', 'compliance', 'hr', 'pm', 'founder'] },
      { label: '100–500 people', icon: '🏢', segments: ['hr', 'ld', 'compliance'] },
      { label: '500+ people', icon: '🌐', segments: ['ld', 'compliance', 'hr'] },
    ],
  },
]

/* ─── Anti-ICP ─── */
const ANTI_ICP = [
  { title: 'Consumer / B2C use', reason: 'Comms is built for business-to-many outreach with structured outcomes, not personal one-on-one messaging.' },
  { title: 'Pure marketing campaigns', reason: 'Comms is structured conversation, not broadcast email. Use a marketing automation tool for newsletters and campaigns.' },
  { title: 'Inbound support tickets', reason: 'Comms initiates conversations and gathers structured data. It\'s not a support inbox or ticketing system.' },
  { title: 'Simple surveys (no follow-up)', reason: 'If you just need a Google Form with no follow-up, AI analysis, or session context, Comms is overkill. But if you care about completion rates, insights, and action items — it fits.' },
]

/* ─── Component: Segment card ─── */
function SegmentCard({ seg, selected, onClick }: { seg: ICPSegment; selected: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className={`w-full text-left px-5 py-4 rounded-2xl border transition-all ${selected ? 'border-brand-indigo bg-brand-ghost shadow-sm' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className={`text-xs font-bold uppercase tracking-wider mb-1 ${selected ? 'text-brand-indigo' : 'text-gray-400'}`}>{seg.fitLabel}</div>
          <div className="font-bold text-gray-900 text-sm leading-snug">{seg.name}</div>
          <div className="text-xs text-gray-400 mt-0.5">{seg.role}</div>
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-black text-sm ${selected ? 'bg-brand-indigo text-white' : 'bg-gray-100 text-gray-600'}`}>
          {seg.fitScore}
        </div>
      </div>
      <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-brand-indigo rounded-full transition-all" style={{ width: `${seg.fitScore}%` }} />
      </div>
    </button>
  )
}

/* ─── Main page ─── */
export function ICPPage() {
  const [selectedSeg, setSelectedSeg] = useState<string>('ops')
  const [calcStep, setCalcStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string[]>>({})
  const [calcResult, setCalcResult] = useState<ICPSegment | null>(null)
  const [activeTab, setActiveTab] = useState<'segments' | 'calculator' | 'anti'>('segments')

  const seg = SEGMENTS.find(s => s.id === selectedSeg)!

  function pickAnswer(qId: string, segments: string[]) {
    const newAnswers = { ...answers, [qId]: segments }
    setAnswers(newAnswers)
    if (calcStep < QUESTIONS.length - 1) {
      setCalcStep(s => s + 1)
    } else {
      // Tally scores
      const allMentioned = Object.values(newAnswers).flat()
      const tally: Record<string, number> = {}
      allMentioned.forEach(s => { tally[s] = (tally[s] ?? 0) + 1 })
      const best = Object.entries(tally).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'ops'
      setCalcResult(SEGMENTS.find(s => s.id === best) ?? SEGMENTS[0])
    }
  }

  function resetCalc() {
    setCalcStep(0)
    setAnswers({})
    setCalcResult(null)
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB]">
      <Nav />

      {/* Hero */}
      <div className="bg-white border-b border-gray-100 pt-20 pb-12 px-6">
        <div className="max-w-[1100px] mx-auto">
          <div className="tag bg-brand-ghost text-brand-indigo mb-4">Ideal Customer Profile</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3 leading-tight">
            Who gets the most out of Comms?
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl leading-relaxed">
            Comms is purpose-built for teams that regularly need structured, high-stakes conversations with external people — vendors, candidates, clients, employees — at a scale that manual follow-up can't handle.
          </p>
          <div className="flex gap-3 mt-6">
            <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2">
              <Buildings size={14} className="text-brand-indigo" /> 6 primary ICP segments
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2">
              <Target size={14} className="text-brand-indigo" /> Fit score 82–98
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2">
              <Funnel size={14} className="text-brand-indigo" /> Interactive fit calculator
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-[1100px] mx-auto w-full px-6 py-8">

        {/* Tab switcher */}
        <div className="flex gap-2 mb-8">
          {([
            { id: 'segments', label: 'ICP Segments' },
            { id: 'calculator', label: 'Fit Calculator' },
            { id: 'anti', label: 'Anti-ICP' },
          ] as const).map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${activeTab === t.id ? 'bg-brand-indigo text-white border-brand-indigo' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Segments tab ── */}
        {activeTab === 'segments' && (
          <div className="grid lg:grid-cols-[320px_1fr] gap-5">

            {/* Left: segment list */}
            <div className="space-y-2">
              {SEGMENTS.map(s => (
                <SegmentCard key={s.id} seg={s} selected={selectedSeg === s.id} onClick={() => setSelectedSeg(s.id)} />
              ))}
            </div>

            {/* Right: segment detail */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">

              {/* Header */}
              <div className={`px-6 py-5 border-b border-gray-100 ${seg.accentBg}`}>
                <div className={`text-xs font-bold uppercase tracking-wider mb-1.5 ${seg.color}`}>{seg.fitLabel} · {seg.fitScore}/100</div>
                <h2 className="text-xl font-bold text-gray-900">{seg.name}</h2>
                <div className="text-sm text-gray-500 mt-1">{seg.role}</div>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {seg.industry.map(i => <span key={i} className="text-xs bg-white/80 border border-gray-200 text-gray-600 px-2.5 py-1 rounded-full">{i}</span>)}
                </div>
              </div>

              <div className="px-6 py-5 space-y-6">

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-xl px-4 py-3">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Company size</div>
                    <div className="text-sm font-bold text-gray-900">{seg.companySize}</div>
                  </div>
                  <div className="bg-gray-50 rounded-xl px-4 py-3">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Sessions / month</div>
                    <div className="text-sm font-bold text-gray-900">{seg.avgSessionsPerMonth}</div>
                  </div>
                </div>

                {/* Pain points */}
                <div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Pain points Comms solves</div>
                  <div className="space-y-2">
                    {seg.painPoints.map(p => (
                      <div key={p} className="flex items-start gap-2.5">
                        <div className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
                          <X size={8} weight="bold" className="text-red-500" />
                        </div>
                        <span className="text-sm text-gray-600">{p}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Use cases */}
                <div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Primary use cases</div>
                  <div className="flex flex-wrap gap-2">
                    {seg.useCases.map(u => (
                      <span key={u} className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${seg.accentBg} ${seg.color} border-current/20`}>{u}</span>
                    ))}
                  </div>
                </div>

                {/* Trigger */}
                <div className="bg-brand-shaft rounded-2xl px-5 py-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkle size={12} weight="fill" className="text-brand-pale" />
                    <span className="text-xs font-bold text-brand-pale/70 uppercase tracking-wider">Buying trigger</span>
                  </div>
                  <p className="text-sm text-white/80 leading-relaxed">{seg.trigger}</p>
                </div>

                {/* Quote */}
                <div className="border-l-2 border-brand-indigo pl-4">
                  <p className="text-sm text-gray-700 italic leading-relaxed">"{seg.quote}"</p>
                  <div className="text-xs text-gray-400 mt-1.5">— {seg.quoteBy}</div>
                </div>

                {/* CTA */}
                <Link to="/app/dispatcher" className="btn-primary w-full justify-center text-sm py-3">
                  Explore Dispatcher for this use case <ArrowRight size={13} weight="bold" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ── Fit Calculator tab ── */}
        {activeTab === 'calculator' && (
          <div className="max-w-xl mx-auto">
            {calcResult ? (
              <div className="bg-white rounded-2xl border border-brand-indigo/30 overflow-hidden shadow-sm">
                <div className={`px-6 py-5 ${calcResult.accentBg} border-b border-gray-100`}>
                  <div className="flex items-center gap-2 mb-2">
                    <ChartLineUp size={16} className={calcResult.color} />
                    <span className={`text-xs font-bold uppercase tracking-wider ${calcResult.color}`}>Your best fit</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">{calcResult.name}</h2>
                  <div className="flex items-center gap-3 mt-3">
                    <div className="h-2 flex-1 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-indigo rounded-full" style={{ width: `${calcResult.fitScore}%` }} />
                    </div>
                    <span className="text-sm font-bold text-brand-indigo">{calcResult.fitScore}/100 fit</span>
                  </div>
                </div>
                <div className="px-6 py-5 space-y-4">
                  <div>
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Why you fit</div>
                    <div className="space-y-2">
                      {calcResult.painPoints.slice(0, 3).map(p => (
                        <div key={p} className="flex items-start gap-2.5">
                          <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                            <Check size={8} weight="bold" className="text-green-600" />
                          </div>
                          <span className="text-sm text-gray-600">{p}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {calcResult.useCases.map(u => (
                      <span key={u} className={`text-xs font-semibold px-3 py-1.5 rounded-full ${calcResult.accentBg} ${calcResult.color} border border-current/10`}>{u}</span>
                    ))}
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Link to="/app/dispatcher" className="btn-primary flex-1 justify-center text-sm py-2.5">
                      Try Dispatcher <ArrowRight size={13} weight="bold" />
                    </Link>
                    <button onClick={resetCalc} className="btn-secondary text-sm py-2.5 px-4">Retake</button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                {/* Progress */}
                <div className="px-6 py-4 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Question {calcStep + 1} of {QUESTIONS.length}</span>
                    <span className="text-xs text-gray-400">{Math.round((calcStep / QUESTIONS.length) * 100)}% complete</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-indigo rounded-full transition-all" style={{ width: `${(calcStep / QUESTIONS.length) * 100}%` }} />
                  </div>
                </div>

                <div className="px-6 py-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-5">{QUESTIONS[calcStep].question}</h3>
                  <div className="space-y-2">
                    {QUESTIONS[calcStep].options.map(o => (
                      <button key={o.label} onClick={() => pickAnswer(QUESTIONS[calcStep].id, o.segments)}
                        className="w-full text-left flex items-center gap-3 px-4 py-3.5 bg-gray-50 hover:bg-brand-ghost border border-gray-200 hover:border-brand-indigo/30 rounded-xl transition-all group">
                        <span className="text-xl">{o.icon}</span>
                        <span className="text-sm font-medium text-gray-700 group-hover:text-brand-indigo">{o.label}</span>
                        <ArrowRight size={13} className="text-gray-300 group-hover:text-brand-indigo ml-auto" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Anti-ICP tab ── */}
        {activeTab === 'anti' && (
          <div className="max-w-2xl">
            <div className="bg-orange-50 border border-orange-200 rounded-2xl px-5 py-4 mb-6 flex items-start gap-3">
              <Warning size={18} className="text-orange-500 shrink-0 mt-0.5" />
              <p className="text-sm text-orange-800 leading-relaxed">
                Comms is a strong product for the right customer — and a poor fit for others. Knowing who <strong>not</strong> to target is as valuable as knowing who to pursue.
              </p>
            </div>
            <div className="space-y-3">
              {ANTI_ICP.map(a => (
                <div key={a.title} className="bg-white border border-gray-200 rounded-2xl px-5 py-4 flex items-start gap-4">
                  <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center shrink-0 mt-0.5">
                    <X size={14} weight="bold" className="text-red-400" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 mb-1">{a.title}</div>
                    <p className="text-sm text-gray-500 leading-relaxed">{a.reason}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* The right customers vs wrong */}
            <div className="mt-8 grid sm:grid-cols-2 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-2xl px-5 py-5">
                <div className="text-xs font-bold text-green-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Check size={12} weight="bold" /> Strong ICP signals
                </div>
                <ul className="space-y-2 text-sm text-green-800">
                  {[
                    'Has a recurring need to collect or verify info from external parties',
                    'Does manual follow-up today via email or phone',
                    'Has experienced a compliance or audit failure',
                    'Has a team spending >2 hrs/week on communication logistics',
                    'Wants a structured outcome, not just a conversation',
                  ].map(s => <li key={s} className="flex items-start gap-2"><span className="w-1 h-1 rounded-full bg-green-500 mt-2 shrink-0" />{s}</li>)}
                </ul>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-5">
                <div className="text-xs font-bold text-red-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <X size={12} weight="bold" /> Poor fit signals
                </div>
                <ul className="space-y-2 text-sm text-red-800">
                  {[
                    'Needs a broadcast / announcement channel (Slack, email newsletter)',
                    'Wants real-time live support or ticketing',
                    'Has no defined workflow — just wants "AI to answer questions"',
                    'Entirely B2C or consumer-facing with no structured outcome',
                    'Team of one with <5 external contacts per month',
                  ].map(s => <li key={s} className="flex items-start gap-2"><span className="w-1 h-1 rounded-full bg-red-400 mt-2 shrink-0" />{s}</li>)}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Early Adopters & Individual Decision Makers section ── */}
      <div className="bg-white border-t border-gray-100 px-6 py-10">
        <div className="max-w-[1100px] mx-auto">
          <div className="mb-8">
            <div className="tag bg-amber-50 text-amber-700 border border-amber-200 mb-3">Buyer psychographics</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Early adopters & individual decision makers</h2>
            <p className="text-gray-500 text-base max-w-2xl leading-relaxed">
              Beyond job title and industry, the people who adopt Comms first share a specific mindset and buying authority. These two profiles predict adoption more reliably than any firmographic filter.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-5">

            {/* Early Adopter */}
            <div className="bg-gradient-to-br from-[#0D1117] to-[#1a2744] rounded-2xl overflow-hidden">
              <div className="px-6 py-5 border-b border-white/10">
                <div className="text-[10px] font-bold text-brand-pale/50 uppercase tracking-wider mb-1.5">Profile 1</div>
                <h3 className="text-xl font-bold text-white">The Early Adopter</h3>
                <p className="text-sm text-white/50 mt-1">Already solving this with a worse tool — ready to upgrade</p>
              </div>
              <div className="px-6 py-5 space-y-5">

                {/* Signals */}
                <div>
                  <div className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3">How to spot them</div>
                  <div className="space-y-2.5">
                    {[
                      { icon: '📋', text: 'Uses Google Forms or Typeform for structured collection — frustrated by low completion rates and no follow-up' },
                      { icon: '📧', text: 'Manages vendor or candidate outreach manually in Gmail — has a "follow up" folder or a spreadsheet with status columns' },
                      { icon: '🔁', text: 'Sends the same kind of message every week or month — onboarding new people, collecting recurring documents, running check-ins' },
                      { icon: '😤', text: 'Has complained about this specific problem in the last 30 days — it\'s not theoretical pain, it\'s active frustration' },
                      { icon: '🚀', text: 'Already uses tools like Calendly, Loom, or Notion — comfort with async, structured workflows, and outcome-oriented tools' },
                    ].map(s => (
                      <div key={s.icon} className="flex items-start gap-3">
                        <span className="text-base shrink-0 mt-0.5">{s.icon}</span>
                        <span className="text-sm text-white/70 leading-relaxed">{s.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Aha moment */}
                <div className="bg-white/5 rounded-xl px-4 py-4 border border-white/10">
                  <div className="text-xs font-bold text-brand-pale/60 uppercase tracking-wider mb-2">Their aha moment</div>
                  <p className="text-sm text-white/80 leading-relaxed italic">
                    "Wait — it writes the conversation draft for me, sends it, follows up automatically, and gives me a summary when everyone's done? That's the thing I've been trying to build in Zapier for two years."
                  </p>
                </div>

                {/* What converts them */}
                <div>
                  <div className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2">What converts them</div>
                  <div className="space-y-1.5">
                    {[
                      'A shared session link from someone they trust (zero-friction first impression)',
                      'Seeing their exact workflow in a pre-built template at sign-up',
                      'Completing their first dispatch in under 5 minutes',
                    ].map(c => (
                      <div key={c} className="flex items-start gap-2 text-sm text-white/60">
                        <Check size={13} className="text-green-400 mt-0.5 shrink-0" />
                        {c}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Individual Decision Maker */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl overflow-hidden">
              <div className="px-6 py-5 border-b border-amber-200">
                <div className="text-[10px] font-bold text-amber-600/70 uppercase tracking-wider mb-1.5">Profile 2</div>
                <h3 className="text-xl font-bold text-gray-900">The Individual Decision Maker</h3>
                <p className="text-sm text-gray-500 mt-1">Can sign up, pay, and go live without committee approval</p>
              </div>
              <div className="px-6 py-5 space-y-5">

                {/* Who they are */}
                <div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Who they are</div>
                  <div className="space-y-2.5">
                    {[
                      { role: 'Head of Ops at 30–200 person company', note: 'Owns the vendor and contractor workflow end-to-end. Decides tools, runs processes, feels the pain directly.' },
                      { role: 'Solo or small-team recruiter', note: 'Runs the full hiring loop. No procurement process for SaaS tools under $500/mo. Will trial anything that saves time.' },
                      { role: 'Founder (pre-Series B)', note: 'Uses a personal card or company card. Decides in an afternoon. Will pilot with their first real workflow immediately.' },
                      { role: 'PM or team lead who owns a workflow', note: 'Has budget authority or can get manager approval in one Slack message. Controls the process they\'ll use it for.' },
                      { role: 'Compliance officer at mid-market', note: 'Has discretionary budget for audit-related tooling. Justified with one audit prep cycle.' },
                    ].map(p => (
                      <div key={p.role} className="bg-white rounded-xl px-4 py-3 border border-amber-100">
                        <div className="text-sm font-bold text-gray-900 mb-0.5">{p.role}</div>
                        <div className="text-xs text-gray-500 leading-relaxed">{p.note}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Why they matter */}
                <div className="bg-amber-100 rounded-xl px-4 py-4 border border-amber-200">
                  <div className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-2">Why this profile drives growth</div>
                  <p className="text-sm text-amber-900 leading-relaxed">
                    Individual decision makers don't need a demo, a procurement process, or a multi-stakeholder sign-off. They sign up, run a session with real data, get a result — and then forward the outcome to their manager. That forwarded report is the expansion moment: the manager becomes a new dispatcher, or approves a team-wide rollout.
                  </p>
                </div>

                {/* Anti-pattern */}
                <div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Who is NOT this profile</div>
                  <div className="space-y-1.5">
                    {[
                      'IT or security teams evaluating tools for others (long cycle, procurement gate)',
                      'Middle managers who need 3 layers of approval to expense $50/mo',
                      'People who need to "get buy-in" before they can even try it',
                    ].map(a => (
                      <div key={a} className="flex items-start gap-2 text-sm text-gray-500">
                        <X size={12} weight="bold" className="text-red-400 mt-0.5 shrink-0" />
                        {a}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Overlap callout */}
          <div className="mt-5 bg-brand-ghost border border-brand-indigo/20 rounded-2xl px-6 py-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-brand-indigo flex items-center justify-center shrink-0">
              <Sparkle size={16} weight="fill" className="text-white" />
            </div>
            <div>
              <div className="font-bold text-gray-900 mb-1">The sweet spot: both at once</div>
              <p className="text-sm text-gray-600 leading-relaxed max-w-3xl">
                The highest-converting prospect is someone who is <strong>both</strong> an early adopter <em>and</em> an individual decision maker — they feel the pain personally, have the authority to act, and don't need permission. A Head of Operations at a 60-person company who's been chasing vendors over email for two years fits both profiles perfectly. Target this overlap first.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ICP summary strip */}
      <div className="bg-white border-t border-gray-100 px-6 py-4">
        <div className="max-w-[1100px] mx-auto flex flex-wrap gap-2 items-center">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-2">ICP segments:</span>
          {SEGMENTS.map(s => (
            <button key={s.id} onClick={() => { setSelectedSeg(s.id); setActiveTab('segments') }}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${selectedSeg === s.id && activeTab === 'segments' ? 'bg-brand-indigo text-white border-brand-indigo' : `${s.accentBg} ${s.color} border-current/20 hover:border-current/40`}`}>
              {s.fitScore} · {s.name.split(' ')[0]}
            </button>
          ))}
          <Link to="/use-cases" className="ml-auto text-xs font-semibold text-brand-indigo flex items-center gap-1 hover:text-brand-light transition-colors">
            See all 27 use cases <ArrowRight size={11} weight="bold" />
          </Link>
        </div>
      </div>

      <PrototypeBanner
        title="Prototype: ICP Explorer"
        description="8 ICP segments, fit calculator, anti-ICP patterns, and early adopter / decision maker psychographic profiles."
      />
    </div>
  )
}
