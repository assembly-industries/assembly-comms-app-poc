import { Link } from 'react-router-dom'
import { useState } from 'react'
import {
  ArrowRight, Terminal, Globe, Plug, CaretRight, Check,
  Lightning, ArrowsClockwise, ArrowBendRightDown, Code, Robot
} from '@phosphor-icons/react'
import { Nav } from '../components/Nav'

type Lang = 'typescript' | 'bash' | 'json'

/* Split a line into safe zones (strings, comments) and plain zones.
   Only plain zones get keyword highlighting — this prevents the span
   style attributes from being re-matched by subsequent regexes. */
function tokenSplit(escaped: string) {
  const parts: Array<{ safe: boolean; text: string }> = []
  // Matches: // line comments, "strings", 'strings', `strings`
  const re = /(\/\/.*$|"[^"]*"|'[^']*'|`[^`\n]*`)/g
  let last = 0, m: RegExpExecArray | null
  while ((m = re.exec(escaped)) !== null) {
    if (m.index > last) parts.push({ safe: false, text: escaped.slice(last, m.index) })
    parts.push({ safe: true, text: m[0] })
    last = m.index + m[0].length
  }
  if (last < escaped.length) parts.push({ safe: false, text: escaped.slice(last) })
  return parts
}

function colorize(line: string, lang: Lang): string {
  const esc = line
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  if (lang === 'bash') {
    if (esc.trimStart().startsWith('#')) return `<span style='color:#8B949E'>${esc}</span>`
    return tokenSplit(esc).map(p => {
      if (p.safe) return `<span style='color:#A5D6FF'>${p.text}</span>`
      return p.text
        .replace(/(--[\w-]+)/g, `<span style='color:#FFAB70'>$1</span>`)
        .replace(/\b(comms|npm|npx|curl|jq)\b/g, `<span style='color:#79C0FF'>$1</span>`)
    }).join('')
  }

  if (lang === 'json') {
    return tokenSplit(esc).map(p => {
      if (p.safe) {
        // JSON key vs JSON string value — keys are followed by ':'
        // We'll colour everything the same here, distinction handled below
        return p.text
      }
      return p.text
        .replace(/"([\w_\- ]+)"(\s*):/g, `<span style='color:#7EE787'>"$1"</span>$2:`)
        .replace(/:\s*"([^"]*)"/g, `: <span style='color:#A5D6FF'>"$1"</span>`)
        .replace(/:\s*(true|false|null)\b/g, `: <span style='color:#FF7B72'>$1</span>`)
        .replace(/:\s*(-?\d+(?:\.\d+)?)/g, `: <span style='color:#79C0FF'>$1</span>`)
    }).join('')
  }

  // TypeScript
  return tokenSplit(esc).map(p => {
    if (p.safe) {
      const color = p.text.startsWith('//') ? '#8B949E' : '#A5D6FF'
      return `<span style='color:${color}'>${p.text}</span>`
    }
    return p.text
      .replace(/\b(const|let|await|async|import|from|export|return|new|function|type|interface|if|else)\b/g,
        `<span style='color:#FF7B72'>$1</span>`)
      .replace(/\b(comms_dispatch|comms_get_session|comms_chain|comms_cancel|comms_query|comms_list_sessions)\b/g,
        `<span style='color:#FFA7C4'>$1</span>`)
      .replace(/\b(comms|session|outcome|sessions|client|event)\b/g,
        `<span style='color:#FFA7C4'>$1</span>`)
      .replace(/\.(dispatch|create|get|list|sessions|outcome|on|waitForCompletion|webhooks|construct|sendStatus|post)\b/g,
        `<span style='color:#D2A8FF'>.$1</span>`)
      .replace(/\b(process|console|app)\b/g,
        `<span style='color:#79C0FF'>$1</span>`)
  }).join('')
}

