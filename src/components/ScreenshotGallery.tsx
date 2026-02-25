import type { Screenshot } from "../content/types";
import { Reveal } from "./Reveal";

type ScreenshotGalleryProps = {
  screenshots: Screenshot[];
  title?: string;
};

export function ScreenshotGallery({ screenshots, title = "Screenshots" }: ScreenshotGalleryProps) {
  return (
    <section className="section-block">
      <div className="section-head">
        <h2>{title}</h2>
      </div>
      <div className="screenshot-grid">
        {screenshots.map((shot, index) => (
          <Reveal key={shot.src} delayMs={Math.min(index * 60, 300)}>
            <figure className="phone-shot">
              <img src={shot.src} alt={shot.alt} loading="lazy" decoding="async" />
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

