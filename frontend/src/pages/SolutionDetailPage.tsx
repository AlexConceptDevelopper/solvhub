import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getSolutionById } from "../api/solution.api";
import { getSolutionStats } from "../api/solutionStats.api";
import { createVote, hasUserVoted, getVotesBySolution } from "../api/vote.api";
import type { SolutionStats } from "../types/solutionStats";
import type { Solution } from "../types/solution";
import SolutionStatsCard from "../components/SolutionStatsCard";
import type { Vote } from "../types/vote";
import VoteList from "../components/VoteList";
import ErrorMessage from "../components/ErrorMessage";
import useAsync from "../hooks/useAsync";
import { useAuth } from "../context/AuthContext";
import BackButton from "../components/BackButton";
import LoadingStateProps from "../components/LoadingState";

export default function SolutionDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();

  const [solution, setSolution] = useState<Solution | null>(null);
  const [stats, setStats] = useState<SolutionStats | null>(null);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [alreadyVoted, setAlreadyVoted] = useState(false);

  const {
    loading: loadingSolution,
    error: errorSolution,
    execute: executeSolution,
  } = useAsync<Solution>();

  const {
    loading: loadingStats,
    error: errorStats,
    execute: executeStats,
  } = useAsync<SolutionStats>();

  const {
    loading: loadingVotes,
    error: errorVotes,
    execute: executeVotes,
  } = useAsync<Vote[]>();

  const {
    loading: voting,
    error: voteError,
    execute: executeVote,
  } = useAsync<Vote>();

  const loadSolution = async () => {
    if (!id) return;

    const solutionId = Number(id);

    if (Number.isNaN(solutionId)) {
      return;
    }

    const solutionData = await executeSolution(() =>
      getSolutionById(solutionId),
    );

    if (solutionData) {
      setSolution(solutionData);
    }

    const statsData = await executeStats(() => getSolutionStats(solutionId));

    if (statsData) {
      setStats(statsData);
    }

    const votesData = await executeVotes(() => getVotesBySolution(solutionId));

    if (votesData) {
      setVotes(votesData);
    }

    if (user && user.idUsers) {
      const voted = await hasUserVoted(solutionId, user.idUsers);
      setAlreadyVoted(voted);
    }
  };

  useEffect(() => {
    loadSolution();
  }, [id, user]);

  const handleVote = async (status: "SUCCESS" | "PARTIAL" | "FAILURE") => {
    if (!solution || alreadyVoted || !user || !user.idUsers) return;

    const result = await executeVote(() =>
      createVote({
        status,
        comment: "",
        userId: user.idUsers,
        solutionId: solution.idSolution,
      }),
    );

    if (result === null) {
      return;
    }

    setAlreadyVoted(true);

    const updatedStats = await executeStats(() =>
      getSolutionStats(solution.idSolution),
    );

    if (updatedStats) {
      setStats(updatedStats);
    }

    const updatedVotes = await executeVotes(() =>
      getVotesBySolution(solution.idSolution),
    );

    if (updatedVotes) {
      setVotes(updatedVotes);
    }
  };

  if (loadingSolution || loadingStats || loadingVotes) {
    return <LoadingStateProps label="Chargement..." />;
  }

  if (errorSolution || errorStats || errorVotes || voteError) {
    return (
      <ErrorMessage
        message={
          errorSolution ||
          errorStats ||
          errorVotes ||
          voteError ||
          "Une erreur est survenue"
        }
        onRetry={loadSolution}
      />
    );
  }

  if (!solution) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <section className="relative bg-white rounded-xl p-5 md:p-8 z-10 space-y-4 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-900">
            {solution.title}
          </h1>
          <BackButton
            to={`/problem/${solution.problemId}`}
            label="Retour au problème"
          />
        </div>

        <p className="text-slate-700 leading-relaxed">{solution.steps}</p>

        <div className="flex flex-wrap gap-3 text-sm text-slate-500">
          <span>Difficulté : {solution.difficulty}/5</span>
          <span>Temps : {solution.timeMinutes} min</span>
          <span>Risque : {solution.riskLevel}/5</span>
        </div>
      </section>

      {stats && <SolutionStatsCard stats={stats} />}

      <section className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Votre avis</h2>

        {!user && (
          <p className="mb-4 text-sm text-amber-600">
            Vous devez être connecté pour voter.
          </p>
        )}

        {alreadyVoted && (
          <p className="mb-4 text-sm text-slate-500">
            Vous avez déjà donné votre avis sur cette solution.
          </p>
        )}

        <div className="mt-6 flex gap-3 flex-wrap">
          <button
            disabled={alreadyVoted || voting || !user}
            onClick={() => handleVote("SUCCESS")}
            className="flex-1 rounded-xl bg-green-500 px-4 py-2 text-white font-semibold hover:bg-green-600 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {voting ? "Envoi..." : "👍 Réussie"}
          </button>

          <button
            disabled={alreadyVoted || voting || !user}
            onClick={() => handleVote("PARTIAL")}
            className="flex-1 rounded-xl bg-amber-500 px-4 py-2 text-white font-semibold hover:bg-amber-600 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {voting ? "Envoi..." : "😐 Partielle"}
          </button>

          <button
            disabled={alreadyVoted || voting || !user}
            onClick={() => handleVote("FAILURE")}
            className="flex-1 rounded-xl bg-red-500 px-4 py-2 text-white font-semibold hover:bg-red-600 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {voting ? "Envoi..." : "👎 Échec"}
          </button>
        </div>
      </section>

      <VoteList votes={votes} />
    </div>
  );
}
