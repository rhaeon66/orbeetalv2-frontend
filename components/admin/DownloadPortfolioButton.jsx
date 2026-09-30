"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FileText, Loader2, X } from "lucide-react";
import { useDownloadPortfolioMutation } from "@/redux/features/admin/dashboardApi";
import { useGetAdminProjectsQuery } from "@/redux/features/cms/projectsApi";
import { useGetAdminProductsQuery } from "@/redux/features/cms/productsApi";

function downloadError(error) {
  if (!error) return "Could not download the portfolio.";
  if (error.status === "FETCH_ERROR") {
    return "Could not reach the API. Confirm the backend is running.";
  }
  if (typeof error.data?.detail === "string") return error.data.detail;
  if (error instanceof Error) return error.message;
  return "Could not download the portfolio.";
}

function SelectionGroup({ title, note, items, selected, onToggle, onToggleAll }) {
  if (!items.length) return null;
  const keys = items.map((item) => item.key);
  const allOn = keys.every((key) => selected.has(key));
  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-ink-900">{title}</h3>
          {note ? <p className="text-xs text-ink-500">{note}</p> : null}
        </div>
        <button type="button" onClick={() => onToggleAll(keys, !allOn)} className="text-xs font-bold text-primary">
          {allOn ? "Clear" : "Select all"}
        </button>
      </div>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.key}>
            <label className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-ink-800 hover:bg-surface-muted">
              <input
                type="checkbox"
                checked={selected.has(item.key)}
                onChange={() => onToggle(item.key)}
              />
              <span className="min-w-0 flex-1 truncate">{item.label}</span>
              {item.meta ? <span className="shrink-0 text-xs text-ink-500">{item.meta}</span> : null}
            </label>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function DownloadPortfolioButton({
  variant = "teal",
  className = "",
  label = "Download PDF",
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(() => new Set());
  const [error, setError] = useState("");
  const primed = useRef(false);
  const { data: projects = [], isLoading: projectsLoading } = useGetAdminProjectsQuery(undefined, {
    skip: !open,
  });
  const { data: products = [], isLoading: productsLoading } = useGetAdminProductsQuery(undefined, {
    skip: !open,
  });
  const [downloadPortfolio, { isLoading: pending }] = useDownloadPortfolioMutation();

  const groups = useMemo(() => {
    const projectItem = (project) => ({
      key: `project:${project.id}`,
      label: project.name,
      meta: project.project_type || "",
    });
    const productItem = (product) => ({
      key: `product:${product.id}`,
      label: product.name,
      meta: product.project_type || "",
    });
    return [
      {
        title: "Projects",
        note: "Finished work that can appear on the website.",
        items: projects.filter((item) => (item.status || "finished") === "finished").map(projectItem),
      },
      {
        title: "Products",
        note: "Company products.",
        items: products.map(productItem),
      },
      {
        title: "Running",
        note: "Admin only. Not shown on the website.",
        items: projects.filter((item) => item.status === "running").map(projectItem),
      },
      {
        title: "Upcoming",
        note: "Admin only. Not shown on the website.",
        items: projects.filter((item) => item.status === "upcoming").map(projectItem),
      },
    ];
  }, [products, projects]);

  useEffect(() => {
    if (!open) {
      primed.current = false;
      return;
    }
    if (primed.current || projectsLoading || productsLoading) return;
    primed.current = true;
    const next = new Set();
    projects
      .filter((item) => (item.status || "finished") === "finished")
      .forEach((item) => next.add(`project:${item.id}`));
    products.forEach((item) => next.add(`product:${item.id}`));
    setSelected(next);
  }, [open, products, productsLoading, projects, projectsLoading]);

  function openPicker() {
    setError("");
    setOpen(true);
  }

  function toggle(key) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function toggleAll(keys, on) {
    setSelected((prev) => {
      const next = new Set(prev);
      keys.forEach((key) => {
        if (on) next.add(key);
        else next.delete(key);
      });
      return next;
    });
  }

  async function handleDownload() {
    const projectIds = [];
    const productIds = [];
    selected.forEach((key) => {
      const [kind, id] = key.split(":");
      const number = Number(id);
      if (!number) return;
      if (kind === "project") projectIds.push(number);
      if (kind === "product") productIds.push(number);
    });
    if (!projectIds.length && !productIds.length) {
      setError("Select at least one project or product.");
      return;
    }
    setError("");
    try {
      const payload = await downloadPortfolio({
        projects: projectIds,
        products: productIds,
      }).unwrap();
      if (!(payload instanceof Blob)) {
        throw new Error(payload?.detail || "Could not generate the portfolio.");
      }
      const stamp = new Date().toISOString().slice(0, 10);
      const url = URL.createObjectURL(payload);
      const link = document.createElement("a");
      link.href = url;
      link.download = `orbeetal-portfolio-${stamp}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setOpen(false);
    } catch (err) {
      setError(downloadError(err));
    }
  }

  const styles =
    variant === "sidebar"
      ? "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-semibold text-white/80 hover:bg-white/10 hover:text-white disabled:opacity-60"
      : variant === "ghost"
        ? "btn btn-ghost btn-sm rounded-lg"
        : "btn btn-teal btn-sm rounded-lg";
  const loading = projectsLoading || productsLoading;

  return (
    <div className={className}>
      <button type="button" onClick={openPicker} className={styles} aria-label="Download PDF portfolio">
        <FileText size={16} aria-hidden />
        {label}
      </button>
      {open ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-sage/80 backdrop-blur-sm"
            aria-label="Close portfolio picker"
            onClick={() => setOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="portfolio-picker-title"
            className="card relative z-[1] flex max-h-[min(85vh,42rem)] w-full max-w-lg flex-col overflow-hidden"
          >
            <div className="flex items-start justify-between gap-3 border-b border-line px-5 py-4">
              <div>
                <h2 id="portfolio-picker-title" className="text-lg font-bold text-ink-900">
                  Portfolio PDF
                </h2>
                <p className="mt-1 text-sm text-ink-500">
                  Choose what goes in the file. Running and upcoming pages stay out of the public site.
                </p>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="icon-btn h-10 w-10" aria-label="Close">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-5 overflow-y-auto px-5 py-4">
              {loading ? (
                <p className="flex items-center gap-2 text-sm font-semibold text-ink-500">
                  <Loader2 size={16} className="animate-spin" aria-hidden />
                  Loading projects…
                </p>
              ) : (
                groups.map((group) => (
                  <SelectionGroup
                    key={group.title}
                    {...group}
                    selected={selected}
                    onToggle={toggle}
                    onToggleAll={toggleAll}
                  />
                ))
              )}
              {error ? (
                <p className="text-xs font-semibold text-red-700" role="alert">
                  {error}
                </p>
              ) : null}
            </div>
            <div className="flex justify-end gap-2 border-t border-line px-5 py-4">
              <button type="button" onClick={() => setOpen(false)} className="btn btn-ghost btn-sm">
                Cancel
              </button>
              <button type="button" onClick={handleDownload} disabled={pending || loading} className="btn btn-primary btn-sm">
                {pending ? <Loader2 size={16} className="animate-spin" aria-hidden /> : <FileText size={16} aria-hidden />}
                {pending ? "Generating…" : "Download PDF"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
