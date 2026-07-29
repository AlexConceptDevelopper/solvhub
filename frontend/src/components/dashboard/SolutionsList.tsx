import { useState, useEffect } from "react";
import { apiFetch } from "../../api/client";
import type { Solution } from "../../types/solution";
import type { SolutionMedia } from "../../types/SolutionMedia";
import ConfirmModal from "../ConfirmModal"; 
import Pagination from "../Pagination";

interface SolutionsListProps {
  solutions: Solution[];
  setSolutions: React.Dispatch<React.SetStateAction<Solution[]>>;
  search: string;
}

export default function SolutionsList({ solutions, setSolutions, search }: SolutionsListProps) {
  const [solutionToDelete, setSolutionToDelete] = useState<number | null>(null);

  // --- États pour la modale de modification complète ---
  const [editingSolution, setEditingSolution] = useState<Solution | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editSteps, setEditSteps] = useState("");
  const [editDifficulty, setEditDifficulty] = useState<number>(1);
  const [editTimeMinutes, setEditTimeMinutes] = useState<number>(10);
  const [editRiskLevel, setEditRiskLevel] = useState<number>(1);
  
  // Médias de la solution en cours d'édition
  const [solutionMedias, setSolutionMedias] = useState<SolutionMedia[]>([]);
  const [mediasToDelete, setMediasToDelete] = useState<number[]>([]); // IDs des médias à supprimer

  // --- États pour la pagination ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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

  // Ouvrir la modale et charger les données + les médias associés
  const openEditModal = async (sol: Solution) => {
    setEditingSolution(sol);
    setEditTitle(sol.title);
    setEditSteps(sol.steps || "");
    setEditDifficulty(sol.difficulty || 1);
    setEditTimeMinutes(sol.timeMinutes || 10);
    setEditRiskLevel(sol.riskLevel || 1);
    setMediasToDelete([]);

    try {
      const mediaData = await apiFetch<SolutionMedia[]>(`/solutions/${sol.idSolution}/media`);
      if (mediaData) {
        setSolutionMedias(mediaData);
      } else {
        setSolutionMedias([]);
      }
    } catch (error) {
      console.error("Erreur chargement médias de la solution :", error);
      setSolutionMedias([]);
    }
  };

  const closeEditModal = () => {
    setEditingSolution(null);
    setSolutionMedias([]);
    setMediasToDelete([]);
  };

  // Marquer un média pour suppression locale (visuel)
  const handleMarkMediaForDelete = (idMedia: number) => {
    setMediasToDelete((prev) => [...prev, idMedia]);
    setSolutionMedias((prev) => prev.filter((m) => m.idMedia !== idMedia));
  };

  // Sauvegarder les modifications globales
  const saveEditing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSolution) return;

    try {
      // 1. Mise à jour des informations textuelles de base de la solution
      const updatedSolution = await apiFetch<Solution>(`/solutions/${editingSolution.idSolution}`, {
        method: "PUT",
        body: JSON.stringify({
          title: editTitle,
          steps: editSteps,
          difficulty: editDifficulty,
          timeMinutes: editTimeMinutes,
          riskLevel: editRiskLevel,
        }),
      });

      // 2. Suppression en base des médias que l'admin a voulu retirer
      for (const mediaId of mediasToDelete) {
        await apiFetch(`/solutions/media/${mediaId}`, { method: "DELETE" }).catch(() => {
          // Si ton endpoint de suppression de média a une route spécifique, adapte-la ici
          // Ex: /solutions/media/{id} ou /media/{id} selon ton back
        });
      }

      setSolutions((prev) =>
        prev.map((s) =>
          s.idSolution === editingSolution.idSolution
            ? (updatedSolution ?? {
                ...s,
                title: editTitle,
                steps: editSteps,
                difficulty: editDifficulty,
                timeMinutes: editTimeMinutes,
                riskLevel: editRiskLevel,
              })
            : s
        )
      );
      closeEditModal();
    } catch (error) {
      console.error("Erreur modification solution :", error);
    }
  };

  // --- Filtrage par recherche ---
  const filteredSolutions = solutions.filter((s) => 
    s.title?.toLowerCase().includes(search.toLowerCase())
  );

  // --- Calculs de la pagination ---
  const totalPages = Math.ceil(filteredSolutions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentSolutions = filteredSolutions.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [filteredSolutions.length, totalPages, currentPage]);

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900">Gestion des Solutions</h2>
      </div>

      <p className="text-slate-500 text-sm">
        {filteredSolutions.length} solution(s) trouvée(s)
      </p>

      {/* Tableau épuré */}
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
            {currentSolutions.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-4 text-center text-slate-400 text-sm">
                  Aucune solution trouvée.
                </td>
              </tr>
            ) : (
              currentSolutions.map((sol) => (
                <tr
                  key={sol.idSolution}
                  className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors"
                >
                  <td className="p-4 text-slate-900 font-medium">{sol.idSolution}</td>
                  <td className="p-4 text-slate-900 font-medium">{sol.title}</td>
                  <td className="p-4 text-slate-900 font-medium">{sol.user?.username || "Anonyme"}</td>
                  <td className="p-4 text-slate-900 font-medium">{sol.difficulty}</td>
                  <td className="p-4 text-slate-900 font-medium">{sol.timeMinutes}</td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openEditModal(sol)}
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
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}

      {/* --- MODALE DE MODIFICATION COMPLÈTE DE LA SOLUTION --- */}
      {editingSolution && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-2xl p-6 space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <h3 className="text-xl font-bold text-slate-900">
                Modifier la solution #{editingSolution.idSolution}
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
                <label className="block text-sm font-semibold text-slate-700 mb-1">Titre de la solution</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Étapes / Description</label>
                <textarea
                  value={editSteps}
                  onChange={(e) => setEditSteps(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm resize-y"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Difficulté (1-5)</label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={editDifficulty}
                    onChange={(e) => setEditDifficulty(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-500 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Temps (minutes)</label>
                  <input
                    type="number"
                    min={1}
                    value={editTimeMinutes}
                    onChange={(e) => setEditTimeMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-500 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Risque (1-5)</label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={editRiskLevel}
                    onChange={(e) => setEditRiskLevel(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-500 text-sm"
                    required
                  />
                </div>
              </div>

              {/* --- SECTION GESTION DES MÉDIAS (Images & Vidéos) --- */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="block text-sm font-semibold text-slate-700">Médias associés (Photos / Vidéo)</label>
                {solutionMedias.length === 0 ? (
                  <p className="text-slate-400 text-xs italic">Aucun média associé à cette solution.</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {solutionMedias.map((media) => (
                      <div key={media.idMedia} className="relative group rounded-xl border border-slate-200 p-2 bg-slate-50 flex flex-col items-center justify-between">
                        {media.type.toUpperCase() === "VIDEO" ? (
                          <div className="w-full h-20 bg-slate-900 rounded-lg flex items-center justify-center text-white text-xs font-semibold px-2 text-center truncate">
                            🎥 Vidéo YouTube
                          </div>
                        ) : (
                          <img src={media.url} alt="Média solution" className="w-full h-20 object-cover rounded-lg" />
                        )}
                        <span className="text-[10px] text-slate-500 mt-1 truncate w-full text-center">{media.type}</span>
                        <button
                          type="button"
                          onClick={() => handleMarkMediaForDelete(media.idMedia)}
                          className="mt-2 w-full py-1 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg text-xs font-semibold cursor-pointer transition"
                        >
                          Supprimer
                        </button>
                      </div>
                    ))}
                  </div>
                )}
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