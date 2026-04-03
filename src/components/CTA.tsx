import { ArrowRight, Sparkles } from 'lucide-react'

export function CTA() {
  return (
    <section className="py-24 bg-white">
      <div className="section-container">
        <div className="relative bg-gradient-to-br from-brand-navy via-brand-blue to-brand-mid rounded-3xl overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white blur-3xl translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-white blur-2xl -translate-x-1/2 translate-y-1/2" />
          </div>

          <div className="relative z-10 text-center py-20 px-8 space-y-8">
            <div className="inline-flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-full text-sm font-semibold border border-white/20">
              <Sparkles size={14} />
              Built for AI-first teams
            </div>

            <h2 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight max-w-2xl mx-auto">
              Ready to work with humans at scale?
            </h2>

            <p className="text-lg text-white/70 max-w-xl mx-auto">
              Start with a single session. Describe what you need — Comms handles every conversation from there.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <a href="#" className="bg-white text-brand-blue px-8 py-4 rounded-xl font-bold text-sm hover:bg-brand-ghost transition-colors inline-flex items-center gap-2 shadow-lg">
                Get Started Free <ArrowRight size={16} />
              </a>
              <a href="#" className="bg-white/10 text-white border border-white/20 px-8 py-4 rounded-xl font-bold text-sm hover:bg-white/20 transition-colors inline-flex items-center gap-2">
                See a Live Demo
              </a>
            </div>

            {/* Trust line */}
            <p className="text-white/40 text-sm">
              No credit card required · Enterprise plans available
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
