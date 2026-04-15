# Boopathi Portfolio (Next.js)

A personal portfolio site built with Next.js, with:

- Professional hero/landing section
- Career journey timeline
- Portfolio placeholders for future case studies
- Floating Digital Twin chat powered by OpenRouter

## Prerequisites

- Node.js 20+ (or newer)
- npm 10+

## 1) Install dependencies

```bash
npm install
```

## 2) Configure environment

Create/update `.env` in the project root:

```env
OPENROUTER_API_KEY=your_openrouter_api_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Notes:

- `OPENROUTER_API_KEY` is required for the Digital Twin chat API route.
- `NEXT_PUBLIC_SITE_URL` is optional but recommended.

## 3) Run locally (development)

```bash
npm run dev
```

Open:

- [http://localhost:3000](http://localhost:3000)

## 4) Build for production

```bash
npm run build
```

## 5) Start production server

```bash
npm run start
```

## Key scripts

- `npm run dev` - start local dev server
- `npm run build` - create production build
- `npm run start` - run production server
- `npm run lint` - run lint checks

## Project structure

- `app/` - pages, layout, styles, API routes
- `components/` - reusable UI components (includes Digital Twin chat)
- `lib/` - shared context and helper data

