import type { OzelGun } from "../schedule";
import masaustu from "./masaustu.png";
import mobil from "./mobil.png";

/**
 * 10 Kasım — Atatürk'ü anma. Her yıl:
 * - 9 Kasım 22:00 – 10 Kasım 23:59: siteye ilk girişte 10 saniye (kapatılabilir)
 * - 10 Kasım 09:05: hangi sayfada olursa olsun 1 dakika (kapatılamaz)
 * Görseller bu klasörde: masaustu.png, mobil.png
 */
export const ON_KASIM: OzelGun = {
  id: "10-kasim",
  ad: "10 Kasım anma",
  aralik: { baslangicAy: 11, baslangicGun: 9, baslangicSaat: 22, baslangicDakika: 0, bitisAy: 11, bitisGun: 10 },
  ilkGirisMs: 10_000,
  saatliGosterim: { ay: 11, gun: 10, saat: 9, dakika: 5, sureMs: 60_000 },
  gorsel: {
    masaustu: masaustu.src,
    mobil: mobil.src,
    alt: "Mustafa Kemal Atatürk portresi ve sonsuzluk işareti; 10 Kasım anma görseli",
  },
};
