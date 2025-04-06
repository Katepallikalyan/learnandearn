
// Hathor blockchain utility functions
// In a real implementation, these would interact with the Hathor SDK or API

/**
 * Formats an address for display (shortens it)
 */
export const formatAddress = (address: string): string => {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

/**
 * Formats token balance with proper decimals and symbol
 */
export const formatTokenBalance = (balance: number, symbol: string = "LEARN"): string => {
  return `${balance.toLocaleString()} ${symbol}`;
};

/**
 * Extracts transaction hash from a receipt
 * In a real implementation, this would process actual blockchain receipts
 */
export const getTransactionHash = (receipt: any): string => {
  // Mock function - would extract real tx hash in production
  return `${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
};

/**
 * Creates a block explorer URL for a transaction
 * In a real implementation, this would point to Hathor's block explorer
 */
export const getExplorerUrl = (txHash: string): string => {
  return `https://explorer.hathor.network/transaction/${txHash}`;
};

/**
 * Calculates the time remaining until a governance proposal ends
 */
export const calculateTimeRemaining = (endDate: Date): string => {
  const now = new Date();
  const diffTime = endDate.getTime() - now.getTime();
  
  if (diffTime <= 0) return "Ended";
  
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  if (diffDays > 0) {
    return `${diffDays}d ${diffHours}h remaining`;
  } else {
    const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
    return `${diffHours}h ${diffMinutes}m remaining`;
  }
};

/**
 * Calculates voting percentages for a proposal
 */
export const calculateVotePercentages = (votesFor: number, votesAgainst: number) => {
  const total = votesFor + votesAgainst;
  
  if (total === 0) {
    return { forPercentage: 0, againstPercentage: 0 };
  }
  
  const forPercentage = Math.round((votesFor / total) * 100);
  const againstPercentage = 100 - forPercentage;
  
  return { forPercentage, againstPercentage };
};
