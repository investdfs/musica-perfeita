
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TestimonialCard from "@/components/testimonials/TestimonialCard";
import TestimonialForm from "@/components/testimonials/TestimonialForm";
import { testimonials } from "@/components/testimonials/mockData";
import { useTestimonials } from "@/components/testimonials/useTestimonials";

const Depoimentos = () => {
  const { userProfile, hasCompletedMusic } = useTestimonials();

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-50 via-purple-50 to-white">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Depoimentos dos Nossos Clientes
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Descubra como nossas músicas personalizadas têm emocionado pessoas e criado momentos inesquecíveis.
          </p>
        </div>
        
        <div className="max-w-2xl mx-auto mb-16 bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-purple-700 mb-2">
              Compartilhe Sua Experiência
            </h2>
            <p className="text-gray-600">
              Como foi receber ou presentear alguém com uma música personalizada?
            </p>
          </div>
          
          <TestimonialForm 
            userProfile={userProfile} 
            hasCompletedMusic={hasCompletedMusic} 
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Depoimentos;
