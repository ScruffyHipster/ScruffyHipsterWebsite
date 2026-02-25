import React from "react";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { AppRouter } from "./app/router";
import { initTelemetryDeck } from "./analytics/telemetrydeck";
import "./styles.css";

void initTelemetryDeck();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HelmetProvider>
      <AppRouter />
    </HelmetProvider>
  </React.StrictMode>
);

