import { Link, useLocation } from "react-router-dom";
import {
  localeForPath,
  openLocalizedTrackerLocales,
  trackerLocaleLabel,
  trackerLocalePath,
  type SupportedLocale,
  type TrackerContentKind
} from "../content/trackerLocales";
import { canonicalPath } from "../seo/canonical";
import { trackEvent } from "../analytics/telemetrydeck";

type TrackerLanguageSelectorProps = {
  kind: TrackerContentKind;
  translationKey?: string;
};

export function TrackerLanguageSelector({
  kind,
  translationKey
}: TrackerLanguageSelectorProps) {
  const location = useLocation();
  const currentLocale = localeForPath(location.pathname);
  const availableLocales: SupportedLocale[] = [
    "en-GB",
    ...openLocalizedTrackerLocales().map((locale) => locale.locale)
  ];

  if (availableLocales.length === 1) {
    return null;
  }

  return (
    <nav className="tracker-language-selector" aria-label="Language">
      {availableLocales.map((locale) => {
        const path = trackerLocalePath(locale, kind, translationKey);
        if (!path) return null;
        const isCurrent = locale === currentLocale;
        return isCurrent ? (
          <span key={locale} aria-current="page">
            {trackerLocaleLabel(locale)}
          </span>
        ) : (
          <Link
            key={locale}
            to={canonicalPath(path)}
            onClick={() =>
              trackEvent("language_switch", {
                from_locale: currentLocale,
                to_locale: locale,
                path: location.pathname
              })
            }
          >
            {trackerLocaleLabel(locale)}
          </Link>
        );
      })}
    </nav>
  );
}
