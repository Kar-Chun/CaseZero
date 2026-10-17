import { expect, type Page } from "@playwright/test";
export async function navigate(page: Page, name: string) {
  await page
    .getByRole("navigation", { name: "Investigation navigation" })
    .getByRole("button", { name, exact: true })
    .click();
}
export async function visit(page: Page, name: string) {
  await navigate(page, "Locations");
  const back = page.getByRole("button", {
    name: /^(Museum|Station|Conservatory) map$/,
  });
  if (await back.isVisible()) await back.click();
  await page.getByRole("button", { name: new RegExp(name) }).click();
}
export async function search(page: Page, point: string, title: string) {
  await page
    .getByRole("button", { name: `Search ${point}`, exact: true })
    .click();
  await expect(
    page.getByRole("dialog", { name: title, exact: true }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
}
export async function connect(
  page: Page,
  titles: string[],
  explanation?: string,
) {
  await navigate(page, "Evidence board");
  const clear = page.getByRole("button", { name: "Clear", exact: true });
  if (await clear.isEnabled()) await clear.click();
  for (const title of titles)
    await page
      .getByRole("button", { name: `Pin ${title}`, exact: true })
      .click();
  if (explanation)
    await page.getByRole("radio", { name: explanation, exact: true }).check();
  await page.getByRole("button", { name: "Test connection" }).click();
}
export async function investigate(page: Page) {
  await page.goto("/");
  await page.getByRole("button", { name: "Explore the case" }).click();
  await page.getByRole("button", { name: "Begin investigation" }).click();
  await page.getByRole("button", { name: "Enter the museum" }).click();
  await navigate(page, "Accusation");
  await expect(
    page.getByRole("heading", { name: "Your case is still open." }),
  ).toBeVisible();
  await visit(page, "The Grand Gallery");
  for (const [point, title] of [
    ["Display pedestal", "Maintenance slip"],
    ["Sensor housing", "Silent sensor"],
    ["Abandoned champagne table", "A patron’s offer"],
    ["Usher’s station", "Atrium attendance"],
  ])
    await search(page, point, title);
  await visit(page, "Security Office");
  for (const [point, title] of [
    ["Access terminal", "Credential trail"],
    ["Power meter", "Unbroken power"],
    ["Video archive", "Three verified alibis"],
  ])
    await search(page, point, title);
  await navigate(page, "Interviews");
  for (const [person, question] of [
    ["Mara Voss", "Where were you when the seal vanished?"],
    ["Anton Vale", "Tell me about your evening."],
    ["Elise Ren", "What were you doing at 21:12?"],
    ["Theo Shaw", "Why did you leave your post?"],
  ]) {
    await page.getByRole("button", { name: new RegExp(person) }).click();
    await page.getByRole("button", { name: question, exact: true }).click();
  }
  await page
    .getByRole("button", { name: "Who held credential C3 tonight?" })
    .click();
  await page.getByRole("button", { name: "Visit Security Office" }).click();
  await search(page, "Custody envelope", "Card custody receipt");
  await visit(page, "Conservation Workshop");
  for (const [point, title] of [
    ["Dust beside the store", "A broken-wheel trail"],
    ["Workbench photograph", "The prepared trolley"],
    ["Unopened envelope", "Overdue balance"],
  ])
    await search(page, point, title);
  await navigate(page, "Interviews");
  await page.getByRole("button", { name: /Elise Ren/ }).click();
  await page
    .getByRole("button", { name: "Where did the damaged trolley go?" })
    .click();
  await page
    .getByRole("button", { name: "Visit Conservation Workshop" })
    .click();
  await search(page, "Store inventory drawer", "Crate K17 entry");
  await visit(page, "Museum Archive");
  await search(page, "Trustee minutes", "A suppressed history");
  await search(page, "Oral-history collection", "A remembered seal");
  await connect(page, [
    "Maintenance slip",
    "A patron’s offer",
    "Overdue balance",
  ]);
  await expect(page.getByRole("status")).toContainText(
    "do not establish a complete conclusion",
  );
  await connect(page, [
    "Maintenance slip",
    "Credential trail",
    "Unbroken power",
  ]);
  await expect(page.getByRole("status")).toContainText("C3 opened the display");
  await connect(page, [
    "A broken-wheel trail",
    "The prepared trolley",
    "Crate K17 entry",
  ]);
  await expect(page.getByRole("status")).toContainText("Crate K17");
  await connect(page, [
    "Atrium attendance",
    "Three verified alibis",
    "Card custody receipt",
  ]);
  await expect(page.getByRole("status")).toContainText(
    "documented opportunity",
  );
  await visit(page, "Museum Archive");
  await search(page, "Sealed dispatch copy", "The morning destination");
  await connect(page, [
    "A suppressed history",
    "A remembered seal",
    "The morning destination",
  ]);
  await expect(page.getByRole("status")).toContainText("restitution escrow");
  await navigate(page, "Accusation");
  await page
    .getByRole("button", { name: "Search the conservation store" })
    .click();
  await search(page, "Crate K17", "The recovered seal");
  await navigate(page, "Accusation");
  await expect(
    page.getByRole("heading", { name: "Who took the seal?" }),
  ).toBeVisible();
}
export async function submit(
  page: Page,
  suspect = "S01",
  method = "M02",
  motive = "R03",
  labels = { method: "How was it taken?", motive: "Why was it taken?" },
) {
  await page.getByLabel("Person of interest").selectOption(suspect);
  await page.getByLabel(labels.method).selectOption(method);
  await page.getByLabel(labels.motive).selectOption(motive);
  await page.getByRole("button", { name: "Review accusation" }).click();
  await expect(
    page.getByRole("heading", { name: "Check your reasoning." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Submit accusation" }).click();
}
