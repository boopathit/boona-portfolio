import { NextResponse } from "next/server";
import {
  checkRateLimit,
  getClientIp,
  isAllowedUserMessage,
} from "../../../lib/chat-protection";
import { TWIN_SYSTEM_PROMPT } from "../../../lib/twin-context";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "openai/gpt-oss-120b";

type ChatMessage = { role: "user" | "assistant" | "system"; content: string };

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rate = checkRateLimit(ip);
  if (!rate.allowed) {
    const retryAfterSeconds = Math.ceil((rate.retryAfterMs ?? 0) / 1000);
    return NextResponse.json(
      { error: "Too many requests. Please slow down and try again." },
      {
        status: 429,
        headers: { "Retry-After": String(retryAfterSeconds) },
      },
    );
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Server is not configured with OPENROUTER_API_KEY." },
      { status: 500 },
    );
  }

  let body: { messages?: ChatMessage[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const incoming = body.messages;
  if (!Array.isArray(incoming) || incoming.length === 0) {
    return NextResponse.json(
      { error: "Expected a non-empty messages array." },
      { status: 400 },
    );
  }

  const sanitized: ChatMessage[] = incoming
    .filter(
      (m): m is ChatMessage =>
        m != null &&
        typeof m === "object" &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        isAllowedUserMessage(m.content),
    )
    .slice(-24);

  if (sanitized.length === 0) {
    return NextResponse.json(
      { error: "No valid messages to send." },
      { status: 400 },
    );
  }

  const messages: ChatMessage[] = [
    { role: "system", content: TWIN_SYSTEM_PROMPT },
    ...sanitized,
  ];

  try {
    const res = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer":
          process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
        "X-Title": "Boopathi Portfolio Digital Twin",
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        temperature: 0.4,
        max_tokens: 1024,
      }),
    });

    const data = (await res.json()) as {
      error?: { message?: string };
      choices?: { message?: { content?: string } }[];
    };

    if (!res.ok) {
      const msg =
        data.error?.message ?? res.statusText ?? "OpenRouter request failed";
      return NextResponse.json({ error: msg }, { status: res.status });
    }

    const text = data.choices?.[0]?.message?.content?.trim();
    if (!text) {
      return NextResponse.json(
        { error: "Empty response from the model." },
        { status: 502 },
      );
    }

    return NextResponse.json({ message: text });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
