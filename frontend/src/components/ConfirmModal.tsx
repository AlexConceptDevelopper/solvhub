interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "primary"; // Nouveau pour gérer la couleur du bouton
  onConfirm: () => void;
  onClose: () => void;
}

export default function ConfirmModal({
  isOpen,
  title = "Confirmation",
  message,
  confirmText = "Confirmer",
  cancelText = "Annuler",
  variant = "danger", // Par défaut rouge (danger)
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  // Style dynamique du bouton selon le variant
  const confirmButtonClass =
    variant === "danger"
      ? "bg-red-600 hover:bg-red-500 border-red-500"
      : "bg-blue-600 hover:bg-blue-500 border-blue-500";

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-800 p-6 rounded-xl shadow-2xl border border-slate-600 max-w-md w-full mx-4">
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-slate-300 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 font-medium text-slate-300 hover:text-white bg-transparent hover:bg-slate-700 rounded transition-all cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 font-bold text-white border rounded shadow-lg transition-all cursor-pointer ${confirmButtonClass}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}