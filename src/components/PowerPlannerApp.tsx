import { PlannerShell } from "@/components/planner/PlannerShell";
import type { PlannerState } from "@/planner/types";

type PowerPlannerAppProps = {
  plannerState: PlannerState;
  setPlannerState: (state: PlannerState) => void;
};

export function PowerPlannerApp({
  plannerState,
  setPlannerState,
}: PowerPlannerAppProps) {
  return (
    <PlannerShell
      plannerState={plannerState}
      setPlannerState={setPlannerState}
    />
  );
}