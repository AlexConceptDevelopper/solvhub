export interface Problem {
  idProblem: number;
  title: string;
  description: string;
  category: string;
  createdAt?: string;
  
  user?: {
    idUsers: number;
    username: string;
  };
}

export interface ProblemCreate {
  title:string;
  description:string;
  category:string;
}
