import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCategoriesWithCount } from "../api/category.api";
import type { Category } from "../types/category";
import BackButton from "../components/BackButton";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getCategoriesWithCount()
      .then((data) => {
        if (data) setCategories(data);
      })
      .catch((error) => console.error("Erreur chargement catégories :", error))
      .finally(() => setLoading(false));
  }, []);

  return (
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
              <div
                key={cat.idCategory}
                onClick={() =>
                  navigate(`/categories/${cat.idCategory}`, {
                    state: {
                      returnTo: "/categories",
                      returnLabel: "Retour aux catégories",
                    },
                  })
                }
                className="p-6 hover:bg-slate-50/80 transition cursor-pointer flex items-center justify-between gap-4 group"
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl p-2 bg-blue-50 border border-blue-100 rounded-xl">
                    {cat.icon || "🏷️"}
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {cat.problemCount ?? 0} problème(s) répertorié(s)
                    </p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition">
                  Explorer →
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
