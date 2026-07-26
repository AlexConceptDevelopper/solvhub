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
    <div className="p-8 space-y-8">
      <div className="max-w-3xl md:max-w-4xl lg:max-w-5xl mx-auto flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Toutes les Catégories</h1>
          <p className="text-sm mt-1 text-slate-500">
            Explore les différents sujets et trouve des solutions adaptées.
          </p>
        </div>
        <BackButton to="/" label="Retour à l'accueil" />
      </div>

      <div className="max-w-3xl md:max-w-4xl lg:max-w-5xl mx-auto">
        {loading ? (
          <p className="text-center py-12 text-slate-500">Chargement des catégories...</p>
        ) : categories.length === 0 ? (
          <p className="text-center py-12 text-slate-500">Aucune catégorie trouvée.</p>
        ) : (
          <div className="rounded-xl bg-slate-900 divide-y divide-slate-800 overflow-hidden">
            {categories.map((cat) => (
              <div
                key={cat.idCategory}
                onClick={() => navigate(`/categories/${cat.idCategory}`)}
                className="
                  px-5
                  py-4
                  hover:bg-slate-800
                  transition-colors
                  duration-150
                  flex
                  items-center
                  justify-between
                  cursor-pointer
                "
              >
                <div className="flex items-center gap-4">
                  <span className="text-xl">
                    {cat.icon || "🏷️"}
                  </span>
                  <h3 className="font-semibold text-sm text-white">{cat.name}</h3>
                </div>
                <span className="text-xs text-slate-400">
                  {cat.problemCount ?? 0} problème(s)
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}