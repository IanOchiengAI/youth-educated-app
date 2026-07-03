import { ArrowRight } from "lucide-react";
import { Reveal } from "./Reveal";

const items = [
  { label: "Development (10 weeks, 1 dev)", value: "$3,000 – $5,000" },
  { label: "Infrastructure (GPU, API, devices)", value: "$265 – $430" },
  { label: "Year 1 ops (1,000 students)", value: "$528" },
];

export function Ask() {
  return (
    <section
      id="ask"
      className="relative overflow-hidden px-5 py-28 text-white md:px-8 md:py-36"
      style={{ background: "linear-gradient(160deg, var(--color-navy-deep) 0%, var(--color-navy) 60%, oklch(0.34 0.16 265) 100%)" }}
    >
      <div
        aria-hidden
        className="absolute -left-20 -top-20 h-[420px] w-[420px] rounded-full blur-3xl"
        style={{ background: "var(--color-gold)", opacity: 0.22 }}
      />
      <div className="relative mx-auto max-w-5xl">
        <Reveal>
          <p className="mb-4 font-poppins text-sm font-semibold uppercase tracking-[0.2em] text-gold">
            The Ask
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="text-balance text-center font-poppins text-4xl font-bold md:text-6xl">
            For under <span className="text-gold">$6,000</span>, we put a mentor in every pocket — for life.
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="glass-dark mt-14 overflow-hidden rounded-3xl font-inter">
            <ul className="divide-y divide-white/10">
              {items.map((it) => (
                <li
                  key={it.label}
                  className="flex flex-wrap items-center justify-between gap-4 px-6 py-5"
                >
                  <span className="text-white/85">{it.label}</span>
                  <span className="font-poppins text-lg font-semibold text-gold">
                    {it.value}
                  </span>
                </li>
              ))}
              <li className="flex flex-wrap items-center justify-between gap-4 bg-gold/10 px-6 py-6">
                <span className="font-poppins text-lg font-semibold">
                  Total Phase 2 Investment
                </span>
                <span className="font-poppins text-2xl font-bold text-gold">
                  $3,793 – $5,958
                </span>
              </li>
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-12 flex flex-col items-center gap-4">
            <a
              href="mailto:hello@youtheducated.org?subject=Phase%202%20Partnership"
              className="group inline-flex items-center gap-3 rounded-full bg-gold px-8 py-4 font-poppins text-lg font-semibold text-navy-deep shadow-2xl shadow-gold/20 transition-transform hover:scale-105"
            >
              Partner with us
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </a>
            <p className="text-sm text-white/55 font-inter">
              hello@youtheducated.org
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
