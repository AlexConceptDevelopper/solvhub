export default function Logo() {
  return (
    <div className="flex items-center">
      <svg width="32" height="40" viewBox="0 0 40 50" fill="none">
        <path
          d="M20 3a13 13 0 00-7 24c1.8 1.4 3 3.4 3 5.5V34h8v-1.5c0-2.1 1.2-4.1 3-5.5A13 13 0 0020 3z"
          stroke="#2563eb"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d="M15 11h3a1.8 1.8 0 013.6 0h3v10h-3a1.8 1.8 0 01-3.6 0h-3z"
          stroke="#2563eb"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
        <line x1="15" y1="37" x2="25" y2="37" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="15.5" y1="40" x2="24.5" y2="40" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" />
        <rect x="16" y="43" width="8" height="3.5" rx="1" fill="#2563eb" />
      </svg>

      <div className="flex flex-col">
        <span className="text-2xl font-black tracking-tight">
          <span className="text-slate-900">Solv</span>
          <span className="bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Hub
          </span>
        </span>

        <span className="text-xs italic text-slate-500 -mt-1">
          L'entraide qui répare tout.
        </span>
      </div>
    </div>
  );
}