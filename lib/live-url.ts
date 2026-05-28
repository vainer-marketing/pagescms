// Resolves "View site" and "View live" URLs from .pages.yml config.
// - site.baseUrl (root): the deployed site origin, e.g. "https://sarafreed.com"
// - view.liveUrl (per content entry): a path template using {slug} or {fields.x}.
//   May be a single string or an array of templates (fallback chain).

import { safeAccess } from "@/lib/schema";
import { getFileName } from "@/lib/utils/file";

const stripTrailingSlash = (value: string) => value.replace(/\/+$/, "");

const resolveConfigObject = (config: any): Record<string, any> | null => {
  if (!config) return null;
  if (config.object && typeof config.object === "object") return config.object;
  if (typeof config === "object") return config;
  return null;
};

export function getSiteBaseUrl(config: any): string | null {
  const obj = resolveConfigObject(config);
  const baseUrl = obj?.site?.baseUrl;
  if (typeof baseUrl !== "string" || !baseUrl.trim()) return null;
  return stripTrailingSlash(baseUrl.trim());
}

// Resolve a single template against the data. Returns null if any referenced
// token is missing or empty — caller can fall back to the next template.
const tryResolveTemplate = (
  template: string,
  data: Record<string, any>,
): string | null => {
  let allResolved = true;
  const result = template.replace(/(?<!\\)\{([^}]+)\}/g, (_, token: string) => {
    let value: unknown = safeAccess(data, token);
    if (value === undefined && data.fields) {
      value = safeAccess(data, `fields.${token}`);
    }
    if (value === undefined || value === null || value === "") {
      allResolved = false;
      return "";
    }
    return String(value);
  }).replace(/\\([{}])/g, "$1");
  return allResolved ? result : null;
};

// Returns every {fields.x} or {x} token referenced by the configured liveUrl
// templates so callers (e.g. the collection list) can request those fields.
export function getLiveUrlReferencedFields(schema: any): string[] {
  const liveUrl = schema?.view?.liveUrl;
  const templates: string[] = Array.isArray(liveUrl)
    ? liveUrl.filter((t): t is string => typeof t === "string")
    : typeof liveUrl === "string"
      ? [liveUrl]
      : [];
  const tokens = new Set<string>();
  templates.forEach((template) => {
    for (const match of template.matchAll(/(?<!\\)\{([^}]+)\}/g)) {
      const token = match[1];
      if (token === "slug") continue;
      const stripped = token.startsWith("fields.") ? token.slice("fields.".length) : token;
      tokens.add(stripped);
    }
  });
  return Array.from(tokens);
}

export function resolveEntryLiveUrl({
  config,
  schema,
  path,
  fields,
}: {
  config: any;
  schema: any;
  path?: string | null;
  fields?: Record<string, any> | null;
}): string | null {
  const baseUrl = getSiteBaseUrl(config);
  const liveUrl = schema?.view?.liveUrl;
  const templates: string[] = Array.isArray(liveUrl)
    ? liveUrl.filter((t): t is string => typeof t === "string" && t.trim().length > 0)
    : typeof liveUrl === "string" && liveUrl.trim()
      ? [liveUrl]
      : [];
  if (!baseUrl || templates.length === 0 || !path) return null;

  const fileBase = getFileName(path).replace(/\.[^.]+$/, "");
  const data: Record<string, any> = {
    slug: fileBase,
    fields: fields ?? {},
  };

  for (const template of templates) {
    const resolved = tryResolveTemplate(template, data);
    if (resolved == null) continue;
    const trimmed = resolved.trim();
    if (!trimmed) continue;
    const joined = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
    return `${baseUrl}${joined}`;
  }

  return null;
}
