import { test, expect } from "@playwright/test";
import { navigate, visit, search } from "./helpers";
test("keyboard entry, dialog focus, reduced motion and 320px layouts", async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Explore the case" }),
  ).toBeEnabled();
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("main")).toBeFocused();
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).not.toBeInViewport();
  expect(
    await page
      .locator(".hero-art")
      .evaluate((el) => getComputedStyle(el).animationName),
  ).toBe("none");
  await page.screenshot({
    path: testInfo.outputPath("home.png"),
    fullPage: true,
  });
  await page.getByRole("button", { name: "How to play" }).click();
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("button", { name: "Close dialog" }),
  ).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(page.getByRole("button", { name: "Understood" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("button", { name: "Close dialog" }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "How to play" })).toBeFocused();
  await page.getByRole("button", { name: "Explore the case" }).click();
  await expect(
    page.getByRole("heading", { name: /Every case begins/ }),
  ).toBeFocused();
  await page.getByRole("button", { name: "Begin investigation" }).click();
  await page.getByRole("button", { name: "Enter the museum" }).click();
  await visit(page, "The Grand Gallery");
  await search(page, "Display pedestal", "Maintenance slip");
  for (const name of [
    "Locations",
    "Evidence board",
    "Interviews",
    "Notebook",
    "Accusation",
  ]) {
    await navigate(page, name);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await expect(page.getByRole("main")).toBeVisible();
  }
  await navigate(page, "Evidence board");
  await page.screenshot({
    path: testInfo.outputPath("board.png"),
    fullPage: true,
  });
  expect(errors).toEqual([]);
});

test("WCAG accessibility scan of entry, evidence, interviews and notebook", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const { default: AxeBuilder } = await import("@axe-core/playwright");
  async function scan() {
    const report = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(report.violations).toEqual([]);
  }
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Explore the case" }),
  ).toBeEnabled();
  await scan();
  await page.getByRole("button", { name: "How to play" }).click();
  await scan();
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Explore the case" }).click();
  await scan();
  await page.getByRole("button", { name: "Begin investigation" }).click();
  await scan();
  await page.getByRole("button", { name: "Enter the museum" }).click();
  await scan();
  await visit(page, "The Grand Gallery");
  await search(page, "Display pedestal", "Maintenance slip");
  for (const name of [
    "Evidence board",
    "Interviews",
    "Notebook",
    "Accusation",
  ]) {
    await navigate(page, name);
    await scan();
  }
});
