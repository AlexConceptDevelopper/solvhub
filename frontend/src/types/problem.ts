import type { Category } from "./category";

export interface Problem {
  idProblem: number;
  title: string;
  description: string;
  category: Category;
  createdAt?: string;

  user?: {
    idUsers: number;
    username: string;
  };
}

export interface ProblemCreate {
  title: string;
  description: string;
  idCategory: number;
}
