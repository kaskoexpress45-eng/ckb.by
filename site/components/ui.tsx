import Link from "next/link";
import { consultation, grow } from "@/lib/site";
export function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d={diagonal ? "M6 18 18 6M6 6h12v12" : "M4 12h15m-6-6 6 6-6 6"}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
export function SectionIntro({
  label,
  title,
  text,
}: {
  label: string;
  title: string;
  text?: string;
}) {
  return (
    <div className="section-intro">
      <span className="eyebrow">{label}</span>
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </div>
  );
}
export function GrowSteps() {
  return (
    <div className="grow-grid">
      {grow.map((s, i) => (
        <article className="grow-step" key={s.label}>
          <span className="step-number">0{i + 1}</span>
          <span className="step-label">{s.label}</span>
          <h3>{s.title}</h3>
          <p>{s.text}</p>
        </article>
      ))}
    </div>
  );
}
export function ConsultationCTA({
  direction = "development",
  title = "Начнём с вашей задачи",
  text = "Расскажите, что хотите изменить. Обсудим ситуацию и определим следующий шаг.",
}: {
  direction?: string;
  title?: string;
  text?: string;
}) {
  return (
    <section className="cta-section">
      <div className="container cta-inner">
        <div>
          <span className="eyebrow">Личный разговор</span>
          <h2>{title}</h2>
          <p>{text}</p>
        </div>
        <Link className="button button-light" href={consultation(direction)}>
          Обсудить задачу <Arrow />
        </Link>
      </div>
    </section>
  );
}
export function Roadmap() {
  return (
    <div
      className="roadmap"
      role="img"
      aria-label="От текущей ситуации через ясную цель к решению и действию"
    >
      <div className="roadmap-top">
        <span>
          Любая перемена начинается
          <br />с точного вопроса
        </span>
        <span className="compass">
          <Arrow diagonal />
        </span>
      </div>
      <div className="roadmap-drawing">
        <div className="roadmap-orbit orbit-one" />
        <div className="roadmap-orbit orbit-two" />
        <div className="roadmap-axis" />
        <div className="roadmap-point point-a">
          <i />
          Ваша ситуация
        </div>
        <div className="roadmap-point point-b">
          <i />
          Ясная цель
        </div>
        <div className="roadmap-center">
          <span>Решение</span>
          <small>которое подходит вам</small>
        </div>
      </div>
      <div className="roadmap-bottom">
        <span>Понять</span>
        <span>Выбрать</span>
        <span>Действовать</span>
      </div>
    </div>
  );
}
