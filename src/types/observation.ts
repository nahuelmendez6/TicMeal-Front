export interface Observation {
  id: number;
  name: string;
  type: string;
  iconName: string | null;
  createdAt?: string;
  updatedAt?: string;
}
