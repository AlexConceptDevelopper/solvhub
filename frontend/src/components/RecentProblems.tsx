import { useEffect, useState } from "react";
import { getProblems } from "../api/problem.api";
import type { Problem } from "../types/problem";
import ProblemCard from "./ProblemCard";

export default function RecentProblems() {
  const [problems, setProblems] = useState<Problem[]>([]);

  useEffect(() => {
    getProblems().then((data) => {
      // pour le moment on prend les 3 premiers
      setProblems(data.slice(0, 3));
    });
  }, []);

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
          flex
          flex-wrap
          gap-6
          justify-center
        "
      >
        {problems.map((problem) => (
          <ProblemCard key={problem.idProblem} problem={problem} />
        ))}
      </div>
    </section>
  );
}
