import { useNavigate } from "react-router-dom";
import type { Problem } from "../types/problem";

interface Props {
  problem: Problem;
}

export default function ProblemCard({ problem }: Props) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/problem/${problem.idProblem}`)}
      className="
        group
        relative
        bg-radial
        from-slate-900
        via-slate-950
        to-black
        rounded-2xl
        border
        border-slate-850
        p-6
        hover:border-blue-500/40
        hover:-translate-y-1
        transition-all
        duration-300
        cursor-pointer
        w-full
        flex
        flex-col
        justify-between
        overflow-hidden
        shadow-2xl
        inset-shadow-[0_1px_1px_rgba(255,255,255,0.12)]
      "
    >
      {/* Effet de lueur (Glow) interne hérité du Hero */}
      <div className="absolute -top-20 -right-20 w-45 h-45 bg-blue-500/5 group-hover:bg-blue-500/15 rounded-full blur-2xl pointer-events-none transition-all duration-300" />
      <div className="absolute -bottom-20 -left-20 w-45 h-45 bg-indigo-500/5 group-hover:bg-indigo-500/10 rounded-full blur-2xl pointer-events-none transition-all duration-300" />

      {/* Liseré bleu dynamique sur le côté gauche au survol (Corrigé w-[4px] en w-1) */}
      <div className="absolute top-0 left-0 w-1 h-0 bg-blue-500 group-hover:h-full transition-all duration-300" />

      <div className="relative z-10">
        {/* Badge Catégorie adapté au thème sombre */}
        <div className="flex justify-between items-start mb-4">
          <div
            className="
              text-[11px]
              text-blue-400
              font-bold
              inline-flex
              items-center
              gap-2
              px-2.5
              py-1
              rounded-lg
              bg-blue-500/10
              border
              border-blue-500/20
              backdrop-blur-xs
            "
          >
            <span className="text-sm">{problem.category?.icon || "❓"}</span>
            <span className="uppercase tracking-wider">{problem.category?.name || "Sans catégorie"}</span>
          </div>
        </div>

        {/* Titre nuancé (dégradé du blanc vers le slate clair pour casser le côté bloc) */}
        <h3
          className="
            text-lg
            font-black
            tracking-tight
            bg-linear-to-b
            from-white
            to-slate-300
            bg-clip-text
            text-transparent
            group-hover:from-blue-300
            group-hover:to-blue-500
            transition-colors
            duration-200
            line-clamp-2
          "
        >
          {problem.title}
        </h3>

        {/* Description en slate adouci */}
        <p
          className="
            mt-3
            text-slate-400
            text-sm
            leading-relaxed
            line-clamp-3
          "
        >
          {problem.description}
        </p>
      </div>

      {/* Action Footer adapté */}
      <div
        className="
          relative
          z-10
          mt-6
          pt-4
          border-t
          border-slate-800/80
          text-xs
          font-bold
          text-slate-500
          group-hover:text-blue-400
          flex
          items-center
          justify-between
          transition-colors
          duration-200
        "
      >
        <span className="uppercase tracking-wider">Consulter la fiche</span>
        <span className="transform group-hover:translate-x-1 transition-transform duration-200 text-base text-blue-400">
          →
        </span>
      </div>
    </div>
  );
}