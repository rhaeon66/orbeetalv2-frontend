import {
  Briefcase,
  Building2,
  FolderKanban,
  Handshake,
  HelpCircle,
  Home,
  ImageIcon,
  Images,
  Inbox,
  LayoutDashboard,
  Package,
  Quote,
  Shield,
  Users,
} from "lucide-react";

export const ADMIN_NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/homepage", label: "Homepage", icon: Home },
  { href: "/admin/slides", label: "Slides", icon: Images, countKey: "slides" },
  { href: "/admin/services", label: "Services", icon: Briefcase, countKey: "services" },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban, countKey: "projects" },
  { href: "/admin/products", label: "Products", icon: Package, countKey: "products" },
  { href: "/admin/team", label: "Team", icon: Users, countKey: "team_members" },
  { href: "/admin/testimonials", label: "Testimonials", icon: Quote, countKey: "testimonials" },
  { href: "/admin/faqs", label: "FAQs", icon: HelpCircle, countKey: "faqs" },
  { href: "/admin/clients", label: "Clients", icon: Handshake, countKey: "clients" },
  { href: "/admin/departments", label: "Departments", icon: Building2, countKey: "departments" },
  { href: "/admin/media", label: "Media Library", icon: ImageIcon },
  { href: "/admin/inquiries", label: "Inquiries", icon: Inbox, countKey: "inquiries" },
  { href: "/admin/users", label: "Users", icon: Shield },
];

export const ADMIN_SECTIONS = Object.fromEntries(
  ADMIN_NAV.filter((item) => item.href !== "/admin").map((item) => [
    item.href.replace("/admin/", ""),
    item,
  ])
);

export const DASHBOARD_METRICS = ADMIN_NAV.filter((item) => item.countKey);

export const DASHBOARD_FEATURED = [
  "/admin/projects",
  "/admin/services",
  "/admin/slides",
]
  .map((href) => ADMIN_NAV.find((item) => item.href === href))
  .filter(Boolean);

export const ADMIN_NAV_GROUPS = [
  {
    label: "",
    items: ADMIN_NAV.filter((item) => item.href === "/admin"),
  },
  {
    label: "Website",
    items: ADMIN_NAV.filter((item) =>
      [
        "/admin/homepage",
        "/admin/slides",
        "/admin/services",
        "/admin/projects",
        "/admin/products",
        "/admin/team",
        "/admin/testimonials",
        "/admin/faqs",
        "/admin/clients",
        "/admin/departments",
      ].includes(item.href)
    ),
  },
  {
    label: "Media",
    items: ADMIN_NAV.filter((item) => item.href === "/admin/media"),
  },
  {
    label: "Inquiries",
    items: ADMIN_NAV.filter((item) => item.href === "/admin/inquiries"),
  },
  {
    label: "System",
    items: ADMIN_NAV.filter((item) => item.href === "/admin/users"),
  },
];

