import type { MouseEvent } from "react";
import { useLocation } from "react-router-dom";
import {
  isBreastfeedingTrackerAppStoreHref,
  trackBreastfeedingTrackerAppStoreClick,
  type AppStorePlacement
} from "../analytics/appStoreClick";

type TrackedMarkdownContentProps = {
  className: string;
  html: string;
  placement: Extract<AppStorePlacement, "guide" | "blog">;
};

export function TrackedMarkdownContent({
  className,
  html,
  placement
}: TrackedMarkdownContentProps) {
  const location = useLocation();

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    if (!(event.target instanceof Element)) {
      return;
    }
    const link = event.target.closest<HTMLAnchorElement>("a[href]");
    if (!link || !event.currentTarget.contains(link)) {
      return;
    }
    if (isBreastfeedingTrackerAppStoreHref(link.href)) {
      trackBreastfeedingTrackerAppStoreClick(location.pathname, placement);
    }
  };

  return (
    <div
      className={className}
      data-app-store-placement={placement}
      onClick={handleClick}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
