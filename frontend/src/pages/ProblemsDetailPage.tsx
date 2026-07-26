import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { getProblemById } from "../api/problem.api";
import { getSolutionsByProblem } from "../api/solution.api";

import SolutionCard from "../components/SolutionCard";

import type { Problem } from "../types/problem";
import type { Solution } from "../types/solution";

import useAsync from "../hooks/useAsync";
import ErrorMessage from "../components/ErrorMessage";
import BackButton from "../components/BackButton";
import PrimaryButton from "../components/PrimaryButton";

export default function ProblemDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

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

  if (loadingProblem) {
    return (
      <div className="max-w-5xl mx-auto text-center py-20 text-slate-600 font-medium tracking-wide animate-pulse">
        Chargement du problème...
      </div>
    );
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
          onClick={() => navigate("/problems")}
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
          Retourner à la liste des problèmes
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl px-4 md:px-8 mx-auto mt-6 space-y-12">
      {/* BOUTON RETOUR*/}
      <div className="flex items-center justify-between">
        <BackButton to="/problems" label="Retour aux problèmes" />
      </div>

      {/* ZONE ARTICLE DÉPOUILLÉE ET ACCESSIBLE */}
      <article className="relative bg-white rounded-xl p-5 md:p-8 z-10 space-y-6 shadow-sm border border-slate-100">
        {/* En-tête : Catégorie & Date */}
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="inline-flex items-center gap-1.5 text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-md">
            <span>{problem.category?.icon || "❓"}</span>
            <span>{problem.category?.name || "Sans catégorie"}</span>
          </span>

          {problem.createdAt && (
            <span className="text-slate-500">
              Publié le{" "}
              {new Date(problem.createdAt).toLocaleDateString("fr-FR")}
            </span>
          )}
        </div>

        {/* Titre : Anthracite très profond (text-slate-900) */}
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
          {problem.title}
        </h1>

        {/* 🚗 BLOC VÉHICULE / ÉQUIPEMENT MIS EN VALEUR */}
        {problem.equipment && (
          <div className="flex items-center gap-4 bg-slate-900 text-white px-5 py-4 rounded-xl shadow-md">
            <span className="text-2xl bg-slate-800 p-2.5 rounded-lg">🚗</span>
            <div>
              <div className="text-xs uppercase tracking-wider text-slate-400 font-bold">
                Équipement concerné
              </div>
              <div className="text-lg md:text-xl font-extrabold tracking-wide">
                {problem.equipment.brand}{" "}
                <span className="text-blue-400">{problem.equipment.model}</span>
              </div>
            </div>
          </div>
        )}

        {/* Ligne de séparation fine pour le mode clair */}
        <div className="h-px bg-linear-to-r from-slate-200 via-slate-300 to-transparent w-full" />

        {/* Description */}
        <div
          className="
            text-slate-700 
            text-base 
            md:text-lg 
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

        {/* Action principale */}
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

      {/* BLOC DES SOLUTIONS DE LA COMMUNAUTÉ */}
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

          <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200 shadow-xs">
            {solutions.length} {solutions.length > 1 ? "solutions" : "solution"}
          </span>
        </div>

        {/* LOADING & ERRORS */}
        {loadingSolutions && (
          <div className="py-12 text-center text-slate-500 font-medium animate-pulse">
            Chargement des pistes de résolution...
          </div>
        )}

        {errorSolutions && (
          <ErrorMessage
            message={errorSolutions}
            onRetry={() => window.location.reload()}
          />
        )}

        {/* ETAT VIDE CLAIR */}
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

        {/* LISTING */}
        <div className="space-y-4">
          {solutions.map((solution) => (
            <SolutionCard key={solution.idSolution} solution={solution} />
          ))}
        </div>
      </section>
    </div>
  );
}
