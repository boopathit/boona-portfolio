# Beginner Tutorial: Build and Understand This Portfolio (Step by Step)

This is a full beginner guide for the portfolio project in this repository.

It explains:

- what technologies are used
- how the app is structured
- how each major part works
- what tests were added
- what was improved and why

---

## Quick Start (5 Minutes)

If you want to run the project first and learn details after, follow this:

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in project root:

```env
OPENROUTER_API_KEY=your_openrouter_api_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

3. Start the app:

```bash
npm run dev
```

4. Open:

- `http://localhost:3000`

5. (Optional) Run tests:

```bash
npm run test
```

Now continue with the full tutorial below for architecture and code-level understanding.

---

## 1) What This Project Is

This project is a personal portfolio website built with **Next.js**.

It includes:

- A modern top section (hero) and sticky nav
- About, portfolio, journey, and contact sections
- A floating AI chat widget ("Digital Twin")
- A backend API route that connects to OpenRouter
- Markdown rendering for AI responses
- Accessibility and safety improvements
- Automated tests

---

## 2) Technology Stack

### Frontend

- **Next.js (App Router)** for pages and server routes
- **React** for component-based UI
- **TypeScript** for type safety
- **CSS** in `app/globals.css` for layout/theme/responsiveness
- **lucide-react** for icons

### AI + Backend

- **OpenRouter API** in `app/api/chat/route.ts`
- Model configured as:
  - `openai/gpt-oss-120b`
- **Environment variables** for secure API keys

### Chat Text Rendering

- **react-markdown**
- **remark-gfm**

This makes markdown like `**bold**`, lists, and links render correctly.

### Testing

- **Vitest**
- **@testing-library/react**
- **@testing-library/user-event**
- **jsdom**

---

## 3) Project Structure

```text
app/
  api/chat/route.ts         # server-side chat endpoint
  globals.css               # global styles
  layout.tsx                # root layout
  page.tsx                  # main page UI

components/
  DigitalTwinChat.tsx       # floating chat UI

lib/
  site-content.ts           # all page text/content data
  twin-context.ts           # AI system prompt + profile facts
  chat-protection.ts        # rate limit + abuse checks

tests/
  api/chat-route.test.ts    # API route tests
  components/DigitalTwinChat.test.tsx # chat UI tests

vitest.config.ts            # test config
README.md                   # run instructions
Tutorial.md                 # this tutorial
```

---

## 4) High-Level Flow (How It Works)

### Step A: Page rendering

`app/page.tsx` renders all major sections using data from `lib/site-content.ts`.

That means text and card content are not hardcoded inside JSX loops anymore.

### Step B: Floating chat opens

`DigitalTwinChat.tsx` opens a fixed-position chat panel in the bottom-right corner.

When user sends a question, it calls:

- `POST /api/chat`

### Step C: API receives request

`app/api/chat/route.ts`:

1. validates request body
2. runs safety checks/rate limiting
3. prepends `TWIN_SYSTEM_PROMPT`
4. calls OpenRouter
5. returns assistant response

### Step D: UI renders response

Chat UI receives response and renders markdown safely in a styled bubble.

### Step E: persistence

Messages are saved in `localStorage` and restored on reload.

---

## 5) Detailed Code Walkthrough

## 5.1 `lib/site-content.ts` (Content extraction)

We moved portfolio content into one place:

```ts
export const impact = [
  { value: "9+", label: "Years building digital products" },
  { value: "5x", label: "Faster onboarding in a key banking flow" },
];
```

Then `page.tsx` imports and maps over it.

**Why this is good:**

- easier editing
- cleaner components
- future CMS integration is simpler

---

## 5.2 `app/page.tsx` (UI composition)

Example pattern:

```tsx
{impact.map((item) => (
  <div className="stat-card" key={item.label}>
    <strong>{item.value}</strong>
    <span>{item.label}</span>
  </div>
))}
```

