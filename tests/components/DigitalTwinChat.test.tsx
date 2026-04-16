import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DigitalTwinChat } from "../../components/DigitalTwinChat";

describe("DigitalTwinChat", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    window.localStorage.clear();
  });

  it("renders markdown from assistant responses", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({ message: "Reach me at **getboopathi.t@gmail.com**" }),
        { status: 200 },
      ),
    );

    render(<DigitalTwinChat />);

    await userEvent.click(
      screen.getByRole("button", { name: /open digital twin chat/i }),
    );
    await userEvent.type(screen.getByPlaceholderText(/type a question/i), "Hi");
    await userEvent.click(screen.getByRole("button", { name: /send message/i }));

    const emailLink = await screen.findByRole("link", {
      name: "getboopathi.t@gmail.com",
    });
    expect(emailLink).toBeTruthy();
    expect(emailLink.closest("strong")).toBeTruthy();
  });

  it("restores saved messages from localStorage", async () => {
    window.localStorage.setItem(
      "boona-digital-twin-messages-v1",
      JSON.stringify([
        { id: "a1", role: "assistant", content: "Welcome back!" },
      ]),
    );

    render(<DigitalTwinChat />);
    await userEvent.click(
      screen.getByRole("button", { name: /open digital twin chat/i }),
    );

    await waitFor(() =>
      expect(
        screen.getByText("Welcome back!", { selector: ".dt-markdown p" }),
      ).toBeTruthy(),
    );
  });
});
