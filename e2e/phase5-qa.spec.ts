import { test, expect, type Page } from "@playwright/test";
import { freshState, startCase, discover } from "../src/game/engine";
import type { GameState } from "../src/game/types";
import { saveKey } from "../src/game/storage";
import { navigate } from "./helpers";
async function restore(page: Page, state: GameState) {
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Case files", exact: true }),
  ).toBeEnabled();
  await page.evaluate(
    ({ key, state }) => {
      localStorage.setItem(key, JSON.stringify(state));
      localStorage.setItem("casezero:selected-case", state.caseId);
    },
    { key: saveKey(state.caseId), state },
  );
  await page.reload();
  await page.getByRole("button", { name: "Continue investigation" }).click();
}
test("failed writes and malformed live updates preserve notes and recover through explicit retry", async ({
  page,
  context,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await restore(page, discover(startCase(freshState()), "E01"));
  await navigate(page, "Notebook");
  await page.evaluate(() => {
    const original = Storage.prototype.setItem;
    (
      window as Window & { casezeroWriteBlocked?: boolean }
    ).casezeroWriteBlocked = true;
    Storage.prototype.setItem = function (key, value) {
      if (
        (window as Window & { casezeroWriteBlocked?: boolean })
          .casezeroWriteBlocked &&
        key.startsWith("casezero:progress:")
      )
        throw new DOMException("Full", "QuotaExceededError");
      original.call(this, key, value);
    };
  });
  await page
    .getByRole("textbox", { name: "Case notes" })
    .fill("Keep my latest investigation.");
  await expect(
    page.getByRole("alert", { name: "Progress needs saving" }),
  ).toBeVisible();
  await page.evaluate(() => {
    (
      window as Window & { casezeroWriteBlocked?: boolean }
    ).casezeroWriteBlocked = false;
  });
  await page.getByRole("button", { name: "Retry saving" }).click();
  await expect(page.getByRole("alert", {name: "Progress needs saving"})).toHaveCount(0);
  const other = await context.newPage();
  await other.goto("/");
  await other.evaluate(() =>
    localStorage.setItem("casezero:progress:v1", "{broken"),
  );
  await expect(page.getByRole("alert", {name: "Progress needs saving"})).toBeVisible();
  await expect(page.getByRole("textbox", { name: "Case notes" })).toHaveValue(
    "Keep my latest investigation.",
  );
  await page.getByRole("button", { name: "Retry saving" }).click();
  await other.close();
  await page.reload();
  await page.getByRole("button", { name: "Continue investigation" }).click();
  await navigate(page, "Notebook");
  await expect(page.getByRole("textbox", { name: "Case notes" })).toHaveValue(
    "Keep my latest investigation.",
  );
  expect(errors).toEqual([]);
});
