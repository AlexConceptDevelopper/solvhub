import { apiFetch } from "./client";
import type { User } from "../types/user";

export const getTopContributors = async (): Promise<User[]> => {
  const result = await apiFetch<User[]>("/users/top-contributors");
  return result ?? []; 
};