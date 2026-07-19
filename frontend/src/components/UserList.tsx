import { useEffect, useState } from "react";
import { apiFetch } from "../api/client";
import type { User } from "../types/user";

export default function UsersList() {
  const [users, setUsers] = useState<User[]>([]);
  // Nouveau state pour gérer l'ouverture de la modale et l'ID de l'utilisateur à supprimer
  const [userToDelete, setUserToDelete] = useState<number | null>(null);

  useEffect(() => {
    apiFetch<User[]>("/users").then((data) => {
      if (data) setUsers(data);
    });
  }, []);

  const confirmDelete = async () => {
    if (userToDelete === null) return;

    try {
      // On ignore le contenu du retour, on veut juste savoir si c'est OK
      await apiFetch(`/users/${userToDelete}`, { method: "DELETE" });

      // Mettre à jour l'état immédiatement
      setUsers((prev) => prev.filter((u) => u.idUsers !== userToDelete));
    } catch (error) {
      console.error("Erreur suppression :", error);
      // Optionnel : affiche une notif d'erreur ici si tu en as une
    } finally {
      setUserToDelete(null);
    }
  };

  return (
    // J'ajoute "relative" au conteneur principal au cas où la modale en aurait besoin
    <div className="overflow-x-auto relative">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-600 bg-slate-900">
            <th className="p-4 text-white font-bold">ID</th>
            <th className="p-4 text-white font-bold">Nom</th>
            <th className="p-4 text-white font-bold">Email</th>
            <th className="p-4 text-white font-bold text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user.idUsers}
              className="border-b border-slate-700 hover:bg-slate-800 transition-colors"
            >
              <td className="p-4 text-slate-100 font-medium">{user.idUsers}</td>
              <td className="p-4 text-slate-100 font-medium">
                {user.username}
              </td>
              <td className="p-4 text-slate-100 font-medium">{user.email}</td>

              <td className="p-4 text-right">
                <div className="flex justify-end">
                  {/* Le bouton ouvre la modale au lieu de faire un window.confirm */}
                  <button
                    onClick={() => setUserToDelete(user.idUsers)}
                    className="px-4 py-2 font-bold text-white bg-slate-700 hover:bg-slate-600 border border-slate-500 rounded shadow-lg transition-all cursor-pointer"
                  >
                    Supprimer
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* --- MODALE DE CONFIRMATION --- */}
      {userToDelete !== null && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-800 p-6 rounded-xl shadow-2xl border border-slate-600 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-white mb-2">
              Confirmer la suppression
            </h3>
            <p className="text-slate-300 mb-6">
              Es-tu sûr de vouloir supprimer cet utilisateur ? Cette action est
              définitive.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2 font-medium text-slate-300 hover:text-white bg-transparent hover:bg-slate-700 rounded transition-all cursor-pointer"
              >
                Annuler
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 font-bold text-white bg-red-600 hover:bg-red-500 border border-red-500 rounded shadow-lg transition-all cursor-pointer"
              >
                Oui, supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
