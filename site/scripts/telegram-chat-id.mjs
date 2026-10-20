import { loadEnvFile } from "node:process";
try {
  loadEnvFile(".env.local");
} catch {}
const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
  console.error("Set TELEGRAM_BOT_TOKEN securely in environment settings.");
  process.exit(1);
}
try {
  const response = await fetch(
    `https://api.telegram.org/bot${token}/getUpdates`,
    { signal: AbortSignal.timeout(10000) },
  );
  const data = await response.json();
  if (!response.ok || !data.ok) throw new Error();
  const ids = [
    ...new Set(
      data.result
        .map((x) => (x.message || x.channel_post)?.chat?.id)
        .filter(Boolean),
    ),
  ];
  if (!ids.length) console.log("Open your bot and press Start, then rerun.");
  else ids.forEach((id) => console.log("TELEGRAM_CHAT_ID=" + id));
} catch {
  console.error(
    "Could not read bot chats. Check token and api.telegram.org access.",
  );
  process.exit(1);
}
