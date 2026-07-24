export interface Vote {
  idVotes: number;
  status: "SUCCESS" | "PARTIAL" | "FAILURE";
  comment?: string;
  createdAt: string;
  userId: number;
  username?: string; 
  badge?: string;
  solutionId: number;
}

export interface VoteCreate {
  status: "SUCCESS" | "PARTIAL" | "FAILURE";
  comment?: string;
  userId: number;
  solutionId: number;
}