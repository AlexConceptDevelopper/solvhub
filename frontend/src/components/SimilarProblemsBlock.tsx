import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProblems } from "../api/problem.api";
import type { Problem } from "../types/problem";
import { getProblemUrl } from "../utils/slug";

interface SimilarProblemsBlockProps {
  currentProblemId: number;
  title: string;
  categoryId?: number;
}

const STOP_WORDS = new Set([
  "avec",
  "pour",
  "dans",
  "plus",
  "sans",
  "qui",
  "que",
  "des",
  "les",
  "une",
  "sur",
  "par",
  "aux",
  "est",
  "sont",
  "pas",
  "mon",
  "ma",
  "mes",
  "ton",
  "ta",
  "tes",
]);

function extractKeywords(text: string): string[] {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length >= 4 && !STOP_WORDS.has(word));
}

export default function SimilarProblemsBlock({
  currentProblemId,
  title,
  categoryId,
}: SimilarProblemsBlockProps) {
  const [similarProblems, setSimilarProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!currentProblemId) return;

    const fetchSimilar = async () => {
      setLoading(true);
      try {
        // Appelle GET /api/problems/dto (route GET publique) au lieu de POST /check-duplicates
        const allProblems = await getProblems();
        if (!Array.isArray(allProblems)) {
          setSimilarProblems([]);
          return;
        }

        const currentKeywords = new Set(extractKeywords(title || ""));

        const scored = allProblems
          .filter((p) => p.idProblem !== currentProblemId)
          .map((p) => {
            let score = 0;

            if (categoryId != null && p.category?.idCategory === categoryId) {
              score += 3;
            }

            const candidateWords = extractKeywords(p.title || "");
            for (const word of candidateWords) {
              if (currentKeywords.has(word)) {
                score += 1;
              }
            }

            return { problem: p, score };
          })
          .filter((item) => item.score > 0)
          .sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score;
            return (b.problem.idProblem ?? 0) - (a.problem.idProblem ?? 0);
          });

        setSimilarProblems(scored.slice(0, 3).map((item) => item.problem));
      } catch (err) {
        // En consultation publique, on reste discret sans polluer la console
        setSimilarProblems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSimilar();
  }, [currentProblemId, title, categoryId]);

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
        Découvrez d&apos;autres discussions et résolutions partagées par la
        communauté sur des sujets proches.
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
              <span className="transform group-hover:translate-x-1 transition-transform">
                →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}