import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import useAsync from "../hooks/useAsync";
import { updateProfile, changePassword } from "../api/user.api";
import BackButton from "../components/BackButton";
import PrimaryButton from "../components/PrimaryButton";

export default function ProfilePage() {
  const { user, updateUser } = useAuth();

  const [username, setUsername] = useState("");
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(true);
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError, setProfileError] = useState<string | null>(null);

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

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
    <div className="min-h-screen p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Paramètres du profil
          </h1>
          <BackButton to="/" label="Retour à l'accueil" />
        </div>

        <div className="grid gap-8">
          {/* Section Informations */}
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

          {/* Section Sécurité */}
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
      </div>
    </div>
  );
}