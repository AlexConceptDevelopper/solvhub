import { apiFetch } from "./client";
import type { Vote, VoteCreate } from "../types/vote";

export const createVote = async (
  vote: VoteCreate
): Promise<Vote> => {
  const result = await apiFetch<Vote | null>("/votes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(vote),
  });

  if (!result) {
    throw new Error("Erreur lors de la création du vote : aucune réponse du serveur.");
  }

  return result;
};

export const getVotesBySolution = async (
  idSolution: number
): Promise<Vote[]> => {
  const result = await apiFetch<Vote[] | null>(`/votes/solution/${idSolution}`);
  return result ?? [];
};

export const hasUserVoted = async (
  solutionId: number,
  userId: number
): Promise<boolean> => {
  const result = await apiFetch<boolean | null>(
    `/votes/check?solutionId=${solutionId}&userId=${userId}`
  );
  return result ?? false;
};