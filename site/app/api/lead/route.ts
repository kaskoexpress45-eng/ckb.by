import { createClient } from "@supabase/supabase-js";
import {
  createRateLimiter,
  deliverLead,
  validateLead,
  type Lead,
} from "@/lib/lead";
import { createHash } from "node:crypto";
export const runtime = "nodejs";
const allow = createRateLimiter();
const json = (body: Record<string, unknown>, status = 200) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const urlInfo = new URL(request.url);
  const host = request.headers.get("host");
  const allowedOrigins = new Set(
    [
      urlInfo.origin,
      host ? `${urlInfo.protocol}//${host}` : "",
      process.env.NEXT_PUBLIC_SITE_URL,
    ].filter(Boolean),
  );
  if (origin && !allowedOrigins.has(origin))
    return json({ error: "Отправьте заявку с сайта." }, 403);
  if (!request.headers.get("content-type")?.includes("application/json"))
    return json({ error: "Неверный формат запроса." }, 415);
  const raw = await request.text();
  if (Buffer.byteLength(raw, "utf8") > 8192)
    return json({ error: "Слишком длинное сообщение." }, 413);
  let input: unknown;
  try {
    input = JSON.parse(raw);
  } catch {
    return json({ error: "Проверьте данные формы." }, 400);
  }
  const checked = validateLead(input);
  if ("spam" in checked) return json({ ok: true });
  if ("error" in checked) return json({ error: checked.error }, 400);
  const address =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
  const key = createHash("sha256").update(address).digest("hex");
  if (!allow(key))
    return json(
      { error: "Слишком много обращений. Пожалуйста, попробуйте позже." },
      429,
    );
  if (process.env.LEAD_INTAKE_ENABLED !== "true")
    return json(
      { error: "Онлайн-запись пока недоступна. Попробуйте позже." },
      503,
    );
  const channels: Array<(lead: Lead) => Promise<void>> = [];
  const url = process.env.SUPABASE_URL,
    secret = process.env.SUPABASE_SECRET_KEY;
  if (url && secret)
    channels.push(async (lead) => {
      const client = createClient(url, secret, {
        auth: { persistSession: false, autoRefreshToken: false },
        global: {
          fetch: (input, init) =>
            fetch(input, { ...init, signal: AbortSignal.timeout(10000) }),
        },
      });
      const { error } = await client.from("leads").insert(lead);
      if (error) throw new Error("database_delivery_failed");
    });
  const token = process.env.TELEGRAM_BOT_TOKEN,
    chat = process.env.TELEGRAM_CHAT_ID;
  if (token && chat)
    channels.push(async (lead) => {
      const names = {
        development: "Развитие",
        protection: "Защита",
        capital: "Капитал",
      };
      const text = [
        "Новая заявка CKB.by",
        `Имя: ${lead.name}`,
        `Контакт: ${lead.phone || lead.telegram}`,
        `Направление: ${names[lead.direction]}`,
        `Комментарий: ${lead.message || "—"}`,
        `Страница: ${lead.page}`,
        `UTM: ${JSON.stringify(lead.utm)}`,
        new Date().toLocaleString("ru-RU", { timeZone: "Europe/Minsk" }),
      ].join("\n");
      const response = await fetch(
        `https://api.telegram.org/bot${token}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: chat, text }),
          signal: AbortSignal.timeout(10000),
        },
      );
      if (!response.ok) throw new Error("notification_delivery_failed");
      const result = await response.json();
      if (!result.ok) throw new Error("notification_delivery_failed");
    });
  const result = await deliverLead(checked.lead, channels);
  if (result.failed)
    console.warn("lead_delivery_channel_failure", { count: result.failed });
  if (!result.accepted)
    return json(
      {
        error:
          "Не удалось отправить заявку. Попробуйте позже или используйте другой способ связи.",
      },
      503,
    );
  return json({ ok: true });
}
