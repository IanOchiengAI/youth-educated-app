import { useEffect, useState } from "react";

const links = [
  { href: "#problem", label: "Problem" },
  { href: "#solution", label: "Solution" },
  { href: "#numbers", label: "Numbers" },
  { href: "#ask", label: "The Ask" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-navy-deep/85 backdrop-blur-xl border-b border-white/10"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        <a href="#top" className="flex items-center gap-2 text-white">
          <span
            className="grid h-9 w-9 place-items-center rounded-full font-poppins font-bold text-navy-deep"
            style={{ background: "var(--color-gold)" }}
          >
            Y
          </span>
          <span className="font-poppins text-sm font-semibold tracking-wide">
            Youth Educated
          </span>
        </a>
        <nav className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-white/80 transition-colors hover:text-gold"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <a
          href="#ask"
          className="hidden rounded-full bg-gold px-4 py-2 text-sm font-semibold text-navy-deep transition-transform hover:scale-105 md:inline-block"
        >
          Partner with us
        </a>
      </div>
    </header>
  );
}
