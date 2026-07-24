import { apiFetch } from "./client";

import type { SolutionStats } from "../types/solutionStats";

export const getSolutionStats = async (
  idSolution: number
): Promise<SolutionStats> => {
  const result = await apiFetch<SolutionStats | null>(`/solutions/${idSolution}/stats`);
  
  if (!result) {
    throw new Error(`Statistiques introuvables pour la solution avec l'ID ${idSolution}.`);
  }
  
  return result;
};