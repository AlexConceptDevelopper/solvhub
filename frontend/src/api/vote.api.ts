import { apiFetch } from "./client";

import type { Vote, VoteCreate } from "../types/vote";

export const createVote = (
  vote: VoteCreate
): Promise<Vote> => {
  return apiFetch("/votes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(vote),
  });
};

export const getVotesBySolution = (
  idSolution: number
): Promise<Vote[]> => {
  return apiFetch(`/votes/solution/${idSolution}`);
};

export const hasUserVoted = (
  solutionId: number,
  userId: number
): Promise<boolean> => {
  return apiFetch(
    `/votes/check?solutionId=${solutionId}&userId=${userId}`
  );
};