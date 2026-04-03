/* Comms Logo Options — 5 concepts */

interface LogoProps { size?: number }

/* ─────────────────────────────────────────────────────────────
   Logo 1 — "Voice Wave"  ← CHOSEN
   An organic, asymmetric audio waveform — 11 bars with
   a double-peaked rhythm that looks like natural speech.
   Premium feel, instantly recognizable as "audio/voice",
   unique enough to stand apart from generic waveform marks.
───────────────────────────────────────────────────────────── */

// Bar data: [x_left, height] — viewBox 48×48, bars centered at y=24
const WAVE_BARS = [
  // left-edge, bar-height
  [1.5,   8],   // edge whisper
  [6,    18],
  [10.5, 12],
  [15,   32],
  [19.5, 44],   // first peak
  [24,   22],   // valley
  [28.5, 38],   // second peak (slightly lower = organic)
  [33,   16],
  [37.5, 26],   // trailing accent
  [42,   10],
  [46.5,  6],   // edge whisper
]
const BAR_W = 3

export function LogoVoiceWave({ size = 48 }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="vw-grad" x1="0" y1="0" x2="0" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#8B95F0" />
          <stop offset="55%" stopColor="#4F59CC" />
          <stop offset="100%" stopColor="#3140A8" />
        </linearGradient>
      </defs>
      {WAVE_BARS.map(([x, h], i) => (
        <rect
          key={i}
          x={x}
          y={24 - h / 2}
          width={BAR_W}
          height={h}
          rx={BAR_W / 2}
          fill="url(#vw-grad)"
          opacity={h < 14 ? 0.45 : h < 24 ? 0.75 : 1}
        />
      ))}
    </svg>
  )
}

export function LogoVoiceWaveIcon({ size = 48 }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="vwi-bg" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#5C65D8" />
          <stop offset="100%" stopColor="#3540B0" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="11" fill="url(#vwi-bg)" />
      {WAVE_BARS.map(([x, h], i) => (
        <rect
          key={i}
          x={x}
          y={24 - h / 2}
          width={BAR_W}
          height={h}
          rx={BAR_W / 2}
          fill="white"
          opacity={h < 14 ? 0.3 : h < 24 ? 0.6 : 1}
        />
      ))}
    </svg>
  )
}

/* ─────────────────────────────────────────────────────────────
   Logo 2 — "Signal Arc"
   Three concentric arcs open to the right, forming a C.
   Clean, scalable, reads as both signal/WiFi and the letter C.
───────────────────────────────────────────────────────────── */
export function LogoSignalArc({ size = 48 }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="la-grad" x1="8" y1="6" x2="40" y2="42" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6470E0" />
          <stop offset="100%" stopColor="#3C45B1" />
        </linearGradient>
      </defs>
      <path d="M38 10 A20 20 0 1 0 38 38" stroke="url(#la-grad)" strokeWidth="4" fill="none" strokeLinecap="round"/>
      <path d="M38 17 A13 13 0 1 0 38 31" stroke="url(#la-grad)" strokeWidth="3.5" fill="none" strokeLinecap="round" opacity="0.6"/>
      <path d="M38 22 A6 6 0 1 0 38 26" stroke="url(#la-grad)" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.35"/>
    </svg>
  )
}

export function LogoSignalArcIcon({ size = 48 }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="lai-bg" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#5A63D8" />
          <stop offset="100%" stopColor="#3C45B1" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="12" fill="url(#lai-bg)" />
      <path d="M35 13 A17 17 0 1 0 35 35" stroke="white" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
      <path d="M35 19 A11 11 0 1 0 35 29" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.65"/>
      <path d="M35 23 A5 5 0 1 0 35 25" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.35"/>
    </svg>
  )
}

