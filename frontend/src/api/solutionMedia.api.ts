import type { SolutionMedia } from "../types/SolutionMedia";
import { apiFetch } from "./client";

export const getMediaBySolution = async (
  solutionId: number
): Promise<SolutionMedia[]> => {
  const result = await apiFetch<SolutionMedia[] | null>(
    `/solutions/${solutionId}/media`
  );
  return result ?? [];
};