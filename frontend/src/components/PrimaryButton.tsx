// components/PrimaryButton.tsx
import type { ButtonHTMLAttributes } from "react";

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingLabel?: string;
}

export default function PrimaryButton({
  loading = false,
  loadingLabel = "Chargement...",
  disabled,
  children,
  className = "",
  ...rest
}: PrimaryButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={`
        bg-blue-600
        hover:bg-blue-700
        text-white
        font-bold
        rounded-xl
        px-6
        py-3
        text-sm
        shadow-lg
        shadow-blue-600/20
        hover:shadow-blue-600/30
        hover:-translate-y-0.5
        transition-all
        duration-200
        cursor-pointer
        disabled:opacity-50
        disabled:cursor-not-allowed
        disabled:hover:translate-y-0
        ${className}
      `}
      {...rest}
    >
      {loading ? loadingLabel : children}
    </button>
  );
}