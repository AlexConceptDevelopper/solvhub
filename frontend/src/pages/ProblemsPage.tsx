import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProblems } from "../api/problem.api";
import type { Problem } from "../types/problem";
import ProblemCard from "../components/ProblemCard";
import useAsync from "../hooks/useAsync";
import ErrorMessage from "../components/ErrorMessage";

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

  // Extraction DYNAMIQUE des catégories existantes directement depuis les problèmes reçus
  // Cela évite de faire un appel API supplémentaire qui pourrait crasher
  const uniqueCategories = Array.from(
    new Set(
      problems
        .map((p) => p.category?.name)
        .filter((name): name is string => Boolean(name))
    )
  );

  // Filtrage ultra-sécurisé contre les valeurs nulles ou undefined
  const filteredProblems = problems.filter((problem) => {
    if (!problem) return false;

    const title = problem.title?.toLowerCase() || "";
    const description = problem.description?.toLowerCase() || "";
    const searchLower = search.toLowerCase();

    const matchesSearch = title.includes(searchLower) || description.includes(searchLower);

    const matchesCategory =
      category === "Toutes" || 
      (problem.category && problem.category.name === category);

    return matchesSearch && matchesCategory;
  });

  // Gestion des états de chargement et d'erreur intégrée au flux (sans casser la Navbar globale si elle est gérée par un Layout)
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
    <div>
      <h1 className="text-3xl font-bold text-slate-800 mb-8">
        Tous les problèmes
      </h1>

      <div className="mb-8 bg-white/70 rounded-2xl border border-slate-200 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800">
            Vous ne trouvez pas votre problème ?
          </h2>
          <p className="text-slate-500 mt-1">
            Créez une nouvelle question et obtenez de l'aide de la communauté.
          </p>
        </div>

        <button
          onClick={() => navigate("/problem/create")}
          className="bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-blue-700 transition cursor-pointer"
        >
          + Poser un problème
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un problème..."
          className="flex-1 rounded-xl border border-slate-300 px-4 py-3 bg-white shadow-sm focus:outline-blue-500"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-xl border border-slate-300 px-4 py-3 bg-white cursor-pointer shadow-sm focus:outline-blue-500"
        >
          <option value="Toutes">Toutes les catégories</option>
          {uniqueCategories.map((catName) => (
            <option key={catName} value={catName}>
              {catName}
            </option>
          ))}
        </select>
      </div>

      <p className="mb-6 text-slate-500">
        {filteredProblems.length} problème(s) trouvé(s)
      </p>

      {filteredProblems.length === 0 ? (
        <div className="bg-white/70 rounded-2xl border border-slate-200 p-8 text-center">
          {problems.length === 0 ? (
            <p className="text-slate-500">
              Aucun problème disponible pour le moment.
            </p>
          ) : (
            <>
              <p className="text-slate-600 font-semibold">
                Aucun problème ne correspond à votre recherche.
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setCategory("Toutes");
                }}
                className="mt-4 text-blue-600 font-semibold hover:underline cursor-pointer"
              >
                Réinitialiser les filtres
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProblems.map((problem) => (
            // On vérifie qu'on a bien un id avant de l'attribuer à la clé
            <ProblemCard key={problem.idProblem || Math.random()} problem={problem} />
          ))}
        </div>
      )}
    </div>
  );
}