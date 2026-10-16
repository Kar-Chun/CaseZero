import { test, expect } from "@playwright/test";
import { navigate, visit, search } from "./helpers";
import { beginRadio } from "./radio-helpers";

test("Dead Air analysis, case tools and narrow layouts support accessible keyboard play", async ({
  page,
}, testInfo) => {
  test.setTimeout(90000);
  await page.setViewportSize({ width: 320, height: 800 });
  await page.emulateMedia({ reducedMotion: "reduce" });
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
  await beginRadio(page);
  await scan();
  await visit(page, "Control Room");
  await search(page, "Queue printer", "The queue print");
  await search(page, "Calibration card", "Two clocks, one pulse");
  await page
    .getByRole("button", { name: "Search Clock comparison desk" })
    .click();
  await scan();
  await page.getByLabel("Insertion in network time").fill("22:06");
  await page.getByRole("button", { name: "Check corrected time" }).focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("dialog", { name: "The corrected insertion" }),
  ).toBeVisible();
  await scan();
  await page.keyboard.press("Escape");
  await visit(page, "Donor Lounge");
  await search(page, "Trial contract folder", "The canceled trial");
  await navigate(page, "Interviews");
  await page.getByRole("button", { name: /Kit Mercer/ }).click();
  await page
    .getByRole("button", {
      name: "May I compare the standby rider with the assurance?",
    })
    .click();
  await page.getByRole("button", { name: "Visit Newsroom" }).click();
  await page
    .getByRole("button", { name: "Search Contract comparison table" })
    .click();
  await scan();
  const assurance = page.getByRole("radio", {
    name: "The standby payment requires an independent harbor-master closure.",
  });
  await assurance.focus();
  await page.keyboard.press("Space");
  await expect(assurance).toBeChecked();
  const rider = page.getByRole("radio", {
    name: "£80,000 credit on any canceled 22:20 public trial, whatever the cause.",
  });
  await rider.focus();
  await page.keyboard.press("Space");
  await page.getByRole("button", { name: "Test contradiction" }).focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("dialog", { name: "The rider’s real trigger" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  for (const section of [
    "Evidence board",
    "Interviews",
    "Notebook",
    "Accusation",
  ]) {
    await navigate(page, section);
    await scan();
  }
  await navigate(page, "Evidence board");
  await page.screenshot({
    path: testInfo.outputPath("radio-board-narrow.png"),
    fullPage: true,
  });
  await navigate(page, "Notebook");
  await page.getByRole("button", { name: "Import investigation" }).click();
  await scan();
  await page.getByText("Paste a backup instead", { exact: true }).focus();
  await page.keyboard.press("Enter");
  const raw = await page.evaluate(() =>
    localStorage.getItem("casezero:progress:dead-air:v2")!,
  );
  await page.getByRole("textbox", { name: "Backup contents" }).fill(raw);
  await scan();
  await page.getByRole("button", { name: "Review backup" }).click();
  const dialog = page.getByRole("dialog", { name: "Restore a case backup" });
  await expect(
    dialog.getByRole("heading", { name: "Dead Air", exact: true }),
  ).toBeFocused();
  await scan();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "Import investigation" }),
  ).toBeFocused();
  expect(errors).toEqual([]);
});

test("an original v1 investigation migrates in the browser without losing notes or evidence", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Explore the case" }),
  ).toBeEnabled();
  await page.evaluate(() =>
    localStorage.setItem(
      "casezero:progress:v1",
      JSON.stringify({
        version: 1,
        caseId: "quiet-hour",
        started: true,
        evidence: ["E01"],
        deductions: [],
        answers: [],
        notes: "Original investigator’s notebook.",
        accusation: null,
      }),
    ),
  );
  await page.reload();
  await page.getByRole("button", { name: "Continue investigation" }).click();
  await navigate(page, "Notebook");
  await expect(page.getByRole("textbox", { name: "Case notes" })).toHaveValue(
    "Original investigator’s notebook.",
  );
  await expect(
    page.getByRole("button", { name: /E01 Maintenance slip/ }),
  ).toBeVisible();
  await expect
    .poll(() =>
      page.evaluate(
        () => JSON.parse(localStorage.getItem("casezero:progress:v1")!).version,
      ),
    )
    .toBe(2);
  await page.reload();
  await page.getByRole("button", { name: "Continue investigation" }).click();
  await navigate(page, "Notebook");
  await expect(page.getByRole("textbox", { name: "Case notes" })).toHaveValue(
    "Original investigator’s notebook.",
  );
});