/* ─────────────────────────────────────────────────────────────
   Logo 3 — "Spark Node"
   Three connected nodes with an AI spark at the primary node.
───────────────────────────────────────────────────────────── */
export function LogoSparkNode({ size = 48 }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sn-grad" x1="8" y1="6" x2="40" y2="42" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7B85E8"/><stop offset="100%" stopColor="#3C45B1"/>
        </linearGradient>
      </defs>
      <line x1="24" y1="10" x2="10" y2="36" stroke="url(#sn-grad)" strokeWidth="2" opacity="0.4" strokeLinecap="round"/>
      <line x1="24" y1="10" x2="38" y2="36" stroke="url(#sn-grad)" strokeWidth="2" opacity="0.4" strokeLinecap="round"/>
      <line x1="10" y1="36" x2="38" y2="36" stroke="url(#sn-grad)" strokeWidth="2" opacity="0.4" strokeLinecap="round"/>
      <circle cx="10" cy="36" r="4" fill="url(#sn-grad)" opacity="0.5"/>
      <circle cx="38" cy="36" r="4" fill="url(#sn-grad)" opacity="0.5"/>
      <circle cx="24" cy="10" r="6" fill="url(#sn-grad)"/>
      <path d="M24 5 L25.5 8.5 L29 9 L26.5 11.5 L27 15 L24 13 L21 15 L21.5 11.5 L19 9 L22.5 8.5 Z" fill="white" opacity="0.9"/>
    </svg>
  )
}

export function LogoSparkNodeIcon({ size = 48 }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sni-bg" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#5A63D8" /><stop offset="100%" stopColor="#3C45B1" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="12" fill="url(#sni-bg)" />
      <line x1="24" y1="11" x2="11" y2="36" stroke="white" strokeWidth="1.5" opacity="0.3" strokeLinecap="round"/>
      <line x1="24" y1="11" x2="37" y2="36" stroke="white" strokeWidth="1.5" opacity="0.3" strokeLinecap="round"/>
      <line x1="11" y1="36" x2="37" y2="36" stroke="white" strokeWidth="1.5" opacity="0.3" strokeLinecap="round"/>
      <circle cx="11" cy="36" r="3.5" fill="white" opacity="0.45"/>
      <circle cx="37" cy="36" r="3.5" fill="white" opacity="0.45"/>
      <circle cx="24" cy="11" r="6" fill="white" opacity="0.9"/>
      <path d="M24 6.5 L25.3 9.5 L28.5 10 L26.2 12.2 L26.8 15.5 L24 13.9 L21.2 15.5 L21.8 12.2 L19.5 10 L22.7 9.5 Z" fill="#4F59CC"/>
    </svg>
  )
}

/* ─────────────────────────────────────────────────────────────
   Logo 4 — "Dialogue Merge"
   Two overlapping speech bubbles — AI + human intersection.
───────────────────────────────────────────────────────────── */
export function LogoDialogueMerge({ size = 48 }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="dm-grad" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7B85E8"/><stop offset="100%" stopColor="#3C45B1"/>
        </linearGradient>
      </defs>
      <path d="M28 8 H40 C41.1 8 42 8.9 42 10 V24 C42 25.1 41.1 26 40 26 H35 L38 32 L28 26 C26.9 26 26 25.1 26 24 V10 C26 8.9 26.9 8 28 8 Z" fill="url(#dm-grad)" opacity="0.25"/>
      <path d="M8 8 H22 C23.1 8 24 8.9 24 10 V24 C24 25.1 23.1 26 22 26 H17 L14 32 L8 26 C6.9 26 6 25.1 6 24 V10 C6 8.9 6.9 8 8 8 Z" fill="url(#dm-grad)"/>
      <circle cx="15" cy="17" r="2" fill="white"/>
    </svg>
  )
}

export function LogoDialogueMergeIcon({ size = 48 }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="dmi-bg" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#5A63D8" /><stop offset="100%" stopColor="#3C45B1" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="12" fill="url(#dmi-bg)" />
      <path d="M26 10 H38 C39.1 10 40 10.9 40 12 V24 C40 25.1 39.1 26 38 26 H33 L36 31 L26 26 C24.9 26 24 25.1 24 24 V12 C24 10.9 24.9 10 26 10 Z" fill="white" opacity="0.3"/>
      <path d="M10 10 H22 C23.1 10 24 10.9 24 12 V24 C24 25.1 23.1 26 22 26 H17 L14 31 L10 26 C8.9 26 8 25.1 8 24 V12 C8 10.9 8.9 10 10 10 Z" fill="white"/>
      <circle cx="16" cy="18" r="2" fill="#4F59CC"/>
      <circle cx="22" cy="18" r="2" fill="#4F59CC" opacity="0.4"/>
    </svg>
  )
}

