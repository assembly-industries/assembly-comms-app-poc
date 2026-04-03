import { Archive, ArrowRight, Link, Layers, Brain } from 'lucide-react'

const sessionExamples = [
  {
    id: 'sess-001',
    title: 'Vendor Onboarding — Q4 2024',
    category: 'Collect',
    date: 'Oct 12, 2024',
    summary: '18 vendors onboarded. All W-9s, insurance certs, and NDAs collected. 2 exceptions flagged.',
    count: '18 vendors',
    dot: 'bg-green-400',
    status: 'Complete',
  },
  {
    id: 'sess-002',
    title: 'Engineering Candidate Screen — Jan 2025',
    category: 'Test',
    date: 'Jan 8, 2025',
    summary: '12 candidates screened. 5 advanced to next round. Dimension scores and evidence captured.',
    count: '12 candidates',
    dot: 'bg-brand-mid',
    status: 'Complete',
  },
  {
    id: 'sess-003',
    title: 'Team Roadmap Brainstorm',
    category: 'Collect',
    date: 'Feb 2, 2025',
    summary: 'Captured top ideas from 14 team members. Themes: 3 product, 2 infrastructure, 1 growth.',
    count: '14 responses',
    dot: 'bg-violet-400',
    status: 'Complete',
  },
]

const powerActions = [
  {
    icon: Link,
    title: 'Chain Sessions Together',
    description:
      '"Based on the vendor onboarding session from October — reach back out to all of them and collect updated insurance certs."',
    example: 'Reference: Vendor Onboarding Q4 → New Session: Insurance Renewal',
  },
  {
    icon: Brain,
    title: 'Use Sessions as Context',
    description:
      '"Take the roadmap brainstorm session and create a new session where the team ranks and votes on implementation priority."',
    example: 'Reference: Team Roadmap Brainstorm → New Session: Priority Voting',
  },
  {
    icon: Layers,
    title: 'Ask Questions Across Sessions',
    description:
      '"Who were the top 3 candidates from our engineering screens last month? Draft an email inviting them back for a final round."',
    example: 'Query across past sessions → Action on results',
  },
]

export function SessionsPower() {
  return (
    <section id="sessions" className="py-24 bg-brand-dark text-white overflow-hidden">
      <div className="section-container relative">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="tag bg-white/10 text-white border border-white/10">Sessions</div>
          <h2 className="text-4xl lg:text-5xl font-extrabold leading-tight">
            Every task becomes<br />
            <span className="text-brand-pale">a reusable session.</span>
          </h2>
          <p className="text-lg text-white/60 max-w-xl mx-auto">
            Your communication history doesn't disappear — it becomes context. Each session is a structured record you can reference, query, and act on forever.
          </p>
        </div>

        {/* Session library + power actions */}
        <div className="grid lg:grid-cols-5 gap-10 items-start">

          {/* Left: Session library */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center gap-2 mb-5">
              <Archive size={16} className="text-brand-pale" />
              <span className="text-sm font-semibold text-white/60">Your Session Library</span>
            </div>

            {sessionExamples.map(session => (
              <div
                key={session.id}
                className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 transition-colors cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${session.dot}`} />
                    <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">{session.category}</span>
                  </div>
                  <span className="text-xs text-white/30">{session.date}</span>
                </div>
                <div className="font-semibold text-white text-sm mb-1">{session.title}</div>
                <div className="text-xs text-white/50 leading-relaxed">{session.summary}</div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-white/30">{session.count}</span>
                  <span className="text-xs text-brand-pale group-hover:text-white transition-colors flex items-center gap-1">
                    Use as context <ArrowRight size={10} />
                  </span>
                </div>
              </div>
            ))}

            <div className="border border-dashed border-white/10 rounded-xl p-4 text-center">
              <div className="text-xs text-white/30">+ hundreds more sessions over time</div>
            </div>
          </div>

          {/* Right: Power actions */}
          <div className="lg:col-span-3 space-y-5">
            <div className="flex items-center gap-2 mb-5">
              <Brain size={16} className="text-brand-pale" />
              <span className="text-sm font-semibold text-white/60">What You Can Do With Sessions</span>
            </div>

            {powerActions.map(action => {
              const Icon = action.icon
              return (
                <div
                  key={action.title}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3 hover:border-brand-pale/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-brand-blue/20 flex items-center justify-center">
                      <Icon size={16} className="text-brand-pale" />
                    </div>
                    <h3 className="font-bold text-white">{action.title}</h3>
                  </div>

                  <div className="bg-black/20 rounded-xl p-4 border border-white/5">
                    <p className="text-sm text-white/70 italic leading-relaxed">
                      {action.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-brand-pale">
                    <ArrowRight size={12} />
                    {action.example}
                  </div>
                </div>
              )
            })}

            {/* Summary callout */}
            <div className="bg-gradient-to-r from-brand-blue/20 to-brand-mid/10 border border-brand-pale/20 rounded-2xl p-6">
              <p className="text-white/80 text-sm leading-relaxed">
                <strong className="text-white">Sessions compound.</strong> The more you use Comms, the richer your context becomes. Your entire communication history becomes a knowledge base you can query, extend, and act on — powering every future task.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