test("different-case tabs save independently and resetting one preserves the other", async ({
  page,
  context,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Explore the case" }).click();
  await page.getByRole("button", { name: "Begin investigation" }).click();
  await page.getByRole("button", { name: "Enter the museum" }).click();
  const radio = await context.newPage();
  await radio.goto("/");
  await radio.getByRole("button", { name: "Case files", exact: true }).click();
  await radio.getByRole("button", { name: "Investigate Dead Air" }).click();
  await radio.getByRole("button", { name: "Enter the station" }).click();
  await visit(radio, "Control Room");
  await search(radio, "Queue printer", "The queue print");
  await navigate(radio, "Notebook");
  await radio
    .getByRole("textbox", { name: "Case notes" })
    .fill("Keep the station open.");
  await visit(page, "The Grand Gallery");
  await search(page, "Display pedestal", "Maintenance slip");
  await navigate(page, "Notebook");
  await page
    .getByRole("textbox", { name: "Case notes" })
    .fill("Museum notes only.");
  await expect(radio.getByRole("textbox", { name: "Case notes" })).toHaveValue(
    "Keep the station open.",
  );
  await navigate(page, "Case files");
  const radioCard = page.getByRole("article", { name: "Dead Air case file" });
  await expect(radioCard).toContainText("1/14 evidence");
  await expect(radioCard).toContainText("Notes saved");
  await page
    .getByRole("button", { name: "Continue saved investigation" })
    .click();
  await navigate(page, "Notebook");
  await page.getByRole("button", { name: "Reset progress" }).click();
  await page.getByRole("button", { name: "Reset case" }).click();
  await expect(
    page.getByRole("button", { name: "Explore the case" }),
  ).toBeVisible();
  await expect(radio.getByRole("textbox", { name: "Case notes" })).toHaveValue(
    "Keep the station open.",
  );
  await radio.reload();
  await radio.getByRole("button", { name: "Continue investigation" }).click();
  await navigate(radio, "Notebook");
  await expect(radio.getByRole("textbox", { name: "Case notes" })).toHaveValue(
    "Keep the station open.",
  );
  await expect(
    radio.getByRole("button", { name: /E21 The queue print/ }),
  ).toBeVisible();
  await radio.close();
});

test("storage-denied play keeps both investigations in memory when switching cases", async ({
  page,
}) => {
  await page.addInitScript(() =>
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new DOMException("Denied", "SecurityError");
      },
    }),
  );
  await page.goto("/");
  await page.getByRole("button", { name: "Explore the case" }).click();
  await page.getByRole("button", { name: "Begin investigation" }).click();
  await page.getByRole("button", { name: "Enter the museum" }).click();
  await visit(page, "The Grand Gallery");
  await search(page, "Display pedestal", "Maintenance slip");
  await navigate(page, "Notebook");
  await page
    .getByRole("textbox", { name: "Case notes" })
    .fill("Museum session notes.");
  await navigate(page, "Case files");
  await page.getByRole("button", { name: "Investigate Dead Air" }).click();
  await page.getByRole("button", { name: "Enter the station" }).click();
  await visit(page, "Control Room");
  await search(page, "Queue printer", "The queue print");
  await navigate(page, "Notebook");
  await page
    .getByRole("textbox", { name: "Case notes" })
    .fill("Radio session notes.");
  await navigate(page, "Case files");
  await page
    .getByRole("button", { name: "Continue saved investigation" })
    .click();
  await navigate(page, "Notebook");
  await expect(page.getByRole("textbox", { name: "Case notes" })).toHaveValue(
    "Museum session notes.",
  );
  await expect(
    page.getByRole("button", { name: /E01 Maintenance slip/ }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Reset progress" }).click();
  await page.getByRole("button", { name: "Reset case" }).click();
  await page.getByRole("button", { name: "Explore the case" }).click();
  await page.getByRole("button", { name: "Continue Dead Air" }).click();
  await navigate(page, "Notebook");
  await expect(page.getByRole("textbox", { name: "Case notes" })).toHaveValue(
    "Radio session notes.",
  );
  await expect(
    page.getByRole("button", { name: /E21 The queue print/ }),
  ).toBeVisible();
  await expect(
    page.getByText("Saving unavailable · session only"),
  ).toBeVisible();
});
