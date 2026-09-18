import { FaFacebook, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import { FiMail } from "react-icons/fi";
import { SITE } from "@/lib/site";

const CHANNELS = [
  {
    label: "Email",
    value: SITE.email,
    href: `mailto:${SITE.email}`,
    icon: FiMail,
  },
  {
    label: "WhatsApp",
    value: SITE.phoneDisplay,
    href: SITE.whatsapp,
    icon: FaWhatsapp,
  },
  {
    label: "Facebook",
    value: "facebook.com/Orbeetal",
    href: SITE.facebook,
    icon: FaFacebook,
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/company/orbeetal",
    href: SITE.linkedin,
    icon: FaLinkedin,
  },
];

export default function ContactChannels() {
  return (
    <ul className="mt-8 grid gap-3 sm:grid-cols-2">
      {CHANNELS.map(({ label, value, href, icon: Icon }) => (
        <li key={label}>
          <a
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel={href.startsWith("http") ? "noreferrer" : undefined}
            className="card flex items-center gap-3 p-4 transition hover:border-cyan/45"
          >
            <span className="icon-well">
              <Icon size={18} />
            </span>
            <span className="min-w-0">
              <span className="block text-[11px] font-bold uppercase tracking-[0.14em] text-cyan-ink">
                {label}
              </span>
              <span className="mt-0.5 block truncate text-sm font-semibold text-ink-900">
                {value}
              </span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
