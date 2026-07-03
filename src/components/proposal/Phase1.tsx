import { Check, Bot, BookOpen, ShieldCheck, Users, Trophy, Smartphone } from "lucide-react";
import { Reveal, RevealItem, RevealStagger } from "./Reveal";

const features = [
  { icon: Bot, title: "AI Mentor — Jabari", desc: "Cloud-powered Gemini 2.0 Flash, fully working today." },
  { icon: BookOpen, title: "33 Lessons", desc: "8 life-skills modules, fully offline-cacheable." },
  { icon: ShieldCheck, title: "Safeguarding", desc: "Keyword detection → DSL escalation, 100% local." },
  { icon: Users, title: "Human Mentorship", desc: "Mentor pairing, scheduling and endorsements." },
  { icon: Trophy, title: "Gamification", desc: "Swahili-named tiers, points and learning streaks." },
  { icon: Smartphone, title: "Android App", desc: "Live in production via Capacitor 8." },
];

export function Phase1() {
  return (
    <section className="relative px-5 py-28 md:px-8 md:py-36" style={{ background: "color-mix(in oklab, var(--color-navy) 4%, var(--color-cream))" }}>
      <div className="mx-auto max-w-7xl">
        <div className="grid items-end gap-6 md:grid-cols-2">
          <div>
            <Reveal>
              <p className="mb-4 font-poppins text-sm font-semibold uppercase tracking-[0.2em] text-navy/60">
                Phase 1 — Complete
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="text-balance text-4xl font-bold text-navy md:text-5xl font-poppins">
                What we've already built.
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <p className="text-lg text-ink/70 md:text-right font-inter">
              A live, working MVP — won the Chai Hackathon, in production today.
            </p>
          </Reveal>
        </div>

        <RevealStagger className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <RevealItem
              key={f.title}
              className="glass-light group flex items-start gap-4 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl"
            >
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-navy text-gold">
                <f.icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-poppins text-base font-semibold text-navy">
                    {f.title}
                  </h3>
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-gold text-navy-deep">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                </div>
                <p className="mt-1 text-sm text-ink/65 font-inter">{f.desc}</p>
              </div>
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </section>
  );
}
