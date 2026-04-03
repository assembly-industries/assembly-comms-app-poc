import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  EnvelopeSimple, DeviceMobileCamera, Globe, Check, ArrowRight,
  ShieldCheck, Sparkle, ChatTeardropText, Bell, Lock,
  Star, Users, CaretRight,
} from '@phosphor-icons/react'
import { Nav } from '../components/Nav'
import { Footer } from '../components/Footer'

/* ─── Email mockup ─── */
function EmailPreview({ company = 'Harbor Health' }: { company?: string }) {
  const [smsOptIn, setSmsOptIn] = useState(false)
  return (
    <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden max-w-lg w-full">
      {/* Email client chrome */}
      <div className="bg-gray-100 border-b border-gray-200 px-4 py-2.5 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <span className="text-xs text-gray-500 mx-auto">Inbox · Mail</span>
      </div>

      {/* Email envelope header (client row) */}
      <div className="px-5 py-3 border-b border-gray-100 bg-gray-50/60 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Sender logo */}
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1a56db] to-[#6366f1] flex items-center justify-center shrink-0 shadow-sm">
            <span className="text-[11px] font-bold text-white tracking-tight">HH</span>
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-gray-900 truncate">{company}</div>
            <div className="text-[11px] text-gray-400 truncate">procurement@harborhealth.com</div>
          </div>
        </div>
        <span className="text-xs text-gray-400 shrink-0">9:14 AM</span>
      </div>
      <div className="px-5 py-2.5 border-b border-gray-100 bg-gray-50/40">
        <div className="text-sm font-semibold text-gray-900">Action needed: Annual COI renewal · {company}</div>
      </div>

      {/* Email body */}
      <div className="px-6 py-6 space-y-5">
        {/* Logo + brand header */}
        <div className="text-center pb-4 border-b border-gray-100">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1a56db] to-[#6366f1] shadow-lg mb-3">
            <span className="text-2xl font-bold text-white tracking-tight">HH</span>
          </div>
          <div className="text-base font-bold text-gray-900">{company}</div>
          <div className="text-xs text-gray-400 mt-0.5">Vendor Document Portal</div>
        </div>

        <div className="space-y-3">
          <p className="text-sm text-gray-700 leading-relaxed">Hi Alex,</p>
          <p className="text-sm text-gray-700 leading-relaxed">
            It's time for your annual certificate of insurance renewal. This takes about <strong className="text-gray-900">5 minutes</strong> and can be done on your phone or laptop.
          </p>
        </div>

        {/* What to expect */}
        <div className="bg-gray-50 rounded-xl px-4 py-3.5 space-y-2">
          {[
            'Upload your current certificate of insurance',
            'Confirm policy dates and coverage limits',
            'Verify named insured matches your contract',
          ].map(item => (
            <div key={item} className="flex items-center gap-2 text-sm text-gray-600">
              <Check size={11} weight="bold" className="text-green-500 shrink-0" />
              {item}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="inline-block bg-[#1a56db] text-white font-semibold text-sm px-8 py-3.5 rounded-xl cursor-pointer shadow-sm hover:opacity-90 transition-opacity">
            Complete renewal →
          </div>
          <div className="text-xs text-gray-400 mt-2">Opens in your browser · no account needed</div>
        </div>

        {/* SMS opt-in row — built into every email */}
        <div
          onClick={() => setSmsOptIn(v => !v)}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all ${smsOptIn ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200 hover:border-gray-300'}`}
        >
          <DeviceMobileCamera size={16} className={smsOptIn ? 'text-green-600' : 'text-gray-400'} />
          <div className="flex-1">
            <div className={`text-xs font-semibold ${smsOptIn ? 'text-green-700' : 'text-gray-600'}`}>
              {smsOptIn ? 'SMS reminders on ✓' : 'Also receive updates via SMS?'}
            </div>
            <div className="text-[10px] text-gray-400">No spam · unsubscribe anytime · tap to {smsOptIn ? 'turn off' : 'opt in'}</div>
          </div>
          {/* Toggle */}
          <div className={`w-9 h-5 rounded-full transition-colors relative shrink-0 ${smsOptIn ? 'bg-green-500' : 'bg-gray-300'}`}>
            <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${smsOptIn ? 'translate-x-4' : 'translate-x-0.5'}`} />
          </div>
        </div>

        <div className="border-t border-gray-100 pt-4 text-xs text-gray-400 space-y-1.5">
          <p>Sent on behalf of <strong className="text-gray-600">{company}</strong> · Questions? Reply to this email.</p>
          <div className="flex items-center gap-3">
            <a href="#" className="underline hover:text-gray-600">Unsubscribe</a>
            <span>·</span>
            <a href="#" className="underline hover:text-gray-600">Privacy</a>
            <span>·</span>
            <span className="flex items-center gap-1"><Lock size={9} /> Secure link</span>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Mobile web app mockup ─── */
function MobilePreview() {
  return (
    <div className="relative mx-auto w-64">
      {/* Phone frame */}
      <div className="bg-[#1a1a2e] rounded-[2.5rem] p-2 shadow-2xl border border-white/10">
        <div className="bg-white rounded-[2rem] overflow-hidden" style={{ height: '520px' }}>
          {/* Status bar */}
          <div className="bg-brand-indigo px-5 pt-3 pb-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-white/60 text-[10px] font-semibold">9:14 AM</span>
              <div className="flex gap-1 items-center">
                <div className="w-3 h-2 border border-white/40 rounded-sm"><div className="h-full bg-white/60 w-3/4 rounded-sm" /></div>
              </div>
            </div>
            <div className="text-white font-bold text-sm">Harbor Health Supply Co.</div>
            <div className="text-white/60 text-xs mt-0.5">Annual COI Renewal</div>
            {/* Progress */}
            <div className="mt-3 h-1 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full" style={{ width: '40%' }} />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-white/50 text-[10px]">Step 2 of 5</span>
              <span className="text-white/50 text-[10px]">40%</span>
            </div>
          </div>

          {/* Content */}
          <div className="px-4 py-4 space-y-3 overflow-hidden" style={{ height: '420px' }}>
            {/* AI message */}
            <div className="flex gap-2 items-start">
              <div className="w-6 h-6 rounded-full bg-brand-indigo flex items-center justify-center shrink-0">
                <span className="text-[8px] font-bold text-white">AI</span>
              </div>
              <div className="bg-gray-100 rounded-xl rounded-tl-none px-3 py-2 max-w-[170px]">
                <p className="text-xs text-gray-700 leading-relaxed">Please upload your current certificate of insurance. The file should be dated within the last 12 months.</p>
              </div>
            </div>

            {/* Upload component */}
            <div className="border-2 border-dashed border-brand-indigo/30 rounded-xl p-4 text-center bg-brand-ghost mx-1">
              <div className="w-8 h-8 rounded-lg bg-brand-indigo/10 flex items-center justify-center mx-auto mb-2">
                <EnvelopeSimple size={16} className="text-brand-indigo" />
              </div>
              <div className="text-xs font-semibold text-brand-indigo">Tap to upload</div>
              <div className="text-[10px] text-gray-400 mt-0.5">PDF, JPG, PNG · max 10 MB</div>
            </div>

            {/* Voice option */}
            <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5 mx-1">
              <div className="w-5 h-5 rounded-full bg-brand-indigo/10 flex items-center justify-center">
                <ChatTeardropText size={11} className="text-brand-indigo" />
              </div>
              <span className="text-xs text-gray-500">Have a question? Ask here</span>
            </div>
          </div>
        </div>
      </div>
      {/* Notch */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2 w-24 h-5 bg-[#1a1a2e] rounded-full" />
    </div>
  )
}

/* ─── SMS opt-in flow ─── */
function SmsFlow() {
  const [step, setStep] = useState(0)
  const steps = [
    {
      label: 'Built into every email',
      detail: 'Every outbound email includes an SMS opt-in toggle at the bottom. Recipients can flip it on in one tap — no separate link or form required. Consent is recorded against their contact record.',
      mock: (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 max-w-xs mx-auto overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 text-xs font-semibold text-gray-500">Inside every Comms email</div>
          <div className="px-4 py-4 space-y-3">
            <div className="text-xs text-gray-500 text-center">…session link and CTA above…</div>
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-xl border border-green-200 bg-green-50 cursor-pointer"
            >
              <DeviceMobileCamera size={16} className="text-green-600 shrink-0" />
              <div className="flex-1">
                <div className="text-xs font-semibold text-green-700">SMS reminders on ✓</div>
                <div className="text-[10px] text-gray-400">Tap to receive updates via text</div>
              </div>
              <div className="w-9 h-5 rounded-full bg-green-500 relative shrink-0">
                <div className="absolute top-0.5 right-0.5 w-4 h-4 bg-white rounded-full shadow" />
              </div>
            </div>
            <div className="text-[10px] text-gray-400 text-center">No spam · reply STOP anytime</div>
          </div>
        </div>
      ),
    },
    {
      label: 'They opt in on their phone',
      detail: 'A simple, mobile-friendly page. One tap. TCPA compliant — they\'re consenting to communications from you specifically.',
      mock: (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 px-6 py-5 max-w-xs mx-auto text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-ghost mx-auto flex items-center justify-center">
            <DeviceMobileCamera size={22} className="text-brand-indigo" />
          </div>
          <div>
            <div className="font-bold text-gray-900">Get updates by SMS</div>
            <div className="text-sm text-gray-500 mt-1">From <strong>Harbor Health Supply Co.</strong></div>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">By confirming, you agree to receive SMS from Harbor Health about your vendor account. Msg & data rates may apply. Reply STOP to unsubscribe.</p>
          <button className="bg-brand-indigo text-white text-sm font-bold py-3 px-6 rounded-xl w-full">Confirm opt-in</button>
        </div>
      ),
    },
    {
      label: 'Future sessions can be sent by SMS',
      detail: 'You can now select SMS as a delivery channel for this contact. Links arrive as a short, branded SMS — just like email but on their phone.',
      mock: (
        <div className="bg-[#1C1C1E] rounded-2xl p-4 max-w-xs mx-auto">
          <div className="text-xs text-green-400 mb-3 font-semibold">Messages</div>
          <div className="space-y-2.5">
            {[
              { from: 'Harbor Health', text: 'Hi Alex, your COI renewal is ready. Complete it here: hh.comms.link/a7f2k — takes ~5 min. Reply STOP to unsubscribe.', time: '9:14 AM' },
              { from: 'Harbor Health', text: 'Reminder: your renewal is due in 3 days. Complete here: hh.comms.link/a7f2k', time: 'Yesterday' },
            ].map((msg, i) => (
              <div key={i}>
                <div className="text-[10px] text-gray-500 text-center mb-1">{msg.time}</div>
                <div className="bg-gray-700 rounded-xl rounded-bl-none px-3 py-2.5 max-w-[220px]">
                  <div className="text-[10px] text-green-400 font-bold mb-1">{msg.from}</div>
                  <p className="text-xs text-white leading-relaxed">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
  ]
  return (
    <div className="space-y-6">
      {/* Step nav */}
      <div className="flex gap-2">
        {steps.map((s, i) => (
          <button key={i} onClick={() => setStep(i)}
            className={`flex-1 text-left px-3 py-3 rounded-xl border text-sm transition-all ${step === i ? 'bg-brand-indigo text-white border-brand-indigo' : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'}`}>
            <div className="font-bold text-xs mb-1">Step {i + 1}</div>
            <div className="text-xs leading-snug opacity-90">{s.label}</div>
          </button>
        ))}
      </div>
      <div className="bg-gray-50 rounded-2xl px-6 py-5 text-sm text-gray-600 leading-relaxed">
        {steps[step].detail}
      </div>
      {steps[step].mock}
    </div>
  )
}

/* ─── Trust signal cards ─── */
const trustSignals = [
  {
    icon: ShieldCheck,
    title: 'Your brand, not ours',
    body: 'Emails and session pages are branded with your company name, logo, and colors. Recipients see a message from you — Comms works behind the scenes.',
  },
  {
    icon: EnvelopeSimple,
    title: 'Deliverability built in',
    body: 'Sending infrastructure is configured with SPF, DKIM, and DMARC. Messages pass spam filters and land in the inbox — not promotions or junk.',
  },
  {
    icon: Lock,
    title: 'Context-aware copy',
    body: 'Every email references the specific task and relationship — the vendor account, the application, the contract. Nothing feels like a mass blast.',
  },
  {
    icon: Bell,
    title: 'Configurable follow-ups',
    body: 'Set the number and timing of follow-ups (1–5, with configurable gaps). Sessions auto-close and flag an exception if no response by the deadline.',
  },
  {
    icon: DeviceMobileCamera,
    title: 'SMS opt-in only',
    body: 'SMS is never sent without consent. Share a one-time opt-in link; after that, you can use SMS for future session links and reminders — TCPA compliant.',
  },
  {
    icon: Globe,
    title: 'Mobile-first web app',
    body: 'Session links open in any browser — no app to download. Fully responsive on iOS and Android. Average async session completion time: under 6 minutes.',
  },
]

/* ─── Stats strip ─── */
const stats = [
  { value: '78%', label: 'Average email open rate', sub: 'Contextual B2B requests outperform generic campaigns' },
  { value: '71%', label: 'Complete on first touch', sub: 'No follow-up needed' },
  { value: '94%', label: 'Total completion rate', sub: 'Including automated follow-ups' },
  { value: '5.4 min', label: 'Avg async session time', sub: 'On mobile' },
]

/* ─── Subject line examples ─── */
const subjectExamples = [
  { company: 'Harbor Health Supply Co.', subject: 'Action needed: Annual COI renewal — Harbor Health Supply Co.' },
  { company: 'Northriver Logistics', subject: 'Your screening is ready — Northriver Logistics (20 min)' },
  { company: 'Stacked HR', subject: 'Complete your onboarding documents — Stacked HR · due Feb 28' },
  { company: 'Solaris Group', subject: 'Q1 compliance attestation — Solaris Group · 5 min to complete' },
]

/* ─── Main page ─── */
export function EndUserExperiencePage() {
  const [activeSubject, setActiveSubject] = useState(0)

  return (
    <div className="bg-white">
      <Nav />
      <div className="pt-14">

        {/* ── Hero ── */}
        <section className="py-20 bg-gray-50 border-b border-gray-100">
          <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="tag bg-brand-ghost text-brand-indigo mb-5">Recipient experience</div>
                <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
                  What happens on<br />
                  <span className="gradient-text">the other end</span>
                </h1>
                <p className="text-xl text-gray-500 leading-relaxed mb-8">
                  Every Comms session starts with an email. The actual conversation happens in a mobile-friendly web app — no download required. Here's exactly what the person on the other end sees, from first message to completed session.
                </p>
                <div className="flex flex-wrap gap-3">
                  {[
                    { icon: EnvelopeSimple, label: 'Email-first delivery' },
                    { icon: Globe, label: 'Browser-based sessions' },
                    { icon: DeviceMobileCamera, label: 'SMS opt-in available' },
                    { icon: ShieldCheck, label: 'Your branding throughout' },
                  ].map(({ icon: Icon, label }) => (
                    <div key={label} className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-gray-600">
                      <Icon size={14} className="text-brand-indigo" />
                      {label}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-center">
                <EmailPreview />
              </div>
            </div>
          </div>
        </section>

        {/* ── Stats strip ── */}
        <section className="py-12 bg-brand-shaft">
          <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
            <div className="grid sm:grid-cols-4 gap-6">
              {stats.map(s => (
                <div key={s.label} className="text-center">
                  <div className="text-4xl font-bold text-white mb-1">{s.value}</div>
                  <div className="text-sm font-semibold text-white/70">{s.label}</div>
                  <div className="text-xs text-white/40 mt-1">{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How delivery works ── */}
        <section className="py-20 border-b border-gray-100">
          <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
            <div className="mb-12">
              <div className="tag bg-brand-ghost text-brand-indigo mb-4">Delivery</div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Email delivers the link.<br />The browser runs the session.</h2>
              <p className="text-gray-500 text-lg max-w-2xl leading-relaxed">
                These are two different things. <strong className="text-gray-700">Email</strong> is how the invitation, the link, and any follow-up reminders reach the person. The <strong className="text-gray-700">Comms session itself</strong> — the conversation, the questions, the uploads — all happens in their browser. Nothing sensitive over email.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6 mb-12">
              {[
                {
                  step: '01', icon: EnvelopeSimple, title: 'Email arrives',
                  color: 'bg-brand-ghost border-brand-indigo/20',
                  iconColor: 'text-brand-indigo',
                  points: [
                    'From your company name (not a generic Comms domain)',
                    'References the specific task and relationship',
                    'Clean subject line, no spam triggers',
                    'Clear single CTA: open the session',
                  ],
                },
                {
                  step: '02', icon: Globe, title: 'They click the link',
                  color: 'bg-green-50 border-green-200',
                  iconColor: 'text-green-600',
                  points: [
                    'Opens instantly in any browser — no login, no download',
                    'Branded with your company identity',
                    'Agenda is visible so they know what to expect',
                    'Works on iOS and Android, any screen size',
                  ],
                },
                {
                  step: '03', icon: Check, title: 'Session completes',
                  color: 'bg-violet-50 border-violet-200',
                  iconColor: 'text-violet-600',
                  points: [
                    'Progress auto-saved — they can return if interrupted',
                    'Confirmation shown immediately on completion',
                    'You receive the outcome as a structured Comms Session',
                    'No follow-up sent once they\'re done',
                  ],
                },
              ].map(col => (
                <div key={col.step} className={`rounded-2xl border p-6 ${col.color}`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm`}>
                      <col.icon size={18} className={col.iconColor} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Step {col.step}</div>
                      <div className="text-base font-bold text-gray-900">{col.title}</div>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {col.points.map(p => (
                      <li key={p} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${col.iconColor.replace('text-', 'bg-')} mt-1.5 shrink-0`} />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Subject line examples */}
            <div className="bg-gray-50 rounded-2xl p-8">
              <div className="mb-4">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Subject line examples</div>
                <p className="text-sm text-gray-500">Comms generates context-aware subject lines that reference the specific relationship and task — so recipients immediately know who it's from and why.</p>
              </div>
              <div className="space-y-2">
                {subjectExamples.map((ex, i) => (
                  <button key={i} onClick={() => setActiveSubject(i)}
                    className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${activeSubject === i ? 'bg-white border-brand-indigo/30 shadow-sm' : 'bg-transparent border-transparent hover:bg-white hover:border-gray-200'}`}>
                    <EnvelopeSimple size={14} className={activeSubject === i ? 'text-brand-indigo' : 'text-gray-400'} />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-gray-400 mb-0.5">{ex.company}</div>
                      <div className="text-sm font-medium text-gray-800 truncate">{ex.subject}</div>
                    </div>
                    <CaretRight size={12} className={activeSubject === i ? 'text-brand-indigo' : 'text-gray-300'} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Mobile experience ── */}
        <section className="py-20 bg-gray-50 border-b border-gray-100">
          <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="tag bg-brand-ghost text-brand-indigo mb-4">Mobile experience</div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">Works beautifully on every device</h2>
                <p className="text-gray-500 text-lg leading-relaxed mb-8">
                  Most people will open your session on their phone. The Comms web app is designed mobile-first — fast loading, thumb-friendly, and works with voice input or tap-to-upload. No app download, no account creation.
                </p>
                <div className="space-y-4">
                  {[
                    { icon: Globe, title: 'No app required', body: 'Opens in Safari, Chrome, or any mobile browser. Works offline once loaded.' },
                    { icon: ChatTeardropText, title: 'Voice-friendly', body: 'Participants can speak their answers — especially useful for longer free-form questions.' },
                    { icon: Check, title: 'Progress saved automatically', body: 'If they close the tab and return later, they pick up right where they left off.' },
                    { icon: Lock, title: 'Secure & session-locked', body: 'Each link is unique and single-use — no login needed but not shareable.' },
                  ].map(({ icon: Icon, title, body }) => (
                    <div key={title} className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center shrink-0 shadow-sm">
                        <Icon size={15} className="text-brand-indigo" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-900">{title}</div>
                        <div className="text-sm text-gray-500 mt-0.5 leading-relaxed">{body}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-center">
                <MobilePreview />
              </div>
            </div>
          </div>
        </section>

        {/* ── SMS opt-in ── */}
        <section className="py-20 border-b border-gray-100">
          <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
            <div className="mb-12">
              <div className="tag bg-brand-ghost text-brand-indigo mb-4">SMS · Opt-in required</div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">SMS delivery — on their terms</h2>
              <p className="text-gray-500 text-lg max-w-2xl leading-relaxed">
                Email is the default delivery channel. SMS is available as a secondary channel — but only after the recipient opts in. Every email Comms sends includes an SMS opt-in toggle at the bottom — recipients can enable it in one tap. Once opted in, you can choose SMS for future session links and reminders.
              </p>
            </div>
            <SmsFlow />
          </div>
        </section>

        {/* ── Trust & branding ── */}
        <section className="py-20 bg-[#0D1117] text-white">
          <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
            <div className="mb-12">
              <div className="tag bg-white/10 text-white/70 border border-white/10 mb-4">Trust & deliverability</div>
              <h2 className="text-4xl font-bold leading-tight mb-4">
                Will they actually open it?<br />
                <span className="text-brand-pale">Yes. Here's why.</span>
              </h2>
              <p className="text-white/50 text-lg max-w-2xl leading-relaxed">
                The most common concern: "Will this end up in spam? Will they trust it?" We've built every layer of the delivery stack to make sure the answer is yes.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-14">
              {trustSignals.map(({ icon: Icon, title, body }) => (
                <div key={title} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-brand-pale/30 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-brand-indigo/20 flex items-center justify-center mb-4">
                    <Icon size={18} className="text-brand-pale" weight="duotone" />
                  </div>
                  <div className="text-base font-bold text-white mb-2">{title}</div>
                  <p className="text-sm text-white/60 leading-relaxed">{body}</p>
                </div>
              ))}
            </div>

            {/* "It looks like it came from us" explainer */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 grid lg:grid-cols-2 gap-10 items-center">
              <div>
                <div className="text-xs font-bold text-brand-pale/70 uppercase tracking-wider mb-3">The key insight</div>
                <h3 className="text-2xl font-bold text-white mb-4">"It came from our company — Comms just runs it."</h3>
                <p className="text-white/60 leading-relaxed text-[15px]">
                  Recipients don't need to know or trust "Comms" — they trust <em>you</em>. The email is from your domain (or clearly co-branded), the session page shows your logo and colors, and every message references the specific relationship context. Comms is the engine. You're the face.
                </p>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Sender name', value: 'Harbor Health Supply Co.', icon: Users },
                  { label: 'From address', value: 'procurement@harborhealth.com', icon: EnvelopeSimple },
                  { label: 'Session branding', value: 'Your logo + colors', icon: Star },
                  { label: 'Powered by', value: 'Comms (in small footer only)', icon: Sparkle },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3">
                    <Icon size={14} className="text-brand-pale shrink-0" />
                    <span className="text-sm text-white/40 w-32 shrink-0">{label}</span>
                    <span className="text-sm font-semibold text-white/80">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-16 bg-brand-ghost border-t border-brand-indigo/10">
          <div className="max-w-[1200px] mx-auto px-6 lg:px-10 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">See it from the dispatcher's side</h2>
            <p className="text-gray-500 text-lg mb-8 max-w-xl mx-auto">Try the Work Dispatcher prototype to see how a Comms draft is created, configured, and sent — and how the session tracks everything from there.</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link to="/app/dispatcher" className="btn-primary py-3.5 px-8 text-base">
                Open Work Dispatcher <ArrowRight size={16} weight="bold" />
              </Link>
              <Link to="/app/async" className="btn-secondary py-3.5 px-8 text-base">
                See the async recipient view
              </Link>
            </div>
          </div>
        </section>

      </div>
      <Footer />
    </div>
  )
}