**Beginner tip:**  
`map()` is the standard React way to render repeated cards from data.

---

## 5.3 `components/DigitalTwinChat.tsx` (chat behavior)

### Send flow

```tsx
const res = await fetch("/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    messages: next.map(({ role, content }) => ({ role, content })),
  }),
});
```

### Markdown rendering

```tsx
<ReactMarkdown remarkPlugins={[remarkGfm]}>
  {m.content}
</ReactMarkdown>
```

### Persistence

```tsx
window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-30)));
```

**Why this matters:**  
The conversation survives refresh and markdown looks natural to users.

---

## 5.4 `app/api/chat/route.ts` (server route)

Important validations:

- ensures API key exists
- validates `messages` payload
- sanitizes message content
- rate-limits per IP

Sample:

```ts
const rate = checkRateLimit(ip);
if (!rate.allowed) {
  return NextResponse.json(
    { error: "Too many requests. Please slow down and try again." },
    { status: 429, headers: { "Retry-After": "..." } }
  );
}
```

**Why server route is important:**  
Keeps API key private and centralizes policy checks.

---

## 5.5 `lib/chat-protection.ts` (abuse protection)

Provides:

- IP extraction (`x-forwarded-for` fallback logic)
- in-memory token-window rate limiting
- basic content checks:
  - empty or too long messages
  - repeated spam-like characters
  - too many links

This protects your AI endpoint from easy abuse.

---

## 5.6 Accessibility improvements

Implemented:

- `:focus-visible` outlines for keyboard users
- `aria-live="polite"` for incoming assistant content
- `role="status"` for typing feedback
- `prefers-reduced-motion` fallback
- `Escape` key closes chat panel

---

## 6) Testing (What Was Added)

## 6.1 API tests (`tests/api/chat-route.test.ts`)

Covers:

- bad payload handling (`400`)
- rate limiting (`429`)
- valid OpenRouter payload shape
- message sanitization path

## 6.2 Component tests (`tests/components/DigitalTwinChat.test.tsx`)

Covers:

- markdown rendering in assistant bubbles (bold/link behavior)
- localStorage restore behavior

---

## 7) How To Run

1. Install dependencies:

```bash
npm install
```

2. Add `.env`:

```env
OPENROUTER_API_KEY=your_openrouter_api_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

3. Start dev server:

```bash
npm run dev
```

4. Run tests:

```bash
npm run test
```

5. Build for production:

```bash
npm run build
```

---

## 8) Beginner Troubleshooting Guide

### Chat returns error

- Check `OPENROUTER_API_KEY` in `.env`
- Restart dev server after env changes

### Markdown not rendering

- Make sure `react-markdown` and `remark-gfm` are installed

### Chunk/load errors in dev

- Stop dev server
- delete `.next`
- run `npm run dev` again

### TypeScript complains about test globals

- Ensure `tsconfig.json` includes:

```json
"types": ["vitest/globals"]
```

---

## 9) Self-Review: 5 Next Improvements

1. **Move rate-limit store to Redis**  
   Current in-memory limiter resets on restart and is per-instance only.

2. **Add API auth option for private mode**  
   Optional secret or signed token for chat endpoint.

3. **Add streaming chat responses**  
   Use streamed responses for better perceived latency.

4. **Persist conversation on backend (optional)**  
   Local storage is simple; backend persistence enables multi-device continuity.

5. **Expand test coverage for edge cases**  
   Add tests for malformed JSON, OpenRouter failures, storage quota errors, and a11y assertions.

---

## 10) What You Learned

By finishing this project, you practiced:

- building with Next.js App Router
- connecting frontend to backend API routes
- handling secret keys safely
- rendering markdown in React
- improving accessibility
- adding basic abuse protection
- writing practical automated tests

If you want, next I can create a **Part 2 tutorial** focused only on test writing strategy and architecture decisions in this codebase.

