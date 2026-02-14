Modern, minimal portfolio for a **3D Artist & Game Developer**.

Built with Next.js (App Router) + Tailwind CSS, featuring a dark theme, soft gradients, subtle glow, card-based layout, and smooth scroll.

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Customize content

- Update your name/email/social links in [src/lib/data.ts](src/lib/data.ts).
- Edit the page sections in [src/app/page.tsx](src/app/page.tsx).
- Replace the placeholder portfolio and game project entries in [src/lib/data.ts](src/lib/data.ts).

## Production

```bash
npm run build
npm run start
```

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Notes

- The project is intentionally image-light; the “thumbnails” are gradient placeholders. Swap them for real images when you’re ready.
- If you want icons/logos, we can add an icon set (Lucide/React Icons) later.
