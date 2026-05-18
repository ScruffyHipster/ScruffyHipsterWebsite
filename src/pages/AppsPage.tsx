import { apps } from "../content/apps";
import { AppCard } from "../components/AppCard";
import { Reveal } from "../components/Reveal";
import { Seo } from "../components/Seo";
import { organizationJsonLd, websiteJsonLd } from "../seo/jsonld";

const appGroups = [
  {
    label: "Focus and attention",
    appIds: ["rewire"]
  },
  {
    label: "Recovery and rhythm",
    appIds: ["wren", "standing-desk-timer"]
  },
  {
    label: "Care and everyday systems",
    appIds: ["breast-feeding-tracker", "gro-guardian"]
  },
  {
    label: "Seasonal experiments",
    appIds: ["smarty-colours", "chat-with-santa"]
  }
];

export function AppsPage() {
  return (
    <>
      <Seo
        path="/apps"
        meta={{
          title: "Apps | Scruffyhipster",
          description:
            "Practical Apple platform apps from Scruffyhipster for focus, recovery, habits, and everyday systems.",
          keywords: ["Scruffyhipster apps", "Apple productivity apps", "focus apps", "behavioural tools"],
          ogImage: "/og-default.png"
        }}
        jsonLd={[organizationJsonLd(), websiteJsonLd()]}
      />

      <section className="section-block page-hero">
        <div className="container">
          <Reveal className="section-head">
            <p className="eyebrow">Apps</p>
            <h1>Practical apps for focus, recovery, and everyday systems.</h1>
            <p>
              Small tools with clear jobs. Built for Apple platforms. Designed to reduce noise, add useful friction, and support habits without turning life into a dashboard.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section-block section-pad">
        <div className="container">
          <div className="app-group-stack">
            {appGroups.map((group, groupIndex) => {
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
