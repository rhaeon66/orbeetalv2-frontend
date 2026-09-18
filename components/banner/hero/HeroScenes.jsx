"use client";

import SlideMedia from "./SlideMedia";
import { ChipLayer } from "./HeroChip";

const SCREEN = "(max-width: 1024px) 90vw, 520px";

function BrowserChrome({ children }) {
  return (
    <div className="overflow-hidden rounded-[1.35rem] border border-line bg-cream shadow-[var(--shadow-md)]">
      <div className="flex items-center gap-1.5 border-b border-line bg-pale px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-[#E27A7A]" />
        <span className="h-2 w-2 rounded-full bg-[#F4C542]" />
        <span className="h-2 w-2 rounded-full bg-accent" />
        <span className="ml-2 h-2 flex-1 rounded-full bg-line/80" />
      </div>
      {children}
    </div>
  );
}

function PhoneFrame({ children, className = "" }) {
  return (
    <div
      className={`overflow-hidden rounded-[1.6rem] border-[3px] border-sage bg-sage shadow-[var(--shadow-lg)] ${className}`}
    >
      <div className="relative overflow-hidden rounded-[1.35rem] bg-cream">
        <div className="absolute left-1/2 top-1.5 z-10 h-1.5 w-10 -translate-x-1/2 rounded-full bg-sage/80" />
        {children}
      </div>
    </div>
  );
}

export function WebScene({ image, alt, theme }) {
  return (
    <div className="relative h-full min-h-[240px] w-full sm:min-h-[300px]">
      <div className="absolute inset-x-0 top-4 sm:top-6">
        <BrowserChrome>
          <div className="relative aspect-[16/10] bg-pale">
            <SlideMedia src={image} alt={alt} className="object-cover" sizes={SCREEN} />
          </div>
        </BrowserChrome>
      </div>
      <PhoneFrame className="absolute -bottom-1 left-2 w-[28%] max-w-[7.5rem] sm:left-4">
        <div className="relative aspect-[9/16] bg-pale">
          <SlideMedia src={image} alt="" className="object-cover object-left" sizes="120px" />
        </div>
      </PhoneFrame>
      <ChipLayer
        chips={theme.chips}
        color={theme.accent}
        positions={["top-0 right-0", "top-[42%] -right-1 sm:right-2", "bottom-10 left-[34%]"]}
      />
    </div>
  );
}

export function MobileScene({ image, alt, theme }) {
  return (
    <div className="relative flex h-full min-h-[260px] items-end justify-center gap-3 pb-2 sm:min-h-[320px] sm:gap-4">
      <PhoneFrame className="w-[38%] max-w-[9.5rem] -rotate-[8deg] translate-y-4 opacity-90">
        <div className="relative aspect-[9/17] bg-pale">
          <SlideMedia src={image} alt="" className="object-cover opacity-90" sizes="160px" />
        </div>
      </PhoneFrame>
      <PhoneFrame className="relative z-10 w-[46%] max-w-[11.5rem]">
        <div className="relative aspect-[9/17] bg-pale">
          <SlideMedia src={image} alt={alt} className="object-cover" sizes="200px" />
        </div>
      </PhoneFrame>
      <ChipLayer
        chips={theme.chips}
        color={theme.secondary}
        positions={["top-2 right-0", "bottom-16 -left-1", "bottom-4 right-2"]}
      />
    </div>
  );
}

export function AiScene({ image, alt, theme }) {
  const steps = ["Analyze", "Automate", "Generate", "Optimize"];

  return (
    <div className="relative grid h-full min-h-[240px] grid-cols-[0.9fr_1.1fr] items-center gap-3 sm:min-h-[300px] sm:gap-4">
      <div className="rounded-[1.25rem] border border-line bg-cream p-3 shadow-[var(--shadow-sm)] sm:p-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink-500">Workflow</p>
        <ul className="mt-3 space-y-2">
          {steps.map((step, index) => (
            <li key={step} className="flex items-center gap-2 text-xs font-semibold text-ink-800">
              <span
                className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-extrabold text-ink-900"
                style={{ background: index === 3 ? theme.accent : theme.primary }}
              >
                {index + 1}
              </span>
              {step}
            </li>
          ))}
        </ul>
      </div>
      <div className="relative overflow-hidden rounded-[1.25rem] border border-line bg-cream shadow-[var(--shadow-md)]">
        <div className="flex items-center justify-between border-b border-line px-3 py-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-ink-500">Assistant</span>
          <span className="h-2 w-2 rounded-full" style={{ background: theme.accent }} />
        </div>
        <div className="relative aspect-[5/4] bg-pale">
          <SlideMedia src={image} alt={alt} className="object-contain p-4" sizes={SCREEN} />
        </div>
      </div>
      <ChipLayer
        chips={theme.chips}
        color={theme.secondary}
        positions={["-top-1 right-0", "bottom-2 left-[8%]"]}
      />
    </div>
  );
}

