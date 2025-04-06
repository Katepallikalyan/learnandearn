
import React from "react";
import { Trophy, Clock, Award } from "lucide-react";

interface QuizCardProps {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  questionsCount: number;
  difficulty: string;
  rewardAmount: number;
  onClick: () => void;
}

const QuizCard: React.FC<QuizCardProps> = ({
  id,
  title,
  description,
  imageUrl,
  questionsCount,
  difficulty,
  rewardAmount,
  onClick,
}) => {
  // Determine background color based on difficulty
  const getBgColor = () => {
    switch (difficulty) {
      case "Beginner":
        return "bg-emerald-50 border-emerald-200";
      case "Intermediate":
        return "bg-blue-50 border-blue-200";
      case "Advanced":
        return "bg-purple-50 border-purple-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getDifficultyColor = () => {
    switch (difficulty) {
      case "Beginner":
        return "text-emerald-600 bg-emerald-100";
      case "Intermediate":
        return "text-blue-600 bg-blue-100";
      case "Advanced":
        return "text-purple-600 bg-purple-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div
      className={`rounded-xl shadow-sm border overflow-hidden ${getBgColor()} transition-transform transform hover:scale-[1.02] active:scale-[0.98]`}
      onClick={onClick}
    >
      <div className="aspect-video w-full overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1">{title}</h3>
        <p className="text-sm text-gray-600 mb-3">{description}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${getDifficultyColor()}`}>
              {difficulty}
            </span>
            <span className="text-xs flex items-center text-gray-500">
              <Clock className="h-3 w-3 mr-1" />
              {questionsCount} Q
            </span>
          </div>
          
          <div className="flex items-center text-amber-600 font-medium">
            <Trophy className="h-4 w-4 mr-1" />
            <span>{rewardAmount} LEARN</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizCard;
