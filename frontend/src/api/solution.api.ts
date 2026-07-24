import { apiFetch } from "./client";

import type { Solution } from "../types/solution";
import type { SolutionCreate } from "../types/solutionCreate";

export const getSolutionsByProblem = async (
  idProblem: number
): Promise<Solution[]> => {
  const result = await apiFetch<Solution[] | null>(`/problems/${idProblem}/solutions`);
  return result ?? [];
};

export const getSolutionById = async (
  idSolution: number
): Promise<Solution> => {
  const result = await apiFetch<Solution | null>(`/solutions/dto/${idSolution}`);
  if (!result) {
    throw new Error(`Solution avec l'ID ${idSolution} introuvable.`);
  }
  return result;
};

export const createSolution = async (
  solution: SolutionCreate
): Promise<Solution> => {
  const result = await apiFetch<Solution | null>("/solutions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(solution),
  });

  if (!result) {
    throw new Error("Erreur lors de la création de la solution : aucune réponse du serveur.");
  }

  return result;
};