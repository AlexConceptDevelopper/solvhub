import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { getProblemById } from "../api/problem.api";
import { getSolutionsByProblem } from "../api/solution.api";

import SolutionCard from "../components/SolutionCard";

import type { Problem } from "../types/problem";
import type { Solution } from "../types/solution";
import ErrorMessage from "../components/ErrorMessage";

export default function ProblemDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [problem, setProblem] = useState<Problem | null>(null);
  const [solutions, setSolutions] = useState<Solution[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProblem = async () => {
    if (!id) return;

    const problemId = Number(id);

    if (Number.isNaN(problemId)) {
      setError("Identifiant de problème invalide");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const problemData = await getProblemById(problemId);
      setProblem(problemData);

      const solutionsData = await getSolutionsByProblem(problemId);
      setSolutions(solutionsData);
    } catch (error) {
      console.error(error);
      setError("Impossible de charger le problème");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProblem();
  }, [id]);

  if (loading) {
    return (
      <div
        className="
        max-w-4xl
        mx-auto
        text-center
        text-slate-500
      "
      >
        Chargement...
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadProblem} />;
  }

  if (!problem) {
    return null;
  }

  return (
    <div
      className="
        max-w-4xl
        mx-auto
        space-y-10
      "
    >
      {/* PROBLEME */}

      <section
        className="
          bg-white/80
          backdrop-blur
          rounded-3xl
          border
          border-slate-200
          shadow-md
          p-8
        "
      >
        <span
          className="
            inline-block
            text-sm
            font-semibold
            text-blue-600
            bg-blue-50
            px-3
            py-1
            rounded-full
          "
        >
          {problem.category}
        </span>

        <h1
          className="
            mt-5
            text-3xl
            md:text-4xl
            font-bold
            text-slate-800
          "
        >
          {problem.title}
        </h1>

        <p
          className="
            mt-5
            text-slate-600
            text-lg
            leading-relaxed
          "
        >
          {problem.description}
        </p>

        {problem.createdAt && (
          <p
            className="
              mt-6
              text-sm
              text-slate-400
            "
          >
            Créé le {new Date(problem.createdAt).toLocaleDateString("fr-FR")}
          </p>
        )}

        <button
          onClick={() =>
            navigate(`/problem/${problem.idProblem}/create-solution`)
          }
          className="
            mt-8
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
          Proposer une solution
        </button>
      </section>

      {/* SOLUTIONS */}
      <section>
        <div
          className="
            flex
            justify-between
            items-center
            mb-6
          "
        >
          <div>
            <h2
              className="
                text-2xl
                font-bold
                text-slate-800
              "
            >
              Solutions
            </h2>

            <p
              className="
                text-slate-500
                mt-1
              "
            >
              Les solutions proposées par la communauté.
            </p>
          </div>

          <span
            className="
              text-sm
              text-slate-400
            "
          >
            {solutions.length} solution(s)
          </span>
        </div>

        {solutions.length === 0 && (
          <div
            className="
              bg-white/70
              rounded-2xl
              border
              border-slate-200
              p-6
              text-center
              text-slate-500
            "
          >
            Aucune solution disponible pour le moment.
          </div>
        )}
        <div
          className="
            space-y-5
          "
        >
          {solutions.map((solution) => (
            <SolutionCard key={solution.idSolution} solution={solution} />
          ))}
        </div>
      </section>
    </div>
  );
}
