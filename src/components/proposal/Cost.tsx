import { Reveal, RevealItem, RevealStagger } from "./Reveal";

const milestones = [
  { week: "W1–2", title: "Training data" },
  { week: "W2–3", title: "Fine-tune (LoRA)" },
  { week: "W3", title: "Quantize" },
  { week: "W3–4", title: "RAG knowledge base" },
  { week: "W4–7", title: "Native plugin" },
  { week: "W7–8", title: "Integration" },
  { week: "W8–10", title: "Field testing" },
  { week: "W10", title: "Launch" },
];

export function Cost() {
  return (
    <section className="px-5 py-28 md:px-8 md:py-36 bg-cream">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr] md:items-end">
          <div>
            <Reveal>
              <p className="mb-4 font-poppins text-sm font-semibold uppercase tracking-[0.2em] text-navy/60">
                Development cost
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="text-balance text-4xl font-bold text-navy md:text-5xl font-poppins">
                Under <span className="text-gold">$6,000</span>.<br />
                Ten weeks. One launch.
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <div className="glass-light grid grid-cols-2 gap-6 rounded-3xl p-6">
              <div>
                <div className="text-xs uppercase tracking-widest text-ink/55 font-inter">Total</div>
                <div className="mt-1 font-poppins text-3xl font-bold text-navy">$3.7K–6K</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest text-ink/55 font-inter">Timeline</div>
                <div className="mt-1 font-poppins text-3xl font-bold text-navy">10 wks</div>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="relative mt-20">
          {/* timeline rail */}
          <div className="absolute left-0 right-0 top-5 h-px bg-navy/15" />
          <div
            className="absolute left-0 top-5 h-px"
            style={{ width: "100%", background: "linear-gradient(90deg, var(--color-gold), transparent)" }}
          />
          <RevealStagger className="grid grid-cols-2 gap-y-10 sm:grid-cols-4 lg:grid-cols-8">
            {milestones.map((m, i) => (
              <RevealItem key={m.title} className="relative pt-12 text-center">
                <span
                  className={`absolute left-1/2 top-3 h-5 w-5 -translate-x-1/2 rounded-full border-2 ${
                    i === milestones.length - 1
                      ? "border-gold bg-gold"
                      : "border-navy bg-cream"
                  }`}
                />
                <div className="font-poppins text-xs font-bold uppercase tracking-widest text-gold">
                  {m.week}
                </div>
                <div className="mt-1 text-sm font-semibold text-navy font-poppins">
                  {m.title}
                </div>
              </RevealItem>
            ))}
          </RevealStagger>
        </div>
      </div>
    </section>
  );
}
