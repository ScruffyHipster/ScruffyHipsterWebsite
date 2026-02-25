export type LandingAttribution = {
  landing_path: string;
  landing_url: string;
  referrer: string;
  referrer_domain: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  initial_timestamp: string;
};

const LANDING_KEY = "scruffyhipster.landing";

const getReferrerDomain = (referrer: string) => {
  if (!referrer) return "";
  try {
    return new URL(referrer).hostname;
  } catch {
    return "";
  }
};

export const readLandingAttribution = (): LandingAttribution | null => {
  try {
    const raw = sessionStorage.getItem(LANDING_KEY);
    return raw ? (JSON.parse(raw) as LandingAttribution) : null;
  } catch {
    return null;
  }
};

export const ensureLandingAttribution = (): LandingAttribution => {
  const existing = readLandingAttribution();
  if (existing) return existing;

  const url = new URL(window.location.href);
  const attribution: LandingAttribution = {
    landing_path: url.pathname,
    landing_url: url.toString(),
    referrer: document.referrer || "",
    referrer_domain: getReferrerDomain(document.referrer || ""),
    utm_source: url.searchParams.get("utm_source") || undefined,
    utm_medium: url.searchParams.get("utm_medium") || undefined,
    utm_campaign: url.searchParams.get("utm_campaign") || undefined,
    utm_content: url.searchParams.get("utm_content") || undefined,
    utm_term: url.searchParams.get("utm_term") || undefined,
    initial_timestamp: new Date().toISOString()
  };

  try {
    sessionStorage.setItem(LANDING_KEY, JSON.stringify(attribution));
  } catch {
    // Ignore storage failures.
  }

  return attribution;
};

