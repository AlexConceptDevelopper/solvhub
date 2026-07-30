import type { Category } from "./category";

export interface Equipment {
  idEquipment: number;
  category: Category;
  brand: string;
  model: string;
}

// Si besoin plus tard :
export interface EquipmentCreate {
  category: {
    idCategory: number;
  };
  brand: string;
  model: string;
}