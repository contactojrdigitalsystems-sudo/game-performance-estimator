"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { HardwareSelect, type SelectGroup } from "@/components/hardware-select";
import { ResultsPanel } from "@/components/results-panel";
import {
  buildReport,
  cpus,
  DEFAULTS,
  games,
  gpus,
  type Report,
  type Resolution,
} from "@/lib/estimate";

type Status = "idle" | "loading" | "ready";

export function Estimator() {
  const [cpuId, setCpuId] = useState<string>(DEFAULTS.cpuId);
  const [gpuId, setGpuId] = useState<string>(DEFAULTS.gpuId);
  const [gameId, setGameId] = useState<string>(DEFAULTS.gameId);
  const [resolution, setResolution] = useState<Resolution>("1440p");
  const [status, setStatus] = useState<Status>("idle");
  const [report, setReport] = useState<Report | null>(null);
  const resultsRef = useRef<HTMLElement>(null);
  const request = useRef(0);

  useEffect(() => {
    return () => {
      request.current += 1;
    };
  }, []);

  function resetResult() {
    request.current += 1;
    setStatus("idle");
    setReport(null);
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const id = ++request.current;
    const snapshot = { cpuId, gpuId, gameId };
    setStatus("loading");
    window.setTimeout(() => {
      if (request.current !== id) return;
      setReport(buildReport(snapshot.cpuId, snapshot.gpuId, snapshot.gameId));
      setStatus("ready");
      requestAnimationFrame(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      });
    }, 380);
  }

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)]">
      <form
        onSubmit={onSubmit}
        className="relative rounded-2xl border border-white/10 bg-slate-900/85 p-5 shadow-xl shadow-black/30"
      >
        <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-violet-400" />
        <h2 className="font-display text-lg font-semibold text-white">Tu configuración</h2>
        <p className="mt-1 text-sm text-slate-400">
          Tres datos bastan. El cálculo ocurre en el navegador.
        </p>
        <div className="mt-5 space-y-4">
          <HardwareSelect
            label="Procesador (CPU)"
            groups={toSeriesGroups(cpus, CPU_SERIES)}
            value={cpuId}
            onChange={(id) => {
              setCpuId(id);
              resetResult();
            }}
          />
          <HardwareSelect
            label="Tarjeta gráfica (GPU)"
            groups={toSeriesGroups(gpus, GPU_SERIES)}
            value={gpuId}
            onChange={(id) => {
              setGpuId(id);
              resetResult();
            }}
          />
          <HardwareSelect
            label="Juego deseado"
            groups={toGenreGroups(games)}
            value={gameId}
            onChange={(id) => {
              setGameId(id);
              resetResult();
            }}
          />
        </div>
        <button
          type="submit"
          disabled={status === "loading"}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-400 px-4 py-3 font-display text-sm font-semibold uppercase tracking-[0.16em] text-slate-950 shadow-[0_0_28px_rgba(34,211,238,0.28)] transition hover:brightness-110 disabled:cursor-wait disabled:opacity-70"
        >
          {status === "loading" ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-950" />
              Calculando
            </>
          ) : (
            "Calcular rendimiento"
          )}
        </button>
      </form>

      <section
        ref={resultsRef}
        aria-live="polite"
        aria-label="Resultados de rendimiento"
        className="relative min-h-[420px] rounded-2xl border border-white/10 bg-slate-900/85 p-5 shadow-xl shadow-black/30"
      >
        <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-violet-400 to-cyan-400" />
        {status === "ready" && report ? (
          <ResultsPanel
            report={report}
            resolution={resolution}
            onResolution={setResolution}
          />
        ) : status === "loading" ? (
          <LoadingState />
        ) : (
          <EmptyState />
        )}
      </section>
    </div>
  );
}

const CPU_SERIES = [
  "AMD Ryzen 9000",
  "AMD Ryzen 7000",
  "AMD Ryzen 5000",
  "AMD Ryzen 3000",
  "Intel Core Ultra",
  "Intel Core 14ª gen",
  "Intel Core 13ª gen",
  "Intel Core 12ª gen",
  "Intel Core 11ª gen",
  "Intel Core 10ª gen",
] as const;

const GPU_SERIES = [
  "NVIDIA RTX 50",
  "NVIDIA RTX 40",
  "NVIDIA RTX 30",
  "NVIDIA RTX 20",
  "NVIDIA GTX 16",
  "AMD Radeon RX 9000",
  "AMD Radeon RX 7000",
  "AMD Radeon RX 6000",
  "AMD Radeon RX 5000",
  "Intel Arc",
] as const;

const GAME_GENRES = [
  "Competitivo",
  "Battle royale",
  "Mundo abierto",
  "Acción",
  "RPG",
  "Deportes",
  "Carreras",
  "Sandbox",
  "Terror",
  "Cooperativo",
] as const;

function toSeriesGroups(
  items: readonly { id: string; name: string; series: string; specs: string; score: number }[],
  seriesOrder: readonly string[],
): SelectGroup[] {
  const known = new Set<string>(seriesOrder);
  const extras = [...new Set(items.map((item) => item.series).filter((series) => !known.has(series)))];
  return [...seriesOrder, ...extras]
    .map((series) => ({
      label: series,
      options: items
        .filter((item) => item.series === series)
        .sort((a, b) => b.score - a.score)
        .map((item) => ({ id: item.id, name: item.name, hint: item.specs })),
    }))
    .filter((group) => group.options.length > 0);
}

function toGenreGroups(
  items: readonly { id: string; name: string; genre: string; projected: boolean }[],
): SelectGroup[] {
  const known = new Set<string>(GAME_GENRES);
  const extras = [...new Set(items.map((item) => item.genre).filter((genre) => !known.has(genre)))];
  return [...GAME_GENRES, ...extras]
    .map((genre) => ({
      label: genre,
      options: items
        .filter((item) => item.genre === genre)
        .map((item) => ({
          id: item.id,
          name: item.name,
          hint: item.projected ? "Proyección" : genre,
        })),
    }))
    .filter((group) => group.options.length > 0);
}

function EmptyState() {
  return (
    <div className="flex min-h-[380px] flex-col items-center justify-center px-4 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-300">
        Panel de resultados
      </p>
      <h2 className="mt-3 font-display text-2xl font-semibold text-white">
        Listo para medir el equipo
      </h2>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-400">
        Elige procesador, gráfica y juego. Al calcular verás el cuello de botella, los FPS
        estimados y una mejora concreta.
      </p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="space-y-4" aria-hidden>
      <div className="h-4 w-28 animate-pulse rounded bg-slate-800" />
      <div className="h-16 w-40 animate-pulse rounded bg-slate-800" />
      <div className="h-3 w-full animate-pulse rounded-full bg-slate-800" />
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="h-36 animate-pulse rounded-2xl bg-slate-800" />
        <div className="h-36 animate-pulse rounded-2xl bg-slate-800" />
        <div className="h-36 animate-pulse rounded-2xl bg-slate-800" />
      </div>
    </div>
  );
}
