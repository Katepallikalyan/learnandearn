
import React from "react";
import QuizCard from "../QuizCard";
import { BookOpen } from "lucide-react";

interface HomeViewProps {
  loading: boolean;
  quizTopics: any[];
  onSelectQuiz: (id: number, title: string) => void;
}

const HomeView = ({ loading, quizTopics, onSelectQuiz }: HomeViewProps) => {
  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold mb-2">Learn & Earn</h1>
      <p className="text-gray-600 mb-6">Take quizzes, learn about Web3, and earn tokens!</p>
      
      <div className="grid grid-cols-1 gap-5 mb-8">
        {loading ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p>Loading quizzes...</p>
          </div>
        ) : (
          quizTopics.map((topic) => (
            <QuizCard
              key={topic.id}
              {...topic}
              onClick={() => onSelectQuiz(topic.id, topic.title)}
            />
          ))
        )}
      </div>
      
      <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl p-5 mb-6">
        <h2 className="text-lg font-bold mb-2">Welcome to Learn & Earn!</h2>
        <p className="text-gray-700 mb-3">Complete quizzes to earn LEARN tokens and participate in governance.</p>
        <div className="flex items-center text-indigo-600 font-medium">
          <BookOpen className="h-4 w-4 mr-2" />
          <span>Start learning today</span>
        </div>
      </div>
    </div>
  );
};

export default HomeView;
