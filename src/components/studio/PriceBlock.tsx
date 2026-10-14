"use client";

import { launch, tl } from "@/lib/studio";
import { useLaunchActive } from "./useLaunch";

export default function PriceBlock({
  launchPrice,
  postLaunchPrice,
  priceNote,
  initialActive,
}: {
  launchPrice: number | null;
  postLaunchPrice: number | null;
  priceNote: string;
  initialActive: boolean;
}) {
  const active = useLaunchActive(initialActive);

  if (launchPrice === null) return <p className="st-price">{priceNote}</p>;

  if (active) {
    return (
      <div className="st-price-block">
        <span className="st-badge">Lansman fiyatı</span>
        <p className="st-price">
          {tl(launchPrice)}
          <small> {priceNote}</small>
        </p>
        <p className="st-price-old">{launch.label}’ye kadar geçerli</p>
      </div>
    );
  }

  if (postLaunchPrice !== null) {
    return (
      <p className="st-price">
        {tl(postLaunchPrice)}
        <small> {priceNote}</small>
      </p>
    );
  }

  return <p className="st-price st-price-ask">Güncel teklif alın</p>;
}
