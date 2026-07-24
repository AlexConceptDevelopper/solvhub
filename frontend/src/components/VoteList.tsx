import type { Vote } from "../types/vote";

interface Props {
  votes: Vote[];
}

export default function VoteList({ votes }: Props) {
  if (votes.length === 0) {
    return (
      <section
        className="
          bg-white/70
          rounded-2xl
          border
          border-slate-200
          p-6
          text-slate-500
          text-center
        "
      >
        Aucun avis pour le moment.
      </section>
    );
  }

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
        Avis de la communauté
      </h2>

      <div
        className="
          mt-5
          space-y-4
        "
      >
        {votes.map((vote) => (
          <article
            key={vote.idVotes}
            className="
              rounded-xl
              border
              border-slate-200
              p-4
              bg-white
            "
          >
            <div
              className="
                flex
                justify-between
                items-center
              "
            >
              <div className="flex items-center gap-2.5 flex-wrap">
                <span
                  className="
                    font-semibold
                    text-slate-700
                  "
                >
                  {vote.username || `Utilisateur #${vote.userId}`}
                </span>

                {/* Affichage du badge de crédibilité */}
                {vote.badge && (
                  <span
                    className="
                      text-xs
                      px-2.5
                      py-0.5
                      rounded-full
                      font-medium
                      bg-blue-50
                      text-blue-600
                      border
                      border-blue-100
                    "
                  >
                    {vote.badge}
                  </span>
                )}
              </div>

              <span
                className={`
                  font-bold
                  ${
                    vote.status === "SUCCESS"
                      ? "text-green-600"
                      : vote.status === "PARTIAL"
                      ? "text-amber-600"
                      : "text-red-600"
                  }
                `}
              >
                {vote.status}
              </span>
            </div>

            {vote.comment && (
              <p
                className="
                  mt-3
                  text-slate-600
                "
              >
                {vote.comment}
              </p>
            )}

            <p
              className="
                mt-3
                text-xs
                text-slate-400
              "
            >
              {new Date(vote.createdAt).toLocaleDateString("fr-FR")}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}