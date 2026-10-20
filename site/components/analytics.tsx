"use client";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
type AnalyticsWindow = Window & {
  ym?: (...args: unknown[]) => void;
  dataLayer?: unknown[];
};
function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("ckb:analytics-consent", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("ckb:analytics-consent", callback);
  };
}
function snapshot() {
  try {
    const v = localStorage.getItem("ckb-analytics");
    return v === "yes" ? true : v === "no" ? false : null;
  } catch {
    return false;
  }
}
export function Analytics() {
  const consent = useSyncExternalStore(subscribe, snapshot, () => null);
  const id = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID;
  const path = usePathname();
  const lastPath = useRef(path);
  useEffect(() => {
    if (consent && id && /^\d+$/.test(id) && lastPath.current !== path)
      (window as AnalyticsWindow).ym?.(Number(id), "hit", path);
    lastPath.current = path;
  }, [path, consent, id]);
  useEffect(() => {
    if (!consent || !id || !/^\d+$/.test(id)) return;
    const w = window as AnalyticsWindow;
    const queue: unknown[][] = [];
    if (!w.ym) {
      const ym = (...args: unknown[]) => {
        queue.push(args);
      };
      Object.assign(ym, { a: queue, l: Date.now() });
      w.ym = ym;
    }
    if (!document.getElementById("ym-script")) {
      const script = document.createElement("script");
      script.id = "ym-script";
      script.src = "https://mc.yandex.ru/metrika/tag.js";
      script.async = true;
      document.head.appendChild(script);
      w.ym(Number(id), "init", {
        clickmap: false,
        trackLinks: false,
        accurateTrackBounce: true,
        webvisor: false,
      });
    }
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element).closest<HTMLAnchorElement>("a");
      if (!a) return;
      const event =
        a.dataset.track ||
        (a.href.includes("/kontakty") ? "consultation_click" : undefined);
      if (event)
        w.ym?.(Number(id), "reachGoal", event, {
          page: location.pathname,
          direction:
            new URL(a.href).searchParams.get("direction") || "development",
        });
    };
    const onLead = (e: Event) => {
      const value = (e as CustomEvent).detail?.direction;
      const direction = ["development", "capital", "protection"].includes(value)
        ? value
        : "development";
      w.ym?.(Number(id), "reachGoal", "lead_success", {
        page: location.pathname,
        direction,
      });
    };
    document.addEventListener("click", onClick);
    window.addEventListener("ckb:lead-success", onLead);
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("ckb:lead-success", onLead);
    };
  }, [consent, id]);
  if (!id || consent !== null) return null;
  function choose(value: boolean) {
    try {
      localStorage.setItem("ckb-analytics", value ? "yes" : "no");
    } catch {}
    window.dispatchEvent(new Event("ckb:analytics-consent"));
  }
  return (
    <aside className="cookie-note" aria-label="Выбор аналитики">
      <p>
        Разрешить анонимную аналитику, чтобы улучшать сайт? Поля формы в
        аналитику не передаются.
      </p>
      <div>
        <button onClick={() => choose(true)}>Разрешить</button>
        <button onClick={() => choose(false)}>Без аналитики</button>
      </div>
    </aside>
  );
}
