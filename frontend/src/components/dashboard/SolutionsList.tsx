import { useEffect, useState } from "react";
import { apiFetch } from "../../api/client";
import type { Solution } from "../../types/solution";
import ConfirmModal from "../ConfirmModal"; 
import Pagination from "../Pagination";

export default function SolutionsList() {
  const [solutions, setSolutions] = useState<Solution[]>([]);

  // État pour gérer la suppression avec la modale
  const [solutionToDelete, setSolutionToDelete] = useState<number | null>(null);

  // States pour la gestion de l'édition en ligne
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDifficulty, setEditDifficulty] = useState<number>(0);
  const [editTimeMinutes, setEditTimeMinutes] = useState<number>(0);

  // --- États pour la pagination ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Nombre d'éléments par page

  useEffect(() => {
    apiFetch<Solution[]>("/solutions/dto").then((data) => {
      if (data) setSolutions(data);
    });
  }, []);

  const confirmDelete = async () => {
    if (solutionToDelete === null) return;
    try {
      await apiFetch(`/solutions/${solutionToDelete}`, { method: "DELETE" });
      setSolutions(solutions.filter((s) => s.idSolution !== solutionToDelete));
    } catch (error) {
      console.error("Erreur suppression solution :", error);
    } finally {
      setSolutionToDelete(null);
    }
  };

  // Activer le mode édition pour une ligne
  const startEditing = (sol: Solution) => {
    setEditingId(sol.idSolution);
    setEditTitle(sol.title);
    setEditDifficulty(sol.difficulty);
    setEditTimeMinutes(sol.timeMinutes);
  };

  // Annuler l'édition
  const cancelEditing = () => {
    setEditingId(null);
  };

  // Sauvegarder les modifications
  const saveEditing = async (id: number) => {
    try {
      const updatedSolution = await apiFetch<Solution>(`/solutions/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          title: editTitle,
          difficulty: editDifficulty,
          timeMinutes: editTimeMinutes,
        }),
      });

      setSolutions((prev) =>
        prev.map((s) =>
          s.idSolution === id
            ? ((updatedSolution ?? {
                ...s,
                title: editTitle,
                difficulty: editDifficulty,
                timeMinutes: editTimeMinutes,
              }) as Solution)
            : s,
        ),
      );
      setEditingId(null);
    } catch (error) {
      console.error("Erreur modification solution :", error);
    }
  };

  // --- Calculs de la pagination (côté client) ---
  const totalPages = Math.ceil(solutions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentSolutions = solutions.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Gestion des Solutions</h2>
      </div>

      <p className="text-slate-500 text-sm">
        {solutions.length} solution(s) trouvée(s)
      </p>

      {/* Tableau des solutions en mode Light harmonisé */}
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-100/70">
              <th className="p-4 text-slate-700 font-bold">ID</th>
              <th className="p-4 text-slate-700 font-bold">Titre</th>
              <th className="p-4 text-slate-700 font-bold">Créateur</th>
              <th className="p-4 text-slate-700 font-bold">Difficulté</th>
              <th className="p-4 text-slate-700 font-bold">Temps (min)</th>
              <th className="p-4 text-slate-700 font-bold text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentSolutions.map((sol) => {
              const isEditing = editingId === sol.idSolution;

              return (
                <tr
                  key={sol.idSolution}
                  className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors"
                >
                  <td className="p-4 text-slate-900 font-medium">
                    {sol.idSolution}
                  </td>

                  {/* Titre : Input si édition, texte sinon */}
                  <td className="p-4 text-slate-900 font-medium">
                    {isEditing ? (
                      <textarea
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        rows={2}
                        className="w-full px-3 py-1.5 bg-white border border-blue-500 rounded text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-inner resize-y"
                      />
                    ) : (
                      sol.title
                    )}
                  </td>

                  <td className="p-4 text-slate-900 font-medium">
                    {sol.user?.username || "Anonyme"}
                  </td>

                  {/* Difficulté : Input nombre si édition, texte sinon */}
                  <td className="p-4 text-slate-900 font-medium">
                    {isEditing ? (
                      <input
                        type="number"
                        value={editDifficulty}
                        onChange={(e) =>
                          setEditDifficulty(Number(e.target.value))
                        }
                        className="px-2 py-1 bg-white border border-slate-300 rounded text-slate-900 w-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      />
                    ) : (
                      sol.difficulty
                    )}
                  </td>

                  {/* Temps : Input nombre si édition, texte sinon */}
                  <td className="p-4 text-slate-900 font-medium">
                    {isEditing ? (
                      <input
                        type="number"
                        value={editTimeMinutes}
                        onChange={(e) =>
                          setEditTimeMinutes(Number(e.target.value))
                        }
                        className="px-2 py-1 bg-white border border-slate-300 rounded text-slate-900 w-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      />
                    ) : (
                      sol.timeMinutes
                    )}
                  </td>

                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      {isEditing ? (
                        <>
                          <button
                            onClick={() => saveEditing(sol.idSolution)}
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
                            onClick={() => startEditing(sol)}
                            className="px-3 py-2 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded shadow-sm cursor-pointer text-xs transition"
                          >
                            Modifier
                          </button>
                          <button
                            onClick={() => setSolutionToDelete(sol.idSolution)}
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
        isOpen={solutionToDelete !== null}
        title="Confirmer la suppression"
        message="Es-tu sûr de vouloir supprimer cette solution ? Cette action est définitive."
        confirmText="Oui, supprimer"
        variant="danger"
        onClose={() => setSolutionToDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}