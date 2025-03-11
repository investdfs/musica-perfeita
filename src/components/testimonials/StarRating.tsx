
import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  size?: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

const StarRating = ({ 
  rating, 
  size = 16, 
  interactive = false, 
  onChange 
}: StarRatingProps) => {
  return (
    <div className="flex space-x-1">
      {[...Array(5)].map((_, i) => (
        <button
          key={i}
          type={interactive ? "button" : undefined}
          onClick={interactive && onChange ? () => onChange(i + 1) : undefined}
          className={interactive ? "focus:outline-none" : undefined}
          disabled={!interactive}
        >
          <Star 
            size={size} 
            className={`${
              i < rating 
                ? "fill-yellow-400 text-yellow-400" 
                : "text-gray-300"
            } ${
              interactive 
                ? "hover:fill-yellow-300 hover:text-yellow-300 transition-colors" 
                : ""
            }`} 
          />
        </button>
      ))}
    </div>
  );
};

export default StarRating;
