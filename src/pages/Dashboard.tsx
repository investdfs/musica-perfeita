
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DashboardContent from "@/components/dashboard/DashboardContent";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-50 via-indigo-50 to-white animate-gradient-background">
      <div className="animated-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>
      <Header />
      <main className="py-12 px-6 relative z-10">
        <DashboardContent />
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
