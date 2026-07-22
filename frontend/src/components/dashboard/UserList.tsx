import { useEffect, useState } from "react";
import { apiFetch } from "../../api/client";
import type { User } from "../../types/user";
import ConfirmModal from "../ConfirmModal"; // Ajuste le chemin d'import selon l'emplacement de ton fichier ConfirmModal
import Pagination from "../Pagination"; // Import du composant Pagination

export default function UsersList() {
  const [users, setUsers] = useState<User[]>([]);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);

  // ID de l'utilisateur actuellement en cours de modification
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editUsername, setEditUsername] = useState("");
  const [editEmail, setEditEmail] = useState("");

  // --- États pour la pagination ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Nombre d'éléments par page

  useEffect(() => {
    apiFetch<User[]>("/users").then((data) => {
      if (data) setUsers(data);
    });
  }, []);

  const confirmDelete = async () => {
    if (userToDelete === null) return;
    try {
      await apiFetch(`/users/${userToDelete}`, { method: "DELETE" });
      setUsers((prev) => prev.filter((u) => u.idUsers !== userToDelete));
    } catch (error) {
      console.error("Erreur suppression :", error);
    } finally {
      setUserToDelete(null);
    }
  };

  // Passer en mode édition pour une ligne
  const startEditing = (user: User) => {
    setEditingId(user.idUsers);
    setEditUsername(user.username);
    setEditEmail(user.email);
  };

  // Annuler l'édition
  const cancelEditing = () => {
    setEditingId(null);
  };

  // Sauvegarder les modifications
  const saveEditing = async (id: number) => {
    try {
      const updatedUser = await apiFetch<User>(`/users/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          username: editUsername,
          email: editEmail,
        }),
      });

      setUsers((prev) =>
        prev.map((u) => (u.idUsers === id ? (updatedUser || { ...u, username: editUsername, email: editEmail }) : u))
      );
      setEditingId(null);
    } catch (error) {
      console.error("Erreur modification :", error);
    }
  };

  // --- Calculs de la pagination (côté client) ---
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentUsers = users.slice(startIndex, startIndex + itemsPerPage);

  // Sécurité pour la pagination si des éléments sont supprimés
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [users.length, totalPages, currentPage]);

  return (
    <div className="space-y-6 relative">
      <div className="overflow-x-auto">
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
            {currentUsers.map((user) => {
              const isEditing = editingId === user.idUsers;

              return (
                <tr
                  key={user.idUsers}
                  className="border-b border-slate-700 hover:bg-slate-800 transition-colors"
                >
                  <td className="p-4 text-slate-100 font-medium">{user.idUsers}</td>

                  {/* Nom : Input si on édite, texte sinon */}
                  <td className="p-4 text-slate-100 font-medium">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editUsername}
                        onChange={(e) => setEditUsername(e.target.value)}
                        className="px-2 py-1 bg-slate-900 border border-slate-600 rounded text-white w-full focus:outline-none focus:border-blue-500"
                      />
                    ) : (
                      user.username
                    )}
                  </td>

                  {/* Email : Input si on édite, texte sinon */}
                  <td className="p-4 text-slate-100 font-medium">
                    {isEditing ? (
                      <input
                        type="email"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        className="px-2 py-1 bg-slate-900 border border-slate-600 rounded text-white w-full focus:outline-none focus:border-blue-500"
                      />
                    ) : (
                      user.email
                    )}
                  </td>

                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      {isEditing ? (
                        <>
                          <button
                            onClick={() => saveEditing(user.idUsers)}
                            className="px-3 py-2 font-bold text-white bg-green-600 hover:bg-green-500 border border-green-500 rounded shadow transition-all cursor-pointer text-xs"
                          >
                            Valider
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="px-3 py-2 font-bold text-slate-300 hover:text-white bg-slate-700 hover:bg-slate-600 border border-slate-500 rounded shadow transition-all cursor-pointer text-xs"
                          >
                            Annuler
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEditing(user)}
                            className="px-3 py-2 font-bold text-white bg-blue-600 hover:bg-blue-500 border border-blue-500 rounded shadow transition-all cursor-pointer text-xs"
                          >
                            Modifier
                          </button>
                          <button
                            onClick={() => setUserToDelete(user.idUsers)}
                            className="px-3 py-2 font-bold text-white bg-slate-700 hover:bg-slate-600 border border-slate-500 rounded shadow transition-all cursor-pointer text-xs"
                          >
                            Supprimer
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* --- Composant Pagination intégré --- */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />

      {/* --- Utilisation de la modale centralisée --- */}
      <ConfirmModal
        isOpen={userToDelete !== null}
        title="Confirmer la suppression"
        message="Es-tu sûr de vouloir supprimer cet utilisateur ? Cette action est définitive."
        confirmText="Oui, supprimer"
        variant="danger"
        onClose={() => setUserToDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}