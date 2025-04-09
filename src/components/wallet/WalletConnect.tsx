
import React, { useEffect } from "react";
import { Wallet } from "lucide-react";
import { useWeb3 } from "../../context/Web3Context";
import { useTelegram } from "../../context/TelegramContext";

const WalletConnect: React.FC = () => {
  const { connectWallet, isConnected } = useWeb3();
  const { hapticFeedback, showAlert } = useTelegram();

  // Auto-connect wallet on component mount
  useEffect(() => {
    const autoConnect = async () => {
      try {
        const success = await connectWallet();
        if (success) {
          hapticFeedback.success();
          showAlert("Wallet connected automatically!");
        }
      } catch (error) {
        console.error("Auto-connect error:", error);
      }
    };

    if (!isConnected) {
      autoConnect();
    }
  }, [connectWallet, hapticFeedback, showAlert, isConnected]);

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
      <div className="text-center">
        <Wallet className="h-10 w-10 mx-auto text-gray-400 mb-3" />
        <h3 className="text-lg font-semibold mb-2">Connecting Wallet</h3>
        <p className="text-sm text-gray-500 mb-4">
          Your wallet is being connected automatically...
        </p>
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    </div>
  );
};

export default WalletConnect;
