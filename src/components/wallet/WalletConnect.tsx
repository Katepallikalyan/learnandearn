
import React, { useState } from "react";
import { Wallet } from "lucide-react";
import { useWeb3 } from "../../context/Web3Context";
import { useTelegram } from "../../context/TelegramContext";

const WalletConnect: React.FC = () => {
  const { connectWallet } = useWeb3();
  const { hapticFeedback, showMainButton, hideMainButton, isInsideTelegram, showAlert } = useTelegram();
  const [connecting, setConnecting] = useState(false);

  const handleConnect = async () => {
    hapticFeedback.selection();
    setConnecting(true);
    
    if (isInsideTelegram) {
      showMainButton("Connecting...", () => {});
    }
    
    try {
      // For Telegram mini apps, we need a special approach to connect wallets
      const success = await connectWallet();
      
      if (success) {
        hapticFeedback.success();
        showAlert("Wallet connected successfully!");
      } else {
        hapticFeedback.error();
        showAlert("Failed to connect wallet. Please try again.");
      }
    } catch (error) {
      console.error("Wallet connection error:", error);
      showAlert("Error connecting wallet. Please try again later.");
      hapticFeedback.error();
    } finally {
      setConnecting(false);
      if (isInsideTelegram) {
        hideMainButton();
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
      <div className="text-center">
        <Wallet className="h-10 w-10 mx-auto text-gray-400 mb-3" />
        <h3 className="text-lg font-semibold mb-2">Wallet Not Connected</h3>
        <p className="text-sm text-gray-500 mb-4">
          Connect your wallet to view your balance and earning history
        </p>
        <button
          onClick={handleConnect}
          disabled={connecting}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-70"
        >
          {connecting ? (
            <span className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Connecting...
            </span>
          ) : (
            "Connect Wallet"
          )}
        </button>
      </div>
    </div>
  );
};

export default WalletConnect;
