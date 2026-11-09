import type { OzelGun } from "./schedule";
import { YIRMI_DOKUZ_EKIM } from "./29-ekim";
import { ON_KASIM } from "./10-kasim";

/**
 * Özel günler listesi. Her gün kendi klasöründe durur ve her yıl otomatik tekrarlanır.
 * Yeni özel gün eklemek için:
 * 1. Bu klasörde <gun-ay>/ klasörü açın (29-ekim örnek alınır): index.ts + masaustu.png + mobil.png,
 * 2. aşağıdaki listeye ekleyin.
 * İki özel günün aralığı çakışmamalıdır (aynı anda yalnızca biri gösterilir).
 */
export const OZEL_GUNLER: OzelGun[] = [YIRMI_DOKUZ_EKIM, ON_KASIM];
