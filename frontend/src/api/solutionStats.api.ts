import { apiFetch } from "./client";

import type { SolutionStats } from "../types/solutionStats";

export const getSolutionStats = (
  idSolution: number
): Promise<SolutionStats> => {
  return apiFetch(`/solutions/${idSolution}/stats`);
};