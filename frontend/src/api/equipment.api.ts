import { apiFetch } from "./client";
import type { Equipment } from "../types/equipment";

// --- Pour tes listes déroulantes (actuel) ---
export const getBrandsByCategory = async (categoryId: number): Promise<string[]> => {
  const data = await apiFetch<string[]>(`/equipments/brands?categoryId=${categoryId}`);
  return data ?? [];
};

export const getModelsByCategoryAndBrand = async (categoryId: number, brand: string): Promise<string[]> => {
  const data = await apiFetch<string[]>(`/equipments/models?categoryId=${categoryId}&brand=${encodeURIComponent(brand)}`);
  return data ?? [];
};

// --- Pour plus tard si tu as besoin de récupérer des équipements complets ---
export const getAllEquipments = async (): Promise<Equipment[]> => {
  const data = await apiFetch<Equipment[]>("/equipments");
  return data ?? [];
};

// --- Pour récupérer l'équipement complet via ses critères ---
export const findEquipmentByCriteria = async (categoryId: number, brand: string, model: string): Promise<Equipment | null> => {
  const data = await apiFetch<Equipment>(
    `/equipments/find?categoryId=${categoryId}&brand=${encodeURIComponent(brand)}&model=${encodeURIComponent(model)}`
  );
  return data ?? null;
};