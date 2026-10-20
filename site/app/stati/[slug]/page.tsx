import Link from "next/link";
import { notFound } from "next/navigation";
import { articles } from "@/content/articles";
import { ConsultationCTA } from "@/components/ui";
export const dynamicParams = false;
export function generateStaticParams() {
  return articles.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  return article
    ? {
        title: article.title,
        description: article.description,
        alternates: { canonical: `/stati/${slug}` },
      }
    : {};
}
export default async function Article({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  if (!article) notFound();
  return (
    <>
      <article className="section">
        <div className="container prose">
          <Link className="text-link" href="/razvitie">
            ← Развитие
          </Link>
          <h1>{article.title}</h1>
          <p className="large-text">{article.description}</p>
          {article.sections.map((s) => (
            <section key={s.heading}>
              <h2>{s.heading}</h2>
              <p>{s.text}</p>
            </section>
          ))}
        </div>
      </article>
      <ConsultationCTA />
    </>
  );
}
