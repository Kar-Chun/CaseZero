import { test, expect } from "@playwright/test";
import { beginConservatory } from "./conservatory-helpers";
import { navigate, visit, search, connect } from "./helpers";
test("a discovery leads naturally to its new interview, and the board links conclusions to sources", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 320, height: 800 });
  await beginConservatory(page);
  await expect(
    page.getByRole("complementary", { name: "Getting started" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Suggest a starting room" }).click();
  await expect(
    page.getByRole("heading", { name: "Propagation Hall", exact: true }),
  ).toBeFocused();
  await page.getByRole("button", { name: "Search Blue waterline" }).click();
  await expect(
    page.getByRole("dialog", { name: "A color with a source" }),
  ).toBeVisible();
  const follow = page.getByRole("button", { name: /Ask Noor Hale/ });
  await follow.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: "Noor Hale", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", {
      name: "Did any trial records survive the blue water?",
    })
    .click();
  await page.getByRole("button", { name: "Visit Potting Studio" }).click();
  await search(page, "Duplicate-set register", "Results before the water");
  await visit(page, "Propagation Hall");
  await search(page, "Automatic feed tray", "The dry automatic feed");
  await visit(page, "Pump House");
  await search(page, "Mechanical flow strip", "A fresh turn of the wheel");
  await navigate(page, "Evidence board");
  await page.getByRole("link", { name: "Jump to evidence" }).click();
  await expect(page.locator("#board-inventory")).toBeFocused();
  await page.getByRole("link", { name: "Go to pinned thread (0)" }).click();
  await expect(page.locator("#board-thread")).toBeFocused();
  await connect(
    page,
    [
      "A color with a source",
      "The dry automatic feed",
      "A fresh turn of the wheel",
    ],
    "Someone operated the local manual bypass to deliver the blue water.",
  );
  await expect(
    page.getByRole("heading", {
      name: "Conclusion established: Which way did the water go?",
    }),
  ).toBeFocused();
  await page.getByRole("link", { name: "Back to board questions" }).click();
  await expect(page.locator("#board-questions")).toBeFocused();
  await page.getByText("Review supporting records", { exact: true }).click();
  await page
    .getByRole("button", { name: "A color with a source", exact: true })
    .click();
  await expect(
    page.getByRole("dialog", { name: "A color with a source" }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: /Ask Noor Hale/ })).toHaveCount(
    0,
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
