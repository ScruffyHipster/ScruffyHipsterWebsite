import type { ReactNode } from "react";

export function TrackerIcon({ kind, className = "" }: { kind: string; className?: string }) {
  const shapes: Record<string, ReactNode> = {
    arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
    chevron: <path d="m6 9 6 6 6-6" />,
    timer: <><circle cx="12" cy="13" r="8" /><path d="M9 2h6M12 5V2m0 11 3-3M18 5l2 2" /></>,
    watch: <><rect x="6" y="6" width="12" height="12" rx="4" /><path d="m9 6 1-4h4l1 4M9 18l1 4h4l1-4M12 9v4l2 1" /></>,
    glance: <><rect x="5" y="2" width="14" height="20" rx="3" /><path d="M10 5h4M9 12h6M9 15h4" /></>,
    heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />,
    check: <><circle cx="12" cy="12" r="9" /><path d="m8 12 3 3 5-6" /></>,
    leaf: <><path d="M20 3C9 2 3 7 5 14c2 6 12 6 15-11Z" /><path d="M3 22c2-8 6-12 12-15" /></>
  };
  return <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{shapes[kind] ?? shapes.heart}</svg>;
}

