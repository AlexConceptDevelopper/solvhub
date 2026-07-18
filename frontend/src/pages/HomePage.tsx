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
    <div className="max-w-6xl px-4 md:px-6 mx-auto">
      {/* HERO */}
      <section
        className="
          rounded-3xl
          bg-linear-to-r
          from-blue-600
          to-indigo-600
          text-white
          p-8
          md:p-12
          shadow-xl
        "
      >
        <div className="max-w-3xl">
          <p
            className="
              uppercase
              tracking-widest
              text-blue-100
              text-sm
              font-semibold
              mb-4
            "
          >
            Plateforme communautaire
          </p>

          <h1
            className="
              text-3xl
              md:text-5xl
              font-bold
              leading-tight
            "
          >
            Des solutions pour
            <br />
            chaque problème.
          </h1>

          <p
            className="
              mt-5
              text-blue-100
              text-base
              md:text-lg
              max-w-xl
            "
          >
            Trouvez de l'aide, partagez vos expériences et améliorez les
            solutions ensemble avec la communauté SolvHub.
          </p>

          <div
            className="
              flex
              flex-wrap
              gap-4
              mt-8
            "
          >
            <Link
              to="/problems"
              className="
              bg-white
              text-blue-600
              px-5
              py-2.5
              rounded-xl
              font-semibold
              hover:bg-blue-50
              transition
            "
            >
              Trouver une solution
            </Link>

            <button
              onClick={() => navigate("/problem/create")}
              className="
                border
                border-white/70
                px-5
                py-2.5
                rounded-xl
                hover:bg-white/10
                transition
              "
            >
              Poser un problème
            </button>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mt-12">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800">
              Catégories populaires
            </h2>

            <p className="text-slate-500 mt-1">
              Explorez les problèmes les plus fréquents.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.slice(0, 6).map((category) => (
            <div
              key={category.idCategory}
              onClick={() => navigate(`/categories/${category.idCategory}`)}
              className="
              bg-white/80
              backdrop-blur
              rounded-2xl
              p-6
              shadow-md
              border
              border-slate-200
              hover:-translate-y-1
              hover:shadow-lg
              transition
              cursor-pointer
              text-center
            "
            >
              <div className="text-4xl">{category.icon}</div>

              <h3 className="text-xl font-bold mt-4 text-slate-800">
                {category.name}
              </h3>

              <p className="text-slate-500 mt-2">
                {category.problemCount} problème
                {category.problemCount > 1 ? "s" : ""}
              </p>
            </div>
          ))}
        </div>

        {categories.length > 6 && (
          <button
            onClick={() => navigate("/categories")}
            className="
            mt-6
            flex
            items-center
            gap-2
            text-blue-600
            font-semibold
            hover:underline
            cursor-pointer
          "
          >
            Voir toutes les catégories →
          </button>
        )}
      </section>

      <RecentProblems />
      <div
        className="
          mt-8
          flex
          justify-center
        "
      >
        <button
          onClick={() => navigate("/problems")}
          className="
            rounded-xl
            border
            border-blue-600
            px-6
            py-3
            font-semibold
            text-blue-600
            hover:bg-blue-600
            hover:text-white
            transition
            cursor-pointer
          "
        >
          Voir tous les problèmes →
        </button>
      </div>
    </div>
  );
}
