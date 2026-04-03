import { Video, MessageSquare, Phone, Mail, MessageCircle, Check, ArrowRight } from 'lucide-react'

interface ChannelCard {
  type: 'sync' | 'async' | 'traditional'
  icon: React.ElementType
  label: string
  badge: string
  badgeColor: string
  title: string
  description: string
  traits: string[]
  bestFor: string[]
  iconBg: string
}

const channels: ChannelCard[] = [
  {
    type: 'sync',
    icon: Video,
    label: 'Synchronous',
    badge: 'Live',
    badgeColor: 'bg-green-100 text-green-700',
    title: 'Scheduled Live Conversations',
    description:
      'When the task benefits from a real-time conversation — Comms automatically schedules time with the human and conducts a full live voice or video session on your behalf.',
    traits: [
      'AI schedules the meeting automatically',
      'Full voice & video session — no human needed from your side',
      'Structured agenda, followed precisely',
      'Real-time adaptive follow-up questions',
    ],
    bestFor: [
      'Behavioral and technical interviews',
      'Complex vendor onboarding',
      'Benefits counseling sessions',
      'Sales qualification calls',
    ],
    iconBg: 'bg-green-50',
  },
  {
    type: 'async',
    icon: MessageSquare,
    label: 'Asynchronous',
    badge: 'On Their Time',
    badgeColor: 'bg-brand-ghost text-brand-blue',
    title: 'Link-Based Async Sessions',
    description:
      'A link is sent — the human can respond whenever they\'re ready. Could be voice dictation, text, or a guided chat. Could take 5 minutes or 3 days. The session waits and follows up automatically.',
    traits: [
      'Participants respond on their own schedule',
      'Voice dictation, text, or guided chat',
      'Automatic follow-up until complete',
      'No calendar coordination needed',
    ],
    bestFor: [
      'Document collection and intake forms',
      'Employee check-ins and pulse surveys',
      'SOP and knowledge capture',
      'Customer feedback and research',
    ],
    iconBg: 'bg-brand-ghost',
  },
]

const traditionalChannels = [
  { icon: Phone, label: 'Phone', description: 'Outbound voice calls for scheduling, reminders, and quick confirms.' },
  { icon: Mail, label: 'Email', description: 'Session invites, follow-ups, and result summaries delivered to inboxes.' },
  { icon: MessageCircle, label: 'SMS', description: 'Quick nudges and availability confirmation via text message.' },
]

export function CommChannels() {
  return (
    <section id="channels" className="py-24 bg-white">
      <div className="section-container">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="tag bg-brand-ghost text-brand-blue">Communication Channels</div>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-brand-dark">
            Sync, async,<br />
            <span className="gradient-text">or however they prefer.</span>
          </h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Comms supports every communication style. You pick the mode — we handle the rest.
          </p>
        </div>

        {/* Primary channels */}
        <div className="grid lg:grid-cols-2 gap-8 mb-14">
          {channels.map(channel => {
            const Icon = channel.icon
            return (
              <div key={channel.type} className="card border border-gray-100 hover:border-brand-pale transition-colors">
                {/* Header */}
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl ${channel.iconBg} flex items-center justify-center`}>
                      <Icon size={22} className="text-brand-blue" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{channel.label}</div>
                      <div className="font-bold text-brand-dark mt-0.5">{channel.title}</div>
                    </div>
                  </div>
                  <span className={`tag text-xs ${channel.badgeColor}`}>{channel.badge}</span>
                </div>

                <p className="text-sm text-gray-500 leading-relaxed mb-5">{channel.description}</p>

                {/* Traits */}
                <div className="mb-5 space-y-2">
                  {channel.traits.map(trait => (
                    <div key={trait} className="flex items-center gap-2 text-sm">
                      <Check size={14} className="text-brand-blue shrink-0" />
                      <span className="text-gray-600">{trait}</span>
                    </div>
                  ))}
                </div>

                {/* Best for */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">Best For</div>
                  <div className="flex flex-wrap gap-2">
                    {channel.bestFor.map(item => (
                      <span key={item} className="text-xs bg-white border border-gray-200 text-gray-600 px-2.5 py-1 rounded-full">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Traditional channels */}
        <div className="bg-gray-50 rounded-3xl p-8">
          <div className="text-center mb-8">
            <div className="tag bg-white text-gray-500 border border-gray-200 mb-3">Traditional Channels</div>
            <h3 className="text-xl font-bold text-brand-dark">Plus all the classic channels — outbound.</h3>
            <p className="text-sm text-gray-500 mt-2 max-w-lg mx-auto">
              When a session needs to reach someone, Comms uses whatever channel makes sense — phone, email, or SMS. Always outbound, always on your behalf.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {traditionalChannels.map(tc => {
              const Icon = tc.icon
              return (
                <div key={tc.label} className="bg-white rounded-2xl p-5 border border-gray-100 flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-brand-ghost flex items-center justify-center shrink-0">
                    <Icon size={18} className="text-brand-blue" />
                  </div>
                  <div>
                    <div className="font-semibold text-brand-dark mb-1">{tc.label}</div>
                    <div className="text-xs text-gray-500 leading-relaxed">{tc.description}</div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-400">
            <ArrowRight size={14} />
            Traditional channels are used by Comms to deliver and follow up — not as inbound endpoints.
          </div>
        </div>
      </div>
    </section>
  )
}
