import { useNavigate } from "react-router-dom";
import type { Problem } from "../types/problem";

interface Props {
  problem: Problem;
  originTo?: string | number;
  originLabel?: string;
}

export default function ProblemCard({ problem, originTo, originLabel }: Props) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() =>
        navigate(`/problem/${problem.idProblem}`, {
          state: { returnTo: originTo, returnLabel: originLabel },
        })
      }
      className="
        group
        relative
        bg-white
        rounded-2xl
        border
        border-slate-200
        p-6
        hover:border-blue-300
        hover:-translate-y-0.5
        transition-all
        duration-200
        cursor-pointer
        w-full
        h-full
        flex
        flex-col
        justify-between
        shadow-xs
        hover:shadow-[0_0_20px_rgba(59,130,246,0.1)]
      "
    >
      <div>
        <div className="flex justify-between items-start mb-4 gap-2">
          <div
            className="
              text-[11px]
              text-blue-700
              font-bold
              inline-flex
              items-center
              gap-2
              px-2.5
              py-1
              rounded-md
              bg-blue-50
              border
              border-blue-200
            "
          >
            <span className="text-sm">{problem.category?.icon || "❓"}</span>
            <span className="uppercase tracking-wider">
              {problem.category?.name || "Sans catégorie"}
            </span>
          </div>

          {problem.nbSolutions !== undefined && problem.nbSolutions > 0 && (
            <span
              className="
                shrink-0
                inline-flex
                items-center
                gap-1
                px-2.5
                py-1
                rounded-md
                bg-emerald-50
                border
                border-emerald-200
                text-emerald-700
                text-[11px]
                font-bold
                uppercase
                tracking-wider
              "
            >
              ✅ {problem.nbSolutions} solution
              {problem.nbSolutions > 1 ? "s" : ""}
            </span>
          )}
        </div>

        <h3 className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2 ">
          {problem.title}
        </h3>

        <p className="mt-3 text-slate-500 text-sm leading-relaxed line-clamp-3">
          {problem.description}
        </p>
      </div>

      <div
        className="
          mt-6
          pt-4
          border-t
          border-slate-100
          text-xs
          font-bold
          text-slate-500
          group-hover:text-blue-600
          flex
          items-center
          justify-between
          transition-colors
          duration-200
        "
      >
        <span className="uppercase tracking-wider">Consulter la fiche</span>
        <span className="transform group-hover:translate-x-1 transition-transform duration-200 text-base text-blue-600">
          →
        </span>
      </div>
    </div>
  );
}
