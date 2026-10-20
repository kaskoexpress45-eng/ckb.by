import Image from "next/image";
export function Portrait({ hero = false }: { hero?: boolean }) {
  return <figure className={hero ? "portrait hero-portrait" : "portrait about-portrait"}>
    <div className="portrait-frame"><Image src="/images/yuri-belchik-portrait-retouched.png" alt="Юрий Бельчик — практик продаж и переговоров" fill sizes={hero ? "(max-width: 650px) 100vw, 45vw" : "(max-width: 650px) 100vw, 40vw"} preload={hero} /></div>
    <figcaption><span>Юрий Бельчик</span><span>Практик продаж и переговоров</span></figcaption>
  </figure>;
}
