import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { getProblems } from "../api/problem.api";
import type { Problem } from "../types/problem";
import ProblemCard from "../components/ProblemCard";
import useAsync from "../hooks/useAsync";
import ErrorMessage from "../components/ErrorMessage";
import BackButton from "../components/BackButton";

export default function CategoryProblemsPage() {
  const { idCategory } = useParams();
  const location = useLocation();
  const state = location.state as {
    returnTo?: string;
    returnLabel?: string;
  } | null;
  const backTo = state?.returnTo ?? "/categories";
  const backLabel = state?.returnLabel ?? "Retour aux catégories";
  const [problems, setProblems] = useState<Problem[]>([]);
  const { loading, error, execute } = useAsync<Problem[]>();

  useEffect(() => {
    const loadProblems = async () => {
      const data = await execute(() => getProblems());
      if (data) {
        setProblems(data);
      }
    };
    loadProblems();
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl px-4 md:px-6 mx-auto text-center py-20 text-slate-500 font-medium">
        Chargement...
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl px-4 md:px-6 mx-auto mt-6">
        <ErrorMessage
          message={error}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  const categoryProblems = problems.filter((problem) => {
    if (!problem.category) {
      console.warn(
        `Problème #${problem.idProblem} sans catégorie détecté`,
        problem,
      );
      return false;
    }
    return problem.category?.idCategory === Number(idCategory);
  });

  const category = categoryProblems[0]?.category;
  const categoryName = category ? category.name : "Catégorie";

  // Contexte SEO riche et ultra-ciblé pour chaque catégorie de ton site
  const getCategorySEOContext = (name: string) => {
    const lowerName = name.toLowerCase();
    switch (lowerName) {
      case "automobile":
      case "auto":
        return "Trouvez et partagez des solutions de diagnostic, des astuces de réparation et des résolutions de pannes mécaniques pour vos véhicules (voyants moteur, dysfonctionnements électroniques, entretien et pièces auto).";
      case "informatique":
        return "Résolvez vos bugs informatiques, pannes de matériel, problèmes de systèmes d'exploitation, logiciels et défis techniques grâce à l'entraide de la communauté SolvHub.";
      case "vélo":
        return "Guides de réparation, entretien de cycle, réglages de transmission, freinage et résolution de pannes pour tous types de vélos.";
      case "maison":
        return "Solutions pratiques, dépannage domestique et entraide pour l'habitat, les installations et la gestion de la maison au quotidien.";
      case "bricolage":
        return "Astuces de bricolage, tutoriels de réparation, rénovation et solutions techniques pour tous vos travaux manuels.";
      case "entretien":
        return "Conseils et méthodes d'entretien préventif et curatif pour vos équipements, machines et biens du quotidien.";
      case "jeux vidéo":
        return "Résolution de bugs de jeux, problèmes de performances graphiques, erreurs de lancement et entraide gaming sur toutes les plateformes.";
      case "électronique":
        return "Dépannage de circuits, pannes de matériel électronique, micro-soudure et entraide technique spécialisée.";
      case "photographie":
        return "Résolution de problèmes d'appareils photo, objectifs, réglages de prises de vue et pannes de matériel optique et numérique.";
      case "cuisine":
        return "Solutions de dépannage pour l'électroménager de cuisine, ustensiles et astuces techniques culinaires.";
      case "jardin":
        return "Entretien des espaces verts, pannes d'outils de jardinage (tondeuses, motorisations) et conseils pratiques.";
      default:
        return `Espace communautaire de résolution de problèmes et de pannes pour la thématique ${name}. Partagez vos diagnostics et trouvez des solutions testées par la communauté.`;
    }
  };

  const seoDescription = category ? getCategorySEOContext(category.name) : "Découvrez les problèmes et pannes sur SolvHub.";
  const pageTitle = category ? `${category.name} : Pannes, Diagnostics & Solutions | SolvHub` : "Catégorie | SolvHub";
  const currentUrl = window.location.href;

  return (
    <>
      <Helmet>
        {/* Balises SEO principales */}
        <title>{pageTitle}</title>
        <meta name="description" content={seoDescription} />
        
        {/* Balises OpenGraph pour le partage et l'indexation avancée */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:site_name" content="SolvHub" />
        
        {/* Lien canonique */}
        <link rel="canonical" href={currentUrl} />
      </Helmet>

      <div className="max-w-6xl px-4 md:px-6 mx-auto mt-6 space-y-8">
        <div className="flex items-center justify-between">
          <BackButton to={backTo} label={backLabel} />
        </div>

        {/* En-tête de la page pilier SEO */}
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            {category && <span aria-hidden="true">{category.icon}</span>}
            <span>{categoryName}</span>
          </h1>
          
          {/* Bloc éditorial SEO affiché sur la page pour guider les utilisateurs et Google */}
          {category && (
            <p className="text-slate-600 text-sm md:text-base max-w-3xl leading-relaxed">
              {seoDescription}
            </p>
          )}

          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider pt-2">
            {categoryProblems.length} problème(s) référencé(s) dans cette catégorie
          </p>
        </div>

        {categoryProblems.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-8 text-center">
            <p className="text-slate-500">
              Aucun problème disponible pour cette catégorie pour le moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryProblems.map((problem) => (
              <ProblemCard
                key={problem.idProblem}
                problem={problem}
                originTo={`/categories/${idCategory}`}
                originLabel={
                  category ? `Retour à ${category.name}` : "Retour à la catégorie"
                }
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}