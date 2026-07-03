import { Smartphone, HardDrive, Wifi } from "lucide-react";
import { Reveal, RevealItem, RevealStagger } from "./Reveal";

const stats = [
  {
    icon: Smartphone,
    value: "94%",
    label: "Android market share in Kenya",
    detail: "Our students live on Android. So must our mentor.",
  },
  {
    icon: HardDrive,
    value: "128 GB",
    label: "Standard storage on affordable phones",
    detail: "Plenty of room for a 420 MB AI — that's 0.3% of storage.",
  },
  {
    icon: Wifi,
    value: "KES 99",
    label: "Average cost of 1 GB of mobile data",
    detail: "Every offline minute is money students don't spend.",
  },
];

export function Problem() {
  return (
    <section id="problem" className="relative px-5 py-28 md:px-8 md:py-36 bg-cream">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className="mb-4 font-poppins text-sm font-semibold uppercase tracking-[0.2em] text-navy/60">
            The Problem
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="max-w-3xl text-balance text-4xl font-bold text-navy md:text-6xl font-poppins">
            When students lose signal,
            <br /> they lose their{" "}
            <span className="relative">
              AI mentor
              <span className="absolute inset-x-0 -bottom-1 h-3 -z-10 bg-gold/60" />
            </span>
            .
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-6 max-w-2xl text-lg text-ink/70 font-inter">
            Our AI mentor Jabari currently lives in the cloud. After school, on
            weekends, in rural counties — exactly when students need him most —
            he disappears.
          </p>
        </Reveal>

        <RevealStagger className="mt-16 grid gap-6 md:grid-cols-3">
          {stats.map((s) => (
            <RevealItem
              key={s.value}
              className="glass-light group rounded-3xl p-7 transition-transform duration-300 hover:-translate-y-1"
            >
              <div
                className="mb-6 grid h-12 w-12 place-items-center rounded-2xl text-navy"
                style={{ background: "color-mix(in oklab, var(--color-gold) 35%, transparent)" }}
              >
                <s.icon className="h-6 w-6" />
              </div>
              <div className="font-poppins text-5xl font-bold text-navy">
                {s.value}
              </div>
              <div className="mt-2 font-poppins text-base font-semibold text-ink">
                {s.label}
              </div>
              <p className="mt-3 text-sm text-ink/65 font-inter">{s.detail}</p>
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </section>
  );
}
