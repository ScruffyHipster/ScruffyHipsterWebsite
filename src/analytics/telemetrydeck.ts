type EventProperties = Record<string, string | number | boolean | null | undefined>;

let initialized = false;
let disabled = false;
let telemetryDeckClient: { signal: (eventName: string, payload?: EventProperties) => void } | null =
  null;
let loadingPromise: Promise<void> | null = null;

export const isSmartyColoursPath = (pathname: string) => {
  let decodedPath = pathname;
  try {
    decodedPath = decodeURIComponent(pathname);
  } catch {
    // A malformed URL is still checked as written.
  }
  return /^\/apps\/smarty-colours(?:\/|$)/i.test(decodedPath);
};

const isAnalyticsSuppressed = () =>
  typeof window !== "undefined" && isSmartyColoursPath(window.location.pathname);

const getAnalyticsEnabled = () => {
  const explicit = import.meta.env.VITE_ANALYTICS_ENABLED as string | undefined;
  if (explicit) {
    return explicit === "true";
  }
  return import.meta.env.PROD;
};

const getAppId = () => (import.meta.env.VITE_TELEMETRYDECK_APP_ID as string | undefined)?.trim();

const getOrCreateSessionUser = () => {
  const storageKey = "scruffyhipster.analytics.user";
  try {
    const existing = sessionStorage.getItem(storageKey);
    if (existing) return existing;
    const next = `web-${Math.random().toString(36).slice(2)}-${Date.now().toString(36)}`;
    sessionStorage.setItem(storageKey, next);
    return next;
  } catch {
    return `web-${Date.now().toString(36)}`;
  }
};

export async function initTelemetryDeck() {
  if (isAnalyticsSuppressed() || initialized || disabled) return;
  if (loadingPromise) return loadingPromise;

  if (!getAnalyticsEnabled()) {
    disabled = true;
    return;
  }

  const appID = getAppId();
  if (!appID) {
    disabled = true;
    return;
  }

  loadingPromise = (async () => {
    try {
      const sdk = await import("@telemetrydeck/sdk");
      // Navigation may have entered the children's site while the SDK was loading.
      if (isAnalyticsSuppressed()) return;
      const userId = getOrCreateSessionUser();
      const maybeClient = new (sdk as unknown as { TelemetryDeck: new (opts: Record<string, unknown>) => { signal: (eventName: string, payload?: EventProperties) => void } }).TelemetryDeck(
        {
          appID,
          user: userId,
          clientUser: userId
        }
      );
      telemetryDeckClient = maybeClient;
      initialized = true;
    } catch (error) {
      disabled = true;
      if (import.meta.env.DEV) {
        console.warn("TelemetryDeck initialization failed", error);
      }
    }
  })();

  try {
    await loadingPromise;
  } finally {
    loadingPromise = null;
  }
}

export function trackEvent(eventName: string, payload?: EventProperties) {
  if (isAnalyticsSuppressed() || !getAnalyticsEnabled()) return;

  if (!initialized && !loadingPromise && !disabled) {
    void initTelemetryDeck().then(() => {
      if (!isAnalyticsSuppressed() && telemetryDeckClient) {
        telemetryDeckClient.signal(eventName, payload);
      }
    });
    return;
  }

  if (loadingPromise && !initialized) {
    void loadingPromise.then(() => {
      if (!isAnalyticsSuppressed()) telemetryDeckClient?.signal(eventName, payload);
    });
    return;
  }

  telemetryDeckClient?.signal(eventName, payload);
}

