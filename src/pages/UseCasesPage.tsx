import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { MagnifyingGlass, ArrowRight, Check, Envelope, DeviceMobileCamera, Phone,
  CaretDown, CaretRight, VideoCamera, ChatTeardropText, Clock, Warning } from '@phosphor-icons/react'
import { Nav } from '../components/Nav'
import { USE_CASES, PILLAR_META, type UseCase, type Pillar } from '../data/useCases'
import { buildAgendaBlocks, inferSessionTypeForUseCase } from '../data/conversationAgenda'

const MODE_LABEL: Record<string, string> = {
  sync:  'Sync — Live call',
  async: 'Async — Chat link',
  both:  'Sync or Async',
}
const MODE_COLOR: Record<string, string> = {
  sync:  'bg-blue-50 border-blue-200 text-blue-700',
  async: 'bg-green-50 border-green-200 text-green-700',
  both:  'bg-violet-50 border-violet-200 text-violet-700',
}
const CHANNEL_ICON: Record<string, React.ElementType> = {
  email: Envelope,
  sms:   DeviceMobileCamera,
  phone: Phone,
}

const ALL_PILLARS: Pillar[] = ['talent','revenue','compliance','operations','people','success','learning','project']

function EmailPreview({ uc }: { uc: UseCase }) {
  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm text-sm">
      {/* Email chrome */}
      <div className="bg-[#F3F4F6] px-4 py-2.5 border-b border-gray-200">
        <div className="text-xs text-gray-400 space-y-0.5">
          <div><span className="font-semibold text-gray-600">From:</span> Comms by Assembly &lt;no-reply@comms.ai&gt;</div>
          <div><span className="font-semibold text-gray-600">To:</span> participant@example.com</div>
          <div><span className="font-semibold text-gray-600">Subject:</span> {uc.delivery.subject}</div>
        </div>
      </div>
      <div className="bg-white px-5 py-4">
        <p className="text-gray-700 text-sm leading-relaxed">{uc.delivery.preview}</p>
        <div className="mt-4">
          <div className="inline-block bg-[#4F59CC] text-white text-sm font-semibold px-5 py-2.5 rounded-xl">
            {uc.mode === 'sync' ? 'Join your session →' : 'Start when ready →'}
          </div>
        </div>
        <p className="mt-3 text-xs text-gray-400">
          This link works on any phone or desktop. No app needed.
          {uc.followUps.defaultCount > 0 && ` Comms will follow up ${uc.followUps.defaultCount}x if you don't respond.`}
        </p>
      </div>
    </div>
  )
}

function SMSPreview({ uc }: { uc: UseCase }) {
  return (
    <div className="bg-[#1C1C1E] rounded-2xl p-4 max-w-xs">
      <div className="text-xs text-gray-500 text-center mb-3">Messages · Comms</div>
      <div className="bg-[#3A3A3C] rounded-2xl rounded-tl-sm px-4 py-3 text-white text-sm leading-relaxed">
        {uc.delivery.preview.length > 120 ? uc.delivery.preview.slice(0, 120) + '…' : uc.delivery.preview}
        {' '}<span className="text-blue-400 underline">comms.ai/s/abc123</span>
      </div>
    </div>
  )
}

