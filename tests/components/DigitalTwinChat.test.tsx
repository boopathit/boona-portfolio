import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DigitalTwinChat } from "../../components/DigitalTwinChat";

describe("DigitalTwinChat", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    window.localStorage.clear();
  });

  async function openChat() {
    await userEvent.click(
      screen.getByRole("button", { name: /open digital twin chat/i }),
    );
  }

  it("shows launcher when closed and opens panel on FAB click (navigation)", async () => {
    render(<DigitalTwinChat />);
    expect(
      screen.getByText("Do you have a question for me?"),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("dialog", { name: /digital twin/i }),
    ).not.toBeInTheDocument();

    await openChat();

    const dialog = screen.getByRole("dialog", { name: /digital twin/i });
    expect(dialog).toBeInTheDocument();
    expect(
      within(dialog).getByText(/ask me about my career/i),
    ).toBeInTheDocument();
  });

  it("closes the panel via close button (navigation)", async () => {
    render(<DigitalTwinChat />);
    await openChat();
    await userEvent.click(
      screen.getByRole("button", { name: /close chat/i }),
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /open digital twin chat/i }),
    ).toBeInTheDocument();
  });

  it("closes the panel on Escape (keyboard navigation)", async () => {
    render(<DigitalTwinChat />);
    await openChat();
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("does not close on Escape when chat is already closed", async () => {
    render(<DigitalTwinChat />);
    await userEvent.keyboard("{Escape}");
    expect(
      screen.getByRole("button", { name: /open digital twin chat/i }),
    ).toBeInTheDocument();
  });

  it("shows empty-state copy when there are no messages and not loading", async () => {
    render(<DigitalTwinChat />);
    await openChat();
    expect(
      screen.getByText(/Hi — I can answer questions about my roles/i),
    ).toBeInTheDocument();
  });

  it("updates input state while typing and clears input after successful send", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ message: "Done" }), { status: 200 }),
    );

    render(<DigitalTwinChat />);
    await openChat();

    const input = screen.getByPlaceholderText(/type a question/i);
    await userEvent.type(input, "Hello world");
    expect(input).toHaveValue("Hello world");

    await userEvent.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => expect(input).toHaveValue(""));
  });

  it("disables send when input is empty or only whitespace (input state)", async () => {
    render(<DigitalTwinChat />);
    await openChat();

    const sendBtn = screen.getByRole("button", { name: /send message/i });
    expect(sendBtn).toBeDisabled();

    const input = screen.getByPlaceholderText(/type a question/i);
    await userEvent.type(input, "   ");
    expect(sendBtn).toBeDisabled();
  });

  it("does not send when form is submitted with empty input (early return)", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch");

    render(<DigitalTwinChat />);
    await openChat();

    const form = document.querySelector(".dt-form");
    expect(form).toBeTruthy();
    fireEvent.submit(form!);

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("renders user messages as plain text and assistant messages as markdown", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({ message: "Reply with **bold**" }),
        { status: 200 },
      ),
    );

    render(<DigitalTwinChat />);
    await openChat();
    await userEvent.type(screen.getByPlaceholderText(/type a question/i), "User line");
    await userEvent.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => {
      expect(screen.getByText("User line")).toBeInTheDocument();
    });
    expect(screen.getByText("bold")).toBeInTheDocument();
  });

  it("does not send twice while a request is in flight (loading guard)", async () => {
    let resolveFetch!: (v: Response) => void;
    const fetchPromise = new Promise<Response>((resolve) => {
      resolveFetch = resolve;
    });
    const fetchMock = vi.spyOn(globalThis, "fetch").mockImplementation(() => fetchPromise);

    render(<DigitalTwinChat />);
    await openChat();
    await userEvent.type(screen.getByPlaceholderText(/type a question/i), "Hi");
    const sendBtn = screen.getByRole("button", { name: /send message/i });
    fireEvent.click(sendBtn);
    fireEvent.click(sendBtn);

    expect(fetchMock).toHaveBeenCalledTimes(1);

    resolveFetch!(
      new Response(JSON.stringify({ message: "Done" }), { status: 200 }),
    );
    await waitFor(() =>
      expect(
        screen.getByText("Done", { selector: ".dt-markdown p" }),
      ).toBeInTheDocument(),
    );
  });

  it("shows loading state and disables input while request is in flight", async () => {
    let resolveFetch: (v: Response) => void;
    const fetchPromise = new Promise<Response>((resolve) => {
      resolveFetch = resolve;
    });
    vi.spyOn(globalThis, "fetch").mockImplementation(() => fetchPromise);

    render(<DigitalTwinChat />);
    await openChat();
    await userEvent.type(screen.getByPlaceholderText(/type a question/i), "Wait");
    await userEvent.click(screen.getByRole("button", { name: /send message/i }));

    expect(screen.getByRole("status", { name: /digital twin is typing/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/type a question/i)).toBeDisabled();

    resolveFetch!(
      new Response(JSON.stringify({ message: "Finally" }), { status: 200 }),
    );

    await waitFor(() => {
      expect(
        screen.queryByRole("status", { name: /digital twin is typing/i }),
      ).not.toBeInTheDocument();
    });
    expect(screen.getByPlaceholderText(/type a question/i)).not.toBeDisabled();
  });

  it("renders markdown from assistant responses", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({ message: "Reach me at **getboopathi.t@gmail.com**" }),
        { status: 200 },
      ),
    );

    render(<DigitalTwinChat />);

    await openChat();
    await userEvent.type(screen.getByPlaceholderText(/type a question/i), "Hi");
    await userEvent.click(screen.getByRole("button", { name: /send message/i }));

    const emailLink = await screen.findByRole("link", {
      name: "getboopathi.t@gmail.com",
    });
    expect(emailLink).toBeTruthy();
    expect(emailLink.closest("strong")).toBeTruthy();
  });

  it("uses default error message when API returns non-OK without error field", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({}), { status: 500 }),
    );

    render(<DigitalTwinChat />);
    await openChat();
    await userEvent.type(screen.getByPlaceholderText(/type a question/i), "Hi");
    await userEvent.click(screen.getByRole("button", { name: /send message/i }));

    expect(
      await screen.findByText("Request failed"),
    ).toBeInTheDocument();
  });

  it("sets error state when API returns non-OK with error body", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ error: "Rate limited upstream" }), {
        status: 429,
      }),
    );

    render(<DigitalTwinChat />);
    await openChat();
    await userEvent.type(screen.getByPlaceholderText(/type a question/i), "Hi");
    await userEvent.click(screen.getByRole("button", { name: /send message/i }));

    expect(
      await screen.findByRole("alert"),
    ).toHaveTextContent("Rate limited upstream");
  });

  it("sets error state when response is OK but message is missing", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({}), { status: 200 }),
    );

    render(<DigitalTwinChat />);
    await openChat();
    await userEvent.type(screen.getByPlaceholderText(/type a question/i), "Hi");
    await userEvent.click(screen.getByRole("button", { name: /send message/i }));

    expect(
      await screen.findByText("No reply from assistant"),
    ).toBeInTheDocument();
  });

  it("sets generic error when thrown value is not an Error instance", async () => {
    vi.spyOn(globalThis, "fetch").mockImplementation(() => {
      throw "string-throw";
    });

    render(<DigitalTwinChat />);
    await openChat();
    await userEvent.type(screen.getByPlaceholderText(/type a question/i), "Hi");
    await userEvent.click(screen.getByRole("button", { name: /send message/i }));

    expect(
      await screen.findByText("Something went wrong"),
    ).toBeInTheDocument();
  });

  it("announces last assistant message in the live region", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ message: "Latest answer" }), { status: 200 }),
    );

    render(<DigitalTwinChat />);
    await openChat();
    await userEvent.type(screen.getByPlaceholderText(/type a question/i), "Q");
    await userEvent.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => {
      const live = document.querySelector(".sr-only[aria-live='polite']");
      expect(live?.textContent).toContain("Latest answer");
    });
  });

  it("restores saved messages from localStorage", async () => {
    window.localStorage.setItem(
      "boona-digital-twin-messages-v1",
      JSON.stringify([
        { id: "a1", role: "assistant", content: "Welcome back!" },
      ]),
    );

    render(<DigitalTwinChat />);
    await openChat();

    await waitFor(() =>
      expect(
        screen.getByText("Welcome back!", { selector: ".dt-markdown p" }),
      ).toBeTruthy(),
    );
  });

  it("ignores corrupted localStorage JSON", () => {
    window.localStorage.setItem("boona-digital-twin-messages-v1", "not-json{");
    const { unmount } = render(<DigitalTwinChat />);
    unmount();
    expect(true).toBe(true);
  });

  it("ignores localStorage payload that is not an array", async () => {
    window.localStorage.setItem(
      "boona-digital-twin-messages-v1",
      JSON.stringify({ foo: 1 }),
    );
    render(<DigitalTwinChat />);
    await openChat();
    expect(
      screen.getByText(/Hi — I can answer questions about my roles/i),
    ).toBeInTheDocument();
  });

  it("filters invalid message objects from localStorage", async () => {
    window.localStorage.setItem(
      "boona-digital-twin-messages-v1",
      JSON.stringify([
        { id: "x", role: "system", content: "bad" },
        { id: "y", role: "user", content: "Good" },
      ]),
    );
    render(<DigitalTwinChat />);
    await openChat();
    await waitFor(() => expect(screen.getByText("Good")).toBeInTheDocument());
    expect(screen.queryByText("bad")).not.toBeInTheDocument();
  });

  it("ignores localStorage when no valid messages remain after filter", async () => {
    window.localStorage.setItem(
      "boona-digital-twin-messages-v1",
      JSON.stringify([{ id: 1, role: "user", content: "nope" }]),
    );
    render(<DigitalTwinChat />);
    await openChat();
    expect(
      screen.getByText(/Hi — I can answer questions about my roles/i),
    ).toBeInTheDocument();
  });

  it("ignores localStorage setItem failures", async () => {
    const setItem = window.localStorage.setItem;
    window.localStorage.setItem = () => {
      throw new Error("quota");
    };
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ message: "OK" }), { status: 200 }),
    );

    render(<DigitalTwinChat />);
    await openChat();
    await userEvent.type(screen.getByPlaceholderText(/type a question/i), "Hi");
    await userEvent.click(screen.getByRole("button", { name: /send message/i }));
    await waitFor(() =>
      expect(
        screen.getByText("OK", { selector: ".dt-markdown p" }),
      ).toBeInTheDocument(),
    );

    window.localStorage.setItem = setItem;
  });
});
