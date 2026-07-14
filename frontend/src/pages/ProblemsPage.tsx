import { useEffect, useState } from "react";
import { getProblems } from "../api/problem.api";
import type { Problem } from "../types/problem";
import ProblemCard from "../components/ProblemCard";

export default function ProblemsPage() {

  const [problems, setProblems] = useState<Problem[]>([]);


  useEffect(() => {

    getProblems()
      .then(setProblems);

  }, []);


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
        Problems
      </h1>


      {
        problems.length === 0 ? (

          <p className="text-slate-500">
            Aucun problème trouvé
          </p>

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

            {
              problems.map((problem) => (

                <ProblemCard
                  key={problem.idProblem}
                  problem={problem}
                />

              ))
            }

          </div>

        )
      }

    </div>

  );
}
