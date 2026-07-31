import { apps } from "../content/apps";
import { AppCard } from "../components/AppCard";
import { Reveal } from "../components/Reveal";
import { Seo } from "../components/Seo";
import { organizationJsonLd, websiteJsonLd } from "../seo/jsonld";
import { appsPageContent } from "../content/pages";

export function AppsPage() {
  return (
    <>
      <Seo
        path={appsPageContent.route}
        meta={appsPageContent.seo}
        jsonLd={[organizationJsonLd(), websiteJsonLd()]}
      />

      <section className="section-block page-hero">
        <div className="container">
          <Reveal className="section-head">
            <p className="eyebrow">{appsPageContent.hero.eyebrow}</p>
            <h1>{appsPageContent.hero.heading}</h1>
            <p>{appsPageContent.hero.body}</p>
          </Reveal>
        </div>
      </section>

      <section className="section-block section-pad">
        <div className="container">
          <div className="app-group-stack">
            {appsPageContent.groups.map((group, groupIndex) => {
              const groupApps = group.appIds
                .map((appId) => apps.find((app) => app.id === appId))
                .filter((app): app is (typeof apps)[number] => Boolean(app));

              return (
                <Reveal key={group.label} delayMs={Math.min(groupIndex * 70, 260)} className="app-group">
                  <p className="app-group-label">{group.label}</p>
                  <div className="app-grid">
                    {groupApps.map((app) => (
                      <AppCard key={app.id} app={app} />
                    ))}
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
