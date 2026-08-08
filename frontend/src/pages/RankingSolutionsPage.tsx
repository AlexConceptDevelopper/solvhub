import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { apiFetch } from "../api/client";
import type { Solution } from "../types/solution";

export default function RankingSolutionsPage() {
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    apiFetch<Solution[]>("/ranking")
      .then((data) => {
        if (data) setSolutions(data);
      })
      .catch((error) => console.error("Erreur chargement classement complet :", error))
      .finally(() => setLoading(false));
  }, []);

  const top3 = solutions.slice(0, 3);
  const restOfSolutions = solutions.slice(3);

  return (
    <>
      <Helmet>
        <title>Classement des Solutions | SolvHub</title>
        <meta name="description" content="Découvrez les résolutions les plus utiles et plébiscitées par la communauté SolvHub." />
      </Helmet>

      <div className="max-w-4xl mx-auto py-10 px-4 space-y-10">
        {/* En-tête de la page */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Classement des Solutions</h1>
            <p className="text-slate-600 text-sm mt-1">
              Les résolutions les plus utiles et plébiscitées par la communauté.
            </p>
          </div>
          <button
            onClick={() => navigate("/ranking")}
            className="text-sm font-medium text-blue-600 hover:text-blue-700 transition cursor-pointer"
          >
            ← Retour aux classements
          </button>
        </div>

        {loading ? (
          <p className="text-center text-slate-500 py-12">Chargement du classement...</p>
        ) : solutions.length === 0 ? (
          <p className="text-center text-slate-500 py-12">Aucune solution classée pour le moment.</p>
        ) : (
          <div className="space-y-10">
            {/* Le Podium (Top 3) */}
            {top3.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 items-end">
                {/* 2ème place */}
                {top3[1] && (() => {
                  const scorePercentage = top3[1].score !== null && top3[1].score !== undefined 
                    ? Math.round(top3[1].score * 100) 
                    : null;

                  return (
                    <div 
                      onClick={() => navigate(`/solution/${top3[1].idSolution}`)}
                      className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-center space-y-3 cursor-pointer hover:border-slate-700 transition shadow-lg order-2 md:order-1"
                    >
                      <span className="text-2xl">🥈</span>
                      <h3 className="font-semibold text-white truncate text-sm">{top3[1].title}</h3>
                      <p className="text-xs text-slate-400">Par {top3[1].user?.username || "Anonyme"}</p>
                      {scorePercentage !== null && (
                        <div>
                          <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/50 border border-emerald-800/50 px-2 py-0.5 rounded-full">
                            {scorePercentage}% de réussite
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* 1ère place */}
                {top3[0] && (() => {
                  const scorePercentage = top3[0].score !== null && top3[0].score !== undefined 
                    ? Math.round(top3[0].score * 100) 
                    : null;

                  return (
                    <div 
                      onClick={() => navigate(`/solution/${top3[0].idSolution}`)}
                      className="bg-slate-900 border border-amber-500/40 p-6 rounded-2xl text-center space-y-3 cursor-pointer hover:border-amber-500/70 transition shadow-xl shadow-amber-500/5 order-1 md:order-2 -translate-y-2"
                    >
                      <span className="text-3xl">👑</span>
                      <h3 className="font-bold text-white text-base truncate">{top3[0].title}</h3>
                      <p className="text-xs text-amber-400 font-medium">Par {top3[0].user?.username || "Anonyme"}</p>
                      {scorePercentage !== null && (
                        <div>
                          <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/50 border border-emerald-800/50 px-2 py-0.5 rounded-full">
                            {scorePercentage}% de réussite
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* 3ème place */}
                {top3[2] && (() => {
                  const scorePercentage = top3[2].score !== null && top3[2].score !== undefined 
                    ? Math.round(top3[2].score * 100) 
                    : null;

                  return (
                    <div 
                      onClick={() => navigate(`/solution/${top3[2].idSolution}`)}
                      className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-center space-y-3 cursor-pointer hover:border-slate-700 transition shadow-lg order-3"
                    >
                      <span className="text-2xl">🥉</span>
                      <h3 className="font-semibold text-white truncate text-sm">{top3[2].title}</h3>
                      <p className="text-xs text-slate-400">Par {top3[2].user?.username || "Anonyme"}</p>
                      {scorePercentage !== null && (
                        <div>
                          <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/50 border border-emerald-800/50 px-2 py-0.5 rounded-full">
                            {scorePercentage}% de réussite
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Le reste de la liste (Du 4ème et plus) */}
            {restOfSolutions.length > 0 && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="divide-y divide-slate-800">
                  {restOfSolutions.map((sol, index) => {
                    const scorePercentage = sol.score !== null && sol.score !== undefined 
                      ? Math.round(sol.score * 100) 
                      : null;

                    return (
                      <div
                        key={sol.idSolution}
                        onClick={() => navigate(`/solution/${sol.idSolution}`)}
                        className="p-4 flex items-center justify-between hover:bg-slate-950 transition cursor-pointer"
                      >
                        <div className="flex items-center gap-4 overflow-hidden">
                          <span className="w-6 text-center font-bold text-slate-500 text-sm shrink-0">
                            {index + 4}
                          </span>
                          <div className="overflow-hidden">
                            <h4 className="font-semibold text-white text-sm truncate">{sol.title}</h4>
                            <p className="text-xs text-slate-400 mt-0.5">Par {sol.user?.username || "Anonyme"}</p>
                          </div>
                        </div>

                        {scorePercentage !== null && (
                          <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/50 border border-emerald-800/50 px-2 py-0.5 rounded-full shrink-0">
                            {scorePercentage}%
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}