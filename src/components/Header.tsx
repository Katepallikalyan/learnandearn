
import React from "react";
import { useTelegram } from "../context/TelegramContext";
import { useWeb3 } from "../context/Web3Context";
import { formatTokenBalance } from "../utils/hathorUtils";
import { Coins } from "lucide-react";

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title = "Learn & Earn" }) => {
  const { user } = useTelegram();
  const { balance, isConnected } = useWeb3();

  return (
    <header className="bg-indigo-600 text-white px-4 py-3 flex justify-between items-center sticky top-0 z-10">
      <div className="flex items-center space-x-2">
        <div className="font-bold text-lg">{title}</div>
      </div>

      <div className="flex items-center space-x-3">
        {isConnected && (
          <div className="flex items-center bg-indigo-700 rounded-full px-3 py-1">
            <Coins className="h-4 w-4 mr-1" />
            <span className="text-sm font-medium">
              {formatTokenBalance(balance)}
            </span>
          </div>
        )}
        
        {user && (
          <div className="flex items-center">
            <div className="w-8 h-8 bg-indigo-300 rounded-full flex items-center justify-center">
              <span className="font-medium text-indigo-900">
                {user.firstName.charAt(0)}
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
