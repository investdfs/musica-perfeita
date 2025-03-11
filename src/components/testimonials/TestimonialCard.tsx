
import { Quote, User } from "lucide-react";
import { Testimonial } from "./types";
import StarRating from "./StarRating";

interface TestimonialCardProps {
  testimonial: Testimonial;
}

const TestimonialCard = ({ testimonial }: TestimonialCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1">
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4 bg-gradient-to-r from-purple-400 to-pink-400">
            {testimonial.imageUrl ? (
              <img 
                src={testimonial.imageUrl} 
                alt={testimonial.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-full h-full p-2 text-white" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{testimonial.name}</h3>
            <div className="flex items-center">
              <StarRating rating={testimonial.rating} />
              <span className="ml-2 text-xs text-gray-500">{testimonial.date}</span>
            </div>
            {testimonial.relationship && (
              <span className="inline-block mt-1 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                {testimonial.relationship}
              </span>
            )}
          </div>
        </div>
        <div className="relative">
          <Quote className="absolute top-0 left-0 w-6 h-6 text-indigo-100 -translate-x-1 -translate-y-1" />
          <p className="text-gray-600 leading-relaxed pl-4 italic">
            "{testimonial.content}"
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
