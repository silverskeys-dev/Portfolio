"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";

import type { PortfolioItem } from "@/lib/data";
import { publicPath } from "@/lib/publicPath";
import { cn } from "@/lib/utils";

type ModelGalleryProps = {
  items: PortfolioItem[];
  className?: string;
};

export function ModelGallery({ items, className }: ModelGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const activeItem = useMemo(() => {
    if (activeIndex === null) return null;
    return items[activeIndex] ?? null;
  }, [activeIndex, items]);

  const close = useCallback(() => setActiveIndex(null), []);

  const goPrev = useCallback(() => {
    setActiveIndex((current) => {
      if (current === null) return current;
      return Math.max(0, current - 1);
    });
  }, []);

  const goNext = useCallback(() => {
    setActiveIndex((current) => {
      if (current === null) return current;
      return Math.min(items.length - 1, current + 1);
    });
  }, [items.length]);

  useEffect(() => {
    if (activeIndex === null) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrev();
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, close, goNext, goPrev]);

  useEffect(() => {
    if (activeIndex === null) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [activeIndex]);

  return (
    <>
      <div className={cn("mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}>
        {items.map((item, index) => (
          <button
            key={`${item.title}-${index}`}
            type="button"
            className="animate-enter overflow-hidden rounded-2xl border border-white/10 bg-black/20 text-left transition hover:bg-white/[0.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
            style={{ animationDelay: `${120 + index * 70}ms` }}
            onClick={() => setActiveIndex(index)}
            aria-label={`Open image: ${item.title}`}
          >
            <div className="relative aspect-[4/3]">
              <Image
                src={publicPath(item.imageSrc)}
                alt={item.imageAlt}
                fill
                sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                className="object-cover"
              />
            </div>
          </button>
        ))}
      </div>

      {activeItem ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
          onClick={close}
        >
          <div
            className="w-full max-w-5xl rounded-2xl border border-white/10 bg-black/60 p-4 sm:p-5"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative h-[70vh] w-full overflow-hidden rounded-xl border border-white/10 bg-black/30">
              <Image
                src={publicPath(activeItem.imageSrc)}
                alt={activeItem.imageAlt}
                fill
                priority
                sizes="(min-width: 1024px) 80vw, 95vw"
                className="object-contain"
              />
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={goPrev}
                disabled={activeIndex === 0}
                className="inline-flex items-center justify-center rounded-full border border-white/15 bg-transparent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={goNext}
                disabled={activeIndex === items.length - 1}
                className="inline-flex items-center justify-center rounded-full border border-white/15 bg-transparent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Avançar
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
