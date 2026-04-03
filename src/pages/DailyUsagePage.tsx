import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, ChatTeardropText, Users, Check, Clock, Sparkle,
  Lightning, Star, ArrowsClockwise, FileText, ClipboardText,
  UserPlus, ShieldCheck, ChartBar, EnvelopeSimple, Megaphone,
  CaretDown, CaretRight, Repeat, Eye, Gift,
} from '@phosphor-icons/react'
import { Nav } from '../components/Nav'
import { PrototypeBanner } from '../components/shared/PrototypeBanner'

/* ─── Day timeline ─── */
interface TimelineItem {
  time: string; category: string; title: string; desc: string
  recipients: number; mode: 'Async' | 'Sync'; dispatchTime: string
  color: string; bg: string; outcomes?: string
}

const DAY_TIMELINE: TimelineItem[] = [
  {
    time: '8:31 AM', category: 'Team', title: 'Morning standup check',
    desc: '"What did you ship yesterday? What\'s blocking you today? ETA on your current task?"',
    recipients: 8, mode: 'Async', dispatchTime: '12 seconds to dispatch',
    color: 'bg-brand-indigo', bg: 'bg-brand-ghost',
    outcomes: '8 responses by 10 AM. 2 blockers surfaced. Auto-summary ready.',
  },
  {
    time: '9:50 AM', category: 'Customer', title: 'Onboarding check-in',
    desc: '"How is the product fitting your workflow so far? Any friction in the first two weeks?"',
    recipients: 3, mode: 'Async', dispatchTime: 'Auto-triggered from session chain',
    color: 'bg-green-500', bg: 'bg-green-50',
    outcomes: '2/3 completed. 1 risk flag — escalated to CS automatically.',
  },
  {
    time: '11:00 AM', category: 'Admin', title: 'New hire document collection',
    desc: 'Sarah Chen starts Monday. I-9, direct deposit, emergency contact, equipment preferences.',
    recipients: 1, mode: 'Async', dispatchTime: '30 seconds to dispatch',
    color: 'bg-violet-500', bg: 'bg-violet-50',
    outcomes: 'Completed same day. Docs sent to HR, IT provisioning queued automatically.',
  },
  {
    time: '1:20 PM', category: 'Knowledge', title: 'SOP capture — returns process',
    desc: '"Walk me through the exact steps you follow when a customer return comes in, from first contact to resolution."',
    recipients: 4, mode: 'Async', dispatchTime: '45 seconds to dispatch',
    color: 'bg-orange-500', bg: 'bg-orange-50',
    outcomes: '4 perspectives collected. AI consolidated into a draft SOP. Review session queued.',
  },
  {
    time: '3:30 PM', category: 'Customer', title: 'Q1 NPS pulse',
    desc: 'Two-question async to 22 active accounts. Score + one open-ended: what\'s one thing we could improve?',
    recipients: 22, mode: 'Async', dispatchTime: '20 seconds to dispatch',
    color: 'bg-green-500', bg: 'bg-green-50',
    outcomes: '18/22 responded. NPS: 52. Top theme: documentation. Report auto-generated.',
  },
  {
    time: '4:45 PM', category: 'Team', title: 'Sprint retrospective',
    desc: '"What went well this sprint? What slowed us down? One concrete thing to change next sprint?"',
    recipients: 6, mode: 'Async', dispatchTime: '15 seconds to dispatch',
    color: 'bg-brand-indigo', bg: 'bg-brand-ghost',
    outcomes: '6/6 by EOD. 3 action items auto-extracted. Linked to next planning session.',
  },
]

/* ─── Template gallery ─── */
interface Template {
  category: string; title: string; desc: string; freq: string
  icon: React.ElementType; color: string
}
const TEMPLATES: Template[] = [
  { category: 'Team', title: 'Daily standup', desc: 'Yesterday · Today · Blockers', freq: 'Daily', icon: Lightning, color: 'text-brand-indigo' },
  { category: 'Team', title: 'Sprint retrospective', desc: 'What went well / what to change', freq: 'Weekly', icon: ArrowsClockwise, color: 'text-brand-indigo' },
  { category: 'Team', title: '1:1 agenda builder', desc: 'Collect topics before the meeting', freq: 'Weekly', icon: Users, color: 'text-brand-indigo' },
  { category: 'Team', title: 'Project status', desc: 'Progress, blockers, ETA per person', freq: 'Weekly', icon: ChartBar, color: 'text-brand-indigo' },
  { category: 'Customer', title: 'Onboarding check-in', desc: 'Adoption, friction, next steps', freq: 'Week 2 + 4', icon: Sparkle, color: 'text-green-600' },
  { category: 'Customer', title: 'NPS pulse', desc: 'Score + one open-ended question', freq: 'Quarterly', icon: Star, color: 'text-green-600' },
  { category: 'Customer', title: 'QBR input', desc: 'Collect data before business review', freq: 'Quarterly', icon: FileText, color: 'text-green-600' },
  { category: 'Customer', title: 'Churn risk check', desc: 'Health signal + escalation flag', freq: 'Monthly', icon: EnvelopeSimple, color: 'text-green-600' },
  { category: 'Knowledge', title: 'SOP capture', desc: 'Document a process step-by-step', freq: 'As needed', icon: ClipboardText, color: 'text-orange-500' },
  { category: 'Knowledge', title: 'FAQ collection', desc: 'Common questions from the team', freq: 'As needed', icon: ChatTeardropText, color: 'text-orange-500' },
  { category: 'Knowledge', title: 'Exit interview', desc: 'Structured offboarding capture', freq: 'As needed', icon: UserPlus, color: 'text-orange-500' },
  { category: 'Training', title: 'New feature training', desc: 'Walkthrough + comprehension check', freq: 'On ship', icon: Megaphone, color: 'text-violet-600' },
  { category: 'Training', title: 'Sales role-play', desc: 'Objection handling drill', freq: 'Weekly', icon: Repeat, color: 'text-violet-600' },
  { category: 'Training', title: 'New hire module', desc: 'Day 1–5 onboarding sessions', freq: 'As needed', icon: UserPlus, color: 'text-violet-600' },
  { category: 'Admin', title: 'Policy attestation', desc: 'Read, understood, confirmed on record', freq: 'Monthly', icon: ShieldCheck, color: 'text-red-500' },
  { category: 'Admin', title: 'Vendor renewal', desc: 'COI, W-9, contract data', freq: 'Annual', icon: ArrowsClockwise, color: 'text-red-500' },
]

