import { Cloud, Cpu, ArrowLeftRight } from "lucide-react";
import { Reveal } from "./Reveal";

export function Solution() {
  return (
    <section
      id="solution"
      className="relative overflow-hidden px-5 py-28 text-white md:px-8 md:py-36"
      style={{ background: "linear-gradient(180deg, var(--color-navy-deep), var(--color-navy))" }}
    >
      <div
        aria-hidden
        className="absolute -left-20 top-1/3 h-80 w-80 rounded-full blur-3xl"
        style={{ background: "var(--color-gold)", opacity: 0.18 }}
      />
      <div className="relative mx-auto max-w-7xl">
        <Reveal>
          <p className="mb-4 font-poppins text-sm font-semibold uppercase tracking-[0.2em] text-gold">
            The Solution
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="max-w-3xl text-balance text-4xl font-bold md:text-6xl font-poppins">
            Hybrid AI. <span className="text-gold">One experience.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-6 max-w-2xl text-lg text-white/70 font-inter">
            Cloud when connected. On-device when not. The student never knows
            the difference.
          </p>
        </Reveal>

        <div className="relative mt-16 grid items-stretch gap-6 md:grid-cols-[1fr_auto_1fr]">
          <Reveal>
            <div className="glass-dark h-full rounded-3xl p-8">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10">
                  <Cloud className="h-6 w-6 text-white" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-widest text-white/60">
                  Online
                </span>
              </div>
              <h3 className="mt-6 font-poppins text-2xl font-semibold">
                Cloud AI
              </h3>
              <p className="mt-1 text-white/70 font-inter">Gemini 2.0 Flash</p>
              <ul className="mt-6 space-y-2 text-sm text-white/75 font-inter">
                <li>• Full-power reasoning</li>
                <li>• 600-token responses</li>
                <li>• Real-time updates</li>
              </ul>
            </div>
          </Reveal>

          <div className="hidden flex-col items-center justify-center md:flex">
            <div className="flex flex-col items-center gap-3">
              <div className="rounded-full border border-gold/40 bg-gold/10 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-gold">
                <ArrowLeftRight className="mr-2 inline h-3.5 w-3.5" />
                Seamless switching
              </div>
              <p className="max-w-[10rem] text-center text-xs text-white/55 font-inter">
                Student never notices.
              </p>
            </div>
          </div>

          <Reveal delay={0.1}>
            <div
              className="glass-dark h-full rounded-3xl p-8"
              style={{ borderColor: "color-mix(in oklab, var(--color-gold) 35%, transparent)" }}
            >
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gold text-navy-deep">
                  <Cpu className="h-6 w-6" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-widest text-gold">
                  Offline
                </span>
              </div>
              <h3 className="mt-6 font-poppins text-2xl font-semibold">
                On-Device AI
              </h3>
              <p className="mt-1 text-white/70 font-inter">Gemma 4 E2B • ~300 MB</p>
              <ul className="mt-6 space-y-2 text-sm text-white/75 font-inter">
                <li>• Zero data cost per chat</li>
                <li>• Local RAG over YE curriculum</li>
                <li>• Works in airplane mode</li>
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
