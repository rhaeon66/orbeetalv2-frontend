import AdminRoot from "@/components/admin/AdminRoot";

export const metadata = {
  title: "Admin — Orbeetal",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }) {
  return <AdminRoot>{children}</AdminRoot>;
}