export function isAdminNavActive(pathname, item) {
  if (item.exact) return pathname === item.href;
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export function getAdminPageMeta(pathname) {
  if (!pathname || pathname === "/admin") {
    return {
      title: "Dashboard",
      crumbs: [{ label: "Admin", href: "/admin" }, { label: "Dashboard" }],
    };
  }

  if (pathname === "/admin/slides/new") {
    return {
      title: "New slide",
      crumbs: [
        { label: "Admin", href: "/admin" },
        { label: "Slides", href: "/admin/slides" },
        { label: "New" },
      ],
    };
  }
  if (/^\/admin\/slides\/\d+/.test(pathname)) {
    return {
      title: "Edit slide",
      crumbs: [
        { label: "Admin", href: "/admin" },
        { label: "Slides", href: "/admin/slides" },
        { label: "Edit" },
      ],
    };
  }
  if (pathname === "/admin/projects/new") {
    return {
      title: "New project",
      crumbs: [
        { label: "Admin", href: "/admin" },
        { label: "Projects", href: "/admin/projects" },
        { label: "New" },
      ],
    };
  }
  if (/^\/admin\/projects\/\d+/.test(pathname)) {
    return {
      title: "Edit project",
      crumbs: [
        { label: "Admin", href: "/admin" },
        { label: "Projects", href: "/admin/projects" },
        { label: "Edit" },
      ],
    };
  }
  if (pathname === "/admin/services/new") {
    return {
      title: "New service",
      crumbs: [
        { label: "Admin", href: "/admin" },
        { label: "Services", href: "/admin/services" },
        { label: "New" },
      ],
    };
  }
  if (/^\/admin\/services\/\d+/.test(pathname)) {
    return {
      title: "Edit service",
      crumbs: [
        { label: "Admin", href: "/admin" },
        { label: "Services", href: "/admin/services" },
        { label: "Edit" },
      ],
    };
  }
  if (pathname === "/admin/team/new") {
    return {
      title: "New team member",
      crumbs: [
        { label: "Admin", href: "/admin" },
        { label: "Team", href: "/admin/team" },
        { label: "New" },
      ],
    };
  }
  if (/^\/admin\/team\/\d+/.test(pathname)) {
    return {
      title: "Edit team member",
      crumbs: [
        { label: "Admin", href: "/admin" },
        { label: "Team", href: "/admin/team" },
        { label: "Edit" },
      ],
    };
  }
  if (pathname === "/admin/testimonials/new") {
    return {
      title: "New testimonial",
      crumbs: [
        { label: "Admin", href: "/admin" },
        { label: "Testimonials", href: "/admin/testimonials" },
        { label: "New" },
      ],
    };
  }
  if (/^\/admin\/testimonials\/\d+/.test(pathname)) {
    return {
      title: "Edit testimonial",
      crumbs: [
        { label: "Admin", href: "/admin" },
        { label: "Testimonials", href: "/admin/testimonials" },
        { label: "Edit" },
      ],
    };
  }
  if (pathname === "/admin/faqs/new") {
    return {
      title: "New FAQ",
      crumbs: [
        { label: "Admin", href: "/admin" },
        { label: "FAQs", href: "/admin/faqs" },
        { label: "New" },
      ],
    };
  }
  if (/^\/admin\/faqs\/\d+/.test(pathname)) {
    return {
      title: "Edit FAQ",
      crumbs: [
        { label: "Admin", href: "/admin" },
        { label: "FAQs", href: "/admin/faqs" },
        { label: "Edit" },
      ],
    };
  }
  if (pathname === "/admin/products/new") {
    return {
      title: "New product",
      crumbs: [
        { label: "Admin", href: "/admin" },
        { label: "Products", href: "/admin/products" },
        { label: "New" },
      ],
    };
  }
  if (/^\/admin\/products\/\d+/.test(pathname)) {
    return {
      title: "Edit product",
      crumbs: [
        { label: "Admin", href: "/admin" },
        { label: "Products", href: "/admin/products" },
        { label: "Edit" },
      ],
    };
  }
  if (pathname === "/admin/departments/new") {
    return {
      title: "New department",
      crumbs: [
        { label: "Admin", href: "/admin" },
        { label: "Departments", href: "/admin/departments" },
        { label: "New" },
      ],
    };
  }
  if (/^\/admin\/departments\/\d+/.test(pathname)) {
    return {
      title: "Edit department",
      crumbs: [
        { label: "Admin", href: "/admin" },
        { label: "Departments", href: "/admin/departments" },
        { label: "Edit" },
      ],
    };
  }
  if (pathname === "/admin/inquiries") {
    return {
      title: "Inquiries",
      crumbs: [{ label: "Admin", href: "/admin" }, { label: "Inquiries" }],
    };
  }
  if (/^\/admin\/inquiries\/\d+/.test(pathname)) {
    return {
      title: "Inquiry",
      crumbs: [
        { label: "Admin", href: "/admin" },
        { label: "Inquiries", href: "/admin/inquiries" },
        { label: "View" },
      ],
    };
  }
  if (pathname === "/admin/users") {
    return {
      title: "Users",
      crumbs: [{ label: "Admin", href: "/admin" }, { label: "Users" }],
    };
  }
  if (pathname === "/admin/clients/new") {
    return {
      title: "New client",
      crumbs: [
        { label: "Admin", href: "/admin" },
        { label: "Clients", href: "/admin/clients" },
        { label: "New" },
      ],
    };
  }
  if (/^\/admin\/clients\/\d+/.test(pathname)) {
    return {
      title: "Edit client",
      crumbs: [
        { label: "Admin", href: "/admin" },
        { label: "Clients", href: "/admin/clients" },
        { label: "Edit" },
      ],
    };
  }

  const item = ADMIN_NAV.find(
    (entry) => entry.href !== "/admin" && isAdminNavActive(pathname, entry)
  );

  if (item) {
    return {
      title: item.label,
      crumbs: [{ label: "Admin", href: "/admin" }, { label: item.label }],
    };
  }

  return {
    title: "Admin",
    crumbs: [{ label: "Admin" }],
  };
}

export function safeAdminNext(value) {
  if (typeof value !== "string" || !value.startsWith("/admin")) return "/admin";
  if (value.startsWith("//") || value.includes("://")) return "/admin";
  return value;
}