/* ── Code block UI ── */
function CodeBlock({ code, lang, label }: { code: string; lang: Lang; label?: string }) {
  const lines = code.trim().split('\n')
  return (
    <div className="rounded-2xl overflow-hidden border border-white/10 shadow-xl">
      <div className="flex items-center justify-between bg-[#161B22] px-5 py-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
            <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
            <div className="w-3 h-3 rounded-full bg-[#28C840]" />
          </div>
          {label && <span className="text-xs font-semibold text-white/40">{label}</span>}
        </div>
        <span className="text-xs font-mono text-white/25 uppercase tracking-widest">{lang}</span>
      </div>
      <div className="bg-[#0D1117] px-5 py-5 overflow-x-auto">
        <pre className="text-sm leading-relaxed font-mono" style={{ color: '#C9D1D9' }}>
          {lines.map((line, i) => (
            <div key={i} className="flex gap-4">
              <span className="select-none text-right w-5 shrink-0" style={{ color: 'rgba(255,255,255,0.18)' }}>{i + 1}</span>
              <span dangerouslySetInnerHTML={{ __html: colorize(line, lang) }} />
            </div>
          ))}
        </pre>
      </div>
    </div>
  )
}

/* ── Code examples ── */
const DISPATCH_EXAMPLE = `import Comms from '@assembly/comms'

const client = new Comms({ apiKey: process.env.COMMS_API_KEY! })

// Create and dispatch a screening session
const session = await client.sessions.create({
  task: \`Screen 5 backend engineering candidates.
Score each on technical depth, problem-solving,
and communication. Return a ranked shortlist.\`,
  mode: 'async',
  participants: [
    { name: 'Alex Torres', email: 'alex@example.com', phone: '+14155550101' },
    { name: 'Maria Chen',  email: 'maria@example.com' },
    // ...3 more
  ],
  config: {
    follow_ups:    3,
    cadence:       'every_48h',
    deadline_days: 7,
    delivery:      ['email', 'sms'],
  },
  webhook: {
    url:    'https://api.acme.com/webhooks/comms',
    events: ['session.complete', 'session.exception'],
    secret:  process.env.COMMS_WEBHOOK_SECRET!,
  },
})

console.log(session.id)     // "sess_2Kx9mNpQr8vL"
console.log(session.status) // "dispatched"

// Handle completion via webhook
app.post('/webhooks/comms', async (req, res) => {
  const event = client.webhooks.construct(
    req.rawBody,
    req.headers['comms-signature'] as string
  )
  if (event.type === 'session.complete') {
    const { outcome } = event.data
    console.log(outcome.summary)          // narrative summary
    console.log(outcome.findings)         // ranked per participant
    console.log(outcome.generated_action) // suggested next step
  }
  res.sendStatus(200)
})`

const SESSION_OUTCOME = `{
  "id":     "sess_2Kx9mNpQr8vL",
  "status": "complete",
  "mode":   "async",
  "task":   "Screen 5 backend engineering candidates...",
  "participants": {
    "total": 5, "complete": 5, "pending": 0,
    "exceptions": []
  },
  "outcome": {
    "summary": "5 of 5 candidates completed. 2 recommended for finals.",
    "findings": [
      { "participant": "Alex Torres",  "score": 88, "decision": "advance", "evidence": "Strong systems design; clear trade-off reasoning on DB question." },
      { "participant": "Maria Chen",   "score": 84, "decision": "advance", "evidence": "Excellent communication; solid on distributed systems." },
      { "participant": "James Park",   "score": 71, "decision": "hold",    "evidence": "Good fundamentals, gaps on concurrency." }
    ],
    "generated_action": "Send final-round invites to Torres and Chen. Park to holding pool.",
    "artifacts": [
      { "type": "transcript", "participant": "Alex Torres",  "url": "https://..." },
      { "type": "scorecard",  "format": "json",              "url": "https://..." }
    ]
  },
  "created_at":   "2026-04-08T09:00:00Z",
  "completed_at": "2026-04-09T16:42:00Z"
}`

const MCP_EXAMPLE = `// 1. Add Comms to your MCP config (~/.cursor/mcp.json
//    or claude_desktop_config.json → "mcpServers")
{
  "mcpServers": {
    "comms": {
      "command": "npx",
      "args":    ["-y", "@assembly/comms-mcp@latest"],
      "env":     { "COMMS_API_KEY": "ck_live_..." }
    }
  }
}

// 2. The agent now has 6 tools. Example — Claude Code
//    running a hiring pipeline autonomously:

// Step 1: dispatch screening (fire and forget)
const screen = await comms_dispatch({
  task: 'Screen the 5 applicants. Rank by technical fit.',
  participants: applicants,  // from prior tool result
  mode: 'async',
  config: { follow_ups: 3, deadline_days: 5 },
})
// → { id: "sess_2Kx9mNpQr8vL", status: "dispatched" }

// Agent does other work...

// Step 2: wait for completion, then chain to next step
const result = await comms_get_session({ id: screen.id })
if (result.status === 'complete') {
  await comms_chain({
    from_session: screen.id,
    task: 'Schedule 45-min finals with the top 2 candidates.',
    mode: 'sync',
  })
}`

