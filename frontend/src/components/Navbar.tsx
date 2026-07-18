import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav
      className="
        sticky
        top-0
        z-50
        bg-white/80
        backdrop-blur
        border-b
        border-slate-200
        px-6
        md:px-10
        py-4
      "
    >
      <div
        className="
          max-w-6xl
          mx-auto
          flex
          items-center
          justify-between
        "
      >
        <button
          onClick={() => navigate("/")}
          className="
            text-2xl
            font-bold
            bg-linear-to-r
            from-blue-600
            to-indigo-600
            bg-clip-text
            text-transparent
            cursor-pointer
          "
        >
          SolvHub
        </button>

        <div
          className="
            flex
            items-center
            gap-6
          "
        >
          <button
            onClick={() => navigate("/")}
            className="
            text-slate-600
            hover:text-blue-600
            transition
            cursor-pointer
          "
          >
            Accueil
          </button>

          <button
            onClick={() => navigate("/problems")}
            className="
            text-slate-600
            hover:text-blue-600
            transition
            cursor-pointer
          "
          >
            Problèmes
          </button>

          <button
            onClick={() => navigate("/ranking")}
            className="
            text-slate-600
            hover:text-blue-600
            transition
            cursor-pointer
          "
          >
            Classement
          </button>

          <button
            onClick={() => navigate("/login")}
            className="
             bg-blue-600
            text-white
            px-4
            py-2
            rounded-xl
            hover:bg-blue-700
            transition
            cursor-pointer
              "
          >
            Connexion
          </button>
        </div>
      </div>
    </nav>
  );
}
