const decoration = { arrow: "↗", down: "↓", check: "✓", plus: "+" };
import { Link } from "react-router-dom";
import { rewireContent } from "../content/rewire";
const c = rewireContent.editorial.journal;
export function RewireComparisonFeature() {
  return (
    <Link className="rw-comparison-feature" to={`/rewire/blog/${c.slug}/`}>
      <div className="rw-comparison-art" aria-label={c.artLabel}>
        {c.brands.map((brand, index) => (
          <div
            key={brand.name}
            className={index === 0 ? "rw-brand-choice" : undefined}
          >
            <strong>{brand.name}</strong>
            <span>{brand.detail}</span>
            <span aria-hidden="true">
              {index === 0 ? decoration.arrow : decoration.plus}
            </span>
          </div>
        ))}
      </div>
      <div className="rw-comparison-copy">
        <p className="rw-eyebrow">{c.featured}</p>
        <h3>{c.title}</h3>
        <p>{c.body}</p>
        <span className="rw-text-link">
          {c.cta}
          <span aria-hidden="true">{decoration.arrow}</span>
        </span>
      </div>
    </Link>
  );
}
