import { useEffect, useState } from "react";
import { apiFetch } from "../../api/client";
import ConfirmModal from "../ConfirmModal"; 
import Pagination from "../Pagination";

interface Category {
  idCategory: number;
  name: string;
}

export default function CategoriesList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  
  // États pour l'édition en ligne
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");

  // État pour gérer la suppression avec la modale
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);

  // --- États pour la pagination ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Nombre d'éléments par page

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const data = await apiFetch<Category[]>("/categories");
    if (data) setCategories(data);
  };

  // Créer une catégorie
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    try {
      const created = await apiFetch<Category>("/categories", {
        method: "POST",
        body: JSON.stringify({ name: newCategoryName }),
      });

      if (created) {
        setCategories((prev) => [...prev, created]);
        setNewCategoryName("");
      }
    } catch (error) {
      console.error("Erreur création catégorie :", error);
    }
  };

  // Supprimer une catégorie via la modale
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

  // Activer l'édition
  const startEditing = (cat: Category) => {
    setEditingId(cat.idCategory);
    setEditName(cat.name);
  };

  // Sauvegarder l'édition
  const saveEditing = async (id: number) => {
    try {
      const updated = await apiFetch<Category>(`/categories/${id}`, {
        method: "PUT",
        body: JSON.stringify({ name: editName }),
      });

      setCategories((prev) =>
        prev.map((c) => (c.idCategory === id ? (updated ?? { ...c, name: editName }) : c))
      );
      setEditingId(null);
    } catch (error) {
      console.error("Erreur modification catégorie :", error);
    }
  };

  // --- Calculs de la pagination ---
  const totalPages = Math.ceil(categories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCategories = categories.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Gestion des Catégories</h2>
      </div>

      {/* Formulaire d'ajout rapide */}
      <form onSubmit={handleCreate} className="flex gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
        <input
          type="text"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          placeholder="Nouvelle catégorie..."
          className="flex-1 px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        />
        <button
          type="submit"
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm transition cursor-pointer"
        >
          + Ajouter
        </button>
      </form>

      {/* Tableau des catégories */}
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-100/70">
              <th className="p-4 text-slate-700 font-bold">ID</th>
              <th className="p-4 text-slate-700 font-bold">Nom</th>
              <th className="p-4 text-slate-700 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentCategories.map((cat) => {
              const isEditing = editingId === cat.idCategory;

              return (
                <tr key={cat.idCategory} className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 text-slate-900 font-medium">{cat.idCategory}</td>
                  
                  <td className="p-4 text-slate-900 font-medium">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full px-3 py-1 bg-white border border-blue-500 rounded text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                    ) : (
                      cat.name
                    )}
                  </td>

                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      {isEditing ? (
                        <>
                          <button
                            onClick={() => saveEditing(cat.idCategory)}
                            className="px-3 py-2 font-bold text-white bg-green-600 hover:bg-green-700 rounded shadow-sm cursor-pointer text-xs transition"
                          >
                            Valider
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-3 py-2 font-bold text-slate-700 bg-slate-200 hover:bg-slate-300 rounded shadow-sm cursor-pointer text-xs transition"
                          >
                            Annuler
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEditing(cat)}
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

      {/* --- Modale de confirmation centralisée --- */}
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