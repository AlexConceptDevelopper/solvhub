import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProblems } from "../api/problem.api";
import { getCategoriesWithCount } from "../api/category.api";
import type { Problem } from "../types/problem";
import type { Category } from "../types/category";
import useAsync from "../hooks/useAsync";
import ErrorMessage from "../components/ErrorMessage";
import SearchFilterBar from "../components/SearchFilterBar";
import PrimaryButton from "../components/PrimaryButton";
import BackButton from "../components/BackButton";
import EmptyState from "../components/EmptyState";
import { matchesSearchQuery } from "../utils/searchUtils";
import LoadingState from "../components/LoadingState";

export default function ProblemsPage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [categoriesWithCount, setCategoriesWithCount] = useState<Category[]>(
    [],
  );
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Toutes");

  const [selectedBrand, setSelectedBrand] = useState("Toutes");
  const [selectedModel, setSelectedModel] = useState("Toutes");

  const navigate = useNavigate();
  const { loading, error, execute } = useAsync<any>();

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const [problemsData, categoriesData] = await Promise.all([
          execute(() => getProblems()),
          execute(() => getCategoriesWithCount()),
        ]);

        if (isMounted) {
          if (problemsData) setProblems(problemsData);
          if (categoriesData) setCategoriesWithCount(categoriesData);
        }
      } catch (err) {
        console.error("Erreur lors du chargement des données:", err);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const uniqueCategories = categoriesWithCount.map((c) => ({
    name: c.name,
    count: c.problemCount || 0,
  }));

  const automobileProblems = problems.filter(
    (p) => p.category?.name === "Automobile" && p.equipment,
  );

  const uniqueBrands = Array.from(
    new Set(
      automobileProblems
        .map((p) => p.equipment?.brand)
        .filter((brand): brand is string => Boolean(brand)),
    ),
  );

  const uniqueModels = Array.from(
    new Set(
      automobileProblems
        .filter(
          (p) =>
            selectedBrand === "Toutes" || p.equipment?.brand === selectedBrand,
        )
        .map((p) => p.equipment?.model)
        .filter((model): model is string => Boolean(model)),
    ),
  );

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    if (newCategory !== "Automobile") {
      setSelectedBrand("Toutes");
      setSelectedModel("Toutes");
    }
  };

  const filteredProblems = problems.filter((problem) => {
    if (!problem) return false;

    const matchesSearch =
      matchesSearchQuery(problem.title, search) ||
      matchesSearchQuery(problem.description, search);

    const matchesCategory =
      category === "Toutes" ||
      (problem.category && problem.category.name === category);

    let matchesEquipment = true;
    if (category === "Automobile") {
      const matchesBrand =
        selectedBrand === "Toutes" ||
        problem.equipment?.brand === selectedBrand;
      const matchesModel =
        selectedModel === "Toutes" ||
        problem.equipment?.model === selectedModel;
      matchesEquipment = matchesBrand && matchesModel;
    }

    return matchesSearch && matchesCategory && matchesEquipment;
  });

  if (loading && problems.length === 0) {
    return <LoadingState label="Chargement des problèmes..." />;
  }

  if (error && problems.length === 0) {
    return (
      <div className="p-6">
        <ErrorMessage
          message={error}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl px-4 md:px-6 mx-auto py-8 space-y-8">
      <div>
        <BackButton to="/" label="Retour à l'accueil" />
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Tous les problèmes
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Consultez les difficultés rencontrées par la communauté ou proposez
            vos solutions.
          </p>
        </div>

        <PrimaryButton
          onClick={() =>
            navigate("/problem/create", {
              state: {
                returnTo: "/problems",
                returnLabel: "Retour aux problèmes",
              },
            })
          }
          className="w-fit"
        >
          + Poser un problème
        </PrimaryButton>
      </div>

      <SearchFilterBar
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={handleCategoryChange}
        uniqueCategories={uniqueCategories}
      />

      {category === "Automobile" && (
        <div className="flex flex-col sm:flex-row gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Marque
            </label>
            <select
              value={selectedBrand}
              onChange={(e) => {
                setSelectedBrand(e.target.value);
                setSelectedModel("Toutes");
              }}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Toutes">Toutes les marques</option>
              {uniqueBrands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Modèle
            </label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Toutes">Tous les modèles</option>
              {uniqueModels.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center text-sm text-slate-500 px-1">
        <span>{filteredProblems.length} problème(s) trouvé(s)</span>
      </div>

      {filteredProblems.length === 0 ? (
        <EmptyState
          title={
            problems.length === 0
              ? "Aucun problème disponible pour le moment."
              : "Aucun problème ne correspond à votre recherche."
          }
          action={
            problems.length > 0 && (
              <button
                onClick={() => {
                  setSearch("");
                  setCategory("Toutes");
                  setSelectedBrand("Toutes");
                  setSelectedModel("Toutes");
                }}
                className="text-blue-600 font-semibold hover:underline cursor-pointer text-sm"
              >
                Réinitialiser les filtres
              </button>
            )
          }
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
          {filteredProblems.map((problem) => (
            <div
              key={problem.idProblem || Math.random()}
              onClick={() => navigate(`/problem/${problem.idProblem}`)}
              className="p-6 hover:bg-slate-50/80 transition cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3 text-xs">
                  {problem.category && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 border border-blue-200 text-blue-700 font-bold uppercase tracking-wider text-[11px]">
                      <span>{problem.category.icon || "🏷️"}</span>
                      <span>{problem.category.name}</span>
                    </span>
                  )}
                  {problem.equipment && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 font-medium border border-blue-100">
                      <span>🚗</span>
                      <span>
                        {problem.equipment.brand} {problem.equipment.model}
                      </span>
                    </span>
                  )}
                  {problem.createdAt && (
                    <span className="text-slate-400">
                      {new Date(problem.createdAt).toLocaleDateString("fr-FR")}
                    </span>
                  )}
                </div>

                <h2 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition">
                  {problem.title}
                </h2>

                <p className="text-sm text-slate-600 line-clamp-2">
                  {problem.description}
                </p>
              </div>

              <div className="flex items-center self-end md:self-center">
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition">
                  Voir les solutions →
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
