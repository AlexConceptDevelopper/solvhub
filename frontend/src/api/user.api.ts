import { apiFetch } from "./client"; // Ajuste le chemin selon où se trouve ta fonction
import type { User } from "../types/user";

// Mettre à jour le profil
export async function updateProfile(
  idUsers: number, 
  data: { username?: string; emailNotificationsEnabled?: boolean }
): Promise<User> {
  const result = await apiFetch<User>(`/users/${idUsers}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return result!;
}

// Changer le mot de passe
export async function changePassword(data: { oldPassword: string; newPassword: string }): Promise<any> {
  return await apiFetch(`/users/password`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}