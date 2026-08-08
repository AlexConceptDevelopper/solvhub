import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { apiFetch } from "../api/client";
import useAsync from "../hooks/useAsync";
import type { Problem } from "../types/problem";

export default function RankingProblemPage() {
  const navigate = useNavigate();

  const {
    data: problems,
    loading,
    execute: fetchProblems,
  } = useAsync<Problem[]>();

  useEffect(() => {
    fetchProblems(() =>
      apiFetch<Problem[] | null>("/problems/dto/popular").then(
        (res) => res ?? [],
      ),
    );
  }, []);

  return (
    <>
      <Helmet>
        <title>Problèmes Populaires | Classement SolvHub</title>
        <meta name="description" content="Découvrez le classement des problèmes et sujets qui génèrent le plus d'engagement et de votes sur SolvHub." />
      </Helmet>

      <div className="max-w-4xl mx-auto py-10 px-4 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <span>🔥</span> Classement des Problèmes Populaires
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Les sujets qui génèrent le plus d'engagement et de votes sur leurs solutions.
            </p>
          </div>
          <button
            onClick={() => navigate("/ranking")}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition cursor-pointer"
          >
            ← Retour au hub
          </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-md p-6">
          {loading ? (
            <p className="text-sm text-slate-400 py-12 text-center">
              Chargement du classement...
            </p>
          ) : !problems || problems.length === 0 ? (
            <p className="text-sm text-slate-400 py-12 text-center">
              Aucun problème pour l'instant.
            </p>
          ) : (
            <div className="space-y-3">
              {problems.map((prob, index) => (
                <div
                  key={prob.idProblem}
                  onClick={() => navigate(`/problem/${prob.idProblem}`)}
                  className="p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-between cursor-pointer transition"
                >
                  <div className="flex items-center gap-4 overflow-hidden">
                    <span className="font-bold text-base text-amber-500 w-6 text-center">
                      {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`}
                    </span>
                    <div className="overflow-hidden">
                      <h3 className="font-semibold text-slate-800 text-sm truncate">
                        {prob.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Par {prob.user?.username || "Anonyme"} • <span className="text-blue-600 font-medium">{prob.category?.name || "Général"}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-semibold bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg border border-blue-100">
                      {prob.voteCount !== undefined ? `${prob.voteCount} votes` : "Populaire 🔥"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}