const CLI_EXAMPLE = `# Install globally (or prefix any command with npx)
npm install -g @assembly/comms-cli

# Authenticate
comms auth login

# Create and dispatch a session
comms sessions create \\
  --task "Collect Q4 compliance attestations from all 40 engineers" \\
  --participants ./engineers.csv \\
  --mode async \\
  --follow-ups 3 \\
  --cadence every_48h \\
  --deadline 14d \\
  --webhook https://hooks.acme.com/comms \\
  --delivery email,sms

# Output:
# ✓  sess_2Kx9mNpQr8vL  dispatched
# →  40 invites queued (email + sms)
# →  webhook: https://hooks.acme.com/comms

# Check status
comms sessions get sess_2Kx9mNpQr8vL

# Tail live progress (polls every 30s)
comms sessions watch sess_2Kx9mNpQr8vL

# Pull structured outcome — pipe anywhere
comms sessions outcome sess_2Kx9mNpQr8vL \\
  | jq '.outcome.findings[] | select(.decision == "advance")'

# Query across all sessions
comms sessions query "who hasn't responded to Q4 compliance?"

# Use in CI — exit code 0 on complete, 1 on exception
comms sessions wait sess_2Kx9mNpQr8vL --timeout 14d`

/* ── Tab data ── */
const TABS = [
  { id: 'api', label: 'API + SDK', icon: Globe, code: DISPATCH_EXAMPLE, lang: 'typescript' as Lang, file: 'dispatch.ts' },
  { id: 'mcp', label: 'MCP', icon: Plug, code: MCP_EXAMPLE, lang: 'typescript' as Lang, file: 'mcp.json + agent.ts' },
  { id: 'cli', label: 'CLI', icon: Terminal, code: CLI_EXAMPLE, lang: 'bash' as Lang, file: 'terminal' },
]

/* ── "Works with" agents ── */
const AGENTS = [
  { name: 'Claude 4',     color: 'bg-orange-50 border-orange-200 text-orange-700',   letter: 'C',  desc: 'Anthropic' },
  { name: 'Claude Code',  color: 'bg-amber-50 border-amber-200 text-amber-700',       letter: 'CC', desc: 'Terminal agent' },
  { name: 'Cursor',       color: 'bg-blue-50 border-blue-200 text-blue-700',          letter: 'Cu', desc: 'IDE agent' },
  { name: 'Copilot',      color: 'bg-green-50 border-green-200 text-green-700',       letter: 'Co', desc: 'GitHub · agent mode' },
  { name: 'o3 / o4-mini', color: 'bg-gray-50 border-gray-200 text-gray-700',          letter: 'G',  desc: 'OpenAI' },
  { name: 'Gemini 2.5',   color: 'bg-purple-50 border-purple-200 text-purple-700',   letter: 'Ge', desc: 'Google DeepMind' },
  { name: 'ADK agents',   color: 'bg-teal-50 border-teal-200 text-teal-700',          letter: 'A',  desc: 'Google ADK' },
  { name: 'Any agent',    color: 'bg-brand-ghost border-brand-indigo/20 text-brand-indigo', letter: '✦', desc: 'MCP-compatible' },
]

/* ── How it works steps ── */
const STEPS = [
  {
    n: '01',
    icon: Lightning,
    title: 'Create session',
    desc: 'Your agent calls the API (or a human uses the Work Dispatcher) with task, participants, and config. Comms generates a structured conversation plan—agenda and question outline—for review when required, then returns a session object.',
  },
  {
    n: '02',
    icon: Robot,
    title: 'Comms runs conversations',
    desc: 'After accept (UI or policy-approved programmatic send), invites go out; conversations run with follow-ups — sync or async. Your agent can keep working meanwhile.',
  },
  {
    n: '03',
    icon: ArrowsClockwise,
    title: 'Outcome delivered',
    desc: 'When all conversations complete, Comms fires a webhook with the full session outcome: findings, scores, decisions, artifacts. Or your agent can poll.',
  },
  {
    n: '04',
    icon: ArrowBendRightDown,
    title: 'Use the result',
    desc: 'The session object is structured JSON — chain it into the next task, export to your systems, or use it as context for the next Comms dispatch.',
  },
]

