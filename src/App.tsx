
import { useState, useEffect, lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { UserProfile } from "@/types/database.types";
import { Toaster } from "@/components/ui/toaster";
import ScrollToTopButton from "@/components/ui/scroll-to-top-button";
import AuthGuard from "@/components/auth/AuthGuard";
import Loading from "@/components/Loading";
import { isMobileDevice } from "@/hooks/use-mobile";

// Páginas carregadas diretamente
import Home from "./pages/Home";
import HomeMobile from "./pages/HomeMobile";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import NotFound from "./pages/NotFound";

// Páginas carregadas com lazy loading
const Dashboard = lazy(() => import("./pages/Dashboard"));
const DashboardMobile = lazy(() => import("./pages/DashboardMobile"));
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
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const Depoimentos = lazy(() => import("./pages/Depoimentos"));
const FAQ = lazy(() => import("./pages/FAQ"));
const ConfirmacaoPagamento = lazy(() => import("./pages/ConfirmacaoPagamento"));
const ProcessandoPagamento = lazy(() => import("./pages/ProcessandoPagamento"));

function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isMobile, setIsMobile] = useState<boolean>(isMobileDevice());

  useEffect(() => {
    const storedUser = localStorage.getItem("musicaperfeita_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
    
    // Atualiza o estado de dispositivo móvel quando a janela é redimensionada
    const handleResize = () => {
      setIsMobile(isMobileDevice());
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogin = (user: UserProfile) => {
    setUser(user);
    localStorage.setItem("musicaperfeita_user", JSON.stringify(user));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("musicaperfeita_user");
  };

  // Componente Home baseado no tipo de dispositivo
  const HomeComponent = isMobile ? HomeMobile : Home;
  
  return (
    <Router>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<HomeComponent />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/cadastro" element={<Cadastro onRegister={handleLogin} />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/contato" element={<Contato />} />
          <Route path="/nossas-musicas" element={<NossasMusicas />} />
          <Route path="/depoimentos" element={<Depoimentos />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/music-player" element={<MusicPlayer />} />
          <Route path="/music-player-full" element={<MusicPlayerFull />} />
          <Route path="/politica-privacidade" element={<PoliticaPrivacidade />} />
          <Route path="/termos-condicoes" element={<TermosCondicoes />} />
          <Route path="/recuperar-senha" element={<RecuperarSenha />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/confirmacao-g4bytw2tub6cfk76iigyja4q35w9d8sseqbi5hnxsh8r6ikzx8cd6kc8ijxbx2726wwt777t4vfm64zhn" element={<ConfirmacaoPagamento />} />
          <Route path="/processando-pagamento" element={<ProcessandoPagamento />} />
          
          {/* Rotas protegidas */}
          <Route path="/dashboard" element={
            <AuthGuard>
              {isMobile ? 
                <DashboardMobile userProfile={user!} onLogout={handleLogout} /> :
                <Dashboard userProfile={user!} onLogout={handleLogout} />
              }
            </AuthGuard>
          } />
          <Route path="/admin" element={
            <AuthGuard>
              <Admin userProfile={user!} onLogout={handleLogout} />
            </AuthGuard>
          } />
          <Route path="/pagamento" element={
            <AuthGuard>
              <Pagamento userProfile={user!} />
            </AuthGuard>
          } />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <ScrollToTopButton />
      <Toaster />
    </Router>
  );
}

export default App;
