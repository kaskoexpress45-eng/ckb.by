import Link from "next/link";
import { Portrait } from "@/components/portrait";
import { HomeForm } from "@/components/home-form";
import { Arrow, GrowSteps, SectionIntro } from "@/components/ui";
import { consultation, contact, directions, faqs, siteUrl, proposition } from "@/lib/site";
export const metadata = {
  title: "Юрий Бельчик — продажи, переговоры и развитие руководителей",
  alternates: { canonical: "/" },
};
export default function Home() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${siteUrl}/#yuri`,
        name: "Юрий Бельчик",
        url: siteUrl,
        image: `${siteUrl}/images/yuri-belchik-portrait-retouched.png`,
        telephone: contact.phone,
        email: contact.email,
        sameAs: [contact.telegram],
        description:
          "Консультант по продажам, переговорам, развитию руководителей и страхованию",
      },
      {
        "@type": "WebSite",
        name: "CKB.by — Юрий Бельчик",
        url: siteUrl,
        inLanguage: "ru",
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map(([name, text]) => ({
          "@type": "Question",
          name,
          acceptedAnswer: { "@type": "Answer", text },
        })),
      },
    ],
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
        }}
      />
      <section className="hero">
        <div className="container">
          <div className="hero-topline">
            <span className="eyebrow">
              <span className="status-dot" />
              Практик продаж и переговоров
            </span>
            <span className="hero-descriptor">Архитектор сильных решений</span>
          </div>
          <div className="hero-grid">
            <div className="hero-copy">
              <h1>{proposition.headline}</h1>
              <p className="hero-subtitle">{proposition.subheadline}</p>
              <p className="hero-description">{proposition.description}</p>
              <div className="hero-actions">
                <Link href={consultation()} className="button">
                  Разобрать задачу команды <Arrow />
                </Link>
                {contact.telegram ? (
                  <a
                    className="text-link"
                    href={contact.telegram}
                    data-track="telegram_click"
                  >
                    Написать в Telegram <Arrow diagonal />
                  </a>
                ) : (
                  <a href="#approach" className="text-link">
                    Как проходит работа <Arrow diagonal />
                  </a>
                )}
              </div>
            </div>
            <Portrait hero />
          </div>
          <div className="hero-proof">
            <div><strong>20+ лет практики</strong><span>В продажах, страховании и переговорах</span></div>
            <div><strong>Работа на ваших ситуациях</strong><span>Диагностика, отработка и закрепление навыка</span></div>
            <a href="#approach" className="text-link">Как проходит работа <Arrow /></a>
          </div>
        </div>
      </section>
      <section id="tasks" className="section">
        <div className="container">
          <SectionIntro
            label="С чего начнём"
            title="Что вы хотите изменить?"
            text="Не обязательно знать название нужной услуги. Достаточно понять, что сейчас не получается — и каким вы хотите видеть результат."
          />
          <div className="task-grid">
            {[
              [
                "Продажи",
                "Разговоров много. Продвижения к сделке — мало.",
                "Разберём, как выявлять потребности, работать с возражениями и выстраивать понятную логику продажи.",
                "sales",
              ],
              [
                "Переговоры",
                "Сложно договориться на своих условиях.",
                "Посмотрим на реальные диалоги: позиции сторон, мотивы, сложные вопросы и возможные решения.",
                "negotiations",
              ],
              [
                "Руководство",
                "Команде нужен общий подход и ясный вектор.",
                "Обсудим задачи руководителя, коммуникацию и развитие навыков команды через практическую работу.",
                "leadership",
              ],
            ].map(([name, title, text, task]) => (
              <article className="task-card" key={name}>
                <div className="task-card-top">
                  <span>{name}</span>
                  <Arrow diagonal />
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
                <Link
                  href={`${consultation().replace("#consultation", "")}&task=${task}#consultation`}
                >
                  Разобрать ситуацию <span className="sr-only">: {name}</span>
                </Link>
              </article>
            ))}
          </div>
          <Link href="/razvitie" className="text-link section-link">
            Все темы и форматы работы <Arrow />
          </Link>
        </div>
      </section>
      <section id="approach" className="section approach-section">
        <div className="container">
          <div className="split-heading">
            <SectionIntro
              label="Подход к работе"
              title="Не просто поговорить. Понять, что делать дальше."
            />
            <p>
              От желаемого результата — к реальной ситуации, возможным решениям
              и первому действию. Четыре вопроса, которые помогают сделать
              разговор предметным.
            </p>
          </div>
          <GrowSteps />
          <p className="quiet-note">
            Формат и содержание работы выбираем под вашу задачу — без готовой
            программы для всех
          </p>
        </div>
      </section>
      <section className="section">
        <div className="container trust-layout">
          <div className="trust-heading">
            <span className="eyebrow">Почему мне доверяют</span>
            <div className="experience">
              20<span>+</span>
            </div>
            <p>
              лет опыта в продажах,
              <br />
              страховании и переговорах
            </p>
          </div>
          <div className="trust-body">
            <h2>
              Сложную ситуацию
              <br />
              можно сделать яснее
            </h2>
            <div className="principle">
              <h3>Сначала понять, потом предлагать</h3>
              <p>Разбираю вашу задачу, а не подгоняю её под готовую услугу</p>
            </div>
            <div className="principle">
              <h3>Объяснить простым языком</h3>
              <p>
                Без лишних терминов. С вниманием к условиям, ограничениям и
                следующим шагам
              </p>
            </div>
            <div className="principle">
              <h3>Остаться на связи</h3>
              <p>
                Долгосрочные отношения и сопровождение важнее разовой продажи
              </p>
            </div>
            <Link href="/obo-mne" className="text-link">
              Познакомиться с Юрием <Arrow />
            </Link>
          </div>
        </div>
      </section>
      <section className="case-section">
        <div className="container case-layout">
          <div>
            <span className="eyebrow">Из практики</span>
            <h2>
              Продажи начинаются
              <br />с системы
            </h2>
            <p className="case-intro">
              Руководитель компании обратился с задачей усилить продажи команды
            </p>
          </div>
          <div className="case-story">
            <div>
              <span>Ситуация</span>
              <p>
                Команде требовался единый подход к переговорам и работе с
                клиентом
              </p>
            </div>
            <div>
              <span>Работа</span>
              <p>
                Обучение выявлению потребностей, алгоритму переговоров и работе
                с возражениями
              </p>
            </div>
            <div>
              <span>Результат</span>
              <p>
                Команда получила общий алгоритм и стала увереннее вести диалог с
                клиентом
              </p>
            </div>
            <p className="case-note">
              Один пример практики. Результат вашей работы будет зависеть от
              задачи и применения инструментов.
            </p>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="split-heading">
            <SectionIntro
              label="Другие задачи"
              title="Развитие опирается на устойчивость"
            />
            <p>
              Когда важно защитить настоящее или подготовить будущее, можно
              начать с финансовой стороны решения.
            </p>
          </div>
          <div className="other-directions">
            {directions.slice(1).map((d) => (
              <Link href={d.path} className="direction-row" key={d.key}>
                <div>
                  <span className="eyebrow">{d.name}</span>
                  <h3>{d.title}</h3>
                  <p>{d.text}</p>
                </div>
                <span className="round-arrow">
                  <Arrow diagonal />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="section faq-section">
        <div className="container faq-layout">
          <SectionIntro
            label="Перед первым разговором"
            title="Что важно знать заранее"
          />
          <div className="faq-list">
            {faqs.map(([question, answer]) => (
              <details key={question}>
                <summary>
                  {question}
                  <span aria-hidden="true">+</span>
                </summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <HomeForm />
    </>
  );
}
