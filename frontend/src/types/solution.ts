import type { User } from "./user";

export interface Solution {

  idSolution: number;

  title: string;

  steps: string;

  difficulty: number;

  timeMinutes: number;

  riskLevel: number;

  createdAt: string;

  problemId: number;

  user?: User;

  score: number | null;

}