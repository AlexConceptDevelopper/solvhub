import { useEffect, useState, useMemo } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { getProblems } from "../api/problem.api";
import { getCategoriesWithCount } from "../api/category.api";
import type { Problem } from "../types/problem";
import type { Category } from "../types/category";
import useAsync from "../hooks/useAsync";
import ErrorMessage from "../components/ErrorMessage";
import PrimaryButton from "../components/PrimaryButton";
import BackButton from "../components/BackButton";
import EmptyState from "../components/EmptyState";
import LoadingState from "../components/LoadingState";
import { matchesSearchQuery } from "../utils/searchUtils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const [jumpPage, setJumpPage] = useState("");

  if (totalPages <= 1) return null;

  const handleJumpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNum = Number(jumpPage);
    if (pageNum >= 1 && pageNum <= totalPages) {
      onPageChange(pageNum);
      setJumpPage("");
    }
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, currentPage + 2);

      if (currentPage <= 3) {
        end = Math.min(totalPages, maxPagesToShow);
      } else if (currentPage >= totalPages - 2) {
        start = Math.max(1, totalPages - maxPagesToShow + 1);
      }

      if (start > 1) {
        pages.push(1);
        if (start > 2) pages.push("...");
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages) {
        if (end < totalPages - 1) pages.push("...");
      }
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 border-t border-slate-200">
      <div className="text-sm text-slate-500">
        Page <span className="font-semibold text-slate-900">{currentPage}</span> sur{" "}
        <span className="font-semibold text-slate-900">{totalPages}</span>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap justify-center">
        <button
          type="button"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition"
          title="Première page"
        >
          &laquo;&laquo;
        </button>

        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition"
        >
          Précédent
        </button>

        {getPageNumbers().map((page, index) =>
          typeof page === "number" ? (
            <button
              key={index}
              type="button"
              onClick={() => onPageChange(page)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border cursor-pointer transition ${
                currentPage === page
                  ? "bg-blue-600 border-blue-600 text-white shadow-xs"
                  : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
              }`}
            >
              {page}
            </button>
          ) : (
            <span key={index} className="px-2 text-slate-400 font-semibold text-xs">
              {page}
            </span>
          )
        )}

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition"
        >
          Suivant
        </button>

        <button
          type="button"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition"
          title="Dernière page"
        >
          &raquo;&raquo;
        </button>
      </div>

      <form onSubmit={handleJumpSubmit} className="flex items-center gap-2">
        <span className="text-xs text-slate-500">Aller à :</span>
        <input
          type="number"
          min="1"
          max={totalPages}
          value={jumpPage}
          onChange={(e) => setJumpPage(e.target.value)}
          placeholder="N°"
          className="w-16 px-2 py-1 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-500 text-center"
        />
        <button
          type="submit"
          className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg border border-slate-300 cursor-pointer transition"
        >
          OK
        </button>
      </form>
    </div>
  );
}

const ITEMS_PER_PAGE = 6; // Nombre d'éléments par page

export default function ProblemsPage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [categoriesWithCount, setCategoriesWithCount] = useState<Category[]>([]);
  const [category, setCategory] = useState("Toutes");

  const [selectedBrand, setSelectedBrand] = useState("Toutes");
  const [selectedModel, setSelectedModel] = useState("Toutes");
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

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
    setCurrentPage(1); // Retour à la première page
    if (newCategory !== "Automobile") {
      setSelectedBrand("Toutes");
      setSelectedModel("Toutes");
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCurrentPage(1); // Retour à la première page
    setSearchParams((prev) => {
      if (value.trim()) {
        prev.set("search", value);
      } else {
        prev.delete("search");
      }
      return prev;
    });
  };

  // 1. Filtrage + 2. Tri décroissant (Du plus récent au plus ancien)
  const filteredProblems = useMemo(() => {
    return problems
      .filter((problem) => {
        if (!problem) return false;

        const brand = problem.equipment?.brand || "";
        const model = problem.equipment?.model || "";
        
        const matchesSearch =
          matchesSearchQuery(problem.title, searchQuery) ||
          matchesSearchQuery(problem.description, searchQuery) ||
          matchesSearchQuery(brand, searchQuery) ||
          matchesSearchQuery(model, searchQuery);

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
      })
      .sort((a, b) => {
        // Tri décroissant : les plus récents d'abord
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
  }, [problems, searchQuery, category, selectedBrand, selectedModel]);

  // Calcul du nombre total de pages
  const totalPages = Math.ceil(filteredProblems.length / ITEMS_PER_PAGE);

  // Découpage des problèmes pour la page courante
  const paginatedProblems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProblems.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProblems, currentPage]);

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

      <div className="relative">
        <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
          🔍
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Rechercher par mot-clé (ex: écran, broute, batterie)..."
          className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-slate-800 text-sm shadow-xs focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => {
              searchParams.delete("search");
              setSearchParams(searchParams);
              setCurrentPage(1);
            }}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-xs font-semibold text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            Effacer
          </button>
        )}
      </div>

      {searchQuery && (
        <div className="flex items-center justify-between bg-blue-50 border border-blue-200 px-4 py-3 rounded-xl text-sm text-blue-800">
          <span>
            Résultats pour : <strong className="font-semibold">"{searchQuery}"</strong>
          </span>
          <span className="text-xs font-medium text-blue-600">
            {filteredProblems.length} trouvé(s)
          </span>
        </div>
      )}

      <SearchFilterBar
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
                setCurrentPage(1);
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
              onChange={(e) => {
                setSelectedModel(e.target.value);
                setCurrentPage(1);
              }}
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
        <span>{filteredProblems.length} problème(s) au total</span>
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
                  searchParams.delete("search");
                  setSearchParams(searchParams);
                  setCategory("Toutes");
                  setSelectedBrand("Toutes");
                  setSelectedModel("Toutes");
                  setCurrentPage(1);
                }}
                className="text-blue-600 font-semibold hover:underline cursor-pointer text-sm"
              >
                Réinitialiser les filtres
              </button>
            )
          }
        />
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
            {paginatedProblems.map((problem) => (
              <Link
                key={problem.idProblem || Math.random()}
                to={`/problem/${problem.idProblem}`}
                state={{
                  returnTo: "/problems",
                  returnLabel: "Retour aux problèmes",
                }}
                className="p-6 hover:bg-slate-50/80 transition cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3 text-xs flex-wrap">
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
              </Link>
            ))}
          </div>

          {/* Composant de pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        </div>
      )}
    </div>
  );
}

interface SearchFilterBarProps {
  category: string;
  setCategory: (category: string) => void;
  uniqueCategories: { name: string; count: number }[];
}

export function SearchFilterBar({
  category,
  setCategory,
  uniqueCategories,
}: SearchFilterBarProps) {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      <button
        onClick={() => setCategory("Toutes")}
        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
          category === "Toutes"
            ? "bg-blue-600 text-white shadow-sm"
            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
        }`}
      >
        Toutes
      </button>
      {uniqueCategories.map((cat) => (
        <button
          key={cat.name}
          onClick={() => setCategory(cat.name)}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            category === cat.name
              ? "bg-blue-600 text-white shadow-sm"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          {cat.name} ({cat.count})
        </button>
      ))}
    </div>
  );
}