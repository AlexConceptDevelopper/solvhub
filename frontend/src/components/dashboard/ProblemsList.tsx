import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../api/client";
import type { Problem } from "../../types/problem";
import SearchFilterBar from "../SearchFilterBar"; 
import ConfirmModal from "../ConfirmModal"; 
import Pagination from "../Pagination"; // Import du composant Pagination

export default function ProblemsList() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Toutes");
  const navigate = useNavigate();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  
  // État pour gérer la suppression avec la modale
  const [problemToDelete, setProblemToDelete] = useState<number | null>(null);

  // --- États pour la pagination ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Nombre d'éléments par page

  useEffect(() => {
    apiFetch<Problem[]>("/problems").then((data) => {
      if (data) setProblems(data);
    });
  }, []);

  const confirmDelete = async () => {
    if (problemToDelete === null) return;
    try {
      await apiFetch(`/problems/${problemToDelete}`, { method: "DELETE" });
      setProblems(problems.filter((p) => p.idProblem !== problemToDelete));
    } catch (error) {
      console.error("Erreur suppression problème :", error);
    } finally {
      setProblemToDelete(null);
    }
  };

  const startEditing = (problem: Problem) => {
    setEditingId(problem.idProblem);
    setEditTitle(problem.title);
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  const saveEditing = async (id: number) => {
    try {
      const updatedProblem = await apiFetch<Problem>(`/problems/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          title: editTitle,
        }),
      });

      setProblems((prev) =>
        prev.map((p) =>
          p.idProblem === id
            ? (updatedProblem ?? {
                ...p,
                title: editTitle,
              }) as Problem
            : p
        )
      );
      setEditingId(null);
    } catch (error) {
      console.error("Erreur modification problème :", error);
    }
  };

  // Extraction dynamique des catégories pour le select
  const uniqueCategories = Array.from(
    new Set(
      problems
        .map((p) => p.category?.name)
        .filter((name): name is string => Boolean(name))
    )
  );

  // Filtrage des problèmes pour le tableau admin
  const filteredProblems = problems.filter((problem) => {
    if (!problem) return false;

    const title = problem.title?.toLowerCase() || "";
    const description = problem.description?.toLowerCase() || "";
    const searchLower = search.toLowerCase();

    const matchesSearch = title.includes(searchLower) || description.includes(searchLower);
    const matchesCategory = category === "Toutes" || (problem.category && problem.category.name === category);

    return matchesSearch && matchesCategory;
  });

  // --- Calculs de la pagination basés sur les éléments filtrés ---
  const totalPages = Math.ceil(filteredProblems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProblems = filteredProblems.slice(startIndex, startIndex + itemsPerPage);

  // Réinitialiser la page à 1 si la recherche/filtre change et dépasse le nombre de pages max
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [filteredProblems.length, totalPages, currentPage]);

  return (
    <div className="space-y-6">
      {/* En-tête du dashboard */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Gestion des Problèmes</h2>
        <button
          onClick={() => navigate("/problem/create")}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow transition cursor-pointer"
        >
          + Créer un problème
        </button>
      </div>

      {/* Barre de recherche et filtres mutualisée */}
      <SearchFilterBar
        search={search}
        setSearch={(val) => { setSearch(val); setCurrentPage(1); }} // Remet à la page 1 lors d'une recherche
        category={category}
        setCategory={(val) => { setCategory(val); setCurrentPage(1); }} // Remet à la page 1 lors d'un filtre catégorie
        uniqueCategories={uniqueCategories}
        placeholder="Rechercher un problème dans l'admin..."
      />

      <p className="text-slate-400 text-sm">
        {filteredProblems.length} problème(s) trouvé(s)
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-600 bg-slate-900">
              <th className="p-4 text-white font-bold">ID</th>
              <th className="p-4 text-white font-bold">Titre</th>
              <th className="p-4 text-white font-bold">Catégorie</th>
              <th className="p-4 text-white font-bold">Créateur</th>
              <th className="p-4 text-white font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentProblems.map((problem) => {
              const isEditing = editingId === problem.idProblem;

              return (
                <tr key={problem.idProblem} className="border-b border-slate-700 hover:bg-slate-800 transition-colors">
                  <td className="p-4 text-slate-100 font-medium">{problem.idProblem}</td>
                  
                  <td className="p-4 text-slate-100 font-medium">
                    {isEditing ? (
                      <textarea
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        rows={2}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-blue-500 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner resize-y"
                      />
                    ) : (
                      problem.title
                    )}
                  </td>

                  <td className="p-4 text-slate-300">
                    <span className="px-2.5 py-1 bg-slate-800 border border-slate-600 rounded-full text-xs">
                      {problem.category?.name || "Aucune"}
                    </span>
                  </td>

                  <td className="p-4 text-slate-100 font-medium">
                    {problem.user?.username || "Anonyme"}
                  </td>

                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      {isEditing ? (
                        <>
                          <button
                            onClick={() => saveEditing(problem.idProblem)}
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
                            onClick={() => navigate(`/problem/${problem.idProblem}/create-solution`)}
                            className="px-3 py-2 font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded shadow transition cursor-pointer text-xs"
                            title="Ajouter une solution"
                          >
                            + Solution
                          </button>
                          <button
                            onClick={() => startEditing(problem)}
                            className="px-3 py-2 font-bold text-white bg-blue-600 hover:bg-blue-500 rounded shadow transition cursor-pointer text-xs"
                          >
                            Modifier
                          </button>
                          <button 
                            onClick={() => setProblemToDelete(problem.idProblem)} 
                            className="px-3 py-2 font-bold text-white bg-slate-700 hover:bg-slate-600 rounded shadow transition cursor-pointer text-xs"
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