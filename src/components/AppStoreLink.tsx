import type { AnchorHTMLAttributes, PropsWithChildren } from "react";
import { useLocation } from "react-router-dom";
import {
  trackBreastfeedingTrackerAppStoreClick,
  localizedBreastfeedingTrackerAppStoreUrl,
  type AppStorePlacement
} from "../analytics/appStoreClick";
import {
  breastfeedingTrackerAppStoreUrl,
  breastfeedingTrackerArticleAppStoreUrl
} from "../content/breastfeedingTracker";

import { localeForPath } from "../content/trackerLocales";

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
  const baseHref =
    placement === "guide" || placement === "blog"
      ? breastfeedingTrackerArticleAppStoreUrl
      : breastfeedingTrackerAppStoreUrl;

  const locale = localeForPath(location.pathname);
  const href = locale === "en-GB" ? baseHref : localizedBreastfeedingTrackerAppStoreUrl(
    baseHref, locale, `site_${locale.slice(0, 2)}_tracker_${placement === "guide" || placement === "blog" ? placement : "landing"}`
  );

  return (
    <a
      {...props}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-app-store-placement={placement}
      onClick={(event) => {
        trackBreastfeedingTrackerAppStoreClick(location.pathname, placement);
        onClick?.(event);
      }}
    >
      {children}
    </a>
  );
}
