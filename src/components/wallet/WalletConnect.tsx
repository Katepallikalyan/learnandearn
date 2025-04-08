
import React from "react";
import { Wallet } from "lucide-react";
import { useWeb3 } from "../../context/Web3Context";
import { useTelegram } from "../../context/TelegramContext";

const WalletConnect: React.FC = () => {
  const { connectWallet } = useWeb3();
  const { hapticFeedback, showMainButton, hideMainButton } = useTelegram();

  const handleConnect = async () => {
    hapticFeedback.selection();
    showMainButton("Connecting...", () => {});
    
    try {
      const success = await connectWallet();
      if (success) {
        hapticFeedback.success();
      } else {
        hapticFeedback.error();
      }
    } finally {
      hideMainButton();
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
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Connect Wallet
        </button>
      </div>
    </div>
  );
};

export default WalletConnect;
