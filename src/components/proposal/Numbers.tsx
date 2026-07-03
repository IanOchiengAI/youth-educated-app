import { Reveal } from "./Reveal";
import { CountUp } from "./CountUp";

const rows = [
  { scale: "1,000 students", monthly: "$44", annual: "$528", per: "$4.88" },
  { scale: "5,000 students", monthly: "$121", annual: "$1,452", per: "$1.16" },
  { scale: "10,000 students", monthly: "$267", annual: "$3,204", per: "$0.76", highlight: true },
];

export function Numbers() {
  return (
    <section
      id="numbers"
      className="relative overflow-hidden px-5 py-28 text-white md:px-8 md:py-36"
      style={{ background: "linear-gradient(180deg, var(--color-navy), var(--color-navy-deep))" }}
    >
      <div
        aria-hidden
        className="absolute right-[-10%] top-[10%] h-[420px] w-[420px] rounded-full blur-3xl"
        style={{ background: "var(--color-gold)", opacity: 0.18 }}
      />
      <div className="relative mx-auto max-w-7xl">
        <Reveal>
          <p className="mb-4 font-poppins text-sm font-semibold uppercase tracking-[0.2em] text-gold">
            The Numbers
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="max-w-3xl text-balance text-4xl font-bold md:text-5xl font-poppins">
            A mentor in every pocket, for the cost of a soda.
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-16 grid items-center gap-10 md:grid-cols-2">
            <div>
              <div className="font-poppins text-[8rem] font-bold leading-none text-gold md:text-[12rem]">
                $<CountUp to={0.76} decimals={2} />
              </div>
              <p className="mt-4 font-poppins text-xl text-white/80">
                per student, per year, at scale
              </p>
              <p className="mt-2 max-w-md text-white/55 font-inter">
                10,000 students. Cloud + on-device AI. Hosting, inference,
                downloads — all in.
              </p>
            </div>

            <div className="glass-dark overflow-hidden rounded-3xl">
              <table className="w-full text-left text-sm font-inter">
                <thead className="text-xs uppercase tracking-widest text-white/55">
                  <tr>
                    <th className="px-6 py-4">Scale</th>
                    <th className="px-6 py-4">Monthly</th>
                    <th className="px-6 py-4">Annual</th>
                    <th className="px-6 py-4 text-right">Per student / yr</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {rows.map((r) => (
                    <tr key={r.scale} className={r.highlight ? "bg-gold/10" : ""}>
                      <td className="px-6 py-4 font-poppins font-semibold">
                        {r.scale}
                      </td>
                      <td className="px-6 py-4 text-white/80">{r.monthly}</td>
                      <td className="px-6 py-4 text-white/80">{r.annual}</td>
                      <td
                        className={`px-6 py-4 text-right font-poppins text-lg font-bold ${
                          r.highlight ? "text-gold" : "text-white"
                        }`}
                      >
                        {r.per}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
