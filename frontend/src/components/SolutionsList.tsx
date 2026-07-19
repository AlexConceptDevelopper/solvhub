import { useEffect, useState } from "react";
import { apiFetch } from "../api/client";
import type { Solution } from "../types/solution"; 

export default function SolutionsList() {
  const [solutions, setSolutions] = useState<Solution[]>([]);

  useEffect(() => {
    apiFetch<Solution[]>("/solutions/dto").then((data) => {
      if (data) setSolutions(data);
    });
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm("Supprimer cette solution ?")) {
      await apiFetch(`/solutions/${id}`, { method: "DELETE" });
      setSolutions(solutions.filter((s) => s.idSolution !== id));
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-600 bg-slate-900">
            <th className="p-4 text-white font-bold">ID</th>
            <th className="p-4 text-white font-bold">Titre</th>
            <th className="p-4 text-white font-bold">Créateur</th>
            <th className="p-4 text-white font-bold">Difficulté</th>
            <th className="p-4 text-white font-bold">Temps (min)</th>
            <th className="p-4 text-white font-bold text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {solutions.map((sol) => (
            <tr key={sol.idSolution} className="border-b border-slate-700 hover:bg-slate-800 transition-colors">
              <td className="p-4 text-slate-100 font-medium">{sol.idSolution}</td>
              <td className="p-4 text-slate-100 font-medium">{sol.title}</td>
              <td className="p-4 text-slate-100 font-medium">
                {sol.user?.username || "Anonyme"}
              </td>
              <td className="p-4 text-slate-100 font-medium">{sol.difficulty}</td>
              <td className="p-4 text-slate-100 font-medium">{sol.timeMinutes}</td>
              <td className="p-4 text-right">
                <div className="flex justify-end">
                  <button 
                    onClick={() => handleDelete(sol.idSolution)} 
                    className="px-4 py-2 font-bold text-white bg-slate-700 hover:bg-slate-600 border border-slate-500 rounded shadow-lg transition-all cursor-pointer"
                  >
                    Supprimer
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}