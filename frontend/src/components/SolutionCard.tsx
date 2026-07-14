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
        bg-white/80
        backdrop-blur
        rounded-2xl
        border
        border-slate-200
        p-6
        shadow-md
        hover:shadow-lg
        transition
        cursor-pointer
      "
    >
      <div className="flex justify-between items-start gap-4">

        <h3
          className="
            text-xl
            font-bold
            text-slate-800
          "
        >
          {solution.title}
        </h3>

        {solution.score !== null && (
          <span
            className="
              bg-green-100
              text-green-700
              px-3
              py-1
              rounded-full
              text-sm
              font-semibold
            "
          >
            {(solution.score * 100).toFixed(0)}%
          </span>
        )}

      </div>


      <p
        className="
          mt-4
          text-slate-600
        "
      >
        {solution.steps}
      </p>


      <div
        className="
          mt-5
          flex
          flex-wrap
          gap-3
          text-sm
          text-slate-500
        "
      >

        <span>
          Difficulté : {solution.difficulty}/5
        </span>

        <span>
          ⏱ {solution.timeMinutes} min
        </span>

        <span>
          ⚠️ Risque : {solution.riskLevel}/5
        </span>

      </div>

    </div>
  );
}