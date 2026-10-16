import { test, expect } from "@playwright/test";
import { navigate, visit, search } from "./helpers";
import { investigateRadio, submitRadio } from "./radio-helpers";
test("Dead Air plays through both analyses, mixed-size deductions and a restored correct ending", async ({
  page,
}) => {
  test.setTimeout(90000);
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  await investigateRadio(page);
  await submitRadio(page);
  await expect(
    page.getByRole("heading", { name: "Case closed." }),
  ).toBeVisible();
  await expect(
    page.getByText(/Celia Ward’s telephone alibi is genuine/),
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
  expect(errors).toEqual([]);
});
test("Dead Air unsupported verdict preserves all findings for a correct retry", async ({
  page,
}) => {
  test.setTimeout(90000);
  await investigateRadio(page);
  await submitRadio(page, "S11");
  await expect(
    page.getByRole("heading", { name: "Not yet proven." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Return to investigation" }).click();
  await navigate(page, "Accusation");
  await submitRadio(page);
  await expect(
    page.getByRole("heading", { name: "Case closed." }),
  ).toBeVisible();
});
test("case switching, refresh and replay keep the other investigation intact", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Explore the case" }).click();
  await page.getByRole("button", { name: "Begin investigation" }).click();
  await page.getByRole("button", { name: "Enter the museum" }).click();
  await visit(page, "The Grand Gallery");
  await search(page, "Display pedestal", "Maintenance slip");
  await navigate(page, "Notebook");
  await page
    .getByRole("textbox", { name: "Case notes" })
    .fill("Museum notes stay here.");
  await navigate(page, "Case files");
  await page.getByRole("button", { name: "Investigate Dead Air" }).click();
  await page.getByRole("button", { name: "Enter the station" }).click();
  await visit(page, "Control Room");
  await search(page, "Queue printer", "The queue print");
  await navigate(page, "Notebook");
  await page
    .getByRole("textbox", { name: "Case notes" })
    .fill("Radio notes stay separate.");
  await page.reload();
  await page.getByRole("button", { name: "Continue investigation" }).click();
  await navigate(page, "Notebook");
  await expect(page.getByRole("textbox", { name: "Case notes" })).toHaveValue(
    "Radio notes stay separate.",
  );
  await navigate(page, "Case files");
  await page
    .getByRole("button", { name: "Continue saved investigation" })
    .click();
  await navigate(page, "Notebook");
  await expect(page.getByRole("textbox", { name: "Case notes" })).toHaveValue(
    "Museum notes stay here.",
  );
  await expect(
    page.getByRole("button", { name: /E01 Maintenance slip/ }),
  ).toBeVisible();
  await navigate(page, "Case files");
  await page.getByRole("button", { name: "Replay Dead Air" }).click();
  await page.getByRole("button", { name: "Start new game" }).click();
  await page.getByRole("button", { name: "Enter the station" }).click();
  await navigate(page, "Notebook");
  await expect(page.getByRole("textbox", { name: "Case notes" })).toHaveValue(
    "",
  );
  await navigate(page, "Case files");
  await page
    .getByRole("button", { name: "Continue saved investigation" })
    .click();
  await navigate(page, "Notebook");
  await expect(page.getByRole("textbox", { name: "Case notes" })).toHaveValue(
    "Museum notes stay here.",
  );
});
