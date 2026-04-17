// @vitest-environment node

import * as chatProtection from "../../lib/chat-protection";

const { resetProtectionState } = chatProtection;
import { POST } from "../../app/api/chat/route";

function jsonRequest(body: unknown, headers?: HeadersInit) {
  return new Request("http://localhost:3000/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(headers ?? {}) },
    body: JSON.stringify(body),
  });
}

describe("POST /api/chat", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    resetProtectionState();
    process.env.OPENROUTER_API_KEY = "test-key";
    process.env.NEXT_PUBLIC_SITE_URL = "http://localhost:3000";
  });

  it("returns 400 for missing messages array", async () => {
    const res = await POST(jsonRequest({}));
    expect(res.status).toBe(400);
  });

  it("returns 400 when all messages are invalid", async () => {
    const res = await POST(
      jsonRequest({
        messages: [{ role: "user", content: "" }],
      }),
    );
    expect(res.status).toBe(400);
  });

  it("returns 429 when rate limited with missing retryAfterMs", async () => {
    vi.spyOn(chatProtection, "checkRateLimit").mockReturnValue({
      allowed: false,
    } as ReturnType<typeof chatProtection.checkRateLimit>);

    const res = await POST(
      jsonRequest(
        { messages: [{ role: "user", content: "Hi" }] },
        { "x-forwarded-for": "10.0.0.99" },
      ),
    );

    expect(res.status).toBe(429);
    expect(res.headers.get("Retry-After")).toBe("0");
  });

  it("returns 429 when rate limit is exceeded", async () => {
    vi.spyOn(globalThis, "fetch").mockImplementation(async () =>
      new Response(
        JSON.stringify({
          choices: [{ message: { content: "ok" } }],
        }),
        { status: 200 },
      ),
    );

    for (let i = 0; i < 20; i += 1) {
      const ok = await POST(
        jsonRequest(
          { messages: [{ role: "user", content: `hi ${i}` }] },
          { "x-forwarded-for": "10.0.0.1" },
        ),
      );
      expect(ok.status).toBe(200);
    }

    const blocked = await POST(
      jsonRequest(
        { messages: [{ role: "user", content: "one more" }] },
        { "x-forwarded-for": "10.0.0.1" },
      ),
    );

    expect(blocked.status).toBe(429);
    expect(blocked.headers.get("Retry-After")).toBeTruthy();
  });

  it("sends sanitized messages to OpenRouter", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockImplementation(async () =>
      new Response(
        JSON.stringify({
          choices: [{ message: { content: "Assistant reply" } }],
        }),
        { status: 200 },
      ),
    );

    const res = await POST(
      jsonRequest(
        {
          messages: [
            { role: "user", content: "Hello" },
            { role: "assistant", content: "Hi there" },
          ],
        },
        { "x-forwarded-for": "10.0.0.2" },
      ),
    );

    expect(res.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const body = JSON.parse(String(fetchMock.mock.calls[0][1]?.body)) as {
      model: string;
      messages: { role: string; content: string }[];
    };

    expect(body.model).toBe("openai/gpt-oss-120b");
    expect(body.messages[0].role).toBe("system");
    expect(body.messages.slice(1)).toEqual([
      { role: "user", content: "Hello" },
      { role: "assistant", content: "Hi there" },
    ]);
  });

  it("returns 500 when OPENROUTER_API_KEY is missing", async () => {
    delete process.env.OPENROUTER_API_KEY;
    const res = await POST(
      jsonRequest(
        { messages: [{ role: "user", content: "Hi" }] },
        { "x-forwarded-for": "10.0.0.3" },
      ),
    );
    expect(res.status).toBe(500);
  });

  it("returns 400 for invalid JSON body", async () => {
    const res = await POST(
      new Request("http://localhost:3000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "not-json",
      }),
    );
    expect(res.status).toBe(400);
  });

  it("returns upstream error when OpenRouter responds not ok", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ error: { message: "Model busy" } }), {
        status: 503,
        statusText: "Service Unavailable",
      }),
    );

    const res = await POST(
      jsonRequest(
        { messages: [{ role: "user", content: "Hi" }] },
        { "x-forwarded-for": "10.0.0.4" },
      ),
    );
    expect(res.status).toBe(503);
    const json = (await res.json()) as { error?: string };
    expect(json.error).toBe("Model busy");
  });

  it("falls back to statusText when OpenRouter error has no message", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ error: {} }), {
        status: 502,
        statusText: "Bad Gateway",
      }),
    );

    const res = await POST(
      jsonRequest(
        { messages: [{ role: "user", content: "Hi" }] },
        { "x-forwarded-for": "10.0.0.41" },
      ),
    );
    expect(res.status).toBe(502);
    const json = (await res.json()) as { error?: string };
    expect(json.error).toBe("Bad Gateway");
  });

  it("falls back to generic message when OpenRouter error and statusText are missing", async () => {
    const notOkResponse = {
      ok: false,
      status: 500,
      statusText: undefined as string | undefined,
      json: async () => ({}),
    } as Response;
    vi.spyOn(globalThis, "fetch").mockResolvedValue(notOkResponse);

    const res = await POST(
      jsonRequest(
        { messages: [{ role: "user", content: "Hi" }] },
        { "x-forwarded-for": "10.0.0.42" },
      ),
    );
    expect(res.status).toBe(500);
    const json = (await res.json()) as { error?: string };
    expect(json.error).toBe("OpenRouter request failed");
  });

  it("returns 502 when model returns empty content", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ choices: [{ message: { content: "   " } }] }), {
        status: 200,
      }),
    );

    const res = await POST(
      jsonRequest(
        { messages: [{ role: "user", content: "Hi" }] },
        { "x-forwarded-for": "10.0.0.5" },
      ),
    );
    expect(res.status).toBe(502);
  });

  it("returns 502 when fetch throws", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("network down"));

    const res = await POST(
      jsonRequest(
        { messages: [{ role: "user", content: "Hi" }] },
        { "x-forwarded-for": "10.0.0.6" },
      ),
    );
    expect(res.status).toBe(502);
    const json = (await res.json()) as { error?: string };
    expect(json.error).toBe("network down");
  });

  it("returns 502 with generic message when fetch throws non-Error", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue("boom");

    const res = await POST(
      jsonRequest(
        { messages: [{ role: "user", content: "Hi" }] },
        { "x-forwarded-for": "10.0.0.7" },
      ),
    );
    expect(res.status).toBe(502);
    const json = (await res.json()) as { error?: string };
    expect(json.error).toBe("Unknown error");
  });

  it("uses NEXT_PUBLIC_SITE_URL fallback when unset", async () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({ choices: [{ message: { content: "ok" } }] }),
        { status: 200 },
      ),
    );

    await POST(
      jsonRequest(
        { messages: [{ role: "user", content: "Hi" }] },
        { "x-forwarded-for": "10.0.0.8" },
      ),
    );

    const init = fetchMock.mock.calls[0][1] as { headers?: Record<string, string> };
    expect(init.headers?.["HTTP-Referer"]).toBe("http://localhost:3000");
  });
});
