import hardware from "../../data/hardware.json";

/**
 * Modelo local, sin red:
 * - `score` compara CPUs y GPUs en la misma escala (100 ≈ gama alta de referencia).
 * - `balance` es la relación GPU/CPU ideal del juego en 1080p Ultra.
 * - La resolución penaliza más a la GPU. El cuello es el desnivel entre ambos techos de FPS.
 * - `baseFps` es el ritmo del par de referencia en 1080p Ultra.
 */

export const cpus = hardware.cpus;
export const gpus = hardware.gpus;
export const games = hardware.games;

export const RESOLUTIONS = ["1080p", "1440p", "4k"] as const;
export const PRESETS = ["low", "medium", "ultra"] as const;

export type Resolution = (typeof RESOLUTIONS)[number];
export type Preset = (typeof PRESETS)[number];
export type Severity = "optimal" | "moderate" | "high";
export type Limiter = "CPU" | "GPU" | "balanced";
export type Cpu = (typeof cpus)[number];
export type Gpu = (typeof gpus)[number];
export type Game = (typeof games)[number];

export const DEFAULTS = {
  cpuId: "r5-5600",
  gpuId: "rtx-4060",
  gameId: "cyberpunk-2077",
} as const;

export const RESOLUTION_LABEL: Record<Resolution, string> = {
  "1080p": "1080p",
  "1440p": "1440p",
  "4k": "4K",
};

export const PRESET_LABEL: Record<Preset, string> = {
  low: "Bajo",
  medium: "Medio",
  ultra: "Ultra",
};

const RES_CPU: Record<Resolution, number> = { "1080p": 1, "1440p": 0.95, "4k": 0.9 };
const RES_GPU: Record<Resolution, number> = { "1080p": 1, "1440p": 0.68, "4k": 0.4 };
const PRESET_CPU: Record<Preset, number> = { low: 1.22, medium: 1.1, ultra: 1 };
const PRESET_GPU: Record<Preset, number> = { low: 1.58, medium: 1.24, ultra: 1 };

export type Advice = {
  percent: number;
  severity: Severity;
  limiter: Limiter;
  headline: string;
  detail: string;
  kind: "CPU" | "GPU" | null;
  productName: string | null;
  searchQuery: string;
  fromFps: number;
  toFps: number | null;
  gainPct: number | null;
};

export type Report = {
  cpuName: string;
  gpuName: string;
  gameName: string;
  projected: boolean;
  hasCap: boolean;
  cells: Record<Resolution, Record<Preset, number>>;
  capped: Record<Resolution, Record<Preset, boolean>>;
  advice: Record<Resolution, Advice>;
};

type Part = { id: string; name: string; score: number; brand: string };

function findById<T extends { id: string }>(items: readonly T[], id: string): T {
  const found = items.find((item) => item.id === id);
  if (!found) {
    throw new Error(`Pieza desconocida: ${id}`);
  }
  return found;
}

export function frameRates(
  cpu: Cpu,
  gpu: Gpu,
  game: Game,
  resolution: Resolution,
  preset: Preset,
) {
  const cpuFps =
    game.baseFps * (cpu.score / 100) * RES_CPU[resolution] * PRESET_CPU[preset];
  const gpuFps =
    game.baseFps *
    (gpu.score / 100) /
    game.balance *
    RES_GPU[resolution] *
    PRESET_GPU[preset];
  const raw = Math.min(cpuFps, gpuFps);
  const cap = game.fpsCap;
  const capped = cap != null && raw > cap;
  const fps = Math.max(1, Math.round(capped && cap != null ? cap : raw));
  return { cpuFps, gpuFps, fps, capped };
}

function severityOf(percent: number): Severity {
  if (percent <= 12) return "optimal";
  if (percent <= 30) return "moderate";
  return "high";
}

function nextPart<T extends Part>(items: readonly T[], current: T): T | null {
  const candidates = items.filter(
    (item) => item.id !== current.id && item.score >= current.score * 1.12,
  );
  const sameBrand = candidates.filter((item) => item.brand === current.brand);
  const pool = sameBrand.length > 0 ? sameBrand : candidates;
  return [...pool].sort((a, b) => a.score - b.score)[0] ?? null;
}

