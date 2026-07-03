import { motion } from "motion/react";
import { ChevronDown } from "lucide-react";

export function Hero() {
  return (
    <section
      id="top"
      className="relative isolate flex min-h-screen items-center overflow-hidden bg-hero-gradient pt-24 text-white"
    >
      {/* gold sun disc */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0, scale: 0.85 }}
        whileInView={{ opacity: 0.55, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.6, ease: "easeOut" }}
        className="absolute right-[-8%] top-[12%] -z-10 h-[520px] w-[520px] rounded-full blur-3xl md:right-[2%]"
        style={{ background: "radial-gradient(circle, var(--color-gold) 0%, transparent 65%)" }}
      />
      <div
        aria-hidden
        className="absolute right-[6%] top-[18%] -z-10 h-72 w-72 rounded-full md:h-96 md:w-96"
        style={{ background: "var(--color-gold)", opacity: 0.18 }}
      />

      <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-20 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="inline-flex w-fit items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-gold"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-gold" />
          Phase 2 Proposal
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="max-w-5xl text-balance font-poppins text-5xl font-bold leading-[1.05] md:text-7xl lg:text-[5.5rem]"
        >
          A Mentor in <span className="text-gold">Every Pocket</span> —
          <br className="hidden md:block" /> Even Without Internet
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="max-w-2xl text-lg text-white/75 md:text-xl font-inter"
        >
          Youth Educated • Phase 2: bringing on-device AI mentorship to Kenyan
          youth — anywhere, anytime, no signal required.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="flex flex-wrap items-center gap-4 pt-2"
        >
          <span className="rounded-full bg-gold px-6 py-3 font-poppins text-base font-semibold text-navy-deep shadow-lg shadow-gold/20">
            Conversation. Choice. Change.
          </span>
          <a
            href="#problem"
            className="rounded-full border border-white/25 px-6 py-3 text-sm text-white/85 transition-colors hover:border-gold hover:text-gold"
          >
            See the proposal ↓
          </a>
        </motion.div>
      </div>

      <motion.a
        href="#problem"
        aria-label="Scroll down"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1, y: [0, 8, 0] }}
        viewport={{ once: true }}
        transition={{ opacity: { delay: 1.2 }, y: { repeat: Infinity, duration: 2 } }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60"
      >
        <ChevronDown className="h-6 w-6" />
      </motion.a>
    </section>
  );
}
