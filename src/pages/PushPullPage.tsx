import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowDown, ArrowUp, ArrowsLeftRight, Sparkle, ArrowRight,
  Users, EnvelopeSimple, VideoCamera, Phone, Check,
  Megaphone, ClipboardText, ChartBar, CalendarCheck,
  ChatTeardropText, Broadcast,
} from '@phosphor-icons/react'
import { Nav } from '../components/Nav'
import { PrototypeBanner } from '../components/shared/PrototypeBanner'

/* ─── Types ─── */
interface PushScenario {
  id: string
  title: string
  category: string
  icon: React.ReactNode
  color: string
  accentBg: string
  borderColor: string
  what: string
  syncExperience: { label: string; description: string; example: string }
  asyncExperience: { label: string; description: string; example: string }
  outcome: string
  pullCounterpart: string
  combined?: string
}

/* ─── Push scenarios ─── */
const PUSH_SCENARIOS: PushScenario[] = [
  {
    id: 'job-opportunity',
    title: 'Job Opportunity Outreach',
    category: 'Recruiting',
    icon: <Users size={18} />,
    color: 'text-violet-600',
    accentBg: 'bg-violet-50',
    borderColor: 'border-violet-200',
    what: 'You have a role. You want to present it to a candidate — explain the opportunity, the team, the comp, the growth path — and see if they\'re interested before you ask them to invest in a full screen.',
    syncExperience: {
      label: 'Live opportunity briefing',
      description: 'A 15-minute sync call where the AI walks the candidate through the role — company context, responsibilities, what success looks like — and fields their questions in real time. You get a transcript + interest signal at the end.',
      example: '"Hi Jordan — I\'m reaching out about a Senior Backend Engineer role at Helix. I\'d love 15 minutes to walk you through the opportunity. Here\'s a link to book a time that works for you."',
    },
    asyncExperience: {
      label: 'Interactive role brief',
      description: 'The candidate gets a structured role presentation they can explore at their own pace. Each section (team, stack, comp, growth) has an AI chat panel — they can ask "What does the on-call rotation look like?" and get a real answer. They signal interest at the end.',
      example: '"Hi Jordan — I thought this role might be a great fit. Take 10 minutes to review it when you have a chance. You can ask questions about anything in the brief directly."',
    },
    outcome: 'Interest/pass signal, specific questions asked (reveals what they care about), availability for next step if interested',
    pullCounterpart: 'Candidate screening — after they express interest, pull their experience, motivations, and qualifications',
    combined: 'Push the opportunity → pull the screen. The candidate who engages with the brief is already warm when the structured screen begins.',
  },
  {
    id: 'performance-update',
    title: 'Performance & Campaign Updates',
    category: 'Operations / Marketing',
    icon: <ChartBar size={18} />,
    color: 'text-blue-600',
    accentBg: 'bg-blue-50',
    borderColor: 'border-blue-200',
    what: 'You have results — Q2 numbers, campaign performance, pipeline stats, weekly metrics — and you need stakeholders, clients, or your team to actually understand them, not just receive a PDF.',
    syncExperience: {
      label: 'Live results walkthrough',
      description: 'A structured 20–30 minute sync where the AI presents the data section by section, pauses for questions, and captures action items. The structured agenda means nothing gets skipped. Transcript + action item list auto-generated.',
      example: '"Q2 Business Review — Campaign spend: $14K, leads: 847, conversion: 4.2%. Join this 20-min review to walk through what worked, what didn\'t, and what we\'re changing."',
    },
    asyncExperience: {
      label: 'Queryable performance brief',
      description: 'Send the results as a structured briefing the recipient can ask questions against. "What\'s the cost per lead compared to Q1?" "Which campaign drove the most pipeline?" The AI answers from the dataset. No meeting needed for the basics.',
      example: '"Here are the Q2 results — $14K spent, 847 leads, 4.2% conversion. Ask any questions you have directly in the brief. I\'ll flag anything that needs a sync."',
    },
    outcome: 'Acknowledged + questions captured, action items assigned, decisions logged — no meeting required for routine updates',
    pullCounterpart: 'Stakeholder feedback collection — pull reactions, priorities, and decisions from the audience after they\'ve reviewed the data',
    combined: 'Push the brief → pull specific approvals or decisions. E.g. push the campaign results, then pull sign-off on the next budget allocation.',
  },
  {
    id: 'benefits-enrollment',
    title: 'Benefits Enrollment & Policy Updates',
    category: 'HR / People Ops',
    icon: <ClipboardText size={18} />,
    color: 'text-green-700',
    accentBg: 'bg-green-50',
    borderColor: 'border-green-200',
    what: 'You need to walk employees through plan options, explain what changed from last year, answer their questions, and collect their selections — all in a way that\'s actually understood, not just clicked through.',
    syncExperience: {
      label: 'Live enrollment walkthrough',
      description: 'A guided 20-minute sync where the agent presents each plan option with plain-language explanations, fields questions ("Does the HSA plan cover orthodontics?"), and walks the employee to their selection. Especially useful for employees with dependents or complex situations.',
      example: '"Open enrollment starts Nov 1. Book a 20-min guided session to have every option explained and your questions answered — then select your plan with full confidence."',
    },
    asyncExperience: {
      label: 'Interactive benefits guide',
      description: 'Each plan option is presented with comparisons, cost calculators, and an AI chat panel for questions. Employees work at their own pace, ask as many questions as they need, and submit their selection at the end. Completion tracked; reminders auto-sent to those who haven\'t enrolled.',
      example: '"Open enrollment is open. Review your options, compare plans, ask questions, and submit your selection — all in one place. Deadline: Nov 15."',
    },
    outcome: 'Plan selections confirmed, questions answered, election deadline met, exception-flagged employees identified for HR follow-up',
    pullCounterpart: 'Policy attestation — after explaining the policy, pull acknowledgment and understanding verification',
    combined: 'Push the plan details → pull the selection + attestation. One session handles the full enrollment cycle.',
  },
  {
    id: 'franchise-ops',
    title: 'Franchise & Distributed Team Updates',
    category: 'Operations / Franchise',
    icon: <Broadcast size={18} />,
    color: 'text-orange-600',
    accentBg: 'bg-orange-50',
    borderColor: 'border-orange-200',
    what: 'You need to get operational changes, new playbooks, pricing updates, or brand standards to 50 locations or 200 field reps — and actually verify they understood it, not just open the email.',
    syncExperience: {
      label: 'Structured ops briefing (cohorts)',
      description: 'Break the field team into cohorts of 10–20. Each cohort gets a live 25-minute structured briefing — the agent walks through the update section by section, takes questions, and runs a short comprehension check at the end. Scales to hundreds with back-to-back cohort sessions.',
      example: '"Q3 Ops Update — new pricing, vendor changes, and safety protocol revisions. Join your regional cohort session (25 min). Your slot: [link]."',
    },
    asyncExperience: {
      label: 'Interactive ops update',
      description: 'Each team member gets a self-paced briefing they can complete between shifts. Section-by-section with embedded Q&A, short knowledge checks per section, and acknowledgment at the end. Completion tracked per location. Exceptions (no completion after 72hrs) auto-escalated.',
      example: '"Q3 Ops Update is live. Review the 3 changes at your pace — it takes about 12 minutes. Acknowledgment required by Friday."',
    },
    outcome: 'Completion rate by location, knowledge check scores, questions asked (surfaces confusion), acknowledgments logged for compliance',
    pullCounterpart: 'Compliance verification — pull confirmation that the updated procedures are being followed in the field',
    combined: 'Push the update → pull understanding verification. The session both informs and confirms — no separate audit needed.',
  },
  {
    id: 'standup-recap',
    title: 'Team Recaps & Status Digests',
    category: 'Team Operations',
    icon: <CalendarCheck size={18} />,
    color: 'text-teal-600',
    accentBg: 'bg-teal-50',
    borderColor: 'border-teal-200',
    what: 'Sending a weekly standup summary, sprint recap, or project status update to stakeholders who weren\'t in the room — but making it interactive so they can actually ask follow-up questions instead of just reading a wall of text.',
    syncExperience: {
      label: 'Live async-to-sync handoff',
      description: 'For high-stakes recaps (board updates, exec reviews), a short 15-minute sync where the agent presents the summary, fields questions, and captures decisions. Especially useful when the audience needs to make a call based on the recap.',
      example: '"Sprint 24 recap ready — 6 stories shipped, 2 deferred, 3 bugs resolved. Join a 15-min session if you want to discuss priorities for Sprint 25."',
    },
    asyncExperience: {
      label: 'Queryable recap',
      description: 'The recap is sent as a structured brief with an AI Q&A layer. Recipients can ask "What\'s blocking the API migration?" or "Who owns the customer data work?" and get answers from the session context. No reply-all email chains.',
      example: '"Here\'s the Sprint 24 recap. Ask any questions you have directly — I\'ll flag anything that needs a meeting. Key items: [summary]."',
    },
    outcome: 'Stakeholders informed and unblocked, questions answered asynchronously, escalations identified, meeting time recovered',
    pullCounterpart: 'Status collection — pull standup updates from each team member before generating the recap to send',
    combined: 'Pull individual statuses → AI synthesizes → push the structured recap. One Comms session handles the full standup cycle.',
  },
]

