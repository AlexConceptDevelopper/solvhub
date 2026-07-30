import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import UsersList from "../components/dashboard/UserList";
import ProblemsList from "../components/dashboard/ProblemsList";
import SolutionsList from "../components/dashboard/SolutionsList";
import CategoriesList from "../components/dashboard/CategoriesList";
import EquipmentsList from "../components/dashboard/EquipmentsList";
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
  const [equipments, setEquipments] = useState<any[]>([]);

  useEffect(() => {
    apiFetch<Problem[]>("/problems").then((data) => data && setProblems(data));
    apiFetch<Solution[]>("/solutions/dto").then((data) => data && setSolutions(data));
    apiFetch<any[]>("/users").then((data) => data && setUsers(data));
    apiFetch<any[]>("/categories").then((data) => data && setCategories(data));
    apiFetch<any[]>("/equipments").then((data) => data && setEquipments(data));
  }, []);

  // Réinitialise la recherche lorsqu'on change d'onglet pour éviter les confusions
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSearch("");
  };

  const tabs = ['users', 'problems', 'solutions', 'categories', 'equipments'];

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

      {/* Barre de recherche ciblée sur l'onglet actif */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
        <span className="text-slate-400 pl-2">🔍</span>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={`Rechercher dans ${activeTab}...`}
          className="w-full bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-none text-sm"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="text-xs text-slate-400 hover:text-slate-600 px-2 py-1 rounded-lg bg-slate-100"
          >
            Effacer
          </button>
        )}
      </div>

      {/* Navigation par onglets */}
      <div className="flex space-x-2 border-b border-slate-200 pb-4 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
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

      {/* Contenu dynamique par onglet avec transmission de la recherche locale */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        {activeTab === 'users' && <UsersList users={users} setUsers={setUsers} search={search} />}
        {activeTab === 'problems' && <ProblemsList problems={problems} setProblems={setProblems} search={search} />}
        {activeTab === 'solutions' && <SolutionsList solutions={solutions} setSolutions={setSolutions} search={search} />}
        {activeTab === 'categories' && <CategoriesList categories={categories} setCategories={setCategories} search={search} />}
        {activeTab === 'equipments' && <EquipmentsList equipments={equipments} setEquipments={setEquipments} search={search} />}
      </div>
    </div>
  );
}