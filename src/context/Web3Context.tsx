
import React, { createContext, useContext, useState, useEffect } from "react";
import { getWalletBalance, getVotingPower } from "../services/api";
import { useTelegram } from "./TelegramContext";
import { toast } from "../hooks/use-toast";

interface Web3ContextProps {
  isConnected: boolean;
  balance: number;
  votingPower: number;
  address: string | null;
  connectWallet: () => Promise<void>;
  refreshBalance: () => Promise<void>;
  sendTokens: (to: string, amount: number) => Promise<boolean>;
  castVote: (proposalId: number, vote: boolean) => Promise<boolean>;
  transactions: Transaction[];
}

interface Transaction {
  id: string;
  type: "reward" | "vote" | "send" | "receive";
  description: string;
  amount: number;
  timestamp: Date;
}

const Web3Context = createContext<Web3ContextProps>({
  isConnected: false,
  balance: 0,
  votingPower: 0,
  address: null,
  connectWallet: async () => {},
  refreshBalance: async () => {},
  sendTokens: async () => false,
  castVote: async () => false,
  transactions: [],
});

export const useWeb3 = () => useContext(Web3Context);

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useTelegram();
  const [isConnected, setIsConnected] = useState(false);
  const [balance, setBalance] = useState(0);
  const [votingPower, setVotingPower] = useState(0);
  const [address, setAddress] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Generate mock transactions for demo purposes
  const generateMockTransactions = () => {
    const now = new Date();
    return [
      {
        id: "tx_" + Math.random().toString(36).substring(2, 10),
        type: "reward",
        description: "Quiz Reward - Blockchain Basics",
        amount: 10,
        timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000), // 1 day ago
      },
      {
        id: "tx_" + Math.random().toString(36).substring(2, 10),
        type: "vote",
        description: "Voted on DAO proposal",
        amount: 0,
        timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      },
    ];
  };

  // Mock wallet connection based on Telegram user ID
  const connectWallet = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "User information not available",
        variant: "destructive",
      });
      return;
    }
    
    try {
      toast({
        title: "Connecting",
        description: "Connecting to your wallet...",
      });
      
      // In a real implementation, this would interact with a wallet provider
      // For our demo, we'll just simulate a connection
      const mockAddress = `hthr_${user.id}abcdef123456`;
      setAddress(mockAddress);
      setIsConnected(true);
      
      // Add mock transactions
      setTransactions(generateMockTransactions());
      
      // Fetch initial balance
      await refreshBalance();
      
      toast({
        title: "Connected",
        description: "Your wallet has been connected successfully",
      });
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      toast({
        title: "Error",
        description: "Failed to connect wallet",
        variant: "destructive",
      });
    }
  };

  const refreshBalance = async () => {
    if (!address) return;
    
    if (isRefreshing) return;
    
    try {
      setIsRefreshing(true);
      // Fetch token balance from our simulated API
      const data = await getWalletBalance(address);
      setBalance(data.balance);
      
      // Fetch voting power (might be equal to balance or have a different calculation)
      const votingData = await getVotingPower(address);
      setVotingPower(votingData.votingPower);
    } catch (error) {
      console.error("Failed to refresh balance:", error);
      toast({
        title: "Error",
        description: "Failed to refresh balance",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const sendTokens = async (to: string, amount: number): Promise<boolean> => {
    if (!address) {
      toast({
        title: "Error",
        description: "Wallet not connected",
        variant: "destructive",
      });
      return false;
    }
    
    if (amount <= 0) {
      toast({
        title: "Error",
        description: "Amount must be greater than zero",
        variant: "destructive",
      });
      return false;
    }
    
    if (amount > balance) {
      toast({
        title: "Error",
        description: "Insufficient balance",
        variant: "destructive",
      });
      return false;
    }
    
    try {
      // In a real implementation, this would call a blockchain function
      // For our demo, we'll just simulate a transaction
      
      // Add the transaction to history
      const newTx = {
        id: "tx_" + Math.random().toString(36).substring(2, 10),
        type: "send" as const,
        description: `Sent to ${to.substring(0, 8)}...`,
        amount: -amount, // Negative amount for sending
        timestamp: new Date(),
      };
      
      setTransactions(prev => [newTx, ...prev]);
      
      // Update balance locally
      setBalance(prev => prev - amount);
      setVotingPower(prev => prev - amount);
      
      return true;
    } catch (error) {
      console.error("Failed to send tokens:", error);
      toast({
        title: "Error",
        description: "Failed to send tokens",
        variant: "destructive",
      });
      return false;
    }
  };

  const castVote = async (proposalId: number, vote: boolean): Promise<boolean> => {
    if (!address) {
      toast({
        title: "Error",
        description: "Wallet not connected",
        variant: "destructive",
      });
      return false;
    }
    
    try {
      // In a real implementation, this would interact with a governance contract
      console.log(`Voting ${vote ? 'YES' : 'NO'} on proposal ${proposalId}`);
      
      // Add the vote to transaction history
      const newTx = {
        id: "tx_" + Math.random().toString(36).substring(2, 10),
        type: "vote" as const,
        description: `Voted ${vote ? 'YES' : 'NO'} on proposal #${proposalId}`,
        amount: 0,
        timestamp: new Date(),
      };
      
      setTransactions(prev => [newTx, ...prev]);
      
      return true;
    } catch (error) {
      console.error("Failed to cast vote:", error);
      toast({
        title: "Error",
        description: "Failed to cast vote",
        variant: "destructive",
      });
      return false;
    }
  };

  // Record quiz rewards in transaction history
  const recordQuizReward = (quizTitle: string, amount: number) => {
    const newTx = {
      id: "tx_" + Math.random().toString(36).substring(2, 10),
      type: "reward" as const,
      description: `Quiz Reward - ${quizTitle}`,
      amount: amount,
      timestamp: new Date(),
    };
    
    setTransactions(prev => [newTx, ...prev]);
  };

  useEffect(() => {
    // Auto-connect wallet when user is available
    if (user && !isConnected) {
      connectWallet();
    }
  }, [user]);

  return (
    <Web3Context.Provider
      value={{
        isConnected,
        balance,
        votingPower,
        address,
        connectWallet,
        refreshBalance,
        sendTokens,
        castVote,
        transactions,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};
