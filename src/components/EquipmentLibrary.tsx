import type { EquipmentItem } from "@/types/equipment";

type EquipmentLibraryProps = {
  equipment: EquipmentItem[];
  loadEquipment: () => void;
};

export function EquipmentLibrary({
  equipment,
  loadEquipment,
}: EquipmentLibraryProps) {
  return (
    <section style={styles.card}>
      <div style={styles.headerRow}>
        <div>
          <h2>Equipment Library</h2>
          <p style={styles.muted}>Shared equipment available to this project.</p>
        </div>

        <button style={styles.secondaryButton} onClick={loadEquipment}>
          Refresh
        </button>
      </div>

      <div style={styles.list}>
        {equipment.length === 0 ? (
          <p style={styles.muted}>No equipment found.</p>
        ) : (
          equipment.map((item) => (
            <div key={item.id} style={styles.item}>
              <div>
                <strong>{item.name}</strong>
                <p style={styles.muted}>
                  {item.category} · {item.watts}W · Default Qty{" "}
                  {item.default_quantity}
                </p>
              </div>
            </div>
          ))
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
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    alignItems: "center",
  },
  muted: {
    color: "#637083",
  },
  list: {
    display: "grid",
    gap: "10px",
    marginTop: "16px",
  },
  item: {
    border: "1px solid #d9e0ea",
    borderRadius: "12px",
    padding: "14px",
  },
  secondaryButton: {
    padding: "10px 14px",
    borderRadius: "10px",
    border: "1px solid #d9e0ea",
    background: "white",
    color: "#172033",
    cursor: "pointer",
  },
};