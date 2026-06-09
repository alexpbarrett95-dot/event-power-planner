import type { PlannerState } from "@/types/project";

type PowerPlannerAppProps = {
  plannerState: PlannerState;
  setPlannerState: (state: PlannerState) => void;
};

export function PowerPlannerApp({
  plannerState,
  setPlannerState,
}: PowerPlannerAppProps) {
  function updateSystemName(value: string) {
    setPlannerState({
      ...plannerState,
      systemName: value,
    });
  }

  return (
    <section style={styles.appShell}>
      <h2>Power Planning App</h2>

      <p style={styles.muted}>
        This is the container where the original HTML planner will be migrated.
        All changes made here will save into the project JSON.
      </p>

      <label style={styles.label}>
        System Name
        <input
          style={styles.input}
          value={plannerState.systemName}
          onChange={(event) => updateSystemName(event.target.value)}
        />
      </label>

      <pre style={styles.debugBox}>
        {JSON.stringify(plannerState, null, 2)}
      </pre>
    </section>
  );
}

const styles: Record<string, React.CSSProperties> = {
  appShell: {
    marginTop: "20px",
    padding: "20px",
    border: "1px solid #d9e0ea",
    borderRadius: "14px",
    background: "#f8fafc",
  },
  muted: {
    color: "#637083",
  },
  label: {
    display: "block",
    marginTop: "16px",
    marginBottom: "16px",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginTop: "6px",
    borderRadius: "10px",
    border: "1px solid #d9e0ea",
  },
  debugBox: {
    marginTop: "20px",
    padding: "14px",
    borderRadius: "10px",
    background: "#111827",
    color: "white",
    overflow: "auto",
    fontSize: "12px",
  },
};