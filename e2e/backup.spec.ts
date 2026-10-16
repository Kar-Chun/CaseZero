import { test, expect } from "@playwright/test";
import { navigate, visit, search } from "./helpers";
import { exportBackup, MAX_BACKUP_SIZE } from "../src/game/backup";
import { freshState, startCase } from "../src/game/engine";
async function begin(page: import("@playwright/test").Page) {
  await page.goto("/");
  await page.getByRole("button", { name: "Explore the case" }).click();
  await page.getByRole("button", { name: "Begin investigation" }).click();
  await page.getByRole("button", { name: "Enter the museum" }).click();
}
test("downloaded backup restores notes, pins and hints without changing another case", async ({
  page,
}) => {
  await begin(page);
  await visit(page, "The Grand Gallery");
  await search(page, "Display pedestal", "Maintenance slip");
  await navigate(page, "Evidence board");
  await page.getByRole("button", { name: "Pin Maintenance slip" }).click();
  await navigate(page, "Notebook");
  await page
    .getByRole("textbox", { name: "Case notes" })
    .fill("Exported field notes.");
  await page.getByText("Need a lead?", { exact: true }).click();
  await page.getByRole("button", { name: "Reveal a gentle hint" }).click();
  const pending = page.waitForEvent("download");
  await page.getByRole("link", { name: "Export investigation" }).click();
  const download = await pending;
  expect(download.suggestedFilename()).toBe("casezero-quiet-hour.json");
  const path = await download.path();
  expect(path).not.toBeNull();
  await navigate(page, "Case files");
  await page.getByRole("button", { name: "Investigate Dead Air" }).click();
  await page.getByRole("button", { name: "Enter the station" }).click();
  await visit(page, "Control Room");
  await search(page, "Queue printer", "The queue print");
  await navigate(page, "Notebook");
  await page
    .getByRole("textbox", { name: "Case notes" })
    .fill("Independent radio notes.");
  await navigate(page, "Case files");
  await page
    .getByRole("button", { name: "Continue saved investigation" })
    .click();
  await navigate(page, "Notebook");
  await page
    .getByRole("textbox", { name: "Case notes" })
    .fill("Changed since the export.");
  await page.getByRole("button", { name: "Import investigation" }).click();
  await page.getByLabel("Choose a case backup").setInputFiles(path!);
  await page.getByRole("button", { name: "Review backup" }).click();
  const dialog = page.getByRole("dialog", { name: "Restore a case backup" });
  await expect(
    dialog.getByRole("heading", { name: "The Quiet Hour", exact: true }),
  ).toBeFocused();
  expect(
    await page.evaluate(
      () => JSON.parse(localStorage.getItem("casezero:progress:v1")!).notes,
    ),
  ).toBe("Changed since the export.");
  await page
    .getByRole("button", { name: "Replace this investigation" })
    .click();
  await expect(page.getByRole("textbox", { name: "Case notes" })).toHaveValue(
    "Exported field notes.",
  );
  await page.getByText("Need a lead?", { exact: true }).click();
  await expect(page.locator(".hint-ladder li")).toHaveCount(1);
  await navigate(page, "Evidence board");
  await expect(
    page.getByRole("button", { name: "Unpin Maintenance slip" }),
  ).toBeVisible();
  await navigate(page, "Case files");
  await page.getByRole("button", { name: "Continue Dead Air" }).click();
  await navigate(page, "Notebook");
  await expect(page.getByRole("textbox", { name: "Case notes" })).toHaveValue(
    "Independent radio notes.",
  );
});
test("foreign, unsupported and oversized imports leave current progress unchanged", async ({
  page,
}) => {
  await begin(page);
  await navigate(page, "Notebook");
  await page
    .getByRole("textbox", { name: "Case notes" })
    .fill("Keep these notes.");
  await page.getByRole("button", { name: "Import investigation" }).click();
  await page.getByText("Paste a backup instead", { exact: true }).click();
  const input = page.getByRole("textbox", { name: "Backup contents" });
  await input.fill(exportBackup(startCase(freshState("dead-air"))));
  await page.getByRole("button", { name: "Review backup" }).click();
  await expect(page.getByRole("status")).toContainText("belongs to Dead Air");
  await input.fill('{"format":"casezero-investigation","version":99}');
  await page.getByRole("button", { name: "Review backup" }).click();
  await expect(page.getByRole("status")).toContainText("not a supported");
  await page.getByLabel("Choose a case backup").setInputFiles({
    name: "large.json",
    mimeType: "application/json",
    buffer: Buffer.alloc(MAX_BACKUP_SIZE + 1, 32),
  });
  await expect(page.getByRole("status")).toContainText("too large");
  await expect(
    page.getByRole("button", { name: "Review backup" }),
  ).toBeDisabled();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("textbox", { name: "Case notes" })).toHaveValue(
    "Keep these notes.",
  );
});
