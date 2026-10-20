import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { services } from "@/content/services";
import { Arrow, ConsultationCTA, SectionIntro } from "@/components/ui";
import { consultation, siteUrl } from "@/lib/site";
type Slug = keyof typeof services;
export const dynamicParams = false;
export function generateStaticParams() {
  return Object.keys(services).map((service) => ({ service }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ service: string }>;
}): Promise<Metadata> {
  const { service } = await params;
  const s = services[service as Slug];
  if (!s) return {};
  return {
    title: `${s.label} — Юрий Бельчик`,
    description: s.description,
    alternates: { canonical: `/${service}` },
  };
}
export default async function ServicePage({
  params,
}: {
  params: Promise<{ service: string }>;
}) {
  const { service } = await params;
  const s = services[service as Slug];
  if (!s) notFound();
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: s.title,
        description: s.description,
        provider: { "@type": "Person", name: "Юрий Бельчик", url: siteUrl },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Главная", item: siteUrl },
          {
            "@type": "ListItem",
            position: 2,
            name: s.label,
            item: `${siteUrl}/${service}`,
          },
        ],
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
      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumbs" aria-label="Хлебные крошки">
            <Link href="/">Главная</Link>
            <span>/</span>
            <span>{s.label}</span>
          </nav>
          <span className="eyebrow">{s.label}</span>
          <h1>{s.title}</h1>
          <p>{s.description}</p>
          <Link href={consultation(s.direction)} className="button">
            {s.action}
            <Arrow />
          </Link>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <SectionIntro label="Под вашу ситуацию" title={s.section} />
          <div className="simple-grid">
            {s.items.map((item) => (
              <div className="simple-item" key={item}>
                <span className="tiny-square" />
                <h3>{item}</h3>
              </div>
            ))}
          </div>
          {service === "kapital" && (
            <p className="large-text service-extra">
              Для родителей, семей, людей 30–45 лет и предпринимателей, которым
              важны долгосрочные цели и личная финансовая устойчивость
            </p>
          )}
        </div>
      </section>
      <section className="section approach-section">
        <div className="container note-layout">
          <span className="quote-mark" aria-hidden="true">
            “
          </span>
          <div>
            <h2>{s.noteTitle}</h2>
            <p className="large-text">{s.note}</p>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <SectionIntro
            label="Без сложных терминов"
            title="Как проходит работа"
          />
          <ol className="process-list">
            {s.steps.map((step, i) => (
              <li key={step}>
                <span>0{i + 1}</span>
                <h3>{step}</h3>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className="case-section">
        <div className="container case-layout">
          <div>
            <span className="eyebrow">Из практики</span>
            <h2>{s.caseTitle}</h2>
          </div>
          <div>
            <p className="large-text">{s.caseText}</p>
            <p className="case-note">{s.disclaimer}</p>
          </div>
        </div>
      </section>
      <ConsultationCTA
        direction={s.direction}
        title={
          service === "kapital"
            ? "Подходит ли это вашей цели?"
            : "Какая защита нужна именно вам?"
        }
        text="Разберём вашу ситуацию и условия возможного решения. Без давления и обязательства оформить услугу."
      />
    </>
  );
}