const TEMPLATE_CATEGORIES = ['All', 'Team', 'Customer', 'Knowledge', 'Training', 'Admin']
const catColors: Record<string, string> = {
  Team: 'bg-blue-50 text-blue-700',
  Customer: 'bg-green-50 text-green-700',
  Knowledge: 'bg-orange-50 text-orange-700',
  Training: 'bg-violet-50 text-violet-700',
  Admin: 'bg-red-50 text-red-700',
}

/* ─── Growth loop ─── */
const GROWTH_STEPS = [
  {
    step: '01', title: 'You dispatch', color: 'bg-brand-indigo',
    desc: 'A single Comms session reaches 5–50 people in seconds.',
    detail: 'You describe a task in the Dispatcher. A Comms draft is generated. You accept. Invites go out.',
  },
  {
    step: '02', title: 'They experience Comms', color: 'bg-violet-500',
    desc: 'Every recipient sees a clean, branded, mobile-first interface.',
    detail: 'The session opens in their browser. No login. No friction. They think: "what is this tool? I want to use it."',
  },
  {
    step: '03', title: 'They ask about it', color: 'bg-green-500',
    desc: '"What did you use to send this? Can we use it for our team too?"',
    detail: 'The recipient experience is clean enough to be noticed. Sessions spread virally through referral, not ads.',
  },
  {
    step: '04', title: 'New dispatchers join', color: 'bg-orange-500',
    desc: 'Each new user reaches their own network. The loop compounds.',
    detail: 'Templates from power users become shared playbooks. Session outcomes trigger new sessions automatically.',
  },
]

/* ─── Habit loop ─── */
const HABIT_MECHANICS = [
  {
    icon: Clock,
    title: 'Morning digest',
    body: 'Start your day with "3 sessions waiting for attention." Like email — but each item is a task with a clear action.',
    tag: 'Daily trigger',
  },
  {
    icon: Lightning,
    title: 'Quick dispatch (<30 sec)',
    body: 'Describe what you need in one sentence. Comms drafts the agenda. Accept and move on. Faster than writing an email.',
    tag: 'Low friction',
  },
  {
    icon: Repeat,
    title: 'Recurring templates',
    body: 'Set up a standup template once. It runs every morning automatically — no reconfiguring, no rescheduling.',
    tag: 'Autopilot',
  },
  {
    icon: ArrowsClockwise,
    title: 'Session outcomes spark next sessions',
    body: 'A retro session surfaces 3 action items. Each becomes a new session automatically. Work cascades forward.',
    tag: 'Self-generating',
  },
  {
    icon: Sparkle,
    title: 'Smart follow-ups',
    body: 'Never manually chase. Comms sends follow-ups on your behalf at the right time, in the right channel.',
    tag: 'Zero overhead',
  },
  {
    icon: Users,
    title: 'Team templates',
    body: 'Share a template across your team. Everyone dispatches consistently. Outcomes become comparable and analyzable.',
    tag: 'Org-wide',
  },
]

/* ─── PLG mechanisms ─── */
interface PLGMechanism {
  id: string; category: 'Acquisition' | 'Expansion' | 'Retention'
  title: string; mirror: string; mirrorCo: string
  trigger: string; conversion: string; impact: string; ahaLine: string
  detail: string
}

