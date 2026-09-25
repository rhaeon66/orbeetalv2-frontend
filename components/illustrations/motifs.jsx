const STROKE = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.35,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

const SOFT = { ...STROKE, strokeWidth: 1.15, strokeOpacity: 0.48 };

function Frame({ children }) {
  return (
    <svg viewBox="0 0 160 160" fill="none" aria-hidden focusable="false">
      {children}
    </svg>
  );
}

export function MobileArt() {
  return (
    <Frame>
      <rect {...STROKE} x="52" y="18" width="56" height="124" rx="11" />
      <rect {...SOFT} x="60" y="34" width="40" height="82" rx="3" />
      <path {...STROKE} d="M70 26h20" />
      <rect {...STROKE} x="64" y="42" width="14" height="14" rx="2.5" />
      <rect {...STROKE} x="82" y="42" width="14" height="14" rx="2.5" />
      <rect {...STROKE} x="64" y="62" width="14" height="14" rx="2.5" />
      <rect {...STROKE} x="82" y="62" width="14" height="14" rx="2.5" />
      <path {...SOFT} d="M64 86h32M64 94h22" />
      <path {...STROKE} d="M72 132h16" />
    </Frame>
  );
}

export function WebArt() {
  return (
    <Frame>
      <rect {...STROKE} x="24" y="36" width="112" height="88" rx="10" />
      <path {...STROKE} d="M24 54h112" />
      <circle {...STROKE} cx="38" cy="45" r="2.4" />
      <circle {...STROKE} cx="48" cy="45" r="2.4" />
      <circle {...STROKE} cx="58" cy="45" r="2.4" />
      <rect {...SOFT} x="36" y="66" width="40" height="42" rx="4" />
      <path {...STROKE} d="M88 70h32M88 82h26M88 94h32M88 106h18" />
    </Frame>
  );
}

export function CodeArt() {
  return (
    <Frame>
      <rect {...STROKE} x="26" y="34" width="108" height="92" rx="10" />
      <path {...STROKE} d="M26 52h108" />
      <circle {...STROKE} cx="40" cy="43" r="2.4" />
      <circle {...STROKE} cx="50" cy="43" r="2.4" />
      <path {...STROKE} d="M48 72l-12 14 12 14M80 72l12 14-12 14" />
      <path {...SOFT} d="M62 100h10" />
      <path {...STROKE} d="M108 70v40" />
    </Frame>
  );
}

export function ShieldArt() {
  return (
    <Frame>
      <path
        {...STROKE}
        d="M80 22l46 16v36c0 28-18 48-46 64-28-16-46-36-46-64V38z"
      />
      <path
        {...SOFT}
        d="M80 38l30 10v24c0 18-12 32-30 44-18-12-30-26-30-44V48z"
      />
      <path {...STROKE} d="M80 62v28" />
      <circle {...STROKE} cx="80" cy="58" r="7" />
      <path {...STROKE} d="M68 96l12 10 20-22" />
    </Frame>
  );
}

export function AnalyticsArt() {
  return (
    <Frame>
      <path {...STROKE} d="M32 28v100h104" />
      <path {...STROKE} d="M48 108v-28M66 108V56M84 108V72M102 108V44M120 108V64" />
      <path {...SOFT} d="M48 78l18-24 18 14 18-26 18 18" />
      <circle {...STROKE} cx="48" cy="78" r="2.6" />
      <circle {...STROKE} cx="66" cy="54" r="2.6" />
      <circle {...STROKE} cx="84" cy="68" r="2.6" />
      <circle {...STROKE} cx="102" cy="42" r="2.6" />
      <circle {...STROKE} cx="120" cy="60" r="2.6" />
    </Frame>
  );
}

export function AiArt() {
  return (
    <Frame>
      <circle {...STROKE} cx="80" cy="80" r="16" />
      <circle {...STROKE} cx="80" cy="34" r="8" />
      <circle {...STROKE} cx="80" cy="126" r="8" />
      <circle {...STROKE} cx="38" cy="56" r="8" />
      <circle {...STROKE} cx="122" cy="56" r="8" />
      <circle {...STROKE} cx="38" cy="104" r="8" />
      <circle {...STROKE} cx="122" cy="104" r="8" />
      <path {...SOFT} d="M80 50v14M80 96v14M51 63l16 10M93 73l16-10M51 97l16-10M93 87l16 10" />
      <circle {...STROKE} cx="80" cy="80" r="4" />
    </Frame>
  );
}

export function CloudArt() {
  return (
    <Frame>
      <path
        {...STROKE}
        d="M56 104h52c14 0 24-10 24-22s-10-22-24-22c-2-16-16-28-32-28-18 0-32 12-36 28-12 2-22 12-22 24 0 12 10 20 22 20z"
      />
      <path {...SOFT} d="M56 118v10M80 118v16M104 118v10" />
      <circle {...STROKE} cx="56" cy="134" r="3" />
      <circle {...STROKE} cx="80" cy="140" r="3" />
      <circle {...STROKE} cx="104" cy="134" r="3" />
      <path {...SOFT} d="M68 72h28M74 84h16" />
    </Frame>
  );
}

