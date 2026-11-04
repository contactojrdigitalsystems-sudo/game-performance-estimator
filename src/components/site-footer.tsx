export function SiteFooter() {
  return (
    <footer className="relative border-t border-white/10 bg-slate-950">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-violet-500" />
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <section
          aria-labelledby="contacto-titulo"
          className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/85 px-6 py-8 shadow-xl shadow-black/30 sm:px-10"
        >
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-violet-600/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 left-10 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">Contacto</p>
          <h2 id="contacto-titulo" className="mt-3 max-w-3xl font-display text-2xl font-semibold text-white sm:text-3xl">
            Hablemos de tu equipo o de tu proyecto
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
            ¿Tienes alguna duda, has detectado un problema o te interesa una solución a medida para
            tu empresa? Ponte en contacto con nosotros.
          </p>
          <a
            href="mailto:contacto.jrdigitalsystems@gmail.com"
            className="mt-6 inline-flex max-w-full items-center gap-3 rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 shadow-[0_0_28px_rgba(34,211,238,0.35)] transition hover:brightness-110 hover:shadow-[0_0_36px_rgba(167,139,250,0.55)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m3 7 9 6 9-6" />
            </svg>
            <span className="min-w-0 break-all">contacto.jrdigitalsystems@gmail.com</span>
          </a>
        </section>

        <p className="mt-8 max-w-3xl text-xs leading-relaxed text-slate-500">
          Estimación orientativa a partir de puntuaciones de referencia. Los FPS reales dependen
          de drivers, memoria, refrigeración y de los ajustes internos de cada juego.
        </p>
        <p className="mt-4 text-xs text-slate-500">
          © 2026 JR Digital Systems - GamePerformance Estimator. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
