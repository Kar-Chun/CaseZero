import { test, expect } from "@playwright/test";
import { investigate, submit, navigate } from "./helpers";
import { investigateRadio, submitRadio } from "./radio-helpers";
test("museum alternative proof completes without attendance and reviews actual sources", async ({
  page,
}) => {
  test.setTimeout(90000);
  await investigate(page, true);
  await navigate(page, "Evidence board");
  const question = page
    .locator(".deduction-node")
    .filter({
      has: page.getByRole("heading", {
        name: "The missing minutes",
        exact: true,
      }),
    });
  await question.getByText("Review supporting records").click();
  await expect(
    question.getByRole("button", { name: "Credential trail", exact: true }),
  ).toBeVisible();
  await expect(
    question.getByRole("button", { name: "Atrium attendance", exact: true }),
  ).toHaveCount(0);
  await navigate(page, "Accusation");
  await submit(page);
  await expect(
    page.getByRole("heading", { name: "Case closed." }),
  ).toBeVisible();
  const saved = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("casezero:progress:v1")!),
  );
  expect(saved.evidence).not.toContain("E04");
  expect(saved.proofs.D03).toEqual(["E05", "E07", "E08"]);
});
test("radio physical-record proof completes without collecting the transcript", async ({
  page,
}) => {
  test.setTimeout(90000);
  await investigateRadio(page, true);
  await submitRadio(page);
  await expect(
    page.getByRole("heading", { name: "Case closed." }),
  ).toBeVisible();
  const saved = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("casezero:progress:dead-air:v2")!),
  );
  expect(saved.evidence).not.toContain("E24");
  expect(saved.proofs.D11).toEqual(["E26", "E25"]);
});
