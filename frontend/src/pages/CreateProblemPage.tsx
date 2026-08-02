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

  // Détection automatique des doublons en temps réel (Global sur le titre et la description)
  useEffect(() => {
    if (!form.title || form.title.trim().length < 3) {
      setAiChecked(false);
      setAiSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      const duplicates = await checkDuplicatesExecute(() =>
        checkDuplicates({
          title: form.title,
          description: form.description,
        }),
      );

      if (duplicates) {
        setAiSuggestions(duplicates);
        setAiChecked(true);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [form.title, form.description]);

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
    <div className="max-w-3xl mx-auto pb-12">
      <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-slate-200/80 shadow-xl p-8 md:p-10">
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              Espace Communauté
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 mt-2">
              Soumettre un problème technique
            </h1>
          </div>
          <BackButton to={backTo} label={backLabel} />
        </div>

        {(submitError || catError) && (
          <div className="mb-6">
            <ErrorMessage message={submitError || catError || "Une erreur est survenue"} />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
          {/* Titre */}
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2">
              Titre du problème <span className="text-blue-600">*</span>
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Ex : Panne de compresseur d'air sur ligne 2 ou voyant moteur allumé..."
              className="w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-slate-900 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all shadow-2xs font-medium"
              required
            />
          </div>

          {/* Catégorie */}
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2">
              Catégorie principale <span className="text-blue-600">*</span>
            </label>
            <select
              name="idCategory"
              value={form.idCategory}
              onChange={handleChange}
              disabled={loadingCats}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3.5 bg-slate-50/50 focus:bg-white text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all shadow-2xs font-medium cursor-pointer"
            >
              {loadingCats ? (
                <option>Chargement des catégories...</option>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 bg-slate-50/80 rounded-2xl border border-slate-200/80">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Marque (Optionnel)
              </label>
              <select
                value={selectedBrand}
                onChange={(e) => {
                  setSelectedBrand(e.target.value);
                  if (e.target.value !== "OTHER") setCustomBrand("");
                }}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all shadow-2xs text-sm mb-2"
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
                  placeholder="Nom de la nouvelle marque"
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all shadow-2xs text-sm"
                  required
                />
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Modèle (Optionnel)
              </label>
              {(selectedBrand && selectedBrand !== "OTHER") || (selectedBrand === "OTHER" && customBrand) ? (
                <select
                  value={selectedModel}
                  onChange={(e) => {
                    setSelectedModel(e.target.value);
                    if (e.target.value !== "OTHER") setCustomModel("");
                  }}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all shadow-2xs text-sm mb-2"
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
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 bg-slate-100 text-slate-400 cursor-not-allowed shadow-2xs text-sm"
                />
              )}

              {(selectedModel === "OTHER" || selectedBrand === "OTHER") && (
                <input
                  type="text"
                  value={customModel}
                  onChange={(e) => setCustomModel(e.target.value)}
                  placeholder="Nom du nouveau modèle"
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-900 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all shadow-2xs text-sm mt-2"
                  required
                />
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2">
              Description détaillée <span className="text-blue-600">*</span>
            </label>
            <textarea
              name="description"
              maxLength={1000}
              value={form.description}
              onChange={handleChange}
              rows={6}
              placeholder="Décrivez les symptômes, le contexte d'apparition et les vérifications déjà effectuées..."
              className="w-full rounded-2xl border border-slate-200 px-4 py-3.5 text-slate-900 bg-slate-50/50 focus:bg-white resize-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all shadow-2xs font-medium"
              required
            />
          </div>

          {/* Bloc de détection de doublons en temps réel */}
          <div className="bg-linear-to-br from-slate-50 to-blue-50/40 border border-slate-200/80 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <span>🛡️ Analyse anti-doublon intelligente</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Vérification automatique croisée dans toute la base pour éviter les redondances.
                </p>
              </div>
              {checkingAI && (
                <span className="inline-flex items-center gap-1.5 text-xs text-blue-600 font-bold bg-blue-100/60 px-3 py-1 rounded-full animate-pulse">
                  Analyse...
                </span>
              )}
            </div>

            {aiChecked && (
              <div className="mt-3 pt-3 border-t border-slate-200/60 space-y-2">
                {aiSuggestions.length > 0 ? (
                  <div>
                    <p className="text-xs font-bold text-amber-800 mb-2 flex items-center gap-1.5">
                      <span>⚠️ Un problème similaire existe déjà :</span>
                    </p>
                    {aiSuggestions.map((item) => (
                      <div
                        key={item.idProblem}
                        className="bg-white p-3.5 rounded-xl border border-amber-200/80 flex items-center justify-between gap-3 shadow-xs mb-2 hover:border-amber-400 transition-colors"
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">
                            {item.title}
                          </p>
                          <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                            {item.description}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => navigate(`/problem/${item.idProblem}`)}
                          className="shrink-0 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                        >
                          Consulter →
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-emerald-700 font-bold flex items-center gap-1.5 bg-emerald-50/80 p-2.5 rounded-xl border border-emerald-100">
                    <span>✨ Aucun doublon trouvé. Le sujet est inédit, vous pouvez publier !</span>
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="pt-2">
            <PrimaryButton
              type="submit"
              loading={submitting || loadingCats}
              loadingLabel="Publication en cours..."
              className="w-full py-4 text-base font-bold shadow-lg shadow-blue-500/25"
            >
              Publier le problème
            </PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  );
}