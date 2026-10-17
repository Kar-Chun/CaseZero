import { expect, type Page } from "@playwright/test";
import { navigate, visit, search, connect, submit } from "./helpers";
export async function beginConservatory(page: Page) {
  await page.goto("/");
  await page.getByRole("button", { name: "Case files", exact: true }).click();
  await page
    .getByRole("button", { name: "Investigate After the Flood" })
    .click();
  await expect(
    page.getByRole("heading", { name: "After the Flood", exact: true }),
  ).toBeFocused();
  await page.getByRole("button", { name: "Enter the conservatory" }).click();
}
export async function investigateConservatory(page: Page) {
  await beginConservatory(page);
  await navigate(page, "Accusation");
  await expect(
    page.getByRole("heading", { name: "Your case is still open." }),
  ).toBeVisible();
  await visit(page, "Propagation Hall");
  for (const [point, title] of [
    ["Alarm recorder", "The high-water alarm"],
    ["Blue waterline", "A color with a source"],
    ["Automatic feed tray", "The dry automatic feed"],
  ])
    await search(page, point, title);
  await visit(page, "Pump House");
  await expect(
    page.getByRole("button", { name: "Search Reconstruction bench" }),
  ).toBeDisabled();
  for (const [point, title] of [
    ["Test completion sheet", "A test that ended"],
    ["Mixing book", "The untimed blue batch"],
    ["Mechanical flow strip", "A fresh turn of the wheel"],
  ])
    await search(page, point, title);
  await page
    .getByRole("button", { name: "Search Reconstruction bench" })
    .click();
  for (const [i, id] of ["V3", "V3", "V4", "V2"].entries())
    await page.getByLabel(`Position ${i + 1}`).selectOption(id);
  await expect(page.getByRole("status")).toContainText("more than once");
  await expect(
    page.getByRole("button", { name: "Test reconstruction" }),
  ).toBeDisabled();
  await page.getByLabel("Position 2").selectOption("V4");
  await page.getByLabel("Position 3").selectOption("V1");
  await page.getByRole("button", { name: "Test reconstruction" }).click();
  await expect(page.getByRole("status")).toContainText(
    "conflicts with the original records",
  );
  await page.getByLabel("Position 2").selectOption("V1");
  await page.getByLabel("Position 3").selectOption("V4");
  await page.getByRole("button", { name: "Test reconstruction" }).click();
  await expect(
    page.getByRole("dialog", { name: "The second flow", exact: true }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await page.reload();
  await page.getByRole("button", { name: "Continue investigation" }).click();
  await visit(page, "Pump House");
  await expect(
    page.getByRole("button", { name: "Inspect The second flow", exact: true }),
  ).toBeVisible();
  await visit(page, "Potting Studio");
  await search(page, "Camera archive", "Three continuous accounts");
  await expect(
    page.getByRole("button", { name: "Search Enclosure counterfoil" }),
  ).toBeDisabled();
  await expect(
    page.getByRole("button", { name: "Search Sealed audit cupboard" }),
  ).toBeDisabled();
  await navigate(page, "Interviews");
  for (const [person, question] of [
    ["Dr. Elin March", "What do you think caused the flood?"],
    ["Noor Hale", "Why did you argue with Elin?"],
    ["Tomas Reed", "Did your test remain open?"],
    ["Vera Quinn", "Did you threaten to withdraw the endowment?"],
  ]) {
    await page.getByRole("button", { name: new RegExp(person) }).click();
    await page.getByRole("button", { name: question, exact: true }).click();
  }
  await page.getByRole("button", { name: /Dr. Elin March/ }).click();
  await page
    .getByRole("button", {
      name: "Who visited the enclosure before the new flow?",
    })
    .click();
  await page.getByRole("button", { name: "Visit Potting Studio" }).click();
  await search(page, "Enclosure counterfoil", "The label errand");
  await navigate(page, "Interviews");
  await page.getByRole("button", { name: /Noor Hale/ }).click();
  await page
    .getByRole("button", {
      name: "Did any trial records survive the blue water?",
    })
    .click();
  await page.getByRole("button", { name: "Visit Potting Studio" }).click();
  await search(page, "Duplicate-set register", "Results before the water");
  await visit(page, "Director’s Office");
  for (const [point, title] of [
    ["Donor correspondence", "A threat without a withdrawal"],
    ["Signed trial report", "The promised result"],
    ["Advance agreement", "The price of a false result"],
  ])
    await search(page, point, title);
  await connect(page, ["Three continuous accounts", "The label errand"]);
  await expect(page.getByRole("status")).toContainText("earlier conclusion");
  await connect(page, [
    "A color with a source",
    "The dry automatic feed",
    "A fresh turn of the wheel",
  ]);
  await expect(page.getByRole("status")).toContainText(
    "Choose the explanation",
  );
  await page
    .getByRole("radio", {
      name: "A sensor fault delivered water through the automatic feed.",
    })
    .check();
  await page.getByRole("button", { name: "Test connection" }).click();
  await expect(page.getByRole("status")).toContainText("does not account");
  await expect(
    page.getByRole("button", { name: "Unpin A fresh turn of the wheel" }),
  ).toBeVisible();
  await page
    .getByRole("radio", {
      name: "Someone operated the local manual bypass to deliver the blue water.",
    })
    .check();
  await page.getByRole("button", { name: "Test connection" }).click();
  await expect(page.getByRole("status")).toContainText(
    "fresh local manual-bypass flow",
  );
  await connect(
    page,
    ["A test that ended", "The untimed blue batch", "The second flow"],
    "A second opening followed the completed test and tracer addition.",
  );
  await expect(page.getByRole("status")).toContainText("separate operation");
  await connect(
    page,
    ["Three continuous accounts", "The label errand"],
    "The sole enclosure visitor had the opportunity; the other three were continuously elsewhere.",
  );
  await expect(page.getByRole("status")).toContainText(
    "Elin was the sole enclosure visitor",
  );
  await connect(
    page,
    [
      "Results before the water",
      "The promised result",
      "The price of a false result",
    ],
    "Destroying contradictory material could delay exposure of a false report and personal repayment.",
  );
  await expect(page.getByRole("status")).toContainText("£18,000");
  await navigate(page, "Accusation");
  await page
    .getByRole("button", { name: "Secure the surviving audit set" })
    .click();
  await search(page, "Sealed audit cupboard", "The surviving audit set");
  await navigate(page, "Accusation");
  await expect(
    page.getByRole("heading", { name: "Who staged the accident?" }),
  ).toBeVisible();
}
export async function submitConservatory(page: Page, suspect = "S21") {
  await submit(page, suspect, "M22", "R23", {
    method: "How was the flood caused?",
    motive: "Why destroy the trial?",
  });
}
