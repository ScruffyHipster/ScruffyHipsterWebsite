import type { AnchorHTMLAttributes, PropsWithChildren } from "react";
import { useLocation } from "react-router-dom";
import {
  trackBreastfeedingTrackerAppStoreClick,
  type AppStorePlacement
} from "../analytics/appStoreClick";
import { breastfeedingTrackerAppStoreUrl } from "../content/breastfeedingTracker";

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
