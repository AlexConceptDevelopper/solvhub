import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProblems } from "../api/problem.api";
import type { Problem } from "../types/problem";
import ProblemCard from "../components/ProblemCard";
import useAsync from "../hooks/useAsync";
import ErrorMessage from "../components/ErrorMessage";
import BackButton from "../components/BackButton";
import EmptyState from "../components/EmptyState";
import LoadingStateProps from "../components/LoadingState";

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
    return <LoadingStateProps label="Chargement..." />;
  }

  if (error) {
    return (
      <div className="max-w-5xl px-4 md:px-8 mx-auto mt-6">
        <ErrorMessage message={error} onRetry={() => window.location.reload()} />
      </div>
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
    <div className="max-w-5xl px-4 md:px-8 mx-auto mt-6 space-y-8">
      <div className="flex items-center justify-between">
        <BackButton to="/categories" label="Retour aux catégories" />
      </div>

      <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
        {category && <span>{category.icon}</span>}
        <span>{category ? category.name : "Catégorie"}</span>
      </h1>

      <p className="text-slate-500 -mt-4">
        {categoryProblems.length} problème(s) trouvé(s)
      </p>

      {categoryProblems.length === 0 ? (
        <EmptyState title="Aucun problème disponible pour cette catégorie pour le moment." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryProblems.map((problem) => (
            <ProblemCard key={problem.idProblem} problem={problem} />
          ))}
        </div>
      )}
    </div>
  );
}