const PLG_MECHANISMS: PLGMechanism[] = [
  {
    id: 'recipient-loop', category: 'Acquisition',
    title: 'The Recipient Conversion Loop',
    mirror: 'Schedule link → you want Calendly too', mirrorCo: 'Calendly',
    trigger: 'A person completes a Comms session as a recipient.',
    conversion: 'Session completion screen shows: "You just completed a vendor renewal with Harbor Health — want to send sessions like this to your own team? Start free in 30 seconds." One-click sign-up pre-loads a matching template.',
    impact: 'Each session reaches 5–50 people. Even 3–5% conversion = significant organic inflow.',
    ahaLine: '"Wait, I want this for my team too."',
    detail: 'This is the highest-leverage PLG vector. Every dispatch is an acquisition event. Unlike ads that reach unqualified audiences, every recipient is already doing B2B work and has a reason to coordinate with others.',
  },
  {
    id: 'outcome-share', category: 'Acquisition',
    title: 'Outcome Report as Marketing',
    mirror: 'View-only share link → want to edit', mirrorCo: 'Figma',
    trigger: 'A dispatcher shares a session outcome report with a stakeholder (their manager, a client, a partner).',
    conversion: 'The shareable report URL opens a beautifully formatted outcome page. Footer: "Generated with Comms — try it for your team." Stakeholder clicks, sees their own relevant use case, converts.',
    impact: 'Every outcome report is a passive acquisition touchpoint. High-quality reports get shared repeatedly.',
    ahaLine: '"How did you produce this? I need this format for my reviews."',
    detail: 'Outcome reports are a Trojan horse. You share data — the recipient notices the wrapper. This works especially well when the report is shared upward (exec receives polished outcome summary, asks how it was made).',
  },
  {
    id: 'template-seo', category: 'Acquisition',
    title: 'Public Template Gallery (SEO-driven)',
    mirror: 'Template marketplace as acquisition channel', mirrorCo: 'HubSpot / Notion',
    trigger: 'A user publishes a session template to the public gallery.',
    conversion: 'Templates are indexed by Google. "Vendor onboarding template," "sprint retro template," "NPS survey template" — high-intent keywords. Searcher lands on the template page, previews it, one-click imports into Comms and is now a registered user.',
    impact: 'HubSpot generates >30% of signups from template/resource pages. Long-tail SEO compounds over time.',
    ahaLine: '"I found this exact template I needed and it just works."',
    detail: 'Templates solve a specific problem and have a clear utility promise before any account creation. The import CTA only asks for a work email — lowest possible friction. Power users who publish templates become brand advocates.',
  },
  {
    id: 'embedded-integrations', category: 'Acquisition',
    title: 'Embedded in Existing Workflows',
    mirror: '/slash commands create impressions on the whole team', mirrorCo: 'Slack / Zapier',
    trigger: 'A dispatcher runs /comms standup in a Slack channel, or triggers a Comms session from a Zapier workflow, or links a session in a Notion doc.',
    conversion: 'Teammates in the Slack channel see the session dispatched. Those who receive it get a clean email. Non-users see Comms in a workflow tool they already use and want access.',
    impact: 'Integration marketplace listings drive high-intent, qualified traffic. Embedded use means the product gets seen by teams before they even sign up.',
    ahaLine: '"I keep seeing Comms show up in our tools. What is it?"',
    detail: 'Being embedded in Slack, Notion, Linear, HubSpot, and Zapier is both a distribution channel and a retention mechanism. Once workflows are built around Comms, switching costs rise for the whole team.',
  },
  {
    id: 'land-expand', category: 'Expansion',
    title: 'Domain-Level Land and Expand',
    mirror: 'One team member → whole org', mirrorCo: 'Slack / Figma',
    trigger: '3+ sessions dispatched from the same company email domain in a month.',
    conversion: 'Comms detects the domain concentration and nudges: "Looks like 4 people at Acme Co. are using Comms. Upgrade to a team workspace to share templates, see org-level analytics, and manage billing in one place." One internal champion triggers a top-down conversation.',
    impact: 'Slack grew from team to enterprise almost entirely via domain-level land-and-expand. Average team size expansion is 3–7×.',
    ahaLine: '"Let\'s just roll this out to the whole department."',
    detail: 'The B2B motion here is bottom-up. No sales required. The product proves itself to a small team, and the economics of managing it centrally eventually pull in IT/ops to consolidate. Design the team workspace upgrade to be frictionless.',
  },
  {
    id: 'referred-sessions', category: 'Expansion',
    title: 'Referred Sessions (Viral Credits)',
    mirror: 'Referral credits tied to actual usage', mirrorCo: 'Dropbox / Duolingo',
    trigger: 'Dispatcher earns credits when a recipient they introduced dispatches their first session.',
    conversion: 'After completing a session, recipient is offered: "Start dispatching your own sessions — you have 10 free credits from [Company]. Try it on your team." Credits are real value (sessions dispatched, not just signup). Dispatcher is notified when their referral activates.',
    impact: 'Dropbox\'s referral program generated 3900% user growth in 15 months. Credits tied to actual action (not just signup) = better activation.',
    ahaLine: '"I got 10 free sessions because I completed a vendor onboarding — might as well try it for my own team."',
    detail: 'The key insight: credits are awarded for completing a session as a recipient, not just signing up. This pre-qualifies the referral — they already know what the product does before they start dispatching.',
  },
  {
    id: 'session-chain', category: 'Retention',
    title: 'Session Chain Network Effect',
    mirror: 'Your history makes the product more valuable over time', mirrorCo: 'GitHub / Notion',
    trigger: 'A second session references the outcome of a first ("Based on your Q4 vendor onboarding..."). The dispatcher sees the context auto-populated.',
    conversion: 'Every new session adds to an increasingly valuable organizational memory. The product becomes more useful the longer you use it. Churn = losing your org\'s accumulated context.',
    impact: 'This is a switching cost moat. After 20–50 sessions, the historical context is so valuable that moving to another tool means starting from zero.',
    ahaLine: '"My whole vendor history is in here — I\'m never leaving."',
    detail: 'Design the dispatcher to proactively surface relevant past sessions: "We found 3 related sessions — use them as context?" This trains users to treat Comms as org memory, not just a dispatch tool.',
  },
  {
    id: 'contact-intelligence', category: 'Retention',
    title: 'Contact Intelligence Moat',
    mirror: 'The longer you use it, the smarter it gets about your contacts', mirrorCo: 'HubSpot / LinkedIn',
    trigger: 'Each completed session enriches the contact profile: response time, channel preference, best outreach window, engagement score.',
    conversion: 'After 6 months, Comms tells you: "Priya responds fastest on Tuesday mornings via email. Her completion rate is 97%. James ignores email — use SMS after opt-in." These insights are specific to your relationship and can\'t be replicated elsewhere.',
    impact: 'Personalized engagement data creates compounding returns on response rates. Switching means losing your learned optimization layer.',
    ahaLine: '"My response rates went up 30% because I started following the AI timing suggestions."',
    detail: 'At scale, this becomes a competitive advantage — your suppliers respond faster than your competitor\'s because you\'ve learned how to reach each one. The moat deepens automatically with every session.',
  },
  {
    id: 'anon-profile', category: 'Acquisition',
    title: 'Heavy Recipient → Dispatcher Conversion',
    mirror: '"You have 5 pending connections" — passive pull into the network', mirrorCo: 'LinkedIn',
    trigger: 'A person completes sessions from 3+ different companies (e.g., a contractor who does vendor onboarding with 4 different clients).',
    conversion: '"You\'ve completed 9 Comms sessions across 4 companies. Create a free profile to see all your sessions, manage your responses, and use Comms for your own outreach." Heavy recipients are already the most qualified potential users.',
    impact: 'Contractors, consultants, agencies, and freelancers — who receive sessions from many clients — are naturally high-engagement. They\'re pre-qualified and already know the product.',
    ahaLine: '"Wait, I can use this to send things myself? I\'ve been on the receiving end — this would save me hours."',
    detail: 'This is a unique PLG lever for Comms that most tools don\'t have. The "recipient" role is a perfect bottom-of-funnel introduction to the product. Target high-frequency recipients (contractors, vendors, consultants) for conversion campaigns.',
  },
  {
    id: 'social-proof-spread', category: 'Expansion',
    title: 'Internal Social Proof Engine',
    mirror: '"X people on your team are already using this"', mirrorCo: 'Slack / Dropbox',
    trigger: 'Usage crosses a threshold within an organization (5 dispatchers, 100 completed sessions, etc.).',
    conversion: 'Comms surfaces internal social proof: "Your Finance team completed 47 sessions this month — here\'s the outcome summary. Want to see how the Sales team is using it?" Shows cross-team templates and outcome comparisons.',
    impact: 'Internal social proof is 4× more persuasive than external. Seeing that a respected colleague uses a tool is the strongest possible signal.',
    ahaLine: '"If the Finance team is getting results with this, I should try it for my workflows too."',
    detail: 'Build an internal "Comms digest" that org admins receive monthly — showing top dispatchers, most-used templates, outcomes across the org. This creates competitive internal dynamics (who\'s running the best sessions?) and pulls in laggard departments.',
  },
]

