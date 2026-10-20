export type Lead = {
  name: string;
  phone: string | null;
  telegram: string | null;
  direction: "development" | "protection" | "capital";
  message: string;
  page: string;
  utm: Record<string, string>;
  consent: true;
};
export function validateLead(
  value: unknown,
): { lead: Lead } | { error: string } | { spam: true } {
  if (!value || typeof value !== "object" || Array.isArray(value))
    return { error: "Проверьте данные формы." };
  const v = value as Record<string, unknown>;
  if (typeof v.website === "string" && v.website.trim()) return { spam: true };
  const text = (key: string, max: number) =>
    typeof v[key] === "string" && (v[key] as string).length <= max
      ? (v[key] as string).trim()
      : "";
  const name = text("name", 100),
    contact = text("contact", 100),
    direction = text("direction", 30),
    message = text("message", 2000);
  if (!name) return { error: "Укажите имя — не более 100 символов." };
  if (v.consent !== true)
    return {
      error: "Для ответа на заявку необходимо согласие на обработку данных.",
    };
  if (!["development", "protection", "capital"].includes(direction))
    return { error: "Выберите направление." };
  if (
    typeof v.message !== "undefined" &&
    (typeof v.message !== "string" || v.message.length > 2000)
  )
    return { error: "Комментарий должен содержать не более 2000 символов." };
  const isTelegram = /^@[a-zA-Z][a-zA-Z0-9_]{4,31}$/.test(contact);
  const digits = contact.replace(/\D/g, "");
  const isPhone =
    /^\+?[0-9 ()-]+$/.test(contact) &&
    digits.length >= 7 &&
    digits.length <= 15 &&
    contact.length <= 40;
  if (!isTelegram && !isPhone)
    return {
      error: "Укажите телефон с кодом страны или Telegram в формате @username.",
    };
  const utm: Record<string, string> = {};
  if (v.utm && typeof v.utm === "object" && !Array.isArray(v.utm))
    for (const [key, val] of Object.entries(v.utm)) {
      if (
        /^utm_(source|medium|campaign|term|content)$/.test(key) &&
        typeof val === "string" &&
        val.length <= 200
      )
        utm[key] = val;
    }
  const page = text("page", 1000);
  if (page && !/^\/(?!\/)/.test(page))
    return { error: "Обновите страницу и попробуйте ещё раз." };
  return {
    lead: {
      name,
      phone: isPhone ? contact : null,
      telegram: isTelegram ? contact : null,
      direction: direction as Lead["direction"],
      message,
      page,
      utm,
      consent: true,
    },
  };
}
export function createRateLimiter(
  limit = 5,
  windowMs = 600000,
  maxEntries = 10000,
) {
  const entries = new Map<string, { count: number; expires: number }>();
  return (key: string, now = Date.now()) => {
    for (const [key, entry] of entries)
      if (entry.expires <= now) entries.delete(key);
    const entry = entries.get(key);
    if (entry) {
      if (entry.count >= limit) return false;
      entry.count++;
      return true;
    }
    if (entries.size >= maxEntries) return false;
    entries.set(key, { count: 1, expires: now + windowMs });
    return true;
  };
}
export async function deliverLead(
  lead: Lead,
  channels: Array<(lead: Lead) => Promise<void>>,
) {
  const outcomes = await Promise.allSettled(
    channels.map((channel) => channel(lead)),
  );
  return {
    accepted: outcomes.some((r) => r.status === "fulfilled"),
    failed: outcomes.filter((r) => r.status === "rejected").length,
  };
}
