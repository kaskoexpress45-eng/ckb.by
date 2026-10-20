"use client";
import { Arrow } from "@/components/ui";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { contact } from "@/lib/site";
export function LeadForm({
  initialDirection = "development",
  initialTask = "",
  enabled = false,
}: {
  initialDirection?: string;
  initialTask?: string;
  enabled?: boolean;
}) {
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [error, setError] = useState("");
  const [direction, setDirection] = useState(initialDirection);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    setError("");
    const utm = Object.fromEntries(
      [...new URLSearchParams(location.search)].filter(([k]) =>
        /^utm_(source|medium|campaign|term|content)$/.test(k),
      ),
    );
    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...Object.fromEntries(data),
          consent: data.get("consent") === "on",
          page: location.pathname,
          utm,
        }),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(
          result.error || "Не удалось отправить заявку. Попробуйте позже.",
        );
      setStatus("success");
      form.reset();
      window.dispatchEvent(
        new CustomEvent("ckb:lead-success", { detail: { direction } }),
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не удалось отправить заявку");
      setStatus("error");
    }
  }
  if (status === "success")
    return (
      <div className="form-success" role="status">
        <span className="success-mark">✓</span>
        <h2>Заявка принята</h2>
        <p>
          Спасибо, что рассказали о задаче. Юрий свяжется с вами по указанному
          контакту.
        </p>
        <button className="button" onClick={() => setStatus("idle")}>
          Написать ещё
        </button>
      </div>
    );
  return (
    <form
      className="lead-form"
      onSubmit={submit}
      aria-label="Заявка на консультацию"
    >
      <div className="form-grid">
        <label>
          Как к вам обращаться
          <input
            name="name"
            autoComplete="name"
            required
            maxLength={100}
            placeholder="Ваше имя"
          />
        </label>
        <label>
          Направление
          <select
            name="direction"
            value={direction}
            onChange={(e) => setDirection(e.target.value)}
          >
            <option value="development">Развитие</option>
            <option value="protection">Защита</option>
            <option value="capital">Капитал</option>
          </select>
        </label>
      </div>
      <label>
        Как с вами связаться
        <input
          name="contact"
          autoComplete="tel"
          required
          maxLength={100}
          placeholder="Телефон, например +375… или @telegram"
        />
        <span className="field-hint">
          Достаточно одного удобного способа связи
        </span>
      </label>
      <label>
        Что хотите обсудить? <span className="optional">Необязательно</span>
        <textarea
          name="message"
          maxLength={2000}
          rows={4}
          defaultValue={initialTask}
          placeholder="Опишите задачу в нескольких словах"
        />
      </label>
      <div className="honeypot" aria-hidden="true">
        <label>
          Сайт компании
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <label className="consent-label">
        <input type="checkbox" name="consent" required />
        <span>
          Согласен на обработку персональных данных для ответа на обращение.{" "}
          <Link href="/politika">Условия обработки</Link>
        </span>
      </label>
      {!enabled && (
        <p className="form-notice" role="status">
          Онлайн-запись пока недоступна.
          {contact.telegram
            ? " Вы можете написать Юрию в Telegram."
            : " Приём заявок откроется позже."}
        </p>
      )}
      {status === "error" && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <button
        className="button form-submit"
        type="submit"
        disabled={!enabled || status === "sending"}
      >
        {status === "sending" ? "Отправляем…" : "Отправить заявку"}
        <span aria-hidden="true">
          <Arrow diagonal />
        </span>
      </button>
      {contact.telegram && (
        <a
          className="text-link"
          href={contact.telegram}
          data-track="telegram_click"
        >
          Или написать в Telegram <Arrow diagonal />
        </a>
      )}
      <p className="field-hint">
        Заявка — начало разговора, а не обязательство приобрести услугу
      </p>
    </form>
  );
}
