import { Link } from "react-router-dom";
import { breastfeedingTrackerContent } from "../content/breastfeedingTracker";
import { TrackerIcon } from "./TrackerIcon";

type WebAppsContent = typeof breastfeedingTrackerContent.webApps;

export function BreastfeedingTrackerWebApps({ content }: { content: WebAppsContent }) {
  return (
    <section className="bft-web-apps" id="web-apps" aria-labelledby="web-apps-heading">
      <div className="bft-container">
        <div className="bft-web-apps-intro">
          <p className="bft-eyebrow">{content.eyebrow}</p>
          <h2 id="web-apps-heading">{content.heading}</h2>
          <p>{content.body}</p>
        </div>
        <div className="bft-web-apps-grid">
          {content.tools.map((tool) => (
            <Link className="bft-web-app" key={tool.url} to={tool.url}>
              <h3>{tool.title}</h3>
              <p>{tool.description}</p>
              <span className="bft-text-link">{tool.cta}<TrackerIcon kind="arrow" /></span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
