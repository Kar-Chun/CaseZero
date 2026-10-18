import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { it, expect } from "vitest";
import { Interviews } from "../src/components/Interviews";
import { answer, discover, freshState, startCase } from "../src/game/engine";
it("shows evidence-dependent questions, records the answer, and exposes a real new search lead", async () => {
  const follow: string[] = [];
  function Harness() {
    const [state, setState] = useState(startCase(freshState()));
    return (
      <>
        <button onClick={() => setState((s) => discover(s, "E05"))}>
          Find log
        </button>
        <Interviews
          state={state}
          onAnswer={(id) => setState((s) => answer(s, id))}
          onFollow={(id) => follow.push(id)}
        />
      </>
    );
  }
  const user = userEvent.setup();
  render(<Harness />);
  await user.click(screen.getByRole("button", { name: /Theo Shaw/ }));
  const question = screen.getByRole("button", {
    name: "Who held credential C3 tonight?",
  });
  expect(question).toBeDisabled();
  await user.click(screen.getByRole("button", { name: "Find log" }));
  expect(question).toBeEnabled();
  await user.click(question);
  expect(
    screen.getByText(/Mara signed for it at five past/, {
      selector: "blockquote",
    }),
  ).toBeVisible();
  await user.click(
    screen.getByRole("button", { name: "Visit Security Office" }),
  );
  expect(follow).toEqual(["L02"]);
  expect(screen.getByText("Interview record (1)")).toBeVisible();
});
it("distinguishes a recorded claim from an evidence-supported conflict and opens its source", async () => {
  const user = userEvent.setup();
  const sources: string[] = [];
  const heard = answer(startCase(freshState()), "T01");
  const props = {
    onAnswer: () => {},
    onFollow: () => {},
    onInspect: (id: string) => sources.push(id),
  };
  const { rerender } = render(<Interviews state={heard} {...props} />);
  await user.click(
    screen.getByRole("button", {
      name: "Where were you when the seal vanished?",
    }),
  );
  expect(screen.queryByText("CONFLICT WITH RECORDS")).not.toBeInTheDocument();
  rerender(<Interviews state={discover(heard, "E04")} {...props} />);
  expect(screen.getByText("CONFLICT WITH RECORDS")).toBeVisible();
  await user.click(screen.getByRole("button", { name: "Atrium attendance" }));
  expect(sources).toEqual(["E04"]);
});
