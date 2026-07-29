import { useState, useEffect } from "react";
import { apiFetch } from "../../api/client";
import type { Category } from "../../types/category";
import ConfirmModal from "../ConfirmModal"; 
import Pagination from "../Pagination";

interface CategoriesListProps {
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  search: string;
}

export default function CategoriesList({ categories, setCategories, search }: CategoriesListProps) {
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);

  // --- États pour la modale de modification ---
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editName, setEditName] = useState("");
  const [editIcon, setEditIcon] = useState("");

  // --- États pour la pagination ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const confirmDelete = async () => {
    if (categoryToDelete === null) return;
    try {
      await apiFetch(`/categories/${categoryToDelete}`, { method: "DELETE" });
      setCategories((prev) => prev.filter((c) => c.idCategory !== categoryToDelete));
    } catch (error) {
      console.error("Erreur suppression catégorie :", error);
    } finally {
      setCategoryToDelete(null);
    }
  };

  // Ouvrir la modale et pré-remplir les champs
  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setEditName(cat.name);
    setEditIcon(cat.icon || "");
  };

  const closeEditModal = () => {
    setEditingCategory(null);
  };

  // Sauvegarder les modifications via la modale
  const saveEditing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;

    try {
      const updatedCategory = await apiFetch<Category>(`/categories/${editingCategory.idCategory}`, {
        method: "PUT",
        body: JSON.stringify({
          name: editName,
          icon: editIcon,
        }),
      });

      setCategories((prev) =>
        prev.map((c) => 
          c.idCategory === editingCategory.idCategory 
            ? (updatedCategory || { ...c, name: editName, icon: editIcon }) 
            : c
        )
      );
      closeEditModal();
    } catch (error) {
      console.error("Erreur modification catégorie :", error);
    }
  };

  // --- Filtrage par recherche ---
  const filteredCategories = categories.filter((c) => 
    c.name?.toLowerCase().includes(search.toLowerCase())
  );

  // --- Calculs de la pagination ---
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCategories = filteredCategories.slice(startIndex, startIndex + itemsPerPage);

  // Sécurité pour la pagination si des éléments sont supprimés ou filtrés
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [filteredCategories.length, totalPages, currentPage]);

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Gestion des Catégories</h2>
      </div>

      <p className="text-slate-500 text-sm">
        {filteredCategories.length} catégorie(s) trouvée(s)
      </p>

      {/* Tableau des catégories épuré */}
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-100/70">
              <th className="p-4 text-slate-700 font-bold">ID</th>
              <th className="p-4 text-slate-700 font-bold">Icône</th>
              <th className="p-4 text-slate-700 font-bold">Nom</th>
              <th className="p-4 text-slate-700 font-bold text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentCategories.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-4 text-center text-slate-400 text-sm">
                  Aucune catégorie trouvée.
                </td>
              </tr>
            ) : (
              currentCategories.map((cat) => (
                <tr
                  key={cat.idCategory}
                  className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors"
                >
                  <td className="p-4 text-slate-900 font-medium">{cat.idCategory}</td>
                  <td className="p-4 text-xl">{cat.icon || "—"}</td>
                  <td className="p-4 text-slate-900 font-medium">{cat.name}</td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openEditModal(cat)}
                        className="px-3 py-2 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded shadow-sm cursor-pointer text-xs transition"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => setCategoryToDelete(cat.idCategory)}
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

      {/* --- Composant Pagination intégré --- */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}

      {/* --- MODALE DE MODIFICATION DE LA CATÉGORIE --- */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-6 space-y-6 my-8">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <h3 className="text-xl font-bold text-slate-900">
                Modifier la catégorie #{editingCategory.idCategory}
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
                <label className="block text-sm font-semibold text-slate-700 mb-1">Nom de la catégorie</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Icône (Émoji)</label>
                <input
                  type="text"
                  value={editIcon}
                  onChange={(e) => setEditIcon(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm text-center"
                  maxLength={4}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-4 py-2 font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm cursor-pointer transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl text-sm cursor-pointer shadow-sm transition"
                >
                  Enregistrer les modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- Modale de suppression --- */}
      <ConfirmModal
        isOpen={categoryToDelete !== null}
        title="Confirmer la suppression"
        message="Es-tu sûr de vouloir supprimer cette catégorie ? Cette action est définitive."
        confirmText="Oui, supprimer"
        variant="danger"
        onClose={() => setCategoryToDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}