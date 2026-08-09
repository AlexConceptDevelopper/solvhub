import { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import { createSolution } from "../api/solution.api";

import type { SolutionCreate } from "../types/solutionCreate";
import ErrorMessage from "../components/ErrorMessage";
import BackButton from "../components/BackButton";
import PrimaryButton from "../components/PrimaryButton";

const MAX_FILE_SIZE_MB = 8; // marge de sécurité sous la limite serveur de 10MB
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export default function CreateSolutionPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const fromAdmin = location.state?.fromAdmin;

  const { problemId } = useParams();
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [images, setImages] = useState<FileList | null>(null);
  const [showVideoInput, setShowVideoInput] = useState(false);

  const [form, setForm] = useState<SolutionCreate & { videoUrl?: string }>({
    title: "",
    steps: "",
    difficulty: 1,
    timeMinutes: 5,
    riskLevel: 1,
    problemId: Number(problemId),
    videoUrl: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    setForm({
      ...form,
      [name]:
        type === "number"
          ? Number(value)
          : Number.isNaN(Number(value))
            ? value
            : Number(value),
    });
  };

  const formatSize = (bytes: number) => {
    return (bytes / (1024 * 1024)).toFixed(1);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    setImageError(null);

    if (!files || files.length === 0) {
      setImages(null);
      return;
    }

    // Vérifie chaque fichier individuellement
    const oversizedFiles = Array.from(files).filter(
      (file) => file.size > MAX_FILE_SIZE_BYTES,
    );

    if (oversizedFiles.length > 0) {
      const names = oversizedFiles
        .map((f) => `${f.name} (${formatSize(f.size)} Mo)`)
        .join(", ");
      setImageError(
        `Image(s) trop volumineuse(s) : ${names}. La taille maximale autorisée par image est de ${MAX_FILE_SIZE_MB} Mo.`,
      );
      setImages(null);
      e.target.value = ""; // reset le champ pour éviter d'envoyer un fichier invalide
      return;
    }

    // Vérifie aussi la taille cumulée de toutes les images
    const totalSize = Array.from(files).reduce((sum, f) => sum + f.size, 0);
    if (totalSize > MAX_FILE_SIZE_BYTES * 2) {
      setImageError(
        `La taille totale des images (${formatSize(totalSize)} Mo) dépasse la limite autorisée. Réduisez le nombre ou la taille des images.`,
      );
      setImages(null);
      e.target.value = "";
      return;
    }

    setImages(files);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (imageError) {
      return; // bloque la soumission tant que l'erreur d'image n'est pas résolue
    }

    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("steps", form.steps);
      formData.append("difficulty", form.difficulty.toString());
      formData.append("timeMinutes", form.timeMinutes.toString());
      formData.append("riskLevel", form.riskLevel.toString());
      formData.append("problemId", form.problemId.toString());

      if (form.videoUrl) {
        formData.append("videoUrl", form.videoUrl);
      }

      if (images) {
        for (let i = 0; i < images.length; i++) {
          formData.append("images", images[i]);
        }
      }

      const created = await createSolution(formData);

      navigate(`/solution/${created.idSolution}`);
    } catch (error) {
      console.error(error);
      setError(
        "Impossible de créer la solution. Si vous avez ajouté des images, vérifiez qu'elles ne dépassent pas la taille autorisée.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Proposer une solution | SolvHub</title>
        <meta name="description" content="Partagez votre solution technique pour résoudre ce problème sur SolvHub." />
      </Helmet>

      <div className="max-w-3xl mx-auto">
        <div className="bg-white/85 backdrop-blur rounded-3xl border border-slate-200 shadow-md p-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-slate-800">
              Proposer une solution
            </h1>
            <BackButton 
              to={fromAdmin ? "/admin" : `/problem/${problemId}`}
              state={fromAdmin ? { activeTab: "problems" } : undefined}
              label={fromAdmin ? "Retour à l'admin" : "Retour au problème"} 
            />
          </div>

          {error && (
            <ErrorMessage message={error} onRetry={() => setError(null)} />
          )}

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-6"
            autoComplete="off"
          >
            <div>
              <label htmlFor="solution-title" className="block font-semibold text-slate-700 mb-2">
                Titre
              </label>
              <input
                id="solution-title"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Ex : Redémarrer le service en mode sans échec"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-800 placeholder-slate-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition shadow-2xs"
                required
                autoComplete="off"
              />
            </div>

            <div>
              <label htmlFor="solution-steps" className="block font-semibold text-slate-700 mb-2">
                Étapes
              </label>
              <textarea
                id="solution-steps"
                name="steps"
                maxLength={2000}
                value={form.steps}
                onChange={handleChange}
                placeholder="Décrivez les étapes...(max 2000 caractères)"
                rows={6}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-800 placeholder-slate-400 bg-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition shadow-2xs"
                required
                autoComplete="off"
              />
            </div>

            <div>
              <label htmlFor="solution-difficulty" className="block font-semibold text-slate-700 mb-2">
                Difficulté
              </label>
              <select
                id="solution-difficulty"
                name="difficulty"
                value={form.difficulty}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-2xs"
              >
                <option value={1}>1 - Très facile</option>
                <option value={2}>2 - Facile</option>
                <option value={3}>3 - Moyen</option>
                <option value={4}>4 - Difficile</option>
                <option value={5}>5 - Très difficile</option>
              </select>
            </div>

            <div>
              <label htmlFor="solution-time" className="block font-semibold text-slate-700 mb-2">
                Temps estimé
              </label>
              <select
                id="solution-time"
                name="timeMinutes"
                value={form.timeMinutes}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-2xs"
              >
                <option value={5}>Moins de 10 minutes</option>
                <option value={15}>10 à 30 minutes</option>
                <option value={45}>30 minutes à 1 heure</option>
                <option value={120}>Plus d'une heure</option>
              </select>
            </div>

            <div>
              <label htmlFor="solution-risk" className="block font-semibold text-slate-700 mb-2">
                Niveau de risque
              </label>
              <select
                id="solution-risk"
                name="riskLevel"
                value={form.riskLevel}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-2xs"
              >
                <option value={1}>1 - Aucun risque</option>
                <option value={2}>2 - Faible risque</option>
                <option value={3}>3 - Risque modéré</option>
                <option value={4}>4 - Risque important</option>
                <option value={5}>5 - Danger élevé</option>
              </select>
            </div>

            <div className="pt-2">
              {!showVideoInput ? (
                <button
                  type="button"
                  onClick={() => setShowVideoInput(true)}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 bg-blue-50/80 hover:bg-blue-100/80 px-4 py-2.5 rounded-xl border border-blue-200 transition cursor-pointer"
                >
                  <span className="text-lg leading-none" aria-hidden="true">+</span>
                  <span>Ajouter une vidéo explicative (YouTube)</span>
                </button>
              ) : (
                <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-4 space-y-3 transition-all">
                  <div className="flex items-center justify-between">
                    <label htmlFor="solution-video" className="block font-semibold text-slate-700 text-sm">
                      🎬 Lien de la vidéo YouTube
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setShowVideoInput(false);
                        setForm({ ...form, videoUrl: "" });
                      }}
                      className="text-xs text-slate-400 hover:text-slate-600 font-medium cursor-pointer"
                    >
                      Retirer la vidéo
                    </button>
                  </div>
                  <input
                    id="solution-video"
                    type="url"
                    name="videoUrl"
                    value={form.videoUrl || ""}
                    onChange={handleChange}
                    placeholder="Ex : https://www.youtube.com/watch?v=..."
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-800 placeholder-slate-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition shadow-2xs text-sm"
                    autoComplete="off"
                  />
                  <p className="text-xs text-slate-500">
                    La vidéo s'affichera directement sous forme de lecteur intégré dans votre solution.
                  </p>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="solution-images" className="block font-semibold text-slate-700 mb-2">
                Images d'illustration (optionnel)
              </label>
              <input
                id="solution-images"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition cursor-pointer"
              />
              <p className="text-xs text-slate-500 mt-1.5">
                Taille maximale : {MAX_FILE_SIZE_MB} Mo par image.
              </p>
              {imageError && (
                <p className="text-xs text-red-600 font-medium mt-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  ⚠️ {imageError}
                </p>
              )}
              {images && images.length > 0 && !imageError && (
                <p className="text-xs text-emerald-700 font-medium mt-2">
                  ✓ {images.length} image{images.length > 1 ? "s" : ""} sélectionnée{images.length > 1 ? "s" : ""}
                </p>
              )}
            </div>

            <PrimaryButton
              type="submit"
              loading={loading}
              loadingLabel="Création..."
              disabled={!!imageError}
              className="w-full"
            >
              Créer la solution
            </PrimaryButton>
          </form>
        </div>
      </div>
    </>
  );
}
