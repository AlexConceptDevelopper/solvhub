import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { createProblem, checkDuplicates } from "../api/problem.api";
import { getCategories } from "../api/category.api";
import {
  getBrandsByCategory,
  getModelsByCategoryAndBrand,
  findEquipmentByCriteria,
  createEquipment,
} from "../api/equipment.api";

import type { ProblemCreate, Problem } from "../types/problem";
import type { Category } from "../types/category";
import useAsync from "../hooks/useAsync";
import ErrorMessage from "../components/ErrorMessage";
import BackButton from "../components/BackButton";
import PrimaryButton from "../components/PrimaryButton";

export default function CreateProblemPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as {
    returnTo?: string;
    returnLabel?: string;
  } | null;
  const backTo = state?.returnTo ?? "/";
  const backLabel = state?.returnLabel ?? "Retour à l'accueil";

  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [customBrand, setCustomBrand] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [customModel, setCustomModel] = useState<string>("");

  const [aiChecked, setAiChecked] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<Problem[]>([]);

  const [form, setForm] = useState<ProblemCreate>({
    title: "",
    description: "",
    idCategory: 0,
    idEquipment: undefined,
  });

  const {
    loading: submitting,
    error: submitError,
    execute: submitExecute,
  } = useAsync<Problem>();
  
  const {
    loading: loadingCats,
    error: catError,
    execute: fetchCatsExecute,
  } = useAsync<Category[]>();
  
  const { loading: checkingAI, execute: checkDuplicatesExecute } =
    useAsync<Problem[]>();

  useEffect(() => {
    const loadCategories = async () => {
      const data = await fetchCatsExecute(() => getCategories());
      if (data && data.length > 0) {
        setCategories(data);
        setForm((prev) => ({ ...prev, idCategory: data[0].idCategory }));
      }
    };
    loadCategories();
  }, []);

  // Chargement des marques lorsque la catégorie change
  useEffect(() => {
    const fetchBrands = async () => {
      if (form.idCategory) {
        try {
          const brandList = await getBrandsByCategory(form.idCategory);
          setBrands(brandList);
        } catch (err) {
          console.error("Erreur chargement marques", err);
          setBrands([]);
        }
      } else {
        setBrands([]);
      }
      setSelectedBrand("");
      setCustomBrand("");
      setModels([]);
      setSelectedModel("");
      setCustomModel("");
    };
    fetchBrands();
  }, [form.idCategory]);

  // Chargement des modèles lorsque la marque change
  useEffect(() => {
    const fetchModels = async () => {
      const activeBrand = selectedBrand === "OTHER" ? customBrand : selectedBrand;
      if (form.idCategory && activeBrand && selectedBrand !== "OTHER") {
        try {
          const modelList = await getModelsByCategoryAndBrand(form.idCategory, activeBrand);
          setModels(modelList);
        } catch (err) {
          console.error("Erreur chargement modèles", err);
          setModels([]);
        }
      } else if (selectedBrand !== "OTHER") {
        setModels([]);
      }
      setSelectedModel("");
      setCustomModel("");
    };
    fetchModels();
  }, [selectedBrand, customBrand, form.idCategory]);

  // ⚡ POINT 1 : Détection automatique des doublons en temps réel (avec Debounce 500ms)
  useEffect(() => {
    if (!form.title || form.title.length < 3) {
      setAiChecked(false);
      setAiSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      let equipmentId = undefined;
      try {
        equipmentId = await resolveOrCreateIndex();
      } catch (e) {
        // Ignorer l'erreur silencieusement pendant la frappe
      }

      const duplicates = await checkDuplicatesExecute(() =>
        checkDuplicates({
          title: form.title,
          description: form.description,
          categoryId: form.idCategory,
          equipmentId: equipmentId,
        }),
      );

      if (duplicates) {
        setAiSuggestions(duplicates);
        setAiChecked(true);
      }
    }, 500); // Attend 500ms après la dernière frappe de l'utilisateur

    return () => clearTimeout(timer);
  }, [form.title, form.description, form.idCategory, selectedBrand, customBrand, selectedModel, customModel]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: name === "idCategory" ? parseInt(value, 10) : value,
    });
  };

  // Résout ou crée l'équipement en arrière-plan à la volée
  const resolveOrCreateIndex = async (): Promise<number | undefined> => {
    const finalBrand = selectedBrand === "OTHER" ? customBrand.trim() : selectedBrand;
    const finalModel = selectedModel === "OTHER" ? customModel.trim() : selectedModel;

    if (!finalBrand || !finalModel) return undefined;

    try {
      const existing = await findEquipmentByCriteria(form.idCategory, finalBrand, finalModel);
      if (existing && existing.idEquipment) {
        return existing.idEquipment;
      }
    } catch (e) {
      // Non trouvé, on crée
    }

    try {
      const newEq = await createEquipment({
        category: { idCategory: form.idCategory },
        brand: finalBrand,
        model: finalModel,
      });

      if (!newEq || !newEq.idEquipment) {
        throw new Error("Erreur lors de la création de l'équipement");
      }

      return newEq.idEquipment;
    } catch (err) {
      console.error("Erreur création équipement", err);
      throw new Error("Impossible de créer l'équipement associé.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.idCategory === 0) return;

    let equipmentId = undefined;
    try {
      equipmentId = await resolveOrCreateIndex();
    } catch (err) {
      return;
    }

    const payload: ProblemCreate = {
      ...form,
      idEquipment: equipmentId,
    };

    const created = await submitExecute(() => createProblem(payload));

    if (created) {
      navigate(`/problem/${created.idProblem}`);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white/80 backdrop-blur rounded-3xl border border-slate-200 shadow-md p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-slate-800">
            Poser un problème
          </h1>
          <BackButton to={backTo} label={backLabel} />
        </div>

        {(submitError || catError) && (
          <ErrorMessage message={submitError || catError || "Une erreur est survenue"} />
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6" autoComplete="off">
          <div>
            <label className="block font-semibold text-slate-700 mb-2">Titre</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Ex : Mon appareil ne démarre plus"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-800 bg-white focus:ring-2 focus:ring-blue-500 transition shadow-2xs"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-2">Catégorie</label>
            <select
              name="idCategory"
              value={form.idCategory}
              onChange={handleChange}
              disabled={loadingCats}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 bg-white text-slate-800 focus:ring-2 focus:ring-blue-500 transition shadow-2xs"
            >
              {loadingCats ? (
                <option>Chargement...</option>
              ) : (
                categories.map((cat) => (
                  <option key={cat.idCategory} value={cat.idCategory}>
                    {cat.name}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* SÉLECTION MARQUE & MODÈLE EN CASCADE AVEC OPTION "AUTRE" */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div>
              <label className="block font-semibold text-slate-700 mb-2">Marque (Optionnel)</label>
              <select
                value={selectedBrand}
                onChange={(e) => {
                  setSelectedBrand(e.target.value);
                  if (e.target.value !== "OTHER") setCustomBrand("");
                }}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 bg-white text-slate-800 focus:ring-2 focus:ring-blue-500 transition shadow-2xs mb-2"
              >
                <option value="">-- Choisir une marque --</option>
                {brands.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
                <option value="OTHER">➕ Autre (Créer une marque)</option>
              </select>

              {selectedBrand === "OTHER" && (
                <input
                  type="text"
                  value={customBrand}
                  onChange={(e) => setCustomBrand(e.target.value)}
                  placeholder="Nom de la marque"
                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-slate-800 bg-white focus:ring-2 focus:ring-blue-500 transition shadow-2xs"
                  required
                />
              )}
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-2">Modèle (Optionnel)</label>
              {(selectedBrand && selectedBrand !== "OTHER") || (selectedBrand === "OTHER" && customBrand) ? (
                <select
                  value={selectedModel}
                  onChange={(e) => {
                    setSelectedModel(e.target.value);
                    if (e.target.value !== "OTHER") setCustomModel("");
                  }}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 bg-white text-slate-800 focus:ring-2 focus:ring-blue-500 transition shadow-2xs mb-2"
                >
                  <option value="">-- Choisir un modèle --</option>
                  {models.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                  <option value="OTHER">➕ Autre (Créer un modèle)</option>
                </select>
              ) : (
                <input
                  type="text"
                  disabled
                  placeholder="Sélectionnez d'abord une marque"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 bg-slate-100 text-slate-400 cursor-not-allowed shadow-2xs"
                />
              )}

              {(selectedModel === "OTHER" || selectedBrand === "OTHER") && (
                <input
                  type="text"
                  value={customModel}
                  onChange={(e) => setCustomModel(e.target.value)}
                  placeholder="Nom du modèle"
                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-slate-800 bg-white focus:ring-2 focus:ring-blue-500 transition shadow-2xs mt-2"
                  required
                />
              )}
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-2">Description</label>
            <textarea
              name="description"
              maxLength={1000}
              value={form.description}
              onChange={handleChange}
              rows={6}
              placeholder="Expliquez votre problème..."
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-800 bg-white resize-none focus:ring-2 focus:ring-blue-500 transition shadow-2xs"
              required
            />
          </div>

          {/* Bloc de détection de doublons en temps réel (Le bouton a été retiré, tout est automatisé) */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <span>🛡️ Détection de doublons</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Vérification automatique pendant que vous écrivez...
                </p>
              </div>
              {checkingAI && (
                <span className="text-xs text-blue-600 font-medium animate-pulse">
                  Vérification...
                </span>
              )}
            </div>

            {aiChecked && (
              <div className="mt-3 pt-3 border-t border-slate-200 space-y-2">
                {aiSuggestions.length > 0 ? (
                  <div>
                    <p className="text-xs font-bold text-amber-800 mb-2">
                      ⚠️ Problèmes similaires détectés :
                    </p>
                    {aiSuggestions.map((item) => (
                      <div
                        key={item.idProblem}
                        className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between gap-2 shadow-xs mb-2"
                      >
                        <div>
                          <p className="text-xs font-semibold text-slate-800">
                            {item.title}
                          </p>
                          <p className="text-[11px] text-slate-500 line-clamp-1">
                            {item.description}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => navigate(`/problem/${item.idProblem}`)}
                          className="text-xs font-semibold text-blue-600 hover:underline whitespace-nowrap cursor-pointer"
                        >
                          Voir →
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-emerald-700 font-semibold">
                    ✨ Aucun doublon détecté. Vous pouvez publier !
                  </p>
                )}
              </div>
            )}
          </div>

          <PrimaryButton
            type="submit"
            loading={submitting || loadingCats}
            loadingLabel="Création..."
            className="w-full"
          >
            Créer le problème
          </PrimaryButton>
        </form>
      </div>
    </div>
  );
}