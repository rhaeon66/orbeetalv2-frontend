/** Repeating page band colors: Color 1 → Color 2 → Color 3. */
export const PAGE_SURFACES = ["bg-sage", "bg-pale", "bg-cream"];
export const PAGE_SURFACE_TOKENS = ["var(--sage)", "var(--pale)", "var(--cream)"];

export function pageSurface(index) {
  return PAGE_SURFACES[index % PAGE_SURFACES.length];
}

export function pageSurfaceToken(index) {
  return PAGE_SURFACE_TOKENS[index % PAGE_SURFACE_TOKENS.length];
}

export const homepageSurface = pageSurface;
