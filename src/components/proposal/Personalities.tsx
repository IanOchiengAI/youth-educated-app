import { Reveal } from "./Reveal";

export function Personalities() {
  return (
    <section className="px-5 py-28 md:px-8 md:py-36 bg-cream">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className="mb-4 font-poppins text-sm font-semibold uppercase tracking-[0.2em] text-navy/60">
            Meet your mentors
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="max-w-3xl text-balance text-4xl font-bold text-navy md:text-6xl font-poppins">
            Jabari & Amara.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          <Reveal>
            <article
              className="relative h-full overflow-hidden rounded-3xl p-10 text-white"
              style={{ background: "linear-gradient(160deg, var(--color-navy-deep), var(--color-navy))" }}
            >
              <div
                aria-hidden
                className="absolute -right-10 -top-10 h-48 w-48 rounded-full"
                style={{ background: "var(--color-gold)", opacity: 0.18 }}
              />
              <div className="relative">
                <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-gold font-poppins text-3xl font-bold text-navy-deep">
                  J
                </div>
                <h3 className="font-poppins text-3xl font-semibold">Jabari</h3>
                <p className="mt-1 text-white/70 font-inter">Trusted older brother</p>
                <blockquote className="mt-8 font-poppins text-2xl font-medium leading-snug text-gold">
                  "Bro, you've got this."
                </blockquote>
                <dl className="mt-8 grid grid-cols-2 gap-4 text-sm font-inter">
                  <div>
                    <dt className="text-white/55">Voice</dt>
                    <dd className="text-white">Male, warm</dd>
                  </div>
                  <div>
                    <dt className="text-white/55">Tone</dt>
                    <dd className="text-white">Encouraging, direct</dd>
                  </div>
                </dl>
              </div>
            </article>
          </Reveal>

          <Reveal delay={0.1}>
            <article
              className="relative h-full overflow-hidden rounded-3xl p-10"
              style={{ background: "linear-gradient(160deg, var(--color-gold), var(--color-gold-soft))", color: "oklch(0.24 0.13 265)" }}
            >
              <div
                aria-hidden
                className="absolute -left-10 -bottom-10 h-48 w-48 rounded-full"
                style={{ background: "var(--color-navy)", opacity: 0.12 }}
              />
              <div className="relative">
                <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-navy-deep font-poppins text-3xl font-bold text-gold">
                  A
                </div>
                <h3 className="font-poppins text-3xl font-semibold">Amara</h3>
                <p className="mt-1 text-navy-deep/70 font-inter">Trusted older sister</p>
                <blockquote className="mt-8 font-poppins text-2xl font-medium leading-snug">
                  "Sis, I believe in you."
                </blockquote>
                <dl className="mt-8 grid grid-cols-2 gap-4 text-sm font-inter">
                  <div>
                    <dt className="opacity-60">Voice</dt>
                    <dd className="font-medium">Female, warm</dd>
                  </div>
                  <div>
                    <dt className="opacity-60">Tone</dt>
                    <dd className="font-medium">Patient, affirming</dd>
                  </div>
                </dl>
              </div>
            </article>
          </Reveal>
        </div>

        <Reveal delay={0.15}>
          <p className="mt-10 text-center font-poppins text-lg text-ink/70">
            Same model. <span className="text-navy font-semibold">Two personalities.</span> One download.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
