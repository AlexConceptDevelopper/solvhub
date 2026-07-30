import { useState, useEffect } from "react";
import { apiFetch } from "../../api/client";
import { createEquipment, updateEquipment, deleteEquipment } from "../../api/equipment.api.ts"; // Import depuis ton fichier API
import useAsync from "../../hooks/useAsync";
import ConfirmModal from "../ConfirmModal";
import Pagination from "../Pagination";
import type { Category } from "../../types/category";
import type { Equipment, EquipmentCreate } from "../../types/equipment";

interface EquipmentsListProps {
  equipments: Equipment[];
  setEquipments: React.Dispatch<React.SetStateAction<Equipment[]>>;
  search: string;
}

export default function EquipmentsList({
  equipments,
  setEquipments,
  search,
}: EquipmentsListProps) {
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const { execute: executeCategories } = useAsync<Category[]>();
  const { execute: executeDelete, loading: isDeleting } = useAsync<void>();
  const { execute: executeCreate, loading: isCreating } = useAsync<Equipment | null>();
  const { execute: executeUpdate, loading: isUpdating } = useAsync<Equipment | null>();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newBrand, setNewBrand] = useState("");
  const [newModel, setNewModel] = useState("");
  const [newCategoryId, setNewCategoryId] = useState<number | string>("");

  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);
  const [editBrand, setEditBrand] = useState("");
  const [editModel, setEditModel] = useState("");
  const [editCategoryId, setEditCategoryId] = useState<number | string>("");

  const [equipmentToDelete, setEquipmentToDelete] = useState<number | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    let isMounted = true;
    const fetchCategories = async () => {
      const data = await executeCategories(async () => {
        return await apiFetch<Category[]>("/categories");
      });
      if (isMounted && data) {
        setAllCategories(data);
      }
    };
    fetchCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  const confirmDelete = async () => {
    if (equipmentToDelete === null) return;

    await executeDelete(async () => {
      await deleteEquipment(equipmentToDelete); // Utilisation de l'API centralisée
      setEquipments((prev) => prev.filter((eq) => eq.idEquipment !== equipmentToDelete));
    });

    setEquipmentToDelete(null);
  };

  const handleCreateEquipment = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: EquipmentCreate = {
      category: { idCategory: Number(newCategoryId) },
      brand: newBrand,
      model: newModel,
    };

    const created = await executeCreate(async () => {
      return await createEquipment(payload); // Utilisation de l'API centralisée
    });

    if (created) {
      setEquipments((prev) => [created, ...prev]);
      setNewBrand("");
      setNewModel("");
      setNewCategoryId("");
      setIsCreateModalOpen(false);
    }
  };

  const openEditModal = (eq: Equipment) => {
    setEditingEquipment(eq);
    setEditBrand(eq.brand || "");
    setEditModel(eq.model || "");
    setEditCategoryId(eq.category?.idCategory ? Number(eq.category.idCategory) : "");
  };

  const closeEditModal = () => {
    setEditingEquipment(null);
    setEditBrand("");
    setEditModel("");
    setEditCategoryId("");
  };

  const saveEditing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEquipment?.idEquipment) return;

    // CORRECTION : Utilisation de editBrand, editModel et editCategoryId (et non "new...")
    const payload: EquipmentCreate = {
      category: { idCategory: Number(editCategoryId) },
      brand: editBrand,
      model: editModel,
    };

    const updatedEquipment = await executeUpdate(async () => {
      return await updateEquipment(editingEquipment.idEquipment, payload); // Utilisation de l'API centralisée
    });

    if (updatedEquipment) {
      setEquipments((prev) =>
        prev.map((eq) => (eq.idEquipment === editingEquipment.idEquipment ? updatedEquipment : eq))
      );
      closeEditModal();
    }
  };

  const filteredEquipments = equipments.filter((eq) => {
    if (!eq) return false;
    const brand = eq.brand?.toLowerCase() || "";
    const model = eq.model?.toLowerCase() || "";
    const searchLower = search.toLowerCase();
    return brand.includes(searchLower) || model.includes(searchLower);
  });

  const totalPages = Math.ceil(filteredEquipments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentEquipments = filteredEquipments.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [filteredEquipments.length, totalPages, currentPage]);

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Gestion des Équipements</h2>
        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-sm transition cursor-pointer"
        >
          + Créer un équipement
        </button>
      </div>

      <p className="text-slate-500 text-sm">{filteredEquipments.length} équipement(s) trouvé(s)</p>

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-100/70">
              <th className="p-4 text-slate-700 font-bold">ID</th>
              <th className="p-4 text-slate-700 font-bold">Marque</th>
              <th className="p-4 text-slate-700 font-bold">Modèle</th>
              <th className="p-4 text-slate-700 font-bold">Catégorie</th>
              <th className="p-4 text-slate-700 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentEquipments.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-center text-slate-400 text-sm">
                  Aucun équipement trouvé.
                </td>
              </tr>
            ) : (
              currentEquipments.map((eq, index) => (
                <tr key={eq.idEquipment ?? index} className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
                  <td className="p-4 text-slate-900 font-medium">{eq.idEquipment}</td>
                  <td className="p-4 text-slate-900 font-medium">{eq.brand}</td>
                  <td className="p-4 text-slate-900 font-medium">{eq.model}</td>
                  <td className="p-4 text-slate-700">
                    <span className="px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-full text-xs font-medium">
                      {eq.category?.icon ? `${eq.category.icon} ` : ""}
                      {eq.category?.name || "Aucune"}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEditModal(eq)}
                        className="px-3 py-2 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded text-xs cursor-pointer shadow-sm transition"
                      >
                        Modifier
                      </button>
                      <button
                        type="button"
                        onClick={() => setEquipmentToDelete(eq.idEquipment)}
                        className="px-3 py-2 font-bold text-white bg-red-600 hover:bg-red-700 rounded text-xs cursor-pointer shadow-sm transition"
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

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(page) => setCurrentPage(page)} />

      {/* Modale de Création */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg p-6 space-y-6 my-8">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <h3 className="text-xl font-bold text-slate-900">Créer un nouvel équipement</h3>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateEquipment} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Marque</label>
                <input
                  type="text"
                  value={newBrand}
                  onChange={(e) => setNewBrand(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-500 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Modèle</label>
                <input
                  type="text"
                  value={newModel}
                  onChange={(e) => setNewModel(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-500 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Catégorie associée</label>
                <select
                  value={newCategoryId}
                  onChange={(e) => setNewCategoryId(e.target.value ? Number(e.target.value) : "")}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-500 text-sm cursor-pointer"
                  required
                >
                  <option value="" disabled>Sélectionner une catégorie</option>
                  {allCategories.map((cat, index) => (
                    <option key={cat.idCategory ?? index} value={cat.idCategory}>
                      {cat.icon ? `${cat.icon} ` : ""}{cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm cursor-pointer transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-4 py-2 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl text-sm cursor-pointer shadow-sm transition disabled:opacity-50"
                >
                  {isCreating ? "Création..." : "Créer l'équipement"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modale d'Édition */}
      {editingEquipment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg p-6 space-y-6 my-8">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <h3 className="text-xl font-bold text-slate-900">
                Modifier l'équipement #{editingEquipment.idEquipment}
              </h3>
              <button
                type="button"
                onClick={closeEditModal}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={saveEditing} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Marque</label>
                <input
                  type="text"
                  value={editBrand}
                  onChange={(e) => setEditBrand(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-500 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Modèle</label>
                <input
                  type="text"
                  value={editModel}
                  onChange={(e) => setEditModel(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-500 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Catégorie associée</label>
                <select
                  value={editCategoryId}
                  onChange={(e) => setEditCategoryId(e.target.value ? Number(e.target.value) : "")}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-500 text-sm cursor-pointer"
                  required
                >
                  <option value="" disabled>Sélectionner une catégorie</option>
                  {allCategories.map((cat, index) => (
                    <option key={cat.idCategory ?? index} value={cat.idCategory}>
                      {cat.icon ? `${cat.icon} ` : ""}{cat.name}
                    </option>
                  ))}
                </select>
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
                  disabled={isUpdating}
                  className="px-4 py-2 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl text-sm cursor-pointer shadow-sm transition disabled:opacity-50"
                >
                  {isUpdating ? "Enregistrement..." : "Enregistrer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={equipmentToDelete !== null}
        title="Confirmer la suppression"
        message="Es-tu sûr de vouloir supprimer cet équipement ? Cela risque d'affecter les problèmes liés."
        confirmText={isDeleting ? "Suppression..." : "Oui, supprimer"}
        variant="danger"
        onClose={() => setEquipmentToDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}