import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api/client";
import useAsync from "../hooks/useAsync";
import type { User } from "../types/user";

export default function RankingContributorPage() {
  const { data: users, loading, execute: fetchUsers } = useAsync<User[]>();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers(() =>
      apiFetch<User[] | null>("/users/top-contributors").then(
        (res) => res ?? [],
      ),
    );
  }, []);

  const userList = users || [];
  const top3 = userList.slice(0, 3);
  const restOfUsers = userList.slice(3);

  // Petite fonction optionnelle juste pour appliquer le style CSS selon le badge reçu du Back
  const getBadgeStyle = (badgeName?: string) => {
    switch (badgeName) {
      case "🏆 Maître SolvHub":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "🧠 Expert":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "💡 Résolveur":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      default:
        return "bg-slate-800 text-slate-300 border-slate-700";
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-10">
      {/* En-tête de la page */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Top Contributeurs
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Les membres les plus actifs et dépanneurs de la communauté.
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
        <p className="text-center text-slate-500 py-12">
          Chargement du classement...
        </p>
      ) : userList.length === 0 ? (
        <p className="text-center text-slate-500 py-12">
          Aucun contributeur pour le moment.
        </p>
      ) : (
        <div className="space-y-10">
          {/* Le Podium (Top 3) */}
          {top3.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 items-end">
              {/* 2ème place */}
              {top3[1] && (
                <div
                  onClick={() => navigate(`/user/${top3[1].idUsers}`)}
                  className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-center space-y-3 shadow-lg order-2 md:order-1 cursor-pointer hover:border-slate-700 transition flex flex-col items-center"
                >
                  <span className="text-2xl">🥈</span>
                  <h3 className="font-semibold text-white truncate text-sm">
                    {top3[1].username}
                  </h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${getBadgeStyle(top3[1].badge)}`}>
                    {top3[1].badge || "⚡ Actif"}
                  </span>
                  <p className="text-xs text-blue-400 font-medium">
                    {top3[1].solutionCount || 0} résolutions
                  </p>
                </div>
              )}

              {/* 1ère place */}
              {top3[0] && (
                <div
                  onClick={() => navigate(`/user/${top3[0].idUsers}`)}
                  className="bg-slate-900 border border-amber-500/40 p-6 rounded-2xl text-center space-y-3 shadow-xl shadow-amber-500/5 order-1 md:order-2 -translate-y-2 cursor-pointer hover:border-amber-500/70 transition flex flex-col items-center"
                >
                  <span className="text-3xl">👑</span>
                  <h3 className="font-bold text-white text-base truncate">
                    {top3[0].username}
                  </h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${getBadgeStyle(top3[0].badge)}`}>
                    {top3[0].badge || "⚡ Actif"}
                  </span>
                  <p className="text-xs text-amber-400 font-medium">
                    {top3[0].solutionCount || 0} résolutions
                  </p>
                </div>
              )}

              {/* 3ème place */}
              {top3[2] && (
                <div
                  onClick={() => navigate(`/user/${top3[2].idUsers}`)}
                  className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-center space-y-3 shadow-lg order-3 cursor-pointer hover:border-slate-700 transition flex flex-col items-center"
                >
                  <span className="text-2xl">🥉</span>
                  <h3 className="font-semibold text-white truncate text-sm">
                    {top3[2].username}
                  </h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${getBadgeStyle(top3[2].badge)}`}>
                    {top3[2].badge || "⚡ Actif"}
                  </span>
                  <p className="text-xs text-blue-400 font-medium">
                    {top3[2].solutionCount || 0} résolutions
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Le reste de la liste (Du 4ème et plus) */}
          {restOfUsers.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="divide-y divide-slate-800">
                {restOfUsers.map((user, index) => (
                  <div
                    key={user.idUsers}
                    onClick={() => navigate(`/user/${user.idUsers}`)}
                    className="p-4 flex items-center justify-between hover:bg-slate-950 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <span className="w-6 text-center font-bold text-slate-500 text-sm">
                        {index + 4}
                      </span>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-semibold text-white text-sm">
                            {user.username}
                          </h4>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${getBadgeStyle(user.badge)}`}>
                            {user.badge || "⚡ Actif"}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-blue-400 font-medium shrink-0">
                      {user.solutionCount || 0} résolutions
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}