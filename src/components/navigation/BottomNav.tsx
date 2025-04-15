
import React from "react";
import { Home, Vote, Wallet } from "lucide-react";
import { useTelegram } from "../../context/TelegramContext";
import { AppView } from "../../types/views";

interface BottomNavProps {
  currentView: AppView;
  onChangeView: (view: AppView) => void;
}

const BottomNav = ({ currentView, onChangeView }: BottomNavProps) => {
  const { hapticFeedback } = useTelegram();

  const handleViewChange = (view: AppView) => {
    hapticFeedback.selection();
    onChangeView(view);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 flex justify-around shadow-lg">
      <button
        onClick={() => handleViewChange(AppView.HOME)}
        className={`p-2 flex flex-col items-center ${
          currentView === AppView.HOME ? "text-indigo-600" : "text-gray-500"
        }`}
      >
        <Home className="h-5 w-5" />
        <span className="text-xs mt-1">Home</span>
      </button>
      
      <button
        onClick={() => handleViewChange(AppView.GOVERNANCE)}
        className={`p-2 flex flex-col items-center ${
          currentView === AppView.GOVERNANCE ? "text-indigo-600" : "text-gray-500"
        }`}
      >
        <Vote className="h-5 w-5" />
        <span className="text-xs mt-1">Vote</span>
      </button>
      
      <button
        onClick={() => handleViewChange(AppView.WALLET)}
        className={`p-2 flex flex-col items-center ${
          currentView === AppView.WALLET ? "text-indigo-600" : "text-gray-500"
        }`}
      >
        <Wallet className="h-5 w-5" />
        <span className="text-xs mt-1">Wallet</span>
      </button>
    </nav>
  );
};

export default BottomNav;
