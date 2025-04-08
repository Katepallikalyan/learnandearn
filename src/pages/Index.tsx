
import React, { useState, useEffect } from "react";
import { TelegramProvider, useTelegram } from "../context/TelegramContext";
import { Web3Provider } from "../context/Web3Context";
import Header from "../components/Header";
import QuizCard from "../components/QuizCard";
import WalletPanel from "../components/WalletPanel";
import QuizQuestion from "../components/QuizQuestion";
import GovernanceVote from "../components/GovernanceVote";
import { useQuiz } from "../hooks/useQuiz";
import { getQuizTopics, getGovernanceProposals } from "../services/api";
import { Award, Check, X, Home, Wallet, Vote, BookOpen } from "lucide-react";

// Create enum for app views
enum AppView {
  HOME = "home",
  QUIZ = "quiz",
  GOVERNANCE = "governance",
  WALLET = "wallet",
}

// Create a content component to use the useTelegram hook
const AppContent = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);
  const [quizTopics, setQuizTopics] = useState<any[]>([]);
  const [selectedQuizId, setSelectedQuizId] = useState<number | null>(null);
  const [quizTitle, setQuizTitle] = useState<string>("");
  const [proposals, setProposals] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { tg, showBackButton, hideBackButton, hapticFeedback } = useTelegram();

  // Get quiz state from custom hook when a quiz is selected
  const quiz = useQuiz(selectedQuizId || 0);

  // Fetch quiz topics on initial load
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const topics = await getQuizTopics();
        setQuizTopics(topics);
        
        const governanceData = await getGovernanceProposals();
        setProposals(governanceData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle back button functionality for Telegram
  useEffect(() => {
    if (currentView !== AppView.HOME) {
      showBackButton(() => {
        handleBackToHome();
      });
    } else {
      hideBackButton();
    }
    
    return () => {
      hideBackButton();
    };
  }, [currentView]);

  // Select a quiz to start
  const handleSelectQuiz = (id: number, title: string) => {
    hapticFeedback.selection();
    setSelectedQuizId(id);
    setQuizTitle(title);
    setCurrentView(AppView.QUIZ);
  };

  // Return to home screen
  const handleBackToHome = () => {
    hapticFeedback.selection();
    // Reset quiz state if we're coming from quiz
    if (currentView === AppView.QUIZ && quiz.quizResult) {
      quiz.resetQuiz();
    }
    setCurrentView(AppView.HOME);
    setSelectedQuizId(null);
  };

  // Render different views based on current state
  const renderView = () => {
    switch (currentView) {
      case AppView.HOME:
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
                    onClick={() => handleSelectQuiz(topic.id, topic.title)}
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

      case AppView.QUIZ:
        return (
          <div className="px-4 py-6">
            {quiz.quizResult ? (
              // Quiz result screen
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
                    onClick={handleBackToHome}
                    className="flex-1 bg-white border border-gray-300 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Back to Home
                  </button>
                </div>
              </div>
            ) : (
              // Quiz question screen
              <div>
                <h2 className="text-xl font-bold mb-6">{quizTitle}</h2>
                
                {quiz.loading ? (
                  <div className="text-center py-10">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p>Loading questions...</p>
                  </div>
                ) : quiz.error ? (
                  <div className="text-center text-red-600 py-10">
                    <p>{quiz.error}</p>
                    <button
                      onClick={handleBackToHome}
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
              </div>
            )}
          </div>
        );

      case AppView.GOVERNANCE:
        return (
          <div className="px-4 py-6">
            <h1 className="text-2xl font-bold mb-2">Governance</h1>
            <p className="text-gray-600 mb-6">Vote on proposals using your LEARN tokens</p>
            
            {loading ? (
              <div className="text-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                <p>Loading proposals...</p>
              </div>
            ) : proposals.length > 0 ? (
              <div className="space-y-4">
                {proposals.map((proposal) => (
                  <GovernanceVote
                    key={proposal.id}
                    proposal={proposal}
                    onVoteSuccess={() => {
                      // In a real app, we would refresh the proposal list
                      // For this demo, we'll just mark as voted
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-gray-500">
                <Vote className="h-10 w-10 mx-auto mb-3 opacity-50" />
                <p>No active proposals at the moment</p>
              </div>
            )}
          </div>
        );

      case AppView.WALLET:
        return (
          <div className="px-4 py-6">
            <h1 className="text-2xl font-bold mb-2">Your Wallet</h1>
            <p className="text-gray-600 mb-6">Manage your LEARN tokens</p>
            
            <WalletPanel />
            
            <div className="mt-8 space-y-4">
              <h2 className="text-lg font-semibold">Recent Activity</h2>
              <div className="border border-gray-100 rounded-lg bg-white divide-y">
                <div className="p-4 flex items-start">
                  <div className="bg-green-100 p-2 rounded mr-3">
                    <Award className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium">Quiz Reward</div>
                    <div className="text-sm text-gray-500">Blockchain Basics</div>
                    <div className="mt-1 text-xs text-gray-400">Apr 5, 2025</div>
                  </div>
                  <div className="ml-auto text-green-600 font-medium">+10 LEARN</div>
                </div>
                
                <div className="p-4 flex items-start">
                  <div className="bg-indigo-100 p-2 rounded mr-3">
                    <Vote className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <div className="font-medium">Governance Vote</div>
                    <div className="text-sm text-gray-500">Voted on DAO proposal</div>
                    <div className="mt-1 text-xs text-gray-400">Apr 4, 2025</div>
                  </div>
                  <div className="ml-auto text-gray-500 font-medium">0 LEARN</div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <Header title={currentView === AppView.QUIZ ? quizTitle : undefined} />
      
      {renderView()}
      
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 flex justify-around shadow-lg">
        <button
          onClick={() => {
            hapticFeedback.selection();
            setCurrentView(AppView.HOME);
          }}
          className={`p-2 flex flex-col items-center ${
            currentView === AppView.HOME ? "text-indigo-600" : "text-gray-500"
          }`}
        >
          <Home className="h-5 w-5" />
          <span className="text-xs mt-1">Home</span>
        </button>
        
        <button
          onClick={() => {
            hapticFeedback.selection();
            setCurrentView(AppView.GOVERNANCE);
          }}
          className={`p-2 flex flex-col items-center ${
            currentView === AppView.GOVERNANCE ? "text-indigo-600" : "text-gray-500"
          }`}
        >
          <Vote className="h-5 w-5" />
          <span className="text-xs mt-1">Vote</span>
        </button>
        
        <button
          onClick={() => {
            hapticFeedback.selection();
            setCurrentView(AppView.WALLET);
          }}
          className={`p-2 flex flex-col items-center ${
            currentView === AppView.WALLET ? "text-indigo-600" : "text-gray-500"
          }`}
        >
          <Wallet className="h-5 w-5" />
          <span className="text-xs mt-1">Wallet</span>
        </button>
      </nav>
    </div>
  );
};

// Main component that provides context
const Index = () => {
  return (
    <TelegramProvider>
      <Web3Provider>
        <AppContent />
      </Web3Provider>
    </TelegramProvider>
  );
};

export default Index;
