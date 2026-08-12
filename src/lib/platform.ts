export type Gender = "male" | "female";
export type Audience = "all" | Gender;

export const categories = [
  ["futbol", "Futbol", "Maçlar, takımlar ve oyunun kendisi"],
  ["otomobil-motosiklet", "Otomobil & Motosiklet", "Araç seçimi, bakım ve yol deneyimleri"],
  ["iliskiler", "İlişkiler", "Tanışmak, birlikte yaşamak ve ayrılıklar"],
  ["kadinlara-sor", "Kadınlara Sor", "Kadınların görüşünün özellikle istendiği sorular"],
  ["erkeklere-sor", "Erkeklere Sor", "Erkeklerin deneyiminin özellikle istendiği sorular"],
  ["is-para", "İş & Para", "Kariyer, girişim ve kişisel finans"],
  ["teknoloji-oyun", "Teknoloji & Oyun", "Cihazlar, yazılım, oyun ve dijital hayat"],
  ["tatil-gezi", "Tatil & Gezi", "Rotalar, bütçeler ve yol notları"],
  ["stil-bakim", "Stil & Bakım", "Giyim, bakım ve kişisel tarz"],
  ["spor-fitness", "Spor & Fitness", "Antrenman, beslenme ve iyi yaşam"],
  ["ev-yasam", "Ev & Yaşam", "Ev kurmak, onarmak ve gündelik düzen"],
  ["baba-aile", "Baba & Aile", "Babalık ve aile içindeki hayat"],
  ["hobiler", "Hobiler", "Uğraşlar, üretmek ve koleksiyonlar"],
  ["hayat", "Hayat", "Kararlar, değişimler ve gerçek deneyimler"],
  ["icimde-kaldi", "İçimde Kaldı", "Daha kişisel, istenirse anonim anlatılar"],
] as const;

export const audienceLabel: Record<Audience, string> = {
  all: "Herkese",
  male: "Erkeklere soruldu",
  female: "Kadınlara soruldu",
};

export function slugify(value: string) {
  return value.toLocaleLowerCase("tr-TR").normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/ı/g, "i").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
