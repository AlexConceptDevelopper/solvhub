import { useState } from "react";
import { apiFetch } from "../api/client"; // 👈 Adapte le chemin vers ton fichier api.ts

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState({ loading: false, error: null as string | null, success: false });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ loading: true, error: null, success: false });

    try {
      // apiFetch ajoute automatiquement le domaine backend + "/contact" et le Header Content-Type
      await apiFetch("/contact", {
        method: "POST",
        body: JSON.stringify({ name, email, message }),
      });

      setStatus({ loading: false, error: null, success: true });
      setName("");
      setEmail("");
      setMessage("");
    } catch (err: any) {
      setStatus({ 
        loading: false, 
        error: err.message || "Impossible d'envoyer le message. Réessaie plus tard.", 
        success: false 
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative border border-slate-100">
        
        {/* Bouton fermer */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold cursor-pointer"
        >
          ✕
        </button>

        <h3 className="text-xl font-bold text-slate-900 mb-1">Contactez-nous</h3>
        <p className="text-xs text-slate-500 mb-4">Un problème, une question ? Laissez-nous un message.</p>

        {status.success ? (
          <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl text-sm text-center mb-4">
            ✅ Ton message a bien été envoyé ! On te répondra rapidement.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Votre Nom</label>
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-blue-600"
                placeholder="Jean Dupont"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Votre Email</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-blue-600"
                placeholder="jean@exemple.com"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Votre Message</label>
              <textarea 
                rows={4} 
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-blue-600 resize-none"
                placeholder="Comment pouvons-nous vous aider ?"
              />
            </div>

            {status.error && (
              <p className="text-xs text-rose-600">{status.error}</p>
            )}

            <button 
              type="submit" 
              disabled={status.loading}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-sm transition shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {status.loading ? "Envoi en cours..." : "Envoyer le message"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}