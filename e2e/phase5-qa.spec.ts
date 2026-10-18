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
  const { default: AxeBuilder } = await import("@axe-core/playwright");
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
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

test("feedback downloads only reviewed context and falls back safely when clipboard access is denied", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  const state = {
    ...discover(startCase(freshState()), "E01"),
    notes: "PRIVATE_NOTE_MUST_NOT_LEAK",
  };
  await restore(page, state);
  await page
    .getByRole("button", { name: "Playtest feedback", exact: true })
    .click();
  await page
    .getByLabel("What happened or how did it feel?")
    .fill("I did not know where to pin a record.");
  await page.getByLabel("Browser or device (optional)").fill("Phone playtest");
  await page.evaluate(() =>
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: () => Promise.reject(new Error("Denied")) },
    }),
  );
  await page.getByText("Review the report", { exact: true }).click();
  await page.getByRole("button", { name: "Copy report" }).click();
  await expect(page.getByRole("dialog").getByRole("status")).toContainText(
    "Clipboard access is unavailable",
  );
  await expect(
    page.getByRole("textbox", { name: "Feedback report" }),
  ).toBeFocused();
  const report = await page
    .getByRole("textbox", { name: "Feedback report" })
    .inputValue();
  expect(report).toContain("I did not know where to pin a record.");
  expect(report).not.toContain(state.notes);
  expect(report).not.toContain("Maintenance slip");
  const { default: AxeBuilder } = await import("@axe-core/playwright");
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
  await expect(
    page.getByRole("button", { name: "Close dialog" }),
  ).toBeInViewport();
  const pending = page.waitForEvent("download");
  await page.getByRole("link", { name: "Download report" }).click();
  const file = await pending;
  expect(file.suggestedFilename()).toBe("casezero-feedback.txt");
  const { readFile } = await import("node:fs/promises");
  expect(await readFile((await file.path())!, "utf8")).toBe(report);
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "Playtest feedback", exact: true }),
  ).toBeFocused();
  const saved = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("casezero:progress:v1")!),
  );
  expect(saved).toEqual(state);
});

test("a failed ending chunk offers a production recovery screen and reload restores the submitted account", async ({
  page,
}) => {
  test.setTimeout(90000);
  const { solveCase } = await import("../tests/helpers");
  await restore(page, solveCase());
  await navigate(page, "Accusation");
  await page.getByLabel("Person of interest").selectOption("S01");
  await page.getByLabel("How was it taken?").selectOption("M02");
  await page.getByLabel("Why was it taken?").selectOption("R03");
  await page.getByRole("button", { name: "Review accusation" }).click();
  let failedPath: string | null = null;
  let failures = 0;
  const pattern = "**/_next/static/chunks/*.js*";
  await page.route(pattern, (route) => {
    const path = new URL(route.request().url()).pathname;
    failedPath ??= path;
    if (path === failedPath) {
      failures++;
      return route.abort("failed");
    }
    return route.continue();
  });
  await page.getByRole("button", { name: "Submit accusation" }).click();
  await expect(
    page.getByRole("heading", { name: "The case file could not open." }),
  ).toBeFocused({ timeout: 20000 });
  const { default: AxeBuilder } = await import("@axe-core/playwright");
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
  expect(failures).toBeGreaterThan(0);
  await page.unroute(pattern);
  await page.getByRole("button", { name: "Reload saved game" }).click();
  await page.getByRole("button", { name: "Continue investigation" }).click();
  await expect(
    page.getByRole("heading", { name: "Case closed." }),
  ).toBeVisible();
});
