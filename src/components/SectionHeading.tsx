import { cn } from "@/lib/utils";

export function SectionHeQding({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={cn("max-w-2xl", className)}>
      <p className="text-xs font-medium tracking-wider text-zinc-400">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-pretty text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-3 whitespace-pre-line text-pretty text-sm leading-6 text-zinc-300 sm:text-base">
          {description}
        </p>
      ) : null}
    </div>
  );
}

export { SectionHeQding as SectionHeading };
