import { test, expect } from "@playwright/test";
import { investigate, submit, navigate } from "./helpers";
import { investigateRadio, submitRadio } from "./radio-helpers";
test("museum alternative proof completes without attendance and reviews actual sources", async ({
  page,
}) => {
  test.setTimeout(90000);
  await investigate(page, true);
  await navigate(page, "Evidence board");
  const question = page.locator(".deduction-node").filter({
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

test("reasoning review, overlooked leads and replay cancellation preserve an alternative case", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 320, height: 800 });
  const { solveCase } = await import("../tests/helpers");
  const { combine, accuse } = await import("../src/game/engine");
  const solved = combine(solveCase(), ["E05", "E07", "E08"]).state;
  const state = accuse(
    { ...solved, evidence: solved.evidence.filter((id) => id !== "E04") },
    { suspect: "S01", method: "M02", motive: "R03" },
  );
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Case files", exact: true }),
  ).toBeEnabled();
  await page.evaluate(
    (s) => localStorage.setItem("casezero:progress:v1", JSON.stringify(s)),
    state,
  );
  await page.reload();
  await page.getByRole("button", { name: "Continue investigation" }).click();
  await page.getByText("Review your reasoning", { exact: true }).click();
  const review = page.locator(".case-debrief");
  await expect(
    review.getByText(
      "Supported by: Credential trail · Three verified alibis · Card custody receipt",
    ),
  ).toBeVisible();
  await page.getByText("Overlooked leads (1)").click();
  await expect(
    review.getByText("Usher’s station · The Grand Gallery"),
  ).toBeVisible();
  const { default: AxeBuilder } = await import("@axe-core/playwright");
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "Play again" }).click();
  await expect(
    page.getByRole("dialog", { name: "Start a new investigation?" }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Play again" })).toBeFocused();
  expect(
    await page.evaluate(() =>
      JSON.parse(localStorage.getItem("casezero:progress:v1")!),
    ),
  ).toEqual(state);
  await page.getByRole("button", { name: "Reopen investigation" }).click();
  await expect(
    page.getByRole("heading", { name: "Your investigation board" }),
  ).toBeFocused();
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
  await page.reload();
  await page.getByRole("button", { name: "Continue investigation" }).click();
  const resumed = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("casezero:progress:v1")!),
  );
  expect(resumed).toEqual({ ...state, accusation: null });
});

test("different-case tabs retain their own investigation after refresh", async ({
  page,
  context,
}) => {
  const { solveCase, solveRadio } = await import("../tests/helpers");
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Case files", exact: true }),
  ).toBeEnabled();
  await page.evaluate(
    (states) => {
      localStorage.setItem("casezero:progress:v1", JSON.stringify(states[0]));
      localStorage.setItem(
        "casezero:progress:dead-air:v2",
        JSON.stringify(states[1]),
      );
    },
    [solveCase(), solveRadio()],
  );
  await page.reload();
  await page.getByRole("button", { name: "Continue investigation" }).click();
  const other = await context.newPage();
  await other.goto("/");
  await other.getByRole("button", { name: "Case files", exact: true }).click();
  await other
    .getByRole("button", { name: "Continue Dead Air", exact: true })
    .click();
  await page.reload();
  await page.getByRole("button", { name: "Continue investigation" }).click();
  await expect(
    page.getByRole("heading", { name: "The Quiet Hour", exact: true }),
  ).toBeVisible();
  await other.reload();
  await other.getByRole("button", { name: "Continue investigation" }).click();
  await expect(
    other.getByRole("heading", { name: "Dead Air", exact: true }),
  ).toBeVisible();
  await other.close();
});

test("statement checks in each case support keyboard source review and narrow-screen accessibility", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 320, height: 800 });
  const { solveCase, solveRadio, solveConservatory } =
    await import("../tests/helpers");
  const { saveKey } = await import("../src/game/storage");
  const { default: AxeBuilder } = await import("@axe-core/playwright");
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "Case files", exact: true }),
  ).toBeEnabled();
  await page.evaluate(
    (entries) => {
      for (const [key, s] of entries) localStorage.setItem(key, s);
    },
    [solveCase(), solveRadio(), solveConservatory()].map((s) => [
      saveKey(s.caseId),
      JSON.stringify(s),
    ]),
  );
  await page.reload();
  for (const [entry, person, question, badge, source] of [
    [
      "Continue investigation",
      "Mara Voss",
      "Where were you when the seal vanished?",
      "CONFLICT WITH RECORDS",
      "Atrium attendance",
    ],
    [
      "Continue Dead Air",
      "Celia Ward",
      "Where were you when the warning aired?",
      "LIMITED SCOPE",
      "The corrected insertion",
    ],
    [
      "Continue After the Flood",
      "Dr. Elin March",
      "What do you think caused the flood?",
      "CONFLICT WITH RECORDS",
      "The dry automatic feed",
    ],
  ]) {
    await page.getByRole("button", { name: entry, exact: true }).click();
    await navigate(page, "Interviews");
    await page.getByRole("button", { name: new RegExp(person) }).click();
    await page.getByRole("button", { name: question, exact: true }).click();
    const check = page.locator(".statement-review");
    await expect(check.getByText(badge)).toBeVisible();
    expect(
      (
        await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
          .analyze()
      ).violations,
    ).toEqual([]);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const button = check.getByRole("button", { name: source, exact: true });
    await button.focus();
    await page.keyboard.press("Enter");
    await expect(
      page.getByRole("dialog", { name: source, exact: true }),
    ).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(button).toBeFocused();
    await navigate(page, "Case files");
  }
});
