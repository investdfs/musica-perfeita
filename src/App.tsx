
import { useState, useEffect, lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { UserProfile } from "@/types/database.types";
import { Toaster } from "@/components/ui/toaster";
import ScrollToTopButton from "@/components/ui/scroll-to-top-button";
import { Loader2 } from "lucide-react";

// Componente de Loading
const Loading = () => (
  <div className="flex items-center justify-center h-screen w-full">
    <Loader2 className="h-12 w-12 text-purple-600 animate-spin" />
    <span className="ml-2 text-lg text-gray-700">Carregando...</span>
  </div>
);

// Páginas carregadas diretamente
import Home from "./pages/Home";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import NotFound from "./pages/NotFound";

// Páginas carregadas com lazy loading
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Admin = lazy(() => import("./pages/Admin"));
const Pagamento = lazy(() => import("./pages/Pagamento"));
const Sobre = lazy(() => import("./pages/Sobre"));
const Contato = lazy(() => import("./pages/Contato"));
const NossasMusicas = lazy(() => import("./pages/NossasMusicas"));
const MusicPlayer = lazy(() => import("./pages/MusicPlayer"));
const MusicPlayerFull = lazy(() => import("./pages/MusicPlayerFull"));
const PoliticaPrivacidade = lazy(() => import("./pages/PoliticaPrivacidade"));
const TermosCondicoes = lazy(() => import("./pages/TermosCondicoes"));
const RecuperarSenha = lazy(() => import("./pages/RecuperarSenha"));

function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (user: UserProfile) => {
    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/cadastro" element={<Cadastro onRegister={handleLogin} />} />
          <Route path="/dashboard" element={
            user ? <Dashboard userProfile={user} onLogout={handleLogout} /> : <Navigate to="/login" />
          } />
          <Route path="/admin" element={
            user?.is_admin ? <Admin userProfile={user} onLogout={handleLogout} /> : <Navigate to="/login" />
          } />
          <Route path="/pagamento" element={<Pagamento userProfile={user} />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/contato" element={<Contato />} />
          <Route path="/nossas-musicas" element={<NossasMusicas />} />
          <Route path="/music-player" element={<MusicPlayer />} />
          <Route path="/music-player-full" element={<MusicPlayerFull />} />
          <Route path="/privacidade" element={<PoliticaPrivacidade />} />
          <Route path="/termos" element={<TermosCondicoes />} />
          <Route path="/recuperar-senha" element={<RecuperarSenha />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <ScrollToTopButton />
      <Toaster />
    </Router>
  );
}

export default App;
