import { useState, useEffect } from "react";
import { apiFetch } from "../../api/client";
import { deleteUser } from "../../api/user.api";
import useAsync from "../../hooks/useAsync";
import type { User } from "../../types/user";
import ConfirmModal from "../ConfirmModal"; 
import Pagination from "../Pagination";

interface UsersListProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  search: string;
}

export default function UsersList({ users, setUsers, search }: UsersListProps) {
  const [userToDelete, setUserToDelete] = useState<number | null>(null);

  // --- Hook useAsync pour gérer les états de chargement des actions ---
  const { execute: executeDelete, loading: deleteLoading } = useAsync<void>();
  const { execute: executeUpdate, loading: updateLoading } = useAsync<User>();

  // --- États pour la modale de modification globale ---
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editUsername, setEditUsername] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState("");

  // --- États pour la pagination ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const confirmDelete = async () => {
    if (userToDelete === null) return;
    
    await executeDelete(() => deleteUser(userToDelete));
    setUsers((prev) => prev.filter((u) => u.idUsers !== userToDelete));
    setUserToDelete(null);
  };

  // Ouvrir la modale et pré-remplir les champs avec l'utilisateur sélectionné
  const openEditModal = (user: User) => {
    setEditingUser(user);
    setEditUsername(user.username);
    setEditEmail(user.email);
    setEditRole(user.role || "USER");
  };

  // Fermer la modale
  const closeEditModal = () => {
    setEditingUser(null);
  };

  // Enregistrer les modifications via la modale
  const saveEditing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    const updatedUser = await executeUpdate(() =>
      apiFetch<User>(`/users/${editingUser.idUsers}`, {
        method: "PUT",
        body: JSON.stringify({
          username: editUsername,
          email: editEmail,
          role: editRole,
        }),
      })
    );

    if (updatedUser) {
      setUsers((prev) =>
        prev.map((u) =>
          u.idUsers === editingUser.idUsers
            ? { ...u, ...updatedUser, username: editUsername, email: editEmail, role: editRole }
            : u
        )
      );
      closeEditModal();
    }
  };

  // --- Filtrage par recherche ---
  const filteredUsers = users.filter((u) => 
    u.username?.toLowerCase().includes(search.toLowerCase()) || 
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  // --- Calculs de la pagination ---
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [filteredUsers.length, totalPages, currentPage]);

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Gestion des Utilisateurs</h2>
      </div>

      <p className="text-slate-500 text-sm">
        {filteredUsers.length} utilisateur(s) trouvé(s)
      </p>

      {/* Tableau épuré (affichage simple, sans inputs en ligne) */}
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
            {currentUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-center text-slate-400 text-sm">
                  Aucun utilisateur trouvé.
                </td>
              </tr>
            ) : (
              currentUsers.map((user) => (
                <tr
                  key={user.idUsers}
                  className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors"
                >
                  <td className="p-4 text-slate-900 font-medium">{user.idUsers}</td>
                  <td className="p-4 text-slate-900 font-medium">{user.username}</td>
                  <td className="p-4 text-slate-900 font-medium">{user.email}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-lg border text-xs font-medium ${
                      user.role === 'ADMIN' 
                        ? 'bg-purple-50 text-purple-700 border-purple-100' 
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      {user.role || "USER"}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openEditModal(user)}
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
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}

      {/* --- MODALE DE MODIFICATION D'UN UTILISATEUR --- */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg p-6 space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <h3 className="text-xl font-bold text-slate-900">
                Modifier l'utilisateur #{editingUser.idUsers}
              </h3>
              <button
                onClick={closeEditModal}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={saveEditing} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Nom d'utilisateur</label>
                <input
                  type="text"
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Rôle</label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm"
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={closeEditModal}
                  disabled={updateLoading}
                  className="px-4 py-2 font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm cursor-pointer transition disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={updateLoading}
                  className="px-4 py-2 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl text-sm cursor-pointer shadow-sm transition disabled:opacity-50"
                >
                  {updateLoading ? "Enregistrement..." : "Enregistrer les modifications"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- Modale de suppression --- */}
      <ConfirmModal
        isOpen={userToDelete !== null}
        title="Confirmer la suppression"
        message="Es-tu sûr de vouloir supprimer cet utilisateur ? Cette action est définitive."
        confirmText={deleteLoading ? "Suppression..." : "Oui, supprimer"}
        variant="danger"
        onClose={() => setUserToDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}