import { useState, useRef, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  Microphone, ArrowRight, Plus, Archive, VideoCamera, ChatTeardropText, Gear,
  CaretRight, CaretDown, Sparkle, Check, Clock, Star, Envelope, DeviceMobileCamera,
  Phone, Warning, Sliders, WaveTriangle, Users,
} from '@phosphor-icons/react'
import { Nav } from '../components/Nav'
import { PrototypeBanner } from '../components/shared/PrototypeBanner'
import { buildAgendaBlocks, type AgendaBlock, type ConversationSessionType } from '../data/conversationAgenda'

/* ─── Static session library in sidebar ─── */
const SESSIONS = [
  { id: 's1', title: 'Vendor Onboarding -- Q4', cat: 'Collect', status: 'done',   count: '18/18', date: 'Oct 12',
    mode: 'Async · Email', followUps: '4 sent',
    findings: ['18/18 W-9 forms collected', '18/18 NDAs signed', '18/18 insurance certs verified'],
    action: 'All 18 vendors cleared. Renewal reminders set for Jan.' },
  { id: 's2', title: 'Engineering Screens', cat: 'Test', status: 'active', count: '6/12', date: 'Jan 8',
    mode: 'Async · Email + SMS', followUps: '2 sent',
    findings: ['Alex Torres: 88/100 -- Advance', 'Maria Chen: 84/100 -- Advance', '4 candidates pending'],
    action: null },
  { id: 's3', title: 'Q1 Compliance', cat: 'Review', status: 'active', count: '24/40', date: 'Mar 1',
    mode: 'Async · Email', followUps: '1 sent',
    findings: ['24 attested', '12 in progress', '4 flagged CONDITIONAL'],
    action: null },
  { id: 's4', title: 'Team Roadmap Survey', cat: 'Collect', status: 'done', count: '14/14', date: 'Feb 2',
    mode: 'Async · Email', followUps: '2 sent',
    findings: ['47 ideas collected', 'Top theme: developer tooling (8 mentions)', '3 priority items surfaced'],
    action: 'Q2 roadmap seeded with top 3 items. Planning session suggested.' },
  { id: 's5', title: 'New Hire Onboarding', cat: 'Collect', status: 'done', count: '3/3', date: 'Mar 5',
    mode: 'Async · SMS', followUps: 'None',
    findings: ['3/3 hires onboarded in <24h', 'All I-9 forms filed', 'Equipment requests sent to IT'],
    action: 'All 3 hires cleared for Day 1. Welcome emails queued.' },
]

const catColors: Record<string, string> = {
  Collect: 'bg-blue-50 text-blue-700',
  Test:    'bg-violet-50 text-violet-700',
  Review:  'bg-green-50 text-green-700',
  Train:   'bg-orange-50 text-orange-700',
}

/* ─── Types ─── */
interface PendingConfig { title: string; type: string; count: number; noun: string }
interface SessionConfig {
  mode: 'async' | 'sync'
  delivery: { email: boolean; sms: boolean; phone: boolean }
  followUps: number
  cadence: string
  deadline: string
}
interface Message {
  id: string
  role: 'user' | 'assistant' | 'system' | 'config'
  text: string
  session?: { title: string; type: string; count: string; mode: string }
  pendingConfig?: PendingConfig
  configPhase?: 'configure' | 'review'
  sessionConfig?: SessionConfig
}

const CADENCE_OPTIONS = ['every 24h', 'every 2 days', 'every 3 days', 'weekly']
const DEADLINE_OPTIONS = ['3 days', '5 days', '7 days', '14 days', '30 days']

