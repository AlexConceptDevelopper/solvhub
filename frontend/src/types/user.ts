export interface User {
  idUsers: number;
  username: string;
  email: string;
  role: string;
  solutionCount ?: number;
  badge?: string;
}