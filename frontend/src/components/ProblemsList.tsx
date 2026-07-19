import { useEffect, useState } from "react";
import { apiFetch } from "../api/client";
import type { Problem } from "../types/problem";

export default function ProblemsList() {
  const [problems, setProblems] = useState<Problem[]>([]);

  useEffect(() => {
    apiFetch<Problem[]>("/problems").then((data) => {
      if (data) setProblems(data);
    });
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm("Supprimer ce problème ?")) {
      await apiFetch(`/problems/${id}`, { method: "DELETE" });
      setProblems(problems.filter((p) => p.idProblem !== id));
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-600 bg-slate-900">
            <th className="p-4 text-white font-bold">ID</th>
            <th className="p-4 text-white font-bold">Titre</th>
            <th className="p-4 text-white font-bold text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {problems.map((problem) => (
            <tr key={problem.idProblem} className="border-b border-slate-700 hover:bg-slate-800 transition-colors">
              <td className="p-4 text-slate-100 font-medium">{problem.idProblem}</td>
              <td className="p-4 text-slate-100 font-medium">{problem.title}</td>
              <td className="p-4 text-right">
                <div className="flex justify-end">
                  <button 
                    onClick={() => handleDelete(problem.idProblem)} 
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