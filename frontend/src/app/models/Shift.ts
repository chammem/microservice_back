import { Employee } from './Employee';

export interface Shift {
  id?: number;
  name?: string; // Make name optional since backend doesn't have it
  archived: boolean;
  date: string; // ISO date format
  startTime: string;
  endTime: string;
  description: string;
  employees?: Employee[];
}