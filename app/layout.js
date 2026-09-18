import { Plus_Jakarta_Sans, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers/provider";
import SiteFooter from "@/components/layouts/SiteFooter";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import SiteChrome from "@/components/layouts/SiteChrome";
import { THEME_INIT_SCRIPT } from "@/lib/theme";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Orbeetal — Custom Software & Amazing IT Services",
  description:
    "Orbeetal builds custom software and delivers world-class IT services — web & mobile engineering, cloud, AI, cybersecurity and digital growth.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon512_rounded.png",
    apple: "/icons/icon512_rounded.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Orbeetal",
  },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#E0F0F6" },
    { media: "(prefers-color-scheme: dark)", color: "#071A2B" },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script
          id="orbeetal-theme"
          dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }}
        />
      </head>
      <Providers>
        <body
          className={`${plusJakarta.variable} ${geistSans.variable} ${geistMono.variable} antialiased min-h-screen overflow-x-hidden w-full max-w-full`}
        >
          <ServiceWorkerRegister />
          <SiteChrome>{children}</SiteChrome>
          <SiteFooter />
        </body>
      </Providers>
    </html>
  );
}
