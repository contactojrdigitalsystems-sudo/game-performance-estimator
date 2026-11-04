"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";

export type SelectOption = {
  id: string;
  name: string;
  hint: string;
};

export type SelectGroup = {
  label: string;
  options: SelectOption[];
};

type HardwareSelectProps = {
  label: string;
  groups: SelectGroup[];
  value: string;
  onChange: (id: string) => void;
};

export function HardwareSelect({ label, groups, value, onChange }: HardwareSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const buttonId = useId();

  const selected = useMemo(
    () => groups.flatMap((group) => group.options).find((option) => option.id === value),
    [groups, value],
  );

  useEffect(() => {
    function onPointer(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const normalized = query.trim().toLowerCase();
  const filtered = groups
    .map((group) => ({
      ...group,
      options: group.options.filter((option) =>
        `${option.name} ${option.hint} ${group.label}`.toLowerCase().includes(normalized),
      ),
    }))
    .filter((group) => group.options.length > 0);

  return (
    <div ref={rootRef} className="relative">
      <label
        htmlFor={buttonId}
        className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-violet-300"
      >
        {label}
      </label>
      <button
        id={buttonId}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center justify-between gap-3 rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-left transition hover:border-cyan-400/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
      >
        <span className="min-w-0">
          <span className="block truncate text-sm font-medium text-white">
            {selected?.name ?? "Selecciona"}
          </span>
          <span className="block truncate text-xs text-slate-400">{selected?.hint}</span>
        </span>
        <Chevron open={open} />
      </button>

      {open ? (
        <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-xl border border-violet-400/20 bg-slate-900 shadow-neon">
          <div className="border-b border-white/5 p-2">
            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar..."
              aria-label={`Buscar ${label}`}
              className="w-full rounded-lg bg-slate-950 px-3 py-2 text-sm text-white outline-none ring-1 ring-white/10 placeholder:text-slate-500 focus:ring-cyan-400/60"
            />
          </div>
          <ul id={listId} role="listbox" className="max-h-80 overflow-auto p-1">
            {filtered.length === 0 ? (
              <li className="px-3 py-6 text-center text-sm text-slate-500">Sin resultados</li>
            ) : (
              filtered.map((group) => (
                <li key={group.label || "catalogo"}>
                  {group.label ? (
                    <p className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                      {group.label}
                    </p>
                  ) : null}
                  <ul>
                    {group.options.map((option) => {
                      const active = option.id === value;
                      return (
                        <li key={option.id}>
                          <button
                            type="button"
                            role="option"
                            aria-selected={active}
                            onClick={() => {
                              onChange(option.id);
                              setOpen(false);
                              setQuery("");
                            }}
                            className={`flex w-full items-start justify-between gap-3 rounded-lg px-3 py-2 text-left transition ${
                              active
                                ? "bg-violet-500/15 text-cyan-200"
                                : "text-slate-200 hover:bg-white/5"
                            }`}
                          >
                            <span>
                              <span className="block text-sm font-medium">{option.name}</span>
                              <span className="block text-xs text-slate-400">{option.hint}</span>
                            </span>
                            {active ? (
                              <span className="mt-0.5 text-xs text-cyan-300">●</span>
                            ) : null}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              ))
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden
      className={`h-4 w-4 shrink-0 text-cyan-300 transition ${open ? "rotate-180" : ""}`}
    >
      <path
        d="M5 7.5 10 12.5 15 7.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
