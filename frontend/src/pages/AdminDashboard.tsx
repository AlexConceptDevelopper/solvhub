import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import du hook de navigation
import UsersList from "../components/dashboard/UserList";
import ProblemsList from "../components/dashboard/ProblemsList";
import SolutionsList from "../components/dashboard/SolutionsList";
import CategoriesList from "../components/dashboard/CategoriesList";
import { apiFetch } from "../api/client";
import type { Problem } from "../types/problem";
import type { Solution } from "../types/solution";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("users");
  const [search, setSearch] = useState("");
  const navigate = useNavigate(); // Initialisation de navigate

  // États pour stocker les données globales et alimenter la recherche globale
  const [problems, setProblems] = useState<Problem[]>([]);
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    // Charger toutes les données en arrière-plan pour la recherche globale
    apiFetch<Problem[]>("/problems").then((data) => data && setProblems(data));
    apiFetch<Solution[]>("/solutions/dto").then((data) => data && setSolutions(data));
    apiFetch<any[]>("/users").then((data) => data && setUsers(data));
    apiFetch<any[]>("/categories").then((data) => data && setCategories(data));
  }, []);

  // Recherche globale multi-tableaux si l'utilisateur tape quelque chose
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
    <div className="p-8 space-y-6">
      {/* En-tête avec titre et bouton de retour vers l'accueil */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-black">Dashboard Administrateur</h1>
        <button
          onClick={() => navigate("/")} // Redirection vers la page d'accueil
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl shadow transition cursor-pointer flex items-center gap-2 text-sm"
        >
          ← Retour à l'accueil
        </button>
      </div>
      
      {/* Barre de recherche globale épurée (sans select) */}
      <div className="bg-slate-900/40 p-4 rounded-2xl border border-slate-800">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Recherche globale (utilisateurs, problèmes, solutions, catégories)..."
          className="w-full rounded-xl border border-slate-300 px-4 py-3 bg-white shadow-sm focus:outline-blue-500"
        />
      </div>

      {/* Si l'utilisateur recherche activement, on affiche une vue globale combinée */}
      {isSearching ? (
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-800">Résultats de la recherche globale</h2>
            <button
              onClick={() => setSearch("")}
              className="text-sm text-blue-600 hover:underline cursor-pointer"
            >
              Effacer la recherche
            </button>
          </div>

          {/* Section Catégories trouvées */}
          <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center justify-between">
              <span>🏷️ Catégories</span>
              <span className="text-xs bg-amber-600 px-2 py-1 rounded-full">{filteredCategories.length}</span>
            </h3>
            {filteredCategories.length === 0 ? (
              <p className="text-slate-400 text-sm">Aucune catégorie trouvée.</p>
            ) : (
              <div className="text-slate-300 text-sm space-y-2">
                {filteredCategories.map((c) => (
                  <div key={c.idCategory} className="p-3 bg-slate-800/80 rounded-lg flex justify-between items-center">
                    <span className="font-bold text-white">#{c.idCategory} - {c.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section Problèmes trouvés */}
          <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center justify-between">
              <span>📂 Problèmes</span>
              <span className="text-xs bg-blue-600 px-2 py-1 rounded-full">{filteredProblems.length}</span>
            </h3>
            {filteredProblems.length === 0 ? (
              <p className="text-slate-400 text-sm">Aucun problème trouvé.</p>
            ) : (
              <div className="text-slate-300 text-sm space-y-2">
                {filteredProblems.map((p) => (
                  <div key={p.idProblem} className="p-3 bg-slate-800/80 rounded-lg flex justify-between items-center">
                    <div>
                      <span className="font-bold text-white">#{p.idProblem}</span> - {p.title}
                    </div>
                    <span className="text-xs px-2 py-1 bg-slate-700 rounded">{p.category?.name || "Sans catégorie"}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section Solutions trouvées */}
          <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center justify-between">
              <span>💡 Solutions</span>
              <span className="text-xs bg-emerald-600 px-2 py-1 rounded-full">{filteredSolutions.length}</span>
            </h3>
            {filteredSolutions.length === 0 ? (
              <p className="text-slate-400 text-sm">Aucune solution trouvée.</p>
            ) : (
              <div className="text-slate-300 text-sm space-y-2">
                {filteredSolutions.map((s) => (
                  <div key={s.idSolution} className="p-3 bg-slate-800/80 rounded-lg flex justify-between items-center">
                    <div>
                      <span className="font-bold text-white">#{s.idSolution}</span> - {s.title}
                    </div>
                    <span className="text-xs text-slate-400">Difficulté: {s.difficulty} | {s.timeMinutes} min</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section Utilisateurs trouvés */}
          <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center justify-between">
              <span>👤 Utilisateurs</span>
              <span className="text-xs bg-purple-600 px-2 py-1 rounded-full">{filteredUsers.length}</span>
            </h3>
            {filteredUsers.length === 0 ? (
              <p className="text-slate-400 text-sm">Aucun utilisateur trouvé.</p>
            ) : (
              <div className="text-slate-300 text-sm space-y-2">
                {filteredUsers.map((u) => (
                  <div key={u.id || u.idUser} className="p-3 bg-slate-800/80 rounded-lg flex justify-between items-center">
                    <div>
                      <span className="font-bold text-white">{u.username}</span> ({u.email})
                    </div>
                    <span className="text-xs px-2 py-1 bg-slate-700 rounded">{u.role || "USER"}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* Navigation classique par onglets si pas de recherche */}
          <div className="flex space-x-4 mb-6 border-b border-slate-800 pb-4">
            {['users', 'problems', 'solutions', 'categories'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 cursor-pointer rounded-lg capitalize font-semibold transition ${activeTab === tab ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Contenu dynamique standard par onglet */}
          <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
            {activeTab === 'users' && <UsersList />}
            {activeTab === 'problems' && <ProblemsList />}
            {activeTab === 'solutions' && <SolutionsList />}
            {activeTab === 'categories' && <CategoriesList />}
          </div>
        </>
      )}
    </div>
  );
}