import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { apiFetch } from "../api/client";
import useAsync from "../hooks/useAsync";
import type { User } from "../types/user";
import BackButton from "../components/BackButton";

import EmptyState from "../components/EmptyState";
import LoadingState from "../components/LoadingState";

export default function UserProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { data: users, loading, execute: fetchUsers } = useAsync<User[]>();

  useEffect(() => {
    fetchUsers(() =>
      apiFetch<User[] | null>("/users/top-contributors").then(
        (res) => res ?? [],
      ),
    );
  }, []);

  const user = users?.find((u) => String(u.idUsers) === String(id));

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-8">
      <BackButton to={-1} label="Retour" />

       {loading ? (
        <LoadingState label="Chargement du profil..." />
      ) : !user ? (
        <EmptyState title="Utilisateur introuvable dans le classement." />
      ) : (
        <div className="bg-white border border-slate-200 shadow-xs p-8 rounded-2xl space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-50 border border-blue-100 rounded-full flex items-center justify-center text-2xl font-bold text-blue-600">
              {user.username?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{user.username}</h1>
              <p className="text-xs text-slate-500">Membre de la communauté</p>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 block">
                Résolutions validées
              </span>
              <span className="text-xl font-bold text-blue-600 mt-1 block">
                {user.solutionCount || 0}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}