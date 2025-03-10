
import Header from "@/components/Header";
import WelcomeSection from "@/components/home/WelcomeSection";
import StepByStepSection from "@/components/home/StepByStepSection";
import PossibilitiesSection from "@/components/home/PossibilitiesSection";
import DifferentialsSection from "@/components/home/DifferentialsSection";
import PriceComparisonSection from "@/components/home/PriceComparisonSection";
import CallToAction from "@/components/home/CallToAction";
import Footer from "@/components/Footer";
import { useEffect } from "react";
import supabase from "@/lib/supabase";

const Home = () => {
  useEffect(() => {
    // Lógica para registrar visitante único
    const recordVisit = async () => {
      try {
        // Verifica se o cliente já foi contabilizado usando localStorage
        const visitorId = localStorage.getItem('mp_visitor_id');
        
        if (!visitorId) {
          // Gera um ID único para o visitante
          const newVisitorId = crypto.randomUUID();
          localStorage.setItem('mp_visitor_id', newVisitorId);
          
          // Incrementa o contador na tabela site_stats
          const { error } = await supabase.rpc('increment_visitor_count');
          
          if (error) {
            console.error('Erro ao registrar visitante:', error);
          }
        }
      } catch (error) {
        console.error('Erro ao processar registro de visitante:', error);
      }
    };
    
    recordVisit();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <WelcomeSection />
        <StepByStepSection />
        <DifferentialsSection />
        <PriceComparisonSection />
        <PossibilitiesSection />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
