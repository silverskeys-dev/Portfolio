"use client";

import { useMemo, useState } from "react";

import type { GameProject } from "@/lib/data";
import { GameCard } from "@/components/GameCard";
import { GameProjectModal } from "@/components/GameProjectModal";
import { SectionHeading } from "@/components/SectionHeading";

export function GamesSection({ projects }: { projects: GameProject[] }) {
  const [open, setOpen] = useState(false);
  const [activeTitle, setActiveTitle] = useState<string | null>(null);

  const activeProject = useMemo(
    () => projects.find((p) => p.title === activeTitle) ?? null,
    [projects, activeTitle],
  );

  return (
    <>
      <div className="flex flex-col gap-10">
        <div className="animate-enter anim-delay-0">
          <SectionHeading
            eyebrow="Games"
            title="Projects"
            description="A few shipped/prototype projects and tools."
          />
        </div>

        <div className="grid gap-4">
          {projects.map((project, index) => (
            <div
              key={project.title}
              className="animate-enter"
              style={{ animationDelay: `${120 + index * 80}ms` }}
            >
              <GameCard
                project={project}
                interactive
                onOpen={() => {
                  setActiveTitle(project.title);
                  setOpen(true);
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <GameProjectModal
        project={activeProject}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
