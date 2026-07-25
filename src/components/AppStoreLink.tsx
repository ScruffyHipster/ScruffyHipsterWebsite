import type { AnchorHTMLAttributes, PropsWithChildren } from "react";
import { useLocation } from "react-router-dom";
import { readLandingAttribution } from "../analytics/landingAttribution";
import { trackEvent } from "../analytics/telemetrydeck";
import { breastfeedingTrackerAppStoreUrl } from "../content/breastfeedingTracker";

type AppStorePlacement = "hero" | "feature" | "guide" | "footer";

type AppStoreLinkProps = PropsWithChildren<
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    placement: AppStorePlacement;
  }
>;

export function BreastfeedingTrackerAppStoreLink({
  placement,
  children,
  onClick,
  ...props
}: AppStoreLinkProps) {
  const location = useLocation();

  return (
    <a
      {...props}
      href={breastfeedingTrackerAppStoreUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(event) => {
        const landing = readLandingAttribution();
        trackEvent("app_store_click", {
          app: "breastfeeding-tracker",
          path: location.pathname,
          placement,
          landing_path: landing?.landing_path,
          utm_source: landing?.utm_source,
          utm_medium: landing?.utm_medium,
          utm_campaign: landing?.utm_campaign
        });
        onClick?.(event);
      }}
    >
      {children}
    </a>
  );
}
