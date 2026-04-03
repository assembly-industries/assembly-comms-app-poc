import { useState } from 'react'
import { Phone, Mail, MessageCircle, ExternalLink, CheckCircle, Clock, AlertCircle, ChevronRight, RefreshCw, Send } from 'lucide-react'
import { Nav } from '../components/Nav'
import { PrototypeBanner } from '../components/shared/PrototypeBanner'

type ChannelType = 'email' | 'sms' | 'phone'

interface OutreachRecord {
  id: string
  name: string
  channel: ChannelType
  status: 'sent' | 'opened' | 'replied' | 'failed' | 'called' | 'pending'
  time: string
  subject?: string
  preview?: string
}

const RECORDS: OutreachRecord[] = [
  { id: 'r1', name: 'Alex Torres', channel: 'email', status: 'opened', time: '2h ago', subject: 'W-9 Collection — Northriver', preview: 'Hi Alex, please complete your onboarding documents...' },
  { id: 'r2', name: 'Maria Chen', channel: 'sms', status: 'replied', time: '45m ago', preview: 'Thanks, just uploaded!' },
  { id: 'r3', name: 'James Park', channel: 'phone', status: 'called', time: '1h ago' },
  { id: 'r4', name: 'Sam Wilson', channel: 'email', status: 'sent', time: '3h ago', subject: 'W-9 Collection — Northriver', preview: 'Hi Sam, please complete your onboarding documents...' },
  { id: 'r5', name: 'Priya Nair', channel: 'sms', status: 'pending', time: '—' },
  { id: 'r6', name: 'Derek Kim', channel: 'email', status: 'failed', time: '4h ago', subject: 'W-9 Collection — Northriver' },
  { id: 'r7', name: 'Lucia Reyes', channel: 'phone', status: 'called', time: '30m ago' },
  { id: 'r8', name: 'Tom Nguyen', channel: 'email', status: 'replied', time: '15m ago', preview: 'All done, uploaded the files.' },
]

