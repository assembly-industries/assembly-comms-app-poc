import { MessageSquare, Zap, Users, BarChart3 } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: MessageSquare,
    title: 'Describe What You Need',
    description:
      'Start in your Comms workspace — a chat-like interface where you describe any task involving humans. Collect documents, run interviews, train your team, review materials. In plain language.',
    color: 'bg-brand-blue',
    accent: 'text-brand-blue',
    mockup: (
      <div className="bg-gray-50 rounded-xl p-4 space-y-3 text-sm">
        <div className="chat-bubble-user text-xs">
          Screen all 8 candidates for the sales role. Use our standard rubric.
        </div>
        <div className="chat-bubble-ai text-xs">
          Creating a Comm Session: Sales Candidate Screening × 8
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400 pl-9">
          <div className="w-1.5 h-1.5 rounded-full bg-brand-mid animate-pulse" />
          Sending invites...
        </div>
      </div>
    ),
  },
  {
    number: '02',
    icon: Zap,
    title: 'A Comm Session Is Created',
    description:
      'The system automatically creates a structured Comm Session — a dedicated context for that specific goal. It knows who needs to be reached, what needs to be collected, and what success looks like.',
    color: 'bg-brand-mid',
    accent: 'text-brand-mid',
    mockup: (
      <div className="bg-gray-50 rounded-xl p-4 space-y-2">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-brand-dark">Comm Session</span>
          <span className="tag bg-green-50 text-green-700">Active</span>
        </div>
        {[
          { label: 'Goal', value: 'Sales Candidate Screening' },
          { label: 'Recipients', value: '8 candidates' },
          { label: 'Mode', value: 'Async + Live Interview' },
          { label: 'Collect', value: 'Scores, quotes, recommendation' },
        ].map(row => (
          <div key={row.label} className="flex justify-between text-xs">
            <span className="text-gray-400">{row.label}</span>
            <span className="font-medium text-brand-dark">{row.value}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    number: '03',
    icon: Users,
    title: 'AI Conducts Every Conversation',
    description:
      'Comms reaches out automatically — scheduling calls, sending links, following up. Every person gets a tailored, structured conversation. The AI collects what\'s needed, verifies it, and stays on it until complete.',
    color: 'bg-indigo-600',
    accent: 'text-indigo-600',
    mockup: (
      <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-xs">
        {[
          { name: 'Alex Torres', status: 'Interviewed', score: '87%', dot: 'bg-green-400' },
          { name: 'Maria Chen', status: 'Scheduled', score: 'Thu 2pm', dot: 'bg-yellow-400' },
          { name: 'James Park', status: 'Link sent', score: 'Pending', dot: 'bg-brand-light' },
          { name: 'Sarah Kim', status: 'Completed', score: '91%', dot: 'bg-green-400' },
        ].map(person => (
          <div key={person.name} className="flex items-center justify-between py-1 border-b border-gray-100 last:border-0">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${person.dot}`} />
              <span className="font-medium text-brand-dark">{person.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-gray-400">{person.status}</span>
              <span className="font-semibold text-brand-blue">{person.score}</span>
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    number: '04',
    icon: BarChart3,
    title: 'Results Live in the Session',
    description:
      'Everything collected — documents, scores, notes, decisions — lives inside that session. Structured, searchable, and ready. Then use sessions as context for future conversations or to create new sessions.',
    color: 'bg-violet-600',
    accent: 'text-violet-600',
    mockup: (
      <div className="bg-gray-50 rounded-xl p-4 space-y-3 text-xs">
        <div className="flex items-center justify-between mb-1">
          <span className="font-bold text-brand-dark text-sm">Session Complete</span>
          <span className="tag bg-brand-ghost text-brand-blue">8 / 8</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Advance', value: '5', color: 'text-green-600' },
            { label: 'Hold', value: '2', color: 'text-yellow-600' },
            { label: 'Decline', value: '1', color: 'text-red-500' },
            { label: 'Avg Score', value: '84%', color: 'text-brand-blue' },
          ].map(item => (
            <div key={item.label} className="bg-white rounded-lg p-2 text-center border border-gray-100">
              <div className={`text-lg font-bold ${item.color}`}>{item.value}</div>
              <div className="text-gray-400 mt-0.5">{item.label}</div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-lg p-2 border border-gray-100 text-gray-500">
          → Use as context: "Based on these interviews, draft offer letters for the top 3…"
        </div>
      </div>
    ),
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="section-container">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="tag bg-brand-ghost text-brand-blue">How It Works</div>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-brand-dark">
            Describe it. We handle<br />
            <span className="gradient-text">every conversation.</span>
          </h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            From your request to structured outcomes — Comms orchestrates everything in between.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-8">
          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <div
                key={step.number}
                className={`grid lg:grid-cols-2 gap-10 items-center ${i % 2 !== 0 ? 'lg:grid-flow-dense' : ''}`}
              >
                {/* Text side */}
                <div className={`space-y-5 ${i % 2 !== 0 ? 'lg:col-start-2' : ''}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${step.color} flex items-center justify-center`}>
                      <Icon size={18} className="text-white" />
                    </div>
                    <span className="text-sm font-bold text-gray-300 tracking-widest">{step.number}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-brand-dark">{step.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{step.description}</p>
                </div>

                {/* Mockup side */}
                <div className={`${i % 2 !== 0 ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-md overflow-hidden">
                    <div className="flex items-center gap-1.5 px-4 py-3 bg-gray-50 border-b border-gray-100">
                      <div className="w-2 h-2 rounded-full bg-gray-200" />
                      <div className="w-2 h-2 rounded-full bg-gray-200" />
                      <div className="w-2 h-2 rounded-full bg-gray-200" />
                      <span className="text-xs text-gray-400 ml-2">comms.ai</span>
                    </div>
                    <div className="p-5">
                      {step.mockup}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
