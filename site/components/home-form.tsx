import { DirectContact } from "@/components/direct-contact";
import { LeadForm } from "@/components/lead-form";
export function HomeForm() {
  const enabled =
    process.env.LEAD_INTAKE_ENABLED === "true" &&
    Boolean(
      (process.env.SUPABASE_URL && process.env.SUPABASE_SECRET_KEY) ||
      (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID),
    );
  return (
    <section className="section home-consultation" id="consultation">
      <div className="container contact-layout">
        <div>
          <span className="eyebrow">Первый шаг</span>
          <h2>
            Давайте разберём
            <br />
            вашу ситуацию
          </h2>
          <p className="large-text">
            Начните с нескольких слов о задаче. Обсудим, что хотите изменить и
            какой формат работы подойдёт.
          </p>
          <p className="quiet-note">
            Можно обратиться по вопросам развития, защиты или капитала
          </p>
        </div>
        {enabled ? <LeadForm enabled /> : <DirectContact />}
      </div>
    </section>
  );
}
