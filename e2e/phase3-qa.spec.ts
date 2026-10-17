import { test, expect, type Page } from "@playwright/test";
import {
  freshState,
  startCase,
  discover,
  notebook,
  analyze,
} from "../src/game/engine";
import { saveKey } from "../src/game/storage";
import { navigate, visit, connect } from "./helpers";
const originals = [
  notebook(discover(startCase(freshState()), "E01"), "Original museum notes."),
  notebook(
    discover(startCase(freshState("dead-air")), "E21"),
    "Original radio notes.",
  ),
];
const prepared = ["E41", "E42", "E43", "E44", "E45", "E46"].reduce(
  discover,
  startCase(freshState("after-the-flood")),
);
async function restoreFixture(page: Page, withSequence = false) {
  const games = [
    ...originals,
    withSequence ? analyze(prepared, "I21", "V3:V1:V4:V2").state : prepared,
  ];
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Case files", exact: true }),
  ).toBeEnabled();
  await page.evaluate(
    (entries) => {
      for (const [key, raw] of entries) localStorage.setItem(key, raw);
      localStorage.setItem("casezero:selected-case", "after-the-flood");
    },
    games.map((s) => [saveKey(s.caseId), JSON.stringify(s)]),
  );
  await page.reload();
  await page.getByRole("button", { name: "Continue investigation" }).click();
}
test("sequence analysis, explanations and revelations support narrow-screen keyboard access and axe scans", async ({
  page,
}, testInfo) => {
  test.setTimeout(90000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 320, height: 800 });
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  const { default: AxeBuilder } = await import("@axe-core/playwright");
  async function scan() {
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const report = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(report.violations).toEqual([]);
  }
  await restoreFixture(page);
  await visit(page, "Pump House");
  await page
    .getByRole("button", { name: "Search Reconstruction bench" })
    .click();
  await expect(
    page.getByRole("dialog", { name: "Reconstruct the two flows" }),
  ).toBeFocused();
  await scan();
  await page.keyboard.press("Shift+Tab");
  await expect(page.getByLabel("Position 4")).toBeFocused();
  for (const [i, id] of ["V3", "V1", "V4", "V2"].entries())
    await page.getByLabel(`Position ${i + 1}`).selectOption(id);
  await page.getByRole("button", { name: "Test reconstruction" }).focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("dialog", { name: "The second flow", exact: true }),
  ).toBeVisible();
  await scan();
  await page.keyboard.press("Escape");
  await connect(page, [
    "A color with a source",
    "The dry automatic feed",
    "A fresh turn of the wheel",
  ]);
  await scan();
  const choice = page.getByRole("radio", {
    name: "Someone operated the local manual bypass to deliver the blue water.",
  });
  await choice.focus();
  await page.keyboard.press("Space");
  await expect(choice).toBeChecked();
  await page.getByRole("button", { name: "Test connection" }).focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("heading", {
      name: "Conclusion established: Which way did the water go?",
    }),
  ).toBeFocused();
  expect(
    await page
      .locator(".conclusion-revelation")
      .evaluate((el) => getComputedStyle(el).animationName),
  ).toBe("none");
  await scan();
  await page.getByRole("link", { name: "Back to board questions" }).click();
  await page.getByText("Review supporting records", { exact: true }).click();
  await scan();
  await page.screenshot({
    path: testInfo.outputPath("conservatory-board-narrow.png"),
    fullPage: true,
  });
  await navigate(page, "Notebook");
  await page.getByRole("button", { name: "Import investigation" }).click();
  await page.getByText("Paste a backup instead", { exact: true }).click();
  const raw = await page.evaluate(() =>
    localStorage.getItem("casezero:progress:after-the-flood:v2")!,
  );
  await page.getByRole("textbox", { name: "Backup contents" }).fill(raw);
  await page.getByRole("button", { name: "Review backup" }).click();
  await expect(
    page
      .getByRole("dialog")
      .getByRole("heading", { name: "After the Flood", exact: true }),
  ).toBeFocused();
  await scan();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "Import investigation" }),
  ).toBeFocused();
  expect(errors).toEqual([]);
});
test("third-case backups preserve analysis, hints and pins through replay and reset while other cases stay intact", async ({
  page,
}) => {
  await restoreFixture(page, true);
  await navigate(page, "Evidence board");
  await page.getByRole("button", { name: "Pin A color with a source" }).click();
  await page
    .getByRole("button", { name: "Pin The dry automatic feed" })
    .click();
  await navigate(page, "Notebook");
  await page
    .getByRole("textbox", { name: "Case notes" })
    .fill("The untimed batch still has an order.");
  await page.getByText("Need a lead?", { exact: true }).click();
  await page.getByRole("button", { name: "Reveal a gentle hint" }).click();
  await page.getByRole("button", { name: "Make it clearer" }).click();
  const pending = page.waitForEvent("download");
  await page.getByRole("link", { name: "Export investigation" }).click();
  const download = await pending;
  expect(download.suggestedFilename()).toBe("casezero-after-the-flood.json");
  const path = await download.path();
  expect(path).not.toBeNull();
  await navigate(page, "Case files");
  await page.getByRole("button", { name: "Replay After the Flood" }).click();
  await page.getByRole("button", { name: "Start new game" }).click();
  await page.getByRole("button", { name: "Enter the conservatory" }).click();
  await navigate(page, "Notebook");
  await expect(page.getByRole("textbox", { name: "Case notes" })).toHaveValue(
    "",
  );
  await page.getByRole("button", { name: "Import investigation" }).click();
  await page.getByLabel("Choose a case backup").setInputFiles(path!);
  await page.getByRole("button", { name: "Review backup" }).click();
  await page
    .getByRole("button", { name: "Replace this investigation" })
    .click();
  await expect(page.getByRole("textbox", { name: "Case notes" })).toHaveValue(
    "The untimed batch still has an order.",
  );
  await page.getByText("Need a lead?", { exact: true }).click();
  await expect(page.locator(".hint-ladder li")).toHaveCount(2);
  await navigate(page, "Evidence board");
  await expect(
    page.getByRole("button", { name: "Unpin A color with a source" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Unpin The dry automatic feed" }),
  ).toBeVisible();
  await visit(page, "Pump House");
  await expect(
    page.getByRole("button", { name: "Inspect The second flow", exact: true }),
  ).toBeVisible();
  for (const [label, note] of [
    ["Continue saved investigation", "Original museum notes."],
    ["Continue Dead Air", "Original radio notes."],
  ]) {
    await navigate(page, "Case files");
    await page.getByRole("button", { name: label, exact: true }).click();
    await navigate(page, "Notebook");
    await expect(page.getByRole("textbox", { name: "Case notes" })).toHaveValue(
      note,
    );
  }
  await navigate(page, "Case files");
  await page.getByRole("button", { name: "Continue After the Flood" }).click();
  await navigate(page, "Notebook");
  await page.getByRole("button", { name: "Reset progress" }).click();
  await page.getByRole("button", { name: "Reset case" }).click();
  await expect(
    page.getByRole("button", { name: "Explore the case" }),
  ).toBeVisible();
  for (const s of originals)
    expect(
      await page.evaluate(
        (key) => JSON.parse(localStorage.getItem(key)!),
        saveKey(s.caseId),
      ),
    ).toEqual(s);
  expect(
    await page.evaluate(() =>
      localStorage.getItem("casezero:progress:after-the-flood:v2"),
    ),
  ).toBeNull();
});
