export type EquipmentItem = {
  id: string;
  category: string;
  name: string;
  watts: number;
  default_quantity: number;
  created_at: string;
};

export type ProjectEquipmentItem = {
  id: string;
  project_id: string;
  equipment_library_id: string;
  quantity: number;
  notes: string | null;
  created_at: string;
};