export function EducationArt() {
  return (
    <Frame>
      <path {...STROKE} d="M80 44l56 22-56 22L24 66z" />
      <path {...STROKE} d="M80 88v36" />
      <path {...STROKE} d="M44 72v28c12 10 24 14 36 14s24-4 36-14V72" />
      <path {...SOFT} d="M80 44v44" />
      <path {...STROKE} d="M128 70v26" />
      <circle {...STROKE} cx="128" cy="100" r="4" />
    </Frame>
  );
}

export function FinanceArt() {
  return (
    <Frame>
      <rect {...STROKE} x="30" y="40" width="100" height="80" rx="10" />
      <path {...STROKE} d="M30 64h100" />
      <circle {...SOFT} cx="48" cy="52" r="3" />
      <circle {...SOFT} cx="60" cy="52" r="3" />
      <path {...STROKE} d="M48 112V86M64 112V78M80 112V70M96 112V90" />
      <path {...SOFT} d="M108 92a16 16 0 1 1-16-16" />
      <path {...STROKE} d="M108 76v16h-16" />
    </Frame>
  );
}

export function WorkflowArt() {
  return (
    <Frame>
      <rect {...STROKE} x="22" y="58" width="36" height="28" rx="6" />
      <rect {...STROKE} x="62" y="34" width="36" height="28" rx="6" />
      <rect {...STROKE} x="62" y="98" width="36" height="28" rx="6" />
      <rect {...STROKE} x="102" y="58" width="36" height="28" rx="6" />
      <path {...STROKE} d="M58 72h4M98 48h4M80 62v36M98 112h4M98 72h4" />
      <path {...STROKE} d="M54 72l6 0M94 48l6 0M94 112l6 0M94 72l6 0" />
      <path {...SOFT} d="M32 72h16M72 48h16M72 112h16M112 72h16" />
    </Frame>
  );
}

export function DesignArt() {
  return (
    <Frame>
      <rect {...STROKE} x="28" y="32" width="88" height="96" rx="8" />
      <path {...SOFT} d="M28 48h88M44 32v96" />
      <path {...STROKE} d="M58 112c18-40 42-48 54-20" />
      <circle {...STROKE} cx="58" cy="112" r="4.5" />
      <circle {...STROKE} cx="112" cy="92" r="4.5" />
      <path {...SOFT} d="M58 112l-12 16M112 92l16-10" />
      <circle {...STROKE} cx="46" cy="128" r="3" />
      <circle {...STROKE} cx="128" cy="82" r="3" />
    </Frame>
  );
}

export function MarketingArt() {
  return (
    <Frame>
      <circle {...STROKE} cx="68" cy="86" r="36" />
      <circle {...SOFT} cx="68" cy="86" r="22" />
      <circle {...STROKE} cx="68" cy="86" r="8" />
      <path {...STROKE} d="M96 58l28-20M96 58l8 22M96 58l22 8" />
      <path {...SOFT} d="M112 118h20M120 110v16" />
    </Frame>
  );
}

export function ProductArt() {
  return (
    <Frame>
      <path {...STROKE} d="M80 28l48 22-48 22L32 50z" />
      <path {...STROKE} d="M80 72l48 22-48 22L32 94z" />
      <path {...SOFT} d="M80 50v22M32 50v44M128 50v44" />
      <path {...STROKE} d="M80 116l48 22-48 22L32 138z" />
      <path {...SOFT} d="M80 94v22M32 94v44M128 94v44" />
    </Frame>
  );
}

export function PlanningArt() {
  return (
    <Frame>
      <rect {...STROKE} x="42" y="34" width="76" height="100" rx="8" />
      <path {...STROKE} d="M60 34v-8h40v8" />
      <rect {...STROKE} x="70" y="18" width="20" height="16" rx="4" />
      <path {...STROKE} d="M58 64h44M58 80h44M58 96h28" />
      <circle {...STROKE} cx="108" cy="96" r="5" />
      <path {...SOFT} d="M58 112h36" />
    </Frame>
  );
}

export function OperationsArt() {
  return (
    <Frame>
      <circle {...STROKE} cx="62" cy="78" r="22" />
      <circle {...SOFT} cx="62" cy="78" r="8" />
      <path
        {...STROKE}
        d="M62 48v8M62 100v8M36 63l7 4M81 89l7 4M36 93l7-4M81 67l7-4"
      />
      <circle {...STROKE} cx="104" cy="96" r="18" />
      <circle {...SOFT} cx="104" cy="96" r="7" />
      <path
        {...STROKE}
        d="M104 72v6M104 114v6M84 84l5 3M119 105l5 3M84 108l5-3M119 87l5-3"
      />
    </Frame>
  );
}

export function ServerArt() {
  return (
    <Frame>
      <rect {...STROKE} x="36" y="30" width="88" height="28" rx="6" />
      <rect {...STROKE} x="36" y="66" width="88" height="28" rx="6" />
      <rect {...STROKE} x="36" y="102" width="88" height="28" rx="6" />
      <path {...SOFT} d="M48 44h40M48 80h40M48 116h40" />
      <circle {...STROKE} cx="108" cy="44" r="3.2" />
      <circle {...STROKE} cx="108" cy="80" r="3.2" />
      <circle {...STROKE} cx="108" cy="116" r="3.2" />
      <path {...STROKE} d="M80 58v8M80 94v8" />
    </Frame>
  );
}

