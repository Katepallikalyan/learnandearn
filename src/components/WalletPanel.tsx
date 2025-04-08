
import React, { useState } from "react";
import { useWeb3 } from "../context/Web3Context";
import { useTelegram } from "../context/TelegramContext";
import { formatAddress } from "../utils/hathorUtils";
import WalletConnect from "./wallet/WalletConnect";
import WalletHeader from "./wallet/WalletHeader";
import WalletBalance from "./wallet/WalletBalance";
import TokenActions from "./wallet/TokenActions";
import SendTokensForm from "./wallet/SendTokensForm";
import TransactionList from "./wallet/TransactionList";

const WalletPanel: React.FC = () => {
  const { isConnected, address, balance, votingPower, refreshBalance, transactions } = useWeb3();
  const { showAlert } = useTelegram();
  const [refreshing, setRefreshing] = useState(false);
  const [showSendForm, setShowSendForm] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshBalance();
    } catch (error) {
      showAlert("Failed to refresh balance");
    } finally {
      setRefreshing(false);
    }
  };

  if (!isConnected) {
    return <WalletConnect />;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <WalletHeader 
        address={address} 
        refreshing={refreshing} 
        onRefresh={handleRefresh} 
      />

      <div className="p-5">
        <WalletBalance balance={balance} votingPower={votingPower} />
        
        {showSendForm ? (
          <SendTokensForm onCancel={() => setShowSendForm(false)} />
        ) : null}
        
        <TokenActions 
          address={address} 
          showSendForm={showSendForm} 
          onShowSendForm={() => setShowSendForm(true)} 
        />
      </div>

      <div className="border-t border-gray-100 p-4">
        <h2 className="text-lg font-semibold mb-2">Transaction History</h2>
        <TransactionList transactions={transactions} />
      </div>
    </div>
  );
};

export default WalletPanel;