/* ─── 4 pinned demo scenarios ─── */
const SCENARIOS = [
  {
    key: 'collect',
    label: 'Collect docs',
    prompt: 'Collect W-9, NDA, and certificate of insurance from the 12 new vendors before we can onboard them.',
    type: 'Collect' as ConversationSessionType,
    title: 'Vendor Document Collection × 12',
    noun: 'vendors',
    count: 12,
    aiText: "Understood -- I'll walk each vendor through a structured checklist: W-9, NDA signature, and COI upload with field validation. Async link via email, follow-ups until complete. Configure delivery and follow-up cadence below, then review the Comms draft before invites go out.",
  },
  {
    key: 'screen',
    label: 'Screen candidates',
    prompt: 'Screen 5 backend engineering candidates -- rank them by technical depth, problem-solving, and communication.',
    type: 'Test' as ConversationSessionType,
    title: 'Engineering Screen × 5',
    noun: 'candidates',
    count: 5,
    aiText: "Got it -- I'll run a structured assessment with each candidate: scenario-based probes mapped to your three dimensions, adaptive follow-ups, and scored rubric output. Configure mode (async link or scheduled live call) and delivery below, then review the agenda before invites send.",
  },
  {
    key: 'survey',
    label: 'Run a survey',
    prompt: 'Get feedback from all 40 engineers on the Q2 roadmap priorities -- I want real reasoning, not just a rating.',
    type: 'Collect' as ConversationSessionType,
    title: 'Q2 Roadmap Survey × 40',
    noun: 'engineers',
    count: 40,
    aiText: "On it -- async survey with structured open-ended questions. Each engineer gets a conversational link, not a form: I'll probe for reasoning behind their priorities, cluster themes, and surface the top ideas with attributed quotes. Configure delivery and follow-ups below.",
  },
  {
    key: 'schedule',
    label: 'Schedule interviews',
    prompt: 'Collect availability from 8 shortlisted PM candidates for 45-minute panel interviews next week.',
    type: 'Collect' as ConversationSessionType,
    title: 'Interview Availability × 8',
    noun: 'candidates',
    count: 8,
    aiText: "Sure -- I'll collect availability from each candidate via async chat: day-by-day preferences, timezone, any constraints. I'll aggregate the responses and surface the slots that work for the most people. Configure delivery below, then review before invites go out.",
  },
]

function makeScenarioMessages(s: typeof SCENARIOS[0]): Message[] {
  return [
    { id: 'm0', role: 'assistant', text: "Good morning, Jamie. What do you need to communicate today? Describe the task -- I'll configure the conversation, generate a Comms draft (agenda + questions) for your review, and only when you accept will invites go out." },
    { id: 'u0', role: 'user', text: s.prompt },
    { id: 'a0', role: 'assistant', text: s.aiText },
    { id: 'c0', role: 'config', text: '', configPhase: 'configure',
      pendingConfig: { title: s.title, type: s.type, count: s.count, noun: s.noun } },
  ]
}

/* ─── Email preview ─── */
function EmailPreviewCard({ title, type, cfg }: { title: string; type: string; cfg: SessionConfig }) {
  const subjects: Record<string, string> = {
    Test:    `Your structured interview -- ${title}`,
    Collect: `Action needed: ${title}`,
    Review:  `Compliance review ready -- ${title}`,
    Train:   `Your training session -- ${title}`,
  }
  const previews: Record<string, string> = {
    Test:    "You've been invited to complete a short structured interview at your convenience. It takes about 15 minutes and works on any device -- no app needed.",
    Collect: "We need a few items from you. The guided session walks you through each requirement step by step and takes about 10 minutes to complete.",
    Review:  "Your compliance review is ready. Walk through the material, confirm your understanding at each step -- takes about 10 minutes.",
    Train:   "Your training session is ready. Practice at your own pace -- the AI guides you through each scenario and gives you personalised feedback.",
  }
  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 text-sm shadow-sm">
      <div className="bg-[#F3F4F6] px-4 py-2.5 border-b border-gray-200">
        <div className="text-xs text-gray-400 space-y-0.5">
          <div><span className="font-semibold text-gray-600">From:</span> Comms by Assembly &lt;no-reply@comms.ai&gt;</div>
          <div><span className="font-semibold text-gray-600">Subject:</span> {subjects[type] ?? `Action needed -- ${title}`}</div>
        </div>
      </div>
      <div className="bg-white px-4 py-3">
        <p className="text-gray-700 text-sm leading-relaxed">{previews[type] ?? "You've been invited to complete a session."}</p>
        <div className="mt-3">
          <div className="inline-block bg-[#4F59CC] text-white text-xs font-semibold px-5 py-2.5 rounded-lg">
            {cfg.mode === 'sync' ? 'Join your session →' : 'Start when ready →'}
          </div>
        </div>
        <p className="mt-2.5 text-xs text-gray-400">
          Works on any phone or desktop. No app needed.{cfg.followUps > 0 ? ` Comms will follow up ${cfg.followUps}× ${cfg.cadence}.` : ''}
        </p>
      </div>
    </div>
  )
}

