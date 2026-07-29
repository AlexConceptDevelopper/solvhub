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
      <section className="mt-16 max-w-6xl mx-auto px-4 md:px-6">
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
        mt-20 
        max-w-6xl 
        mx-auto 
        rounded-3xl 
        bg-slate-50
        p-8 
        md:p-10 
        border 
        border-slate-200/50
      "
    >
      <div className="text-center max-w-xl mx-auto mb-10">
        <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900">
          Derniers problèmes posés
        </h2>
        <p className="text-slate-500 text-sm md:text-base mt-2">
          Rejoignez l'effort collectif et apportez votre expertise aux questions
          récentes.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {problems.map((problem) => (
            <div
              key={problem.idProblem}
              onClick={() =>
                navigate(`/problem/${problem.idProblem}`, {
                  state: { returnTo, returnLabel },
                })
              }
              className="cursor-pointer transition-transform hover:-translate-y-1"
            >
              <ProblemCard problem={problem} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}