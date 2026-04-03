import { useState, useRef, useEffect, useCallback } from 'react'
import {
  Microphone, Check, ArrowRight, FileText, WaveTriangle, PenNib,
  Sparkle, ShieldCheck, Lock, UploadSimple, CheckCircle, CaretDown,
  PaperPlaneRight, Circle, ChatTeardropText,
} from '@phosphor-icons/react'
import { Nav } from '../components/Nav'
import { PrototypeBanner } from '../components/shared/PrototypeBanner'

/* ─── Types ─── */
type StepType = 'structured' | 'freeform'
type ComponentType = 'consent' | 'form' | 'choice' | 'upload' | 'sign' | 'confirm'
interface FormField { key: string; label: string; placeholder?: string; type?: string; options?: string[]; required?: boolean }
interface Choice { key: string; label: string; description?: string }
interface ChatMessage { id: string; role: 'agent' | 'user'; text: string }

interface Step {
  id: string
  title: string             // short label for sidebar
  section: string
  sectionColor: string
  agentMessage: string      // prominent opening question
  stepType: StepType
  componentType?: ComponentType
  fields?: FormField[]
  choices?: Choice[]
  consentItems?: string[]
  uploadHint?: string
  acceptedTypes?: string
  docTitle?: string
  docText?: string
  required?: boolean        // whether step must be done to submit (default true)
  skipIf?: (answers: Record<string, any>) => boolean
  /** Response to chat input. For structured: clarification only. For freeform: advance if true. */
  respond: (input: string) => { text: string; advance: boolean }
}

