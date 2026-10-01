"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { X } from "lucide-react";
import TechLogo from "@/components/tech/TechLogo";
import {
  useCreateTechnologyMutation,
  useGetTechnologiesQuery,
} from "@/redux/features/cms/technologiesApi";
import { ADMIN_INPUT, formErrorMessage } from "./form";

export function normalizeStack(items) {
  if (!Array.isArray(items)) return [];
  return items
    .map((item) => {
      if (typeof item === "string") return { name: item.trim(), logo: "" };
      if (item && typeof item === "object") {
        return { name: String(item.name || "").trim(), logo: String(item.logo || "") };
      }
      return { name: "", logo: "" };
    })
    .filter((item) => item.name);
}

export default function StackPicker({ value = [], onChange, error }) {
  const listId = useId();
  const rootRef = useRef(null);
  const { data: technologies = [], isLoading, error: loadError } = useGetTechnologiesQuery();
  const [createTechnology, { isLoading: creating }] = useCreateTechnologyMutation();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [addError, setAddError] = useState("");

  const selected = useMemo(
    () => new Set(value.map((item) => item.name.toLowerCase())),
    [value]
  );
  const needle = query.trim().toLowerCase();
  const filtered = technologies.filter((item) => {
    if (selected.has(item.name.toLowerCase())) return false;
    if (!needle) return true;
    return item.name.toLowerCase().includes(needle);
  });
  const exact = technologies.some((item) => item.name.toLowerCase() === needle);
  const canAdd = Boolean(needle) && !exact && !selected.has(needle);
  const options = [
    ...filtered.map((tech) => ({ tech, custom: false })),
    ...(canAdd ? [{ tech: null, custom: true }] : []),
  ];

  useEffect(() => {
    setActive(0);
  }, [query, open]);

  useEffect(() => {
    function onPointerDown(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  function addTech(tech) {
    if (!tech?.name || selected.has(tech.name.toLowerCase())) return;
    onChange([...value, { name: tech.name, logo: tech.logo || "" }]);
    setQuery("");
    setAddError("");
    setOpen(true);
  }

  function removeTech(name) {
    onChange(value.filter((item) => item.name !== name));
  }

  async function addCustom() {
    const name = query.trim();
    if (!name) return;
    try {
      const created = await createTechnology({ name }).unwrap();
      addTech(created);
    } catch (err) {
      setAddError(formErrorMessage(err));
    }
  }

  function onKeyDown(event) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setActive((index) => Math.min(index + 1, Math.max(options.length - 1, 0)));
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
      setActive((index) => Math.max(index - 1, 0));
      return;
    }
    if (event.key === "Escape") {
      setOpen(false);
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      const option = options[active];
      if (!option) return;
      if (option.custom) addCustom();
      else addTech(option.tech);
      return;
    }
    if (event.key === "Backspace" && !query && value.length) {
      removeTech(value[value.length - 1].name);
    }
  }

  return (
    <div ref={rootRef} className="space-y-3">
      {value.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {value.map((item) => (
            <li key={item.name}>
              <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-2 py-1 text-sm font-semibold text-ink-800">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white p-0.5">
                  <TechLogo name={item.name} logo={item.logo} />
                </span>
                {item.name}
                <button
                  type="button"
                  onClick={() => removeTech(item.name)}
                  className="rounded-full p-0.5 text-ink-400 hover:text-red-700"
                  aria-label={`Remove ${item.name}`}
                >
                  <X size={14} />
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}

      <div className="relative">
        <input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
            setAddError("");
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          className={ADMIN_INPUT}
          placeholder="Search technologies"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
        />
        {open && (
          <ul
            id={listId}
            role="listbox"
            className="absolute z-20 mt-1 max-h-64 w-full overflow-auto rounded-xl border border-line bg-cream py-1 shadow-lg"
          >
            {isLoading && (
              <li className="px-3 py-2 text-sm text-ink-500">Loading technologies…</li>
            )}
            {!isLoading &&
              options.map((option, index) =>
                option.custom ? (
                  <li key="custom" role="option" aria-selected={index === active}>
                    <button
                      type="button"
                      onMouseDown={(event) => event.preventDefault()}
                      onMouseEnter={() => setActive(index)}
                      onClick={addCustom}
                      disabled={creating}
                      className={`flex w-full items-center px-3 py-2 text-left text-sm font-semibold ${
                        index === active ? "bg-primary-light text-primary" : "text-ink-800"
                      }`}
                    >
                      {creating ? "Saving…" : `Add “${query.trim()}”`}
                    </button>
                  </li>
                ) : (
                  <li key={option.tech.id} role="option" aria-selected={index === active}>
                    <button
                      type="button"
                      onMouseDown={(event) => event.preventDefault()}
                      onMouseEnter={() => setActive(index)}
                      onClick={() => addTech(option.tech)}
                      className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-semibold ${
                        index === active ? "bg-primary-light text-primary" : "text-ink-800"
                      }`}
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white p-0.5">
                        <TechLogo name={option.tech.name} logo={option.tech.logo} />
                      </span>
                      {option.tech.name}
                    </button>
                  </li>
                )
              )}
            {!isLoading && options.length === 0 && (
              <li className="px-3 py-2 text-sm text-ink-500">No matching technologies</li>
            )}
          </ul>
        )}
      </div>
      <p className="text-xs text-ink-500">
        Recently used technologies stay at the top. Each choice is saved with its logo.
      </p>
      {(error || addError || loadError) && (
        <p className="text-xs font-semibold text-red-700">
          {error || addError || formErrorMessage(loadError)}
        </p>
      )}
    </div>
  );
}
