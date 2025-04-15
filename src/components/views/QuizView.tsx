
import React from "react";
import QuizQuestion from "../QuizQuestion";
import { Award, Check, X } from "lucide-react";
import { useQuiz } from "../../hooks/useQuiz";

interface QuizViewProps {
  quizId: number;
  quizTitle: string;
  onBackToHome: () => void;
}

const QuizView = ({ quizId, quizTitle, onBackToHome }: QuizViewProps) => {
  const quiz = useQuiz(quizId);

  return (
    <div className="px-4 py-6">
      <h2 className="text-xl font-bold mb-6">{quizTitle}</h2>
      
      {quiz.quizResult ? (
        <div className="text-center py-6">
          <div className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${
            quiz.quizResult.percentageCorrect >= 60
              ? "bg-green-100 text-green-600"
              : "bg-red-100 text-red-600"
          }`}>
            {quiz.quizResult.percentageCorrect >= 60 ? (
              <Check className="h-10 w-10" />
            ) : (
              <X className="h-10 w-10" />
            )}
          </div>
          
          <h2 className="text-xl font-bold mb-2">Quiz Completed!</h2>
          <p className="text-gray-600 mb-6">
            You got {quiz.quizResult.correctCount} out of {quiz.quizResult.totalQuestions} questions correct ({Math.round(quiz.quizResult.percentageCorrect)}%)
          </p>
          
          {quiz.quizResult.earnedReward > 0 ? (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <Award className="h-6 w-6 text-amber-600 mx-auto mb-2" />
              <p className="font-medium text-amber-700">
                Congratulations! You earned {quiz.quizResult.earnedReward} LEARN tokens!
              </p>
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
              <p className="text-gray-600">
                You need to score at least 60% to earn rewards. Try again!
              </p>
            </div>
          )}
          
          <div className="flex space-x-3">
            <button
              onClick={quiz.resetQuiz}
              className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={onBackToHome}
              className="flex-1 bg-white border border-gray-300 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      ) : (
        <>
          {quiz.loading ? (
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p>Loading questions...</p>
            </div>
          ) : quiz.error ? (
            <div className="text-center text-red-600 py-10">
              <p>{quiz.error}</p>
              <button
                onClick={onBackToHome}
                className="mt-4 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Back to Home
              </button>
            </div>
          ) : quiz.currentQuestion ? (
            <>
              <QuizQuestion
                question={quiz.currentQuestion.question}
                options={quiz.currentQuestion.options}
                selectedOption={quiz.selectedOption}
                onSelectOption={quiz.answerQuestion}
                questionNumber={quiz.currentQuestionIndex + 1}
                totalQuestions={quiz.questions.length}
              />
              
              <div className="mt-8">
                <button
                  onClick={quiz.goToNextQuestion}
                  disabled={quiz.submitting}
                  className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-70"
                >
                  {quiz.submitting ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </span>
                  ) : quiz.isLastQuestion ? (
                    "Submit Answers"
                  ) : (
                    "Next Question"
                  )}
                </button>
              </div>
            </>
          ) : null}
        </>
      )}
    </div>
  );
};

export default QuizView;
