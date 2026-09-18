"use client";

import { useState } from "react";
import { FileText, Loader2 } from "lucide-react";
import { useDownloadPortfolioMutation } from "@/redux/features/admin/dashboardApi";

function downloadError(error) {
  if (!error) return "Could not download the portfolio.";
  if (error.status === "FETCH_ERROR") {
    return "Could not reach the API. Confirm the backend is running.";
  }
  if (typeof error.data?.detail === "string") return error.data.detail;
  if (error instanceof Error) return error.message;
  return "Could not download the portfolio.";
}

export default function DownloadPortfolioButton({
  variant = "teal",
  className = "",
  label = "Download PDF",
}) {
  const [downloadPortfolio, { isLoading: pending }] = useDownloadPortfolioMutation();
  const [error, setError] = useState("");

  async function handleClick() {
    setError("");
    try {
      const payload = await downloadPortfolio().unwrap();
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

  return (
    <div className={className}>
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        className={styles}
        aria-label="Download PDF portfolio"
      >
        {pending ? (
          <Loader2 size={16} className="animate-spin" aria-hidden />
        ) : (
          <FileText size={16} aria-hidden />
        )}
        {pending ? "Generating…" : label}
      </button>
      {error ? (
        <p className="mt-2 text-xs font-semibold text-red-700" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