/* ─── Configure panel ─── */
function SessionConfigPanel({ pending, onGenerateReview }: { pending: PendingConfig; onGenerateReview: (cfg: SessionConfig) => void }) {
  const [cfg, setCfg] = useState<SessionConfig>({
    mode: 'async',
    delivery: { email: true, sms: true, phone: false },
    followUps: 3,
    cadence: 'every 2 days',
    deadline: '7 days',
  })
  const [tab, setTab] = useState<'config' | 'preview'>('config')
  function toggle<K extends keyof SessionConfig['delivery']>(k: K) {
    setCfg(prev => ({ ...prev, delivery: { ...prev.delivery, [k]: !prev.delivery[k] } }))
  }
  return (
    <div className="bg-white border border-brand-indigo/25 rounded-2xl shadow-lg p-5 w-full max-w-xl">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-6 h-6 rounded-lg bg-brand-ghost flex items-center justify-center">
          <Sliders size={13} weight="duotone" className="text-brand-indigo" />
        </div>
        <span className="text-sm font-bold text-gray-900">Configure conversation</span>
        <span className="ml-auto text-xs font-semibold text-brand-indigo bg-brand-ghost px-2.5 py-1 rounded-full truncate max-w-[180px]">{pending.title}</span>
      </div>
      <p className="text-xs text-gray-500 mb-4 mt-1 leading-relaxed">
        Shape the <strong className="text-gray-700">structured conversation</strong> -- mode, delivery, and follow-ups. Next you'll review the generated agenda + questions before anything sends.
      </p>
      <div className="flex gap-1 mb-4 bg-gray-50 rounded-xl p-1">
        {(['config', 'preview'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 text-xs font-semibold py-1.5 rounded-lg transition-colors ${tab === t ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}>
            {t === 'config' ? 'Settings' : 'Preview invite'}
          </button>
        ))}
      </div>
      {tab === 'config' ? (
        <div className="space-y-5">
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Mode</div>
            <div className="grid grid-cols-2 gap-2">
              {(['async', 'sync'] as const).map(m => (
                <button key={m} onClick={() => setCfg(prev => ({ ...prev, mode: m }))}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-semibold transition-colors ${cfg.mode === m ? 'bg-brand-indigo text-white border-brand-indigo' : 'bg-white text-gray-600 border-gray-200 hover:border-brand-indigo/30'}`}>
                  {m === 'async' ? <ChatTeardropText size={14} /> : <VideoCamera size={14} />}
                  {m === 'async' ? 'Async -- Chat link' : 'Sync -- Live call'}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-1.5">
              {cfg.mode === 'async' ? 'Participants get a link. Complete on any device, on their schedule.' : 'Participants join a scheduled call or phone call at a set time.'}
            </p>
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Invite via</div>
            <div className="flex gap-2">
              {([
                { k: 'email' as const, label: 'Email', Icon: Envelope, syncOnly: false },
                { k: 'sms'   as const, label: 'SMS',   Icon: DeviceMobileCamera, syncOnly: false },
                { k: 'phone' as const, label: 'Phone call', Icon: Phone, syncOnly: true },
              ]).map(({ k, label, Icon, syncOnly }) => {
                const disabled = syncOnly && cfg.mode !== 'sync'
                const active = cfg.delivery[k] && !disabled
                return (
                  <button key={k} onClick={() => !disabled && toggle(k)} disabled={disabled}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-semibold transition-colors ${active ? 'bg-brand-ghost text-brand-indigo border-brand-indigo/30' : disabled ? 'opacity-30 cursor-not-allowed bg-gray-50 text-gray-400 border-gray-100' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}>
                    <Icon size={12} /> {label}{active && <Check size={10} weight="bold" className="ml-0.5" />}
                  </button>
                )
              })}
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Follow-ups</div>
              <span className="text-xs font-bold text-brand-indigo">{cfg.followUps === 0 ? 'None' : `${cfg.followUps}×`}</span>
            </div>
            <input type="range" min={0} max={5} value={cfg.followUps}
              onChange={e => setCfg(prev => ({ ...prev, followUps: +e.target.value }))}
              className="w-full accent-brand-indigo" />
            <div className="flex justify-between text-xs text-gray-400 mt-1"><span>None</span><span>5×</span></div>
            {cfg.followUps > 0 && (
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs text-gray-500">Cadence:</span>
                <select value={cfg.cadence} onChange={e => setCfg(prev => ({ ...prev, cadence: e.target.value }))}
                  className="text-xs border border-gray-200 rounded-lg px-2 py-1 outline-none bg-white text-gray-700">
                  {CADENCE_OPTIONS.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            )}
            {cfg.followUps > 0 && (
              <div className="mt-2 flex items-start gap-2 bg-orange-50 border border-orange-100 rounded-lg px-3 py-2 text-xs">
                <Warning size={11} weight="fill" className="text-orange-500 shrink-0 mt-0.5" />
                <span className="text-orange-700">Non-response exception: after {cfg.followUps} follow-ups with no reply, session closes and you're notified.</span>
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Session deadline</div>
              <select value={cfg.deadline} onChange={e => setCfg(prev => ({ ...prev, deadline: e.target.value }))}
                className="text-xs border border-gray-200 rounded-lg px-2 py-1 outline-none bg-white text-gray-700">
                {DEADLINE_OPTIONS.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <p className="text-xs text-gray-400">Session closes automatically after this period.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-xs text-gray-400 mb-2">What your participants will receive:</p>
          <EmailPreviewCard title={pending.title} type={pending.type} cfg={cfg} />
          <div className="text-xs text-gray-400 bg-gray-50 rounded-xl px-3 py-2.5 space-y-1">
            <div><span className="font-semibold text-gray-600">Delivery:</span> {Object.entries(cfg.delivery).filter(([,v]) => v).map(([k]) => k).join(' + ')}</div>
            <div><span className="font-semibold text-gray-600">Follow-ups:</span> {cfg.followUps > 0 ? `${cfg.followUps}× ${cfg.cadence}` : 'None'}</div>
            <div><span className="font-semibold text-gray-600">Closes in:</span> {cfg.deadline}</div>
          </div>
        </div>
      )}
      <button onClick={() => onGenerateReview(cfg)} className="mt-5 btn-primary w-full justify-center py-3 text-sm font-bold">
        <Check size={15} weight="bold" /> Generate conversation review
        <ArrowRight size={14} weight="bold" className="ml-auto" />
      </button>
      <p className="text-center text-[11px] text-gray-400 mt-2">Drafts agenda + question plan · no invites until you accept</p>
    </div>
  )
}

/* ─── Review Comms panel ─── */
function CommsReviewPanel({ pending, cfg, agenda, onAccept, onEdit }: {
  pending: PendingConfig; cfg: SessionConfig; agenda: AgendaBlock[]; onAccept: () => void; onEdit: () => void
}) {
  const modeLine = cfg.mode === 'async'
    ? `Async · ${Object.entries(cfg.delivery).filter(([,v]) => v).map(([k]) => k).join(' + ')}`
    : 'Sync · live call / phone'
  return (
    <div className="bg-white border border-brand-indigo/30 rounded-2xl shadow-lg p-5 w-full max-w-xl ring-1 ring-brand-indigo/10">
      <div className="flex items-start gap-2 mb-1">
        <div className="w-6 h-6 rounded-lg bg-brand-ghost flex items-center justify-center shrink-0 mt-0.5">
          <Sliders size={13} weight="duotone" className="text-brand-indigo" />
        </div>
        <div>
          <div className="text-sm font-bold text-gray-900">Review Comms</div>
          <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">
            The conversation Comms will run -- agenda sections and the questions asked in each. Accept to send, or edit to change settings.
          </div>
        </div>
      </div>
      <div className="mt-4 rounded-xl border border-gray-100 bg-[#FAFBFC] px-3 py-2.5 text-xs text-gray-600 space-y-1">
        <div><span className="font-semibold text-gray-700">Session:</span> {pending.title}</div>
        <div><span className="font-semibold text-gray-700">Participants:</span> {pending.count} {pending.noun}</div>
        <div><span className="font-semibold text-gray-700">Mode:</span> {modeLine}</div>
        <div><span className="font-semibold text-gray-700">Follow-ups:</span> {cfg.followUps > 0 ? `${cfg.followUps}× ${cfg.cadence}` : 'None'} · closes in {cfg.deadline}</div>
      </div>
      <div className="mt-4 space-y-3 max-h-72 overflow-y-auto pr-1">
        {agenda.map((block, i) => (
          <div key={block.title} className="rounded-xl border border-gray-100 bg-white px-3 py-2.5">
            <div className="text-xs font-bold text-brand-indigo">{i + 1}. {block.title}</div>
            <p className="text-xs text-gray-600 mt-1 leading-relaxed">{block.summary}</p>
            <ul className="mt-2 space-y-1 text-[11px] text-gray-500 list-disc pl-4">
              {block.questions.map(q => <li key={q}>{q}</li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-5 flex gap-2">
        <button type="button" onClick={onEdit}
          className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-700 bg-white hover:bg-gray-50 transition-colors">
          Edit settings
        </button>
        <button type="button" onClick={onAccept} className="flex-1 btn-primary justify-center py-3 text-sm font-bold">
          <Check size={15} weight="bold" /> Accept & send
        </button>
      </div>
    </div>
  )
}

/* ─── AI response generator ─── */
function getAIResponse(input: string): Message[] {
  const lower = input.toLowerCase()
  const isSurvey = lower.includes('survey') || lower.includes('feedback') || lower.includes('roadmap') || lower.includes('priorities') || lower.includes('opinion')
  const isCollect = lower.includes('collect') || lower.includes('document') || lower.includes('w-9') || lower.includes('onboard') || lower.includes('availability') || lower.includes('schedule')
  const isTest = lower.includes('screen') || lower.includes('interview') || lower.includes('candidate') || lower.includes('assess')
  const isReview = lower.includes('review') || lower.includes('compliance') || lower.includes('policy') || lower.includes('attest')
  const isTrain = lower.includes('role play') || lower.includes('practice') || lower.includes('coach') || lower.includes('pitch') || lower.includes('train')
  const countMatch = input.match(/\d+/)
  const count = countMatch ? parseInt(countMatch[0]) : 5
  const noun = ['contractors', 'candidates', 'employees', 'vendors', 'engineers', 'reps', 'managers', 'participants'].find(n => lower.includes(n)) ?? 'participants'
  if (isTest) return [
    { id: `r${Date.now()}`, role: 'assistant', text: `Got it -- structured screening session for ${count} ${noun}. Scenario-based probes mapped to your rubric, adaptive follow-ups, ranked outcome. Configure mode and delivery below, then review the agenda before invites send.` },
    { id: `r${Date.now() + 1}`, role: 'config', text: '', configPhase: 'configure', pendingConfig: { title: `Candidate Screening × ${count}`, type: 'Test', count, noun } },
  ]
  if (isTrain) return [
    { id: `r${Date.now()}`, role: 'assistant', text: `On it -- role-play practice sessions for ${count} ${noun}. Each drills with the AI, gets rubric-scored feedback, and a personalised improvement plan. Configure below then review before invites go out.` },
    { id: `r${Date.now() + 1}`, role: 'config', text: '', configPhase: 'configure', pendingConfig: { title: `Training Role-Play × ${count}`, type: 'Train', count, noun } },
  ]
  if (isSurvey) return [
    { id: `r${Date.now()}`, role: 'assistant', text: `Sure -- structured async survey for ${count} ${noun}. Conversational link, open-ended probes for reasoning, themed output with attributed quotes. Configure delivery and follow-ups below, then review the question outline.` },
    { id: `r${Date.now() + 1}`, role: 'config', text: '', configPhase: 'configure', pendingConfig: { title: `Survey × ${count}`, type: 'Collect', count, noun } },
  ]
  if (isCollect) return [
    { id: `r${Date.now()}`, role: 'assistant', text: `Understood -- I'll send each ${noun.slice(0, -1)} a secure link to walk through the checklist. Follows up automatically until everything's in. Configure invite delivery and cadence below, then review the draft before anything sends.` },
    { id: `r${Date.now() + 1}`, role: 'config', text: '', configPhase: 'configure', pendingConfig: { title: `Collection × ${count}`, type: 'Collect', count, noun } },
  ]
  if (isReview) return [
    { id: `r${Date.now()}`, role: 'assistant', text: `Creating a review session -- guided walkthrough with comprehension checks and formal attestation. Configure follow-ups and mode below, then review the Comms draft.` },
    { id: `r${Date.now() + 1}`, role: 'config', text: '', configPhase: 'configure', pendingConfig: { title: `Compliance Review × ${count}`, type: 'Review', count, noun } },
  ]
  return [
    { id: `r${Date.now()}`, role: 'assistant', text: `I can help with that. Could you be more specific? For example: "Collect W-9s from 10 vendors" or "Screen 5 engineers for the backend role." The more detail you give, the better I can structure the conversation.` },
  ]
}

/* ─── Main page ─── */
export function DispatcherPage() {
  const [activeScenario, setActiveScenario] = useState(SCENARIOS[0].key)
  const [messages, setMessages] = useState<Message[]>(() => makeScenarioMessages(SCENARIOS[0]))
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [dispatchedIds, setDispatchedIds] = useState<Set<string>>(new Set())
  const [expandedSession, setExpandedSession] = useState<string | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const recognitionRef = useRef<any>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, loading])

  /* ── Voice input ── */
  const startVoice = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) return
    const rec = new SpeechRecognition()
    rec.continuous = false
    rec.interimResults = true
    rec.onresult = (e: any) => {
      const t = Array.from(e.results as any[]).map((r: any) => r[0].transcript).join('')
      setInput(t)
    }
    rec.onend = () => setIsRecording(false)
    rec.start()
    recognitionRef.current = rec
    setIsRecording(true)
  }, [])

  const stopVoice = useCallback(() => {
    recognitionRef.current?.stop()
    setIsRecording(false)
  }, [])

  const toggleVoice = useCallback(() => {
    if (isRecording) { stopVoice() } else { startVoice() }
  }, [isRecording, startVoice, stopVoice])

  /* ── Global space-to-speak ── */
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.code !== 'Space') return
      // Ignore if typing in any other interactive element
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'SELECT' || tag === 'BUTTON') return
      // Ignore if textarea already has content
      const area = textareaRef.current
      if (area && area.value.trim()) return
      e.preventDefault()
      if (!isRecording) {
        area?.focus()
        startVoice()
      } else {
        stopVoice()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isRecording, startVoice, stopVoice])

  /* ── Scenario switch ── */
  function switchScenario(key: string) {
    setActiveScenario(key)
    const s = SCENARIOS.find(s => s.key === key)!
    setMessages(makeScenarioMessages(s))
    setDispatchedIds(new Set())
    setInput('')
    setExpandedSession(null)
  }

  /* ── Send ── */
  function send() {
    if (!input.trim() || loading) return
    const userMsg: Message = { id: `u${Date.now()}`, role: 'user', text: input.trim() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)
    setTimeout(() => {
      setMessages(prev => [...prev, ...getAIResponse(userMsg.text)])
      setLoading(false)
    }, 1100)
  }

  function handleGenerateReview(msgId: string, cfg: SessionConfig) {
    setMessages(prev => prev.map(m =>
      m.id === msgId && m.role === 'config' ? { ...m, configPhase: 'review', sessionConfig: cfg } : m,
    ))
    setMessages(prev => [...prev, {
      id: `a${Date.now()}`, role: 'assistant',
      text: "Here's the Comms draft -- agenda sections and questions we'll ask in each. Accept to send invites, or Edit to change settings.",
    }])
  }

  function handleEditReview(msgId: string) {
    setMessages(prev => prev.map(m =>
      m.id === msgId && m.role === 'config' ? { ...m, configPhase: 'configure', sessionConfig: undefined } : m,
    ))
  }

  function handleDispatch(msgId: string, pending: PendingConfig, cfg: SessionConfig) {
    setDispatchedIds(prev => new Set([...prev, msgId]))
    const modeLabel = cfg.mode === 'async'
      ? `Async -- Chat link (${Object.entries(cfg.delivery).filter(([,v]) => v).map(([k]) => k.toUpperCase()).join(' + ')})`
      : 'Sync -- Live call / Phone'
    setMessages(prev => [...prev,
      { id: `sess${Date.now()}`, role: 'system', text: '', session: {
        title: pending.title, type: pending.type,
        count: `${pending.count} ${pending.noun}`, mode: modeLabel,
      }},
      { id: `conf${Date.now()}`, role: 'assistant',
        text: `Comms accepted -- invites going to ${pending.count} ${pending.noun} via ${Object.entries(cfg.delivery).filter(([,v]) => v).map(([k]) => k).join(' + ')}. ${cfg.followUps > 0 ? `I'll follow up ${cfg.followUps}× ${cfg.cadence} for anyone who hasn't responded. ` : ''}Session closes in ${cfg.deadline}. I'll notify you when results are in.`,
      },
    ])
  }

  return (
    <div className="h-screen flex flex-col bg-[#F9FAFB]">
      <Nav />
      <div className="flex flex-1 min-h-0 overflow-hidden pt-14">

        {/* ── Sidebar ── */}
        <div className="w-64 app-sidebar flex flex-col shrink-0 overflow-y-auto">
          <div className="px-4 pt-5 pb-3">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Sessions</span>
              <button className="w-5 h-5 rounded-md bg-brand-ghost flex items-center justify-center hover:bg-brand-secondary transition-colors">
                <Plus size={11} className="text-brand-indigo" />
              </button>
            </div>

            {SESSIONS.map(s => {
              const isExpanded = expandedSession === s.id
              return (
                <div key={s.id} className="mb-1">
                  <button
                    onClick={() => setExpandedSession(isExpanded ? null : s.id)}
                    className={`w-full text-left flex items-start gap-2.5 px-3 py-2.5 rounded-xl transition-colors ${isExpanded ? 'bg-brand-ghost' : 'hover:bg-white'}`}
                  >
                    <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${s.status === 'done' ? 'bg-green-400' : 'bg-brand-indigo animate-pulse'}`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-800 truncate leading-snug">{s.title}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{s.count} · {s.date}</div>
                    </div>
                    <div className={`mt-0.5 transition-transform shrink-0 ${isExpanded ? 'rotate-180' : ''}`}>
                      <CaretDown size={12} weight="bold" className="text-gray-400" />
                    </div>
                  </button>

                  {/* Inline accordion */}
                  {isExpanded && (
                    <div className="mx-2 mb-2 bg-white rounded-xl border border-gray-100 shadow-sm p-3 space-y-3">
                      <div className="flex gap-1.5 flex-wrap">
                        <span className={`pill text-[10px] ${catColors[s.cat] ?? 'pill-done'}`}>{s.cat}</span>
                        <span className={`pill text-[10px] ${s.status === 'done' ? 'pill-done' : 'pill-active'}`}>
                          {s.status === 'done' ? 'Complete' : 'Active'}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 space-y-1">
                        <div className="flex justify-between"><span className="text-gray-400">Mode</span><span>{s.mode}</span></div>
                        <div className="flex justify-between"><span className="text-gray-400">Follow-ups</span><span>{s.followUps}</span></div>
                      </div>
                      {s.findings.length > 0 && (
                        <div>
                          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Findings</div>
                          <div className="space-y-1">
                            {s.findings.map((f, i) => (
                              <div key={i} className="flex items-start gap-1.5 text-xs text-gray-700">
                                <Check size={10} weight="bold" className="text-green-500 shrink-0 mt-0.5" /> {f}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {s.action && (
                        <div className="flex items-start gap-1.5 bg-brand-ghost rounded-lg px-2.5 py-2">
                          <Star size={11} className="text-brand-indigo shrink-0 mt-0.5" />
                          <p className="text-xs text-brand-shaft leading-snug">{s.action}</p>
                        </div>
                      )}
                      <button
                        onClick={() => {
                          setInput(`Based on the "${s.title}" session, `)
                          setExpandedSession(null)
                          textareaRef.current?.focus()
                        }}
                        className="w-full btn-primary text-xs py-2 justify-center"
                      >
                        Use as context <CaretRight size={11} weight="bold" />
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Nav shortcuts */}
          <div className="mt-auto px-4 pb-4 space-y-1 border-t border-gray-100 pt-4">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Prototypes</div>
            {[
              { icon: VideoCamera,      label: 'Sync -- Live Call',    href: '/app/sync' },
              { icon: ChatTeardropText, label: 'Async -- Chat Link',   href: '/app/async' },
              { icon: Archive,          label: 'Comms Sessions',       href: '/app/sessions' },
              { icon: Users,            label: 'Contacts',             href: '/app/contacts' },
            ].map(l => {
              const Icon = l.icon
              return (
                <Link key={l.href} to={l.href}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-gray-500 hover:text-brand-indigo hover:bg-brand-ghost transition-colors">
                  <Icon size={14} /> {l.label}
                </Link>
              )
            })}
          </div>

          <div className="px-4 pb-4">
            <div className="flex items-center gap-2.5 bg-brand-ghost rounded-xl px-3 py-2.5">
              <div className="w-7 h-7 rounded-full bg-brand-indigo flex items-center justify-center text-xs text-white font-semibold">J</div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-brand-shaft">Jamie</div>
                <div className="text-xs text-brand-light">Admin</div>
              </div>
              <Gear size={13} weight="light" className="text-gray-400" />
            </div>
          </div>
        </div>

        {/* ── Main chat ── */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* Header + scenario tabs */}
          <div className="bg-white border-b border-gray-100 shrink-0">
            <div className="flex items-center justify-between px-6 py-3.5">
              <div>
                <div className="font-semibold text-gray-900 flex items-center gap-2">
                  <Sparkle size={15} weight="duotone" className="text-brand-indigo" />
                  Work Dispatcher
                </div>
                <div className="text-sm text-gray-400 mt-0.5">Configure → review Comms → accept to send</div>
              </div>
              <div className="pill pill-active text-xs">
                {SESSIONS.filter(s => s.status === 'active').length} active
              </div>
            </div>

            {/* Scenario tabs -- always visible */}
            <div className="px-6 pb-3 flex gap-1.5 overflow-x-auto">
              {SCENARIOS.map(s => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => switchScenario(s.key)}
                  className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors whitespace-nowrap ${
                    activeScenario === s.key
                      ? 'bg-brand-indigo text-white border-brand-indigo shadow-sm'
                      : 'bg-[#F4F4F6] text-gray-600 border-transparent hover:border-gray-200 hover:bg-white'
                  }`}
                >
                  {s.label}
                </button>
              ))}
              <span className="shrink-0 text-xs text-gray-400 self-center pl-1">← try a scenario</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : msg.role === 'system' || msg.role === 'config' ? 'justify-center' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="flex items-start gap-3 max-w-2xl">
                    <div className="w-8 h-8 rounded-xl bg-brand-indigo flex items-center justify-center shrink-0 mt-0.5">
                      <Sparkle size={14} weight="fill" className="text-white" />
                    </div>
                    <div className="bg-white rounded-2xl rounded-tl-sm border border-gray-100 px-5 py-3.5 text-[15px] text-gray-800 shadow-sm leading-relaxed">
                      {msg.text}
                    </div>
                  </div>
                )}
                {msg.role === 'user' && (
                  <div className="bubble-user max-w-2xl text-[15px]">{msg.text}</div>
                )}
                {msg.role === 'config' && msg.pendingConfig && (
                  dispatchedIds.has(msg.id) ? (
                    <div className="flex items-center gap-2 text-sm text-gray-400 bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5">
                      <Check size={13} className="text-green-500" /> Conversation accepted · invites sent
                    </div>
                  ) : msg.configPhase === 'review' && msg.sessionConfig ? (
                    <CommsReviewPanel
                      pending={msg.pendingConfig}
                      cfg={msg.sessionConfig}
                      agenda={buildAgendaBlocks(msg.pendingConfig.type as ConversationSessionType, msg.pendingConfig.title)}
                      onAccept={() => handleDispatch(msg.id, msg.pendingConfig!, msg.sessionConfig!)}
                      onEdit={() => handleEditReview(msg.id)}
                    />
                  ) : (
                    <SessionConfigPanel
                      pending={msg.pendingConfig}
                      onGenerateReview={cfg => handleGenerateReview(msg.id, cfg)}
                    />
                  )
                )}
                {msg.role === 'system' && msg.session && (
                  <div className="bg-white border border-brand-indigo/20 rounded-2xl shadow-md p-5 w-full max-w-xl">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 rounded-lg bg-green-100 flex items-center justify-center">
                        <Check size={13} weight="bold" className="text-green-600" />
                      </div>
                      <span className="text-sm font-semibold text-green-700">Session Created</span>
                    </div>
                    <div className="font-bold text-gray-900 text-base mb-4">{msg.session.title}</div>
                    <div className="grid grid-cols-2 gap-2.5">
                      {[
                        { label: 'Type', value: msg.session.type },
                        { label: 'Participants', value: msg.session.count },
                        { label: 'Mode', value: msg.session.mode },
                        { label: 'Status', value: 'Sending invites...' },
                      ].map(f => (
                        <div key={f.label} className="bg-[#F9FAFB] rounded-xl px-3 py-2.5">
                          <div className="text-xs text-gray-400 mb-1">{f.label}</div>
                          <div className="text-sm font-semibold text-gray-800">{f.value}</div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 flex gap-2">
                      <span className={`pill text-xs ${catColors[msg.session.type] ?? 'pill-done'}`}>{msg.session.type}</span>
                      <span className="pill pill-pending text-xs"><Clock size={10} /> In progress</span>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-brand-indigo flex items-center justify-center shrink-0">
                  <Sparkle size={14} weight="fill" className="text-white" />
                </div>
                <div className="bg-white rounded-2xl rounded-tl-sm border border-gray-100 px-5 py-4 shadow-sm flex items-center gap-2">
                  <div className="typing-dot w-2 h-2 rounded-full bg-gray-400" />
                  <div className="typing-dot w-2 h-2 rounded-full bg-gray-400" />
                  <div className="typing-dot w-2 h-2 rounded-full bg-gray-400" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* ── Composer ── */}
          <div className="shrink-0 px-6 py-4 bg-white border-t border-gray-100">
            <div className={`flex items-end gap-3 rounded-2xl px-5 py-4 transition-colors ${isRecording ? 'bg-red-50 ring-2 ring-red-200' : 'bg-[#F3F4F6] focus-within:ring-2 focus-within:ring-brand-indigo/20'}`}>
              <button
                type="button"
                onClick={toggleVoice}
                title="Voice input (or press Space when input is empty)"
                className={`shrink-0 mb-0.5 rounded-xl p-1.5 transition-colors ${isRecording ? 'text-red-500 bg-red-100' : 'text-gray-400 hover:text-brand-indigo hover:bg-brand-ghost'}`}
              >
                {isRecording ? <WaveTriangle size={18} weight="fill" className="animate-pulse" /> : <Microphone size={18} weight="light" />}
              </button>
              <textarea
                ref={textareaRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.code === 'Space' && !input.trim()) { e.preventDefault(); toggleVoice(); return }
                  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
                }}
                placeholder={isRecording ? 'Listening... speak now' : "Describe what you need to communicate... (or press Space to speak)"}
                rows={2}
                className="flex-1 bg-transparent text-[15px] text-gray-800 placeholder-gray-400 resize-none max-h-40 leading-relaxed"
                style={{ minHeight: '3rem', outline: 'none', boxShadow: 'none' }}
              />
              <button
                onClick={send}
                disabled={!input.trim() || loading}
                className="w-10 h-10 rounded-xl bg-brand-indigo disabled:opacity-40 flex items-center justify-center hover:bg-brand-mid transition-colors shrink-0"
              >
                <ArrowRight size={17} className="text-white" />
              </button>
            </div>
            <div className="flex justify-end mt-2 px-1">
              <div className="text-xs text-gray-300">⏎ send · Shift+⏎ newline · Space to speak</div>
            </div>
          </div>
        </div>
      </div>

      <PrototypeBanner
        title="Prototype: Work Dispatcher"
        description="Design mock -- configure conversation → review Comms draft → accept to send. Switch scenarios via tabs. Click sessions to expand."
      />
    </div>
  )
}
