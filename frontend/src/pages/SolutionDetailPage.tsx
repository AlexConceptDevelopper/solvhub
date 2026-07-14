import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { getSolutionById } from "../api/solution.api";
import { getSolutionStats } from "../api/solutionStats.api";
import { createVote, hasUserVoted, getVotesBySolution } from "../api/vote.api";
import type { SolutionStats } from "../types/solutionStats";
import type { Solution } from "../types/solution";
import SolutionStatsCard from "../components/SolutionStatsCard";
import type { Vote } from "../types/vote";
import VoteList from "../components/VoteList";
import ErrorMessage from "../components/ErrorMessage";

export default function SolutionDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [solution, setSolution] = useState<Solution | null>(null);
  const [stats, setStats] = useState<SolutionStats | null>(null);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [alreadyVoted, setAlreadyVoted] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const solutionId = Number(id);

  if (Number.isNaN(solutionId)) {
    setError("Identifiant de solution invalide");
    setLoading(false);
    return;
  }

  const loadSolution = async () => {
    if (!id) {
      setError("Identifiant manquant");
      setLoading(false);
      return;
    }

    const solutionId = Number(id);

    if (Number.isNaN(solutionId)) {
      setError("Identifiant de solution invalide");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const solutionData = await getSolutionById(solutionId);
      setSolution(solutionData);

      const statsData = await getSolutionStats(solutionId);
      setStats(statsData);

      const votesData = await getVotesBySolution(solutionId);
      setVotes(votesData);

      const voted = await hasUserVoted(solutionId, 1);
      setAlreadyVoted(voted);
    } catch (error) {
      console.error(error);
      setError("Impossible de charger la solution");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSolution();
  }, [id]);

  const handleVote = async (status: "SUCCESS" | "PARTIAL" | "FAILURE") => {
    if (!solution || alreadyVoted) return;

    await createVote({
      status,
      comment: "",
      userId: 1,
      solutionId: solution.idSolution,
    });

    setAlreadyVoted(true);

    const updatedStats = await getSolutionStats(solution.idSolution);
    setStats(updatedStats);

    const updatedVotes = await getVotesBySolution(solution.idSolution);
    setVotes(updatedVotes);
  };

  if (loading) {
    return (
      <div
        className="
        max-w-4xl
        mx-auto
        text-center
        text-slate-500
      "
      >
        Chargement...
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadSolution} />;
  }

  if (!solution) {
    return null;
  }

  return (
    <div
      className="
        max-w-4xl
        mx-auto
        space-y-8
      "
    >
      <section
        className="
          bg-white/80
          backdrop-blur
          rounded-3xl
          border
          border-slate-200
          shadow-md
          p-8
        "
      >
        <h1
          className="
            text-3xl
            font-bold
            text-slate-800
          "
        >
          {solution.title}
        </h1>

        <button
          onClick={() => navigate(`/problem/${solution.problemId}`)}
          className="
            mt-6
            text-blue-600
            font-semibold
            hover:underline
          "
        >
          ← Retour au problème
        </button>

        <p
          className="
            mt-5
            text-slate-600
            leading-relaxed
          "
        >
          {solution.steps}
        </p>

        <div
          className="
            mt-6
            flex
            flex-wrap
            gap-3
            text-sm
            text-slate-500
          "
        >
          <span>Difficulté : {solution.difficulty}/5</span>

          <span>Temps : {solution.timeMinutes} min</span>

          <span>Risque : {solution.riskLevel}/5</span>
        </div>
      </section>

      {stats && <SolutionStatsCard stats={stats} />}

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
            mb-4
          "
        >
          Votre avis
        </h2>

        {alreadyVoted && (
          <p
            className="
            mb-4
            text-sm
            text-slate-500
          "
          >
            Vous avez déjà donné votre avis sur cette solution.
          </p>
        )}

        <div
          className="
          mt-6
          flex
          gap-3
          flex-wrap
        "
        >
          <button
            disabled={alreadyVoted}
            onClick={() => handleVote("SUCCESS")}
            className="
            flex-1
            rounded-xl
            bg-green-500
            px-4
            py-2
            text-white
            font-semibold
            hover:bg-green-600
            transition
            disabled:opacity-50
            disabled:cursor-not-allowed
          "
          >
            👍 Réussie
          </button>

          <button
            disabled={alreadyVoted}
            onClick={() => handleVote("PARTIAL")}
            className="
            flex-1
            rounded-xl
            bg-amber-500
            px-4
            py-2
            text-white
            font-semibold
            hover:bg-amber-600
            transition
            disabled:opacity-50
            disabled:cursor-not-allowed
          "
          >
            😐 Partielle
          </button>

          <button
            disabled={alreadyVoted}
            onClick={() => handleVote("FAILURE")}
            className="
            flex-1
            rounded-xl
            bg-red-500
            px-4
            py-2
            text-white
            font-semibold
            hover:bg-red-600
            transition
            disabled:opacity-50
            disabled:cursor-not-allowed
          "
          >
            👎 Échec
          </button>
        </div>
      </section>

      <VoteList votes={votes} />
    </div>
  );
}
