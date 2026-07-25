import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { AppRouter } from "./app/router";
import { initTelemetryDeck } from "./analytics/telemetrydeck";
import "./styles.css";

void initTelemetryDeck();

const root = document.getElementById("root")!;
const app = (
  <React.StrictMode>
    <HelmetProvider>
      <AppRouter />
    </HelmetProvider>
  </React.StrictMode>
);

if (root.hasChildNodes()) {
  hydrateRoot(root, app);
} else {
  createRoot(root).render(app);
}
