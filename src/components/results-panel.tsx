"use client";

import {
  PRESET_LABEL,
  PRESETS,
  RESOLUTION_LABEL,
  RESOLUTIONS,
  type Report,
  type Resolution,
  type Severity,
} from "@/lib/estimate";

const SEVERITY: Record<
  Severity,
  { label: string; bar: string; text: string; chip: string }
> = {
  optimal: {
    label: "Óptimo",
    bar: "#34d399",
    text: "text-emerald-300",
    chip: "border-emerald-400/30 bg-emerald-400/15 text-emerald-300",
  },
  moderate: {
    label: "Moderado",
    bar: "#fbbf24",
    text: "text-amber-300",
    chip: "border-amber-400/30 bg-amber-400/15 text-amber-300",
  },
  high: {
    label: "Alto",
    bar: "#fb7185",
    text: "text-rose-300",
    chip: "border-rose-400/30 bg-rose-400/15 text-rose-300",
  },
};

const LIMITER_COPY = {
  CPU: "El procesador limita el ritmo",
  GPU: "La tarjeta gráfica limita el ritmo",
  balanced: "Procesador y gráfica van a la par",
} as const;

type ResultsPanelProps = {
  report: Report;
  resolution: Resolution;
  onResolution: (resolution: Resolution) => void;
};

export function ResultsPanel({ report, resolution, onResolution }: ResultsPanelProps) {
  const advice = report.advice[resolution];
  const tone = SEVERITY[advice.severity];
  const shopHref = `https://www.amazon.es/s?k=${encodeURIComponent(advice.searchQuery)}`;

  return (
    <div className="animate-rise space-y-5">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
            Resultado
          </p>
          <h2 className="mt-1 font-display text-xl font-semibold text-white sm:text-2xl">
            {report.gameName}
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            {report.cpuName} · {report.gpuName}
          </p>
        </div>
        {report.projected ? (
          <span className="rounded-full border border-violet-400/40 bg-violet-500/15 px-3 py-1 text-xs font-medium text-violet-200">
            Proyección
          </span>
        ) : null}
      </header>

      <section aria-label="Cuello de botella">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Cuello de botella
            </h3>
            <p className={`font-display text-6xl font-semibold tabular-nums ${tone.text}`}>
              {advice.percent}
              <span className="ml-1 text-2xl text-slate-400">%</span>
            </p>
          </div>
          <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${tone.chip}`}>
            {tone.label}
          </span>
        </div>
        <p className="mt-1 text-sm text-slate-300">{LIMITER_COPY[advice.limiter]}</p>
        <p className="text-xs text-slate-500">
          Referencia {RESOLUTION_LABEL[resolution]} · ajuste Ultra
        </p>
        <div
          className="mt-4 h-3 overflow-hidden rounded-full bg-slate-800"
          role="meter"
          aria-valuenow={advice.percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Porcentaje de cuello de botella"
        >
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${Math.min(advice.percent, 100)}%`,
              backgroundColor: tone.bar,
              boxShadow: `0 0 18px ${tone.bar}`,
            }}
          />
        </div>
        <ul className="mt-3 flex flex-wrap gap-4 text-xs text-slate-400">
          <li className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400" /> Verde = Óptimo
          </li>
          <li className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-400" /> Amarillo = Moderado
          </li>
          <li className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-rose-400" /> Rojo = Alto
          </li>
        </ul>
      </section>

      <section aria-label="Estimación de FPS">
        <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          Estimación de FPS
        </h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {RESOLUTIONS.map((item) => {
            const active = item === resolution;
            return (
              <button
                key={item}
                type="button"
                onClick={() => onResolution(item)}
                aria-pressed={active}
                className={`rounded-2xl border p-4 text-left transition ${
                  active
                    ? "border-cyan-400/60 bg-cyan-400/10 shadow-neon"
                    : "border-white/10 bg-slate-950/50 hover:border-violet-400/40"
                }`}
              >
                <span className="font-display text-lg font-semibold text-white">
                  {RESOLUTION_LABEL[item]}
                </span>
                <ul className="mt-3 space-y-2">
                  {PRESETS.map((preset) => (
                    <li key={preset} className="flex items-baseline justify-between gap-3">
                      <span className="text-xs uppercase tracking-wider text-slate-400">
                        {PRESET_LABEL[preset]}
                      </span>
                      <span className="font-display text-lg tabular-nums text-cyan-100">
                        {report.cells[item][preset]}
                        <span className="ml-1 text-[10px] font-sans text-slate-500">FPS</span>
                        {report.capped[item][preset] ? (
                          <span className="ml-1 text-[10px] font-sans uppercase text-violet-300">
                            tope
                          </span>
                        ) : null}
                      </span>
                    </li>
                  ))}
                </ul>
              </button>
            );
          })}
        </div>
        {report.hasCap ? (
          <p className="mt-3 text-xs text-slate-500">
            Este juego se muestra con el tope habitual de su motor. Las celdas marcadas como
            «tope» ya llegan a ese límite.
          </p>
        ) : null}
        {report.projected ? (
          <p className="mt-2 text-xs text-violet-300/90">
            Cifras de proyección: este título todavía no tiene benchmarks públicos en el modelo.
          </p>
        ) : null}
      </section>

      <section className="rounded-2xl border border-violet-400/20 bg-gradient-to-br from-violet-500/10 via-slate-950 to-cyan-400/10 p-5">
        <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-300">
          Recomendación de actualización
        </h3>
        <p className="mt-2 font-display text-2xl font-semibold text-white">{advice.headline}</p>
        <p className="mt-2 text-sm leading-relaxed text-slate-300">{advice.detail}</p>
        {advice.toFps != null && advice.gainPct != null ? (
          <p className="mt-4 flex flex-wrap items-center gap-2 text-sm">
            <span className="rounded-full bg-slate-950/80 px-3 py-1 tabular-nums text-slate-300">
              {advice.fromFps} → {advice.toFps} FPS
            </span>
            <span className="rounded-full bg-cyan-400/15 px-3 py-1 font-semibold text-cyan-200">
              +{advice.gainPct}% en {RESOLUTION_LABEL[resolution]} Ultra
            </span>
          </p>
        ) : null}
        <a
          href={shopHref}
          target="_blank"
          rel="sponsored noopener noreferrer"
          className="mt-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/40 bg-cyan-400/10 px-5 py-2.5 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-300 hover:text-slate-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
        >
          {advice.productName ? `Ver ${advice.productName}` : "Ver componentes en tienda"}
          <span aria-hidden>→</span>
        </a>
        <p className="mt-2 text-[11px] text-slate-500">
          Enlace de demostración: abre una búsqueda en tienda, sin código de afiliado real.
        </p>
      </section>
    </div>
  );
}
