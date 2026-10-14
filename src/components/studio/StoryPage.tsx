import Kinetic from "./Kinetic";
import GrowthSentence from "./GrowthSentence";
import Reveal from "./Reveal";

export default function StoryPage() {
  return (
    <>
      <section className="hx-story" id="anlatinin-olusumu" aria-labelledby="hx-story-title">
        <Reveal className="hx-story-inner">
          <aside>
            Anlatı sayfası
            <span>Örnek anlatı · Ahşap atölyesi</span>
          </aside>
          <div>
            <Kinetic as="h2" id="hx-story-title" text="Dağınık notlar, ~tek bir sayfa.~" from="right" />
            <p className="hx-story-text">
              1987’de babamın tezgâhından kalan üç aletle başladık. Aradan geçen yıllarda sandalyelerin biçimi değişti,
              işin özü değişmedi: <mark>bir sandalye tek bir elden çıkar ve imzamızı taşır.</mark> Bugün de her siparişi,
              onu yapan ustanın adıyla teslim ediyoruz.
            </p>
          </div>
        </Reveal>
      </section>

      <section className="hm-bridge" aria-label="Hizmete geçiş">
        <Reveal className="hm-bridge-inner">
          <Kinetic as="p" className="hm-bridge-q" text="Biz o tarafı bulur, *görünür hâle getiririz.*" from="right" by="letter" />
          <GrowthSentence />
        </Reveal>
      </section>
    </>
  );
}
