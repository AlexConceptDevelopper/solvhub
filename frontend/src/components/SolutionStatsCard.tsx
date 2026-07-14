import type { SolutionStats } from "../types/solutionStats";


interface Props {
  stats: SolutionStats;
}


export default function SolutionStatsCard({
  stats
}: Props) {


  const total =
    stats.successCount +
    stats.partialCount +
    stats.failureCount;


  const score =
    total === 0
      ? 0
      :
      (
        (stats.successCount + stats.partialCount * 0.5)
        / total
      ) * 100;



  return (

    <section
      className="
        bg-white/70
        rounded-2xl
        border
        border-slate-200
        p-6
      "
    >

      <h2
        className="
          text-xl
          font-bold
          text-slate-800
        "
      >
        Statistiques
      </h2>


      <div
        className="
          mt-5
          grid
          grid-cols-3
          gap-4
          text-center
        "
      >

        <div>
          <p
            className="
              text-2xl
              font-bold
              text-green-600
            "
          >
            {stats.successCount}
          </p>

          <p className="text-sm text-slate-500">
            Réussies
          </p>
        </div>


        <div>
          <p
            className="
              text-2xl
              font-bold
              text-amber-600
            "
          >
            {stats.partialCount}
          </p>

          <p className="text-sm text-slate-500">
            Partielles
          </p>
        </div>


        <div>
          <p
            className="
              text-2xl
              font-bold
              text-red-600
            "
          >
            {stats.failureCount}
          </p>

          <p className="text-sm text-slate-500">
            Échecs
          </p>
        </div>

      </div>


      <div
        className="
          mt-6
          text-center
          text-slate-600
        "
      >

        Score communauté :

        <span
          className="
            ml-2
            font-bold
            text-blue-600
          "
        >
          {score.toFixed(0)}%
        </span>

      </div>


    </section>

  );
}