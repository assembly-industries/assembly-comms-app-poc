import { FileText, Search, ClipboardCheck, Gamepad2, CalendarDays } from 'lucide-react'

interface UseCase {
  icon: React.ElementType
  category: string
  color: string
  bg: string
  border: string
  title: string
  description: string
  examples: string[]
}

const useCases: UseCase[] = [
  {
    icon: FileText,
    category: 'Collect',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    title: 'Collect Information, Documents & Signatures',
    description:
      'Gather structured data, documents, compliance certifications, e-signatures, and intake forms from any group of people — at any scale.',
    examples: [
      'Vendor W-9s, insurance certs, NDAs',
      'New hire paperwork and onboarding docs',
      'Compliance attestations and policy sign-offs',
      'Client intake information before kickoff',
      'Benefits enrollment selections',
      'Work order scheduling and availability',
    ],
  },
  {
    icon: Search,
    category: 'Review',
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    border: 'border-violet-100',
    title: 'Review & Present Material',
    description:
      'Walk recipients through training content, presentations, policies, or proposals — with comprehension checks to verify understanding, not just clicks.',
    examples: [
      'Product training with explain-back checks',
      'Policy acknowledgment with comprehension',
      'Benefits plan walkthroughs',
      'Sales pitch and product demos',
      'Onboarding material delivery',
      'Regulatory procedure walkthroughs',
    ],
  },
  {
    icon: ClipboardCheck,
    category: 'Test',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
    title: 'Test & Interview',
    description:
      'Run structured assessments, behavioral interviews, technical screens, language proficiency tests, or customer research — consistently and at scale.',
    examples: [
      'Candidate pre-screening with STAR rubric',
      'Technical interviews with depth probing',
      'Compliance document verification',
      'Language proficiency assessment',
      'Customer feedback and product research',
      'Lead qualification conversations',
    ],
  },
  {
    icon: Gamepad2,
    category: 'Train',
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    border: 'border-orange-100',
    title: 'Train Through Role Play',
    description:
      'Put your team into realistic scenarios — customer support, sales calls, difficult conversations. AI plays the other party, then debrifs with structured feedback.',
    examples: [
      'Sales pitch practice with objection handling',
      'Customer de-escalation simulations',
      'Interview preparation coaching',
      'Manager conversation practice',
      'Compliance scenario walkthroughs',
      'New hire onboarding role plays',
    ],
  },
  {
    icon: CalendarDays,
    category: 'Schedule',
    color: 'text-pink-600',
    bg: 'bg-pink-50',
    border: 'border-pink-100',
    title: 'Schedule & Coordinate',
    description:
      'Collect availability, confirm shifts, negotiate work orders, and schedule conversations or meetings — without the back-and-forth.',
    examples: [
      'Work order availability intake',
      'Interview scheduling with candidates',
      'Meeting prep and coordination',
      'Team standup check-ins',
      'Employee 1:1 pulse conversations',
      'Client kickoff scheduling and agenda',
    ],
  },
]

export function UseCases() {
  return (
    <section id="use-cases" className="py-24 bg-gray-50 grid-bg">
      <div className="section-container">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="tag bg-brand-ghost text-brand-blue">Use Cases</div>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-brand-dark">
            Five ways to work<br />
            <span className="gradient-text">with any human.</span>
          </h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Every kind of structured communication — handled end to end by Comms.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {useCases.map(uc => {
            const Icon = uc.icon
            return (
              <div
                key={uc.category}
                className={`card border ${uc.border} hover:border-brand-light group transition-all duration-200 hover:-translate-y-1`}
              >
                {/* Icon + Category */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl ${uc.bg} flex items-center justify-center`}>
                    <Icon size={18} className={uc.color} />
                  </div>
                  <span className={`tag ${uc.bg} ${uc.color} font-bold`}>{uc.category}</span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-brand-dark mb-2 leading-snug">
                  {uc.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-500 leading-relaxed mb-5">
                  {uc.description}
                </p>

                {/* Example list */}
                <ul className="space-y-2">
                  {uc.examples.map(ex => (
                    <li key={ex} className="flex items-start gap-2 text-xs text-gray-600">
                      <div className={`w-1.5 h-1.5 rounded-full ${uc.bg.replace('50', '400')} mt-1.5 shrink-0`} />
                      {ex}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}

          {/* "Your use case" filler card */}
          <div className="card border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center gap-3 min-h-[280px] hover:border-brand-light transition-colors cursor-pointer group">
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center group-hover:bg-brand-ghost transition-colors">
              <span className="text-2xl text-gray-400 group-hover:text-brand-blue leading-none">+</span>
            </div>
            <div>
              <div className="font-semibold text-gray-400 group-hover:text-brand-blue transition-colors">Any structured conversation</div>
              <div className="text-xs text-gray-300 mt-1">If it involves working with humans, Comms can handle it.</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
