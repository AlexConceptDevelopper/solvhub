import { apiFetch } from "./client"; // Ajuste le chemin selon où se trouve ta fonction
import type { User } from "../types/user";

// Récupérer le profil de l'utilisateur connecté (avec son statut googleAccount)
export async function getMe(): Promise<User> {
  const result = await apiFetch<User>(`/users/me`, {
    method: "GET",
  });
  return result!;
}

// Mettre à jour le profil
export async function updateProfile(
  data: { username?: string; emailNotificationsEnabled?: boolean }
): Promise<User> {
  const result = await apiFetch<User>(`/users/me`, {
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

//delete pour l'admin, peut delete tout le monde
export async function deleteUser(id: number): Promise<any> {
  return await apiFetch(`/users/${id}`, {
    method: "DELETE",
  });
}

//delete sur l'user lui même, contraint à son id
export async function deleteMyAccount(): Promise<any> {
  return await apiFetch(`/users/me`, {
    method: "DELETE",
  });
}