"use client";

import { useEffect } from "react";
import { friendlyProjectName } from "@/lib/brand";

const APP_TITLE = "Vainer CMS";

export const formatDocumentTitle = (title?: string | null) =>
  title ? `${title} | ${APP_TITLE}` : APP_TITLE;

export const formatRepoBranchTitle = (
  title: string,
  owner: string,
  repo: string,
  branch?: string,
) => {
  return `${title} | ${friendlyProjectName(repo)}`;
};

export function DocumentTitle({
  title,
}: {
  title?: string | null;
}) {
  useEffect(() => {
    document.title = formatDocumentTitle(title);
  }, [title]);

  return null;
}
