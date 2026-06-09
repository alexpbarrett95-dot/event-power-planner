export type Phase = "L1" | "L2" | "L3" | "3Φ" | "Socapex";

export type SourceConnection =
  | "13A"
  | "16A / 1"
  | "32A / 1"
  | "32A / 3"
  | "63A / 3"
  | "125A / 3"
  | "200A / 3"
  | "300A / 3"
  | "400A / 3";

export type EquipmentItem = {
  id: string;
  category: string;
  name: string;
  watts: number;
};

export type AssignedEquipment = {
  id: string;
  equipmentId: string;
  name: string;
  category: string;
  watts: number;
  quantity: number;
};

export type DistroOutput = {
  id: string;
  label: string;
  phase: Phase;
  type: string;
  rating: number;
  items: AssignedEquipment[];
  notes?: string;
  displayName?: string;
  outputNumber?: number;
  detail?: string;
  breakerPair?: string | null;
  socaCircuits?: DistroOutput[];
};

export type DistroDefinition = {
  name: string;
  input: SourceConnection | string;
  inputA: number;
  outputs: DistroOutput[];
  custom?: boolean;
};

export type ProjectDistro = DistroDefinition & {
  id: string;
  instanceName: string;
  sourceId: string;
  location: string;
  notes: string;
};

export type PowerSource = {
  id: string;
  name: string;
  conn: SourceConnection | string;
  rating: number;
  notes: string;
  auto?: boolean;
  parentDistroId?: string;
  parentOutputId?: string;
  phaseType?: "Single-Phase" | "Three-Phase";
};

export type PlannerState = {
  sources: PowerSource[];
  distros: ProjectDistro[];
  active: string | null;
  customEquipment: EquipmentItem[];
  customDistros: DistroDefinition[];
  systemName: string;
  reportHiddenSources: string[];
};

export const emptyPlannerState: PlannerState = {
  sources: [],
  distros: [],
  active: null,
  customEquipment: [],
  customDistros: [],
  systemName: "",
  reportHiddenSources: [],
};
