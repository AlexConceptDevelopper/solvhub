import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";

// Importation des "portiers" de sécurité
import { PrivateRoute, AdminRoute } from "./components/ProtectedRoute";

// Pages
import HomePage from "./pages/HomePage";
import ProblemsPage from "./pages/ProblemsPage";
import ProblemDetailPage from "./pages/ProblemsDetailPage";
import CreateProblemPage from "./pages/CreateProblemPage";
import SolutionDetailPage from "./pages/SolutionDetailPage";
import CreateSolutionPage from "./pages/CreateSolutionPage";
import CategoryProblemsPage from "./pages/CategoryProblemsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import VerifyPage from "./pages/VerifyPage";
import ProfilePage from "./pages/ProfilePage";
import AdminDashboard from "./pages/AdminDashboard";
import CategoriesPage from "./pages/CategoriesPage";
import RankingHubPage from "./pages/RankingHubPage";
import RankingSolutionsPage from "./pages/RankingSolutionsPage";
import RankingContributorPage from "./pages/RankingContributorPage";
import UserProfilePage from "./pages/UserProfilePage";
import RankingProblemPage from "./pages/RankingProblemPage";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="min-h-screen bg-linear-to-br from-slate-100 via-blue-50 to-indigo-100 px-4 md:px-8 py-8">
        <Routes>
          {/* Routes Publiques */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify" element={<VerifyPage />} />
          <Route path="/problems" element={<ProblemsPage />} />
          <Route path="/problem/:id" element={<ProblemDetailPage />} />
          <Route path="/solution/:id" element={<SolutionDetailPage />} />
          <Route path="/categories/:idCategory" element={<CategoryProblemsPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/ranking" element={<RankingHubPage />} />
          <Route path="/ranking/solutions" element={<RankingSolutionsPage />} />
          <Route path="/ranking/contributors" element={<RankingContributorPage />} />
          <Route path="/user/:id" element={<UserProfilePage />} />
          <Route path="/ranking/problems" element={<RankingProblemPage />} />

          {/* Routes Authentifiées (nécessitent d'être connecté) */}
          <Route path="/profile" element={
            <PrivateRoute><ProfilePage /></PrivateRoute>
          } />
          <Route path="/problem/create" element={
            <PrivateRoute><CreateProblemPage /></PrivateRoute>
          } />
          <Route path="/problem/:problemId/create-solution" element={
            <PrivateRoute><CreateSolutionPage /></PrivateRoute>
          } />

          {/* Routes Admin (nécessitent d'être admin) */}
          <Route path="/admin" element={
            <AdminRoute><AdminDashboard /></AdminRoute>
          } />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;