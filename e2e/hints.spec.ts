import { test, expect } from "@playwright/test";
import { navigate, visit, search, connect } from "./helpers";
import { beginRadio } from "./radio-helpers";
async function beginMuseum(page: import("@playwright/test").Page) {
  await page.goto("/");
  await page.getByRole("button", { name: "Explore the case" }).click();
  await page.getByRole("button", { name: "Begin investigation" }).click();
  await page.getByRole("button", { name: "Enter the museum" }).click();
}
test("optional hint stages survive refresh and follow the revealed lead", async ({
  page,
}) => {
  await beginMuseum(page);
  await navigate(page, "Notebook");
  await page.getByText("Need a lead?", { exact: true }).click();
  await page.getByRole("button", { name: "Reveal a gentle hint" }).click();
  await expect(page.locator(".hint-ladder li")).toHaveCount(1);
  await expect(page.locator(".hint-ladder")).not.toContainText(
    "display pedestal",
  );
  await page.getByRole("button", { name: "Make it clearer" }).click();
  await page.getByRole("button", { name: "Show a specific lead" }).click();
  await page.reload();
  await page.getByRole("button", { name: "Continue investigation" }).click();
  await navigate(page, "Notebook");
  await page.getByText("Need a lead?", { exact: true }).click();
  await expect(page.locator(".hint-ladder li")).toHaveCount(3);
  await page.getByRole("button", { name: "Follow this lead" }).click();
  await expect(
    page.getByRole("button", { name: "Search Display pedestal" }),
  ).toBeVisible();
});
test("failed threads remain pinned across views and refresh; evidence search and focus work", async ({
  page,
}) => {
  await beginMuseum(page);
  await visit(page, "The Grand Gallery");
  await search(page, "Display pedestal", "Maintenance slip");
  await search(page, "Abandoned champagne table", "A patron’s offer");
  await visit(page, "Security Office");
  await search(page, "Power meter", "Unbroken power");
  await connect(page, [
    "Maintenance slip",
    "A patron’s offer",
    "Unbroken power",
  ]);
  await expect(page.getByRole("status")).toContainText("do not establish");
  await expect(
    page.getByRole("button", { name: "Unpin Maintenance slip" }),
  ).toHaveAttribute("aria-pressed", "true");
  await navigate(page, "Notebook");
  await navigate(page, "Evidence board");
  await expect(
    page.getByRole("button", { name: "Unpin Maintenance slip" }),
  ).toBeVisible();
  await page.reload();
  await page.getByRole("button", { name: "Continue investigation" }).click();
  await navigate(page, "Evidence board");
  await expect(
    page.getByRole("button", { name: "Unpin Maintenance slip" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Focus The silent window" }).click();
  await expect(
    page.getByRole("button", { name: "Focus The silent window" }),
  ).toHaveAttribute("aria-pressed", "true");
  await page
    .getByRole("searchbox", { name: "Search collected evidence" })
    .fill("power");
  await expect(
    page.getByRole("button", { name: "Read Unbroken power" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Read Maintenance slip" }),
  ).toHaveCount(0);
});
test("analysis hints explain the clock without an immediate answer", async ({
  page,
}) => {
  await beginRadio(page);
  await visit(page, "Control Room");
  await search(page, "Queue printer", "The queue print");
  await search(page, "Calibration card", "Two clocks, one pulse");
  await search(page, "Broadcast transcript", "The false warning");
  await visit(page, "Equipment Room");
  await search(page, "Reserve input rack", "The selected input");
  await connect(page, ["The false warning", "The selected input"]);
  await navigate(page, "Notebook");
  await page.getByText("Need a lead?", { exact: true }).click();
  await page.getByRole("button", { name: "Reveal a gentle hint" }).click();
  await expect(page.locator(".hint-ladder")).toContainText("different clocks");
  await expect(page.locator(".hint-ladder")).not.toContainText("22:06");
  await page.getByRole("button", { name: "Make it clearer" }).click();
  await page.getByRole("button", { name: "Show a specific lead" }).click();
  await page.getByRole("button", { name: "Follow this lead" }).click();
  await page
    .getByRole("button", { name: "Search Clock comparison desk" })
    .click();
  await expect(page.getByLabel("Insertion in network time")).toBeVisible();
});
