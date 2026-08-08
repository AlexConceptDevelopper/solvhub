import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import { getProblemById } from "../api/problem.api";
import { getSolutionsByProblem } from "../api/solution.api";

import SolutionCard from "../components/SolutionCard";

import type { Problem } from "../types/problem";
import type { Solution } from "../types/solution";

import useAsync from "../hooks/useAsync";
import ErrorMessage from "../components/ErrorMessage";
import BackButton from "../components/BackButton";
import PrimaryButton from "../components/PrimaryButton";
import LoadingState from "../components/LoadingState";

export default function ProblemDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [problem, setProblem] = useState<Problem | null>(null);
  const [solutions, setSolutions] = useState<Solution[]>([]);

  const {
    loading: loadingProblem,
    error: errorProblem,
    execute: executeProblem,
  } = useAsync<Problem | null>();

  const {
    loading: loadingSolutions,
    error: errorSolutions,
    execute: executeSolutions,
  } = useAsync<Solution[]>();

  const state = location.state as {
    returnTo?: string;
    returnLabel?: string;
  } | null;
  const backTo = state?.returnTo ?? -1;
  const backLabel = state?.returnLabel ?? "Retour";

  useEffect(() => {
    if (!id) return;

    const problemId = Number(id);
    if (Number.isNaN(problemId)) return;

    const load = async () => {
      const problemData = await executeProblem(() => getProblemById(problemId));
      if (problemData) {
        setProblem(problemData);
      }

      const solutionsData = await executeSolutions(() =>
        getSolutionsByProblem(problemId),
      );
      if (solutionsData) {
        setSolutions(solutionsData);
      }
    };

    load();
  }, [id]);

  // AJOUT SEO : Injection des données structurées Schema.org (QAPage) pour Google
  useEffect(() => {
    if (!problem) return;

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "QAPage",
      mainEntity: {
        "@type": "Question",
        name: problem.title,
        text: problem.description,
        answerCount: solutions.length,
        suggestedAnswer: solutions.map((s) => ({
          "@type": "Answer",
          name: s.title,
          text: s.steps,
        })),
      },
    };

    let scriptTag = document.getElementById(
      "structured-data-qa",
    ) as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement("script");
      scriptTag.id = "structured-data-qa";
      scriptTag.type = "application/ld+json";
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(structuredData);

    return () => {
      scriptTag?.remove();
    };
  }, [problem, solutions]);

  if (loadingProblem) {
    return <LoadingState label="Chargement du problème..." />;
  }

  if (errorProblem) {
    return (
      <div className="max-w-5xl mx-auto px-4 mt-6">
        <ErrorMessage
          message={errorProblem}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="max-w-5xl mx-auto text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-xs px-6 mt-6">
        <span className="text-3xl block mb-3">🔍</span>

        <p className="text-slate-700 font-semibold text-lg">
          Le problème demandé est introuvable ou n'existe pas.
        </p>

        <p className="text-slate-500 text-sm mt-1">
          L'identifiant dans l'URL est peut-être incorrect ou la fiche a été
          supprimée.
        </p>

        <button
          onClick={() => navigate(-1)}
          className="
            mt-6 
            inline-flex 
            bg-slate-900 
            text-white 
            hover:bg-slate-800 
            px-5 
            py-2.5 
            rounded-xl 
            font-bold 
            text-sm 
            shadow-sm
            hover:-translate-y-0.5
            transition-all 
            cursor-pointer
          "
        >
          Retourner à la page précédente
        </button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`${problem.title} | SolvHub`}</title>
        <meta name="description" content={problem.description ? problem.description.slice(0, 150) + "..." : "Consultez les détails et solutions de ce problème sur SolvHub."} />
      </Helmet>

      <div className="max-w-6xl px-4 md:px-6 mx-auto mt-6 space-y-12">
        {/* ZONE ARTICLE DÉPOUILLÉE ET ACCESSIBLE */}
        <article className="relative bg-white rounded-xl p-5 md:p-8 z-10 space-y-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="inline-flex items-center gap-1.5 text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-md">
              <span>{problem.category?.icon || "❓"}</span>
              <span>{problem.category?.name || "Sans catégorie"}</span>
            </span>
          </div>

          {/* TITRE ET BOUTON RETOUR CORRIGÉS (Responsive sans bug de coupe) */}
          <div className="space-y-1">
            <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 wrap-break-word flex-1">
                {problem.title}
              </h1>
              <div className="self-start sm:self-auto">
                <BackButton to={backTo} label={backLabel} />
              </div>
            </div>

            {problem.createdAt && (
              <p className="text-xs text-slate-500">
                Publié le{" "}
                {new Date(problem.createdAt).toLocaleDateString("fr-FR")}
              </p>
            )}
          </div>

          {problem.equipment && (
            <div className="flex items-center gap-4 bg-slate-900 text-white px-5 py-4 rounded-xl shadow-md">
              <span className="text-2xl bg-slate-800 p-2.5 rounded-lg">
                {problem.category?.icon || "🔧"}
              </span>
              <div>
                <div className="text-xs uppercase tracking-wider text-slate-400 font-bold">
                  {problem.category?.name
                    ? `${problem.category.name} concerné(e)`
                    : "Équipement concerné"}
                </div>
                <div className="text-lg md:text-xl font-extrabold tracking-wide">
                  {problem.equipment.brand}{" "}
                  <span className="text-blue-400">{problem.equipment.model}</span>
                </div>
              </div>
            </div>
          )}

          <div className="h-px bg-linear-to-r from-slate-200 via-slate-300 to-transparent w-full" />

          <div
            className="
              text-slate-700 
              text-sm 
              md:text-base 
              leading-relaxed 
              space-y-4 
              whitespace-pre-wrap 
              wrap-break-word 
              pt-2
              font-normal
            "
          >
            {problem.description}
          </div>

          <div className="pt-6 flex justify-start">
            <PrimaryButton
              onClick={() =>
                navigate(`/problem/${problem.idProblem}/create-solution`)
              }
            >
              Proposer une solution
            </PrimaryButton>
          </div>
        </article>

        <section className="space-y-6 pt-10 border-t border-slate-200">
          <div className="flex bg-white rounded-xl p-5 justify-between items-baseline gap-4">
            <div>
              <h2 className="text-xl md:text-2xl font-black tracking-tight text-slate-900">
                Solutions proposées
              </h2>
              <p className="text-slate-500 text-xs md:text-sm mt-1">
                Consultez ou comparez les correctifs apportés par les autres
                développeurs.
              </p>
            </div>

            <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200 shadow-xs shrink-0">
              {solutions.length} {solutions.length > 1 ? "solutions" : "solution"}
            </span>
          </div>

          {loadingSolutions && (
            <LoadingState label="Chargement des pistes de résolution..." />
          )}

          {errorSolutions && (
            <ErrorMessage
              message={errorSolutions}
              onRetry={() => window.location.reload()}
            />
          )}

          {!loadingSolutions && solutions.length === 0 && (
            <div className="bg-white rounded-xl border border-dashed border-slate-300 py-16 text-center shadow-xs">
              <span className="text-2xl block mb-2">💡</span>
              <p className="text-slate-700 text-sm font-medium">
                Aucune solution n'a encore été indexée.
              </p>
              <p className="text-slate-500 text-xs mt-1">
                Votre expérience sur ce problème peut aider quelqu'un.
              </p>
            </div>
          )}

          <div className="space-y-4">
            {solutions.map((solution) => (
              <SolutionCard
                key={solution.idSolution}
                solution={solution}
                originTo={backTo}
                originLabel={backLabel}
              />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}