function headlines(
  severity: Severity,
  limiter: Limiter,
  productName: string | null,
  resolution: Resolution,
): { headline: string; detail: string } {
  const where = `${RESOLUTION_LABEL[resolution]} Ultra`;
  const piece =
    limiter === "GPU"
      ? "la tarjeta gráfica"
      : limiter === "CPU"
        ? "el procesador"
        : "el conjunto";

  if (severity === "optimal") {
    return {
      headline: "Reparto óptimo",
      detail: productName
        ? `En ${where} el equipo va equilibrado. Para ganar margen, el siguiente salto es ${productName}.`
        : `En ${where} el equipo va equilibrado y está en la cima del catálogo.`,
    };
  }

  if (severity === "moderate") {
    return {
      headline: `Cuello moderado en ${piece}`,
      detail: productName
        ? `En ${where}, ${piece} marca el límite del equipo. ${productName} reduce ese desnivel con un salto razonable.`
        : `En ${where}, ${piece} marca el límite y ya es la pieza más rápida del catálogo.`,
    };
  }

  return {
    headline: `Cuello alto en ${piece}`,
    detail: productName
      ? `En ${where}, ${piece} concentra el cuello de botella. ${productName} es la mejora con más impacto.`
      : `En ${where}, ${piece} concentra el cuello de botella y ya es la pieza más rápida del catálogo.`,
  };
}

function adviceFor(cpu: Cpu, gpu: Gpu, game: Game, resolution: Resolution): Advice {
  const ultra = frameRates(cpu, gpu, game, resolution, "ultra");
  const maxCeiling = Math.max(ultra.cpuFps, ultra.gpuFps);
  const percent = Math.round(
    (Math.abs(ultra.cpuFps - ultra.gpuFps) / maxCeiling) * 100,
  );
  const limiter: Limiter =
    Math.abs(ultra.cpuFps - ultra.gpuFps) < 0.5
      ? "balanced"
      : ultra.gpuFps < ultra.cpuFps
        ? "GPU"
        : "CPU";

  const gpuNext = nextPart(gpus, gpu);
  const cpuNext = nextPart(cpus, cpu);
  const gpuUpgradeFps = gpuNext
    ? frameRates(cpu, gpuNext, game, resolution, "ultra").fps
    : null;
  const cpuUpgradeFps = cpuNext
    ? frameRates(cpuNext, gpu, game, resolution, "ultra").fps
    : null;

  type Option = { kind: "CPU" | "GPU"; name: string; fps: number };
  const options: Option[] = [];
  if (gpuNext && gpuUpgradeFps != null && gpuUpgradeFps >= ultra.fps * 1.05) {
    options.push({ kind: "GPU", name: gpuNext.name, fps: gpuUpgradeFps });
  }
  if (cpuNext && cpuUpgradeFps != null && cpuUpgradeFps >= ultra.fps * 1.05) {
    options.push({ kind: "CPU", name: cpuNext.name, fps: cpuUpgradeFps });
  }

  let chosen: Option | null = null;
  if (limiter === "GPU") {
    chosen = options.find((option) => option.kind === "GPU") ?? options[0] ?? null;
  } else if (limiter === "CPU") {
    chosen = options.find((option) => option.kind === "CPU") ?? options[0] ?? null;
  } else {
    chosen = [...options].sort((a, b) => b.fps - a.fps)[0] ?? null;
  }

  const copy = headlines(severityOf(percent), limiter, chosen?.name ?? null, resolution);
  const gainPct =
    chosen && ultra.fps > 0 && chosen.fps > ultra.fps
      ? Math.round(((chosen.fps - ultra.fps) / ultra.fps) * 100)
      : null;

  const fallbackQuery =
    limiter === "GPU"
      ? "tarjeta gráfica gaming"
      : limiter === "CPU"
        ? "procesador gaming"
        : "PC gaming";

  return {
    percent,
    severity: severityOf(percent),
    limiter,
    headline: copy.headline,
    detail: copy.detail,
    kind: chosen?.kind ?? null,
    productName: chosen?.name ?? null,
    searchQuery: chosen?.name ?? fallbackQuery,
    fromFps: ultra.fps,
    toFps: chosen ? chosen.fps : null,
    gainPct,
  };
}

export function buildReport(cpuId: string, gpuId: string, gameId: string): Report {
  const cpu = findById(cpus, cpuId);
  const gpu = findById(gpus, gpuId);
  const game = findById(games, gameId);

  const cells = {} as Report["cells"];
  const capped = {} as Report["capped"];
  const advice = {} as Report["advice"];

  for (const resolution of RESOLUTIONS) {
    cells[resolution] = {} as Record<Preset, number>;
    capped[resolution] = {} as Record<Preset, boolean>;
    for (const preset of PRESETS) {
      const result = frameRates(cpu, gpu, game, resolution, preset);
      cells[resolution][preset] = result.fps;
      capped[resolution][preset] = result.capped;
    }
    advice[resolution] = adviceFor(cpu, gpu, game, resolution);
  }

  return {
    cpuName: cpu.name,
    gpuName: gpu.name,
    gameName: game.name,
    projected: game.projected,
    hasCap: game.fpsCap != null,
    cells,
    capped,
    advice,
  };
}
