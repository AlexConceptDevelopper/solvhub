import RecentProblems from "../components/RecentProblems";
import { Link, useNavigate } from "react-router-dom";
import type { Category } from "../types/category";
import { getCategoriesWithCount } from "../api/category.api";
import { useEffect, useState, type FormEvent } from "react";
import useAsync from "../hooks/useAsync";

export default function HomePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const [categories, setCategories] = useState<Category[]>([]);
  const { execute } = useAsync<Category[]>();

  useEffect(() => {
    const loadCategories = async () => {
      const data = await execute(() => getCategoriesWithCount());
      if (data) {
        const sorted = [...data].sort(
          (a, b) => b.problemCount - a.problemCount,
        );
        setCategories(sorted);
      }
    };
    loadCategories();
  }, []);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/problems?search=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="max-w-6xl px-4 md:px-6 mx-auto space-y-12 mt-6 mb-16">
      {/* HERO SECTION AVEC RECHERCHE */}
      <section
        className="
          relative
          overflow-hidden
          rounded-3xl
          bg-linear-to-b
          from-slate-50
          to-white
          text-slate-900
          p-8
          md:p-16
          shadow-sm
          border
          border-slate-200
        "
      >
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl z-10">
          <span
            className="
              inline-flex
              items-center
              gap-2
              px-3
              py-1
              rounded-full
              bg-blue-50
              border
              border-blue-200
              text-blue-700
              text-xs
              font-semibold
              uppercase
              tracking-wider
              mb-6
            "
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            Plateforme communautaire
          </span>

          <h1
            className="
              text-4xl
              md:text-6xl
              font-black
              tracking-tight
              leading-tight
              text-slate-900
            "
          >
            Des solutions pour <br />
            chaque{" "}
            <span className="bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              problème
            </span>
            .
          </h1>

          <p
            className="
              mt-6
              text-slate-600
              text-base
              md:text-lg
              leading-relaxed
              max-w-xl
            "
          >
            Trouvez de l'aide, partagez vos expériences et améliorez les
            solutions ensemble avec la communauté{" "}
            <span className="text-slate-900 font-semibold">SolvHub</span>.
          </p>

          <form onSubmit={handleSearch} className="mt-8 flex flex-col sm:flex-row items-center gap-3 max-w-xl">
            <div className="relative w-full">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                🔍
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un problème, un mot-clé..."
                className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 text-sm font-medium shadow-xs focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3.5 rounded-2xl font-bold text-sm shadow-md shadow-blue-600/20 hover:bg-blue-700 hover:shadow-lg transition-all duration-200 cursor-pointer shrink-0"
            >
              Rechercher
            </button>
          </form>

          <div className="flex flex-wrap items-center gap-4 mt-6">
            <Link
              to="/problems"
              className="text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
            >
              Ou parcourir tous les problèmes →
            </Link>

            <span className="text-slate-300">•</span>

            <button
              onClick={() =>
                navigate("/problem/create", {
                  state: { returnTo: "/", returnLabel: "Retour à l'accueil" },
                })
              }
              className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
            >
              + Poser un problème
            </button>
          </div>
        </div>
      </section>

      {/* SECTION DES DERNIERS PROBLÈMES */}
      <section
        className="
          bg-slate-50/80
          border
          border-slate-100
          rounded-3xl
          p-6
          md:p-10
          shadow-sm
        "
      >
        <RecentProblems returnTo="/" returnLabel="Retour à l'accueil" />

        <div className="flex justify-center mt-10">
          <button
            onClick={() => navigate("/problems")}
            className="
              text-sm
              font-bold
              text-slate-700
              hover:text-blue-600
              flex
              items-center
              gap-1.5
              group
              cursor-pointer
              bg-white
              border
              border-slate-200
              px-5
              py-2.5
              rounded-xl
              shadow-xs
              hover:border-blue-200
              hover:bg-blue-50/20
              hover:shadow-sm
              transition-all
            "
          >
            Voir tous les problèmes{" "}
            <span className="transform group-hover:translate-x-1 transition-transform">
              →
            </span>
          </button>
        </div>
      </section>

      {/* CATEGORIES POPULAIRES */}
      <section
        className="
          bg-slate-50/80
          border
          border-slate-100
          rounded-3xl
          p-6
          md:p-10
          shadow-sm
        "
      >
        <div className="max-w-xl mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Exploration
          </span>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 mt-3">
            Catégories populaires
          </h2>
          <p className="text-slate-500 text-sm md:text-base mt-2">
            Naviguez par thématique pour cibler les solutions de la communauté.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {categories.slice(0, 6).map((category) => (
            <div
              key={category.idCategory}
              onClick={() =>
                navigate(`/categories/${category.idCategory}`, {
                  state: { returnTo: "/", returnLabel: "Retour à l'accueil" },
                })
              }
              className="
                group
                relative
                bg-white
                rounded-2xl
                p-8
                border
                border-slate-200
                hover:border-blue-300
                hover:-translate-y-1.5
                transition-all
                duration-300
                cursor-pointer
                flex
                flex-col
                items-center
                justify-center
                text-center
                overflow-hidden
                shadow-sm
                hover:shadow-[0_0_25px_rgba(59,130,246,0.12)]
              "
            >
              <div className="absolute inset-0 bg-linear-to-b from-blue-500/0 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              <div
                className="
                  text-3xl
                  w-16
                  h-16
                  rounded-2xl
                  bg-blue-50
                  border
                  border-blue-100
                  group-hover:border-blue-300
                  group-hover:scale-110
                  flex
                  items-center
                  justify-center
                  transition-all
                  duration-300
                "
              >
                {category.icon}
              </div>

              <h3 className="text-lg font-bold tracking-tight mt-5 text-slate-900 group-hover:text-blue-600 transition-colors">
                {category.name}
              </h3>

              <span
                className="
                  mt-4
                  inline-flex
                  items-center
                  px-3
                  py-1
                  rounded-full
                  bg-slate-100
                  border
                  border-slate-200
                  text-slate-500
                  text-xs
                  font-bold
                  group-hover:bg-blue-50
                  group-hover:text-blue-600
                  group-hover:border-blue-200
                  transition-all
                  duration-300
                "
              >
                {category.problemCount} problème
                {category.problemCount > 1 ? "s" : ""}
              </span>
            </div>
          ))}
        </div>

        {categories.length > 6 && (
          <div className="flex justify-center mt-10">
            <button
              onClick={() => navigate("/categories")}
              className="
                text-sm
                font-bold
                text-slate-700
                hover:text-blue-600
                flex
                items-center
                gap-1.5
                group
                cursor-pointer
                bg-white
                border
                border-slate-200
                px-5
                py-2.5
                rounded-xl
                shadow-xs
                hover:border-blue-200
                hover:bg-blue-50/20
                hover:shadow-sm
                transition-all
              "
            >
              Toutes les catégories{" "}
              <span className="transform group-hover:translate-x-1 transition-transform">
                →
              </span>
            </button>
          </div>
        )}
      </section>
    </div>
  );
}