import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../api/client";
import { deleteProblem, updateProblem } from "../../api/problem.api";
import type { Problem } from "../../types/problem";
import SearchFilterBar from "../SearchFilterBar";
import ConfirmModal from "../ConfirmModal";
import Pagination from "../Pagination";
import ErrorMessage from "../ErrorMessage"; // Import du composant d'erreur

interface ProblemsListProps {
  problems: Problem[];
  setProblems: React.Dispatch<React.SetStateAction<Problem[]>>;
  search: string; 
}

interface Category {
  idCategory?: number;
  name: string;
  icon?: string;
}

export default function ProblemsList({
  problems,
  setProblems,
  search,
}: ProblemsListProps) {
  const [category, setCategory] = useState("Toutes");
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // État pour l'erreur visuelle
  const navigate = useNavigate();

  const [editingProblem, setEditingProblem] = useState<Problem | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editCategoryName, setEditCategoryName] = useState("");

  const [problemToDelete, setProblemToDelete] = useState<number | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await apiFetch<Category[]>("/categories");
        if (data) {
          setAllCategories(data);
        }
      } catch (error) {
        console.error("Erreur chargement des catégories :", error);
      }
    };
    fetchCategories();
  }, []);

  const confirmDelete = async () => {
    if (problemToDelete === null) return;
    setErrorMessage(null); // Réinitialiser l'erreur

    try {
      await deleteProblem(problemToDelete);
      setProblems((prev) =>
        prev.filter((p) => p.idProblem !== problemToDelete),
      );
      setProblemToDelete(null);
    } catch (error: any) {
      // Récupération propre du message renvoyé par l'API
      const message = error?.message || "Impossible de supprimer ce problème car il est lié à des solutions.";
      setErrorMessage(message);
      setProblemToDelete(null);
    }
  };

  const openEditModal = (problem: Problem) => {
    setEditingProblem(problem);
    setEditTitle(problem.title);
    setEditDescription(problem.description || "");
    setEditCategoryName(problem.category?.name || "");
    setErrorMessage(null);
  };

  const closeEditModal = () => {
    setEditingProblem(null);
  };

  const saveEditing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProblem) return;
    setErrorMessage(null);

    const selectedCategory = allCategories.find(
      (cat) => cat.name === editCategoryName
    );

    try {
      const updatedProblem = await updateProblem(editingProblem.idProblem, {
        title: editTitle,
        description: editDescription,
        idCategory: selectedCategory?.idCategory,
      } as any);

      setProblems((prev) =>
        prev.map((p) =>
          p.idProblem === editingProblem.idProblem
            ? ((updatedProblem ?? {
                ...p,
                title: editTitle,
                description: editDescription,
                category: selectedCategory
                  ? { ...p.category, idCategory: selectedCategory.idCategory, name: selectedCategory.name }
                  : p.category,
              }) as Problem)
            : p,
        ),
      );
      closeEditModal();
    } catch (error: any) {
      const message = error?.message || "Erreur lors de la modification du problème.";
      setErrorMessage(message);
    }
  };

  const categoryCounts = problems.reduce(
    (acc, p) => {
      const catName = p.category?.name;
      if (catName) {
        acc[catName] = (acc[catName] || 0) + 1;
      }
      return acc;
    },
    {} as Record<string, number>,
  );

  const uniqueCategories = Object.keys(categoryCounts).map((catName) => ({
    name: catName,
    count: categoryCounts[catName],
  }));

  const filteredProblems = problems.filter((problem) => {
    if (!problem) return false;

    const title = problem.title?.toLowerCase() || "";
    const description = problem.description?.toLowerCase() || "";
    const searchLower = search.toLowerCase();

    const matchesSearch =
      title.includes(searchLower) || description.includes(searchLower);
    const matchesCategory =
      category === "Toutes" ||
      (problem.category && problem.category.name === category);

    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredProblems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProblems = filteredProblems.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [filteredProblems.length, totalPages, currentPage]);

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">
          Gestion des Problèmes
        </h2>
        <button
          onClick={() => navigate("/problem/create")}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-sm transition cursor-pointer"
        >
          + Créer un problème
        </button>
      </div>

      {/* Affichage de l'alerte d'erreur si la suppression ou modif échoue */}
      {errorMessage && (
        <ErrorMessage 
          message={errorMessage} 
          onRetry={() => setErrorMessage(null)} 
        />
      )}

      <SearchFilterBar
        category={category}
        setCategory={(val) => {
          setCategory(val);
          setCurrentPage(1);
        }}
        uniqueCategories={uniqueCategories}
      />

      <p className="text-slate-500 text-sm">
        {filteredProblems.length} problème(s) trouvé(s)
      </p>

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-100/70">
              <th className="p-4 text-slate-700 font-bold">ID</th>
              <th className="p-4 text-slate-700 font-bold">Titre</th>
              <th className="p-4 text-slate-700 font-bold">Catégorie</th>
              <th className="p-4 text-slate-700 font-bold">Créateur</th>
              <th className="p-4 text-slate-700 font-bold text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentProblems.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="p-4 text-center text-slate-400 text-sm"
                >
                  Aucun problème trouvé.
                </td>
              </tr>
            ) : (
              currentProblems.map((problem) => (
                <tr
                  key={problem.idProblem}
                  className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors"
                >
                  <td className="p-4 text-slate-900 font-medium">
                    {problem.idProblem}
                  </td>
                  <td className="p-4 text-slate-900 font-medium">
                    {problem.title}
                  </td>
                  <td className="p-4 text-slate-700">
                    <span className="px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-full text-xs font-medium">
                      {problem.category?.name || "Aucune"}
                    </span>
                  </td>
                  <td className="p-4 text-slate-900 font-medium">
                    {problem.user?.username || "Anonyme"}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() =>
                          navigate(
                            `/problem/${problem.idProblem}/create-solution`,
                            {
                              state: { fromAdmin: true },
                            },
                          )
                        }
                        className="px-3 py-2 font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded text-xs cursor-pointer shadow-sm transition"
                      >
                        + Solution
                      </button>
                      <button
                        onClick={() => openEditModal(problem)}
                        className="px-3 py-2 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded text-xs cursor-pointer shadow-sm transition"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => {
                          setErrorMessage(null);
                          setProblemToDelete(problem.idProblem);
                        }}
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

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />

      {editingProblem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-2xl p-6 space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <h3 className="text-xl font-bold text-slate-900">
                Modifier le problème #{editingProblem.idProblem}
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
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Titre du problème
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm resize-y"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Catégorie
                </label>
                <select
                  value={editCategoryName}
                  onChange={(e) => setEditCategoryName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-500 text-sm cursor-pointer"
                >
                  <option value="" disabled>
                    Sélectionner une catégorie
                  </option>
                  {allCategories.map((cat, idx) => (
                    <option key={cat.idCategory || idx} value={cat.name}>
                      {cat.icon ? `${cat.icon} ` : ""}
                      {cat.name}
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
                  className="px-4 py-2 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl text-sm cursor-pointer shadow-sm transition"
                >
                  Enregistrer les modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={problemToDelete !== null}
        title="Confirmer la suppression"
        message="Es-tu sûr de vouloir supprimer ce problème ? Cette action est définitive."
        confirmText="Oui, supprimer"
        variant="danger"
        onClose={() => setProblemToDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}