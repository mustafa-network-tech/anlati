import Link from "next/link";
import { packages, tl } from "@/lib/studio";

export default function Packages() {
  return (
    <div className="st-packages">
      {packages.map((p) => (
        <article key={p.id} className={p.featured ? "st-package featured" : "st-package"}>
          <h3>{p.name}</h3>
          <p className="st-package-tag">{p.tagline}</p>
          {p.price === null ? (
            <p className="st-price">{p.priceNote}</p>
          ) : p.campaignPrice !== undefined ? (
            <div className="st-price-block">
              <span className="st-badge">Lansman fiyatı · ilk 3 ay</span>
              <p className="st-price">
                {tl(p.campaignPrice)}
                <small> {p.priceNote}</small>
              </p>
              <p className="st-price-old">
                Liste fiyatı: <s>{tl(p.price)}</s>
              </p>
            </div>
          ) : (
            <p className="st-price">
              {tl(p.price)}
              <small> {p.priceNote}</small>
            </p>
          )}
          <dl>
            <div>
              <dt>Süre</dt>
              <dd>{p.duration}</dd>
            </div>
            <div>
              <dt>Revizyon</dt>
              <dd>{p.revisions}</dd>
            </div>
          </dl>
          <h4>Kapsam</h4>
          <ul>
            {p.includes.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
          <h4>Kapsam dışı</h4>
          <ul className="st-excludes">
            {p.excludes.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
          <Link href={`/iletisim?paket=${p.id}`} className="st-btn st-btn-block">
            Bu paket için teklif iste
          </Link>
        </article>
      ))}
    </div>
  );
}