/* ─── Spectrum items ─── */
const SPECTRUM_ITEMS = [
  { label: 'Pure Pull', sub: 'Document collection', side: 'pull', pct: 5 },
  { label: 'Mostly Pull', sub: 'Candidate screening', side: 'pull', pct: 25 },
  { label: 'Pull-leaning', sub: 'Client intake', side: 'pull', pct: 42 },
  { label: 'Both', sub: 'Benefits enrollment', side: 'center', pct: 50 },
  { label: 'Push-leaning', sub: 'Job opportunity', side: 'push', pct: 58 },
  { label: 'Mostly Push', sub: 'Performance update', side: 'push', pct: 75 },
  { label: 'Pure Push', sub: 'Policy announcement', side: 'push', pct: 95 },
]

/* ─── Page ─── */
export function PushPullPage() {
  const [activeScenario, setActiveScenario] = useState('job-opportunity')
  const [activeMode, setActiveMode] = useState<'async' | 'sync'>('async')

  const scenario = PUSH_SCENARIOS.find(s => s.id === activeScenario)!

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB]">
      <Nav />

      {/* Hero */}
      <div className="bg-white border-b border-gray-100 pt-20 pb-12 px-6">
        <div className="max-w-[1100px] mx-auto">
          <div className="tag bg-brand-ghost text-brand-indigo mb-4">Communication model</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3 leading-tight">
            Push vs Pull — two ways to work with humans
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl leading-relaxed">
            Most of Comms is Pull: you need something <em>from</em> someone. But just as much of daily work is Push: you need to get something <em>to</em> someone — and actually have them understand it, engage with it, and act on it.
          </p>
          <div className="grid sm:grid-cols-3 gap-4 mt-8">
            {[
              { icon: <ArrowDown size={16} />, label: 'Pull', desc: 'Collect, verify, assess, schedule — you need something from them', color: 'text-brand-indigo', bg: 'bg-brand-ghost border-brand-indigo/20' },
              { icon: <ArrowUp size={16} />, label: 'Push', desc: 'Inform, brief, present, distribute — you need to get something to them', color: 'text-orange-600', bg: 'bg-orange-50 border-orange-200' },
              { icon: <ArrowsLeftRight size={16} />, label: 'Both', desc: 'Most real workflows — push the context, pull the response or decision', color: 'text-green-700', bg: 'bg-green-50 border-green-200' },
            ].map(c => (
              <div key={c.label} className={`rounded-2xl border px-5 py-4 ${c.bg}`}>
                <div className={`flex items-center gap-2 font-bold text-base mb-1.5 ${c.color}`}>
                  {c.icon} {c.label}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1100px] mx-auto w-full px-6 py-10 space-y-12">

        {/* ── The spectrum ── */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-1">The push–pull spectrum</h2>
          <p className="text-sm text-gray-500 mb-6">Most workflows aren't purely one or the other. The real question is: where does this scenario sit?</p>
          <div className="bg-white border border-gray-200 rounded-2xl px-6 py-6">
            {/* Bar */}
            <div className="relative h-8 rounded-full bg-gradient-to-r from-brand-indigo via-green-400 to-orange-500 mb-4">
              <div className="absolute inset-0 flex items-center justify-between px-4 text-xs font-bold text-white">
                <span>← Pull</span>
                <span>Push →</span>
              </div>
            </div>
            {/* Markers */}
            <div className="relative h-14">
              {SPECTRUM_ITEMS.map(item => (
                <div key={item.label} className="absolute top-0 -translate-x-1/2 text-center" style={{ left: `${item.pct}%` }}>
                  <div className={`w-2 h-2 rounded-full mx-auto mb-1 ${item.side === 'pull' ? 'bg-brand-indigo' : item.side === 'push' ? 'bg-orange-500' : 'bg-green-500'}`} />
                  <div className="text-[10px] font-bold text-gray-700 whitespace-nowrap">{item.label}</div>
                  <div className="text-[9px] text-gray-400 whitespace-nowrap">{item.sub}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 grid sm:grid-cols-2 gap-4 text-sm text-gray-500">
              <div><strong className="text-gray-700">What makes something Pull:</strong> You need data, documents, answers, or decisions from the other person before you can proceed.</div>
              <div><strong className="text-gray-700">What makes something Push:</strong> You have information the other person needs — and you need them to receive, understand, and act on it.</div>
            </div>
          </div>
        </section>

        {/* ── Push scenario explorer ── */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-1">Push scenario explorer</h2>
          <p className="text-sm text-gray-500 mb-5">Select a scenario to see how Comms handles it — both synchronously and asynchronously.</p>

          {/* Scenario tabs */}
          <div className="flex flex-wrap gap-2 mb-5">
            {PUSH_SCENARIOS.map(s => (
              <button key={s.id} onClick={() => setActiveScenario(s.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold border transition-all ${activeScenario === s.id ? 'bg-brand-indigo text-white border-brand-indigo' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}>
                <span className={activeScenario === s.id ? 'text-white' : s.color}>{s.icon}</span>
                {s.title}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            {/* Scenario header */}
            <div className={`px-6 py-5 border-b border-gray-100 ${scenario.accentBg}`}>
              <div className={`text-[10px] font-bold uppercase tracking-wider mb-1.5 ${scenario.color}`}>{scenario.category} · Push scenario</div>
              <h3 className="text-xl font-bold text-gray-900">{scenario.title}</h3>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed max-w-2xl">{scenario.what}</p>
            </div>

            {/* Mode toggle */}
            <div className="flex border-b border-gray-100">
              {(['async', 'sync'] as const).map(mode => (
                <button key={mode} onClick={() => setActiveMode(mode)}
                  className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-colors border-b-2 ${activeMode === mode ? 'border-brand-indigo text-brand-indigo bg-brand-ghost/50' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
                  {mode === 'sync' ? <><VideoCamera size={14} /> Synchronous (live)</>
                    : <><EnvelopeSimple size={14} /> Asynchronous (their pace)</>}
                </button>
              ))}
            </div>

            <div className="px-6 py-5 grid md:grid-cols-2 gap-6">
              {/* Experience */}
              <div>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                  {activeMode === 'sync' ? scenario.syncExperience.label : scenario.asyncExperience.label}
                </div>
                <p className="text-sm text-gray-700 leading-relaxed mb-4">
                  {activeMode === 'sync' ? scenario.syncExperience.description : scenario.asyncExperience.description}
                </p>
                {/* Example message */}
                <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Example outreach</div>
                  <p className="text-sm text-gray-600 italic leading-relaxed">
                    {activeMode === 'sync' ? scenario.syncExperience.example : scenario.asyncExperience.example}
                  </p>
                </div>
              </div>

              {/* Outcome + counterpart */}
              <div className="space-y-4">
                <div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">What you get back</div>
                  <p className="text-sm text-gray-600 leading-relaxed">{scenario.outcome}</p>
                </div>

                <div className="bg-brand-ghost border border-brand-indigo/20 rounded-xl px-4 py-3.5">
                  <div className="text-xs font-bold text-brand-indigo mb-1.5 flex items-center gap-1.5">
                    <ArrowsLeftRight size={11} /> Pull counterpart
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{scenario.pullCounterpart}</p>
                </div>

                {scenario.combined && (
                  <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3.5">
                    <div className="text-xs font-bold text-green-700 mb-1.5 flex items-center gap-1.5">
                      <Sparkle size={11} weight="fill" /> Push + Pull combined
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{scenario.combined}</p>
                  </div>
                )}

                <div className="flex gap-2 pt-1">
                  {activeMode === 'async'
                    ? <button onClick={() => setActiveMode('sync')} className="text-xs font-semibold text-brand-indigo flex items-center gap-1 hover:text-brand-light transition-colors">
                        See sync version <ArrowRight size={11} weight="bold" />
                      </button>
                    : <button onClick={() => setActiveMode('async')} className="text-xs font-semibold text-brand-indigo flex items-center gap-1 hover:text-brand-light transition-colors">
                        See async version <ArrowRight size={11} weight="bold" />
                      </button>
                  }
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── When to use sync vs async for push ── */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-1">When to use sync vs async for push</h2>
          <p className="text-sm text-gray-500 mb-5">Push isn't just broadcast — but choosing the right mode matters.</p>
          <div className="grid md:grid-cols-2 gap-4">

            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
              <div className="px-5 py-4 bg-brand-shaft border-b border-white/10 flex items-center gap-2">
                <VideoCamera size={15} className="text-white" />
                <span className="text-sm font-bold text-white">Use sync push when…</span>
              </div>
              <div className="px-5 py-4 space-y-2.5">
                {[
                  { signal: 'High stakes, needs real-time Q&A', example: 'Executive results walkthrough, board update' },
                  { signal: 'Complex or sensitive content', example: 'Layoff announcement, major policy change, benefits with edge cases' },
                  { signal: 'Decision needs to happen in the session', example: 'Q3 budget approval, go/no-go on a project' },
                  { signal: 'Relationship matters', example: 'First job opportunity outreach, enterprise client update' },
                  { signal: 'Audience is likely to have many questions', example: 'New franchise playbook, major product update for customers' },
                ].map(r => (
                  <div key={r.signal} className="flex items-start gap-3">
                    <Check size={13} className="text-brand-indigo mt-0.5 shrink-0" />
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{r.signal}</div>
                      <div className="text-xs text-gray-400">{r.example}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
              <div className="px-5 py-4 bg-orange-500 border-b border-orange-400 flex items-center gap-2">
                <EnvelopeSimple size={15} className="text-white" />
                <span className="text-sm font-bold text-white">Use async push when…</span>
              </div>
              <div className="px-5 py-4 space-y-2.5">
                {[
                  { signal: 'Large audience, can\'t schedule everyone', example: 'Benefits enrollment for 200 employees, franchise update to 50 locations' },
                  { signal: 'Content is structured and navigable', example: 'Performance dashboard, policy update, role brief' },
                  { signal: 'Questions are predictable, AI can answer them', example: 'Plan comparisons, FAQ-style updates, spec walkthroughs' },
                  { signal: 'You need proof of completion, not just delivery', example: 'Compliance acknowledgment, enrollment selection, training sign-off' },
                  { signal: 'Recipients are in different time zones or shifts', example: 'Distributed teams, field reps, contractors' },
                ].map(r => (
                  <div key={r.signal} className="flex items-start gap-3">
                    <Check size={13} className="text-orange-500 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{r.signal}</div>
                      <div className="text-xs text-gray-400">{r.example}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* ── The disseminate experience ── */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-1">What great "disseminate" looks like</h2>
          <p className="text-sm text-gray-500 mb-5">Push in Comms isn't broadcast email. It's an interactive briefing — the difference is the response layer.</p>

          <div className="bg-brand-shaft rounded-2xl px-6 py-6">
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              {[
                {
                  icon: <Megaphone size={16} className="text-white" />,
                  label: 'Traditional push (email / Slack)',
                  points: ['Sent to inbox, read once or never', 'No way to ask questions', 'No proof of understanding', 'Open rate ≈ 30%, action rate ≈ 5%'],
                  bad: true,
                },
                {
                  icon: <ChatTeardropText size={16} className="text-white" />,
                  label: 'Comms async push',
                  points: ['Structured briefing at their pace', 'AI answers their specific questions', 'Tracks completion, not just delivery', 'Captures what confused them (unasked questions surfaced)'],
                  bad: false,
                },
                {
                  icon: <Phone size={16} className="text-white" />,
                  label: 'Comms sync push',
                  points: ['Live walkthrough with real-time Q&A', 'Structured agenda — nothing skipped', 'Decision or acknowledgment captured in session', 'Transcript + action items auto-generated'],
                  bad: false,
                },
              ].map(col => (
                <div key={col.label} className={`rounded-xl px-4 py-4 ${col.bad ? 'bg-white/5 border border-white/10' : 'bg-white/10 border border-white/20'}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${col.bad ? 'bg-red-500/20' : 'bg-brand-indigo'}`}>{col.icon}</div>
                    <span className={`text-xs font-bold uppercase tracking-wider ${col.bad ? 'text-red-300' : 'text-white'}`}>{col.label}</span>
                  </div>
                  <ul className="space-y-1.5">
                    {col.points.map(p => (
                      <li key={p} className={`flex items-start gap-2 text-xs leading-relaxed ${col.bad ? 'text-white/40' : 'text-white/70'}`}>
                        <span className={`w-1 h-1 rounded-full mt-1.5 shrink-0 ${col.bad ? 'bg-red-400' : 'bg-green-400'}`} />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="bg-white/10 border border-white/20 rounded-xl px-5 py-4">
              <div className="text-xs font-bold text-brand-pale/70 uppercase tracking-wider mb-2">The core difference</div>
              <p className="text-sm text-white/80 leading-relaxed">
                A broadcast email tells you it was delivered. Comms tells you it was <strong className="text-white">understood</strong> — who asked what questions, who completed the brief, who acknowledged, and who still needs follow-up. That's the gap between pushing information and actually communicating.
              </p>
            </div>
          </div>
        </section>

        {/* ── Full scenario matrix ── */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-1">Push vs pull — scenario matrix</h2>
          <p className="text-sm text-gray-500 mb-5">Common workflows mapped by direction and recommended mode.</p>
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Scenario</th>
                    <th className="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Direction</th>
                    <th className="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Best mode</th>
                    <th className="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Outcome</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Vendor document collection', 'Pull', 'Async', 'Documents collected, exceptions flagged'],
                    ['Job opportunity outreach', 'Push', 'Async or Sync', 'Interest signal + questions revealed'],
                    ['Candidate screening', 'Pull', 'Async', 'Rubric scores, ranked shortlist'],
                    ['Benefits enrollment', 'Push + Pull', 'Async (bulk) / Sync (complex)', 'Plan selections confirmed, questions answered'],
                    ['Q2 results distribution', 'Push', 'Async (queryable brief)', 'Acknowledged, questions surfaced, decisions logged'],
                    ['Client intake', 'Pull', 'Async', 'Discovery brief ready for kickoff'],
                    ['Franchise ops update', 'Push + Pull', 'Async + comprehension check', 'Completion %, knowledge scores, exceptions'],
                    ['Policy attestation', 'Push + Pull', 'Async', 'Signed acknowledgments, understanding verified'],
                    ['Sprint recap to stakeholders', 'Push', 'Async (queryable)', 'Stakeholders unblocked, meeting avoided'],
                    ['Training delivery', 'Push + Pull', 'Async (module) / Sync (simulation)', 'Certification, scores, gaps identified'],
                    ['Compliance evidence collection', 'Pull', 'Async', 'Evidence collected, audit pack ready'],
                    ['Team standup collection', 'Pull → Push', 'Async pull → async push recap', 'Status collected, digest distributed'],
                  ].map(([scenario, dir, mode, outcome], i) => (
                    <tr key={scenario} className={i % 2 === 0 ? 'border-b border-gray-100' : 'bg-gray-50/50 border-b border-gray-100'}>
                      <td className="px-5 py-3 font-medium text-gray-900">{scenario}</td>
                      <td className="px-5 py-3">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          dir === 'Pull' ? 'bg-brand-ghost text-brand-indigo' :
                          dir === 'Push' ? 'bg-orange-50 text-orange-600 border border-orange-200' :
                          'bg-green-50 text-green-700 border border-green-200'
                        }`}>{dir}</span>
                      </td>
                      <td className="px-5 py-3 text-gray-600 text-xs">{mode}</td>
                      <td className="px-5 py-3 text-gray-500 text-xs">{outcome}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-brand-ghost border border-brand-indigo/20 rounded-2xl px-6 py-6 flex items-center justify-between gap-6">
          <div>
            <div className="font-bold text-gray-900 text-lg mb-1">Ready to dispatch a push session?</div>
            <p className="text-sm text-gray-500">Describe what you need to communicate — Comms will suggest whether to push, pull, or combine, and generate the conversation draft.</p>
          </div>
          <Link to="/app/dispatcher" className="btn-primary shrink-0 whitespace-nowrap">
            Open Dispatcher <ArrowRight size={13} weight="bold" />
          </Link>
        </section>

      </div>

      <PrototypeBanner
        title="Prototype: Push vs Pull"
        description="Framework, spectrum, 5 push scenarios with sync/async modes, disseminate experience, and a full scenario matrix."
      />
    </div>
  )
}
