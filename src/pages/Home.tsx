
import Header from "@/components/Header";
import WelcomeSection from "@/components/home/WelcomeSection";
import PossibilitiesSection from "@/components/home/PossibilitiesSection";
import DifferentialsSection from "@/components/home/DifferentialsSection";
import CallToAction from "@/components/home/CallToAction";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <WelcomeSection />
        <PossibilitiesSection />
        <DifferentialsSection />
        <CallToAction />
      </main>
      <footer className="bg-gray-800 text-white py-8 text-center">
        <div className="max-w-5xl mx-auto px-6">
          <p>&copy; {new Date().getFullYear()} Musicaperfeita. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
