import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { apiFetch } from "../api/client";
import useAsync from "../hooks/useAsync";
import type { User } from "../types/user";
import BackButton from "../components/BackButton";

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

  const getBadgeStyle = (badgeName?: string) => {
    switch (badgeName) {
      case "🏆 Maître SolvHub":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "🧠 Expert":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "💡 Résolveur":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <>
      <Helmet>
        <title>Top Contributeurs | Classement SolvHub</title>
        <meta name="description" content="Découvrez le classement des membres les plus actifs et dépanneurs de la communauté SolvHub." />
      </Helmet>

      <div className="max-w-4xl mx-auto py-10 px-4 space-y-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Top Contributeurs
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              Les membres les plus actifs et dépanneurs de la communauté.
            </p>
          </div>
          <BackButton to="/ranking" label="Retour aux classements" />
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
            {top3.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 items-end">
                {top3[1] && (
                  <div
                    onClick={() => navigate(`/user/${top3[1].idUsers}`)}
                    className="bg-white border border-slate-200 p-6 rounded-2xl text-center space-y-3 shadow-md order-2 md:order-1 cursor-pointer hover:border-slate-300 transition flex flex-col items-center"
                  >
                    <span className="text-2xl">🥈</span>
                    <h3 className="font-semibold text-slate-900 truncate text-sm">
                      {top3[1].username}
                    </h3>
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-medium border ${getBadgeStyle(top3[1].badge)}`}>
                      {top3[1].badge || "⚡ Actif"}
                    </span>
                    <p className="text-xs text-blue-600 font-medium">
                      {top3[1].solutionCount || 0} résolutions
                    </p>
                  </div>
                )}

                {top3[0] && (
                  <div
                    onClick={() => navigate(`/user/${top3[0].idUsers}`)}
                    className="bg-white border border-amber-300 p-6 rounded-2xl text-center space-y-3 shadow-lg shadow-amber-500/5 order-1 md:order-2 -translate-y-2 cursor-pointer hover:border-amber-400 transition flex flex-col items-center"
                  >
                    <span className="text-3xl">👑</span>
                    <h3 className="font-bold text-slate-900 text-base truncate">
                      {top3[0].username}
                    </h3>
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-medium border ${getBadgeStyle(top3[0].badge)}`}>
                      {top3[0].badge || "⚡ Actif"}
                    </span>
                    <p className="text-xs text-amber-600 font-medium">
                      {top3[0].solutionCount || 0} résolutions
                    </p>
                  </div>
                )}

                {top3[2] && (
                  <div
                    onClick={() => navigate(`/user/${top3[2].idUsers}`)}
                    className="bg-white border border-slate-200 p-6 rounded-2xl text-center space-y-3 shadow-md order-3 cursor-pointer hover:border-slate-300 transition flex flex-col items-center"
                  >
                    <span className="text-2xl">🥉</span>
                    <h3 className="font-semibold text-slate-900 truncate text-sm">
                      {top3[2].username}
                    </h3>
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-medium border ${getBadgeStyle(top3[2].badge)}`}>
                      {top3[2].badge || "⚡ Actif"}
                    </span>
                    <p className="text-xs text-blue-600 font-medium">
                      {top3[2].solutionCount || 0} résolutions
                    </p>
                  </div>
                )}
              </div>
            )}

            {restOfUsers.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-md">
                <div className="divide-y divide-slate-100">
                  {restOfUsers.map((user, index) => (
                    <div
                      key={user.idUsers}
                      onClick={() => navigate(`/user/${user.idUsers}`)}
                      className="p-4 flex items-center justify-between hover:bg-slate-50 transition cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <span className="w-6 text-center font-bold text-slate-400 text-sm">
                          {index + 4}
                        </span>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-semibold text-slate-900 text-sm">
                              {user.username}
                            </h4>
                            <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-medium border ${getBadgeStyle(user.badge)}`}>
                              {user.badge || "⚡ Actif"}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-blue-600 font-medium shrink-0">
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
    </>
  );
}