import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { getCategoriesWithCount } from "../api/category.api";
import type { Category } from "../types/category";
import BackButton from "../components/BackButton";

const CANONICAL_CATEGORIES_URL = "https://www.solvhub.fr/categories";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategoriesWithCount()
      .then((data) => {
        if (data) setCategories(data);
      })
      .catch((error) => console.error("Erreur chargement catégories :", error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Helmet>
        <title>Toutes les Catégories | SolvHub</title>
        <meta
          name="description"
          content="Explore les différents sujets et trouve des solutions adaptées sur SolvHub."
        />
        <meta property="og:title" content="Toutes les Catégories | SolvHub" />
        <meta
          property="og:description"
          content="Explore les différents sujets et trouve des solutions adaptées sur SolvHub."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={CANONICAL_CATEGORIES_URL} />
        <meta property="og:site_name" content="SolvHub" />
        <link rel="canonical" href={CANONICAL_CATEGORIES_URL} />
      </Helmet>

      <div className="max-w-6xl px-4 md:px-6 mx-auto py-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Toutes les Catégories
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Explore les différents sujets et trouve des solutions adaptées.
            </p>
          </div>
          <BackButton to="/" label="Retour à l'accueil" />
        </div>

        <div>
          {loading ? (
            <p className="text-center py-12 text-slate-500 font-medium">
              Chargement des catégories...
            </p>
          ) : categories.length === 0 ? (
            <p className="text-center py-12 text-slate-500 font-medium">
              Aucune catégorie trouvée.
            </p>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
              {categories.map((cat) => (
                <Link
                  key={cat.idCategory}
                  to={`/categories/${cat.idCategory}`}
                  state={{
                    returnTo: "/categories",
                    returnLabel: "Retour aux catégories",
                  }}
                  className="p-6 hover:bg-slate-50/80 transition cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                >
                  <div className="flex items-center gap-4">
                    <span
                      className="text-2xl p-2 bg-blue-50 border border-blue-100 rounded-xl"
                      aria-hidden="true"
                    >
                      {cat.icon || "🏷️"}
                    </span>
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition">
                        {cat.name}
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {cat.problemCount ?? 0} problème(s) répertorié(s)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center self-end md:self-center">
                    <span
                      className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition"
                      aria-label={`Explorer la catégorie ${cat.name}`}
                    >
                      Explorer →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}