
import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "../hooks/use-toast";

// Define Transaction type
interface Transaction {
  id: string;
  type: "reward" | "vote" | "send" | "receive";
  description: string;
  amount: number;
  timestamp: Date;
}

// Define the Web3Context interface
interface Web3ContextProps {
  isConnected: boolean;
  address: string | null;
  balance: number;
  votingPower: number;
  transactions: Transaction[];
  connectWallet: () => Promise<boolean>;
  refreshBalance: () => Promise<void>;
  sendTokens: (recipient: string, amount: number) => Promise<boolean>;
  castVote: (proposalId: number, vote: boolean) => Promise<boolean>;
}

// Create the context with default values
const Web3Context = createContext<Web3ContextProps>({
  isConnected: false,
  address: null,
  balance: 0,
  votingPower: 0,
  transactions: [],
  connectWallet: async () => false,
  refreshBalance: async () => {},
  sendTokens: async () => false,
  castVote: async () => false,
});

// Hook to use the Web3 context
export const useWeb3 = () => useContext(Web3Context);

// Provider component
export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [votingPower, setVotingPower] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Load wallet data on initial render
  useEffect(() => {
    const savedAddress = localStorage.getItem("walletAddress");
    if (savedAddress) {
      setAddress(savedAddress);
      setIsConnected(true);
      refreshBalance();
    }
  }, []);

  // Connect wallet function
  const connectWallet = async (): Promise<boolean> => {
    try {
      // For this demo, we'll create a mock wallet address
      const mockAddress = "0x" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      
      setAddress(mockAddress);
      setIsConnected(true);
      
      // Save to localStorage for persistence
      localStorage.setItem("walletAddress", mockAddress);
      
      // Initialize with some tokens
      if (balance === 0) {
        setBalance(50);
        setVotingPower(5);
        
        // Add initial transaction
        const newTx: Transaction = {
          id: "tx_" + Math.random().toString(36).substring(2, 10),
          type: "receive",
          description: "Initial wallet funding",
          amount: 50,
          timestamp: new Date(),
        };
        
        setTransactions([newTx]);
      }
      
      toast({
        title: "Wallet Connected",
        description: "Your wallet has been connected successfully",
      });
      
      return true;
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      toast({
        title: "Error",
        description: "Failed to connect wallet",
        variant: "destructive",
      });
      return false;
    }
  };

  // Refresh balance function
  const refreshBalance = async (): Promise<void> => {
    if (!address) return;
    
    try {
      // In a real app, we would fetch the balance from a blockchain
      // Here we'll just simulate a random fluctuation for demo purposes
      const variationPercent = 0.05; // 5% variation
      const randomFactor = 1 + (Math.random() * variationPercent * 2 - variationPercent);
      const oldBalance = balance;
      const newBalance = balance === 0 ? 50 : Math.max(0, balance * randomFactor);
      setBalance(newBalance);
      
      // Update voting power (10% of token balance, rounded down)
      setVotingPower(Math.floor(newBalance * 0.1));
      
      // If balance changed significantly, add a transaction
      if (Math.abs(newBalance - oldBalance) > 1 && oldBalance > 0) {
        const difference = newBalance - oldBalance;
        const newTx: Transaction = {
          id: "tx_" + Math.random().toString(36).substring(2, 10),
          type: difference > 0 ? "receive" : "send",
          description: difference > 0 ? "Token reward" : "Token spend",
          amount: difference,
          timestamp: new Date(),
        };
        
        setTransactions(prev => [newTx, ...prev]);
      }
    } catch (error) {
      console.error("Failed to refresh balance:", error);
    }
  };

  // Send tokens function
  const sendTokens = async (recipient: string, amount: number): Promise<boolean> => {
    if (!address) {
      toast({
        title: "Error",
        description: "Wallet not connected",
        variant: "destructive",
      });
      return false;
    }
    
    if (amount <= 0 || amount > balance) {
      toast({
        title: "Error",
        description: "Invalid amount",
        variant: "destructive",
      });
      return false;
    }
    
    try {
      // In a real implementation, this would interact with the blockchain
      console.log(`Sending ${amount} tokens to ${recipient}`);
      
      // Update local state
      setBalance(prev => prev - amount);
      
      // Update voting power
      setVotingPower(prev => Math.max(0, Math.floor((balance - amount) * 0.1)));
      
      // Add to transaction history
      const newTx: Transaction = {
        id: "tx_" + Math.random().toString(36).substring(2, 10),
        type: "send",
        description: `Sent to ${recipient.substring(0, 6)}...`,
        amount: -amount,
        timestamp: new Date(),
      };
      
      setTransactions(prev => [newTx, ...prev]);
      
      toast({
        title: "Tokens Sent",
        description: `You've sent ${amount} tokens to ${recipient.substring(0, 6)}...`,
      });
      
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
      const newTx: Transaction = {
        id: "tx_" + Math.random().toString(36).substring(2, 10),
        type: "vote",
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

  return (
    <Web3Context.Provider
      value={{
        isConnected,
        address,
        balance,
        votingPower,
        transactions,
        connectWallet,
        refreshBalance,
        sendTokens,
        castVote,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};