/* ─── Steps ─── */
const STEPS: Step[] = [
  {
    id: 'consent',
    title: 'Consent',
    section: 'Introduction',
    sectionColor: 'bg-blue-50 text-blue-700',
    agentMessage: "Hi there! I'm Comms, Harbor Health's onboarding assistant. Before we start, please review and accept these two items. Any questions about what you're signing up for?",
    stepType: 'structured',
    componentType: 'consent',
    consentItems: [
      "I consent to Harbor Health collecting and securely storing the information I provide in this session for vendor compliance and payment purposes.",
      "I understand this session is conducted by an AI assistant and a Harbor Health team member will review my completed submission.",
    ],
    respond: (input) => {
      const l = input.toLowerCase()
      if (l.includes('data') || l.includes('secur') || l.includes('privac') || l.includes('store')) {
        return { text: "Your data is encrypted at rest and in transit. Only authorised Harbor Health procurement staff can access your submission. It complies with SOC 2 Type II.", advance: false }
      }
      if (l.includes('long') || l.includes('time') || l.includes('minute')) {
        return { text: "About 12 minutes across 13 steps -- identity, tax info, documents, payment setup, and an NDA. You can pause and come back at any time.", advance: false }
      }
      return { text: "Happy to answer any questions before we begin. Otherwise, check both boxes below and hit 'I agree & continue'.", advance: false }
    },
  },
  {
    id: 'service-description',
    title: 'Service description',
    section: 'Introduction',
    sectionColor: 'bg-blue-50 text-blue-700',
    agentMessage: "Before we get into the details -- briefly describe the services you'll be providing to Harbor Health. A sentence or two is plenty.",
    stepType: 'freeform',
    respond: (input) => {
      const words = input.trim().split(/\s+/).filter(Boolean).length
      if (words >= 4) {
        return { text: "Got it -- I've noted that for Harbor Health's records. Let's move on.", advance: true }
      }
      return { text: "Could you share a bit more? What type of work specifically -- even one clear sentence helps.", advance: false }
    },
  },
  {
    id: 'name',
    title: 'Legal name',
    section: 'Identity & Entity',
    sectionColor: 'bg-violet-50 text-violet-700',
    agentMessage: "What is your legal name as it should appear on your W-9 and all vendor documentation? Use your full legal name exactly as on your government-issued ID.",
    stepType: 'structured',
    componentType: 'form',
    fields: [
      { key: 'firstName', label: 'First name', placeholder: 'Alexandra', required: true },
      { key: 'lastName', label: 'Last name', placeholder: 'Torres', required: true },
      { key: 'entityName', label: 'Business / entity name (optional)', placeholder: 'Leave blank if sole proprietor' },
    ],
    respond: (input) => {
      const l = input.toLowerCase()
      if (l.includes('dba') || l.includes('doing business')) return { text: "If you operate under a DBA, enter your legal name in the name fields and put the DBA name in 'Business / entity name'.", advance: false }
      if (l.includes('middle') || l.includes('initial')) return { text: "Middle names or initials are optional here -- use your legal first and last name as on your ID.", advance: false }
      return { text: "Use the form above to enter your legal first name, last name, and optionally your business entity name.", advance: false }
    },
  },
  {
    id: 'entityType',
    title: 'Entity type',
    section: 'Identity & Entity',
    sectionColor: 'bg-violet-50 text-violet-700',
    agentMessage: "What type of business entity are you operating as? This determines your W-9 tax classification.",
    stepType: 'structured',
    componentType: 'choice',
    choices: [
      { key: 'individual', label: 'Individual / Sole Proprietor', description: 'You work under your own name -- no separate business entity' },
      { key: 'llc-single', label: 'Single-Member LLC', description: 'LLC with one owner' },
      { key: 'llc-multi', label: 'Multi-Member LLC', description: 'LLC with multiple owners' },
      { key: 'scorp', label: 'S-Corporation', description: 'Incorporated S-Corp' },
      { key: 'ccorp', label: 'C-Corporation', description: 'Incorporated C-Corp' },
    ],
    respond: (input) => {
      const l = input.toLowerCase()
      if (l.includes('differ') || l.includes('not sure') || l.includes('what')) {
        return { text: "If you work as a person without a registered company, pick 'Individual'. If you have a registered LLC or Corp, pick that. The tax classification only affects what box is checked on the W-9.", advance: false }
      }
      if (l.includes('partner')) return { text: "Partnerships aren't listed here -- please select the closest match or describe your entity type in a note below.", advance: false }
      return { text: "Select your entity type using the buttons above. If you're unsure, 'Individual / Sole Proprietor' is the most common for independent contractors.", advance: false }
    },
  },
  {
    id: 'contact',
    title: 'Contact info',
    section: 'Contact Info',
    sectionColor: 'bg-indigo-50 text-indigo-700',
    agentMessage: "What's the best email and phone number to reach you for this engagement? These will be used for invoice notifications and onboarding follow-ups.",
    stepType: 'structured',
    componentType: 'form',
    fields: [
      { key: 'email', label: 'Email address', placeholder: 'you@company.com', type: 'email', required: true },
      { key: 'phone', label: 'Phone number', placeholder: '(555) 123-4567', type: 'tel', required: true },
    ],
    respond: (input) => {
      const l = input.toLowerCase()
      if (l.includes('personal') || l.includes('work') || l.includes('which')) return { text: "Either personal or work email is fine -- use whichever you'll check most reliably.", advance: false }
      if (l.includes('sms') || l.includes('text')) return { text: "The phone number is used for SMS notifications when invoices are approved. A mobile number works best.", advance: false }
      return { text: "Enter your email and phone using the form above.", advance: false }
    },
  },
  {
    id: 'address',
    title: 'Business address',
    section: 'Contact Info',
    sectionColor: 'bg-indigo-50 text-indigo-700',
    agentMessage: "What is your business address? This will appear on your W-9 -- street, city, state, and ZIP all required.",
    stepType: 'structured',
    componentType: 'form',
    fields: [
      { key: 'street', label: 'Street address', placeholder: '1234 Main St', required: true },
      { key: 'city', label: 'City', placeholder: 'Austin', required: true },
      { key: 'state', label: 'State', placeholder: 'TX', required: true },
      { key: 'zip', label: 'ZIP code', placeholder: '78701', required: true },
    ],
    respond: (input) => {
      const l = input.toLowerCase()
      if (l.includes('po box')) return { text: "The IRS requires a physical address on the W-9 -- PO boxes aren't accepted here. Do you have a street address you can use?", advance: false }
      if (l.includes('home') || l.includes('residential')) return { text: "A home address is fine -- sole proprietors commonly use their residential address on the W-9.", advance: false }
      return { text: "Fill in the street address, city, state, and ZIP in the form above.", advance: false }
    },
  },
  {
    id: 'workAuth',
    title: 'Work authorization',
    section: 'Tax & Compliance',
    sectionColor: 'bg-orange-50 text-orange-700',
    agentMessage: "Are you legally authorized to perform work in the United States? This includes US citizens, permanent residents, and valid work visa holders.",
    stepType: 'structured',
    componentType: 'choice',
    choices: [
      { key: 'yes', label: 'Yes, I am authorized', description: 'US citizen, green card holder, or valid work visa' },
      { key: 'no', label: 'No', description: 'I am not currently authorized to work in the US' },
    ],
    respond: (input) => {
      const l = input.toLowerCase()
      if (l.includes('visa') || l.includes('h1b') || l.includes('h-1b') || l.includes('opt')) return { text: "Valid work visas -- including H-1B, OPT, TN, and others -- count as authorized. Select 'Yes' if your visa permits independent contractor work.", advance: false }
      if (l.includes('what happen') || l.includes('if no')) return { text: "If you select 'No', Harbor Health's procurement team will be notified to follow up directly. Depending on the situation, there may still be options.", advance: false }
      return { text: "Use the buttons above to confirm. If you're unsure about your status, please consult your visa documentation before answering.", advance: false }
    },
  },
  {
    id: 'taxId',
    title: 'Tax ID',
    section: 'Tax & Compliance',
    sectionColor: 'bg-orange-50 text-orange-700',
    agentMessage: "Please provide your Tax Identification Number. For individuals this is your SSN; for business entities use your EIN. It's encrypted with AES-256 -- only the last 4 digits are ever displayed.",
    stepType: 'structured',
    componentType: 'form',
    fields: [
      { key: 'taxIdType', label: 'ID type', type: 'select', options: ['SSN (Social Security Number)', 'EIN (Employer Identification Number)'], required: true },
      { key: 'taxId', label: 'Tax ID number', placeholder: 'XXX-XX-XXXX', type: 'password', required: true },
    ],
    respond: (input) => {
      const l = input.toLowerCase()
      if (l.includes('ssn') || l.includes('ein') || l.includes('differ')) return { text: "SSN is a 9-digit number assigned to individuals (format: XXX-XX-XXXX). EIN is assigned to businesses (format: XX-XXXXXXX). Use whichever matches your entity type.", advance: false }
      if (l.includes('safe') || l.includes('secur') || l.includes('encrypt')) return { text: "Your TIN is encrypted with AES-256 before storage. Harbor Health only retains the last 4 digits for display; the full number is never logged in plain text.", advance: false }
      return { text: "Select SSN or EIN from the dropdown and enter your number in the field -- it's masked as you type.", advance: false }
    },
  },
  {
    id: 'compliance-info',
    title: 'Compliance & certs',
    section: 'Tax & Compliance',
    sectionColor: 'bg-orange-50 text-orange-700',
    agentMessage: "Do you hold any compliance certifications relevant to working with healthcare data -- for example HIPAA compliance, SOC 2, ISO 27001, or a BAA? Type 'None' if not applicable.",
    stepType: 'freeform',
    respond: (input) => {
      const l = input.toLowerCase()
      if (l.includes('none') || l.includes('no') || l.includes('n/a') || l.includes('not applicable')) {
        return { text: "Noted -- no certifications on file. Moving on.", advance: true }
      }
      const words = input.trim().split(/\s+/).filter(Boolean).length
      if (words >= 2) {
        return { text: "Great -- I've noted your certifications for Harbor Health's records.", advance: true }
      }
      return { text: "Could you briefly name them? e.g. 'SOC 2 Type II, HIPAA compliant'. Or just type 'None' if not applicable.", advance: false }
    },
  },
  {
    id: 'w9',
    title: 'W-9 upload',
    section: 'Documents',
    sectionColor: 'bg-green-50 text-green-700',
    agentMessage: "Please upload your completed W-9 form. We accept PDF or image. If you need one, download a blank W-9 from IRS.gov, fill it out, and upload here.",
    stepType: 'structured',
    componentType: 'upload',
    uploadHint: 'PDF or image (JPG, PNG) · max 10 MB',
    acceptedTypes: '.pdf,.jpg,.jpeg,.png',
    respond: (input) => {
      const l = input.toLowerCase()
      if (l.includes('where') || l.includes('find') || l.includes('download') || l.includes('blank') || l.includes('irs')) {
        return { text: "Go to IRS.gov and search 'Form W-9' -- download the current-year PDF, fill in name, address, entity type, and TIN, sign it, and upload here. Takes about 3 minutes.", advance: false }
      }
      if (l.includes("don't have") || l.includes('not have') || l.includes('no w')) {
        return { text: "No problem -- IRS.gov has a free blank W-9 PDF. Complete and sign it (you can use a PDF editor or print and scan), then upload here.", advance: false }
      }
      return { text: "Use the upload area above to attach your completed W-9. PDF or image, max 10 MB.", advance: false }
    },
  },
  {
    id: 'coi',
    title: 'COI upload',
    section: 'Documents',
    sectionColor: 'bg-green-50 text-green-700',
    agentMessage: "Please upload your Certificate of Insurance (COI). Harbor Health requires general liability of at least $1M per occurrence and $2M aggregate, with Harbor Health listed as an additional insured.",
    stepType: 'structured',
    componentType: 'upload',
    uploadHint: 'PDF or image · max 10 MB',
    acceptedTypes: '.pdf,.jpg,.jpeg,.png',
    respond: (input) => {
      const l = input.toLowerCase()
      if (l.includes('additional insured') || l.includes('how to add') || l.includes('endorsement')) {
        return { text: "Contact your insurance broker and request an 'Additional Insured Endorsement' naming Harbor Health, Inc. at 1234 Health Pkwy, San Francisco, CA 94105. They can usually email an updated certificate within a few hours.", advance: false }
      }
      if (l.includes('how much') || l.includes('limit') || l.includes('minimum') || l.includes('require')) {
        return { text: "Minimum: $1,000,000 per occurrence and $2,000,000 aggregate, general liability. Harbor Health must be listed as additional insured. Workers comp and professional liability may also be required depending on scope.", advance: false }
      }
      if (l.includes("don't have") || l.includes('no insurance') || l.includes('no coi')) {
        return { text: "You'll need a COI before Harbor Health can approve you. Next Insurance or Hiscox can often issue a policy and certificate within 24 hours. Once you have it, come back and upload here.", advance: false }
      }
      return { text: "Upload your COI above. Questions about the coverage requirements or how to add Harbor Health as additional insured? Just ask.", advance: false }
    },
  },
  {
    id: 'coiDetails',
    title: 'COI details',
    section: 'Documents',
    sectionColor: 'bg-green-50 text-green-700',
    agentMessage: "A few details from your COI so I can cross-check the coverage. All of these are on the first page of the certificate.",
    stepType: 'structured',
    componentType: 'form',
    fields: [
      { key: 'insurer', label: 'Insurance carrier', placeholder: 'e.g. Travelers, Chubb, Hartford', required: true },
      { key: 'policyNum', label: 'Policy number', placeholder: 'e.g. GL-2024-001234', required: true },
      { key: 'expiry', label: 'Expiration date', placeholder: 'MM/DD/YYYY', required: true },
      { key: 'perOcc', label: 'Per occurrence limit', placeholder: 'e.g. $1,000,000', required: true },
    ],
    respond: (input) => {
      const l = input.toLowerCase()
      if (l.includes('where') || l.includes('find') || l.includes('which page') || l.includes('look')) {
        return { text: "All four fields are on page 1 of your COI. The carrier name is top-left. Policy number is in the certificate section. Expiry is in the coverage table. Per-occurrence limit is under 'General Liability'.", advance: false }
      }
      return { text: "Fill in the four fields above -- carrier, policy number, expiration date, and per-occurrence limit. All are on the front of your COI.", advance: false }
    },
  },
  {
    id: 'payment',
    title: 'Payment method',
    section: 'Payment Setup',
    sectionColor: 'bg-pink-50 text-pink-700',
    agentMessage: "How would you like to receive payment from Harbor Health? ACH typically arrives in 2 business days; checks take 5 to 7 days.",
    stepType: 'structured',
    componentType: 'choice',
    choices: [
      { key: 'ach', label: 'ACH Direct Deposit', description: 'Deposited to your bank -- 2 business days after approval' },
      { key: 'check', label: 'Physical Check', description: 'Mailed to your business address -- 5 to 7 business days' },
    ],
    respond: (input) => {
      const l = input.toLowerCase()
      if (l.includes('international') || l.includes('wire') || l.includes('swift')) return { text: "International wire is not available through this onboarding flow. Please contact Harbor Health's AP team directly for international payment arrangements.", advance: false }
      if (l.includes('both') || l.includes('switch')) return { text: "You can update your payment preference later by contacting Harbor Health's AP team. For now, please select your preferred method above.", advance: false }
      return { text: "Use the buttons above to choose ACH direct deposit or physical check.", advance: false }
    },
  },
  {
    id: 'banking',
    title: 'Banking details',
    section: 'Payment Setup',
    sectionColor: 'bg-pink-50 text-pink-700',
    agentMessage: "Please provide your banking details for ACH direct deposit. Encrypted in transit and at rest -- Harbor Health uses bank-grade secure connections.",
    stepType: 'structured',
    componentType: 'form',
    skipIf: (ans) => ans['payment'] === 'check',
    fields: [
      { key: 'bankName', label: 'Bank name', placeholder: 'e.g. Chase, Bank of America', required: true },
      { key: 'acctType', label: 'Account type', type: 'select', options: ['Checking', 'Savings', 'Business Checking', 'Business Savings'], required: true },
      { key: 'routing', label: 'Routing number (9 digits)', placeholder: '021000021', required: true },
      { key: 'account', label: 'Account number', placeholder: 'Your account number', type: 'password', required: true },
    ],
    respond: (input) => {
      const l = input.toLowerCase()
      if (l.includes('routing') || l.includes('where') || l.includes('find')) {
        return { text: "Your routing number is the 9-digit number on the bottom-left of a check. Account number follows it. Both are also in your bank's mobile app under account details.", advance: false }
      }
      if (l.includes('secur') || l.includes('safe') || l.includes('encrypt')) {
        return { text: "Banking details are encrypted with AES-256 before storage. Harbor Health processes ACH through a PCI-compliant payment processor and never stores full account numbers.", advance: false }
      }
      return { text: "Fill in the four fields above -- bank name, account type, routing number, and account number.", advance: false }
    },
  },
  {
    id: 'nda',
    title: 'NDA signature',
    section: 'Agreement',
    sectionColor: 'bg-red-50 text-red-700',
    agentMessage: "Almost done -- please review the Non-Disclosure Agreement and add your electronic signature. Scroll through the full document, then type your legal name to sign.",
    stepType: 'structured',
    componentType: 'sign',
    docTitle: 'Non-Disclosure Agreement -- Harbor Health, Inc.',
    docText: `This Non-Disclosure Agreement ("Agreement") is entered into between Harbor Health, Inc. ("Company") and the vendor identified in this onboarding session ("Vendor").\n\n1. CONFIDENTIAL INFORMATION. Vendor agrees to hold in strictest confidence all confidential and proprietary information of the Company, including but not limited to patient data, business strategies, financial information, operational procedures, and any information designated as confidential.\n\n2. NON-DISCLOSURE. Vendor shall not, without prior written consent of the Company, directly or indirectly disclose, use, copy, publish, summarize, or remove from Company premises any Confidential Information.\n\n3. TERM. This Agreement shall remain in effect for three (3) years from the date of signing, or the duration of the vendor engagement, whichever is longer.\n\n4. RETURN OF INFORMATION. Upon termination or request, Vendor shall promptly return or destroy all Confidential Information in its possession.\n\n5. PERMITTED DISCLOSURES. Disclosure is permitted only where required by law, provided Vendor gives Company prompt written notice before disclosure.\n\n6. GOVERNING LAW. This Agreement is governed by the laws of the State of California.`,
    respond: (input) => {
      const l = input.toLowerCase()
      if (l.includes('plain') || l.includes('mean') || l.includes('explain') || l.includes('what does')) {
        return { text: "In plain terms: don't share Harbor Health's confidential info (patient data, business strategies, financials) with anyone outside the engagement, for 3 years. Standard for any vendor relationship.", advance: false }
      }
      if (l.includes('lawyer') || l.includes('attorney') || l.includes('review')) {
        return { text: "You're welcome to have your attorney review it before signing. Once ready, scroll through the full text and type your legal name in the signature field.", advance: false }
      }
      return { text: "Scroll through the full NDA text, then type your legal name in the field below it. The 'Sign & continue' button unlocks once you've read it.", advance: false }
    },
  },
  {
    id: 'done',
    title: 'Complete',
    section: 'Complete',
    sectionColor: 'bg-emerald-50 text-emerald-700',
    agentMessage: "You're all done! Your onboarding package has been submitted to Harbor Health's vendor team. Confirmation email is on its way -- they'll be in touch within 2 business days.",
    stepType: 'structured',
    componentType: 'confirm',
    required: false,
    respond: () => ({ text: "Your submission is in! The Harbor Health vendor team will review and reach out within 2 business days.", advance: false }),
  },
]

