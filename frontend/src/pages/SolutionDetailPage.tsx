import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import { getSolutionById } from "../api/solution.api";
import { getSolutionStats } from "../api/solutionStats.api";
import { createVote, hasUserVoted, getVotesBySolution } from "../api/vote.api";
import { getMediaBySolution } from "../api/solutionMedia.api";
import type { SolutionStats } from "../types/solutionStats";
import type { Solution } from "../types/solution";
import type { SolutionMedia } from "../types/SolutionMedia";
import SolutionStatsCard from "../components/SolutionStatsCard";
import type { Vote } from "../types/vote";
import VoteList from "../components/VoteList";
import ErrorMessage from "../components/ErrorMessage";
import useAsync from "../hooks/useAsync";
import { useAuth } from "../context/AuthContext";
import BackButton from "../components/BackButton";
import LoadingState from "../components/LoadingState";

export default function SolutionDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const location = useLocation();
  const state = location.state as {
    originTo?: string;
    originLabel?: string;
  } | null;

  const [solution, setSolution] = useState<Solution | null>(null);
  const [stats, setStats] = useState<SolutionStats | null>(null);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [medias, setMedias] = useState<SolutionMedia[]>([]);
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

  const getYoutubeEmbedUrl = (rawUrl?: string) => {
    if (!rawUrl) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = rawUrl.match(regExp);
    return match && match[2].length === 11
      ? `https://www.youtube.com/embed/${match[2]}`
      : null;
  };

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

    const mediaData = await getMediaBySolution(solutionId);
    if (mediaData) {
      setMedias(mediaData);
    }

    if (user && user.idUsers) {
      const voted = await hasUserVoted(solutionId, user.idUsers);
      setAlreadyVoted(voted);
    }
  };

  useEffect(() => {
    loadSolution();
  }, [id, user]);

  useEffect(() => {
    if (!solution) return;

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      "headline": solution.title,
      "text": solution.steps,
      "datePublished": solution.createdAt,
      "author": {
        "@type": "Person",
        "name": solution.user?.username || "Communauté SolvHub",
      },
    };

    let scriptTag = document.getElementById("structured-data-solution") as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement("script");
      scriptTag.id = "structured-data-solution";
      scriptTag.type = "application/ld+json";
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(structuredData);

    return () => {
      scriptTag?.remove();
    };
  }, [solution]);

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
    return <LoadingState label="Chargement..." />;
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

  const videoMedia = medias.find((m) => m.type.toUpperCase() === "VIDEO");
  const imageMedias = medias.filter((m) => m.type.toUpperCase() !== "VIDEO");
  const youtubeEmbedUrl = videoMedia ? getYoutubeEmbedUrl(videoMedia.url) : null;

  return (
    <>
      <Helmet>
        <title>{`${solution.title} | Solution SolvHub`}</title>
        <meta name="description" content={solution.steps ? solution.steps.slice(0, 150) + "..." : "Consultez cette solution technique et donnez votre avis sur SolvHub."} />
      </Helmet>

      <div className="max-w-6xl px-4 md:px-6 mx-auto space-y-8">
        <section className="relative bg-white rounded-xl p-5 md:p-8 z-10 space-y-4 shadow-sm border border-slate-100">
          
          <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 wrap-break-word flex-1">
              {solution.title}
            </h1>
            <div className="self-start sm:self-auto">
              <BackButton
                to={`/problem/${solution.problemId}`}
                label="Retour au problème"
                replace
                state={
                  state?.originTo
                    ? { returnTo: state.originTo, returnLabel: state.originLabel }
                    : undefined
                }
              />
            </div>
          </div>

          <p className="text-slate-700 leading-relaxed whitespace-pre-line text-sm md:text-base">{solution.steps}</p>

          {youtubeEmbedUrl && (
            <div className="space-y-2 pt-2">
              <h3 className="text-sm font-semibold text-slate-700">
                🎬 Vidéo explicative :
              </h3>
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-sm border border-slate-200">
                <iframe
                  src={youtubeEmbedUrl}
                  title="Vidéo explicative de la solution"
                  className="absolute top-0 left-0 w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {imageMedias.length > 0 && (
            <div className="space-y-2 pt-2">
              <h3 className="text-sm font-semibold text-slate-700">
                Images associées :
              </h3>
              <div className="flex flex-wrap gap-4">
                {imageMedias.map((media) => (
                  <a
                    key={media.idMedia}
                    href={media.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block overflow-hidden rounded-xl border border-slate-200 hover:opacity-95 transition"
                  >
                    <img
                      src={media.url}
                      alt="Illustration de la solution"
                      className="h-32 w-32 object-cover"
                    />
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-3 text-xs md:text-sm text-slate-500 pt-2">
            <span className="bg-slate-50 border border-slate-200 px-3 py-1 rounded-lg">Difficulté : {solution.difficulty}/5</span>
            <span className="bg-slate-50 border border-slate-200 px-3 py-1 rounded-lg">Temps : {solution.timeMinutes} min</span>
            <span className="bg-slate-50 border border-slate-200 px-3 py-1 rounded-lg">Risque : {solution.riskLevel}/5</span>
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
              className="flex-1 rounded-xl bg-green-500 px-4 py-2.5 text-white font-semibold hover:bg-green-600 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {voting ? "Envoi..." : "👍 Réussie"}
            </button>

            <button
              disabled={alreadyVoted || voting || !user}
              onClick={() => handleVote("PARTIAL")}
              className="flex-1 rounded-xl bg-amber-500 px-4 py-2.5 text-white font-semibold hover:bg-amber-600 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {voting ? "Envoi..." : "😐 Partielle"}
            </button>

            <button
              disabled={alreadyVoted || voting || !user}
              onClick={() => handleVote("FAILURE")}
              className="flex-1 rounded-xl bg-red-500 px-4 py-2.5 text-white font-semibold hover:bg-red-600 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {voting ? "Envoi..." : "👎 Échec"}
            </button>
          </div>
        </section>

        <VoteList votes={votes} />
      </div>
    </>
  );
}