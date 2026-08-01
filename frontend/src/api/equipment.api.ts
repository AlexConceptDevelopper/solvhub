import { apiFetch } from "./client";
import type { Equipment, EquipmentCreate  } from "../types/equipment";

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

export const createEquipment = async (payload: EquipmentCreate): Promise<Equipment | null> => {
  return await apiFetch<Equipment>("/equipments", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const updateEquipment = async (idEquipment: number, payload: EquipmentCreate): Promise<Equipment | null> => {
  return await apiFetch<Equipment>(`/equipments/${idEquipment}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
};

export const deleteEquipment = async (idEquipment: number): Promise<void> => {
  await apiFetch(`/equipments/${idEquipment}`, { method: "DELETE" });
};

export const searchEquipment = async (query: string, categoryId?: number): Promise<Equipment[]> => {
  const params = new URLSearchParams();
  if (query) params.append("query", query);
  if (categoryId && categoryId !== 0) params.append("categoryId", categoryId.toString());

  const data = await apiFetch<Equipment[]>(`/equipments/search?${params.toString()}`);
  return data ?? [];
};