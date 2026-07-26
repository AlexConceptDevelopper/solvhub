import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import useAsync from "../hooks/useAsync";
import { updateProfile, changePassword } from "../api/user.api";

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  // États pour la section informations personnelles
  const [username, setUsername] = useState("");
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(true);
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError, setProfileError] = useState<string | null>(null);

  // États pour la section mot de passe
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  // Hook async pour le profil et le mot de passe
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

  // Synchroniser le username et les préférences lorsque l'utilisateur est chargé
  useEffect(() => {
    if (user) {
      if (user.username) setUsername(user.username);
      if (user.emailNotificationsEnabled !== undefined) {
        setEmailNotificationsEnabled(user.emailNotificationsEnabled);
      }
    }
  }, [user]);

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

    // Envoi du username et du statut des notifications au backend
    const result = await executeProfile(() =>
      updateProfile(user.idUsers, { username, emailNotificationsEnabled }),
    );

    if (result) {
      setProfileSuccess("Profil mis à jour avec succès !");

      // Met à jour le contexte global et le localStorage instantanément
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
      setLocalError(
        "Le nouveau mot de passe doit faire au moins 6 caractères.",
      );
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
    <div className="min-h-screen bg-slate-600/60 p-6 md:p-12 text-slate-200 rounded-2xl">
      <button
        onClick={() => navigate("/")}
        className="flex items-center mx-auto px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition-all cursor-pointer mb-8"
      >
        <svg
          className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        <span>Retour à l'accueil</span>
      </button>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">
          Paramètres du profil
        </h1>

        <div className="grid gap-8">
          {/* Section Informations */}
          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
            <h2 className="text-lg font-semibold text-white mb-4">
              Informations personnelles
            </h2>

            {profileSuccess && (
              <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-sm">
                {profileSuccess}
              </div>
            )}

            {displayProfileError && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-sm">
                {displayProfileError}
              </div>
            )}

            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">
                  Nom d'utilisateur
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-white focus:border-blue-500 outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  disabled
                  defaultValue={user?.email}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-slate-500 cursor-not-allowed"
                />
              </div>

              {/* Préférence de Notification par Email */}
              <div className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-xl">
                <div>
                  <h4 className="font-semibold text-white text-sm">Notifications par e-mail</h4>
                  <p className="text-xs text-slate-400">Recevoir une alerte lorsqu'une solution est proposée à l'un de mes problèmes.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={emailNotificationsEnabled} 
                    onChange={(e) => setEmailNotificationsEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-slate-700 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <button
                type="submit"
                disabled={profileLoading}
                className="bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-bold px-6 py-2 rounded-xl transition-all cursor-pointer"
              >
                {profileLoading
                  ? "Enregistrement..."
                  : "Enregistrer les modifications"}
              </button>
            </form>
          </div>

          {/* Section Sécurité */}
          <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
            <h2 className="text-lg font-semibold text-white mb-4">Sécurité</h2>

            {passwordSuccess && (
              <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-sm">
                {passwordSuccess}
              </div>
            )}

            {!showPasswordForm ? (
              <button
                onClick={() => setShowPasswordForm(true)}
                className="text-blue-400 hover:text-blue-300 font-medium text-sm transition-colors cursor-pointer"
              >
                Changer mon mot de passe
              </button>
            ) : (
              <form onSubmit={handlePasswordChange} className="space-y-4 mt-2">
                {displayPasswordError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-sm">
                    {displayPasswordError}
                  </div>
                )}
                <div>
                  <label className="block text-sm text-slate-400 mb-1">
                    Ancien mot de passe
                  </label>
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-white focus:border-blue-500 outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">
                    Nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-white focus:border-blue-500 outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">
                    Confirmer le nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-white focus:border-blue-500 outline-none transition-colors"
                  />
                </div>
                <div className="flex space-x-3 pt-2">
                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className="bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-bold px-5 py-2 rounded-xl transition-all cursor-pointer text-sm"
                  >
                    {passwordLoading
                      ? "Modification..."
                      : "Mettre à jour le mot de passe"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordForm(false);
                      setLocalError(null);
                    }}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium px-4 py-2 rounded-xl transition-all cursor-pointer text-sm"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}