import RecentProblems from "../components/RecentProblems";
import { Link, useNavigate } from "react-router-dom";
import type { Category } from "../types/category";
import { getCategoriesWithCount } from "../api/category.api";
import { useEffect, useState } from "react";
import useAsync from "../hooks/useAsync";

export default function HomePage() {
  const navigate = useNavigate();

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

  return (
    <div className="max-w-6xl px-4 md:px-6 mx-auto space-y-12 mt-6 mb-16">
      {/* HERO SECTION */}
      <section
        className="
          relative
          overflow-hidden
          rounded-3xl
          bg-radial
          from-slate-900
          via-slate-950
          to-black
          text-white
          p-8
          md:p-16
          shadow-2xl
          border
          border-slate-800/60
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
              bg-blue-500/10
              border
              border-blue-500/20
              text-blue-400
              text-xs
              font-semibold
              uppercase
              tracking-wider
              mb-6
              backdrop-blur-xs
            "
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            Plateforme communautaire
          </span>

          <h1
            className="
              text-4xl
              md:text-6xl
              font-black
              tracking-tight
              leading-tight
              bg-linear-to-b
              from-white
              to-slate-300
              bg-clip-text
              text-transparent
            "
          >
            Des solutions pour <br />
            chaque{" "}
            <span className="bg-linear-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              problème
            </span>
            .
          </h1>

          <p
            className="
              mt-6
              text-slate-400
              text-base
              md:text-lg
              leading-relaxed
              max-w-xl
            "
          >
            Trouvez de l'aide, partagez vos expériences et améliorez les
            solutions ensemble avec la communauté{" "}
            <span className="text-white font-medium">SolvHub</span>.
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-10">
            <Link
              to="/problems"
              className="
                bg-blue-600
                text-white
                px-6
                py-3
                rounded-xl
                font-semibold
                text-sm
                shadow-lg
                shadow-blue-600/20
                hover:bg-blue-500
                hover:shadow-blue-500/30
                hover:-translate-y-0.5
                transition-all
                duration-200
                cursor-pointer
              "
            >
              Trouver une solution
            </Link>

            <button
              onClick={() => navigate("/problem/create")}
              className="
                bg-slate-900/80
                border
                border-slate-800
                text-slate-200
                px-6
                py-3
                rounded-xl
                font-semibold
                text-sm
                hover:bg-slate-800
                hover:text-white
                hover:border-slate-700
                hover:-translate-y-0.5
                transition-all
                duration-200
                cursor-pointer
              "
            >
              Poser un problème
            </button>
          </div>
        </div>
      </section>

      {/* CATEGORIES - AJOUT D'UN BLOC DE FOND COHÉRENT ET ASSORTI */}
      <section 
        className="
          bg-slate-50/80 
          border 
          border-slate-100 
          rounded-3xl 
          p-6 
          md:p-10 
          shadow-xs
        "
      >
        <div className="max-w-xl mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-150">
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
              onClick={() => navigate(`/categories/${category.idCategory}`)}
              className="
                group
                relative
                bg-radial
                from-slate-900/95
                via-slate-950/98
                to-black
                rounded-2xl
                p-8
                border
                border-slate-850
                hover:border-blue-500/40
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
                shadow-xl
              "
            >
              <div className="absolute inset-0 bg-linear-to-b from-blue-500/0 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              <div
                className="
                  text-3xl
                  w-16
                  h-16
                  rounded-2xl
                  bg-slate-900
                  border
                  border-slate-800
                  shadow-[inset_0_1px_2px_rgba(255,255,255,0.05)]
                  group-hover:border-blue-500/40
                  group-hover:bg-slate-950
                  group-hover:scale-110
                  group-hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]
                  flex
                  items-center
                  justify-center
                  transition-all
                  duration-300
                "
              >
                {category.icon}
              </div>

              <h3 className="text-lg font-bold tracking-tight mt-5 bg-linear-to-b from-white to-slate-300 bg-clip-text text-transparent group-hover:from-white group-hover:to-blue-200 transition-all">
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
                  bg-slate-900
                  border
                  border-slate-800
                  text-slate-400
                  text-xs
                  font-bold
                  group-hover:bg-blue-500/10
                  group-hover:text-blue-400
                  group-hover:border-blue-500/20
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

      {/* SECTION DES DERNIERS PROBLÈMES */}
      <RecentProblems />

      {/* BOUTON FINAL VOIR TOUT */}
      <div className="flex justify-center pt-4">
        <button
          onClick={() => navigate("/problems")}
          className="
            rounded-xl
            border
            border-slate-200
            bg-white
            px-6
            py-3
            font-bold
            text-sm
            text-slate-800
            hover:text-blue-600
            hover:border-blue-200
            hover:bg-blue-50/20
            shadow-xs
            hover:shadow-md
            transition-all
            duration-200
            cursor-pointer
          "
        >
          Voir tous les problèmes →
        </button>
      </div>
    </div>
  );
}