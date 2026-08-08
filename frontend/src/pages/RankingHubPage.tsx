import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { apiFetch } from "../api/client";
import useAsync from "../hooks/useAsync";
import type { Solution } from "../types/solution";
import type { User } from "../types/user";
import type { Problem } from "../types/problem";

export default function RankingHubPage() {
  const navigate = useNavigate();

  const {
    data: solutions,
    loading: loadingSolutions,
    execute: fetchSolutions,
  } = useAsync<Solution[]>();
  
  const {
    data: topUsers,
    loading: loadingUsers,
    execute: fetchUsers,
  } = useAsync<User[]>();

  const {
    data: problems,
    loading: loadingProblems,
    execute: fetchProblems,
  } = useAsync<Problem[]>();

  useEffect(() => {
    fetchSolutions(() =>
      apiFetch<Solution[] | null>("/ranking/top3").then((res) => res ?? []),
    );
    fetchUsers(() =>
      apiFetch<User[] | null>("/users/top-contributors/top3").then(
        (res) => res ?? [],
      ),
    );
    fetchProblems(() =>
      apiFetch<Problem[] | null>("/problems/dto/popular/top3").then(
        (res) => res ?? [],
      ),
    );
  }, []);

  const topSolutions = solutions?.slice(0, 3) || [];
  const top3Users = topUsers?.slice(0, 3) || [];
  const top3Problems = problems?.slice(0, 3) || [];
  
  const loading = loadingSolutions || loadingUsers || loadingProblems;

  return (
    <>
      <Helmet>
        <title>Classements de la communauté | SolvHub</title>
        <meta name="description" content="Découvrez les tops contributeurs, les solutions les plus utiles et les problèmes qui font le plus parler sur SolvHub[cite: 31]." />
      </Helmet>

      <div className="max-w-6xl mx-auto py-10 px-4 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h1 className="text-4xl font-bold text-slate-900">
            Classements de la communauté
          </h1>
          <p className="text-slate-600 text-sm">
            Découvrez les tops contributeurs, les solutions les plus utiles et les
            problèmes qui font le plus parler[cite: 31].
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* SECTION SOLUTIONS */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between space-y-6 shadow-md">
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <span>💡</span> Meilleures Solutions
              </h2>
              {loading ? (
                <p className="text-xs text-slate-400 py-6 text-center">
                  Chargement...[cite: 31]
                </p>
              ) : topSolutions.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">
                  Aucune solution pour l'instant[cite: 31].
                </p>
              ) : (
                <div className="space-y-3">
                  {topSolutions.map((sol, index) => {
                    const scorePercentage = sol.score !== null && sol.score !== undefined 
                      ? Math.round(sol.score * 100) 
                      : null;

                    return (
                      <div
                        key={sol.idSolution}
                        onClick={() => navigate(`/solution/${sol.idSolution}`)}
                        className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between cursor-pointer hover:border-slate-300 transition"
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <span className="font-bold text-sm text-amber-500 w-4 text-center shrink-0">
                            {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                          </span>
                          <div className="overflow-hidden">
                            <h4 className="font-semibold text-slate-800 text-xs truncate">
                              {sol.title}
                            </h4>
                            <p className="text-[10px] text-slate-500">
                              Par {sol.user?.username || "Anonyme"}[cite: 31]
                            </p>
                          </div>
                        </div>

                        {scorePercentage !== null && (
                          <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full shrink-0">
                            {scorePercentage}%[cite: 31]
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <button
              onClick={() => navigate("/ranking/solutions")}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition cursor-pointer"
            >
              Voir tout le classement →[cite: 31]
            </button>
          </div>

          {/* SECTION UTILISATEURS */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between space-y-6 shadow-md">
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <span>👥</span> Top Contributeurs
              </h2>
              {loading ? (
                <p className="text-xs text-slate-400 py-6 text-center">
                  Chargement...[cite: 31]
                </p>
              ) : top3Users.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">
                  Aucun contributeur pour l'instant[cite: 31].
                </p>
              ) : (
                <div className="space-y-3">
                  {top3Users.map((user, index) => (
                    <div
                      key={user.idUsers}
                      onClick={() => navigate(`/user/${user.idUsers}`)} 
                      className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between cursor-pointer hover:border-slate-300 transition"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-sm">
                          {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                        </span>
                        <span className="font-semibold text-slate-800 text-xs">
                          {user.username}
                        </span>
                      </div>
                      <span className="text-[10px] text-blue-600 font-medium">
                        {user.solutionCount || 0} résolutions[cite: 31]
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => navigate("/ranking/contributors")}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition cursor-pointer"
            >
              Voir tout le classement →[cite: 31]
            </button>
          </div>

          {/* SECTION PROBLÈMES POPULAIRES */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between space-y-6 shadow-md">
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <span>🔥</span> Problèmes Populaires
              </h2>
              {loading ? (
                <p className="text-xs text-slate-400 py-6 text-center">
                  Chargement...[cite: 31]
                </p>
              ) : top3Problems.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">
                  Aucun problème pour l'instant[cite: 31].
                </p>
              ) : (
                <div className="space-y-3">
                  {top3Problems.map((prob, index) => (
                    <div
                      key={prob.idProblem}
                      onClick={() => navigate(`/problem/${prob.idProblem}`)}
                      className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-3 cursor-pointer hover:border-slate-300 transition"
                    >
                      <span className="font-bold text-sm text-amber-500 w-4 text-center">
                        {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                      </span>
                      <div className="overflow-hidden">
                        <h4 className="font-semibold text-slate-800 text-xs truncate">
                          {prob.title}
                        </h4>
                        <p className="text-[10px] text-slate-500">
                          Par {prob.user?.username || "Anonyme"} • {prob.category?.name || "Général"}[cite: 31]
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => navigate("/ranking/problems")}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition cursor-pointer"
            >
              Voir tous les problèmes →[cite: 31]
            </button>
          </div>
        </div>
      </div>
    </>
  );
}