import { useNavigate } from "react-router-dom";
import type { Solution } from "../types/solution";

interface Props {
  solution: Solution;
}

export default function SolutionCard({ solution }: Props) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/solution/${solution.idSolution}`)}
      className="
        bg-white
        rounded-2xl
        border
        border-slate-200
        p-5
        md:p-6
        shadow-xs
        hover:border-blue-300
        hover:-translate-y-0.5
        hover:shadow-[0_0_20px_rgba(59,130,246,0.1)]
        transition-all
        duration-200
        cursor-pointer
      "
    >
      <div className="flex justify-between items-start gap-4">
        <h3 className="text-lg md:text-xl font-black tracking-tight text-slate-900">
          {solution.title}
        </h3>

        {solution.score !== null && (
          <span
            className="
              shrink-0
              bg-emerald-50
              text-emerald-700
              border
              border-emerald-200
              px-2.5
              py-1
              rounded-md
              text-xs
              font-bold
              font-mono
            "
          >
            {(solution.score * 100).toFixed(0)}%
          </span>
        )}
      </div>

      <p className="mt-3 text-slate-700 text-sm md:text-base leading-relaxed line-clamp-2">
        {solution.steps}
      </p>

      <div
        className="
          mt-5
          pt-4
          border-t
          border-slate-100
          flex
          flex-wrap
          items-center
          gap-x-4
          gap-y-2
          text-xs
          font-medium
          text-slate-500
        "
      >
        <span className="inline-flex items-center gap-1 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md text-slate-600">
          Difficulté : <strong className="text-slate-900 font-bold">{solution.difficulty}/5</strong>
        </span>

        <span className="inline-flex items-center gap-1 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md text-slate-600">
          ⏱ {solution.timeMinutes} min
        </span>

        <span className="inline-flex items-center gap-1 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md text-slate-600">
          ⚠️ Risque : <strong className="text-slate-900 font-bold">{solution.riskLevel}/5</strong>
        </span>
      </div>
    </div>
  );
}