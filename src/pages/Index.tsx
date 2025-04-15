
import React, { useState, useEffect } from "react";
import { TelegramProvider, useTelegram } from "../context/TelegramContext";
import { Web3Provider } from "../context/Web3Context";
import Header from "../components/Header";
import BottomNav from "../components/navigation/BottomNav";
import HomeView from "../components/views/HomeView";
import QuizView from "../components/views/QuizView";
import GovernanceVote from "../components/GovernanceVote";
import WalletPanel from "../components/WalletPanel";
import { AppView } from "../types/views";
import { getQuizTopics, getGovernanceProposals } from "../services/api";

// Create a content component to use the useTelegram hook
const AppContent = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);
  const [quizTopics, setQuizTopics] = useState<any[]>([]);
  const [selectedQuizId, setSelectedQuizId] = useState<number | null>(null);
  const [quizTitle, setQuizTitle] = useState<string>("");
  const [proposals, setProposals] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { showBackButton, hideBackButton, hapticFeedback } = useTelegram();

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
      showBackButton(() => handleBackToHome());
    } else {
      hideBackButton();
    }
    
    return () => {
      hideBackButton();
    };
  }, [currentView, showBackButton, hideBackButton]);

  const handleSelectQuiz = (id: number, title: string) => {
    hapticFeedback.selection();
    setSelectedQuizId(id);
    setQuizTitle(title);
    setCurrentView(AppView.QUIZ);
  };

  const handleBackToHome = () => {
    hapticFeedback.selection();
    setCurrentView(AppView.HOME);
    setSelectedQuizId(null);
  };

  const renderView = () => {
    switch (currentView) {
      case AppView.HOME:
        return (
          <HomeView
            loading={loading}
            quizTopics={quizTopics}
            onSelectQuiz={handleSelectQuiz}
          />
        );
      case AppView.QUIZ:
        return (
          <QuizView
            quizId={selectedQuizId || 0}
            quizTitle={quizTitle}
            onBackToHome={handleBackToHome}
          />
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
            ) : (
              <div className="space-y-4">
                {proposals.map((proposal) => (
                  <GovernanceVote key={proposal.id} proposal={proposal} />
                ))}
              </div>
            )}
          </div>
        );
      case AppView.WALLET:
        return <WalletPanel />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <Header title={currentView === AppView.QUIZ ? quizTitle : undefined} />
      {renderView()}
      <BottomNav currentView={currentView} onChangeView={setCurrentView} />
    </div>
  );
};

// Wrapper component that provides context
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
