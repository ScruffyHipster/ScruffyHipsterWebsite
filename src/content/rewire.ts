import cmsContent from "../generated/cms-content.json";
import { appsBySlug } from "./apps";

const rewire = appsBySlug.get("rewire");

if (!rewire) {
  throw new Error("Rewire app config is missing.");
}

export const rewireApp = rewire;
export const rewireContent = cmsContent.rewire;
export const rewireAppStoreFacts = rewireContent.appStoreFacts;
export const rewireScreenshots = rewireContent.screenshots;
export const rewireShowcaseSections = rewireContent.showcaseSections;
export const rewireGuidePages = rewireContent.guidePages;
export const rewireFaqs = rewireContent.faqs;
export const rewireSeoTargets = rewireContent.seo.keywords.slice(1);
