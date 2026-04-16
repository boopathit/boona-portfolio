// @vitest-environment node

import { resetProtectionState } from "../../lib/chat-protection";
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
});
