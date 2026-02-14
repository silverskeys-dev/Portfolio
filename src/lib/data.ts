export type PortfolioItem = {
  imageSrc: string;
  imageAlt: string;
  title: string;
  kind: "3D Model" | "Game Asset" | "Environment" | "Material";
  description: string;
  tags: string[];
};

export type GameProject = {
  title: string;
  description: string;
  role: string;
  imageSrc?: string;
  imageAlt?: string;
  gallery?: Array<{ src: string; alt?: string; caption?: string }>;
  stack: string[];
  ctas: Array<{ label: string; href: string }>;
};

export type TimelineItem = {
  role: string;
  project: string;
  year: string;
};

export type SkillGroup = {
  title: string;
  trait: string;
  items: string;
};

export type Service = {
  title: string;
  description: string;
};

export const PROFILE = {
  name: "Lucas Lima",
  title: "3D Artist, Unity Developer & Game Asset Creator",
  logoSrc: "/Logo.png",
  logoAlt: "Lucas Lima logo",
  email: "",
  resumeHref: "",
  availability: "Open to studio opportunities & freelance",
  homeBackgroundSrc: "/creature-render.svg",
  homeBackgroundAlt: "Cinematic creature render background",
  homeSideModelSrc: "/models/Dragon2.glb",
  homeSideModelAlt: "Animated creature model",
  homeSideModelAnimation: "Idle",
  homeSideModelAnimationCycle: ["Idle", "Walk", "Roar"],
  homeSideModelAnimationCycleSeconds: 3,
  homeSideModels: [
    {
      url: "/models/Dragon2.glb",
      // Keep this model on screen ~6s, then swap to the next model.
      // Using a single-item cycle makes the model advance once per interval.
      animationCycle: ["Idle"],
      animationCycleSeconds: 6,
    },
    {
      url: "/models/creature.glb",
      // Matches Walk/Idle/Roar
      animationCycle: ["Idle", "Walk", "Roar"],
      animationCycleSeconds: 3,
    },
    {
      url: "/models/DragonLowpolymini.glb",
      // Matches Armature|Armature|Walk, Armature|Armature|Idle, Armature|Armature|Attack
      // (we match by substring, so plain names work)
      animationCycle: ["Idle", "Walk", "Attack"],
      animationCycleSeconds: 3,
    },
    {
      url: "/models/GoblinBoss.glb",
      // Matches Armature|Armature|Walk, Armature|Armature|Idle
      // (we match by substring, so plain names work)
      animationCycle: ["Idle", "Walk"],
      animationCycleSeconds: 3,
    },
    {
      url: "/models/TungSahur.glb",
      // If the animation names differ, we fall back to an "idle" clip or the first clip.
      animationCycle: ["Idle", "Walk"],
      animationCycleSeconds: 3,
    },
  ],
  homeSideModelSpin: true,
  // Radians/second. Around 0.52 = one full turn every ~12s.
  homeSideModelSpinSpeed: 0.52,
  // If the "squares" are actually faceted shading (hard normals), enable this.
  homeSideModelRecomputeNormals: false,
} as const;

