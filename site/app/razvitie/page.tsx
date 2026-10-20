import Image from "next/image";
import Link from "next/link";
import {
  Arrow,
  ConsultationCTA,
  GrowSteps,
  SectionIntro,
} from "@/components/ui";
import { consultation, siteUrl, developmentFormats } from "@/lib/site";
export const metadata = {
  title: "Продажи, переговоры и развитие руководителей",
  description:
    "Тренинги, разборы переговоров и коучинг для руководителей и команд. Выберите формат под вашу задачу и обсудите следующий шаг.",
  alternates: { canonical: "/razvitie" },
};
export default function Development() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Продажи, переговоры и развитие руководителей",
    provider: { "@type": "Person", name: "Юрий Бельчик", url: siteUrl },
    serviceType: [
      "Тренинг",
      "Разбор переговоров",
      "Коучинг",
      "Стратегическая сессия",
    ],
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <section className="page-hero development-hero">
        <div className="container">
          <nav className="breadcrumbs" aria-label="Хлебные крошки">
            <Link href="/">Главная</Link>
            <span>/</span>
            <span>Развитие</span>
          </nav>
          <span className="eyebrow">Люди. Команды. Решения.</span>
          <h1>
            Увереннее в диалоге.
            <br />
            Сильнее в действии.
          </h1>
          <p>
            Продажи, переговоры и развитие руководителей. Тренинги, разборы и
            коучинг для тех, кому важно применять знания в реальных ситуациях.
          </p>
          <Link href={consultation()} className="button">
            Обсудить задачу
            <Arrow />
          </Link>
        </div>
      </section>
      <section className="section speaking-section"><div className="container speaking-layout">
        <figure className="speaking-photo"><Image src="/images/yuri-belchik-speaking.jpg" alt="Юрий Бельчик выступает перед аудиторией" width={1280} height={853} sizes="(max-width: 650px) 100vw, 55vw" /></figure>
        <div><SectionIntro label="Команды и аудитории" title="Практика, которую можно перенести в работу" text="Выступаю как спикер и провожу корпоративные тренинги для отделов продаж. Разбираем реальные переговоры, возражения, разговоры о деньгах и сложные продукты."/><p>Сначала — диагностика текущих диалогов. Затем — отработка формулировок и закрепление навыков с понятными критериями качества.</p><Link className="text-link" href={consultation("development", { format: "team-training" })}>Обсудить корпоративный тренинг <Arrow /></Link></div>
      </div></section>
      <section className="section">
        <div className="container">
          <div className="split-heading">
            <SectionIntro
              label="Для кого"
              title="Когда прежнего подхода уже недостаточно"
            />
            <p>
              Для собственников бизнеса, руководителей отделов продаж,
              менеджеров, HR и корпоративных заказчиков. Для экспертов и людей,
              которые хотят усилить личную эффективность.
            </p>
          </div>
          <div className="topic-list">
            {[
              ["Продажи через личность", "sales"],
              ["Переговоры и работа с возражениями", "negotiations"],
              ["Профайлинг клиента", "profiling"],
              ["Управление коммуникацией", "communication"],
              ["Коучинг целей и решений", "coaching"],
              ["Развитие руководителей и команд", "leadership"],
            ].map(([title, task]) => (
              <Link key={task} href={consultation("development", { task })}>
                <h3>{title}</h3>
                <Arrow />
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="section approach-section">
        <div className="container">
          <SectionIntro
            label="Сначала задача, потом формат"
            title="Работа, которая подходит вашей ситуации"
          />
          <div className="format-grid">
            {developmentFormats.map(({ id, title, text }) => (
              <article key={title}>
                <h3>{title}</h3>
                <p>{text}</p>
                <Link className="text-link" href={consultation("development", { format: id })}>
                  Обсудить формат <span className="sr-only">{title}</span>
                  <Arrow />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <SectionIntro
            label="От запроса к плану"
            title="Четыре вопроса перед началом"
            text="Определяем ожидаемые изменения, обсуждаем текущую ситуацию и договариваемся о следующем шаге."
          />
          <GrowSteps />
        </div>
      </section>
      <section className="case-section">
        <div className="container case-layout">
          <div>
            <span className="eyebrow">Практический смысл</span>
            <h2>Инструменты остаются с вами</h2>
          </div>
          <div>
            <ul className="benefit-list">
              <li>Понимание сильных сторон и зон развития</li>
              <li>Система ведения переговоров</li>
              <li>Навык выявления потребностей и мотивов клиента</li>
              <li>Более уверенное поведение в сложных диалогах</li>
              <li>Практические инструменты для работы</li>
            </ul>
            <p className="case-note">
              Ожидаемые изменения обсуждаем до начала работы. Конкретный
              результат зависит от задачи, участия и применения инструментов.
            </p>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <SectionIntro
            label="Полезный разбор"
            title="Подготовиться к важному разговору"
          />
          <Link
            href="/stati/podgotovka-k-peregovoram"
            className="direction-row"
          >
            <h3>Как подготовиться к сложным переговорам</h3>
            <Arrow diagonal />
          </Link>
        </div>
      </section>
      <ConsultationCTA title="Какую задачу вы хотите решить?" />
    </>
  );
}
