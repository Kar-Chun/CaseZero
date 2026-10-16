import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { it, expect } from "vitest";
import { Modal } from "../src/components/Modal";
it("traps focus using visible controls and native summaries, including after focus leaves a changed dialog", async () => {
  const user = userEvent.setup();
  render(
    <>
      <button>Outside</button>
      <Modal title="Keyboard test" onClose={() => {}}>
        <button>Visible action</button>
        <details>
          <summary>Extra field</summary>
          <input aria-label="Extra value" />
        </details>
        <button disabled>Unavailable</button>
      </Modal>
    </>,
  );
  await user.keyboard("{Tab}");
  expect(screen.getByRole("button", { name: "Close dialog" })).toHaveFocus();
  await user.keyboard("{Shift>}{Tab}{/Shift}");
  expect(screen.getByText("Extra field")).toHaveFocus();
  await user.keyboard("{Tab}");
  expect(screen.getByRole("button", { name: "Close dialog" })).toHaveFocus();
  await user.click(screen.getByText("Extra field"));
  screen.getByRole("button", { name: "Close dialog" }).focus();
  await user.keyboard("{Shift>}{Tab}{/Shift}");
  expect(screen.getByRole("textbox", { name: "Extra value" })).toHaveFocus();
  screen.getByRole("button", { name: "Outside" }).focus();
  await user.keyboard("{Tab}");
  expect(screen.getByRole("button", { name: "Close dialog" })).toHaveFocus();
});
