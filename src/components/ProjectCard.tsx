import Image from "next/image";

import { Badge } from "@/components/Badge";
import type { PortfolioItem } from "@/lib/data";

export function ProjectCard({ item }: { item: PortfolioItem }) {
  return (
    <article
      className={
        "group overflow-hidden rounded-2xl border border-white/10 bg-black/0 transition " +
        "hover:shadow-[0_18px_60px_rgba(0,0,0,0.55)]"
      }
    >
      <div className="relative overflow-hidden">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#141417]">
          <Image
            src={item.imageSrc}
            alt={item.imageAlt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition duration-300 group-hover:scale-[1.02]"
            priority={false}
          />
        </div>

        <div className="p-5">
          <p className="text-xs font-medium tracking-wider text-zinc-400">
            {item.kind}
          </p>
          <h3 className="mt-2 text-base font-semibold tracking-tight text-zinc-50">
            {item.title}
          </h3>
          <p className="mt-2 text-sm leading-6 text-zinc-300">
            {item.description}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {item.tags.map((t) => (
              <Badge key={t} className="bg-white/[0.04]">
                {t}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
