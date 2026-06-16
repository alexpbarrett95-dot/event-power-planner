import { useEffect, useState } from "react";
import { CustomDistrosTab } from "@/components/planner/CustomDistrosTab";
import { CustomEquipmentTab } from "@/components/planner/CustomEquipmentTab";
import { DistroEditorTab } from "@/components/planner/DistroEditorTab";
import { DistroOverviewTab } from "@/components/planner/DistroOverviewTab";
import { PowerSourcesTab } from "@/components/planner/PowerSourcesTab";
import { ReportTab } from "@/components/planner/ReportTab";
import { SystemOverviewTab } from "@/components/planner/SystemOverviewTab";
import { ensureAutoSources } from "@/planner/autoSources";
import type { PlannerState } from "@/planner/types";

type PlannerShellProps = {
  plannerState: PlannerState;
  setPlannerState: (state: PlannerState) => void;
};

type PlannerTab =
  | "System Overview"
  | "Power Sources"
  | "Distro Overview"
  | "Distro Editor"
  | "Custom Equipment"
  | "Custom Distros"
  | "Report";

const tabs: PlannerTab[] = [
  "System Overview",
  "Power Sources",
  "Distro Overview",
  "Distro Editor",
  "Custom Equipment",
  "Custom Distros",
  "Report",
];

export function PlannerShell({
  plannerState,
  setPlannerState,
}: PlannerShellProps) {
  const [activeTab, setActiveTab] = useState<PlannerTab>("System Overview");

  useEffect(() => {
    const updatedState = ensureAutoSources(plannerState);

    if (JSON.stringify(updatedState.sources) !== JSON.stringify(plannerState.sources)) {
      setPlannerState(updatedState);
    }
  }, [plannerState, setPlannerState]);

  function openDistroEditor(distroId: string) {
    setPlannerState({
      ...plannerState,
      active: distroId,
    });

    setActiveTab("Distro Editor");
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
      `}</style>
      <section style={styles.shell}>
      <div style={styles.tabs}>
        {tabs.map((tab) => (
          <button
            key={tab}
            style={{
              ...styles.tab,
              ...(activeTab === tab ? styles.activeTab : {}),
            }}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "System Overview" && (
        <SystemOverviewTab
          plannerState={plannerState}
          setPlannerState={setPlannerState}
          openDistroEditor={openDistroEditor}
        />
      )}

      {activeTab === "Power Sources" && (
        <PowerSourcesTab
          plannerState={plannerState}
          setPlannerState={setPlannerState}
        />
      )}

      {activeTab === "Distro Overview" && (
        <DistroOverviewTab
          plannerState={plannerState}
          setPlannerState={setPlannerState}
          openDistroEditor={openDistroEditor}
        />
      )}

      {activeTab === "Distro Editor" && (
        <DistroEditorTab
          plannerState={plannerState}
          setPlannerState={setPlannerState}
          goToDistroOverview={() => setActiveTab("Distro Overview")}
        />
      )}

      {activeTab === "Custom Equipment" && (
        <CustomEquipmentTab
          plannerState={plannerState}
          setPlannerState={setPlannerState}
        />
      )}

      {activeTab === "Custom Distros" && (
        <CustomDistrosTab
          plannerState={plannerState}
          setPlannerState={setPlannerState}
        />
      )}

      {activeTab === "Report" && (
        <ReportTab
          plannerState={plannerState}
          setPlannerState={setPlannerState}
          openDistroEditor={openDistroEditor}
        />
      )}
      </section>
    </>
  );
}

const styles: Record<string, React.CSSProperties> = {
  shell: {
    marginTop: "20px",
    fontFamily: "'Outfit', Arial, sans-serif",
    color: "#111827",
  },
  tabs: {
    display: "flex",
    gap: "4px",
    flexWrap: "wrap",
    marginBottom: "20px",
    padding: "6px",
    background: "#FFFFFF",
    border: "1px solid #DCE5EC",
    borderRadius: "18px",
    boxShadow: "0 10px 30px rgba(17, 24, 39, 0.06)",
  },
  tab: {
    position: "relative",
    padding: "12px 14px",
    borderRadius: "13px",
    border: "1px solid transparent",
    background: "transparent",
    color: "#111827",
    fontWeight: 700,
    cursor: "pointer",
    letterSpacing: "0.01em",
  },
  activeTab: {
    background: "#ececec",
    border: "1px solid #242424",
    boxShadow: "inset 0 -3px 0 #383838",
  },
};
