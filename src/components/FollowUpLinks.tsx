import type { GameState } from "@/game/types";
import type { Lead } from "@/game/guidance";
import { followUps } from "@/game/relationships";
import { Icon } from "./Icon";
export function FollowUpLinks({
  state,
  kind,
  sourceId,
  onFollow,
}: {
  state: GameState;
  kind: "evidence" | "deductions";
  sourceId: string;
  onFollow: (lead: Lead) => void;
}) {
  const leads = followUps(state, kind, sourceId);
  if (!leads.length) return null;
  return (
    <aside className="follow-up-links" aria-label="Available follow-up leads">
      <p className="eyebrow">THIS FACT OPENS A QUESTION</p>
      <ul>
        {leads.map((lead) => (
          <li key={`${lead.task}-${lead.id}`}>
            <button className="text-link" onClick={() => onFollow(lead)}>
              {lead.text}
              <Icon name="arrow" size={15} />
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
