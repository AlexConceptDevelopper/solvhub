import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { getProblemById } from "../api/problem.api";
import { getSolutionsByProblem } from "../api/solution.api";

import SolutionCard from "../components/SolutionCard";

import type { Problem } from "../types/problem";
import type { Solution } from "../types/solution";

import useAsync from "../hooks/useAsync";
import ErrorMessage from "../components/ErrorMessage";

export default function ProblemDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [problem, setProblem] = useState<Problem | null>(null);
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const {
    loading: loadingProblem,
    error: errorProblem,
    execute: executeProblem,
  } = useAsync<Problem>();

  const {
    loading: loadingSolutions,
    error: errorSolutions,
    execute: executeSolutions,
  } = useAsync<Solution[]>();

  useEffect(() => {
    if (!id) return;

    const problemId = Number(id);

    if (Number.isNaN(problemId)) return;

    const load = async () => {
      const problemData = await executeProblem(() => getProblemById(problemId));

      if (problemData) {
        setProblem(problemData);
      }

      const solutionsData = await executeSolutions(() =>
        getSolutionsByProblem(problemId),
      );

      if (solutionsData) {
        setSolutions(solutionsData);
      }
    };

    load();
  }, [id]);

  if (loadingProblem) {
    return (
      <div
        className="
        max-w-4xl
        mx-auto
        text-center
        text-slate-500
      "
      >
        Chargement du problème...
      </div>
    );
  }

  if (errorProblem) {
    return (
      <ErrorMessage
        message={errorProblem}
        onRetry={() => window.location.reload()}
      />
    );
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
      <button
        onClick={() => navigate("/problems")}
        className="
          mb-6
          flex
          items-center
          gap-2
          text-blue-600
          font-semibold
          hover:underline
          cursor-pointer
        "
      >
        ← Retour aux problèmes
      </button>
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
            cursor-pointer
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

        {loadingSolutions && (
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
            Chargement des solutions...
          </div>
        )}

        {errorSolutions && (
          <ErrorMessage
            message={errorSolutions}
            onRetry={() => window.location.reload()}
          />
        )}

        {!loadingSolutions && solutions.length === 0 && (
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
            mt-5
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
