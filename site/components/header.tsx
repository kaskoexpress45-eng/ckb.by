"use client";
import { Arrow } from "@/components/ui";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navigation, consultation } from "@/lib/site";
export function Header() {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  useEffect(() => {
    if (!open) return;
    const handle = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        document.getElementById("menu-toggle")?.focus();
      }
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [open]);
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link
          className="wordmark"
          href="/"
          onClick={() => setOpen(false)}
          aria-label="CKB.by — на главную"
        >
          ckb<span className="brand-dot">.</span>
          <span className="wordmark-by">by</span>
        </Link>
        <button
          id="menu-toggle"
          className="menu-toggle"
          aria-controls="main-nav"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? "Закрыть" : "Меню"}
          <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d={open ? "M5 5 19 19M19 5 5 19" : "M4 6h16M4 12h16M4 18h16"}
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
            />
          </svg>
        </button>
        <nav
          id="main-nav"
          className={open ? "main-nav is-open" : "main-nav"}
          aria-label="Основная навигация"
        >
          {navigation.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              aria-current={path === href ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
          <Link
            className="mobile-consult"
            href={consultation()}
            onClick={() => setOpen(false)}
          >
            Получить консультацию
          </Link>
        </nav>
        <Link href={consultation()} className="header-consult">
          Получить консультацию{" "}
          <span aria-hidden="true">
            <Arrow diagonal />
          </span>
        </Link>
      </div>
    </header>
  );
}
