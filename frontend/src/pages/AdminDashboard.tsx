import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import UsersList from "../components/dashboard/UserList";
import ProblemsList from "../components/dashboard/ProblemsList";
import SolutionsList from "../components/dashboard/SolutionsList";
import CategoriesList from "../components/dashboard/CategoriesList";
import BackButton from "../components/BackButton";
import { apiFetch } from "../api/client";
import type { Problem } from "../types/problem";
import type { Solution } from "../types/solution";

export default function AdminDashboard() {
  const location = useLocation();
  
  // On récupère l'onglet demandé via le state (ex: "problems"), sinon "users" par défaut
  const initialTab = (location.state as { activeTab?: string })?.activeTab || "users";

  const [activeTab, setActiveTab] = useState(initialTab);
  const [search, setSearch] = useState("");

  const [problems, setProblems] = useState<Problem[]>([]);
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    apiFetch<Problem[]>("/problems").then((data) => data && setProblems(data));
    apiFetch<Solution[]>("/solutions/dto").then((data) => data && setSolutions(data));
    apiFetch<any[]>("/users").then((data) => data && setUsers(data));
    apiFetch<any[]>("/categories").then((data) => data && setCategories(data));
  }, []);

  const isSearching = search.trim().length > 0;

  const filteredProblems = problems.filter((p) => {
    return p.title?.toLowerCase().includes(search.toLowerCase()) || p.description?.toLowerCase().includes(search.toLowerCase());
  });

  const filteredSolutions = solutions.filter((s) => 
    s.title?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredUsers = users.filter((u) => 
    u.username?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredCategories = categories.filter((c) =>
    c.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-6">
      {/* Bouton de retour en haut */}
      <div className="flex justify-start">
        <BackButton to="/" label="Retour à l'accueil" />
      </div>

      {/* En-tête avec titre */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard Administrateur</h1>
        <p className="text-slate-500 text-sm mt-1">Gestion globale de la plateforme SolvHub</p>
      </div>
      
      {/* Barre de recherche globale */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Recherche globale (utilisateurs, problèmes, solutions, catégories)..."
          className="w-full rounded-xl border border-slate-300 px-4 py-2.5 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm transition-all"
        />
      </div>

      {/* Vue globale combinée si recherche active */}
      {isSearching ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-900">Résultats de la recherche globale</h2>
            <button
              onClick={() => setSearch("")}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
            >
              Effacer la recherche
            </button>
          </div>

          {/* Catégories */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center justify-between">
              <span className="flex items-center gap-2">🏷️ Catégories</span>
              <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full font-semibold">{filteredCategories.length}</span>
            </h3>
            {filteredCategories.length === 0 ? (
              <p className="text-slate-400 text-sm">Aucune catégorie trouvée.</p>
            ) : (
              <div className="text-slate-700 text-sm space-y-2">
                {filteredCategories.map((c) => (
                  <div key={c.idCategory} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex justify-between items-center">
                    <span className="font-semibold text-slate-900">#{c.idCategory} - {c.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Problèmes */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center justify-between">
              <span className="flex items-center gap-2">📂 Problèmes</span>
              <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-full font-semibold">{filteredProblems.length}</span>
            </h3>
            {filteredProblems.length === 0 ? (
              <p className="text-slate-400 text-sm">Aucun problème trouvé.</p>
            ) : (
              <div className="text-slate-700 text-sm space-y-2">
                {filteredProblems.map((p) => (
                  <div key={p.idProblem} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex justify-between items-center">
                    <div>
                      <span className="font-semibold text-slate-900">#{p.idProblem}</span> - {p.title}
                    </div>
                    <span className="text-xs px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg border border-slate-200 font-medium">{p.category?.name || "Sans catégorie"}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Solutions */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center justify-between">
              <span className="flex items-center gap-2">💡 Solutions</span>
              <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full font-semibold">{filteredSolutions.length}</span>
            </h3>
            {filteredSolutions.length === 0 ? (
              <p className="text-slate-400 text-sm">Aucune solution trouvée.</p>
            ) : (
              <div className="text-slate-700 text-sm space-y-2">
                {filteredSolutions.map((s) => (
                  <div key={s.idSolution} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex justify-between items-center">
                    <div>
                      <span className="font-semibold text-slate-900">#{s.idSolution}</span> - {s.title}
                    </div>
                    <span className="text-xs text-slate-500 font-medium">Difficulté: {s.difficulty} | {s.timeMinutes} min</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Utilisateurs */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center justify-between">
              <span className="flex items-center gap-2">👤 Utilisateurs</span>
              <span className="text-xs bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-1 rounded-full font-semibold">{filteredUsers.length}</span>
            </h3>
            {filteredUsers.length === 0 ? (
              <p className="text-slate-400 text-sm">Aucun utilisateur trouvé.</p>
            ) : (
              <div className="text-slate-700 text-sm space-y-2">
                {filteredUsers.map((u) => (
                  <div key={u.id || u.idUser} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex justify-between items-center">
                    <div>
                      <span className="font-semibold text-slate-900">{u.username}</span> <span className="text-slate-400">({u.email})</span>
                    </div>
                    <span className="text-xs px-2.5 py-1 bg-purple-50 text-purple-700 rounded-lg border border-purple-100 font-medium">{u.role || "USER"}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* Navigation par onglets */}
          <div className="flex space-x-2 border-b border-slate-200 pb-4 overflow-x-auto">
            {['users', 'problems', 'solutions', 'categories'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 cursor-pointer rounded-xl capitalize font-semibold text-sm transition-all ${
                  activeTab === tab 
                    ? 'bg-blue-600 text-white shadow-xs' 
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Contenu dynamique par onglet avec transmission des props de données et de recherche */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            {activeTab === 'users' && <UsersList users={users} setUsers={setUsers} search={search} />}
            {activeTab === 'problems' && <ProblemsList problems={problems} setProblems={setProblems} search={search} />}
            {activeTab === 'solutions' && <SolutionsList solutions={solutions} setSolutions={setSolutions} search={search} />}
            {activeTab === 'categories' && <CategoriesList categories={categories} setCategories={setCategories} search={search} />}
          </div>
        </>
      )}
    </div>
  );
}