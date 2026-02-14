"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

import type { GameProject } from "@/lib/data";

export function GameProjectModal({
  project,
  open,
  onClose,
}: {
  project: GameProject | null;
  open: boolean;
  onClose: () => void;
}) {
  const images = useMemo(() => {
    if (!project) return [];
    const gallery = project.gallery?.length ? project.gallery : undefined;
    if (gallery) {
      return gallery.map((g) => ({
        src: g.src,
        alt: g.alt ?? project.title,
        caption: g.caption,
      }));
    }
    if (project.imageSrc) {
      return [
        {
          src: project.imageSrc,
          alt: project.imageAlt ?? project.title,
          caption: undefined,
        },
      ];
    }
    return [];
  }, [project]);

  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (open) setIndex(0);
  }, [open, project?.title]);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") setIndex((v) => Math.max(0, v - 1));
      if (e.key === "ArrowRight") setIndex((v) => Math.min(images.length - 1, v + 1));
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose, images.length]);

  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  if (!open || !project) return null;

  const active = images[index];
  const canPrev = index > 0;
  const canNext = index < images.length - 1;

  return (
    <div className="fixed inset-0 z-[80]">
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="absolute inset-x-0 top-4 mx-auto w-full max-w-7xl px-3 sm:top-6 sm:px-6">
        <div className="max-h-[calc(100dvh-2.5rem)] overflow-hidden rounded-3xl border border-white/10 bg-[#0d0d0f] shadow-[0_30px_100px_rgba(0,0,0,0.70)]">
          <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4">
            <div className="min-w-0">
              <h2 className="truncate text-lg font-semibold tracking-tight text-zinc-50">
                {project.title}
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-zinc-100 transition hover:bg-white/10"
              aria-label="Close"
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-5 w-5">
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          <div className="max-h-[calc(100dvh-7.25rem)] overflow-y-auto p-5">
            <div className="grid gap-5">
              <div className="grid gap-5 lg:grid-cols-[1fr_0.44fr] lg:items-start">
                <div className="space-y-3">
                  <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black">
                    <div className="relative aspect-[16/9] w-full">
                      {active ? (
                        <Image
                          key={active.src}
                          src={active.src}
                          alt={active.alt}
                          fill
                          sizes="(min-width: 1024px) 980px, 100vw"
                          className="object-contain object-center"
                          priority
                          unoptimized
                        />
                      ) : (
                        <div className="h-full w-full" />
                      )}
                    </div>
                  </div>

                  {images.length > 1 ? (
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => setIndex((v) => Math.max(0, v - 1))}
                        disabled={!canPrev}
                        className="inline-flex items-center justify-center rounded-full border border-white/15 bg-black/35 px-4 py-2 text-xs font-medium text-zinc-100 transition hover:bg-black/55 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Prev
                      </button>

                      <div className="flex items-center gap-1.5">
                        {images.map((_, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setIndex(i)}
                            className={
                              "h-1.5 w-6 rounded-full transition " +
                              (i === index
                                ? "bg-white/70"
                                : "bg-white/20 hover:bg-white/35")
                            }
                            aria-label={`View image ${i + 1}`}
                          />
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => setIndex((v) => Math.min(images.length - 1, v + 1))}
                        disabled={!canNext}
                        className="inline-flex items-center justify-center rounded-full border border-white/15 bg-black/35 px-4 py-2 text-xs font-medium text-zinc-100 transition hover:bg-black/55 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                  ) : null}
                </div>

              <aside className="space-y-4">
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-medium tracking-wider text-zinc-400">
                      {images.length > 0
                        ? `Image ${index + 1} / ${images.length}`
                        : "Image"}
                    </p>
                  </div>

                  <p className="mt-4 text-base leading-7 text-zinc-200">
                    {active?.caption ?? ""}
                  </p>
                </div>
              </aside>
            </div>

            {images.length > 1 ? (
              <div className="rounded-2xl border border-white/10 bg-transparent p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="px-1 text-xs font-medium tracking-wider text-zinc-400">
                    Gallery
                  </p>
                  <p className="text-xs text-zinc-500">
                    Click a thumbnail to switch.
                  </p>
                </div>

                <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6 lg:grid-cols-8">
                  {images.map((img, i) => (
                    <button
                      key={img.src + i}
                      type="button"
                      onClick={() => setIndex(i)}
                      className={
                        "relative overflow-hidden rounded-xl border bg-[#141417] transition " +
                        (i === index
                          ? "border-white/30"
                          : "border-white/10 hover:border-white/20")
                      }
                      aria-label={`Select image ${i + 1}`}
                    >
                      <div className="relative aspect-[16/10] w-full">
                        <Image
                          key={img.src}
                          src={img.src}
                          alt={img.alt}
                          fill
                          sizes="180px"
                          className="object-cover object-center"
                          unoptimized
                        />
                      </div>
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                      <div className="absolute bottom-2 left-2 rounded-full border border-white/15 bg-black/45 px-2 py-0.5 text-[10px] font-medium text-zinc-100">
                        {i + 1}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
