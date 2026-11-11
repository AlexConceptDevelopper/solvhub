import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { checkDuplicates } from "../api/problem.api";
import type { Problem } from "../types/problem";
import { getProblemUrl } from "../utils/slug";

interface SimilarProblemsBlockProps {
  currentProblemId: number;
  title: string;
  categoryId?: number;
}

export default function SimilarProblemsBlock({
  currentProblemId,
  title,
}: SimilarProblemsBlockProps) {
  const [similarProblems, setSimilarProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!title || title.trim().length < 3) return;

    const fetchSimilar = async () => {
      setLoading(true);
      try {
        // On utilise la même API de recherche de doublons/similarité
        const results = await checkDuplicates({ title, description: "" });
        if (results) {
          // On filtre pour exclure le problème actuel de la liste
          const filtered = results.filter(
            (p) => p.idProblem !== currentProblemId
          );
          setSimilarProblems(filtered.slice(0, 3)); // On garde le top 3 max
        }
      } catch (err) {
        console.error("Erreur lors du chargement des problèmes similaires", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSimilar();
  }, [title, currentProblemId]);

  if (loading || similarProblems.length === 0) return null;

  return (
    <section className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 space-y-4 shadow-xs">
      <div className="flex items-center gap-2">
        <span className="text-xl">🔗</span>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
        Problèmes similaires & connexes
        </h2>
      </div>
      <p className="text-xs text-slate-500">
        Découvrez d'autres discussions et résolutions partagées par la communauté sur des sujets proches.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        {similarProblems.map((problem) => (
          <Link
            key={problem.idProblem}
            to={getProblemUrl(problem.idProblem, problem.title)}
            className="group block bg-slate-50 hover:bg-blue-50/50 border border-slate-200 hover:border-blue-300 p-4 rounded-xl transition-all duration-200 flex-col justify-between"
          >
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 uppercase tracking-wider inline-block">
                {problem.category?.name || "Technique"}
              </span>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition line-clamp-2">
                {problem.title}
              </h3>
              <p className="text-xs text-slate-500 line-clamp-2">
                {problem.description}
              </p>
            </div>
            <div className="mt-4 text-xs font-semibold text-blue-600 flex items-center gap-1">
              <span>Voir la solution</span>
              <span className="transform group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}