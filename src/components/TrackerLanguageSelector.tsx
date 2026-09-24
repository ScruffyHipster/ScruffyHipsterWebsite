import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  localeForPath,
  openLocalizedTrackerLocales,
  reviewableTrackerLocales,
  trackerLocaleLabel,
  trackerLocalePath,
  type SupportedLocale,
  type TrackerContentKind
} from "../content/trackerLocales";
import { canonicalPath } from "../seo/canonical";
import { trackEvent } from "../analytics/telemetrydeck";
import { trackerLandingForPath } from "../content/trackerLanding";
import { siteConfig } from "../content/site";

type TrackerLanguageSelectorProps = {
  kind: TrackerContentKind;
  dropdown?: boolean;
  translationKey?: string;
};

export function TrackerLanguageSelector({
  kind,
  translationKey,
  dropdown = false
}: TrackerLanguageSelectorProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const currentLocale = localeForPath(location.pathname);
  const availableLocales: SupportedLocale[] = [
    "en-GB",
    ...(kind === "privacy" ? openLocalizedTrackerLocales() : reviewableTrackerLocales()).map((locale) => locale.locale)
  ];

  const content = trackerLandingForPath(location.pathname);
  const languageLabel = "languageLabel" in content ? content.languageLabel : siteConfig.shared.privacyPolicy.languageLabel;

  if (availableLocales.length === 1) {
    return null;
  }

  if (dropdown) {
    return (
      <select
        className="tracker-language-dropdown"
        aria-label={languageLabel}
        value={currentLocale}
        onChange={(event) => {
          const locale = event.target.value as SupportedLocale;
          const path = trackerLocalePath(locale, kind, translationKey);
          if (!path || locale === currentLocale) return;
          trackEvent("language_switch", {
            from_locale: currentLocale,
            to_locale: locale,
            path: location.pathname
          });
          navigate(canonicalPath(path));
        }}
      >
        {availableLocales.filter((locale) => trackerLocalePath(locale, kind, translationKey)).map((locale) => (
          <option key={locale} value={locale}>{trackerLocaleLabel(locale)}</option>
        ))}
      </select>
    );
  }

  return (
    <nav className="tracker-language-selector" aria-label={languageLabel}>
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
