import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProblems } from "../api/problem.api";
import type { Problem } from "../types/problem";
import ProblemCard from "../components/ProblemCard";
import useAsync from "../hooks/useAsync";
import ErrorMessage from "../components/ErrorMessage";

export default function ProblemsPage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const { loading, error, execute } = useAsync<Problem[]>();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Toutes");

  const navigate = useNavigate();

  useEffect(() => {
    const loadProblems = async () => {
      const data = await execute(() => getProblems());

      if (data) {
        setProblems(data);
      }
    };

    loadProblems();
  }, []);

  //section recherche et filtre
  const filteredProblems = problems.filter((problem) => {
    const matchesSearch =
      problem.title.toLowerCase().includes(search.toLowerCase()) ||
      problem.description.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      category === "Toutes" || problem.category.name === category;

    return matchesSearch && matchesCategory;
  });

  // 1) Pendant le chargement
  if (loading) {
    return <div className="text-center text-slate-500">Chargement...</div>;
  }

  // 2) Si erreur API
  if (error) {
    return (
      <ErrorMessage message={error} onRetry={() => window.location.reload()} />
    );
  }

  // 3) Sinon on affiche la page normale

  return (
    <div>
      <h1
        className="
          text-3xl
          font-bold
          text-slate-800
          mb-8
        "
      >
        Tous les problèmes
      </h1>

      <div
        className="
    mb-8
    bg-white/70
    rounded-2xl
    border
    border-slate-200
    p-6
    flex
    flex-col
    md:flex-row
    md:items-center
    md:justify-between
    gap-4
  "
      >
        <div>
          <h2
            className="
              text-lg
              font-bold
              text-slate-800
            "
          >
            Vous ne trouvez pas votre problème ?
          </h2>

          <p
            className="
            text-slate-500
            mt-1
          "
          >
            Créez une nouvelle question et obtenez de l'aide de la communauté.
          </p>
        </div>

        <button
          onClick={() => navigate("/problem/create")}
          className="
            bg-blue-600
            text-white
            px-5
            py-3
            rounded-xl
            font-semibold
            hover:bg-blue-700
            transition
          "
        >
          + Poser un problème
        </button>
      </div>

      <div
        className="
          flex
          flex-col
          md:flex-row
          gap-4
          mb-8
        "
      >
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un problème..."
          className="
            flex-1
            rounded-xl
            border
            border-slate-300
            px-4
            py-3
          "
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="
            rounded-xl
            border
            border-slate-300
            px-4
            py-3
            bg-white
          "
        >
          <option>Toutes</option>

          <option>Informatique</option>

          <option>Maison</option>

          <option>Automobile</option>

          <option>Électronique</option>

          <option>Autre</option>
        </select>
      </div>

      <p
        className="
          mb-6
          text-slate-500
        "
      >
        {filteredProblems.length} problème(s) trouvé(s)
      </p>

      {filteredProblems.length === 0 ? (
        <div
          className="
          bg-white/70
          rounded-2xl
          border
          border-slate-200
          p-8
          text-center
        "
        >
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
                className="
                  mt-4
                  text-blue-600
                  font-semibold
                  hover:underline
                "
              >
                Réinitialiser les filtres
              </button>
            </>
          )}
        </div>
      ) : (
        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            lg:grid-cols-3
            gap-6
          "
        >
          {filteredProblems.map((problem) => (
            <ProblemCard key={problem.idProblem} problem={problem} />
          ))}
        </div>
      )}
    </div>
  );
}
