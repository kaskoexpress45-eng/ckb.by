import Link from "next/link";
export default function NotFound() {
  return (
    <section className="section">
      <div className="container not-found">
        <span className="eyebrow">Страница не найдена</span>
        <h1>Пойдём другим путём</h1>
        <p>
          Возможно, адрес изменился. На главной можно выбрать нужное
          направление.
        </p>
        <Link className="button" href="/">
          На главную
        </Link>
      </div>
    </section>
  );
}
