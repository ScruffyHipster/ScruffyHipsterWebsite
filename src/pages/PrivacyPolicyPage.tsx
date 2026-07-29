import { Navigate, useParams } from "react-router-dom";
import { privacyPoliciesBySlug } from "../content/privacyPolicies";
import { Seo } from "../components/Seo";
import { Reveal } from "../components/Reveal";
import { breadcrumbJsonLd, organizationJsonLd } from "../seo/jsonld";
import { getSiteUrl } from "../seo/metadata";
import { canonicalUrl } from "../seo/canonical";
import { siteConfig } from "../content/site";

export function PrivacyPolicyPage() {
  const params = useParams<{ slug: string }>();
  const policy = params.slug ? privacyPoliciesBySlug.get(params.slug) : undefined;

  if (!policy) {
    return <Navigate to="/" replace />;
  }

  const path = `/privacy/${policy.slug}`;
  const labels = siteConfig.shared.privacyPolicy;

  return (
    <>
      <Seo
        path={path}
        meta={policy.seo}
        jsonLd={[
          organizationJsonLd(),
          breadcrumbJsonLd([
            { name: siteConfig.companyName, url: getSiteUrl() },
            { name: labels.breadcrumbLabel, url: canonicalUrl(path, getSiteUrl()) },
            { name: policy.appName, url: canonicalUrl(path, getSiteUrl()) }
          ])
        ]}
      />
      <section className="section-block section-pad">
        <div className="container narrow-container">
          <Reveal>
            <article className="policy-article">
              <p className="eyebrow">{labels.eyebrow}</p>
              <h1>{policy.appName}</h1>
              <p className="policy-updated">
                <strong>{labels.lastUpdatedLabel}</strong> {policy.lastUpdated}
              </p>
              <div
                className="policy-content"
                dangerouslySetInnerHTML={{ __html: policy.htmlContent }}
              />
            </article>
          </Reveal>
        </div>
      </section>
    </>
  );
}