export function DeveloperPage() {
  const [activeTab, setActiveTab] = useState('api')
  const current = TABS.find(t => t.id === activeTab)!

  return (
    <div className="min-h-screen bg-[#0A0E1A]">
      <Nav />
      <div className="pt-14">

        {/* Hero */}
        <div className="relative overflow-hidden border-b border-white/10">
          <div className="absolute inset-0 dot-grid opacity-[0.07]" />
          <div className="max-w-[1200px] mx-auto px-8 py-20 relative z-10">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-brand-indigo/20 border border-brand-indigo/30 text-brand-pale px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6">
                <Code size={12} weight="bold" /> Developer Platform
              </div>
              <h1 className="text-5xl xl:text-6xl font-bold text-white leading-[1.05] tracking-tight">
                Built for agents.<br />
                <span className="text-brand-pale">Not just humans.</span>
              </h1>
              <p className="mt-6 text-lg text-white/50 leading-relaxed max-w-2xl">
                Every Comms session is a structured API object. Claude 4, Claude Code, Cursor, GitHub Copilot agent mode, OpenAI o3/o4, Gemini 2.5, Google ADK agents — any MCP-compatible runtime can dispatch sessions, receive webhooks, and chain outcomes into multi-step pipelines. No human loop required.
              </p>
              <div className="flex flex-wrap gap-3 mt-8">
                <a href="https://docs.comms.ai" className="btn-primary py-3 px-6">
                  Read the docs <ArrowRight size={15} weight="bold" />
                </a>
                <Link to="/app/dispatcher" className="bg-white/10 border border-white/20 text-white hover:bg-white/15 px-6 py-3 rounded-xl font-semibold text-sm transition-colors inline-flex items-center gap-2">
                  Try the dispatcher
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Works with */}
        <div className="border-b border-white/10 bg-white/[0.02]">
          <div className="max-w-[1200px] mx-auto px-8 py-8">
            <div className="flex items-center gap-6 flex-wrap">
              <span className="text-sm font-semibold text-white/30 whitespace-nowrap">Works natively with — April 2026</span>
              {AGENTS.map(a => (
                <div key={a.name} className={`flex items-center gap-2 border rounded-xl px-3 py-1.5 text-xs font-semibold ${a.color}`}>
                  <div className="w-5 h-5 rounded-md bg-current/10 flex items-center justify-center font-bold text-[10px]">{a.letter}</div>
                  <span>{a.name}</span>
                  <span className="opacity-50">{a.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="max-w-[1200px] mx-auto px-8 py-20">
          <div className="mb-12">
            <div className="text-xs font-bold text-brand-pale uppercase tracking-widest mb-3">The model</div>
            <h2 className="text-4xl font-bold text-white">Dispatch. Wait. Receive.</h2>
            <p className="text-white/40 mt-3 text-lg max-w-xl">
              Sessions are fire-and-forget. Your agent dispatches the work, handles other tasks, and gets structured results when conversations complete — ready to chain into the next step.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {STEPS.map(step => {
              const Icon = step.icon
              return (
                <div key={step.n} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-brand-indigo/30 transition-colors">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-brand-indigo/20 flex items-center justify-center">
                      <Icon size={16} weight="duotone" className="text-brand-pale" />
                    </div>
                    <span className="text-xs font-bold text-white/25 tracking-widest">{step.n}</span>
                  </div>
                  <div className="text-base font-bold text-white mb-2">{step.title}</div>
                  <p className="text-sm text-white/45 leading-relaxed">{step.desc}</p>
                </div>
              )
            })}
          </div>

          {/* Arrow connector */}
          <div className="hidden lg:flex items-center justify-center gap-2 mt-6 text-white/15">
            {[0, 1, 2].map(i => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-32 h-px bg-white/10" />
                <CaretRight size={14} weight="bold" />
              </div>
            ))}
          </div>
        </div>

        {/* Code tabs */}
        <div className="border-t border-white/10 bg-white/[0.015]">
          <div className="max-w-[1200px] mx-auto px-8 py-20">
            <div className="mb-10">
              <div className="text-xs font-bold text-brand-pale uppercase tracking-widest mb-3">Integrate</div>
              <h2 className="text-4xl font-bold text-white">Three ways to connect</h2>
              <p className="text-white/40 mt-3 text-base max-w-xl">
                REST API with TypeScript SDK, native MCP tools, or a CLI for scripts and CI/CD.
              </p>
            </div>

            {/* Tab bar */}
            <div className="flex gap-2 mb-6">
              {TABS.map(t => {
                const Icon = t.icon
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all border ${
                      activeTab === t.id
                        ? 'bg-brand-indigo text-white border-brand-indigo shadow-lg shadow-brand-indigo/30'
                        : 'bg-white/5 text-white/40 border-white/10 hover:border-white/25 hover:text-white/70'
                    }`}
                  >
                    <Icon size={14} weight="bold" /> {t.label}
                  </button>
                )
              })}
            </div>

            <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">
              {/* Code */}
              <CodeBlock code={current.code} lang={current.lang} label={current.file} />

              {/* Panel */}
              <div className="space-y-4">
                {activeTab === 'api' && (
                  <>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                      <div className="text-xs font-bold text-white/30 uppercase tracking-widest mb-3">SDK Install</div>
                      <div className="bg-[#0D1117] rounded-xl px-4 py-3 font-mono text-sm text-brand-pale border border-white/10">
                        npm install @assembly/comms
                      </div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
                      <div className="text-xs font-bold text-white/30 uppercase tracking-widest">Session lifecycle</div>
                      {['dispatched', 'in_progress', 'awaiting_followup', 'complete', 'failed'].map((s, i) => (
                        <div key={s} className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full shrink-0 ${i === 3 ? 'bg-green-400' : i === 4 ? 'bg-red-400' : 'bg-brand-pale'}`} />
                          <code className="text-sm text-white/60 font-mono">{s}</code>
                        </div>
                      ))}
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                      <div className="text-xs font-bold text-white/30 uppercase tracking-widest mb-3">REST Endpoints</div>
                      <div className="space-y-2 text-sm font-mono">
                        {[
                          ['POST', '/v1/sessions/dispatch'],
                          ['GET',  '/v1/sessions/:id'],
                          ['GET',  '/v1/sessions'],
                          ['POST', '/v1/sessions/query'],
                        ].map(([m, p]) => (
                          <div key={p} className="flex items-center gap-2">
                            <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${m === 'POST' ? 'bg-green-900/40 text-green-400' : 'bg-blue-900/40 text-blue-400'}`}>{m}</span>
                            <span className="text-white/50">{p}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
                {activeTab === 'mcp' && (
                  <>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                      <div className="text-xs font-bold text-white/30 uppercase tracking-widest mb-3">MCP Tools exposed</div>
                      <div className="space-y-2.5">
                        {[
                          { name: 'comms_dispatch',      desc: 'Create and send a session to participants' },
                          { name: 'comms_get_session',   desc: 'Fetch session status + full outcome' },
                          { name: 'comms_list_sessions', desc: 'List sessions by status, tag, or date' },
                          { name: 'comms_query',         desc: 'Natural-language query across all outcomes' },
                          { name: 'comms_chain',         desc: 'Spawn a follow-on session from a prior outcome' },
                          { name: 'comms_cancel',        desc: 'Cancel or pause an in-progress session' },
                        ].map(t => (
                          <div key={t.name}>
                            <code className="text-xs text-brand-pale font-mono">{t.name}</code>
                            <p className="text-xs text-white/35 mt-0.5">{t.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                      <div className="text-xs font-bold text-white/30 uppercase tracking-widest mb-2">Add to Claude / Cursor / Copilot</div>
                      <div className="bg-[#0D1117] rounded-xl px-4 py-3 font-mono text-sm text-brand-pale border border-white/10 break-all">
                        npx @comms/mcp
                      </div>
                      <p className="text-xs text-white/30 mt-2">Registers Comms as an MCP server in <code className="text-white/50">mcp.json</code> (Cursor), <code className="text-white/50">claude_desktop_config.json</code>, or your agent's tools config. Works with any MCP-compatible runtime — Claude Code, Copilot agent mode, Google ADK, OpenAI Agents SDK.</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                      <div className="text-xs font-bold text-white/30 uppercase tracking-widest mb-3">Supported runtimes</div>
                      <div className="space-y-1.5 text-xs font-mono">
                        {[
                          'Claude 4 / Claude Code',
                          'Cursor (agent mode)',
                          'GitHub Copilot (agent mode)',
                          'OpenAI Agents SDK / o3 / o4-mini',
                          'Gemini 2.5 + Google ADK',
                          'Any MCP-compatible agent',
                        ].map(r => (
                          <div key={r} className="flex items-center gap-2 text-white/50">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />
                            {r}
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
                {activeTab === 'cli' && (
                  <>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                      <div className="text-xs font-bold text-white/30 uppercase tracking-widest mb-3">CLI Commands</div>
                      <div className="space-y-2.5 text-sm font-mono">
                        {[
                          'comms dispatch',
                          'comms sessions list',
                          'comms sessions get <id>',
                          'comms sessions watch <id>',
                          'comms sessions outcome <id>',
                          'comms auth login',
                        ].map(cmd => (
                          <div key={cmd} className="text-white/50">{cmd}</div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                      <div className="text-xs font-bold text-white/30 uppercase tracking-widest mb-2">Use in CI/CD</div>
                      <p className="text-sm text-white/40 leading-relaxed">Chain Comms into GitHub Actions, Temporal workflows, or any script. The CLI exits with outcome data in stdout — pipe it anywhere.</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Session object deep-dive */}
            <div className="mt-16">
              <div className="mb-8">
                <div className="text-xs font-bold text-brand-pale uppercase tracking-widest mb-3">The session object</div>
                <h3 className="text-3xl font-bold text-white">One response. Every answer.</h3>
                <p className="text-white/40 mt-2 text-base max-w-xl">
                  The session outcome is a single structured object your agent can consume directly — no parsing raw transcripts or chasing status endpoints.
                </p>
              </div>
              <div className="grid lg:grid-cols-[1fr_340px] gap-8 items-start">
                <CodeBlock code={SESSION_OUTCOME} lang="json" label="session.outcome.json" />
                <div className="space-y-3">
                  {[
                    { icon: Check, color: 'text-green-400', label: 'findings[ ]', desc: 'Pre-extracted, specific findings per participant or item' },
                    { icon: Lightning, color: 'text-yellow-400', label: 'generated_action', desc: 'Comms suggests what to do next, ready to chain or act on' },
                    { icon: ArrowBendRightDown, color: 'text-blue-400', label: 'artifacts[ ]', desc: 'Transcripts, score sheets, collected files — all linked' },
                    { icon: ArrowsClockwise, color: 'text-purple-400', label: 'status chain', desc: 'Poll or receive a webhook when any session changes state' },
                  ].map(item => {
                    const Icon = item.icon
                    return (
                      <div key={item.label} className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-4">
                        <Icon size={15} weight="duotone" className={`${item.color} shrink-0 mt-0.5`} />
                        <div>
                          <code className="text-sm font-mono text-white/80">{item.label}</code>
                          <p className="text-xs text-white/40 mt-0.5 leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="border-t border-white/10">
          <div className="max-w-[1200px] mx-auto px-8 py-20 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">Let your agents work with humans.</h2>
            <p className="text-white/40 text-lg mb-8 max-w-xl mx-auto">
              Claude 4, o3, Gemini 2.5, Claude Code, Copilot — every major agent runtime speaks Comms natively via MCP. Dispatch once. Receive structured outcomes.
            </p>
            <div className="flex justify-center gap-3">
              <a href="https://docs.comms.ai" className="btn-primary py-3.5 px-8 text-base">
                Read the API docs <ArrowRight size={16} weight="bold" />
              </a>
              <Link to="/" className="bg-white/10 border border-white/20 text-white hover:bg-white/15 px-8 py-3.5 rounded-xl font-semibold text-base transition-colors inline-flex items-center gap-2">
                Back to product
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