export function CollaborationArt() {
  return (
    <Frame>
      <circle {...STROKE} cx="62" cy="72" r="22" />
      <circle {...STROKE} cx="98" cy="72" r="22" />
      <circle {...SOFT} cx="80" cy="102" r="22" />
      <circle {...STROKE} cx="62" cy="72" r="5" />
      <circle {...STROKE} cx="98" cy="72" r="5" />
      <circle {...STROKE} cx="80" cy="102" r="5" />
      <path {...SOFT} d="M67 90l8 6M93 90l-8 6M80 77v14" />
    </Frame>
  );
}

export function SupportArt() {
  return (
    <Frame>
      <path
        {...STROKE}
        d="M42 48h50c8 0 14 6 14 14v28c0 8-6 14-14 14H70l-16 16v-16H42c-8 0-14-6-14-14V62c0-8 6-14 14-14z"
      />
      <path
        {...SOFT}
        d="M78 36h40c8 0 14 6 14 14v24c0 8-6 14-14 14h-8l-12 12v-12h-6c-4 0-8-2-10-6"
      />
      <path {...STROKE} d="M48 68h22M48 80h14" />
    </Frame>
  );
}

export function GrowthArt() {
  return (
    <Frame>
      <path {...STROKE} d="M32 124h104" />
      <path {...STROKE} d="M48 124V96M72 124V78M96 124V60M120 124V42" />
      <path {...SOFT} d="M48 94c18-28 36-36 56-18" />
      <path {...STROKE} d="M92 48c8 6 14 18 16 30" />
      <path {...STROKE} d="M92 48c-10 8-14 20-12 34" />
      <circle {...STROKE} cx="92" cy="46" r="4" />
    </Frame>
  );
}

export function DiscoverArt() {
  return (
    <Frame>
      <circle {...STROKE} cx="58" cy="54" r="28" />
      <circle {...SOFT} cx="58" cy="54" r="14" />
      <path {...STROKE} d="M78 76l26 26" />
      <path {...SOFT} d="M46 54h24M58 42v24" />
    </Frame>
  );
}

export function DeployArt() {
  return (
    <Frame>
      <rect {...STROKE} x="30" y="96" width="100" height="32" rx="8" />
      <path {...SOFT} d="M42 112h20M110 112h12" />
      <circle {...STROKE} cx="80" cy="112" r="4" />
      <path {...STROKE} d="M80 88V36" />
      <path {...STROKE} d="M80 36l-16 18M80 36l16 18" />
      <rect {...SOFT} x="64" y="70" width="32" height="18" rx="4" />
    </Frame>
  );
}

export function CertificateArt() {
  return (
    <Frame>
      <path
        {...STROKE}
        d="M80 22l16 10 18-2 8 16 16 8-2 18 10 16-10 16 2 18-16 8-8 16-18-2-16 10-16-10-18 2-8-16-16-8 2-18-10-16 10-16-2-18 16-8 8-16 18 2z"
      />
      <circle {...STROKE} cx="80" cy="80" r="22" />
      <path {...STROKE} d="M70 80l8 8 16-16" />
    </Frame>
  );
}

export function ContactArt() {
  return (
    <Frame>
      <rect {...STROKE} x="28" y="44" width="104" height="72" rx="10" />
      <path {...STROKE} d="M28 58l52 32 52-32" />
      <path {...SOFT} d="M40 96h28M40 106h18" />
    </Frame>
  );
}

export function OrbitArt() {
  return (
    <Frame>
      <circle {...SOFT} cx="80" cy="80" r="18" />
      <circle {...STROKE} cx="80" cy="80" r="36" />
      <ellipse {...STROKE} cx="80" cy="80" rx="58" ry="24" />
      <ellipse {...SOFT} cx="80" cy="80" rx="24" ry="58" />
      <circle {...STROKE} cx="80" cy="22" r="4.5" />
      <circle {...STROKE} cx="136" cy="90" r="4.5" />
      <circle {...STROKE} cx="28" cy="98" r="4.5" />
    </Frame>
  );
}

export const MOTIFS = {
  mobile: MobileArt,
  web: WebArt,
  code: CodeArt,
  shield: ShieldArt,
  analytics: AnalyticsArt,
  ai: AiArt,
  cloud: CloudArt,
  education: EducationArt,
  finance: FinanceArt,
  workflow: WorkflowArt,
  design: DesignArt,
  marketing: MarketingArt,
  product: ProductArt,
  planning: PlanningArt,
  operations: OperationsArt,
  server: ServerArt,
  collaboration: CollaborationArt,
  support: SupportArt,
  growth: GrowthArt,
  discover: DiscoverArt,
  deploy: DeployArt,
  certificate: CertificateArt,
  contact: ContactArt,
  orbit: OrbitArt,
};
