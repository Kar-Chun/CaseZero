import type { Deduction } from "@/game/types";
export function ExplanationChoice({
  question,
  value,
  onChange,
  disabled,
}: {
  question: Deduction;
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}) {
  return (
    <fieldset className="explanation-choice" disabled={disabled}>
      <legend>What do these records establish?</legend>
      <h3>{question.title}</h3>
      <p>
        Choose the explanation supported by every selected record. Compare the
        original files if you need to reconsider.
      </p>
      {question.interpretations?.map((option) => (
        <label
          key={option.id}
          className={
            value === option.id
              ? "comparison-choice chosen-choice"
              : "comparison-choice"
          }
        >
          <input
            type="radio"
            name={`explanation-${question.id}`}
            value={option.id}
            checked={value === option.id}
            onChange={() => onChange(option.id)}
          />
          <span>{option.label}</span>
        </label>
      ))}
    </fieldset>
  );
}
