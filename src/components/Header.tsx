
import React from "react";
import { useTelegram } from "../context/TelegramContext";
import { useWeb3 } from "../context/Web3Context";
import { formatTokenBalance } from "../utils/hathorUtils";
import { Coins } from "lucide-react";

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title = "Learn & Earn" }) => {
  const { user, tg } = useTelegram();
  const { balance, isConnected } = useWeb3();

  // Telegram-style UI
  const telegramStyle = tg ? "bg-[#5288c1]" : "bg-indigo-600";

  return (
    <header className={`${telegramStyle} text-white px-4 py-3 flex justify-between items-center sticky top-0 z-10`}>
      <div className="flex items-center space-x-2">
        <div className="font-bold text-lg">{title}</div>
      </div>

      <div className="flex items-center space-x-3">
        {isConnected && (
          <div className="flex items-center bg-black/20 rounded-full px-3 py-1">
            <Coins className="h-4 w-4 mr-1" />
            <span className="text-sm font-medium">
              {formatTokenBalance(balance)}
            </span>
          </div>
        )}
        
        {user && (
          <div className="flex items-center">
            <div className="w-8 h-8 bg-white/30 rounded-full flex items-center justify-center">
              <span className="font-medium text-white">
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
