
import React, { createContext, useContext, useState, useEffect } from "react";
import { getWalletBalance, getVotingPower } from "../services/api";
import { useTelegram } from "./TelegramContext";

interface Web3ContextProps {
  isConnected: boolean;
  balance: number;
  votingPower: number;
  address: string | null;
  connectWallet: () => Promise<void>;
  refreshBalance: () => Promise<void>;
  sendTokens: (to: string, amount: number) => Promise<boolean>;
  castVote: (proposalId: number, vote: boolean) => Promise<boolean>;
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
});

export const useWeb3 = () => useContext(Web3Context);

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useTelegram();
  const [isConnected, setIsConnected] = useState(false);
  const [balance, setBalance] = useState(0);
  const [votingPower, setVotingPower] = useState(0);
  const [address, setAddress] = useState<string | null>(null);

  // Mock wallet connection based on Telegram user ID
  const connectWallet = async () => {
    if (!user) return;
    
    try {
      // In a real implementation, this would interact with a wallet provider
      // For our demo, we'll just simulate a connection
      const mockAddress = `hthr_${user.id}abcdef123456`;
      setAddress(mockAddress);
      setIsConnected(true);
      
      // Fetch initial balance
      await refreshBalance();
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  const refreshBalance = async () => {
    if (!address) return;
    
    try {
      // Fetch token balance from our simulated API
      const data = await getWalletBalance(address);
      setBalance(data.balance);
      
      // Fetch voting power (might be equal to balance or have a different calculation)
      const votingData = await getVotingPower(address);
      setVotingPower(votingData.votingPower);
    } catch (error) {
      console.error("Failed to refresh balance:", error);
    }
  };

  const sendTokens = async (to: string, amount: number): Promise<boolean> => {
    // In a real implementation, this would call a blockchain function
    console.log(`Sending ${amount} tokens to ${to}`);
    return true;
  };

  const castVote = async (proposalId: number, vote: boolean): Promise<boolean> => {
    // In a real implementation, this would interact with a governance contract
    console.log(`Voting ${vote ? 'YES' : 'NO'} on proposal ${proposalId}`);
    return true;
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
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};
