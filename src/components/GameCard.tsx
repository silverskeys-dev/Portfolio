import Link from "next/link";
import Image from "next/image";
import type React from "react";

import { Badge } from "@/components/Badge";
import type { GameProject } from "@/lib/data";

export function GameCard({
  project,
  interactive = false,
  onOpen,
}: {
  project: GameProject;
  interactive?: boolean;
  onOpen?: () => void;
}) {
  function maybeOpen(e: React.MouseEvent | React.KeyboardEvent) {
    if (!interactive || !onOpen) return;
    const target = e.target as HTMLElement | null;
    if (target?.closest("a")) return;
    onOpen();
  }

  return (
    <article
      className={
        "group overflow-hidden rounded-2xl border border-white/10 bg-transparent p-6 transition " +
        "hover:bg-white/[0.02] hover:shadow-[0_18px_60px_rgba(0,0,0,0.55)]"
      }
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      onClick={maybeOpen}
      onKeyDown={(e) => {
        if (!interactive || !onOpen) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          maybeOpen(e);
        }
      }}
      aria-label={interactive ? `Open ${project.title}` : undefined}
    >
      <div className="grid gap-5 lg:grid-cols-[260px_1fr] lg:items-start">
        <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#141417]">
          <div className="relative aspect-[16/10] w-full">
            {project.imageSrc ? (
              <Image
                src={project.imageSrc}
                alt={project.imageAlt ?? project.title}
                fill
                sizes="(min-width: 1024px) 260px, 100vw"
                className="object-cover object-center"
              />
            ) : (
              <div className="h-full w-full" />
            )}
          </div>
          <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>
        </div>

        <div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-lg font-semibold tracking-tight text-zinc-50">
              {project.title}
            </h3>
            <Badge className="text-zinc-200">{project.role}</Badge>
          </div>

          <p className="mt-3 text-sm leading-6 text-zinc-300">
            {project.description}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {project.stack.map((s) => (
              <Badge key={s} className="text-zinc-300">
                {s}
              </Badge>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {project.ctas.map((cta) => (
              <Link
                key={cta.label}
                href={cta.href}
                className={
                  "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition " +
                  "border border-white/15 bg-transparent text-zinc-100 hover:bg-white/5"
                }
              >
                {cta.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
