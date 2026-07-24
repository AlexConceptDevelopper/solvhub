import { apiFetch } from "./client";
import type { Problem, ProblemCreate } from "../types/problem";

export const getProblems = async (): Promise<Problem[]> => {
  return (await apiFetch<Problem[]>("/problems/dto")) ?? [];
};

export const getProblemById = async (
  idProblem: number
): Promise<Problem | null> => {
  const result = await apiFetch<Problem | null>(`/problems/${idProblem}`);
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