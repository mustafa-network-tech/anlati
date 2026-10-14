import { team } from "@/lib/team";
import Reveal from "./Reveal";

export default function Team() {
  if (team.length === 0) return null;
  return (
    <section className="hm-sec" aria-labelledby="ekip">
      <Reveal className="hm-head" from="left">
        <p className="hm-eyebrow">KİM HAZIRLIYOR?</p>
        <h2 id="ekip">Anlatınızı kim hazırlıyor?</h2>
        <p className="hm-sub">ANLATI, MK Digital Systems bünyesinde çalışan bir anlatı stüdyosudur.</p>
      </Reveal>
      <ul className="tm-list">
        {team.map((m) => (
          <li key={m.name}>
            <h3>{m.name}</h3>
            <b>{m.role}</b>
            <p>{m.bio}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
