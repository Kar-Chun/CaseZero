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
  await expect(
    page.getByRole("alert", { name: "Progress needs saving" }),
  ).toHaveCount(0);
  const other = await context.newPage();
  await other.goto("/");
  await other.evaluate(() =>
    localStorage.setItem("casezero:progress:v1", "{broken"),
  );
  await expect(
    page.getByRole("alert", { name: "Progress needs saving" }),
  ).toBeVisible();
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

test("narrow touch investigation pins files and reaches explanations before testing a thread", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  const state = ["E42", "E43", "E46"].reduce(
    discover,
    startCase(freshState("after-the-flood")),
  );
  await restore(page, state);
  await navigate(page, "Locations");
  await page
    .getByRole("button", { name: /Propagation Hall.*Explore location/ })
    .click();
  await page
    .getByRole("button", { name: "Inspect A color with a source", exact: true })
    .click();
  const action = page.getByRole("button", { name: "Pin for comparison" });
  if (testInfo.project.name === "mobile") await action.tap();
  else await action.click();
  await expect(
    page.getByRole("button", { name: "Unpin evidence" }),
  ).toHaveAttribute("aria-pressed", "true");
  const navigation = page.getByRole("navigation", {
    name: "Investigation navigation",
  });
  expect(await navigation.evaluate((el) => !!el.closest("[inert]"))).toBe(true);
  expect(
    await navigation.evaluate((el) => {
      (el.querySelector("button") as HTMLElement).focus();
      return el.contains(document.activeElement);
    }),
  ).toBe(false);
  await page.getByRole("button", { name: "Close dialog" }).click();
  await navigate(page, "Evidence board");
  for (const name of ["The dry automatic feed", "A fresh turn of the wheel"])
    await page
      .getByRole("button", { name: `Pin ${name}`, exact: true })
      .click();
  await page.getByRole("link", { name: "Go to pinned thread (3)" }).click();
  await expect(page.locator("#board-thread")).toBeFocused();
  const group = page.getByRole("group", {
    name: "What do these records establish?",
  });
  await expect(group).toBeInViewport();
  const { default: AxeBuilder } = await import("@axe-core/playwright");
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
  await page
    .getByRole("radio", {
      name: "Someone operated the local manual bypass to deliver the blue water.",
    })
    .check();
  await page.getByRole("button", { name: "Test connection" }).click();
  await expect(
    page.getByRole("heading", {
      name: "Conclusion established: Which way did the water go?",
    }),
  ).toBeFocused();
  await page.getByRole("searchbox").fill("nothing matches this");
  await page.getByRole("button", { name: "Reset evidence filters" }).click();
  await expect(page.getByRole("searchbox")).toBeFocused();
  expect(
    await page
      .getByRole("searchbox")
      .evaluate((el) => getComputedStyle(el).fontSize),
  ).toBe("16px");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("timeline shortcuts retain the unfinished order and modal focus", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 800 });
  const state = ["E41", "E44", "E45", "E46"].reduce(
    discover,
    startCase(freshState("after-the-flood")),
  );
  await restore(page, state);
  await navigate(page, "Locations");
  await page
    .getByRole("button", { name: /Pump House.*Explore location/ })
    .click();
  await page
    .getByRole("button", { name: "Search Reconstruction bench" })
    .click();
  await page.getByRole("link", { name: "Jump to event order" }).click();
  await expect(
    page.getByRole("group", {
      name: "Your reconstruction · earliest to latest",
    }),
  ).toBeFocused();
  await page.getByLabel("Position 1").selectOption("V3");
  await expect(
    page.getByText("1/4 positions filled. Each event belongs once."),
  ).toBeVisible();
  await page.getByRole("link", { name: "Return to source records" }).click();
  await expect(
    page.getByRole("heading", { name: "Mixing book" }),
  ).toBeInViewport();
  await page.getByRole("link", { name: "Jump to event order" }).click();
  await expect(page.getByLabel("Position 1")).toHaveValue("V3");
  expect(
    await page
      .getByLabel("Position 1")
      .evaluate((el) => getComputedStyle(el).fontSize),
  ).toBe("16px");
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "Search Reconstruction bench" }),
  ).toBeFocused();
});
