import { apiFetch } from "./client";
import type { Solution } from "../types/solution";
import type { SolutionCreate } from "../types/solutionCreate";
import type { SolutionMedia } from "../types/SolutionMedia";

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
  const token = localStorage.getItem("token");

  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

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

export const updateSolution = async (
  idSolution: number,
  solutionData: Partial<Solution>
): Promise<Solution> => {
  const result = await apiFetch<Solution | null>(`/solutions/${idSolution}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(solutionData),
  });

  if (!result) {
    throw new Error(`Erreur lors de la mise à jour de la solution ${idSolution}.`);
  }

  return result;
};

export const deleteSolution = async (idSolution: number): Promise<void> => {
  await apiFetch(`/solutions/${idSolution}`, { method: "DELETE" });
};

export const getSolutionsByUser = async (idUser: number): Promise<Solution[]> => {
  const result = await apiFetch<Solution[] | null>(`/solutions/user/${idUser}`);
  return result ?? [];
};

export const getSolutionMedias = async (idSolution: number): Promise<SolutionMedia[]> => {
  const result = await apiFetch<SolutionMedia[] | null>(`/solutions/${idSolution}/media`);
  return result ?? [];
};

export const deleteSolutionMedia = async (mediaId: number): Promise<void> => {
  await apiFetch(`/solutions/media/${mediaId}`, { method: "DELETE" });
};