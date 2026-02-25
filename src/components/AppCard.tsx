import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import type { AppConfig } from "../content/types";

type AppCardProps = {
  app: AppConfig;
};

export function AppCard({ app }: AppCardProps) {
  return (
    <Link
      to={`/apps/${app.slug}`}
      className="app-card"
      style={
        {
          "--accent-from": app.accent.from,
          "--accent-via": app.accent.via,
          "--accent-to": app.accent.to
        } as CSSProperties
      }
    >
      <div className="app-card-icon-wrap">
        <img className="app-card-icon" src={app.icon} alt={`${app.name} icon`} loading="lazy" />
      </div>
      <div>
        <h3>{app.name}</h3>
        <p>{app.shortDescription}</p>
      </div>
      <span className="app-card-link">View app page</span>
    </Link>
  );
}