export const NAV_ITEMS = [
  { label: "Home", href: "#home" },
  { label: "Games", href: "#games" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
] as const;

export const HOME_INTRO =
  "I am an innovative programmer, artist, and IT professional, blending creativity with technology to craft impactful solutions and bring ambitious ideas to life.";

export const ABOUT_TEXT =
  "I am a versatile developer with strong expertise in game development, web design, and digital experiences. Passionate about combining creativity and technology, I specialize in building immersive games, responsive websites, and complete end-to-end solutions tailored to unique challenges.\n\nMy skill set includes C# programming, 3D modeling, UI/UX design, animation, and cross-platform development, allowing me to transform ideas into polished, high-quality products. I am driven to create engaging user experiences and innovative digital solutions that leave a meaningful and lasting impact.";

export const WORK_TIMELINE: TimelineItem[] = [
  { role: "Unity Game Developer", project: "Adventure quest", year: "2025" },
  { role: "3D modelleur", project: "Sky Explorers", year: "2024" },
  { role: "UI/UX designer", project: "Puzzle planet", year: "2024" },
  { role: "Level designer", project: "Escape the labyrinth", year: "2024" },
  { role: "Freelance game developer", project: "Galactic balloon race", year: "2023" },
];

export const SKILL_GROUPS: SkillGroup[] = [
  {
    title: "Coding platforms",
    trait: "Efficiency",
    items:
      "Unity, Unreal engine, Visual studio, Visual studio code, Docker, Debugging tools",
  },
  {
    title: "Programming Languages",
    trait: "Versatility",
    items: "Javascript, C#, C++, Solidity, Python",
  },
  {
    title: "Design",
    trait: "Creativity",
    items:
      "Figma, UI/UX Design, Adobe Illustrator, Photoshop, Substance 3D painter, Graphic Design",
  },
  {
    title: "Animation",
    trait: "Precision",
    items:
      "Blender, 2D frame Animation, Mixamo, Animate CC, Photoshop",
  },
  {
    title: "Project Management",
    trait: "Leadership",
    items: "Time management, Problem solving, Adaptability, Admin Management",
  },
  {
    title: "3D Generalist",
    trait: "Immersion",
    items:
      "Blender, Unity, 3D Web development, Substance painter, Mixamo, ZBrush, Rigging",
  },
];

export const SERVICES: Service[] = [
  {
    title: "Game development",
    description:
      "Designing immersive games with stunning 3D environments, smooth animations, and engaging gameplay mechanics for PC, mobile, and consoles.",
  },
  {
    title: "Code development",
    description:
      "Writing efficient and scalable code in languages like C#, C++, and JavaScript to bring innovative ideas to life.",
  },
  {
    title: "3D modeling & animation",
    description:
      "Crafting detailed 3D models and animations for games, AR/VR applications, and other interactive experiences.",
  },
  {
    title: "UI/UX design",
    description:
      "Designing intuitive user interfaces and user experiences to enhance usability and engagement for apps and websites.",
  },
  {
    title: "Mobile app development",
    description:
      "Developing functional and visually captivating mobile applications for Android and iOS platforms.",
  },
  {
    title: "Game prototyping",
    description:
      "Building prototypes to test game concepts, ensuring feasibility and refining ideas before full-scale development.",
  },
  {
    title: "Maintenance & updates",
    description:
      "Providing ongoing support and updates to ensure your applications, games, or websites stay optimized and up-to-date.",
  },
];

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    imageSrc: "/portfolio/drone.svg",
    imageAlt: "Hard-surface drone render",
    title: "Neo-Industrial Drone",
    kind: "3D Model",
    description:
      "Hard-surface model with clean topology, weighted normals, and game-ready UVs.",
    tags: ["PBR", "Game-Ready", "Unreal", "Unity"],
  },
  {
    imageSrc: "/portfolio/crates.svg",
    imageAlt: "Sci-fi crate asset render",
    title: "PBR Prop Set — Sci‑Fi Crates",
    kind: "Game Asset",
    description:
      "Modular prop set with consistent texel density and trim sheet workflow.",
    tags: ["PBR", "Game-Ready", "Low Poly", "Unreal"],
  },
  {
    imageSrc: "/portfolio/forest.svg",
    imageAlt: "Stylized forest kit render",
    title: "Stylized Forest Kit",
    kind: "Environment",
    description:
      "Low-poly environment kit with hand-painted gradients and cohesive lighting.",
    tags: ["Low Poly", "Unity", "Game-Ready", "Lighting"],
  },
  {
    imageSrc: "/portfolio/bust.svg",
    imageAlt: "Character bust sculpt render",
    title: "Character Bust Study",
    kind: "3D Model",
    description:
      "High-poly sculpt study focusing on forms, planes, and believable surface breakup.",
    tags: ["Sculpt", "High Poly", "Lookdev"],
  },
  {
    imageSrc: "/portfolio/metals.svg",
    imageAlt: "Worn metal material renders",
    title: "Material Pack — Worn Metals",
    kind: "Material",
    description:
      "Reusable smart materials with subtle edge wear and controllable roughness ranges.",
    tags: ["PBR", "Materials", "Game-Ready"],
  },
  {
    imageSrc: "/portfolio/weapon.svg",
    imageAlt: "Weapon skin variants render",
    title: "Weapon Skin Variants",
    kind: "Game Asset",
    description:
      "Skin explorations with color accents, decals, and emission details for readability.",
    tags: ["PBR", "Unreal", "Unity", "Game-Ready"],
  },
];

export const GAME_PROJECTS: GameProject[] = [
  {
    title: "Brainrot Rampage",
    description:
      "I've developed an endless survival mobile game. The player controls a Brainrot and faces continuous waves of enemies, gaining experience by defeating them and choosing upgrades such as damage, health, and speed at each level. The difficulty increases progressively as the player advances, creating a sonic and strategic challenge in each match.",
    role: "3D Art + Gameplay Prototyping",
    imageSrc: "/games/brainrot-rampage.png",
    imageAlt: "Brainrot Rampage cover",
    gallery: [
      {
        src: "/games/brainrot-rampage.png",
        alt: "Brainrot Rampage cover",
        caption: "Each Brainrot possesses a unique active and passive ability, offering distinct playstyles and encouraging the player to experiment with different strategies. This variety increases the depth of gameplay and the replayability of the experience..",
      },
      {
        src: "/games/brainrot-rampage-2.png",
        alt: "Brainrot Rampage screenshot 2",
        caption: "The game features a shop system, rankings, quests, and in-app purchases, as well as progressive difficulty that increases as the player advances, providing a dynamic and challenging experience.",
      },
      {
        src: "/games/brainrot-rampage-3.png",
        alt: "Brainrot Rampage screenshot 3",
        caption: "The game features a daily quest system where players can earn coins by completing three specific objectives. After completing all three quests, the system automatically resets after 24 hours, generating new challenges and rewards. This system encourages players to return daily and contributes to continuous progression within the game.",
      },
      {
        src: "/games/brainrot-rampage-4.png",
        alt: "Brainrot Rampage screenshot 4",
        caption: "Upon accessing the store, players can unlock new Brainrots using coins earned during matches or purchase them with real money via an IAP system. This system offers organic progression for active players, as well as an optional in-game monetization option.",
      },
      {
        src: "/games/brainrot-rampage-5.png",
        alt: "Brainrot Rampage screenshot 5",
        caption: "In the inventory, the player can view detailed information for each Brainrot, including their attributes, health, active ability, and passive ability. This system allows for comparing characters and choosing the best strategy before starting a match.",
      },
    ],
    stack: ["Unity", "Blender", "C#"],
    ctas: [
      {
        label: "Play (Play Store)",
        href: "https://play.google.com/store/apps/details?id=com.SkeysStudio",
      },
    ],
  },
];

export const SKILLS = [
  "Hard-surface modeling",
  "Environment art",
  "PBR texturing",
  "Trim sheets",
  "UVs + baking",
  "Lighting + lookdev",
  "Real-time optimization",
  "UE / Unity workflows",
  "Shaders (basic)",
  "Gameplay prototyping",
] as const;

export const SOCIALS = [
  { label: "ArtStation", href: "https://www.artstation.com/silverskeys" },
  { label: "Discord", href: "https://discordapp.com/users/452217320912453645" },
] as const;
