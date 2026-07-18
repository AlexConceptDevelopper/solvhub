import { useEffect, useState } from "react";
import { getProblems } from "../api/problem.api";
import type { Problem } from "../types/problem";
import ProblemCard from "./ProblemCard";

import useAsync from "../hooks/useAsync";
import ErrorMessage from "./ErrorMessage";

export default function RecentProblems() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const { loading, error, execute } = useAsync<Problem[]>();

  useEffect(() => {
    const loadProblems = async () => {
      const data = await execute(() => getProblems());
      if (data) {
        setProblems(data.slice(0, 4));
      }
    };

    loadProblems();
  }, []);

  if (loading) {
    return (
      <section className="mt-12 text-center text-slate-500">
        Chargement des derniers problèmes...
      </section>
    );
  }

  if (error) {
    return (
      <section className="mt-12">
        <ErrorMessage
          message={error}
          onRetry={() => window.location.reload()}
        />
      </section>
    );
  }

  return (
    <section
      className="
        mt-12
        max-w-6xl
        mx-auto
        px-4
        md:px-6
      "
    >
      <div className="mb-6">
        <h2
          className="
            text-2xl
            md:text-3xl
            font-bold
            text-slate-800
          "
        >
          Derniers problèmes
        </h2>

        <p className="text-slate-500 mt-1">
          Découvrez les problèmes récemment ajoutés.
        </p>
      </div>

      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          gap-6
        "
      >
        {problems.map((problem) => (
          <ProblemCard key={problem.idProblem} problem={problem} />
        ))}
      </div>
    </section>
  );
}