const CHANNEL_STATS = [
  { icon: Mail, label: 'Email', sent: 18, opened: 12, replied: 6, color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-100' },
  { icon: MessageCircle, label: 'SMS', sent: 14, opened: 14, replied: 9, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100' },
  { icon: Phone, label: 'Phone', sent: 8, opened: 8, replied: 5, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
]

const statusConfig: Record<OutreachRecord['status'], { label: string; color: string; icon: React.ElementType }> = {
  sent: { label: 'Sent', color: 'bg-gray-100 text-gray-600', icon: Send },
  opened: { label: 'Opened', color: 'bg-yellow-50 text-yellow-700', icon: ExternalLink },
  replied: { label: 'Replied', color: 'bg-green-50 text-green-700', icon: CheckCircle },
  called: { label: 'Called', color: 'bg-blue-50 text-blue-700', icon: Phone },
  failed: { label: 'Failed', color: 'bg-red-50 text-red-600', icon: AlertCircle },
  pending: { label: 'Pending', color: 'bg-gray-50 text-gray-400', icon: Clock },
}

const channelIcons: Record<ChannelType, React.ElementType> = {
  email: Mail,
  sms: MessageCircle,
  phone: Phone,
}

export function ChannelsPage() {
  const [activeChannel, setActiveChannel] = useState<ChannelType | 'all'>('all')
  const [selectedRecord, setSelectedRecord] = useState<OutreachRecord | null>(null)

  const filtered = activeChannel === 'all' ? RECORDS : RECORDS.filter(r => r.channel === activeChannel)

  return (
    <div className="h-screen flex flex-col bg-[#F8F9FC]">
      <Nav />
      <div className="flex flex-1 min-h-0 overflow-hidden pt-14">

        {/* Sidebar */}
        <div className="w-60 app-sidebar flex flex-col shrink-0">
          <div className="px-4 pt-5 pb-3 border-b border-gray-100">
            <div className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-1">Session</div>
            <div className="text-sm font-semibold text-brand-shaft">Contractor Onboarding</div>
            <div className="text-xs text-gray-400 mt-0.5">40 participants · Outbound only</div>
          </div>

          <div className="px-4 pt-4">
            <div className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-3">Channels</div>
            <button
              onClick={() => setActiveChannel('all')}
              className={`w-full text-left flex items-center justify-between px-2.5 py-2 rounded-xl mb-1 transition-colors text-xs font-medium ${
                activeChannel === 'all' ? 'bg-brand-ghost text-brand-indigo' : 'text-gray-500 hover:bg-white'
              }`}
            >
              All outreach <span className="text-[10px] font-bold">{RECORDS.length}</span>
            </button>
            {CHANNEL_STATS.map(ch => {
              const Icon = ch.icon
              const key = ch.label.toLowerCase() as ChannelType
              return (
                <button
                  key={key}
                  onClick={() => setActiveChannel(key)}
                  className={`w-full text-left flex items-center gap-2 px-2.5 py-2 rounded-xl mb-1 transition-colors text-xs font-medium ${
                    activeChannel === key ? 'bg-brand-ghost text-brand-indigo' : 'text-gray-500 hover:bg-white'
                  }`}
                >
                  <Icon size={12} className={activeChannel === key ? 'text-brand-indigo' : ch.color} />
                  {ch.label}
                  <span className="ml-auto text-[10px] font-bold">{RECORDS.filter(r => r.channel === key).length}</span>
                </button>
              )
            })}
          </div>

          {/* Disclaimer */}
          <div className="mt-auto px-4 pb-4">
            <div className="bg-gray-100 rounded-xl p-3 text-[10px] text-gray-500 leading-relaxed">
              <span className="font-bold block mb-1">Outbound only</span>
              Comms sends via email, SMS, and phone on your behalf. No inbound endpoints are exposed to participants.
            </div>
          </div>
        </div>

        {/* Main */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Stats bar */}
          <div className="bg-white border-b border-gray-100 px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="font-bold text-brand-shaft">Classic Channels</h1>
                <p className="text-xs text-gray-400 mt-0.5">Outbound communications for this session</p>
              </div>
              <button className="btn-secondary text-xs py-1.5">
                <RefreshCw size={12} /> Refresh
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {CHANNEL_STATS.map(ch => {
                const Icon = ch.icon
                const pct = Math.round((ch.replied / ch.sent) * 100)
                return (
                  <div key={ch.label} className={`${ch.bg} border ${ch.border} rounded-xl p-3`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Icon size={14} className={ch.color} />
                      <span className="text-xs font-bold text-gray-700">{ch.label}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1 text-center text-[10px]">
                      <div><div className="font-bold text-brand-shaft text-sm">{ch.sent}</div><div className="text-gray-400">Sent</div></div>
                      <div><div className="font-bold text-brand-shaft text-sm">{ch.opened}</div><div className="text-gray-400">Opened</div></div>
                      <div><div className="font-bold text-brand-shaft text-sm">{ch.replied}</div><div className="text-gray-400">Responded</div></div>
                    </div>
                    <div className="mt-2 h-1 bg-white/60 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-current opacity-50 transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Records table */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-3">
              {activeChannel === 'all' ? 'All Outreach' : `${activeChannel.charAt(0).toUpperCase() + activeChannel.slice(1)} Outreach`}
              <span className="ml-2 font-normal text-gray-400">({filtered.length})</span>
            </div>
            <div className="space-y-1.5">
              {filtered.map(record => {
                const ChannelIcon = channelIcons[record.channel]
                const { label, color, icon: StatusIcon } = statusConfig[record.status]
                return (
                  <button
                    key={record.id}
                    onClick={() => setSelectedRecord(record === selectedRecord ? null : record)}
                    className={`w-full text-left bg-white rounded-xl border px-4 py-3 flex items-center gap-4 hover:border-brand-indigo/20 transition-all ${
                      selectedRecord?.id === record.id ? 'border-brand-indigo/30 bg-brand-ghost/50' : 'border-gray-100'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                      <ChannelIcon size={14} className="text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-brand-shaft">{record.name}</div>
                      {record.subject && <div className="text-xs text-gray-400 truncate">{record.subject}</div>}
                      {record.preview && !record.subject && <div className="text-xs text-gray-400 truncate">{record.preview}</div>}
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-[10px] text-gray-400">{record.time}</span>
                      <span className={`pill text-[10px] ${color}`}>
                        <StatusIcon size={9} />
                        {label}
                      </span>
                      <ChevronRight size={12} className="text-gray-300" />
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Detail panel */}
        {selectedRecord && (
          <div className="w-72 bg-white border-l border-gray-100 flex flex-col shrink-0">
            <div className="px-4 py-3.5 border-b border-gray-100 flex items-center justify-between">
              <span className="font-semibold text-sm text-brand-shaft">Outreach Detail</span>
              <button onClick={() => setSelectedRecord(null)} className="text-gray-400 hover:text-brand-shaft">
                <span className="text-xs">✕</span>
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-indigo to-brand-light flex items-center justify-center text-white font-bold text-sm">
                  {selectedRecord.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="font-semibold text-brand-shaft">{selectedRecord.name}</div>
                  <div className="text-xs text-gray-400 capitalize">{selectedRecord.channel} · {selectedRecord.time}</div>
                </div>
              </div>

              {(() => {
                const cfg = statusConfig[selectedRecord.status]
                const Icon = cfg.icon
                return (
                  <div className={`pill text-[10px] ${cfg.color}`}>
                    <Icon size={9} />
                    {cfg.label}
                  </div>
                )
              })()}

              {selectedRecord.subject && (
                <div className="bg-[#F8F9FC] rounded-xl p-3">
                  <div className="text-[10px] text-gray-400 mb-1">Subject</div>
                  <div className="text-xs font-medium text-brand-shaft">{selectedRecord.subject}</div>
                </div>
              )}

              {selectedRecord.preview && (
                <div className="bg-[#F8F9FC] rounded-xl p-3">
                  <div className="text-[10px] text-gray-400 mb-1">Preview</div>
                  <div className="text-xs text-gray-600">{selectedRecord.preview}</div>
                </div>
              )}

              <div className="space-y-2">
                <div className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Timeline</div>
                {[
                  { event: 'Outreach initiated by Comms', t: '4h ago' },
                  { event: selectedRecord.channel === 'email' ? 'Email delivered' : selectedRecord.channel === 'sms' ? 'SMS sent' : 'Call placed', t: '4h ago' },
                  ...(selectedRecord.status === 'opened' || selectedRecord.status === 'replied' ? [{ event: 'Opened link / viewed', t: '2h ago' }] : []),
                  ...(selectedRecord.status === 'replied' ? [{ event: 'Participant responded', t: selectedRecord.time }] : []),
                ].map((ev, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-indigo shrink-0" />
                    <span className="text-gray-500 flex-1">{ev.event}</span>
                    <span className="text-gray-300">{ev.t}</span>
                  </div>
                ))}
              </div>

              {(selectedRecord.status === 'sent' || selectedRecord.status === 'opened') && (
                <button className="btn-secondary w-full justify-center text-xs py-2">
                  <Send size={11} /> Send follow-up
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <PrototypeBanner title="Classic Channels" description="Click records for detail" />
    </div>
  )
}
