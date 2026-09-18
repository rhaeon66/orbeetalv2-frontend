export default function StatusBadge({ active }) {
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide ${
        active
          ? "bg-accent-light text-primary-deep"
          : "bg-surface-muted text-ink-500"
      }`}
    >
      {active ? "Active" : "Hidden"}
    </span>
  );
}
