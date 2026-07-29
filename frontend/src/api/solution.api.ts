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
  solutionData: SolutionCreate | FormData
): Promise<Solution> => {
  const isFormData = solutionData instanceof FormData;

  // Récupère ton token habituel (ex: depuis le localStorage)
  const token = localStorage.getItem("token"); // Adapte selon ta gestion du token

  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  // On ne met PAS de "Content-Type" si c'est un FormData pour laisser le navigateur faire

  const result = await apiFetch<Solution | null>("/solutions", {
    method: "POST",
    headers: isFormData ? headers : { ...headers, "Content-Type": "application/json" },
    body: isFormData ? solutionData : JSON.stringify(solutionData),
  });

  if (!result) {
    throw new Error("Erreur lors de la création de la solution : aucune réponse du serveur.");
  }

  return result;
};