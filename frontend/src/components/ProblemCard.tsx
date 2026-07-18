import { useNavigate } from "react-router-dom";
import type { Problem } from "../types/problem";


interface Props {
  problem: Problem;
}


export default function ProblemCard({problem}: Props) {

  const navigate = useNavigate();


  return (

    <div
      onClick={() => navigate(`/problem/${problem.idProblem}`)}
      className="
        bg-white/80
        backdrop-blur
        rounded-2xl
        border
        border-slate-200
        p-6
        shadow-md
        hover:shadow-lg
        hover:-translate-y-1
        transition
        cursor-pointer
        w-full
        max-w-sm
      "
    >

      <div
        className="
          text-sm
          text-blue-600
          font-semibold
          mb-3
        "
      >
        <span>{problem.category.icon}</span>
        <span>{problem.category.name}</span>
      </div>


      <h3
        className="
          text-xl
          font-bold
          text-slate-800
        "
      >
        {problem.title}
      </h3>


      <p
        className="
          mt-3
          text-slate-500
          line-clamp-3
        "
      >
        {problem.description}
      </p>


      <div
        className="
          mt-5
          text-sm
          text-slate-400
        "
      >
        Voir les solutions →
      </div>


    </div>

  );
}