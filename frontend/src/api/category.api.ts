import { apiFetch } from "./client";
import type { Category } from "../types/category";

export const getCategories = (): Promise<Category[]> => {
  return apiFetch("/categories/all");
};

export const getCategoriesWithCount = (): Promise<Category[]> => {
  return apiFetch("/categories/with-count");
};