"use client";

import { useEffect, useMemo, useState } from "react";

import Link from "next/link";
import Image from "next/image";

import { Container } from "@/components/Container";
import { NAV_ITEMS, PROFILE } from "@/lib/data";
import { publicPath } from "@/lib/publicPath";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [activeHref, setActiveHref] = useState<string>("#home");

  const items = useMemo(() => NAV_ITEMS, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const ids = items
      .map((i) => i.href)
      .filter((href) => href.startsWith("#"))
      .map((href) => href.slice(1));
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    const initial = window.location.hash;
    if (initial && items.some((i) => i.href === initial)) setActiveHref(initial);

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0));
        const top = visible[0];
        const id = (top?.target as HTMLElement | undefined)?.id;
        if (id) setActiveHref(`#${id}`);
      },
      {
        // Account for fixed header: activate when section is near the top-middle.
        root: null,
        rootMargin: "-35% 0px -55% 0px",
        threshold: [0.1, 0.2, 0.35, 0.5, 0.7],
      },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="border-b border-white/10 bg-[#0d0d0f]/95">
        <Container className="flex h-16 items-center justify-between">
          <Link
            href="#home"
            className="group inline-flex items-center gap-2"
            onClick={() => setOpen(false)}
          >
            <span className="relative inline-flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] sm:h-12 sm:w-12">
              <Image
                src={publicPath(PROFILE.logoSrc)}
                alt={PROFILE.logoAlt}
                width={48}
                height={48}
                priority
                className="h-full w-full object-contain p-0.5"
              />
            </span>
            <span className="text-sm font-semibold tracking-tight text-zinc-50">
              {PROFILE.name}
            </span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  setActiveHref(item.href);
                  setOpen(false);
                }}
                className={cn(
                  "text-sm transition",
                  activeHref === item.href
                    ? "text-zinc-50"
                    : "text-zinc-300 hover:text-zinc-50",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] p-2 text-zinc-100 transition hover:bg-white/10 md:hidden"
            aria-label="Open menu"
            aria-expanded={open}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
              className="h-5 w-5"
            >
              <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </Container>
      </div>

      <div
        className={cn(
          "md:hidden",
          open ? "pointer-events-auto" : "pointer-events-none",
        )}
      >
        <div
          className={cn(
            "absolute inset-0 top-16 bg-black/70 backdrop-blur-sm transition-opacity",
            open ? "opacity-100" : "opacity-0",
          )}
          onClick={() => setOpen(false)}
        />
        <div
          className={cn(
            "absolute inset-x-0 top-16 border-b border-white/10 bg-[#0d0d0f] transition",
            open ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0",
          )}
        >
          <Container className="py-4">
            <div className="flex flex-col gap-2">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-xl px-3 py-3 text-sm transition",
                    activeHref === item.href
                      ? "bg-white/10 text-zinc-50"
                      : "text-zinc-200 hover:bg-white/5 hover:text-zinc-50",
                  )}
                  onClick={() => {
                    setActiveHref(item.href);
                    setOpen(false);
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </Container>
        </div>
      </div>
    </header>
  );
}
