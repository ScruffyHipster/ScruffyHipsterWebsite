import cmsContent from "../generated/cms-content.json";
import type { PrivacyPolicyConfig } from "./types";

export const privacyPolicies = cmsContent.privacyPolicies as PrivacyPolicyConfig[];
export const privacyPoliciesBySlug = new Map(
  privacyPolicies.map((policy) => [policy.slug, policy])
);
