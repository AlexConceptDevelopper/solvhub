type Props = {
  message: string;
  onRetry?: () => void;
};

export default function ErrorMessage({
  message,
  onRetry,
}: Props) {
  return (
    <div
      className="
        max-w-xl
        mx-auto
        bg-red-50
        border
        border-red-200
        rounded-2xl
        p-6
        text-center
      "
    >
      <p className="text-red-600 font-semibold">
        {message}
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="
            mt-4
            bg-red-500
            text-white
            px-4
            py-2
            rounded-xl
            hover:bg-red-600
          "
        >
          Réessayer
        </button>
      )}
    </div>
  );
}