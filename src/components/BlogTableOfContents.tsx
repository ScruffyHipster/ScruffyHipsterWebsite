import { useEffect, useRef, useState } from "react";

type TableOfContentsHeading = {
  level: number;
  label: string;
  id: string;
};

type BlogTableOfContentsProps = {
  headings: TableOfContentsHeading[];
  label: string;
};

type MarkerPosition = {
  top: number;
  height: number;
};

export function BlogTableOfContents({ headings, label }: BlogTableOfContentsProps) {
  const asideRef = useRef<HTMLElement>(null);
  const frameRef = useRef<number | null>(null);
  const [activeId, setActiveId] = useState(() => {
    if (typeof window === "undefined") {
      return headings[0]?.id || "";
    }
    const hashId = decodeURIComponent(window.location.hash.slice(1));
    return headings.some((heading) => heading.id === hashId) ? hashId : headings[0]?.id || "";
  });
  const [markerPosition, setMarkerPosition] = useState<MarkerPosition>({ top: 0, height: 0 });

  useEffect(() => {
    const updateActiveSection = () => {
      frameRef.current = null;
      const readingLine = Number.parseFloat(getComputedStyle(document.documentElement).fontSize) * 7;
      const headingActivationLine = readingLine + 12;
      const atPageEnd = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
      let nextActiveId = headings[0]?.id || "";

      for (const heading of headings) {
        const element = document.getElementById(heading.id);
        if (element && element.getBoundingClientRect().top <= headingActivationLine) {
          nextActiveId = heading.id;
        }
      }

      if (atPageEnd && headings.length) {
        nextActiveId = headings[headings.length - 1].id;
      }

      setActiveId((currentId) => (currentId === nextActiveId ? currentId : nextActiveId));

      const aside = asideRef.current;
      const activeItem = aside?.querySelector<HTMLElement>(`[data-heading-id="${CSS.escape(nextActiveId)}"]`);
      if (activeItem && aside) {
        const nextPosition = {
          top: activeItem.getBoundingClientRect().top - aside.getBoundingClientRect().top,
          height: activeItem.offsetHeight
        };
        setMarkerPosition((current) =>
          current.top === nextPosition.top && current.height === nextPosition.height
            ? current
            : nextPosition
        );
      }
    };

    const scheduleUpdate = () => {
      if (frameRef.current === null) {
        frameRef.current = window.requestAnimationFrame(updateActiveSection);
      }
    };

    scheduleUpdate();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [headings]);

  return (
    <aside ref={asideRef} className="feeding-blog-toc" aria-label={label}>
      <strong>{label}</strong>
      <span
        className="feeding-blog-toc-marker"
        aria-hidden="true"
        style={{
          height: `${markerPosition.height}px`,
          transform: `translateY(${markerPosition.top}px)`
        }}
      />
      <ol>
        {headings.map((heading) => {
          const isActive = heading.id === activeId;
          return (
            <li key={heading.id} data-heading-id={heading.id} className={isActive ? "is-active" : undefined}>
              <a
                href={`#${heading.id}`}
                aria-current={isActive ? "location" : undefined}
                onClick={() => setActiveId(heading.id)}
              >
                {heading.label}
              </a>
            </li>
          );
        })}
      </ol>
    </aside>
  );
}
