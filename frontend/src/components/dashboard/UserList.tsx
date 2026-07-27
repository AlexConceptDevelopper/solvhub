import { useEffect, useState } from "react";
import { apiFetch } from "../../api/client";
import type { User } from "../../types/user";
import ConfirmModal from "../ConfirmModal"; 
import Pagination from "../Pagination";

export default function UsersList() {
  const [users, setUsers] = useState<User[]>([]);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);

  // ID de l'utilisateur actuellement en cours de modification
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editUsername, setEditUsername] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState("");

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
    setEditRole(user.role || "USER");
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
          role: editRole,
        }),
      });

      setUsers((prev) =>
        prev.map((u) => (u.idUsers === id ? (updatedUser || { ...u, username: editUsername, email: editEmail, role: editRole }) : u))
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
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Gestion des Utilisateurs</h2>
      </div>

      <p className="text-slate-500 text-sm">
        {users.length} utilisateur(s) trouvé(s)
      </p>

      {/* Tableau des utilisateurs en mode Light harmonisé */}
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-100/70">
              <th className="p-4 text-slate-700 font-bold">ID</th>
              <th className="p-4 text-slate-700 font-bold">Nom</th>
              <th className="p-4 text-slate-700 font-bold">Email</th>
              <th className="p-4 text-slate-700 font-bold">Rôle</th>
              <th className="p-4 text-slate-700 font-bold text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user) => {
              const isEditing = editingId === user.idUsers;

              return (
                <tr
                  key={user.idUsers}
                  className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors"
                >
                  <td className="p-4 text-slate-900 font-medium">{user.idUsers}</td>

                  {/* Nom : Input si on édite, texte sinon */}
                  <td className="p-4 text-slate-900 font-medium">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editUsername}
                        onChange={(e) => setEditUsername(e.target.value)}
                        className="px-3 py-1 bg-white border border-blue-500 rounded text-slate-900 w-full focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                    ) : (
                      user.username
                    )}
                  </td>

                  {/* Email : Input si on édite, texte sinon */}
                  <td className="p-4 text-slate-900 font-medium">
                    {isEditing ? (
                      <input
                        type="email"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        className="px-3 py-1 bg-white border border-blue-500 rounded text-slate-900 w-full focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                    ) : (
                      user.email
                    )}
                  </td>

                  {/* Rôle : Sélecteur si on édite, badge stylé sinon */}
                  <td className="p-4">
                    {isEditing ? (
                      <select
                        value={editRole}
                        onChange={(e) => setEditRole(e.target.value)}
                        className="px-3 py-1 bg-white border border-blue-500 rounded text-slate-900 w-full focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      >
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    ) : (
                      <span className={`px-2.5 py-1 rounded-lg border text-xs font-medium ${
                        user.role === 'ADMIN' 
                          ? 'bg-purple-50 text-purple-700 border-purple-100' 
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                        {user.role || "USER"}
                      </span>
                    )}
                  </td>

                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      {isEditing ? (
                        <>
                          <button
                            onClick={() => saveEditing(user.idUsers)}
                            className="px-3 py-2 font-bold text-white bg-green-600 hover:bg-green-700 rounded shadow-sm cursor-pointer text-xs transition"
                          >
                            Valider
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="px-3 py-2 font-bold text-slate-700 bg-slate-200 hover:bg-slate-300 rounded shadow-sm cursor-pointer text-xs transition"
                          >
                            Annuler
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEditing(user)}
                            className="px-3 py-2 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded shadow-sm cursor-pointer text-xs transition"
                          >
                            Modifier
                          </button>
                          <button
                            onClick={() => setUserToDelete(user.idUsers)}
                            className="px-3 py-2 font-bold text-white bg-red-600 hover:bg-red-700 rounded shadow-sm cursor-pointer text-xs transition"
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