/* ─── Sub-components ─── */
function ConsentComponent({ items, onAccept }: { items: string[]; onAccept: () => void }) {
  const [checked, setChecked] = useState(items.map(() => false))
  const allChecked = checked.every(Boolean)
  return (
    <div className="space-y-3.5">
      {items.map((item, i) => (
        <button key={i} type="button" onClick={() => setChecked(prev => prev.map((v, j) => j === i ? !v : v))}
          className="flex gap-3 text-left w-full group cursor-pointer">
          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${checked[i] ? 'bg-brand-indigo border-brand-indigo' : 'border-gray-300 group-hover:border-brand-indigo/50'}`}>
            {checked[i] && <Check size={11} weight="bold" className="text-white" />}
          </div>
          <span className="text-sm text-gray-700 leading-relaxed">{item}</span>
        </button>
      ))}
      <button disabled={!allChecked} onClick={onAccept}
        className="mt-4 btn-primary w-full justify-center py-3 text-sm font-bold disabled:opacity-30">
        I agree & continue <ArrowRight size={15} weight="bold" />
      </button>
    </div>
  )
}

function FormComponent({ fields, onSubmit }: { fields: FormField[]; onSubmit: (vals: Record<string, string>, summary: string) => void }) {
  const [values, setValues] = useState<Record<string, string>>(() => Object.fromEntries(fields.map(f => [f.key, ''])))
  const allRequired = fields.filter(f => f.required).every(f => values[f.key]?.trim())
  function handleSubmit() {
    const summary = fields.filter(f => values[f.key]?.trim()).map(f => f.type === 'password' ? `${f.label}: ••••••` : `${f.label}: ${values[f.key]}`).join(' · ')
    onSubmit(values, summary || 'Provided')
  }
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {fields.map(f => (
          <div key={f.key} className={f.key === 'street' || f.key === 'taxId' || f.key === 'account' || f.key === 'routing' || fields.length === 1 ? 'sm:col-span-2' : ''}>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">{f.label}{f.required && <span className="text-red-400 ml-0.5">*</span>}</label>
            {f.type === 'select' ? (
              <select value={values[f.key]} onChange={e => setValues(p => ({ ...p, [f.key]: e.target.value }))}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 bg-white text-gray-900 outline-none focus:border-brand-indigo/50 focus:ring-2 focus:ring-brand-indigo/10 appearance-none" style={{ boxShadow: 'none' }}>
                <option value="">Select...</option>
                {f.options?.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            ) : (
              <input type={f.type ?? 'text'} value={values[f.key]} onChange={e => setValues(p => ({ ...p, [f.key]: e.target.value }))}
                onKeyDown={e => { if (e.key === 'Enter' && allRequired) handleSubmit() }}
                placeholder={f.placeholder}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 outline-none focus:border-brand-indigo/50 focus:ring-2 focus:ring-brand-indigo/10" style={{ boxShadow: 'none' }} />
            )}
          </div>
        ))}
      </div>
      <button disabled={!allRequired} onClick={handleSubmit} className="btn-primary w-full justify-center py-3 text-sm font-bold disabled:opacity-30">
        Continue <ArrowRight size={14} weight="bold" />
      </button>
    </div>
  )
}

function ChoiceComponent({ choices, onSelect }: { choices: Choice[]; onSelect: (key: string, label: string) => void }) {
  const [selected, setSelected] = useState<string | null>(null)
  const isBinary = choices.length === 2
  function pick(key: string, label: string) { setSelected(key); if (isBinary) setTimeout(() => onSelect(key, label), 200) }
  return (
    <div className="space-y-2.5">
      <div className={`grid gap-2 ${isBinary ? 'grid-cols-2' : 'grid-cols-1'}`}>
        {choices.map(c => (
          <button key={c.key} type="button" onClick={() => pick(c.key, c.label)}
            className={`text-left px-4 py-3 rounded-2xl border-2 transition-all ${selected === c.key ? 'border-brand-indigo bg-brand-ghost shadow-sm' : 'border-gray-200 bg-white hover:border-brand-indigo/40 hover:bg-brand-ghost/30'}`}>
            <div className="flex items-start gap-2.5">
              <div className={`mt-0.5 w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors ${selected === c.key ? 'border-brand-indigo bg-brand-indigo' : 'border-gray-300'}`}>
                {selected === c.key && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
              <div>
                <div className={`text-sm font-semibold ${selected === c.key ? 'text-brand-indigo' : 'text-gray-900'}`}>{c.label}</div>
                {c.description && <p className="text-xs text-gray-500 mt-0.5 leading-snug">{c.description}</p>}
              </div>
            </div>
          </button>
        ))}
      </div>
      {!isBinary && (
        <button disabled={!selected} onClick={() => { const c = choices.find(x => x.key === selected)!; onSelect(selected!, c.label) }}
          className="btn-primary w-full justify-center py-3 text-sm font-bold disabled:opacity-30">
          Continue <ArrowRight size={14} weight="bold" />
        </button>
      )}
    </div>
  )
}

function UploadComponent({ hint, accept, onSubmit }: { hint?: string; accept?: string; onSubmit: (name: string) => void }) {
  const [file, setFile] = useState<File | null>(null)
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  return (
    <div className="space-y-3">
      <div onDragOver={e => { e.preventDefault(); setDragging(true) }} onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) setFile(f) }}
        onClick={() => inputRef.current?.click()}
        className={`rounded-2xl border-2 border-dashed px-6 py-7 text-center cursor-pointer transition-colors ${dragging ? 'border-brand-indigo bg-brand-ghost' : file ? 'border-green-400 bg-green-50' : 'border-gray-200 bg-gray-50 hover:border-brand-indigo/40 hover:bg-brand-ghost/30'}`}>
        <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) setFile(f) }} />
        {file ? (
          <><CheckCircle size={26} weight="duotone" className="mx-auto text-green-500 mb-2" />
            <div className="font-semibold text-gray-900 text-sm">{file.name}</div>
            <div className="text-xs text-gray-400 mt-0.5">{(file.size / 1024).toFixed(0)} KB · Click to replace</div></>
        ) : (
          <><UploadSimple size={26} weight="duotone" className="mx-auto text-gray-400 mb-2" />
            <div className="font-semibold text-gray-700 text-sm">Drop file here or click to browse</div>
            {hint && <div className="text-xs text-gray-400 mt-0.5">{hint}</div>}</>
        )}
      </div>
      <button disabled={!file} onClick={() => onSubmit(file!.name)}
        className="btn-primary w-full justify-center py-3 text-sm font-bold disabled:opacity-30">
        Continue <ArrowRight size={14} weight="bold" />
      </button>
    </div>
  )
}

function SignComponent({ docText, onSign }: { docTitle: string; docText: string; onSign: (name: string) => void }) {
  const [name, setName] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const docRef = useRef<HTMLDivElement>(null)
  return (
    <div className="space-y-3">
      <div ref={docRef} onScroll={() => { const el = docRef.current!; if (el.scrollTop + el.clientHeight >= el.scrollHeight - 20) setScrolled(true) }}
        className="bg-gray-50 border border-gray-200 rounded-xl p-4 max-h-40 overflow-y-auto text-xs text-gray-600 leading-relaxed whitespace-pre-wrap font-mono">
        {docText}
      </div>
      {!scrolled && (
        <div className="flex items-center gap-1.5 text-xs text-gray-400 px-1">
          <CaretDown size={11} className="animate-bounce" /> Scroll to read the full agreement
        </div>
      )}
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1.5"><PenNib size={12} className="inline mr-1 text-brand-indigo" />Type your full legal name to sign</label>
        <input type="text" value={name} onChange={e => setName(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && name.trim() && scrolled) onSign(name.trim()) }}
          placeholder="Full legal name"
          className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 outline-none focus:border-brand-indigo/50 focus:ring-2 focus:ring-brand-indigo/10"
          style={{ boxShadow: 'none', fontFamily: '"Caveat", cursive' }} />
        {name && (
          <div className="mt-1.5 px-3 py-2 bg-brand-ghost rounded-lg flex items-center gap-2">
            <Check size={11} className="text-brand-indigo" />
            <span className="text-xs text-brand-shaft">Signature: <span style={{ fontFamily: '"Caveat", cursive', fontSize: '1.1rem' }}>{name}</span></span>
          </div>
        )}
      </div>
      <button disabled={!name.trim() || !scrolled} onClick={() => onSign(name.trim())}
        className="btn-primary w-full justify-center py-3 text-sm font-bold disabled:opacity-30">
        Sign & continue <ArrowRight size={14} weight="bold" />
      </button>
    </div>
  )
}

function ConfirmComponent() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3.5">
        <CheckCircle size={24} weight="duotone" className="text-emerald-500 shrink-0" />
        <div>
          <div className="font-bold text-emerald-800 text-sm">Submission complete</div>
          <div className="text-xs text-emerald-700 mt-0.5">Reference: ONB-HH-2026-{Math.floor(Math.random() * 9000) + 1000}</div>
        </div>
      </div>
      {[
        { icon: ShieldCheck, label: 'Consent & work authorization' },
        { icon: FileText, label: 'Identity, entity type & contact details' },
        { icon: Lock, label: 'Tax ID (AES-256 encrypted)' },
        { icon: UploadSimple, label: 'W-9 form + Certificate of Insurance' },
        { icon: FileText, label: 'Payment setup (ACH or check)' },
        { icon: PenNib, label: 'NDA e-signed' },
      ].map(({ icon: Icon, label }) => (
        <div key={label} className="flex items-center gap-3 px-3.5 py-2.5 bg-white border border-gray-100 rounded-xl">
          <Icon size={14} weight="duotone" className="text-brand-indigo shrink-0" />
          <span className="text-sm text-gray-800 flex-1">{label}</span>
          <Check size={11} weight="bold" className="text-emerald-500" />
        </div>
      ))}
    </div>
  )
}

/* ─── Main page ─── */
export function AsyncPage() {
  const [activeIdx, setActiveIdx] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())
  const [stepAnswers, setStepAnswers] = useState<Record<string, { data: any; summary: string }>>({})
  const [stepConvos, setStepConvos] = useState<Record<string, ChatMessage[]>>({
    [STEPS[0].id]: [{ id: 'm0', role: 'agent', text: STEPS[0].agentMessage }],
  })
  const [chatInput, setChatInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const recognitionRef = useRef<any>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const step = STEPS[activeIdx]
  const convo = stepConvos[step.id] ?? [{ id: 'm0', role: 'agent', text: step.agentMessage }]
  const isCompleted = completedSteps.has(activeIdx)

  // Required steps (all except 'done')
  const requiredCount = STEPS.filter((s, _i) => {
    if (s.required === false) return false
    // skip steps that should be skipped based on current answers
    const ans: Record<string, any> = {}
    Object.entries(stepAnswers).forEach(([k, v]) => { ans[k] = v.data })
    return !s.skipIf?.(ans)
  }).length
  const allDone = STEPS.filter((s, i) => {
    if (s.required === false) return true
    return completedSteps.has(i)
  }).every(Boolean) && completedSteps.size >= requiredCount - 1

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [stepConvos, loading, activeIdx])

  function navigateTo(idx: number) {
    setActiveIdx(idx)
    setChatInput('')
    // Initialize conversation if first time
    setStepConvos(prev => {
      if (prev[STEPS[idx].id]) return prev
      return { ...prev, [STEPS[idx].id]: [{ id: `m0-${idx}`, role: 'agent', text: STEPS[idx].agentMessage }] }
    })
  }

  function advance(data: any, summary: string) {
    const stepId = step.id
    setStepAnswers(prev => ({ ...prev, [stepId]: { data, summary } }))
    setCompletedSteps(prev => new Set([...prev, activeIdx]))
    const newAnswers: Record<string, any> = { ...stepAnswers }
    STEPS.forEach((s, _i) => { if (stepAnswers[s.id]) newAnswers[s.id] = stepAnswers[s.id].data })
    newAnswers[stepId] = data
    let next = activeIdx + 1
    while (next < STEPS.length && STEPS[next].skipIf?.(newAnswers)) next++
    if (next < STEPS.length) {
      setTimeout(() => navigateTo(next), 300)
    }
  }

  function sendChat() {
    if (!chatInput.trim() || loading) return
    const stepId = step.id
    const userMsg: ChatMessage = { id: `u${Date.now()}`, role: 'user', text: chatInput.trim() }
    setStepConvos(prev => ({ ...prev, [stepId]: [...(prev[stepId] ?? []), userMsg] }))
    setChatInput('')
    setLoading(true)
    setTimeout(() => {
      const { text, advance: shouldAdvance } = step.respond(userMsg.text)
      const agentMsg: ChatMessage = { id: `ag${Date.now()}`, role: 'agent', text }
      setStepConvos(prev => ({ ...prev, [stepId]: [...(prev[stepId] ?? []), agentMsg] }))
      setLoading(false)
      // Only advance from chat for freeform steps
      if (step.stepType === 'freeform' && shouldAdvance) {
        setTimeout(() => advance(userMsg.text, userMsg.text.slice(0, 80)), 350)
      }
    }, 800)
  }

  /* ── Voice ── */
  const startVoice = useCallback(() => {
    const SR = (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition
    if (!SR) return
    const rec = new SR()
    rec.continuous = false
    rec.interimResults = true
    rec.onresult = (e: any) => {
      const t = Array.from(e.results as any[]).map((r: any) => r[0].transcript).join('')
      setChatInput(t)
    }
    rec.onend = () => setIsRecording(false)
    rec.start()
    recognitionRef.current = rec
    setIsRecording(true)
  }, [])
  const stopVoice = useCallback(() => { recognitionRef.current?.stop(); setIsRecording(false) }, [])
  const toggleVoice = useCallback(() => { if (isRecording) stopVoice(); else startVoice() }, [isRecording, startVoice, stopVoice])

  useEffect(() => {
    function onGlobalKey(e: KeyboardEvent) {
      if (e.code !== 'Space') return
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'SELECT' || tag === 'BUTTON') return
      if (tag === 'TEXTAREA') return
      e.preventDefault()
      textareaRef.current?.focus()
      if (!isRecording) startVoice(); else stopVoice()
    }
    document.addEventListener('keydown', onGlobalKey)
    return () => document.removeEventListener('keydown', onGlobalKey)
  }, [isRecording, startVoice, stopVoice])

  function renderComponent() {
    if (!step.componentType || step.componentType === 'confirm') return null
    if (isCompleted) return null // Don't re-render component for completed steps
    if (step.componentType === 'consent') return <ConsentComponent items={step.consentItems!} onAccept={() => advance('accepted', 'Accepted')} />
    if (step.componentType === 'form') return <FormComponent fields={step.fields!} onSubmit={(vals, summary) => advance(vals, summary)} />
    if (step.componentType === 'choice') return <ChoiceComponent choices={step.choices!} onSelect={(key, label) => advance(key, label)} />
    if (step.componentType === 'upload') return <UploadComponent hint={step.uploadHint} accept={step.acceptedTypes} onSubmit={name => advance({ file: name }, `Uploaded: ${name}`)} />
    if (step.componentType === 'sign') return <SignComponent docTitle={step.docTitle!} docText={step.docText!} onSign={name => advance({ signature: name }, `Signed by: ${name}`)} />
    return null
  }

  const progress = Math.round((completedSteps.size / (STEPS.filter(s => s.required !== false).length)) * 100)

  return (
    <div className="h-screen flex flex-col bg-[#F9FAFB]">
      <Nav />
      <div className="flex flex-1 min-h-0 overflow-hidden pt-14">

        {/* ── Sidebar ── */}
        <div className="w-56 app-sidebar flex flex-col shrink-0">
          {/* Session info */}
          <div className="px-4 pt-5 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-1.5 mb-1">
              <ChatTeardropText size={13} weight="duotone" className="text-brand-indigo" />
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Async session</span>
            </div>
            <div className="font-semibold text-gray-900 text-sm">Contractor Onboarding</div>
            <div className="text-xs text-gray-500 mt-0.5">Harbor Health, Inc.</div>
            <div className="mt-3">
              <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                <span>{completedSteps.size} of {STEPS.filter(s => s.required !== false).length} complete</span>
                <span>{progress}%</span>
              </div>
              <div className="h-1 bg-gray-100 rounded-full">
                <div className="h-full bg-brand-indigo rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>

          {/* Agenda */}
          <div className="flex-1 overflow-y-auto px-3 py-3">
            {STEPS.map((s, idx) => {
              const done = completedSteps.has(idx)
              const active = idx === activeIdx
              const skipped = s.skipIf?.({ ...Object.fromEntries(Object.entries(stepAnswers).map(([k, v]) => [k, v.data])) })
              if (skipped) return null
              return (
                <button key={s.id} onClick={() => navigateTo(idx)}
                  className={`w-full text-left flex items-start gap-2.5 px-3 py-2.5 rounded-xl mb-0.5 transition-colors ${active ? 'bg-brand-ghost' : 'hover:bg-white'}`}>
                  <div className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${done ? 'bg-green-100' : active ? 'border-2 border-brand-indigo' : 'bg-gray-100'}`}>
                    {done ? <Check size={8} weight="bold" className="text-green-600" />
                      : active ? <div className="w-1.5 h-1.5 rounded-full bg-brand-indigo" />
                        : <Circle size={8} className="text-gray-300" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-xs font-medium leading-snug truncate ${active ? 'text-brand-indigo' : done ? 'text-gray-400' : 'text-gray-600'}`}>{s.title}</div>
                    {done && stepAnswers[s.id] && (
                      <div className="text-[10px] text-gray-400 truncate mt-0.5">{stepAnswers[s.id].summary.slice(0, 28)}{stepAnswers[s.id].summary.length > 28 ? '...' : ''}</div>
                    )}
                  </div>
                  {s.stepType === 'freeform' && (
                    <span className="text-[9px] bg-orange-50 text-orange-500 px-1.5 py-0.5 rounded font-bold shrink-0 mt-0.5">Q&A</span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Submit */}
          <div className="px-4 pb-4 border-t border-gray-100 pt-3">
            <button disabled={!allDone} className="btn-primary w-full justify-center py-2.5 text-xs font-bold disabled:opacity-30">
              <Check size={12} weight="bold" /> Submit onboarding
            </button>
            {!allDone && <p className="text-[10px] text-gray-400 text-center mt-1.5">Complete all steps to submit</p>}
          </div>
        </div>

        {/* ── Main content ── */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white">

          {/* Step header */}
          <div className="shrink-0 border-b border-gray-100 px-6 py-3 flex items-center gap-3">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${step.sectionColor}`}>{step.section}</span>
            <span className="text-xs text-gray-400">Step {activeIdx + 1} of {STEPS.length}</span>
            {isCompleted && (
              <span className="ml-auto flex items-center gap-1.5 text-xs font-semibold text-green-600 bg-green-50 border border-green-100 rounded-full px-2.5 py-1">
                <Check size={10} weight="bold" /> Complete
              </span>
            )}
            {step.stepType === 'freeform' && !isCompleted && (
              <span className="ml-auto flex items-center gap-1.5 text-xs font-semibold text-orange-600 bg-orange-50 border border-orange-100 rounded-full px-2.5 py-1">
                <Sparkle size={10} weight="fill" /> Answer via chat
              </span>
            )}
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-2xl mx-auto px-6 py-7">

              {/* Prominent question */}
              <div className="flex items-start gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl bg-brand-indigo flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkle size={15} weight="fill" className="text-white" />
                </div>
                <p className="text-xl font-semibold text-gray-900 leading-snug pt-1.5">{step.agentMessage}</p>
              </div>

              {/* Completed answer display */}
              {isCompleted && stepAnswers[step.id] && (
                <div className="mb-6 bg-green-50 border border-green-200 rounded-2xl px-4 py-3.5">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Check size={13} weight="bold" className="text-green-600" />
                    <span className="text-xs font-bold text-green-700 uppercase tracking-wider">Your answer</span>
                  </div>
                  <p className="text-sm text-gray-800 leading-relaxed">{stepAnswers[step.id].summary}</p>
                </div>
              )}

              {/* Component (only for non-completed structured steps) */}
              {step.stepType === 'structured' && !isCompleted && renderComponent()}
              {step.stepType === 'structured' && !isCompleted && step.componentType === 'confirm' && <ConfirmComponent />}

              {/* Conversation thread (below component for structured, main content for freeform) */}
              {convo.length > 1 && (
                <div className={`${step.stepType === 'structured' && !isCompleted ? 'mt-6 border-t border-gray-100 pt-5' : 'mt-4'}`}>
                  {step.stepType === 'structured' && !isCompleted && (
                    <div className="text-xs text-gray-400 font-medium mb-3 uppercase tracking-wider">
                      Questions about this step
                    </div>
                  )}
                  <div className="space-y-3">
                    {convo.slice(1).map(m => (
                      <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {m.role === 'agent' && (
                          <div className="flex items-start gap-2 max-w-md">
                            <div className="w-6 h-6 rounded-lg bg-brand-indigo/10 flex items-center justify-center shrink-0 mt-0.5">
                              <Sparkle size={11} weight="fill" className="text-brand-indigo" />
                            </div>
                            <div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-tl-sm px-3.5 py-2.5 text-sm text-gray-700 leading-relaxed">{m.text}</div>
                          </div>
                        )}
                        {m.role === 'user' && (
                          <div className="bg-brand-indigo rounded-2xl rounded-tr-sm px-3.5 py-2.5 text-sm text-white leading-relaxed max-w-md">{m.text}</div>
                        )}
                      </div>
                    ))}
                    {loading && (
                      <div className="flex items-start gap-2">
                        <div className="w-6 h-6 rounded-lg bg-brand-indigo/10 flex items-center justify-center shrink-0">
                          <Sparkle size={11} weight="fill" className="text-brand-indigo" />
                        </div>
                        <div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-tl-sm px-3.5 py-2.5 flex items-center gap-1.5">
                          <div className="typing-dot w-1.5 h-1.5 rounded-full bg-gray-400" />
                          <div className="typing-dot w-1.5 h-1.5 rounded-full bg-gray-400" />
                          <div className="typing-dot w-1.5 h-1.5 rounded-full bg-gray-400" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          </div>

          {/* ── Persistent chat input ── */}
          <div className="shrink-0 border-t border-gray-100 bg-white px-6 py-3">
            <div className="max-w-2xl mx-auto">
              <div className={`flex items-end gap-2.5 rounded-2xl px-4 py-3 transition-colors ${isRecording ? 'bg-red-50 ring-2 ring-red-200' : 'bg-[#F3F4F6]'}`}>
                <button type="button" onClick={toggleVoice}
                  className={`shrink-0 p-1.5 rounded-xl transition-colors ${isRecording ? 'text-red-500 bg-red-100' : 'text-gray-400 hover:text-brand-indigo hover:bg-brand-ghost'}`}>
                  {isRecording ? <WaveTriangle size={15} weight="fill" className="animate-pulse" /> : <Microphone size={15} weight="light" />}
                </button>
                <textarea
                  ref={textareaRef}
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.code === 'Space' && !chatInput.trim()) { e.preventDefault(); toggleVoice(); return }
                    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChat() }
                  }}
                  placeholder={
                    isRecording ? 'Listening...'
                      : step.stepType === 'freeform'
                        ? 'Type your answer here... (Space to speak, Enter to send)'
                        : 'Ask a question about this step... (Space to speak)'
                  }
                  rows={1}
                  className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 resize-none leading-relaxed"
                  style={{ outline: 'none', boxShadow: 'none', minHeight: '1.25rem', maxHeight: '5rem' }}
                />
                <button onClick={sendChat} disabled={!chatInput.trim() || loading}
                  className="w-8 h-8 rounded-xl bg-brand-indigo disabled:opacity-40 flex items-center justify-center hover:bg-brand-mid transition-colors shrink-0">
                  <PaperPlaneRight size={13} className="text-white" />
                </button>
              </div>
              <div className="text-[10px] text-gray-400 mt-1.5 px-1">
                {step.stepType === 'freeform'
                  ? 'Your answer moves this step forward · Space to speak · Enter to send'
                  : 'Chat is for questions only -- use the form above to answer · Space to speak'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <PrototypeBanner
        title="Prototype: Async Conversation"
        description="Structured steps (form/upload) use components to answer. Q&A steps advance via chat. Agenda on left -- click any step."
      />
    </div>
  )
}
