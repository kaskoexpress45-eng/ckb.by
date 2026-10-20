import { Arrow } from "@/components/ui";
import { contact } from "@/lib/site";

export function DirectContact({ message = "Хочу обсудить продажи и переговоры" }: { message?: string }) {
  const telegramDraft = contact.telegram ? new URL(contact.telegram) : null;
  telegramDraft?.searchParams.set("text", `Здравствуйте, Юрий! ${message}.`);
  return (
    <div className="direct-contact-panel">
      <span className="eyebrow">Первый разговор</span>
      <h2>Напишите Юрию напрямую</h2>
      <p className="large-text">{message}</p>
      <p>Расскажите, что хотите изменить и что мешает сейчас. Обсудим ситуацию и выберем следующий шаг.</p>
      {telegramDraft && (
        <a className="button" href={telegramDraft.toString()} data-track="telegram_click">
          Написать в Telegram <Arrow diagonal />
        </a>
      )}
      {contact.email && (
        <a className={telegramDraft ? "text-link" : "button"} href={`mailto:${contact.email}?subject=${encodeURIComponent(message)}`}>
          Написать по почте <Arrow diagonal />
        </a>
      )}
      <p className="field-hint">Откроется черновик сообщения. Вы сможете дополнить его и отправить сами. Обращение ни к чему не обязывает.</p>
    </div>
  );
}