export function GrowthScene({ image, alt, theme }) {
  return (
    <div className="relative h-full min-h-[240px] sm:min-h-[300px]">
      <div className="grid h-full grid-cols-[1.1fr_0.9fr] items-stretch gap-3">
        <div className="flex flex-col overflow-hidden rounded-[1.25rem] border border-line bg-cream shadow-[var(--shadow-md)]">
          <div className="flex items-center justify-between px-3 py-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-ink-500">
              Growth
            </span>
            <span className="text-[10px] font-bold" style={{ color: theme.primary }}>
              Live
            </span>
          </div>
          <svg viewBox="0 0 220 110" className="mt-1 w-full px-2" aria-hidden>
            <defs>
              <linearGradient id={`growthFill-${theme.id}`} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor={theme.primary} stopOpacity="0.28" />
                <stop offset="100%" stopColor={theme.primary} stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M8 92 C 40 88, 48 70, 72 68 C 96 66, 108 40, 132 38 C 156 36, 168 22, 212 14 L 212 102 L 8 102 Z"
              fill={`url(#growthFill-${theme.id})`}
            />
            <path
              d="M8 92 C 40 88, 48 70, 72 68 C 96 66, 108 40, 132 38 C 156 36, 168 22, 212 14"
              fill="none"
              stroke={theme.primary}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <circle cx="212" cy="14" r="4" fill={theme.secondary} />
          </svg>
          <div className="mt-auto grid grid-cols-3 gap-1.5 p-3">
            {["Reach", "Leads", "Revenue"].map((label) => (
              <div key={label} className="rounded-lg bg-pale px-2 py-1.5 text-center">
                <p className="text-[9px] font-bold uppercase tracking-wide text-ink-500">{label}</p>
                <span className="mt-1 block h-1 rounded-full" style={{ background: theme.accent }} />
              </div>
            ))}
          </div>
        </div>
        <div className="relative overflow-hidden rounded-[1.25rem] border border-line bg-pale shadow-[var(--shadow-sm)]">
          <SlideMedia src={image} alt={alt} className="object-cover" sizes="240px" />
        </div>
      </div>
      <ChipLayer
        chips={theme.chips}
        color={theme.secondary}
        positions={["top-0 right-0", "bottom-2 left-[42%]"]}
      />
    </div>
  );
}

export function CloudScene({ image, alt, theme }) {
  return (
    <div className="relative flex h-full min-h-[240px] items-center justify-center sm:min-h-[300px]">
      <div className="relative w-full max-w-md">
        <div
          className="mx-auto h-16 w-40 rounded-[2rem] blur-[1px] sm:h-20 sm:w-48"
          style={{ background: `linear-gradient(180deg, ${theme.secondary}55, ${theme.primary}33)` }}
        />
        <div className="relative -mt-6 overflow-hidden rounded-[1.25rem] border border-line bg-cream shadow-[var(--shadow-lg)]">
          <div className="flex items-center gap-2 border-b border-line px-3 py-2">
            <span className="h-2 w-2 rounded-full" style={{ background: theme.accent }} />
            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-ink-500">
              Console
            </span>
          </div>
          <div className="relative aspect-[16/10] bg-pale">
            <SlideMedia src={image} alt={alt} className="object-contain p-3" sizes={SCREEN} />
          </div>
        </div>
        <div className="mt-3 flex justify-center gap-2">
          {["Compute", "Storage", "Network"].map((node) => (
            <span
              key={node}
              className="rounded-full border border-line bg-cream px-2.5 py-1 text-[10px] font-bold text-ink-700 shadow-[var(--shadow-sm)]"
            >
              {node}
            </span>
          ))}
        </div>
      </div>
      <ChipLayer
        chips={theme.chips}
        color={theme.secondary}
        positions={["top-1 left-0", "top-8 right-0", "bottom-8 left-2"]}
      />
    </div>
  );
}

const SCENES = {
  web: WebScene,
  mobile: MobileScene,
  ai: AiScene,
  growth: GrowthScene,
  cloud: CloudScene,
};

export function HeroScene({ theme, image, alt }) {
  const Scene = SCENES[theme.id] || WebScene;
  return <Scene image={image} alt={alt} theme={theme} />;
}
