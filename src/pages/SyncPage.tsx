import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Microphone, MicrophoneSlash, PhoneSlash, ChatDots, CaretRight, Check, Circle, X } from '@phosphor-icons/react'
import { Nav } from '../components/Nav'
import { PrototypeBanner } from '../components/shared/PrototypeBanner'

const AGENDA = [
  { id: 1, title: 'Opening & disclosure', done: true },
  { id: 2, title: 'Role clarity check', done: true },
  { id: 3, title: 'Experience deep-dive', done: false, current: true },
  { id: 4, title: 'Knockout questions', done: false },
  { id: 5, title: 'Logistics & close', done: false },
]

type AgentState = 'connecting' | 'listening' | 'thinking' | 'speaking' | 'waiting'

const TRANSCRIPT: Array<{ role: 'agent' | 'user'; text: string; t: number }> = [
  { role: 'agent', text: "Hi Alex, I'm the screening assistant for Northriver. This is a structured screening for the Warehouse Lead role — same questions for every candidate. We're recording for our records. Ready to start?", t: 0 },
  { role: 'user', text: "Yes, absolutely, I'm ready.", t: 8 },
  { role: 'agent', text: "Great. You applied for the Warehouse Lead position — can you confirm that's the role you're interested in?", t: 11 },
  { role: 'user', text: "That's correct, yes.", t: 16 },
  { role: 'agent', text: "Perfect. Let's move into experience. Tell me about a time you had to manage a team through a high-pressure situation. Walk me through what happened, what you did, and the outcome.", t: 19 },
  { role: 'user', text: "Sure — this was about 18 months ago during peak season at my last warehouse. We had a major order surge come in the same week three of my team members called out sick...", t: 28 },
]

interface ChatMsg { role: 'agent' | 'user'; text: string }

