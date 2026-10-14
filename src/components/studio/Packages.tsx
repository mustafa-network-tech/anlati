import Link from "next/link";
import { isLaunchActive, packages } from "@/lib/studio";
import LaunchNote from "./LaunchNote";
import PriceBlock from "./PriceBlock";

export default function Packages() {
  const active = isLaunchActive();
  return (
    <>
    <div className="st-packages">
      {packages.map((p) => (
        <article key={p.id} className={p.featured ? "st-package featured" : "st-package"}>
          <h3>{p.name}</h3>
          <p className="st-package-tag">{p.tagline}</p>
          <PriceBlock
            launchPrice={p.launchPrice}
            postLaunchPrice={p.postLaunchPrice}
            priceNote={p.priceNote}
            initialActive={active}
          />
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
    <LaunchNote initialActive={active} />
    </>
  );
}
