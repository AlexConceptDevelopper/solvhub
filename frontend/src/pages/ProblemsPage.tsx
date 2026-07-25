import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProblems } from "../api/problem.api";
import type { Problem } from "../types/problem";
import useAsync from "../hooks/useAsync";
import ErrorMessage from "../components/ErrorMessage";
import SearchFilterBar from "../components/SearchFilterBar";
import { matchesSearchQuery } from "../utils/searchUtils";

export default function ProblemsPage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Toutes");

  const navigate = useNavigate();
  const { loading, error, execute } = useAsync<Problem[]>();

  useEffect(() => {
    let isMounted = true;

    const loadProblems = async () => {
      try {
        const data = await execute(() => getProblems());
        if (data && isMounted) {
          setProblems(data);
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des problèmes:", err);
      }
    };

    loadProblems();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const uniqueCategories = Array.from(
    new Set(
      problems
        .map((p) => p.category?.name)
        .filter((name): name is string => Boolean(name))
    )
  );

  const filteredProblems = problems.filter((problem) => {
    if (!problem) return false;

    const matchesSearch =
      matchesSearchQuery(problem.title, search) ||
      matchesSearchQuery(problem.description, search);

    const matchesCategory =
      category === "Toutes" || 
      (problem.category && problem.category.name === category);

    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return <div className="text-center text-slate-500 py-12">Chargement des problèmes...</div>;
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorMessage message={error} onRetry={() => window.location.reload()} />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* En-tête de la page */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Tous les problèmes
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Consultez les difficultés rencontrées par la communauté ou proposez vos solutions.
          </p>
        </div>

        <button
          onClick={() => navigate("/problem/create")}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-blue-700 transition shadow-sm hover:shadow cursor-pointer w-fit"
        >
          + Poser un problème
        </button>
      </div>

      {/* Barre de recherche et filtres */}
      <SearchFilterBar
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
        uniqueCategories={uniqueCategories}
      />

      <div className="flex justify-between items-center text-sm text-slate-500 px-1">
        <span>{filteredProblems.length} problème(s) trouvé(s)</span>
      </div>

      {/* Liste flux moderne */}
      {filteredProblems.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
          {problems.length === 0 ? (
            <p className="text-slate-500">
              Aucun problème disponible pour le moment.
            </p>
          ) : (
            <>
              <p className="text-slate-700 font-semibold">
                Aucun problème ne correspond à votre recherche.
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setCategory("Toutes");
                }}
                className="mt-4 text-blue-600 font-semibold hover:underline cursor-pointer text-sm"
              >
                Réinitialiser les filtres
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
          {filteredProblems.map((problem) => (
            <div
              key={problem.idProblem || Math.random()}
              onClick={() => navigate(`/problem/${problem.idProblem}`)}
              className="p-6 hover:bg-slate-50/80 transition cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3 text-xs">
                  {problem.category && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium">
                      <span>{problem.category.icon || "🏷️"}</span>
                      <span>{problem.category.name}</span>
                    </span>
                  )}
                  {problem.createdAt && (
                    <span className="text-slate-400">
                      {new Date(problem.createdAt).toLocaleDateString("fr-FR")}
                    </span>
                  )}
                </div>

                <h2 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition">
                  {problem.title}
                </h2>

                <p className="text-sm text-slate-600 line-clamp-2">
                  {problem.description}
                </p>
              </div>

              <div className="flex items-center self-end md:self-center">
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition">
                  Voir les solutions →
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}