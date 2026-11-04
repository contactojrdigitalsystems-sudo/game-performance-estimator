import { Estimator } from "@/components/estimator";
import { SiteFooter } from "@/components/site-footer";

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100">
      <main className="relative overflow-hidden">
      <div className="bg-grid pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-violet-600/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 top-24 h-72 w-72 rounded-full bg-cyan-400/15 blur-3xl" />

      <a
        href="#calculadora"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-slate-900 focus:px-3 focus:py-2"
      >
        Saltar al calculador
      </a>

      <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <header className="mb-10 max-w-3xl">
          <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">
            <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_12px_#22d3ee]" />
            GameSpec
          </p>
          <h1 className="font-display text-4xl font-semibold leading-tight text-white sm:text-5xl">
            Calculadora de cuello de botella y estimador de FPS
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-400">
            Combina tu procesador, tu gráfica y el juego que quieres mover. La estimación de FPS
            y el cuello de botella salen al instante, en este dispositivo.
          </p>
          <ul className="mt-5 flex flex-wrap gap-2 text-xs text-slate-300">
            <li className="rounded-full border border-white/10 bg-slate-900/80 px-3 py-1">
              Cálculo en el cliente
            </li>
            <li className="rounded-full border border-white/10 bg-slate-900/80 px-3 py-1">
              1080p · 1440p · 4K
            </li>
            <li className="rounded-full border border-white/10 bg-slate-900/80 px-3 py-1">
              Bajo, Medio y Ultra
            </li>
          </ul>
        </header>

        <section id="calculadora" aria-label="Calculadora de rendimiento">
          <Estimator />
        </section>
      </div>
      </main>
      <SiteFooter />
    </div>
  );
}
