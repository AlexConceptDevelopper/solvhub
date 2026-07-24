import { apiFetch } from "./client";
import type { Category } from "../types/category";

export const getCategories = async (): Promise<Category[]> => {
  const data = await apiFetch<Category[]>("/categories/all");
  return data ?? [];
};

export const getCategoriesWithCount = async (): Promise<Category[]> => {
  const data = await apiFetch<Category[]>("/categories/with-count");
  return data ?? [];
};