import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { it, expect, vi } from "vitest";
import { feedbackContext, feedbackReport } from "../src/game/feedback";
import { Feedback } from "../src/components/Feedback";
import { solveCase, solveRadio, solveConservatory } from "./helpers";
it("exports only allowlisted context and voluntary feedback for all three cases", () => {
  for (const s of [solveCase(), solveRadio(), solveConservatory()]) {
    s.notes = "PRIVATE NOTE NEVER EXPORT";
    const text = feedbackReport(feedbackContext(s, "Evidence board"), {
      kind: "Difficulty",
      description: "I could not find the thread.",
      expected: "A way back to my selected cards.",
      device: "iPhone Safari",
    });
    expect(text).toContain("View: Evidence board");
    expect(text).toContain("iPhone Safari");
    expect(text).not.toContain(s.notes);
    expect(text).not.toMatch(/"proofs"|E01|E21|E41|M02|R03/);
    expect(text).not.toContain(solveCase().accusation?.suspect ?? "S01");
  }
});
it("copies the reviewed report, warns when edited, and offers manual selection if access fails", async () => {
  const user = userEvent.setup();
  const clipboard = vi
    .spyOn(navigator.clipboard, "writeText")
    .mockResolvedValue();
  try {
    render(
      <Feedback state={solveCase()} view="Evidence board" onClose={() => {}} />,
    );
    expect(screen.getByRole("button", { name: "Copy report" })).toBeDisabled();
    await user.type(
      screen.getByLabelText("What happened or how did it feel?"),
      "A thread was unclear.",
    );
    await user.click(screen.getByRole("button", { name: "Copy report" }));
    expect(clipboard).toHaveBeenCalledWith(
      expect.stringContaining("A thread was unclear."),
    );
    expect(screen.getByRole("status")).toHaveTextContent("Report copied");
    await user.type(
      screen.getByLabelText("What did you expect? (optional)"),
      "Clearer guidance.",
    );
    expect(screen.getByRole("status")).toHaveTextContent("report changed");
    await user.click(screen.getByText("Review the report"));
    clipboard.mockRejectedValue(Error("Denied"));
    await user.click(screen.getByRole("button", { name: "Copy report" }));
    expect(screen.getByRole("status")).toHaveTextContent(
      "Clipboard access is unavailable",
    );
    const preview = screen.getByRole("textbox", {
      name: "Feedback report",
    }) as HTMLTextAreaElement;
    expect(preview).toBeVisible();
    expect(preview).toHaveFocus();
    expect(preview.selectionEnd).toBe(preview.value.length);
    expect(
      screen.getByRole("link", { name: "Download report" }),
    ).toHaveAttribute("download", "casezero-feedback.txt");
  } finally {
    clipboard.mockRestore();
  }
});
