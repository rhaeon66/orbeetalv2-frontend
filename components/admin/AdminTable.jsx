export default function AdminTable({ children }) {
  return (
    <div className="table-scroll overflow-x-auto rounded-2xl border border-line bg-cream">
      <table className="w-full min-w-[40rem] text-left text-sm">{children}</table>
    </div>
  );
}
