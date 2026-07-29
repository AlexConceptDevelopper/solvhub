import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProblems } from "../api/problem.api";
import type { Problem } from "../types/problem";
import ProblemCard from "./ProblemCard";
import useAsync from "../hooks/useAsync";
import ErrorMessage from "./ErrorMessage";

interface RecentProblemsProps {
  returnTo?: string;
  returnLabel?: string;
}

export default function RecentProblems({
  returnTo = "/",
  returnLabel = "Retour",
}: RecentProblemsProps) {
  const [problems, setProblems] = useState<Problem[]>([]);
  const { loading, error, execute } = useAsync<Problem[]>();
  const navigate = useNavigate();

  useEffect(() => {
    const loadProblems = async () => {
      const data = await execute(() => getProblems());
      if (data) {
        const sortedAndSliced = [...data]
          .sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateB - dateA;
          })
          .slice(0, 4);

        setProblems(sortedAndSliced);
      }
    };

    loadProblems();
  }, []);

  if (error) {
    return (
      <ErrorMessage
        message={error}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
          Actualité
        </span>
        <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 mt-3">
          Derniers problèmes résolus ou actifs
        </h2>
        <p className="text-slate-500 text-sm md:text-base mt-2">
          Découvrez les dernières contributions de la communauté.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-stretch">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-slate-200/40 rounded-2xl p-6 border border-slate-200/60 h-48 animate-pulse flex flex-col justify-between"
            >
              <div>
                <div className="h-5 bg-slate-300/60 rounded-md w-3/4 mb-3" />
                <div className="h-4 bg-slate-300/60 rounded-md w-1/2 mb-2" />
                <div className="h-3 bg-slate-300/40 rounded-md w-full mb-1" />
                <div className="h-3 bg-slate-300/40 rounded-md w-5/6" />
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                <div className="h-4 bg-slate-300/60 rounded-full w-16" />
                <div className="h-6 bg-slate-300/60 rounded-md w-24" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Ajout de `items-stretch` pour forcer la même hauteur par ligne */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-stretch">
          {problems.map((problem) => (
            <div
              key={problem.idProblem}
              onClick={() =>
                navigate(`/problem/${problem.idProblem}`, {
                  state: { returnTo, returnLabel },
                })
              }
              className="cursor-pointer transition-transform hover:-translate-y-1 h-full flex flex-col"
            >
              <div className="h-full flex flex-col">
                <ProblemCard problem={problem} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}