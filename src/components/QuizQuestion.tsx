
import React, { useState, useEffect } from "react";
import { CheckCircle2, Circle } from "lucide-react";

interface QuizQuestionProps {
  question: string;
  options: string[];
  selectedOption: number | null;
  onSelectOption: (index: number) => void;
  questionNumber: number;
  totalQuestions: number;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  options,
  selectedOption,
  onSelectOption,
  questionNumber,
  totalQuestions,
}) => {
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    // Trigger animation when component mounts or question changes
    setAnimateIn(false);
    const timer = setTimeout(() => setAnimateIn(true), 50);
    return () => clearTimeout(timer);
  }, [question]);

  return (
    <div
      className={`transform transition-all duration-300 ${
        animateIn
          ? "translate-x-0 opacity-100"
          : "translate-x-8 opacity-0"
      }`}
    >
      <div className="mb-4 flex justify-between items-center">
        <div className="text-sm font-medium text-gray-500">
          Question {questionNumber} of {totalQuestions}
        </div>
        <div className="w-16 h-1 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-600"
            style={{
              width: `${(questionNumber / totalQuestions) * 100}%`,
            }}
          ></div>
        </div>
      </div>

      <h3 className="text-xl font-semibold mb-6">{question}</h3>

      <div className="space-y-3">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => onSelectOption(index)}
            className={`w-full text-left p-4 rounded-lg border transition-all flex items-start ${
              selectedOption === index
                ? "border-indigo-300 bg-indigo-50"
                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            <div className="mr-3 mt-0.5">
              {selectedOption === index ? (
                <CheckCircle2 className="h-5 w-5 text-indigo-600" />
              ) : (
                <Circle className="h-5 w-5 text-gray-400" />
              )}
            </div>
            <span>{option}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuizQuestion;
