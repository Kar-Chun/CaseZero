import { test, expect } from "@playwright/test";
import { investigate, submit, navigate } from "./helpers";
test("complete logical investigation reaches the correct ending and replay", async ({
  page,
}) => {
  test.setTimeout(90000);
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  await investigate(page);
  await submit(page);
  await expect(
    page.getByRole("heading", { name: "Case closed." }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.reload();
  await page.getByRole("button", { name: "Continue investigation" }).click();
  await expect(
    page.getByRole("heading", { name: "Case closed." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Play again" }).click();
  await expect(
    page.getByRole("dialog", { name: "Start a new investigation?" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Start new game" }).click();
  await page.getByRole("button", { name: "Enter the museum" }).click();
  await navigate(page, "Evidence board");
  await expect(
    page.getByRole("heading", { name: "The first thread begins with a clue." }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});
test("incorrect accusation preserves investigation for a successful retry", async ({
  page,
}) => {
  test.setTimeout(90000);
  await investigate(page);
  await submit(page, "S02");
  await expect(
    page.getByRole("heading", { name: "Not yet proven." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Return to investigation" }).click();
  await navigate(page, "Accusation");
  await submit(page);
  await expect(
    page.getByRole("heading", { name: "Case closed." }),
  ).toBeVisible();
});
