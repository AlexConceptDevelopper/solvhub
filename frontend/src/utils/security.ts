import type { User } from "../types/user";

/**
 * Vérifie si l'utilisateur connecté est le propriétaire du contenu ou un Administrateur.
 */
export const isOwnerOrAdmin = (
  currentUser: User | null | undefined,
  owner?: { idUsers?: number; email?: string; username?: string } | null
): boolean => {
  if (!currentUser) return false;

  // 1. Est-ce qu'il est Admin ? (Ajuste selon la structure de ton rôle/autorité)
  if (currentUser.role === "ADMIN" || currentUser.role === "ROLE_ADMIN") {
    return true;
  }

  // 2. Est-ce qu'il est le propriétaire ? (par ID ou par Email)
  if (owner) {
    if (owner.idUsers && currentUser.idUsers === owner.idUsers) {
      return true;
    }
    if (owner.email && currentUser.email === owner.email) {
      return true;
    }
  }

  return false;
};