export function SyncPage() {
  const [muted, setMuted] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [agentState, setAgentState] = useState<AgentState>('connecting')
  const [elapsed, setElapsed] = useState(0)
  const [progress, setProgress] = useState(40)
  const [transcriptMsgs, setTranscriptMsgs] = useState<ChatMsg[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const chatBottom = useRef<HTMLDivElement>(null)

  // Simulate connection then call
  useEffect(() => {
    const t1 = setTimeout(() => setAgentState('speaking'), 1200)
    const t2 = setTimeout(() => setAgentState('listening'), 4000)
    const t3 = setTimeout(() => setAgentState('speaking'), 7500)
    const t4 = setTimeout(() => setAgentState('waiting'), 11000)
    const cycle = setInterval(() => {
      const states: AgentState[] = ['listening', 'thinking', 'speaking', 'waiting']
      setAgentState(states[Math.floor(Math.random() * states.length)])
    }, 6000)
    timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000)
    // Populate transcript progressively
    TRANSCRIPT.forEach((msg, i) => {
      setTimeout(() => {
        setTranscriptMsgs(prev => [...prev, { role: msg.role, text: msg.text }])
      }, 800 + i * 3500)
    })
    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4)
      clearInterval(cycle)
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  useEffect(() => { chatBottom.current?.scrollIntoView({ behavior: 'smooth' }) }, [transcriptMsgs])

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  const stateColors: Record<AgentState, string> = {
    connecting: 'bg-gray-500',
    listening: 'bg-brand-indigo',
    thinking: 'bg-yellow-500',
    speaking: 'bg-green-500',
    waiting: 'bg-gray-400',
  }
  const stateLabels: Record<AgentState, string> = {
    connecting: 'Connecting...',
    listening: 'Listening',
    thinking: 'Thinking...',
    speaking: 'Speaking',
    waiting: 'Waiting for you',
  }

  return (
    <div className="h-screen flex flex-col bg-[#0A0E27]">
      <Nav />
      <div className="flex flex-1 min-h-0 overflow-hidden pt-14">

        {/* Agenda sidebar */}
        <div className="w-64 flex flex-col bg-[#0D1117] border-r border-white/10 shrink-0">
          <div className="px-5 pt-5 pb-4 border-b border-white/10">
            <div className="text-xs font-semibold text-white/30 uppercase tracking-wider mb-1">Session</div>
            <div className="text-base font-semibold text-white">Engineering Screen</div>
            <div className="text-sm text-white/40 mt-0.5">Alex Torres · 20 min</div>
            <div className="mt-3 flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-white/60">Joined via phone call</span>
            </div>
            {/* Dedicated time callout */}
            <div className="mt-3 bg-brand-indigo/20 border border-brand-pale/20 rounded-xl px-3 py-2.5 space-y-1.5">
              <div className="text-[10px] font-bold text-brand-pale/80 uppercase tracking-wider">Dedicated time</div>
              <p className="text-[11px] text-white/50 leading-relaxed">Alex committed a specific slot for this. You know the outcome arrives the moment this call ends.</p>
            </div>
          </div>

          <div className="px-5 pt-5 flex-1">
            <div className="text-xs font-semibold text-white/30 uppercase tracking-wider mb-3">Agenda</div>
            {AGENDA.map((item, i) => (
              <div key={item.id} className={`flex items-start gap-3 py-3 ${i < AGENDA.length - 1 ? 'border-b border-white/5' : ''}`}>
                <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                  item.done ? 'bg-green-500' : item.current ? 'bg-brand-indigo' : 'bg-white/10'
                }`}>
                  {item.done ? <Check size={10} className="text-white" /> : item.current ? <div className="w-2 h-2 rounded-full bg-white animate-pulse" /> : <Circle size={10} className="text-white/30" />}
                </div>
                <span className={`text-sm ${item.current ? 'text-white font-semibold' : item.done ? 'text-white/40 line-through' : 'text-white/40'}`}>
                  {item.title}
                </span>
              </div>
            ))}
          </div>

          {/* Progress */}
          <div className="px-5 pb-5">
            <div className="flex justify-between text-xs text-white/30 mb-1.5">
              <span>Progress</span><span>{progress}%</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-brand-indigo rounded-full transition-all duration-1000" style={{ width: `${progress}%` }} />
            </div>
            <div className="flex items-center gap-2 mt-3">
              <div className="pill bg-green-900/40 text-green-400 border-green-700/40 text-xs">Live</div>
              <span className="text-sm text-white/30 font-mono">{formatTime(elapsed)}</span>
            </div>
          </div>
        </div>

        {/* Main call area */}
        <div className="flex-1 flex flex-col relative">
          {/* Periwinkle wash overlay */}
          <div className="absolute inset-0 periwinkle-wash opacity-20 pointer-events-none" />

          {/* Call surface */}
          <div className="flex-1 flex flex-col items-center justify-center gap-6 relative z-10">
            {/* Agent state indicator */}
            <div className={`pill text-sm font-bold ${stateColors[agentState]} text-white border-0 px-4 py-2`}>
              <div className={`w-2 h-2 rounded-full bg-white/80 ${agentState !== 'waiting' ? 'animate-pulse' : ''}`} />
              {stateLabels[agentState]}
            </div>

            {/* Agent avatar + waveform */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className={`w-24 h-24 rounded-full bg-brand-indigo/20 border-2 flex items-center justify-center transition-all duration-300 ${
                  agentState === 'speaking' ? 'border-brand-pale pulse-ring scale-105' : 'border-brand-indigo/40'
                }`}>
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-indigo to-brand-light flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">AI</span>
                  </div>
                </div>
              </div>

              {/* Waveform (only when speaking) */}
              {agentState === 'speaking' ? (
                <div className="flex items-end gap-1 h-8">
                  {[4, 8, 12, 16, 20, 16, 12, 8, 14, 18, 22, 14, 8, 4].map((h, i) => (
                    <div key={i} className={`w-1.5 bg-brand-pale rounded-full wave-bar`} style={{ height: `${h}px` }} />
                  ))}
                </div>
              ) : (
                <div className="flex items-end gap-1 h-8">
                  {Array(14).fill(4).map((_, i) => (
                    <div key={i} className="w-1.5 bg-white/10 rounded-full" style={{ height: '4px' }} />
                  ))}
                </div>
              )}

              <div className="text-center">
                <div className="text-white font-semibold text-lg">Comms AI</div>
                <div className="text-white/40 text-sm">Structured Screening Interviewer</div>
              </div>
            </div>

            {/* Participant */}
            <div className="flex flex-col items-center gap-2">
              <div className={`w-14 h-14 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center transition-all ${
                agentState === 'listening' ? 'ring-2 ring-brand-pale ring-offset-2 ring-offset-[#0A0E27]' : ''
              }`}>
                <span className="text-white font-bold text-lg">AT</span>
              </div>
              <div className="text-center">
                <div className="text-white/70 text-base font-medium">Alex Torres</div>
                <div className="text-white/30 text-sm">{muted ? '🔇 Muted' : 'Connected · phone call'}</div>
              </div>
            </div>

            {/* Current item callout */}
            <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-center max-w-sm">
              <div className="text-xs font-semibold text-white/30 uppercase tracking-wider mb-1">Current agenda item</div>
              <div className="text-white text-base font-medium">Experience deep-dive (STAR)</div>
            </div>
          </div>

          {/* Controls bar */}
          <div className="relative z-10 flex items-center justify-center gap-4 py-5 border-t border-white/10 bg-black/20">
            <button
              onClick={() => setMuted(!muted)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                muted ? 'bg-rose-600 hover:bg-rose-700' : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              {muted ? <MicrophoneSlash size={18} weight="bold" className="text-white" /> : <Microphone size={18} weight="bold" className="text-white" />}
            </button>

            <button
              onClick={() => setChatOpen(!chatOpen)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all relative ${
                chatOpen ? 'bg-brand-indigo' : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              <ChatDots size={18} weight="bold" className="text-white" />
              {transcriptMsgs.length > 0 && !chatOpen && (
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-brand-pale text-[9px] text-brand-navy font-bold flex items-center justify-center">
                  {transcriptMsgs.length}
                </div>
              )}
            </button>

            <Link to="/" className="w-14 h-14 rounded-full bg-rose-600 hover:bg-rose-700 flex items-center justify-center transition-colors">
              <PhoneSlash size={20} weight="bold" className="text-white" />
            </Link>

            <button
              onClick={() => setProgress(p => Math.min(p + 20, 100))}
              className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
              title="Advance agenda"
            >
              <CaretRight size={18} weight="bold" className="text-white" />
            </button>
          </div>
        </div>

        {/* Chat / transcript drawer */}
        {chatOpen && (
          <div className="w-80 bg-[#0D1117] border-l border-white/10 flex flex-col shrink-0">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <ChatDots size={15} weight="bold" className="text-brand-pale" />
                <span className="text-base font-semibold text-white">Live Transcript</span>
              </div>
              <button onClick={() => setChatOpen(false)} className="text-white/30 hover:text-white">
                <X size={15} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {transcriptMsgs.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`text-sm rounded-xl px-4 py-3 max-w-[85%] leading-relaxed ${
                    msg.role === 'agent'
                      ? 'bg-white/5 text-white/70 rounded-tl-sm'
                      : 'bg-brand-indigo/30 text-brand-pale rounded-tr-sm'
                  }`}>
                    <div className="text-xs font-semibold mb-1.5 opacity-50">{msg.role === 'agent' ? 'COMMS AI' : 'ALEX'}</div>
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={chatBottom} />
            </div>
          </div>
        )}
      </div>

      <PrototypeBanner title="Sync — Live Conversation" description="Dedicated scheduled time · agenda-driven · outcome ready when the call ends" />
    </div>
  )
}
