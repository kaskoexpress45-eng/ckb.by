import { Arrow } from "@/components/ui";
import Link from "next/link";
import { contact, navigation } from "@/lib/site";
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div>
            <Link className="wordmark" href="/">
              <span className="brand-name">Юрий Бельчик</span><span className="brand-tagline">Продажи и переговоры</span>
            </Link>
            <p>
              Юрий Бельчик
              <br />
              Архитектор сильных решений
            </p>
          </div>
          <nav aria-label="Навигация в подвале">
            {[...navigation,["/stati","Материалы"]].map(([href, label]) => (
              <Link href={href} key={href}>
                {label}
              </Link>
            ))}
          </nav>
          <div className="footer-contact">
            <span>Есть задача? Обсудим.</span>
            {contact.telegram && (
              <a href={contact.telegram} data-track="telegram_click">
                Написать в Telegram <Arrow diagonal />
              </a>
            )}
            {contact.phone && (
              <a
                href={`tel:${contact.phone.replace(/[^+\d]/g, "")}`}
                data-track="phone_click"
              >
                {contact.phone}
              </a>
            )}
            {contact.email && (
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            )}
            <Link href="/kontakty">
              Связаться с Юрием <Arrow diagonal />
            </Link>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Юрий Бельчик</span>
          <Link href="/politika">Обработка персональных данных</Link>
          <span>Защита. Капитал. Развитие.</span>
        </div>
      </div>
    </footer>
  );
}