const PLG_COMPS = [
  { company: 'Calendly', pattern: 'Scheduling link → recipient wants it', commsEquiv: 'Session link → recipient becomes dispatcher' },
  { company: 'Typeform', pattern: 'Beautiful form = organic mentions + sharing', commsEquiv: 'Beautiful session interface = word-of-mouth referrals' },
  { company: 'Figma', pattern: 'View-only share → want to edit', commsEquiv: 'Outcome report share → want to dispatch' },
  { company: 'Notion', pattern: 'Shared docs pull in readers as editors', commsEquiv: 'Shared session context pulls in collaborators' },
  { company: 'Slack', pattern: 'One team → entire org via domain expansion', commsEquiv: 'One dispatcher → company-wide via land-and-expand' },
  { company: 'Dropbox', pattern: 'Credits tied to real usage drive activation', commsEquiv: 'Referred sessions credits drive first dispatch' },
  { company: 'DocuSign', pattern: 'Signing experience creates product familiarity', commsEquiv: 'Session completion creates familiarity before sign-up' },
  { company: 'HubSpot', pattern: 'Templates as SEO-driven acquisition channel', commsEquiv: 'Public template gallery drives search-intent signups' },
]

const PLG_CAT_COLORS: Record<string, string> = {
  Acquisition: 'bg-blue-50 text-blue-700 border-blue-200',
  Expansion: 'bg-violet-50 text-violet-700 border-violet-200',
  Retention: 'bg-green-50 text-green-700 border-green-200',
}

