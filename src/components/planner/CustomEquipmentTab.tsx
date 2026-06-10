import { useState } from "react";
import type { EquipmentItem, PlannerState } from "@/planner/types";

type CustomEquipmentTabProps = {
  plannerState: PlannerState;
  setPlannerState: (state: PlannerState) => void;
};

const categories = [
  "Audio - Control",
  "Audio - Amps",
  "Audio - Other",
  "Lighting - Control",
  "Lighting - LED Generics",
  "Lighting - LED Pars",
  "Lighting - LED Battens",
  "Lighting - Moving Heads",
  "Lighting - Effects / Eye Candy",
  "Lighting - Haze / Other",
  "Vision - Control",
  "Vision - LED",
  "Vision - Proj",
  "Vision - Displays",
  "Rigging - Motors",
  "Expo Power Supplies",
];

function createId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export function CustomEquipmentTab({
  plannerState,
  setPlannerState,
}: CustomEquipmentTabProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [watts, setWatts] = useState("");

  function addCustomEquipment() {
    const cleanName = name.trim();
    const parsedWatts = Number(watts);

    if (!cleanName) {
      alert("Please enter an equipment name.");
      return;
    }

    if (!Number.isFinite(parsedWatts) || parsedWatts <= 0) {
      alert("Please enter a valid wattage.");
      return;
    }

    const newItem: EquipmentItem = {
      id: createId("custom_equipment"),
      category,
      name: cleanName,
      watts: parsedWatts,
    };

    setPlannerState({
      ...plannerState,
      customEquipment: [...plannerState.customEquipment, newItem],
    });

    setName("");
    setWatts("");
  }

  function deleteCustomEquipment(id: string) {
    if (!confirm("Delete this custom equipment item?")) return;

    setPlannerState({
      ...plannerState,
      customEquipment: plannerState.customEquipment.filter(
        (item) => item.id !== id
      ),
    });
  }

  function updateCustomEquipment(id: string, updatedItem: EquipmentItem) {
    setPlannerState({
      ...plannerState,
      customEquipment: plannerState.customEquipment.map((item) =>
        item.id === id ? updatedItem : item
      ),
    });
  }

  return (
    <section style={styles.card}>
      <h2>Custom Equipment</h2>
      <p style={styles.muted}>
        Create project-specific equipment. These items will appear in the Distro
        Editor equipment sidebar and can be dragged onto outputs.
      </p>

      <div style={styles.formGrid}>
        <label style={styles.label}>
          Equipment Name
          <input
            style={styles.input}
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Custom LED Wall PSU"
          />
        </label>

        <label style={styles.label}>
          Category
          <select
            style={styles.input}
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label style={styles.label}>
          Watts
          <input
            style={styles.input}
            type="number"
            min="1"
            value={watts}
            onChange={(event) => setWatts(event.target.value)}
            placeholder="Watts"
          />
        </label>
      </div>

      <button style={styles.button} onClick={addCustomEquipment}>
        Add Custom Equipment
      </button>

      <hr style={styles.divider} />

      <h3>Project Custom Equipment</h3>

      {plannerState.customEquipment.length === 0 ? (
        <p style={styles.muted}>No custom equipment added yet.</p>
      ) : (
        <div style={styles.list}>
          {plannerState.customEquipment.map((item) => (
            <div key={item.id} style={styles.itemCard}>
              <label style={styles.label}>
                Name
                <input
                  style={styles.input}
                  value={item.name}
                  onChange={(event) =>
                    updateCustomEquipment(item.id, {
                      ...item,
                      name: event.target.value,
                    })
                  }
                />
              </label>

              <label style={styles.label}>
                Category
                <select
                  style={styles.input}
                  value={item.category}
                  onChange={(event) =>
                    updateCustomEquipment(item.id, {
                      ...item,
                      category: event.target.value,
                    })
                  }
                >
                  {categories.map((categoryOption) => (
                    <option key={categoryOption} value={categoryOption}>
                      {categoryOption}
                    </option>
                  ))}
                </select>
              </label>

              <label style={styles.label}>
                Watts
                <input
                  style={styles.input}
                  type="number"
                  min="1"
                  value={item.watts}
                  onChange={(event) =>
                    updateCustomEquipment(item.id, {
                      ...item,
                      watts: Math.max(1, Number(event.target.value) || 1),
                    })
                  }
                />
              </label>

              <button
                style={styles.dangerButton}
                onClick={() => deleteCustomEquipment(item.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    border: "1px solid #d9e0ea",
    borderRadius: "18px",
    padding: "18px",
    background: "white",
  },
  muted: {
    color: "#637083",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 260px 140px",
    gap: "12px",
    alignItems: "end",
    marginTop: "16px",
  },
  label: {
    display: "block",
    color: "#637083",
    fontWeight: 700,
  },
  input: {
    width: "100%",
    padding: "10px",
    marginTop: "6px",
    borderRadius: "10px",
    border: "1px solid #d9e0ea",
  },
  button: {
    marginTop: "12px",
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
    alignSelf: "end",
  },
  divider: {
    border: 0,
    borderTop: "1px solid #d9e0ea",
    margin: "22px 0",
  },
  list: {
    display: "grid",
    gap: "12px",
  },
  itemCard: {
    display: "grid",
    gridTemplateColumns: "1fr 260px 140px auto",
    gap: "12px",
    alignItems: "end",
    border: "1px solid #d9e0ea",
    borderRadius: "14px",
    padding: "14px",
    background: "#f8fafc",
  },
};