import cmsContent from "../generated/cms-content.json";
import type { AppConfig } from "./types";

export const apps = cmsContent.apps as AppConfig[];
export const appsBySlug = new Map(apps.map((app) => [app.slug, app]));
