
import Header from "@/components/Header";
import WelcomeSection from "@/components/home/WelcomeSection";
import PossibilitiesSection from "@/components/home/PossibilitiesSection";
import DifferentialsSection from "@/components/home/DifferentialsSection";
import CallToAction from "@/components/home/CallToAction";
import Footer from "@/components/Footer";

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
      <Footer />
    </div>
  );
};

export default Home;
