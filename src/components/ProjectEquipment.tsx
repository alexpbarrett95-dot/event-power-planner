import type {
  EquipmentItem,
  ProjectEquipmentItem,
} from "@/types/equipment";

type ProjectEquipmentProps = {
  equipment: EquipmentItem[];
  projectEquipment: ProjectEquipmentItem[];
  addEquipmentToProject: (equipmentId: string) => void;
  updateProjectEquipmentQuantity: (id: string, quantity: number) => void;
  updateProjectEquipmentNotes: (id: string, notes: string) => void;
  deleteProjectEquipment: (id: string) => void;
};

export function ProjectEquipment({
  equipment,
  projectEquipment,
  addEquipmentToProject,
  updateProjectEquipmentQuantity,
  updateProjectEquipmentNotes,
  deleteProjectEquipment,
}: ProjectEquipmentProps) {
  const totalWatts = projectEquipment.reduce((total, projectItem) => {
    const libraryItem = equipment.find(
      (item) => item.id === projectItem.equipment_library_id
    );

    return total + (libraryItem?.watts ?? 0) * projectItem.quantity;
  }, 0);

  return (
    <section style={styles.card}>
      <h2>Project Equipment</h2>
      <p style={styles.muted}>
        Add equipment from the library to this project.
      </p>

      <div style={styles.summaryBox}>
        <strong>Total Connected Equipment Load</strong>
        <span>{totalWatts.toLocaleString()} W</span>
      </div>

      <h3>Add Equipment</h3>

      <div style={styles.libraryList}>
        {equipment.map((item) => (
          <div key={item.id} style={styles.libraryItem}>
            <div>
              <strong>{item.name}</strong>
              <p style={styles.muted}>
                {item.category} · {item.watts}W
              </p>
            </div>

            <button
              style={styles.button}
              onClick={() => addEquipmentToProject(item.id)}
            >
              Add
            </button>
          </div>
        ))}
      </div>

      <hr style={styles.divider} />

      <h3>Equipment Added To Project</h3>

      <div style={styles.projectList}>
        {projectEquipment.length === 0 ? (
          <p style={styles.muted}>No equipment added yet.</p>
        ) : (
          projectEquipment.map((projectItem) => {
            const libraryItem = equipment.find(
              (item) => item.id === projectItem.equipment_library_id
            );

            return (
              <div key={projectItem.id} style={styles.projectItem}>
                <div>
                  <strong>{libraryItem?.name ?? "Unknown Equipment"}</strong>
                  <p style={styles.muted}>
                    {libraryItem?.category ?? "Unknown"} ·{" "}
                    {libraryItem?.watts ?? 0}W each · Total{" "}
                    {((libraryItem?.watts ?? 0) * projectItem.quantity).toLocaleString()} W
                  </p>
                </div>

                <label style={styles.smallLabel}>
                  Qty
                  <input
                    style={styles.qtyInput}
                    type="number"
                    min="1"
                    value={projectItem.quantity}
                    onChange={(event) =>
                      updateProjectEquipmentQuantity(
                        projectItem.id,
                        Number(event.target.value)
                      )
                    }
                  />
                </label>

                <label style={styles.notesLabel}>
                  Notes
                  <input
                    style={styles.notesInput}
                    value={projectItem.notes ?? ""}
                    onChange={(event) =>
                      updateProjectEquipmentNotes(
                        projectItem.id,
                        event.target.value
                      )
                    }
                  />
                </label>

                <button
                  style={styles.dangerButton}
                  onClick={() => deleteProjectEquipment(projectItem.id)}
                >
                  Remove
                </button>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    marginTop: "20px",
    background: "white",
    border: "1px solid #d9e0ea",
    borderRadius: "14px",
    padding: "18px",
  },
  muted: {
    color: "#637083",
  },
  summaryBox: {
    border: "1px solid #d9e0ea",
    borderRadius: "12px",
    padding: "14px",
    margin: "16px 0",
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    background: "#f8fafc",
  },
  libraryList: {
    display: "grid",
    gap: "10px",
    marginTop: "12px",
  },
  libraryItem: {
    border: "1px solid #d9e0ea",
    borderRadius: "12px",
    padding: "14px",
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    alignItems: "center",
  },
  projectList: {
    display: "grid",
    gap: "10px",
    marginTop: "12px",
  },
  projectItem: {
    border: "1px solid #d9e0ea",
    borderRadius: "12px",
    padding: "14px",
    display: "grid",
    gridTemplateColumns: "1fr 80px 1fr auto",
    gap: "12px",
    alignItems: "center",
  },
  smallLabel: {
    display: "grid",
    gap: "4px",
    fontSize: "12px",
    color: "#637083",
  },
  notesLabel: {
    display: "grid",
    gap: "4px",
    fontSize: "12px",
    color: "#637083",
  },
  qtyInput: {
    width: "100%",
    padding: "8px",
    borderRadius: "10px",
    border: "1px solid #d9e0ea",
  },
  notesInput: {
    width: "100%",
    padding: "8px",
    borderRadius: "10px",
    border: "1px solid #d9e0ea",
  },
  button: {
    padding: "10px 14px",
    borderRadius: "10px",
    border: "1px solid #172033",
    background: "#172033",
    color: "white",
    cursor: "pointer",
  },
  dangerButton: {
    padding: "10px 14px",
    borderRadius: "10px",
    border: "1px solid #c53030",
    background: "#fff5f5",
    color: "#c53030",
    cursor: "pointer",
  },
  divider: {
    border: 0,
    borderTop: "1px solid #d9e0ea",
    margin: "20px 0",
  },
};