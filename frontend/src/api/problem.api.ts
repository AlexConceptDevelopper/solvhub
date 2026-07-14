import { apiFetch } from "./client";
import type { Problem, ProblemCreate } from "../types/problem";

export const getProblems = (): Promise<Problem[]> => {
  return apiFetch("/problems/dto");
};

export const getProblemById = (
  idProblem: number
): Promise<Problem> => {
  return apiFetch(`/problems/${idProblem}`);
};

export const createProblem = (
  problem: ProblemCreate
): Promise<Problem> => {
  return apiFetch("/problems", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(problem),
  });
};
