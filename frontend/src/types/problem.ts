import type { Category } from "./category";

export interface Problem {
  idProblem: number;
  title: string;
  description: string;
  voteCount?: number;
  category: Category;
  createdAt?: string;

  user?: {
    idUsers: number;
    username: string;
    email?: string;
    solutionCount?: number;
    badge?: string;
  };
}

export interface ProblemCreate {
  title: string;
  description: string;
  idCategory: number;
}