function PLGSection() {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [activePLGCat, setActivePLGCat] = useState<'All' | 'Acquisition' | 'Expansion' | 'Retention'>('All')

  const filtered = activePLGCat === 'All'
    ? PLG_MECHANISMS
    : PLG_MECHANISMS.filter(m => m.category === activePLGCat)

  return (
    <>
      {/* PLG overview */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
          <div className="mb-10">
            <div className="tag bg-brand-ghost text-brand-indigo mb-3">Product-led growth</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Comms grows itself — here's every mechanism</h2>
            <p className="text-gray-500 text-lg max-w-2xl leading-relaxed">
              Every Comms session creates acquisition, expansion, and retention events simultaneously. Unlike typical B2B SaaS where growth requires a sales team, Comms is structurally PLG: the product creates new users as a byproduct of being used.
            </p>
          </div>

          {/* Flywheel visual */}
          <div className="bg-[#0D1117] rounded-2xl p-8 mb-10">
            <div className="text-xs font-bold text-brand-pale/70 uppercase tracking-wider mb-6 text-center">The Comms PLG flywheel</div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 flex-wrap">
              {[
                { label: 'Dispatcher creates session', color: 'bg-brand-indigo', sub: 'Describes task in plain language' },
                { label: 'N recipients experience Comms', color: 'bg-violet-500', sub: 'Clean, branded, mobile-first' },
                { label: 'Outcome shared with stakeholders', color: 'bg-green-500', sub: 'Beautiful structured report' },
                { label: 'Curious recipients + stakeholders convert', color: 'bg-orange-500', sub: 'One-click sign-up with matching template' },
                { label: 'New dispatchers reach their networks', color: 'bg-brand-indigo', sub: 'Loop repeats at larger scale' },
              ].map((step, i, arr) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="text-center max-w-[130px]">
                    <div className={`w-12 h-12 rounded-full ${step.color} flex items-center justify-center mx-auto mb-2 text-white font-bold text-sm shadow-lg`}>{i + 1}</div>
                    <div className="text-xs font-semibold text-white leading-tight">{step.label}</div>
                    <div className="text-[10px] text-white/40 mt-0.5">{step.sub}</div>
                  </div>
                  {i < arr.length - 1 && <ArrowRight size={14} className="text-white/20 shrink-0" />}
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-center gap-6 text-center">
              {[
                { label: 'Acquisition', count: '4 mechanisms', color: 'text-blue-400' },
                { label: 'Expansion', count: '3 mechanisms', color: 'text-violet-400' },
                { label: 'Retention', count: '3 mechanisms', color: 'text-green-400' },
              ].map(c => (
                <div key={c.label}>
                  <div className={`text-lg font-bold ${c.color}`}>{c.count}</div>
                  <div className="text-xs text-white/40">{c.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Featured viral mechanics ── */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-bold text-brand-indigo uppercase tracking-wider">Featured mechanisms</span>
              <span className="text-xs text-gray-400">— highest-impact viral loops we've identified</span>
            </div>
            <div className="grid lg:grid-cols-2 gap-4">

              {/* #1 — Session Viewer */}
              <div className="bg-gradient-to-br from-brand-shaft to-[#1a3a6e] rounded-2xl p-6 text-white">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-white/50 mb-1">Viral mechanic #1 · Acquisition</div>
                    <h3 className="text-lg font-bold leading-snug">Shared Session Viewer</h3>
                    <p className="text-sm text-white/60 mt-0.5">Read + ask AI questions — no account needed</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <Eye size={18} className="text-white" />
                  </div>
                </div>
                <div className="space-y-2.5 mb-5">
                  {[
                    { label: 'Trigger', text: 'Dispatcher shares a session outcome link with their manager, client, or team.' },
                    { label: 'Experience', text: 'Viewer sees structured results and can ask an AI any question — "Who scored highest?" "Which vendors are still pending?" — all without signing up.' },
                    { label: 'Conversion', text: 'After 1–2 queries a banner appears: "Run your own sessions — 10 free, on us." Viewer signs up with work email and is pre-loaded with a matching template.' },
                    { label: 'Why it works', text: 'The viewer already has a reason to care (they\'re reading this because they\'re a stakeholder). They get value before the ask. The 10-session credit removes all risk.' },
                  ].map(r => (
                    <div key={r.label} className="flex gap-2.5">
                      <span className="text-[10px] font-bold text-brand-pale/70 uppercase tracking-wider w-20 shrink-0 pt-0.5">{r.label}</span>
                      <span className="text-sm text-white/70 leading-relaxed">{r.text}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-white/10 rounded-xl px-4 py-3 text-xs text-white/70 leading-relaxed mb-4">
                  <span className="text-white font-semibold">Multiplier:</span> Every session dispatched to N people creates N potential viewers. A 30-person vendor onboarding has 30 people who might share the outcome report with their own networks.
                </div>
                <Link to="/app/session-viewer" className="flex items-center gap-2 bg-white text-brand-indigo text-sm font-bold px-4 py-2.5 rounded-xl hover:bg-brand-ghost transition-colors w-fit">
                  See Session Viewer prototype <ArrowRight size={13} weight="bold" />
                </Link>
              </div>

              {/* #2 — 10 free sessions for viewers */}
              <div className="bg-gradient-to-br from-[#0f4c2a] to-[#14532d] rounded-2xl p-6 text-white">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-white/50 mb-1">Viral mechanic #2 · Acquisition</div>
                    <h3 className="text-lg font-bold leading-snug">10 Free Sessions for Viewers</h3>
                    <p className="text-sm text-white/60 mt-0.5">Every shared link is also a conversion event</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <Gift size={18} className="text-white" />
                  </div>
                </div>
                <div className="space-y-2.5 mb-5">
                  {[
                    { label: 'Trigger', text: 'Someone views a shared Comms Session (outcome, transcript, or Q&A).' },
                    { label: 'The offer', text: '10 free sessions, no card required, no time limit. Credited automatically on sign-up. Enough to run a meaningful pilot within a real workflow.' },
                    { label: 'Flywheel', text: 'Viewer signs up → uses their 10 sessions → reaches their own contacts → those people become viewers → they sign up for 10 sessions. The number of sessions created per user compounds.' },
                    { label: 'Compare', text: 'Dropbox gave 500MB per referral. Comms gives sessions — units that have direct, measurable output value. The recipient of a Comms session sees that value immediately.' },
                  ].map(r => (
                    <div key={r.label} className="flex gap-2.5">
                      <span className="text-[10px] font-bold text-green-300/70 uppercase tracking-wider w-20 shrink-0 pt-0.5">{r.label}</span>
                      <span className="text-sm text-white/70 leading-relaxed">{r.text}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-white/10 rounded-xl px-4 py-3 text-xs text-white/70 leading-relaxed">
                  <span className="text-white font-semibold">Design note:</span> Tie each free session credit to the originating session category — if they viewed a vendor onboarding session, their first Dispatcher prompt is pre-filled with a vendor onboarding template. Instant aha moment.
                </div>
              </div>

            </div>
          </div>

          {/* Category filter */}
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">All growth mechanisms</div>
          <div className="flex gap-2 mb-6">
            {(['All', 'Acquisition', 'Expansion', 'Retention'] as const).map(cat => (
              <button key={cat} onClick={() => setActivePLGCat(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${activePLGCat === cat ? 'bg-brand-indigo text-white border-brand-indigo' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}>
                {cat}
              </button>
            ))}
          </div>

          {/* Mechanisms grid */}
          <div className="grid lg:grid-cols-2 gap-3">
            {filtered.map(m => (
              <div key={m.id}
                className={`bg-white rounded-2xl border transition-all overflow-hidden ${activeId === m.id ? 'border-brand-indigo/40 shadow-md' : 'border-gray-200 hover:border-gray-300'}`}>
                <button className="w-full text-left px-5 py-4" onClick={() => setActiveId(activeId === m.id ? null : m.id)}>
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1.5">
                        <span className="text-sm font-bold text-gray-900">{m.title}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${PLG_CAT_COLORS[m.category]}`}>{m.category}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <span className="font-semibold text-gray-600">Like {m.mirrorCo}:</span>
                        <span>{m.mirror}</span>
                      </div>
                    </div>
                    <CaretDown size={14} className={`text-gray-300 mt-1 shrink-0 transition-transform ${activeId === m.id ? 'rotate-180 text-brand-indigo' : ''}`} />
                  </div>

                  {/* Aha line always visible */}
                  <div className="mt-2 text-xs italic text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">{m.ahaLine}</div>
                </button>

                {activeId === m.id && (
                  <div className="px-5 pb-5 space-y-3 border-t border-gray-100 pt-4">
                    <div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Trigger</div>
                      <p className="text-sm text-gray-600 leading-relaxed">{m.trigger}</p>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Conversion moment</div>
                      <p className="text-sm text-gray-600 leading-relaxed">{m.conversion}</p>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      <div className="bg-blue-50 border border-blue-200 rounded-xl px-3 py-2.5">
                        <div className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-1">Potential impact</div>
                        <p className="text-xs text-blue-800 leading-relaxed">{m.impact}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl px-3 py-2.5">
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Design insight</div>
                        <p className="text-xs text-gray-600 leading-relaxed">{m.detail}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison with PLG comps */}
      <section className="py-16 bg-gray-50 border-b border-gray-100">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
          <div className="mb-8">
            <div className="tag bg-brand-ghost text-brand-indigo mb-3">PLG benchmarks</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Where Comms fits in the PLG landscape</h2>
            <p className="text-gray-500 text-lg max-w-xl">Each of the most viral B2B SaaS products grew through a specific structural mechanic. Comms has an analogue — and in many cases, a stronger one.</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="grid grid-cols-3 bg-gray-50 border-b border-gray-200 px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
              <div>Company</div>
              <div>Their PLG mechanic</div>
              <div>Comms equivalent</div>
            </div>
            {PLG_COMPS.map((row, i) => (
              <div key={row.company} className={`grid grid-cols-3 px-6 py-3.5 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors ${i % 2 === 0 ? '' : 'bg-gray-50/40'}`}>
                <div className="text-sm font-bold text-gray-900">{row.company}</div>
                <div className="text-sm text-gray-500 pr-4">{row.pattern}</div>
                <div className="text-sm text-brand-indigo font-medium">{row.commsEquiv}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compounding effect */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
          <div className="mb-8">
            <div className="tag bg-brand-ghost text-brand-indigo mb-3">The compounding effect</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">These mechanisms reinforce each other</h2>
            <p className="text-gray-500 text-lg max-w-xl">No single PLG mechanic built a company. The compounding happens when several fire together.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              {
                phase: 'Month 1–3', title: 'Traction', color: 'border-blue-200 bg-blue-50',
                items: [
                  'Recipient conversion loop fires on every session',
                  'First templates published — early SEO seeds planted',
                  'Contact intelligence starts accumulating per user',
                ],
              },
              {
                phase: 'Month 4–12', title: 'Expansion', color: 'border-violet-200 bg-violet-50',
                items: [
                  'Domain-level land-and-expand kicks in at 3+ users/company',
                  'Template gallery starts ranking for long-tail keywords',
                  'Outcome reports getting shared externally — new acquisition events',
                ],
              },
              {
                phase: 'Year 2+', title: 'Moat', color: 'border-green-200 bg-green-50',
                items: [
                  'Session chain memory = organization can\'t leave without losing history',
                  'Contact intelligence is now deeply personalized — irreplaceable',
                  'Internal social proof has created team-level habits across the org',
                ],
              },
            ].map(phase => (
              <div key={phase.phase} className={`rounded-2xl border px-5 py-5 ${phase.color}`}>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{phase.phase}</div>
                <div className="text-lg font-bold text-gray-900 mb-4">{phase.title}</div>
                <ul className="space-y-2.5">
                  {phase.items.map(item => (
                    <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                      <Check size={12} weight="bold" className="text-green-500 mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
export function DailyUsagePage() {
  const [activeDay, setActiveDay] = useState(0)
  const [activeCat, setActiveCat] = useState('All')
  const [expandedGrowth, setExpandedGrowth] = useState<number | null>(null)

  const filteredTemplates = activeCat === 'All'
    ? TEMPLATES
    : TEMPLATES.filter(t => t.category === activeCat)

  const item = DAY_TIMELINE[activeDay]

  return (
    <div className="h-screen flex flex-col bg-[#F9FAFB]">
      <Nav />
      <div className="flex-1 overflow-y-auto pt-14">

        {/* ── Hero ── */}
        <section className="py-16 bg-white border-b border-gray-100">
          <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
            <div className="max-w-3xl">
              <div className="tag bg-brand-ghost text-brand-indigo mb-5">Daily usage</div>
              <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
                Open Comms every time<br />
                <span className="gradient-text">you need to work with a person</span>
              </h1>
              <p className="text-xl text-gray-500 leading-relaxed mb-8 max-w-2xl">
                Think of the Dispatcher the way you think of ChatGPT — except instead of thinking through a problem alone, you're coordinating a task <em>with</em> other people. Standup updates, client check-ins, SOP capture, training modules — anything that requires a human to do something.
              </p>
              <div className="flex flex-wrap gap-3">
                {[
                  { label: '~30 sec to dispatch anything', icon: Lightning },
                  { label: 'Automated follow-ups', icon: Repeat },
                  { label: 'Every outcome on record', icon: Check },
                  { label: 'Templates for recurring flows', icon: ClipboardText },
                ].map(({ label, icon: Icon }) => (
                  <div key={label} className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-gray-600">
                    <Icon size={14} className="text-brand-indigo" />
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── A day with Comms ── */}
        <section className="py-16 border-b border-gray-100 bg-gray-50">
          <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
            <div className="mb-10">
              <div className="tag bg-brand-ghost text-brand-indigo mb-3">A day in the life</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Six dispatches. Zero manual follow-up.</h2>
              <p className="text-gray-500 text-lg max-w-xl">What a single day looks like when the Dispatcher becomes your default for working with others.</p>
            </div>

            <div className="grid lg:grid-cols-[280px_1fr] gap-6">
              {/* Timeline list */}
              <div className="space-y-1">
                {DAY_TIMELINE.map((t, i) => (
                  <button key={i} onClick={() => setActiveDay(i)}
                    className={`w-full text-left px-4 py-3.5 rounded-xl border transition-all ${activeDay === i ? 'bg-white border-brand-indigo/30 shadow-sm' : 'bg-white/60 border-transparent hover:bg-white hover:border-gray-200'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full shrink-0 ${t.color}`} />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-gray-900 truncate">{t.title}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{t.time} · {t.category}</div>
                      </div>
                      <CaretRight size={12} className={activeDay === i ? 'text-brand-indigo' : 'text-gray-300'} />
                    </div>
                  </button>
                ))}
              </div>

              {/* Detail panel */}
              <div className="bg-white rounded-2xl border border-gray-200 p-7 shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{item.category} · {item.time}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{item.title}</h3>

                <div className="grid sm:grid-cols-3 gap-3 mb-5">
                  {[
                    { label: 'Recipients', value: `${item.recipients} people` },
                    { label: 'Mode', value: item.mode },
                    { label: 'Dispatch time', value: item.dispatchTime },
                  ].map(m => (
                    <div key={m.label} className={`rounded-xl px-4 py-3 ${item.bg}`}>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">{m.label}</div>
                      <div className="text-sm font-bold text-gray-900">{m.value}</div>
                    </div>
                  ))}
                </div>

                <div className="bg-gray-50 rounded-xl px-4 py-3.5 mb-4">
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">What was dispatched</div>
                  <p className="text-sm text-gray-700 leading-relaxed italic">{item.desc}</p>
                </div>

                {item.outcomes && (
                  <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3.5">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Check size={12} weight="bold" className="text-green-600" />
                      <span className="text-xs font-bold text-green-700 uppercase tracking-wider">Outcome</span>
                    </div>
                    <p className="text-sm text-green-800 leading-relaxed">{item.outcomes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ── Template gallery ── */}
        <section className="py-16 bg-white border-b border-gray-100">
          <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
            <div className="mb-8">
              <div className="tag bg-brand-ghost text-brand-indigo mb-3">Quick-start templates</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Start from a template. Done in 30 seconds.</h2>
              <p className="text-gray-500 text-lg max-w-xl">Pre-built recurring workflows — one click opens them in the Dispatcher, pre-configured and ready to review.</p>
            </div>

            {/* Category filters */}
            <div className="flex flex-wrap gap-2 mb-6">
              {TEMPLATE_CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setActiveCat(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${activeCat === cat ? 'bg-brand-indigo text-white border-brand-indigo' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}>
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {filteredTemplates.map(t => {
                const Icon = t.icon
                return (
                  <Link to="/app/dispatcher" key={t.title}
                    className="group bg-white border border-gray-200 rounded-2xl px-4 py-4 hover:border-brand-indigo/40 hover:shadow-md transition-all block">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-brand-ghost transition-colors">
                        <Icon size={16} className={`${t.color} group-hover:text-brand-indigo transition-colors`} />
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${catColors[t.category] ?? 'bg-gray-100 text-gray-600'}`}>{t.category}</span>
                    </div>
                    <div className="text-sm font-bold text-gray-900 mb-1 group-hover:text-brand-indigo transition-colors">{t.title}</div>
                    <div className="text-xs text-gray-500 mb-3">{t.desc}</div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-gray-400">{t.freq}</span>
                      <ArrowRight size={11} className="text-gray-300 group-hover:text-brand-indigo transition-colors" />
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── Habit mechanics ── */}
        <section className="py-16 bg-gray-50 border-b border-gray-100">
          <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
            <div className="mb-10">
              <div className="tag bg-brand-ghost text-brand-indigo mb-3">Habit formation</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Why it becomes your default</h2>
              <p className="text-gray-500 text-lg max-w-xl">Six mechanics that make Comms instinctive over time — not just a tool you use occasionally.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {HABIT_MECHANICS.map(({ icon: Icon, title, body, tag }) => (
                <div key={title} className="bg-white rounded-2xl border border-gray-200 px-5 py-5 hover:border-brand-indigo/30 hover:shadow-sm transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-ghost flex items-center justify-center">
                      <Icon size={18} className="text-brand-indigo" />
                    </div>
                    <span className="text-[10px] font-bold bg-green-50 text-green-700 px-2 py-1 rounded-full">{tag}</span>
                  </div>
                  <div className="text-base font-bold text-gray-900 mb-2">{title}</div>
                  <p className="text-sm text-gray-500 leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Growth loop ── */}
        <section className="py-16 bg-[#0D1117] text-white">
          <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
            <div className="mb-10">
              <div className="tag bg-white/10 text-white/70 border border-white/10 mb-3">The growth loop</div>
              <h2 className="text-3xl font-bold mb-3">How one user becomes a company-wide habit</h2>
              <p className="text-white/50 text-lg max-w-xl">Every session you dispatch touches multiple people. That's how Comms spreads — not through ads, but through the quality of the recipient experience.</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-12">
              {GROWTH_STEPS.map((s, i) => (
                <button key={i} onClick={() => setExpandedGrowth(expandedGrowth === i ? null : i)}
                  className={`text-left bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all ${expandedGrowth === i ? 'border-white/30 bg-white/10' : ''}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-8 h-8 rounded-xl ${s.color} flex items-center justify-center`}>
                      <span className="text-white text-xs font-bold">{s.step}</span>
                    </div>
                    <CaretDown size={12} className={`text-white/30 mt-1 transition-transform ${expandedGrowth === i ? 'rotate-180' : ''}`} />
                  </div>
                  <div className="text-base font-bold text-white mb-2">{s.title}</div>
                  <p className="text-sm text-white/50 leading-relaxed">{s.desc}</p>
                  {expandedGrowth === i && (
                    <p className="text-sm text-white/70 leading-relaxed mt-3 pt-3 border-t border-white/10">{s.detail}</p>
                  )}
                </button>
              ))}
            </div>

            {/* Stats / reach calculator */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <div className="text-xs font-bold text-brand-pale/70 uppercase tracking-wider mb-6">A simple reach example</div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-wrap">
                {[
                  { n: '1', label: 'dispatcher', sub: 'dispatches 3 sessions/day', color: 'bg-brand-indigo' },
                  { n: '×15', label: 'recipients avg', sub: 'per session', color: 'bg-violet-500' },
                  { n: '= 45', label: 'people/day', sub: 'experience Comms', color: 'bg-green-500' },
                  { n: '→ 3', label: 'new dispatchers', sub: 'join within a week', color: 'bg-orange-500' },
                  { n: '→ 135', label: 'people/day', sub: 'by end of week 2', color: 'bg-brand-indigo' },
                ].map((item, i, arr) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="text-center">
                      <div className={`text-2xl font-bold text-white`}>{item.n}</div>
                      <div className="text-xs font-semibold text-white/60 mt-0.5">{item.label}</div>
                      <div className="text-[10px] text-white/30">{item.sub}</div>
                    </div>
                    {i < arr.length - 1 && <ArrowRight size={14} className="text-white/20 shrink-0" />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Product-Led Growth ── */}
        <PLGSection />

        {/* ── CTA ── */}
        <section className="py-14 bg-brand-ghost border-t border-brand-indigo/10">
          <div className="max-w-[1200px] mx-auto px-6 lg:px-10 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Ready to make it daily?</h2>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">Open the Dispatcher and describe the first task you'd normally handle with an email or Slack message. See how fast the draft comes back.</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link to="/app/dispatcher" className="btn-primary py-3 px-7">
                Open Dispatcher <ArrowRight size={15} weight="bold" />
              </Link>
              <Link to="/use-cases" className="btn-secondary py-3 px-7">
                Browse use cases
              </Link>
            </div>
          </div>
        </section>
      </div>

      <PrototypeBanner
        title="Daily Usage"
        description="How Comms becomes your default for every task that involves another person."
      />
    </div>
  )
}
