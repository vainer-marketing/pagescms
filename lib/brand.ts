// Vainer CMS brand constants + helpers.
// See docs/superpowers/specs/2026-05-27-vainer-cms-rebrand-design.md

export const BRAND_NAME = "Vainer CMS";

export const BRAND_COLORS = {
  yellow: "#fece04",
  dark: "#111113",
  darker: "#08090a",
} as const;

// Per-repo friendly-name overrides for when auto-derivation isn't ideal.
const PROJECT_NAME_OVERRIDES: Record<string, string> = {
  "project-sara-freed": "Sara Freed",
};

/**
 * Client-friendly project name derived from a repo name.
 * Strips a leading "project-"/"project_" and title-cases the rest:
 *   "project-sara-freed" -> "Sara Freed"
 * Falls back to the raw repo if nothing sensible can be derived.
 * Clients should never see the owner or the raw "owner/repo" slug.
 */
export function friendlyProjectName(repo: string): string {
  if (!repo) return "";
  const override = PROJECT_NAME_OVERRIDES[repo.toLowerCase()];
  if (override) return override;
  const humanized = repo
    .replace(/^project[-_]/i, "")
    .split(/[-_]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  return humanized || repo;
}
