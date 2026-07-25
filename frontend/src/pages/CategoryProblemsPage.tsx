import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProblems } from "../api/problem.api";
import type { Problem } from "../types/problem";
import ProblemCard from "../components/ProblemCard";
import useAsync from "../hooks/useAsync";
import ErrorMessage from "../components/ErrorMessage";

export default function CategoryProblemsPage() {
  const { idCategory } = useParams();

  const [problems, setProblems] = useState<Problem[]>([]);
  const { loading, error, execute } = useAsync<Problem[]>();

  useEffect(() => {
    const loadProblems = async () => {
      const data = await execute(() => getProblems());
      if (data) {
        setProblems(data);
      }
    };
    loadProblems();
  }, []);

  if (loading) {
    return <div className="text-center text-slate-500">Chargement...</div>;
  }

  if (error) {
    return (
      <ErrorMessage message={error} onRetry={() => window.location.reload()} />
    );
  }

  const categoryProblems = problems.filter((problem) => {
    if (!problem.category) {
      console.warn(
        `Problème #${problem.idProblem} sans catégorie détecté`,
        problem,
      );
      return false;
    }
    return problem.category?.idCategory === Number(idCategory);
  });

  const category = categoryProblems[0]?.category;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <Link
          to="/"
          className="
            flex
            items-center
            gap-2
            text-blue-600
            font-semibold
            hover:underline
            w-fit
          "
        >
          ← Retour à l'accueil
        </Link>
        <Link
          to="/categories"
          className="
            flex
            items-center
            gap-2
            text-slate-600
            font-semibold
            hover:underline
            w-fit
          "
        >
          ← Retour aux catégories
        </Link>
      </div>

      <h1
        className="
          text-3xl
          font-bold
          text-slate-800
          mb-8
          flex
          items-center
          gap-3
        "
      >
        {category && <span>{category.icon}</span>}
        <span>{category ? category.name : "Catégorie"}</span>
      </h1>

      <p className="mb-6 text-slate-500">
        {categoryProblems.length} problème(s) trouvé(s)
      </p>

      {categoryProblems.length === 0 ? (
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
          <p className="text-slate-500">
            Aucun problème disponible pour cette catégorie pour le moment.
          </p>
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
          {categoryProblems.map((problem) => (
            <ProblemCard key={problem.idProblem} problem={problem} />
          ))}
        </div>
      )}
    </div>
  );
}