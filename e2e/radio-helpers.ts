import { expect, type Page } from "@playwright/test";
import { navigate, visit, search, connect, submit } from "./helpers";
export async function beginRadio(page: Page) {
  await page.goto("/");
  await page.getByRole("button", { name: "Explore the case" }).click();
  await page.getByRole("button", { name: "Investigate Dead Air" }).click();
  await expect(page.getByRole("heading", { name: "Dead Air" })).toBeFocused();
  await page.getByRole("button", { name: "Enter the station" }).click();
}
export async function investigateRadio(page: Page) {
  await beginRadio(page);
  await navigate(page, "Accusation");
  await expect(
    page.getByRole("heading", { name: "Your case is still open." }),
  ).toBeVisible();
  await visit(page, "Control Room");
  await search(page, "Queue printer", "The queue print");
  await search(page, "Calibration card", "Two clocks, one pulse");
  await page
    .getByRole("button", { name: "Search Clock comparison desk" })
    .click();
  await expect(
    page.getByRole("dialog", { name: "Calibrate the missing minutes" }),
  ).toBeVisible();
  await page.getByLabel("Insertion in network time").fill("22:20");
  await page.getByRole("button", { name: "Check corrected time" }).click();
  await expect(page.getByRole("status")).toContainText(
    "does not match the calibration",
  );
  await page.getByLabel("Insertion in network time").fill("22:06");
  await page.getByRole("button", { name: "Check corrected time" }).click();
  await expect(
    page.getByRole("dialog", { name: "The corrected insertion" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await search(page, "Broadcast transcript", "The false warning");
  await visit(page, "Equipment Room");
  for (const [point, title] of [
    ["Reserve input rack", "The selected input"],
    ["Isolated cartridge tray", "The U4 splice"],
    ["Synchronized recorder", "The earlier alibis"],
  ])
    await search(page, point, title);
  await visit(page, "Donor Lounge");
  for (const [point, title] of [
    ["Telephone receipt", "A genuine, late alibi"],
    ["Trial contract folder", "The canceled trial"],
    ["Repair notice", "An engineer’s warning"],
  ])
    await search(page, point, title);
  await visit(page, "Newsroom");
  await search(page, "Weather desk copy", "The channel-open original");
  await expect(
    page.getByRole("button", { name: "Search Contract comparison table" }),
  ).toBeDisabled();
  await navigate(page, "Interviews");
  for (const [person, question] of [
    ["Iris Bell", "What was supposed to air at 22:14?"],
    ["Owen Pike", "Could the live line have carried the warning?"],
    ["Celia Ward", "Where were you when the warning aired?"],
    ["Kit Mercer", "Why did you criticize the ferry trial?"],
  ]) {
    await page.getByRole("button", { name: new RegExp(person) }).click();
    await page.getByRole("button", { name: question, exact: true }).click();
  }
  await page.getByRole("button", { name: /Iris Bell/ }).click();
  await page
    .getByRole("button", { name: "Who had access to the reserve cartridge?" })
    .click();
  await page.getByRole("button", { name: "Visit Equipment Room" }).click();
  await search(page, "Cartridge custody folder", "A sponsor’s cartridge");
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
  await page
    .getByRole("radio", { name: "The inspection fee is a fixed £850." })
    .check();
  await page
    .getByRole("radio", { name: "Inspection fee: £850, payable monthly." })
    .check();
  await page.getByRole("button", { name: "Test contradiction" }).click();
  await expect(page.getByRole("status")).toContainText(
    "do not directly contradict",
  );
  await page
    .getByRole("radio", {
      name: "The standby payment requires an independent harbor-master closure.",
    })
    .check();
  await page
    .getByRole("radio", {
      name: "£80,000 credit on any canceled 22:20 public trial, whatever the cause.",
    })
    .check();
  await page.getByRole("button", { name: "Test contradiction" }).click();
  await expect(
    page.getByRole("dialog", { name: "The rider’s real trigger" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await connect(page, [
    "The U4 splice",
    "A sponsor’s cartridge",
    "The earlier alibis",
  ]);
  await expect(page.getByRole("status")).toContainText(
    "needs an earlier conclusion",
  );
  await connect(page, ["The false warning", "The selected input"]);
  await expect(page.getByRole("status")).toContainText("prepared recording");
  await connect(page, ["The corrected insertion", "A genuine, late alibi"]);
  await expect(page.getByRole("status")).toContainText("22:06");
  await connect(page, [
    "The U4 splice",
    "A sponsor’s cartridge",
    "The earlier alibis",
  ]);
  await expect(page.getByRole("status")).toContainText("issued to Celia");
  await connect(page, [
    "The canceled trial",
    "The channel-open original",
    "The rider’s real trigger",
  ]);
  await expect(page.getByRole("status")).toContainText("£80,000");
  await navigate(page, "Accusation");
  await page
    .getByRole("button", { name: "Secure the original cartridge" })
    .click();
  await search(
    page,
    "Original media custody station",
    "The preserved original",
  );
  await navigate(page, "Accusation");
  await expect(
    page.getByRole("heading", { name: "Who planted the bulletin?" }),
  ).toBeVisible();
}
export async function submitRadio(page: Page, suspect = "S13") {
  await submit(page, suspect, "M12", "R12", {
    method: "How was it done?",
    motive: "Why was it done?",
  });
}
