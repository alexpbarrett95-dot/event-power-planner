export type Project = {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
};

export type PlannerState = {
  systemName: string;
  sources: unknown[];
  distros: unknown[];
  active: string | null;
  customEquipment: unknown[];
  customDistros: unknown[];
  reportHiddenSources: string[];
};

export type ProjectData = {
  plannerState: PlannerState;
};

export const emptyPlannerState: PlannerState = {
  systemName: "",
  sources: [],
  distros: [],
  active: null,
  customEquipment: [],
  customDistros: [],
  reportHiddenSources: [],
};

export const emptyProjectData: ProjectData = {
  plannerState: emptyPlannerState,
};