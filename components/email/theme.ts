// Email-safe brand colors. Email clients can't rely on CSS variables or OKLCH,
// so the Vainer brand (yellow #fece04 accent, near-black #111113) is hard-coded here.
export const emailTheme = {
  background: "#ffffff",
  foreground: "#111113",
  mutedForeground: "#737373",
  link: "#111113",
  mutedLink: "#737373",
  headerBackground: "#111113",
  buttonBackground: "#fece04",
  buttonForeground: "#111113",
  buttonBorder: "#fece04",
} as const;
