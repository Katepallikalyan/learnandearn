
import React, { useState, useEffect } from "react";
import { Wallet, CheckCircle, AlertCircle } from "lucide-react";
import { useWeb3 } from "../../context/Web3Context";
import { useTelegram } from "../../context/TelegramContext";
import { Button } from "@/components/ui/button";

const WalletConnect: React.FC = () => {
  const { connectWallet, isConnected } = useWeb3();
  const { hapticFeedback, showAlert } = useTelegram();
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "success" | "failed">("connecting");
  const [isRetrying, setIsRetrying] = useState(false);

  // Auto-connect wallet on component mount
  useEffect(() => {
    const autoConnect = async () => {
      try {
        setConnectionStatus("connecting");
        const success = await connectWallet();
        if (success) {
          hapticFeedback.success();
          showAlert("Wallet connected automatically!");
          setConnectionStatus("success");
        } else {
          setConnectionStatus("failed");
        }
      } catch (error) {
        console.error("Auto-connect error:", error);
        setConnectionStatus("failed");
      }
    };

    if (!isConnected) {
      autoConnect();
    } else {
      setConnectionStatus("success");
    }
  }, [connectWallet, hapticFeedback, showAlert, isConnected]);

  const handleRetryConnection = async () => {
    setIsRetrying(true);
    try {
      const success = await connectWallet();
      if (success) {
        hapticFeedback.success();
        showAlert("Wallet connected successfully!");
        setConnectionStatus("success");
      } else {
        setConnectionStatus("failed");
      }
    } catch (error) {
      console.error("Retry connection error:", error);
      setConnectionStatus("failed");
    } finally {
      setIsRetrying(false);
    }
  };

  if (connectionStatus === "success") {
    return (
      <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
        <div className="text-center">
          <CheckCircle className="h-10 w-10 mx-auto text-green-500 mb-3" />
          <h3 className="text-lg font-semibold mb-2">Wallet Connected</h3>
          <p className="text-sm text-gray-500 mb-2">
            Your wallet has been connected successfully.
          </p>
        </div>
      </div>
    );
  }

  if (connectionStatus === "failed") {
    return (
      <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
        <div className="text-center">
          <AlertCircle className="h-10 w-10 mx-auto text-red-500 mb-3" />
          <h3 className="text-lg font-semibold mb-2">Connection Failed</h3>
          <p className="text-sm text-gray-500 mb-4">
            Failed to connect your wallet automatically. Please try again.
          </p>
          <Button 
            onClick={handleRetryConnection} 
            disabled={isRetrying}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            {isRetrying ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Connecting...
              </>
            ) : (
              "Retry Connection"
            )}
          </Button>
        </div>
      </div>
    );
  }

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
