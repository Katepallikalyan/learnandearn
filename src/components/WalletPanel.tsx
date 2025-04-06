
import React, { useState } from "react";
import { useWeb3 } from "../context/Web3Context";
import { useTelegram } from "../context/TelegramContext";
import { formatAddress, formatTokenBalance } from "../utils/hathorUtils";
import { Wallet, RefreshCw, Coins, Send, QrCode, Copy, ExternalLink, Award, Vote } from "lucide-react";
import { toast } from "../hooks/use-toast";

const WalletPanel: React.FC = () => {
  const { isConnected, address, balance, votingPower, connectWallet, refreshBalance, sendTokens, transactions } = useWeb3();
  const { showAlert } = useTelegram();
  const [refreshing, setRefreshing] = React.useState(false);
  const [showSendForm, setShowSendForm] = useState(false);
  const [recipientAddress, setRecipientAddress] = useState("");
  const [sendAmount, setSendAmount] = useState("");

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshBalance();
      toast({
        title: "Success",
        description: "Balance updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh balance",
        variant: "destructive",
      });
    } finally {
      setRefreshing(false);
    }
  };

  const handleCopyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast({
        title: "Address copied",
        description: "Wallet address copied to clipboard",
      });
    }
  };

  const handleSendToken = async () => {
    if (!recipientAddress || !sendAmount) {
      toast({
        title: "Error",
        description: "Please enter recipient address and amount",
        variant: "destructive",
      });
      return;
    }

    const amount = parseFloat(sendAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    if (amount > balance) {
      toast({
        title: "Error",
        description: "Insufficient balance",
        variant: "destructive",
      });
      return;
    }

    try {
      const success = await sendTokens(recipientAddress, amount);
      if (success) {
        toast({
          title: "Success",
          description: `${amount} LEARN tokens sent successfully`,
        });
        setShowSendForm(false);
        setRecipientAddress("");
        setSendAmount("");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send tokens",
        variant: "destructive",
      });
    }
  };
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };
  
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "reward":
        return <Award className="h-5 w-5 text-green-600" />;
      case "vote":
        return <Vote className="h-5 w-5 text-indigo-600" />;
      case "send":
        return <Send className="h-5 w-5 text-red-600" />;
      case "receive":
        return <Coins className="h-5 w-5 text-green-600" />;
      default:
        return <ExternalLink className="h-5 w-5 text-gray-600" />;
    }
  };
  
  const getTransactionColor = (amount: number) => {
    if (amount > 0) return "text-green-600";
    if (amount < 0) return "text-red-600";
    return "text-gray-500";
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
          <div className="text-sm opacity-80 mt-1 flex items-center">
            <span>{formatAddress(address)}</span>
            <button 
              onClick={handleCopyAddress} 
              className="ml-2 p-1 rounded-full hover:bg-white/20"
            >
              <Copy className="h-3 w-3" />
            </button>
          </div>
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

        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-500">Voting Power</div>
          <div className="font-semibold">{votingPower}</div>
        </div>

        {!showSendForm ? (
          <button
            onClick={() => setShowSendForm(true)}
            className="w-full bg-indigo-600 text-white rounded-lg py-2 mb-3 hover:bg-indigo-700 transition-colors flex items-center justify-center"
          >
            <Send className="h-4 w-4 mr-2" />
            Send Tokens
          </button>
        ) : (
          <div className="mb-3 border border-gray-200 rounded-lg p-3">
            <div className="mb-2">
              <label className="block text-sm text-gray-500 mb-1">Recipient</label>
              <input
                type="text"
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                placeholder="Enter recipient address"
                className="w-full p-2 border border-gray-300 rounded text-sm"
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm text-gray-500 mb-1">Amount</label>
              <input
                type="number"
                value={sendAmount}
                onChange={(e) => setSendAmount(e.target.value)}
                placeholder="0.00"
                className="w-full p-2 border border-gray-300 rounded text-sm"
              />
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleSendToken}
                className="flex-1 bg-indigo-600 text-white rounded py-2 text-sm hover:bg-indigo-700"
              >
                Send
              </button>
              <button
                onClick={() => setShowSendForm(false)}
                className="flex-1 bg-gray-100 text-gray-700 rounded py-2 text-sm hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <button
          onClick={() => {
            toast({
              title: "Receive Tokens",
              description: address ? `Your address: ${formatAddress(address)}` : "Wallet not connected",
            });
          }}
          className="w-full border border-gray-200 rounded-lg py-2 text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center"
        >
          <QrCode className="h-4 w-4 mr-2" />
          Receive Tokens
        </button>
      </div>

      <div className="border-t border-gray-100 p-4">
        <h2 className="text-lg font-semibold mb-2">Transaction History</h2>
        {transactions.length > 0 ? (
          <div className="divide-y">
            {transactions.map((tx) => (
              <div key={tx.id} className="py-3 flex items-start">
                <div className={`p-2 rounded mr-3 ${
                  tx.type === "reward" ? "bg-green-100" : 
                  tx.type === "vote" ? "bg-indigo-100" :
                  tx.type === "send" ? "bg-red-100" : "bg-amber-100"
                }`}>
                  {getTransactionIcon(tx.type)}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{tx.description}</div>
                  <div className="text-xs text-gray-400">{formatDate(tx.timestamp)}</div>
                </div>
                <div className={`${getTransactionColor(tx.amount)} font-medium`}>
                  {tx.amount !== 0 ? 
                    (tx.amount > 0 ? '+' : '') + tx.amount + ' LEARN' 
                    : '—'}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            <p>No transaction history yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletPanel;
