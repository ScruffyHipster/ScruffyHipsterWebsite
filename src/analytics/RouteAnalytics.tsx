import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { ensureLandingAttribution, readLandingAttribution } from "./landingAttribution";
import { trackEvent } from "./telemetrydeck";

export function RouteAnalytics() {
  const location = useLocation();
  const landingSentRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const landing = ensureLandingAttribution();
    if (!landingSentRef.current) {
      trackEvent("site_landing", landing);
      landingSentRef.current = true;
    }

    const storedLanding = readLandingAttribution() ?? landing;
    trackEvent("page_view", {
      path: `${location.pathname}${location.search}${location.hash}`,
      title: document.title,
      referrer: document.referrer || "",
      landing_path: storedLanding.landing_path,
      utm_source: storedLanding.utm_source,
      utm_medium: storedLanding.utm_medium,
      utm_campaign: storedLanding.utm_campaign,
      utm_content: storedLanding.utm_content,
      utm_term: storedLanding.utm_term
    });
  }, [location.pathname, location.search, location.hash]);

  return null;
}

