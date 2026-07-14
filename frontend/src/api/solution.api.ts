import { apiFetch } from "./client";

import type { Solution } from "../types/solution";
import type { SolutionCreate } from "../types/solutionCreate";

export const getSolutionsByProblem = (
  idProblem: number
): Promise<Solution[]> => {
  return apiFetch(`/problems/${idProblem}/solutions`);
};

export const getSolutionById = (
  idSolution: number
): Promise<Solution> => {
  return apiFetch(`/solutions/dto/${idSolution}`);
};

export const createSolution = (
  solution: SolutionCreate
): Promise<Solution> => {
  return apiFetch("/solutions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(solution),
  });
};