/* ─────────────────────────────────────────────────────────────
   Logo 5 — "Orbit"
   Orbital ellipses around a central session node.
───────────────────────────────────────────────────────────── */
export function LogoOrbit({ size = 48 }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="orb-grad" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7B85E8"/><stop offset="100%" stopColor="#3C45B1"/>
        </linearGradient>
      </defs>
      <ellipse cx="24" cy="24" rx="18" ry="11" stroke="url(#orb-grad)" strokeWidth="2" fill="none" opacity="0.5"/>
      <ellipse cx="24" cy="24" rx="11" ry="18" stroke="url(#orb-grad)" strokeWidth="2" fill="none" opacity="0.3" transform="rotate(45 24 24)"/>
      <circle cx="24" cy="24" r="4" fill="url(#orb-grad)"/>
      <circle cx="42" cy="24" r="3" fill="url(#orb-grad)" opacity="0.7"/>
      <circle cx="24" cy="7" r="3" fill="url(#orb-grad)" opacity="0.5"/>
    </svg>
  )
}

export function LogoOrbitIcon({ size = 48 }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="orbi-bg" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#5A63D8" /><stop offset="100%" stopColor="#3C45B1" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="12" fill="url(#orbi-bg)" />
      <ellipse cx="24" cy="24" rx="15" ry="9" stroke="white" strokeWidth="1.5" fill="none" opacity="0.4"/>
      <ellipse cx="24" cy="24" rx="9" ry="15" stroke="white" strokeWidth="1.5" fill="none" opacity="0.25" transform="rotate(40 24 24)"/>
      <circle cx="24" cy="24" r="4.5" fill="white"/>
      <circle cx="39" cy="24" r="2.5" fill="white" opacity="0.65"/>
      <circle cx="24" cy="9" r="2.5" fill="white" opacity="0.5"/>
    </svg>
  )
}

