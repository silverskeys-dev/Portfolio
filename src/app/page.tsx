import Link from "next/link";
import Image from "next/image";

import { Container } from "@/components/Container";
import { Navbar } from "@/components/Navbar";
import { SectionHeading } from "@/components/SectionHeading";
import { GamesSection } from "@/components/GamesSection";
import { GltfModelCanvas } from "@/components/three/GltfModelCanvas";
import {
  ABOUT_TEXT,
  GAME_PROJECTS,
  HOME_INTRO,
  PROFILE,
  SERVICES,
  SOCIALS,
  SKILL_GROUPS,
} from "@/lib/data";
import { publicPath } from "@/lib/publicPath";

export default function Home() {
  return (
    <div className="min-h-dvh">
      <main className="pt-16">
        <HomeIntro />
        <Games />
        <Contact />
        <Footer />
      </main>
    </div>
  );
}

function HomeIntro() {
  return (
    <section id="home" className="scroll-mt-24">
      <Navbar />

      <div className="relative overflow-hidden border-b border-white/10">
        <div className="pointer-events-none absolute inset-0">
          <Image
            src={publicPath(PROFILE.homeBackgroundSrc)}
            alt={PROFILE.homeBackgroundAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/70" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.10)_0%,rgba(0,0,0,0.60)_55%,rgba(0,0,0,0.92)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.06)_0%,transparent_55%)]" />
        </div>

        <Container className="relative py-14 sm:py-18">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="max-w-2xl">
              <p className="animate-enter anim-delay-0 text-xs font-medium tracking-wider text-zinc-300/80">
                {PROFILE.availability}
              </p>
              <h1 className="animate-enter anim-delay-100 mt-4 text-balance text-4xl font-semibold tracking-tight text-zinc-50 sm:text-6xl">
                {PROFILE.name}
              </h1>
              <p className="animate-enter anim-delay-200 mt-3 text-sm font-medium text-zinc-200 sm:text-base">
                {PROFILE.title}
              </p>
              <p className="animate-enter anim-delay-300 mt-5 text-pretty text-base leading-7 text-zinc-200/80 sm:text-lg">
                {HOME_INTRO}
              </p>

              <div className="animate-enter anim-delay-400 mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href="#games"
                  className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-zinc-100"
                >
                  View Projects
                </Link>
                <Link
                  href="#contact"
                  className="inline-flex items-center justify-center rounded-full border border-white/15 bg-transparent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/5"
                >
                  Contact
                </Link>
              </div>
            </div>

            <div className="hidden lg:block">
              <GltfModelCanvas
                url={PROFILE.homeSideModelSrc}
                models={PROFILE.homeSideModels}
                spin={PROFILE.homeSideModelSpin}
                spinSpeed={PROFILE.homeSideModelSpinSpeed}
                recomputeNormals={PROFILE.homeSideModelRecomputeNormals}
                className="relative aspect-4/5 overflow-hidden rounded-2xl border border-white/10 bg-black/25 shadow-[0_24px_80px_rgba(0,0,0,0.55)]"
              />
            </div>
          </div>
        </Container>
      </div>

      <section
        id="about"
        className="scroll-mt-24 border-t border-white/10 py-16 sm:py-20"
      >
        <Container>
          <div className="animate-enter-left anim-delay-200 max-w-3xl">
            <SectionHeading eyebrow="About me" title="About" description={ABOUT_TEXT} />
          </div>
        </Container>
      </section>

      <section className="border-t border-white/10 py-16 sm:py-20">
        <Container>
          <div className="animate-enter anim-delay-0">
            <SectionHeading
              eyebrow="Skills"
              title="Skills"
              description="A practical toolkit across development, art, and production."
            />
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SKILL_GROUPS.map((group, index) => (
              <div
                key={group.title}
                className="animate-enter rounded-2xl border border-white/10 bg-transparent p-5 transition hover:bg-white/[0.02]"
                style={{ animationDelay: `${100 + index * 70}ms` }}
              >
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-sm font-semibold tracking-tight text-zinc-50">
                    {group.title}
                  </h3>
                  <p className="text-xs font-medium text-zinc-400">
                    {group.trait}
                  </p>
                </div>
                <p className="mt-3 text-sm leading-6 text-zinc-300">{group.items}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-white/10 py-16 sm:py-20">
        <Container>
          <div className="animate-enter anim-delay-0">
            <SectionHeading
              eyebrow="Services"
              title="Services"
              description="End-to-end support from prototyping to production."
            />
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((service, index) => (
              <div
                key={service.title}
                className="animate-enter rounded-2xl border border-white/10 bg-transparent p-5 transition hover:bg-white/[0.02]"
                style={{ animationDelay: `${120 + index * 70}ms` }}
              >
                <h3 className="text-sm font-semibold tracking-tight text-zinc-50">
                  {service.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-zinc-300">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </section>
  );
}

function Games() {
  return (
    <section id="games" className="scroll-mt-24 py-20 sm:py-24">
      <Container>
        <GamesSection projects={GAME_PROJECTS} />
      </Container>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="scroll-mt-24 py-20 sm:py-24">
      <Container>
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] sm:p-10">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="animate-enter anim-delay-0">
                <SectionHeading
                  eyebrow="Contact"
                  title="Let’s build something that feels great"
                  description="Send a quick note with your timeline and what you need—assets, environments, prototyping, or tools." 
                />
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="#contact"
                  className="animate-enter inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-zinc-100"
                  style={{ animationDelay: "120ms" }}
                >
                  Get in touch
                </a>
              </div>
            </div>

            <div className="animate-enter rounded-2xl border border-white/10 bg-black/20 p-5" style={{ animationDelay: "180ms" }}>
              <p className="text-sm font-medium text-zinc-200">Social</p>
              <div className="mt-3 grid gap-2">
                {SOCIALS.map((s, index) => (
                  <a
                    key={s.label}
                    href={s.href}
                    className="animate-enter group flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-200 transition hover:border-indigo-400/25 hover:bg-white/10"
                    style={{ animationDelay: `${260 + index * 70}ms` }}
                  >
                    <span>{s.label}</span>
                    <span className="text-zinc-400 transition group-hover:text-zinc-200">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        aria-hidden="true"
                        className="h-4 w-4"
                      >
                        <path
                          d="M7 17L17 7M17 7H9M17 7V15"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </a>
                ))}
              </div>

            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10 py-10">
      <Container className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <p className="text-sm text-zinc-400">
          © {new Date().getFullYear()} {PROFILE.name}. All rights reserved.
        </p>
        <p className="text-sm text-zinc-500">
          Built with Next.js + Tailwind.
        </p>
      </Container>
    </footer>
  );
}
