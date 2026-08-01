import { apiFetch } from "./client";
import type { Problem, ProblemCreate } from "../types/problem";
import type { ProblemCheckRequest } from "../types/ProblemCheckRequest";

export const getProblems = async (): Promise<Problem[]> => {
  return (await apiFetch<Problem[]>("/problems/dto")) ?? [];
};

export const getProblemById = async (
  idProblem: number
): Promise<Problem | null> => {
  const result = await apiFetch<Problem | null>(`/problems/dto/${idProblem}`);
  return result ?? null;
};

export const createProblem = async (
  problem: ProblemCreate
): Promise<Problem> => {
  const result = await apiFetch<Problem | null>("/problems", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(problem),
  });

  if (!result) {
    throw new Error("Erreur lors de la création du problème : aucune réponse du serveur.");
  }

  return result;
};

export const updateProblem = async (
  idProblem: number,
  problemData: Partial<ProblemCreate>
): Promise<Problem | null> => {
  return await apiFetch<Problem>(`/problems/${idProblem}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(problemData),
  });
};

export const deleteProblem = async (idProblem: number): Promise<void> => {
  await apiFetch(`/problems/${idProblem}`, { method: "DELETE" });
};

export const checkDuplicates = async (
  data: ProblemCheckRequest
): Promise<Problem[]> => {
  const result = await apiFetch<Problem[]>("/problems/check-duplicates", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return result ?? [];
};

export const getProblemsByUser = async (idUser: number): Promise<Problem[]> => {
  const result = await apiFetch<Problem[] | null>(`/problems/user/${idUser}`);
  return result ?? [];
};