
import React from "react";
import { RefreshCw, Copy } from "lucide-react";
import { formatAddress } from "../../utils/hathorUtils";
import { toast } from "../../hooks/use-toast";

interface WalletHeaderProps {
  address: string | null;
  refreshing: boolean;
  onRefresh: () => void;
}

const WalletHeader: React.FC<WalletHeaderProps> = ({ address, refreshing, onRefresh }) => {
  const handleCopyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast({
        title: "Address copied",
        description: "Wallet address copied to clipboard",
      });
    }
  };

  return (
    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-4 text-white">
      <h3 className="font-semibold flex items-center justify-between">
        <span>Your Wallet</span>
        <button
          onClick={onRefresh}
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
  );
};

export default WalletHeader;
