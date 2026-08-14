import type { AnchorHTMLAttributes, PropsWithChildren } from "react";
import { useLocation } from "react-router-dom";
import {
  trackBreastfeedingTrackerAppStoreClick,
  type AppStorePlacement
} from "../analytics/appStoreClick";
import {
  breastfeedingTrackerAppStoreUrl,
  breastfeedingTrackerArticleAppStoreUrl
} from "../content/breastfeedingTracker";

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
  const href =
    placement === "guide" || placement === "blog"
      ? breastfeedingTrackerArticleAppStoreUrl
      : breastfeedingTrackerAppStoreUrl;

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
