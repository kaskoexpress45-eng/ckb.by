import { Arrow } from "@/components/ui";
import { LeadForm } from "@/components/lead-form";
import { DirectContact } from "@/components/direct-contact";
import { contact, requestTopics, developmentFormats } from "@/lib/site";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Связаться с Юрием Бельчиком",
  description:
    "Обсудите продажи, переговоры, развитие команды или страхование. Оставьте удобный контакт и несколько слов о задаче.",
  alternates: { canonical: "/kontakty" },
};
export default async function Contacts({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const direction =
    typeof params.direction === "string" &&
    ["development", "protection", "capital"].includes(params.direction)
      ? params.direction
      : "development";
  const taskMessage = typeof params.task === "string" && Object.hasOwn(requestTopics, params.task) ? requestTopics[params.task] : "";
  const format = direction === "development" && typeof params.format === "string" ? developmentFormats.find((item) => item.id === params.format) : undefined;
  const task = format ? `Хочу обсудить формат «${format.title}»` : taskMessage;
  const enabled =
    process.env.LEAD_INTAKE_ENABLED === "true" &&
    Boolean(
      (process.env.SUPABASE_URL && process.env.SUPABASE_SECRET_KEY) ||
      (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID),
    );
  const message = task || ({
    development: "Хочу обсудить продажи и переговоры",
    protection: "Хочу обсудить страховую защиту",
    capital: "Хочу обсудить накопительную программу",
  }[direction] || "Хочу обсудить мою задачу");
  return (
    <section className="section contact-section" id="consultation">
      <div className="container contact-layout">
        <div className="contact-intro">
          <span className="eyebrow">Первый шаг</span>
          <h1>
            Давайте разберём
            <br />
            вашу ситуацию
          </h1>
          <p className="large-text">
            Расскажите, что хотите изменить. Я свяжусь с вами, чтобы обсудить
            задачу и предложить следующий шаг.
          </p>
        </div>
        {enabled ? (
          <LeadForm
            initialDirection={direction}
            initialTask={task}
            enabled
          />
        ) : (
          <DirectContact message={message} />
        )}
        <div className="contact-methods">
          <h2>Другие способы связи</h2>
          <div className="contact-links">
            {contact.phone && (
              <a
                href={`tel:${contact.phone.replace(/[^+\d]/g, "")}`}
                data-track="phone_click"
              >
                <span>Позвонить</span>
                {contact.phone}
              </a>
            )}
            {contact.telegram && (
              <a href={contact.telegram} data-track="telegram_click">
                <span>Написать</span>Telegram <Arrow diagonal />
              </a>
            )}
            {contact.email && (
              <a href={`mailto:${contact.email}`}>
                <span>Email</span>
                {contact.email}
              </a>
            )}
            {contact.instagram && (
              <a href={contact.instagram}>
                <span>Профиль</span>Instagram <Arrow diagonal />
              </a>
            )}
          </div>
          <p className="quiet-note">
            Продажи и переговоры · Руководители и команды
            <br />
            Страховая защита · Накопительные программы
          </p>
        </div>
      </div>
    </section>
  );
}
