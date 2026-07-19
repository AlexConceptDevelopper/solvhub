import { useState } from "react";
import UsersList from "../components/UserList";
import ProblemsList from "../components/ProblemsList";
import SolutionsList from "../components/SolutionsList";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("users");

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-black mb-8">Dashboard Administrateur</h1>
      
      {/* Navigation des onglets */}
      <div className="flex space-x-4 mb-6 border-b border-slate-800 pb-4">
        {['users', 'problems', 'solutions'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 cursor-pointer rounded-lg capitalize ${activeTab === tab ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Contenu dynamique */}
      <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
        {activeTab === 'users' && <UsersList />}
        {activeTab === 'problems' && <ProblemsList />}
        {activeTab === 'solutions' && <SolutionsList />}
      </div>
    </div>
  );
}