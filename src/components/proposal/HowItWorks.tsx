import { Download, Wifi, MessageCircle } from "lucide-react";
import { Reveal, RevealItem, RevealStagger } from "./Reveal";

const steps = [
  { icon: Download, n: "01", title: "Install the app", size: "15 MB", desc: "Tiny download from the Play Store. Works immediately with cloud AI." },
  { icon: Wifi, n: "02", title: "Download the AI", size: "420 MB", desc: "Background download over Wi-Fi. Pause and resume anytime." },
  { icon: MessageCircle, n: "03", title: "Chat anywhere", size: "0 MB", desc: "Jabari or Amara — anywhere, anytime, no internet required." },
];

export function HowItWorks() {
  return (
    <section className="relative px-5 py-28 md:px-8 md:py-36" style={{ background: "color-mix(in oklab, var(--color-navy) 4%, var(--color-cream))" }}>
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className="mb-4 font-poppins text-sm font-semibold uppercase tracking-[0.2em] text-navy/60">
            How it works
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="max-w-3xl text-balance text-4xl font-bold text-navy md:text-5xl font-poppins">
            Three steps. One mentor for life.
          </h2>
        </Reveal>

        <RevealStagger className="relative mt-16 grid gap-6 md:grid-cols-3">
          {/* connector line */}
          <div className="pointer-events-none absolute left-8 right-8 top-16 hidden h-px md:block"
               style={{ background: "repeating-linear-gradient(90deg, color-mix(in oklab, var(--color-navy) 25%, transparent) 0 8px, transparent 8px 16px)" }} />
          {steps.map((s) => (
            <RevealItem key={s.n} className="relative">
              <div className="glass-light h-full rounded-3xl p-7">
                <div className="flex items-center justify-between">
                  <div className="grid h-14 w-14 place-items-center rounded-2xl bg-navy text-gold">
                    <s.icon className="h-6 w-6" />
                  </div>
                  <span className="font-poppins text-3xl font-bold text-navy/15">
                    {s.n}
                  </span>
                </div>
                <h3 className="mt-6 font-poppins text-xl font-semibold text-navy">
                  {s.title}
                </h3>
                <p className="mt-1 text-sm font-semibold text-gold font-inter">{s.size}</p>
                <p className="mt-3 text-sm text-ink/65 font-inter">{s.desc}</p>
              </div>
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </section>
  );
}
