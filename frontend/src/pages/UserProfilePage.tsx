import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { apiFetch } from "../api/client";
import useAsync from "../hooks/useAsync";
import type { User } from "../types/user";
import BackButton from "../components/BackButton";

export default function UserProfilePage() {
  const { id } = useParams<{ id: string }>();
  // On récupère toute la liste des top contributeurs
  const { data: users, loading, execute: fetchUsers } = useAsync<User[]>();

  useEffect(() => {
    fetchUsers(() =>
      apiFetch<User[] | null>("/users/top-contributors").then(
        (res) => res ?? [],
      ),
    );
  }, []);

  // On cherche l'utilisateur cliqué dans la liste (en convertissant en nombre ou string selon ton type d'id)
  const user = users?.find((u) => String(u.idUsers) === String(id));

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-8 text-slate-200">
      <BackButton to={-1} label="Retour" />
      {loading ? (
        <p className="text-center text-slate-500 py-12">
          Chargement du profil...
        </p>
      ) : !user ? (
        <p className="text-center text-slate-500 py-12">
          Utilisateur introuvable dans le classement.
        </p>
      ) : (
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-600/20 border border-blue-500/30 rounded-full flex items-center justify-center text-2xl font-bold text-blue-400">
              {user.username?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{user.username}</h1>
              <p className="text-xs text-slate-400">Membre de la communauté</p>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 block">
                Résolutions validées
              </span>
              <span className="text-xl font-bold text-blue-400 mt-1 block">
                {user.solutionCount || 0}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
