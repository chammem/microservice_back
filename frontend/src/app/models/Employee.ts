import { Shift } from './Shift';
export interface Employee {
  id?: number;
  nom: string;
  poste: string;
  email: string;
  telephone: string;
  dateEmbauche: string; // Will be handled as ISO date string in frontend
  restaurantId?: number;
  shifts?: Shift[];
}