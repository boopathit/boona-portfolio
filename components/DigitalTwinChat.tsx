"use client";

import { Send, Sparkles, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Role = "user" | "assistant";

type Msg = { id: string; role: Role; content: string };

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function DigitalTwinChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, open, loading, scrollToBottom]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    setError(null);
    setInput("");
    const userMsg: Msg = { id: uid(), role: "user", content: text };
    const next = [...messages, userMsg];
    setMessages(next);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.map(({ role, content }) => ({ role, content })),
        }),
      });
      const data = (await res.json()) as { message?: string; error?: string };
      if (!res.ok) {
        throw new Error(data.error ?? "Request failed");
      }
      if (!data.message) {
        throw new Error("No reply from assistant");
      }
      setMessages((prev) => [
        ...prev,
        { id: uid(), role: "assistant", content: data.message! },
      ]);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Something went wrong";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    void send();
  }

  return (
    <div className="dt-root">
      {!open && (
        <div className="dt-launcher">
          <p className="dt-prompt">Do you have a question for me?</p>
          <button
            type="button"
            className="dt-fab"
            onClick={() => setOpen(true)}
            aria-expanded={false}
            aria-controls="dt-panel"
            aria-label="Open Digital Twin chat"
          >
            <Sparkles size={26} strokeWidth={1.75} aria-hidden />
          </button>
        </div>
      )}

      {open && (
        <div
          id="dt-panel"
          className="dt-panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="dt-title"
        >
          <header className="dt-header">
            <div className="dt-header-text">
              <span id="dt-title" className="dt-title">
                Digital Twin
              </span>
              <span className="dt-sub">Ask me about my career</span>
            </div>
            <button
              type="button"
              className="dt-close"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
            >
              <X size={20} />
            </button>
          </header>

          <div className="dt-messages" ref={listRef}>
            {messages.length === 0 && !loading && (
              <p className="dt-empty">
                Hi — I can answer questions about my roles, skills, and
                work experience from this profile. What would you like to ask?
              </p>
            )}
            {messages.map((m) => (
              <div
                key={m.id}
                className={`dt-bubble dt-bubble--${m.role}`}
              >
                {m.role === "assistant" ? (
                  <div className="dt-markdown">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        a: ({ ...props }) => (
                          <a
                            {...props}
                            target="_blank"
                            rel="noreferrer"
                          />
                        ),
                      }}
                    >
                      {m.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  m.content
                )}
              </div>
            ))}
            {loading && (
              <div className="dt-bubble dt-bubble--assistant dt-typing">
                <span />
                <span />
                <span />
              </div>
            )}
            {error && (
              <p className="dt-error" role="alert">
                {error}
              </p>
            )}
          </div>

          <form className="dt-form" onSubmit={onSubmit}>
            <input
              type="text"
              className="dt-input"
              placeholder="Type a question…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              maxLength={2000}
              autoComplete="off"
            />
            <button
              type="submit"
              className="dt-send"
              disabled={loading || !input.trim()}
              aria-label="Send message"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
