
import React from "react";
import { Coins } from "lucide-react";
import { formatTokenBalance } from "../../utils/hathorUtils";

interface WalletBalanceProps {
  balance: number;
  votingPower: number;
}

const WalletBalance: React.FC<WalletBalanceProps> = ({ balance, votingPower }) => {
  return (
    <div>
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
    </div>
  );
};

export default WalletBalance;
