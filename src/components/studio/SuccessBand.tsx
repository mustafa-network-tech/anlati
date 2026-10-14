import Kinetic from "./Kinetic";
import Reveal from "./Reveal";
import "./home.css";

const goals = [
  { w: "Anlaşılır", t: "Ziyaretçi, ne yaptığınızı ilk bakışta kavrar." },
  { w: "Hatırlanır", t: "Tek bir ana mesaj, her yerde aynı ses." },
  { w: "Tercih edilir", t: "Sizi seçmek için net ve inandırıcı bir neden." },
  { w: "Ölçülebilir", t: "Başarı ölçütünü her projede başta birlikte yazarız." },
];

export default function SuccessBand() {
  return (
    <section className="sb" aria-labelledby="basari">
      <div className="sb-inner">
        <Reveal className="sb-head" from="left">
          <p className="hm-eyebrow">BAŞARI ÖLÇÜTÜMÜZ</p>
          <Kinetic as="h2" id="basari" text="Başarıyı _baştan tanımlarız._" from="right" />
          <Kinetic as="p" className="hm-sub" text="Her çalışma net bir hedefle başlar ve bu ~dört ölçüte~ göre yazılır." from="right" />
        </Reveal>
        <div className="sb-grid">
          {goals.map((g, i) => (
            <Reveal key={g.w} className="sb-item" from={i % 2 ? "right" : "left"} delay={i * 0.08}>
              <b>{g.w}</b>
              <p>{g.t}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
