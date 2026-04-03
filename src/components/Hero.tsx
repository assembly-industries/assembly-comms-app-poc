import { ArrowRight, Sparkles } from 'lucide-react'

const chatMessages = [
  { role: 'user', text: 'Onboard 12 new contractors — collect their W-9, verify insurance, and get NDAs signed.' },
  { role: 'ai', text: 'Got it. Creating a Comm Session for contractor onboarding. I\'ll reach out to all 12, collect documents, and follow up until complete.' },
  { role: 'ai', text: '12 sessions created · Documents collecting · 3 completed so far' },
  { role: 'user', text: 'Also screen the 5 engineering candidates from last week\'s pipeline.' },
  { role: 'ai', text: 'On it — scheduling structured technical interviews for all 5 candidates this week.' },
]

export function Hero() {
  return (
    <section className="pt-24 pb-20 grid-bg overflow-hidden">
      <div className="section-container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left: Copy */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-brand-ghost text-brand-blue px-4 py-2 rounded-full text-sm font-semibold">
              <Sparkles size={14} />
              Powered by Assembly AI
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-extrabold text-brand-dark leading-[1.08] tracking-tight">
                The best way<br />
                to <span className="gradient-text">work with</span><br />
                humans.
              </h1>
              <p className="text-xl text-gray-500 leading-relaxed max-w-lg">
                Describe what you need — collect information, run interviews, train your team, review documents. Comms handles every conversation at scale.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <a href="#how-it-works" className="btn-primary">
                See How It Works <ArrowRight size={16} />
              </a>
              <a href="#use-cases" className="btn-secondary">
                Explore Use Cases
              </a>
            </div>

            {/* Stats row */}
            <div className="flex gap-8 pt-4 border-t border-gray-100">
              {[
                { value: '100%', label: 'Async or Live' },
                { value: 'Any Scale', label: '1 to 10,000+' },
                { value: 'All Channels', label: 'Voice, Video, Chat, SMS, Email' },
              ].map(stat => (
                <div key={stat.label}>
                  <div className="text-xl font-bold text-brand-blue">{stat.value}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Chat UI mockup */}
          <div className="relative">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
              {/* Window chrome */}
              <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100 bg-gray-50">
                <div className="w-3 h-3 rounded-full bg-red-300" />
                <div className="w-3 h-3 rounded-full bg-yellow-300" />
                <div className="w-3 h-3 rounded-full bg-green-300" />
                <div className="ml-3 text-xs text-gray-400 font-medium">Comms — Work Dispatcher</div>
              </div>

              {/* Chat messages */}
              <div className="p-5 space-y-4 min-h-[320px]">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-up`}
                    style={{ animationDelay: `${i * 0.15}s`, opacity: 0 }}
                  >
                    {msg.role === 'ai' && (
                      <div className="w-7 h-7 rounded-full bg-brand-blue flex items-center justify-center mr-2 mt-1 shrink-0">
                        <Sparkles size={12} className="text-white" />
                      </div>
                    )}
                    <div className={msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}>
                      {msg.text}
                    </div>
                  </div>
                ))}

                {/* Typing indicator */}
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-brand-blue flex items-center justify-center shrink-0">
                    <Sparkles size={12} className="text-white" />
                  </div>
                  <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1.5 items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>

              {/* Input bar */}
              <div className="px-5 py-4 border-t border-gray-100">
                <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-2.5">
                  <span className="text-sm text-gray-400 flex-1">What do you need to communicate?</span>
                  <ArrowRight size={16} className="text-brand-blue" />
                </div>
              </div>
            </div>

            {/* Floating session cards */}
            <div className="absolute -right-6 top-12 bg-white rounded-xl shadow-lg border border-gray-100 p-3 w-48 text-xs">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-green-400" />
                <span className="font-semibold text-brand-dark">Session Active</span>
              </div>
              <div className="text-gray-400">Contractor Onboarding</div>
              <div className="mt-1.5 text-brand-blue font-semibold">3 / 12 complete</div>
            </div>

            <div className="absolute -left-6 bottom-16 bg-white rounded-xl shadow-lg border border-gray-100 p-3 w-44 text-xs">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-brand-mid animate-pulse-slow" />
                <span className="font-semibold text-brand-dark">Collecting</span>
              </div>
              <div className="text-gray-400">Engineering Screens</div>
              <div className="mt-1.5 text-brand-blue font-semibold">5 scheduled</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
