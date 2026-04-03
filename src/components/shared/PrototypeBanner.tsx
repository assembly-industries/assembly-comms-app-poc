import { Link } from 'react-router-dom'
import { ArrowLeft, Lightning } from '@phosphor-icons/react'

interface PrototypeBannerProps {
  /** Short label, e.g. "Work Dispatcher" */
  title: string
  /** What this prototype demonstrates; keep concise for the docked bar */
  description: string
}

/**
 * Docked prototype strip — lives in normal layout flow so it never covers inputs.
 * (Older builds used position:fixed bottom-right, which overlapped the composer.)
 */
export function PrototypeBanner({ title, description }: PrototypeBannerProps) {
  return (
    <footer className="shrink-0 border-t border-gray-800 bg-brand-shaft text-white">
      <div className="flex items-start sm:items-center gap-3 px-4 py-2.5 max-w-[1800px] mx-auto">
        <div className="w-8 h-8 rounded-xl bg-brand-indigo flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
          <Lightning size={15} weight="fill" className="text-white" />
        </div>
        <div className="flex-1 min-w-0 py-0.5">
          <div className="font-semibold text-sm leading-tight">{title}</div>
          <p className="text-white/55 text-xs leading-snug mt-0.5">{description}</p>
        </div>
        <Link
          to="/"
          className="shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold text-white/80 hover:text-white px-3 py-2 rounded-xl hover:bg-white/10 transition-colors border border-white/10"
        >
          <ArrowLeft size={14} weight="bold" />
          <span className="hidden sm:inline">Back to site</span>
        </Link>
      </div>
    </footer>
  )
}