/* ─────────────────────────────────────────────────────────────
   Wordmark helper
───────────────────────────────────────────────────────────── */
function Wordmark({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const cls = size === 'lg' ? 'text-3xl' : size === 'sm' ? 'text-base' : 'text-xl'
  return (
    <span className={`font-bold tracking-tight text-gray-900 ${cls}`}
      style={{ fontFamily: 'Inter, system-ui, sans-serif', letterSpacing: '-0.02em' }}>
      Comms
    </span>
  )
}

/* ─────────────────────────────────────────────────────────────
   Page
───────────────────────────────────────────────────────────── */
const logos = [
  {
    id: 1,
    name: 'Voice Wave',
    description: 'An organic, asymmetric audio waveform with a double-peaked rhythm that looks like natural human speech. 11 bars with authentic variation — not perfectly symmetric, intentionally raw and natural. Gradient from light indigo to deep navy.',
    chosen: true,
    icon: LogoVoiceWaveIcon,
    mark: LogoVoiceWave,
    rationale: 'Immediately legible at any scale. Evokes voice, communication, and AI processing simultaneously. The asymmetry makes it feel alive — like an actual voice print, not a UI asset.',
  },
  {
    id: 2,
    name: 'Signal Arc',
    description: 'Three concentric arcs open to the right, forming a "C" that also reads as a signal or WiFi symbol. Clean, immediately scalable to any size.',
    chosen: false,
    icon: LogoSignalArcIcon,
    mark: LogoSignalArc,
    rationale: 'Most versatile — reads as "C", signal, and communication simultaneously. Works at 16px as a favicon or 200px as a hero mark.',
  },
  {
    id: 3,
    name: 'Spark Node',
    description: 'Three connected nodes in a triangle with a star/spark at the primary node. Evokes AI, distributed work, and multi-party communication.',
    chosen: false,
    icon: LogoSparkNodeIcon,
    mark: LogoSparkNode,
    rationale: 'Strong AI-forward feel. Best for a product emphasizing network effects and structured data extraction.',
  },
  {
    id: 4,
    name: 'Dialogue Merge',
    description: 'Two overlapping speech bubbles — one AI, one human — with an intersection representing the shared outcome.',
    chosen: false,
    icon: LogoDialogueMergeIcon,
    mark: LogoDialogueMerge,
    rationale: 'Clearest communication metaphor. Explicitly shows two parties. Best for a more product-marketing-forward brand.',
  },
  {
    id: 5,
    name: 'Orbit',
    description: 'An orbital system: a central node (the session/outcome) with participants in orbit. Evokes the structured, gravity-like pull of a Comm Session bringing information together.',
    chosen: false,
    icon: LogoOrbitIcon,
    mark: LogoOrbit,
    rationale: 'Most conceptual. Best for a brand focused on the "session as gravitational center" narrative.',
  },
]

export function LogoOptionsPage() {
  return (
    <div className="min-h-screen bg-[#F9FAFB]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div className="bg-white border-b border-gray-100 px-8 py-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Brand exploration</div>
            <h1 className="text-2xl font-bold text-gray-900">Comms — Logo Options</h1>
            <p className="text-sm text-gray-400 mt-1">Five logomark concepts · One selected for current iteration</p>
          </div>
          <a href="/" className="text-sm text-gray-400 hover:text-gray-700 transition-colors">← Back to site</a>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-12 space-y-8">
        {logos.map(logo => {
          const Icon = logo.icon
          const Mark = logo.mark
          return (
            <div
              key={logo.id}
              className={`bg-white rounded-2xl border overflow-hidden ${logo.chosen ? 'border-[#4F59CC]/30 shadow-lg shadow-[#4F59CC]/10' : 'border-gray-100 shadow-sm'}`}
            >
              <div className={`px-7 py-4 flex items-center justify-between border-b ${logo.chosen ? 'bg-[#ECEEFE] border-[#4F59CC]/15' : 'bg-[#F9FAFB] border-gray-100'}`}>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-gray-400 tracking-widest">0{logo.id}</span>
                  <span className={`text-base font-bold ${logo.chosen ? 'text-[#4F59CC]' : 'text-gray-800'}`}>{logo.name}</span>
                </div>
                {logo.chosen && (
                  <span className="text-xs font-bold text-[#4F59CC] bg-white border border-[#4F59CC]/20 px-3 py-1 rounded-full">
                    ✦ Selected for this iteration
                  </span>
                )}
              </div>

              <div className="px-7 py-8 grid grid-cols-[1fr_auto] gap-10 items-center">
                <div className="space-y-4">
                  <p className="text-[15px] text-gray-600 leading-relaxed">{logo.description}</p>
                  <div className="bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Why: </span>
                    <span className="text-sm text-gray-600">{logo.rationale}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-8 items-center shrink-0">
                  <div>
                    <div className="text-xs font-semibold text-gray-400 text-center mb-3 uppercase tracking-wider">Icon</div>
                    <div className="flex items-end gap-4">
                      <Icon size={64} />
                      <Icon size={40} />
                      <Icon size={24} />
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-semibold text-gray-400 text-center mb-3 uppercase tracking-wider">With wordmark</div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Icon size={40} />
                        <Wordmark size="lg" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon size={28} />
                        <Wordmark size="md" />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Icon size={20} />
                        <Wordmark size="sm" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-semibold text-gray-400 text-center mb-3 uppercase tracking-wider">On dark</div>
                    <div className="bg-[#0D1117] rounded-xl px-5 py-4 flex items-center gap-3">
                      <Mark size={32} />
                      <span className="font-bold text-white text-lg tracking-tight" style={{ letterSpacing: '-0.02em' }}>Comms</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="max-w-5xl mx-auto px-8 pb-16">
        <div className="bg-[#ECEEFE] border border-[#4F59CC]/20 rounded-2xl px-7 py-6">
          <div className="text-xs font-semibold text-[#4F59CC] uppercase tracking-wider mb-2">Design notes</div>
          <p className="text-sm text-gray-600 leading-relaxed">
            All logos use the brand indigo gradient (<code className="bg-white px-1.5 py-0.5 rounded text-xs">#8B95F0 → #3140A8</code>) and are designed to work at any size.
            The "Voice Wave" concept is applied throughout the current iteration.
            All concepts are SVG-native and can be exported to Figma, used as React components, or rendered as static files.
          </p>
        </div>
      </div>
    </div>
  )
}
