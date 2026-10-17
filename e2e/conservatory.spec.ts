import { test, expect } from "@playwright/test";
import { navigate } from "./helpers";
import {
  investigateConservatory,
  submitConservatory,
} from "./conservatory-helpers";
test("After the Flood completes reconstruction, supported explanations, final proof and restored correct ending", async ({
  page,
}) => {
  test.setTimeout(90000);
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  await investigateConservatory(page);
  await submitConservatory(page);
  await expect(
    page.getByRole("heading", { name: "Case closed." }),
  ).toBeFocused();
  await expect(page.getByText(/Elin March cannot reconcile/)).toBeVisible();
  await page.reload();
  await page.getByRole("button", { name: "Continue investigation" }).click();
  await expect(
    page.getByRole("heading", { name: "Case closed." }),
  ).toBeVisible();
  await navigate(page, "Case files");
  await expect(
    page.getByRole("article", { name: "After the Flood case file" }),
  ).toContainText("CASE CLOSED");
  expect(errors).toEqual([]);
});
test("After the Flood unsupported accusation keeps all records for a correct retry", async ({
  page,
}) => {
  test.setTimeout(90000);
  await investigateConservatory(page);
  await submitConservatory(page, "S23");
  await expect(
    page.getByRole("heading", { name: "Not yet proven." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Return to investigation" }).click();
  await navigate(page, "Accusation");
  await submitConservatory(page);
  await expect(
    page.getByRole("heading", { name: "Case closed." }),
  ).toBeVisible();
});
