export function Footer() {
  return (
    <footer
      className="px-5 py-16 text-white md:px-8"
      style={{ background: "var(--color-navy-deep)" }}
    >
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-3 md:items-center">
        <div className="flex items-center gap-3">
          <span
            className="grid h-12 w-12 place-items-center rounded-full font-poppins text-xl font-bold text-navy-deep"
            style={{ background: "var(--color-gold)" }}
          >
            Y
          </span>
          <div>
            <div className="font-poppins text-lg font-semibold">Youth Educated</div>
            <div className="text-xs text-white/55 font-inter">Nairobi · Kenya</div>
          </div>
        </div>

        <p className="text-center font-poppins text-2xl font-semibold text-gold">
          Conversation. Choice. Change.
        </p>

        <p className="text-center text-sm text-white/65 md:text-right font-inter">
          Phase 1: Complete <span className="text-gold">✅</span>
          <br />
          Phase 2: Ready to Build
        </p>
      </div>
      <div className="mx-auto mt-12 max-w-7xl border-t border-white/10 pt-6 text-center text-xs text-white/40 font-inter">
        © {new Date().getFullYear()} Youth Educated. A mentor in every pocket.
      </div>
    </footer>
  );
}
