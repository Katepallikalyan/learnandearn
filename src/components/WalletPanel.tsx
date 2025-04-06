
import React from "react";
import { useWeb3 } from "../context/Web3Context";
import { useTelegram } from "../context/TelegramContext";
import { formatAddress, formatTokenBalance } from "../utils/hathorUtils";
import { Wallet, RefreshCw, Coins } from "lucide-react";

const WalletPanel: React.FC = () => {
  const { isConnected, address, balance, votingPower, connectWallet, refreshBalance } = useWeb3();
  const { showAlert } = useTelegram();
  const [refreshing, setRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshBalance();
      showAlert("Balance updated successfully");
    } catch (error) {
      showAlert("Failed to refresh balance");
    } finally {
      setRefreshing(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
        <div className="text-center">
          <Wallet className="h-10 w-10 mx-auto text-gray-400 mb-3" />
          <h3 className="text-lg font-semibold mb-2">Wallet Not Connected</h3>
          <p className="text-sm text-gray-500 mb-4">
            Connect your wallet to view your balance and earning history
          </p>
          <button
            onClick={connectWallet}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-4 text-white">
        <h3 className="font-semibold flex items-center justify-between">
          <span>Your Wallet</span>
          <button
            onClick={handleRefresh}
            className="text-white rounded-full p-1 hover:bg-white/20 transition-colors"
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          </button>
        </h3>
        {address && (
          <div className="text-sm opacity-80 mt-1">{formatAddress(address)}</div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-500">Token Balance</div>
          <div className="font-semibold flex items-center">
            <Coins className="h-4 w-4 mr-1 text-amber-500" />
            {formatTokenBalance(balance)}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">Voting Power</div>
          <div className="font-semibold">{votingPower}</div>
        </div>
      </div>

      <div className="border-t border-gray-100 p-3">
        <button
          onClick={() => showAlert("Transaction history will be implemented in a future update!")}
          className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors w-full text-center"
        >
          View Transaction History
        </button>
      </div>
    </div>
  );
};

export default WalletPanel;