function EndToEndFlow({ uc }: { uc: UseCase }) {
  const [previewTab, setPreviewTab] = useState<'email' | 'sms'>(
    uc.delivery.channels[0] as 'email' | 'sms'
  )

  const agendaBlocks = buildAgendaBlocks(inferSessionTypeForUseCase(uc), uc.title)

  const steps = [
    {
      n: '01',
      label: 'You dispatch',
      color: 'bg-brand-ghost border-brand-indigo/20',
      labelColor: 'text-brand-indigo',
      content: (
        <div className="bg-[#0D1117] rounded-xl p-4 font-mono text-sm text-[#C9D1D9] leading-relaxed">
          <span className="text-[#8B949E]">// Work Dispatcher</span>
          <br />
          <span className="text-[#FFA7C4]">you</span>: {uc.dispatchExample}
        </div>
      ),
    },
    {
      n: '02',
      label: 'Review Comms',
      color: 'bg-violet-50 border-violet-200',
      labelColor: 'text-violet-800',
      content: (
        <div className="space-y-3">
          <p className="text-sm text-gray-600 leading-relaxed">
            After you configure mode, invites, and follow-ups, Comms generates a conversation plan: agenda sections and the questions asked in each. Nothing is sent until you <strong className="text-gray-800">accept</strong> (or edit and regenerate).
          </p>
          <div className="rounded-xl border border-violet-100 bg-white p-4 space-y-2.5">
            <div className="text-xs font-bold text-violet-700 uppercase tracking-wide">Draft agenda</div>
            {agendaBlocks.map((b, i) => (
              <div key={b.title} className="text-sm border-t border-gray-100 pt-2 first:border-0 first:pt-0">
                <div className="font-semibold text-gray-900">
                  {i + 1}. {b.title}
                </div>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">{b.summary}</p>
                <ul className="mt-1.5 text-xs text-gray-500 list-disc pl-4 space-y-0.5">
                  {b.questions.slice(0, 2).map(q => (
                    <li key={q}>{q}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      n: '03',
      label: 'Invites sent',
      color: 'bg-green-50 border-green-200',
      labelColor: 'text-green-700',
      content: (
        <div className="space-y-2.5">
          <div className="flex items-center gap-2 text-sm font-semibold text-green-700">
            <Check size={14} weight="bold" className="text-green-600" />
            Comms accepted — session dispatched · {uc.title} × N participants
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {[
              { k: 'Mode', v: MODE_LABEL[uc.mode] },
              { k: 'Duration', v: `~${uc.durationMin} min` },
              { k: 'Invites via', v: uc.delivery.channels.map(c => c.toUpperCase()).join(' + ') },
              { k: 'Follow-ups', v: `${uc.followUps.defaultCount}x · ${uc.followUps.cadence}` },
            ].map(f => (
              <div key={f.k} className="bg-white rounded-lg px-3 py-2 border border-gray-100">
                <div className="text-xs text-gray-400">{f.k}</div>
                <div className="font-medium text-gray-800 mt-0.5">{f.v}</div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      n: '04',
      label: 'Participant receives',
      color: 'bg-gray-50 border-gray-200',
      labelColor: 'text-gray-600',
      content: (
        <div>
          {uc.delivery.channels.length > 1 && (
            <div className="flex gap-2 mb-3">
              {uc.delivery.channels.filter(c => c !== 'phone').map(ch => (
                <button
                  key={ch}
                  onClick={() => setPreviewTab(ch as 'email' | 'sms')}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
                    previewTab === ch
                      ? 'bg-brand-indigo text-white border-brand-indigo'
                      : 'bg-white text-gray-500 border-gray-200 hover:border-brand-indigo/40'
                  }`}
                >
                  {ch === 'email' ? <Envelope size={11} /> : <DeviceMobileCamera size={11} />}
                  {ch.toUpperCase()}
                </button>
              ))}
            </div>
          )}
          {previewTab === 'email' && uc.delivery.channels.includes('email') ? (
            <EmailPreview uc={uc} />
          ) : (
            <SMSPreview uc={uc} />
          )}
          {uc.mode === 'sync' && (
            <div className="mt-2 flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-xl px-3 py-2.5 text-sm">
              <Phone size={13} weight="bold" className="text-blue-600 shrink-0 mt-0.5" />
              <span className="text-blue-700">For sync sessions, Comms can also <strong>call participants directly</strong> at the scheduled time — no link needed.</span>
            </div>
          )}
        </div>
      ),
    },
    {
      n: '05',
      label: 'You get back',
      color: 'bg-brand-ghost border-brand-indigo/20',
      labelColor: 'text-brand-indigo',
      content: (
        <div className="space-y-2">
          {uc.outcome.map((o, i) => (
            <div key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
              <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                <Check size={10} weight="bold" className="text-green-600" />
              </div>
              {o}
            </div>
          ))}
          <div className="mt-3 bg-white border border-orange-200 rounded-xl px-3 py-2.5 flex items-start gap-2 text-sm">
            <Warning size={13} weight="fill" className="text-orange-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-orange-700">No response exception: </span>
              <span className="text-gray-600">{uc.followUps.exception}</span>
            </div>
          </div>
        </div>
      ),
    },
  ]

  return (
    <div className="mt-6 space-y-4">
      {steps.map((step, i) => (
        <div key={step.n}>
          <div className={`rounded-2xl border p-5 ${step.color}`}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold tracking-widest text-gray-400">{step.n}</span>
              <span className={`text-sm font-bold ${step.labelColor}`}>{step.label}</span>
            </div>
            {step.content}
          </div>
          {i < steps.length - 1 && (
            <div className="flex justify-center py-1">
              <CaretDown size={14} weight="bold" className="text-gray-300" />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function UseCaseCard({ uc }: { uc: UseCase }) {
  const [expanded, setExpanded] = useState(false)
  const pm = PILLAR_META[uc.pillar]

  return (
    <div className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
      expanded ? 'border-brand-indigo/30 shadow-lg shadow-brand-indigo/8' : 'border-gray-100 shadow-sm hover:border-brand-indigo/20 hover:shadow-md'
    }`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-5"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {/* Badges */}
            <div className="flex items-center gap-2 mb-2.5 flex-wrap">
              <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full border ${pm.bg} ${pm.color}`}>
                {pm.label}
              </span>
              <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${MODE_COLOR[uc.mode]}`}>
                {uc.mode === 'sync' ? <VideoCamera size={10} /> : uc.mode === 'async' ? <ChatTeardropText size={10} /> : null}
                {MODE_LABEL[uc.mode]}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-gray-400 bg-gray-50 border border-gray-100 px-2 py-1 rounded-full">
                <Clock size={10} /> ~{uc.durationMin} min
              </span>
            </div>

            <div className="text-base font-bold text-gray-900 leading-snug">{uc.title}</div>
            <p className="text-sm text-gray-500 mt-1 leading-relaxed">{uc.jobToBeDone}</p>

            {/* Delivery channels */}
            <div className="flex items-center gap-2 mt-3">
              <span className="text-xs text-gray-400">Delivered via</span>
              {uc.delivery.channels.map(ch => {
                const Icon = CHANNEL_ICON[ch]
                return (
                  <span key={ch} className="flex items-center gap-1 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-md">
                    <Icon size={10} /> {ch}
                  </span>
                )
              })}
            </div>
          </div>

          <div className={`shrink-0 transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`}>
            <CaretRight size={16} weight="bold" className="text-gray-400" />
          </div>
        </div>
      </button>

      {expanded && (
        <div className="px-5 pb-6 border-t border-gray-50 pt-4">
          <p className="text-sm text-gray-500 italic mb-1">Example dispatch (then configure → review Comms → accept):</p>
          <p className="text-sm font-medium text-gray-800 bg-brand-ghost rounded-xl px-4 py-3 leading-relaxed">
            "{uc.dispatchExample}"
          </p>
          <EndToEndFlow uc={uc} />
          <div className="mt-5 pt-4 border-t border-gray-100">
            <Link to="/app/dispatcher"
              className="btn-primary w-full justify-center py-3">
              Try this in the Dispatcher <ArrowRight size={14} weight="bold" />
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export function UseCasesPage() {
  const [search, setSearch] = useState('')
  const [activePillar, setActivePillar] = useState<Pillar | 'all'>('all')
  const [activeMode, setActiveMode] = useState<'all' | 'sync' | 'async'>('all')

  const filtered = useMemo(() => {
    return USE_CASES.filter(uc => {
      const matchPillar = activePillar === 'all' || uc.pillar === activePillar
      const matchMode = activeMode === 'all' || uc.mode === activeMode || uc.mode === 'both'
      const q = search.toLowerCase()
      const matchSearch = !q || uc.title.toLowerCase().includes(q) || uc.jobToBeDone.toLowerCase().includes(q) || PILLAR_META[uc.pillar].label.toLowerCase().includes(q)
      return matchPillar && matchMode && matchSearch
    })
  }, [search, activePillar, activeMode])

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Nav />
      <div className="pt-14">

        {/* Header */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-6 lg:px-8 py-12">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-brand-ghost text-brand-indigo px-3.5 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-4">
                27 Use Cases
              </div>
              <h1 className="text-4xl font-bold text-gray-900 leading-tight">
                Every conversation you need.<br />
                <span className="gradient-text">End to end.</span>
              </h1>
              <p className="mt-4 text-lg text-gray-500 leading-relaxed">
                From candidate screening to vendor onboarding to sales training — Comms handles the full conversation and returns a structured outcome. Click any use case to see exactly how it works.
              </p>
            </div>

            {/* Search + filters */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1 max-w-md">
                <MagnifyingGlass size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search use cases..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-brand-indigo/50 focus:ring-2 focus:ring-brand-indigo/10"
                />
              </div>
              <div className="flex gap-2">
                {(['all', 'sync', 'async'] as const).map(m => (
                  <button
                    key={m}
                    onClick={() => setActiveMode(m)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${
                      activeMode === m
                        ? 'bg-brand-indigo text-white border-brand-indigo'
                        : 'bg-white text-gray-500 border-gray-200 hover:border-brand-indigo/30'
                    }`}
                  >
                    {m === 'all' ? 'All modes' : m === 'sync' ? 'Sync' : 'Async'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Pillar filter */}
        <div className="bg-white border-b border-gray-100 sticky top-14 z-30">
          <div className="max-w-6xl mx-auto px-6 lg:px-8 py-3 flex gap-2 overflow-x-auto pb-3">
            <button
              onClick={() => setActivePillar('all')}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors ${
                activePillar === 'all'
                  ? 'bg-brand-indigo text-white border-brand-indigo'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
              }`}
            >
              All ({USE_CASES.length})
            </button>
            {ALL_PILLARS.map(p => {
              const pm = PILLAR_META[p]
              const count = USE_CASES.filter(uc => uc.pillar === p).length
              return (
                <button
                  key={p}
                  onClick={() => setActivePillar(p)}
                  className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors ${
                    activePillar === p
                      ? `${pm.bg} ${pm.color} border-current`
                      : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {pm.label} ({count})
                </button>
              )
            })}
          </div>
        </div>

        {/* Grid */}
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-8">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-lg font-medium">No use cases match your filters.</p>
              <button onClick={() => { setSearch(''); setActivePillar('all'); setActiveMode('all') }}
                className="mt-3 text-sm text-brand-indigo hover:underline">Clear all filters</button>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto w-full">
              <div className="text-sm text-gray-400 mb-5 font-medium">
                {filtered.length} use case{filtered.length !== 1 ? 's' : ''}
                {search && ` matching "${search}"`}
              </div>
              <div className="flex flex-col gap-4">
                {filtered.map(uc => (
                  <UseCaseCard key={uc.id} uc={uc} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="max-w-6xl mx-auto px-6 lg:px-8 pb-16">
          <div className="bg-gradient-to-r from-brand-navy to-brand-indigo rounded-3xl px-8 py-10 text-white text-center">
            <h2 className="text-2xl font-bold mb-2">Ready to try one?</h2>
            <p className="text-white/60 mb-5">Describe any use case to the Dispatcher — configure, review the Comms draft, accept, then invites go out.</p>
            <Link to="/app/dispatcher" className="inline-flex items-center gap-2 bg-white text-brand-indigo font-bold px-7 py-3 rounded-xl hover:bg-brand-ghost transition-colors">
              Open Work Dispatcher <ArrowRight size={15} weight="bold" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
