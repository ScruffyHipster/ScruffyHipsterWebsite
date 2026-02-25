import { Navigate, useParams } from "react-router-dom";
import { privacyPoliciesBySlug } from "../content/privacyPolicies";
import { Seo } from "../components/Seo";
import { Reveal } from "../components/Reveal";
import { breadcrumbJsonLd, organizationJsonLd } from "../seo/jsonld";
import { getSiteUrl } from "../seo/metadata";

export function PrivacyPolicyPage() {
  const params = useParams<{ slug: string }>();
  const policy = params.slug ? privacyPoliciesBySlug.get(params.slug) : undefined;

  if (!policy) {
    return <Navigate to="/" replace />;
  }

  const path = `/privacy/${policy.slug}`;

  return (
    <>
      <Seo
        path={path}
        meta={policy.seo}
        jsonLd={[
          organizationJsonLd(),
          breadcrumbJsonLd([
            { name: "Scruffy Hipster", url: getSiteUrl() },
            { name: "Privacy", url: `${getSiteUrl()}${path}` },
            { name: policy.appName, url: `${getSiteUrl()}${path}` }
          ])
        ]}
      />
      <section className="section-block section-pad">
        <div className="container narrow-container">
          <Reveal>
            <article className="policy-article">
              <p className="eyebrow">Privacy Policy</p>
              <h1>{policy.appName}</h1>
              <p className="policy-updated">
                <strong>Last updated:</strong> {policy.lastUpdated}
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

