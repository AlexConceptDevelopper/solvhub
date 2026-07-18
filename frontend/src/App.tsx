import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import HomePage from "./pages/HomePage";
import ProblemsPage from "./pages/ProblemsPage";
import ProblemDetailPage from "./pages/ProblemsDetailPage";
import CreateProblemPage from "./pages/CreateProblemPage";
import SolutionDetailPage from "./pages/SolutionDetailPage";
import CreateSolutionPage from "./pages/CreateSolutionPage";
import CategoryProblemsPage from "./pages/CategoryProblemsPage";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <main
        className="
          min-h-screen
          bg-linear-to-br
          from-slate-100
          via-blue-50
          to-indigo-100
          px-4
          md:px-8
          py-8
        "
      >
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route path="/problems" element={<ProblemsPage />} />
          <Route path="/problem/create" element={<CreateProblemPage />} />
          <Route path="/problem/:id" element={<ProblemDetailPage />} />
          <Route path="/solution/:id" element={<SolutionDetailPage />} />
          <Route path="/problem/:problemId/create-solution" element={<CreateSolutionPage />} />
          <Route path="/categories/:idCategory" element={<CategoryProblemsPage />} />
          
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
