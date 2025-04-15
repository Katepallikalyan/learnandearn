
import React from "react";
import { Coins, Check } from "lucide-react";
import { formatTokenBalance } from "../../utils/hathorUtils";
import { useTelegram } from "../../context/TelegramContext";

interface WalletBalanceProps {
  balance: number;
  votingPower: number;
}

const WalletBalance = ({ balance, votingPower }: WalletBalanceProps) => {
  const { hapticFeedback } = useTelegram();

  return (
    <div 
      className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm"
      onTouchStart={() => hapticFeedback.selection()}
    >
      <div className="flex items-center justify-between mb-5">
        <div className="text-sm font-medium text-gray-500">Token Balance</div>
        <div className="font-semibold flex items-center text-lg">
          <Coins className="h-5 w-5 mr-2 text-amber-500" />
          {formatTokenBalance(balance)}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-gray-500">Voting Power</div>
        <div className="font-semibold flex items-center text-lg">
          <Check className="h-5 w-5 mr-2 text-green-500" />
          {votingPower}
        </div>
      </div>
    </div>
  );
};

export default WalletBalance;
