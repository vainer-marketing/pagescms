// Resolves "View site" and "View live" URLs from .pages.yml config.
// - site.baseUrl (root): the deployed site origin, e.g. "https://sarafreed.com"
// - view.liveUrl (per content entry): a path template using {slug} or {fields.x}

import { interpolate } from "@/lib/schema";
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
  const template = schema?.view?.liveUrl;
  if (!baseUrl || typeof template !== "string" || !template.trim()) return null;
  if (!path) return null;

  const fileBase = getFileName(path).replace(/\.[^.]+$/, "");
  const data: Record<string, any> = {
    slug: fileBase,
    fields: fields ?? {},
  };

  let resolved = interpolate(template, data, "fields").trim();
  if (!resolved) return null;
  if (!resolved.startsWith("/")) resolved = `/${resolved}`;
  return `${baseUrl}${resolved}`;
}
