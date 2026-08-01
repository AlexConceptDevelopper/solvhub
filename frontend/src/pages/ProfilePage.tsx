import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import useAsync from "../hooks/useAsync";
import { updateProfile, changePassword } from "../api/user.api";
import { getProblemsByUser, deleteProblem } from "../api/problem.api"; 
import { getSolutionsByUser, deleteSolution } from "../api/solution.api"; 
import BackButton from "../components/BackButton";
import PrimaryButton from "../components/PrimaryButton";
import type { Problem } from "../types/problem";
import type { Solution } from "../types/solution";

type TabType = "info" | "problems" | "solutions";

export default function ProfilePage() {
  const { user, updateUser } = useAuth();

  // --- Onglet actif ---
  const [activeTab, setActiveTab] = useState<TabType>("info");

  // --- États profil ---
  const [username, setUsername] = useState("");
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(true);
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError, setProfileError] = useState<string | null>(null);

  // --- États mot de passe ---
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  // --- États contenus utilisateur ---
  const [userProblems, setUserProblems] = useState<Problem[]>([]);
  const [userSolutions, setUserSolutions] = useState<Solution[]>([]);
  const [contentLoading, setContentLoading] = useState(true);

  const {
    loading: profileLoading,
    error: profileAsyncError,
    execute: executeProfile,
  } = useAsync<any>();
  const {
    loading: passwordLoading,
    error: passwordAsyncError,
    execute: executePassword,
  } = useAsync<any>();

  useEffect(() => {
    if (user) {
      if (user.username) setUsername(user.username);
      if (user.emailNotificationsEnabled !== undefined) {
        setEmailNotificationsEnabled(user.emailNotificationsEnabled);
      }
      fetchUserContent();
    }
  }, [user]);

  const fetchUserContent = async () => {
    if (!user?.idUsers) return;
    setContentLoading(true);
    try {
      const [problemsData, solutionsData] = await Promise.all([
        getProblemsByUser(user.idUsers).catch(() => []),
        getSolutionsByUser(user.idUsers).catch(() => []),
      ]);
      setUserProblems(problemsData);
      setUserSolutions(solutionsData);
    } catch (error) {
      console.error("Erreur lors du chargement du contenu utilisateur :", error);
    } finally {
      setContentLoading(false);
    }
  };

  const handleDeleteUserProblem = async (idProblem: number) => {
    try {
      await deleteProblem(idProblem);
      setUserProblems((prev) => prev.filter((p) => p.idProblem !== idProblem));
    } catch (error) {
      console.error("Erreur lors de la suppression du problème :", error);
    }
  };

  const handleDeleteUserSolution = async (idSolution: number) => {
    try {
      await deleteSolution(idSolution);
      setUserSolutions((prev) => prev.filter((s) => s.idSolution !== idSolution));
    } catch (error) {
      console.error("Erreur lors de la suppression de la solution :", error);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setProfileError(null);
    setProfileSuccess("");

    if (!username.trim()) {
      setProfileError("Le nom d'utilisateur ne peut pas être vide.");
      return;
    }

    if (!user?.idUsers) {
      setProfileError("Utilisateur non identifié.");
      return;
    }

    const result = await executeProfile(() =>
      updateProfile(user.idUsers, { username, emailNotificationsEnabled }),
    );

    if (result) {
      setProfileSuccess("Profil mis à jour avec succès !");
      updateUser({ username, emailNotificationsEnabled });
    }
  };

  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalError(null);
    setPasswordSuccess("");

    if (newPassword !== confirmPassword) {
      setLocalError("Les nouveaux mots de passe ne correspondent pas.");
      return;
    }

    if (newPassword.length < 6) {
      setLocalError("Le nouveau mot de passe doit faire au moins 6 caractères.");
      return;
    }

    const result = await executePassword(() =>
      changePassword({ oldPassword, newPassword }),
    );

    if (result) {
      setPasswordSuccess("Mot de passe modifié avec succès !");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordForm(false);
    }
  };

  const displayProfileError = profileError || profileAsyncError;
  const displayPasswordError = localError || passwordAsyncError;

  return (
    <div className="min-h-screen p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-900">
            Mon Espace Profil
          </h1>
          <BackButton to="/" label="Retour à l'accueil" />
        </div>

        {/* --- Barre de navigation par Onglets --- */}
        <div className="flex border-b border-slate-200 gap-2">
          <button
            onClick={() => setActiveTab("info")}
            className={`px-5 py-3 font-semibold text-sm border-b-2 transition cursor-pointer ${
              activeTab === "info"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            ⚙️ Mes informations
          </button>
          <button
            onClick={() => setActiveTab("problems")}
            className={`px-5 py-3 font-semibold text-sm border-b-2 transition cursor-pointer ${
              activeTab === "problems"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            ❓ Mes problèmes ({userProblems.length})
          </button>
          <button
            onClick={() => setActiveTab("solutions")}
            className={`px-5 py-3 font-semibold text-sm border-b-2 transition cursor-pointer ${
              activeTab === "solutions"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            💡 Mes solutions ({userSolutions.length})
          </button>
        </div>

        {/* --- Contenu de l'onglet : INFORMATIONS --- */}
        {activeTab === "info" && (
          <div className="space-y-8 animate-fadeIn">
            <div className="bg-white border border-slate-200 shadow-xs p-6 rounded-2xl">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                Informations personnelles
              </h2>

              {profileSuccess && (
                <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-sm">
                  {profileSuccess}
                </div>
              )}

              {displayProfileError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
                  {displayProfileError}
                </div>
              )}

              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-600 mb-1">
                    Nom d'utilisateur
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    disabled
                    defaultValue={user?.email}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-500 cursor-not-allowed"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <div>
                    <h4 className="font-semibold text-slate-900 text-sm">Notifications par e-mail</h4>
                    <p className="text-xs text-slate-500">Recevoir une alerte lorsqu'une solution est proposée à l'un de mes problèmes.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={emailNotificationsEnabled} 
                      onChange={(e) => setEmailNotificationsEnabled(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <PrimaryButton
                  type="submit"
                  loading={profileLoading}
                  loadingLabel="Enregistrement..."
                  className="px-6 py-2"
                >
                  Enregistrer les modifications
                </PrimaryButton>
              </form>
            </div>

            <div className="bg-white border border-slate-200 shadow-xs p-6 rounded-2xl">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Sécurité</h2>

              {passwordSuccess && (
                <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-sm">
                  {passwordSuccess}
                </div>
              )}

              {!showPasswordForm ? (
                <button
                  onClick={() => setShowPasswordForm(true)}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors cursor-pointer"
                >
                  Changer mon mot de passe
                </button>
              ) : (
                <form onSubmit={handlePasswordChange} className="space-y-4 mt-2">
                  {displayPasswordError && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
                      {displayPasswordError}
                    </div>
                  )}
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">
                      Ancien mot de passe
                    </label>
                    <input
                      type="password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      required
                      className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">
                      Nouveau mot de passe
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">
                      Confirmer le nouveau mot de passe
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div className="flex items-center gap-3 pt-2">
                    <PrimaryButton
                      type="submit"
                      loading={passwordLoading}
                      loadingLabel="Modification..."
                      className="px-5 py-2 text-sm"
                    >
                      Mettre à jour le mot de passe
                    </PrimaryButton>
                    <button
                      type="button"
                      onClick={() => {
                        setShowPasswordForm(false);
                        setLocalError(null);
                      }}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-4 py-2 rounded-xl transition-all cursor-pointer text-sm"
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* --- Contenu de l'onglet : MES PROBLÈMES --- */}
        {activeTab === "problems" && (
          <div className="bg-white border border-slate-200 shadow-xs p-6 rounded-2xl space-y-4 animate-fadeIn">
            <h2 className="text-lg font-semibold text-slate-900">
              Mes problèmes postés ({userProblems.length})
            </h2>

            {contentLoading ? (
              <p className="text-slate-400 text-sm italic">Chargement de vos problèmes...</p>
            ) : userProblems.length === 0 ? (
              <p className="text-slate-400 text-sm">Vous n'avez posté aucun problème pour le moment.</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {userProblems.map((prob) => (
                  <div key={prob.idProblem} className="py-4 flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold text-slate-900 text-sm">{prob.title}</h4>
                      <p className="text-xs text-slate-500 line-clamp-1">{prob.description}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs px-2.5 py-1 bg-slate-100 font-medium text-slate-600 rounded-lg">
                        {prob.category?.name || "Général"}
                      </span>
                      <button
                        onClick={() => handleDeleteUserProblem(prob.idProblem)}
                        className="text-red-600 hover:text-red-700 text-xs font-semibold px-3 py-1.5 bg-red-50 hover:bg-red-100 rounded-lg transition cursor-pointer"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* --- Contenu de l'onglet : MES SOLUTIONS --- */}
        {activeTab === "solutions" && (
          <div className="bg-white border border-slate-200 shadow-xs p-6 rounded-2xl space-y-4 animate-fadeIn">
            <h2 className="text-lg font-semibold text-slate-900">
              Mes solutions postées ({userSolutions.length})
            </h2>

            {contentLoading ? (
              <p className="text-slate-400 text-sm italic">Chargement de vos solutions...</p>
            ) : userSolutions.length === 0 ? (
              <p className="text-slate-400 text-sm">Vous n'avez posté aucune solution pour le moment.</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {userSolutions.map((sol) => (
                  <div key={sol.idSolution} className="py-4 flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold text-slate-900 text-sm">{sol.title}</h4>
                      <p className="text-xs text-slate-500 line-clamp-1">{sol.steps}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-500">⏱️ {sol.timeMinutes} min</span>
                      <span className="text-xs px-2.5 py-1 bg-blue-50 font-medium text-blue-700 rounded-lg">
                        Difficulté: {sol.difficulty}/5
                      </span>
                      <button
                        onClick={() => handleDeleteUserSolution(sol.idSolution)}
                        className="text-red-600 hover:text-red-700 text-xs font-semibold px-3 py-1.5 bg-red-50 hover:bg-red-100 rounded-lg transition cursor-pointer"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}