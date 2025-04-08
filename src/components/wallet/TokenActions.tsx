
import React from "react";
import { QrCode, Send } from "lucide-react";
import { toast } from "../../hooks/use-toast";
import { useTelegram } from "../../context/TelegramContext";

interface TokenActionsProps {
  address: string | null;
  showSendForm: boolean;
  onShowSendForm: () => void;
}

const TokenActions: React.FC<TokenActionsProps> = ({ address, showSendForm, onShowSendForm }) => {
  const { hapticFeedback, tg } = useTelegram();
  
  const handleReceiveClick = () => {
    hapticFeedback.selection();
    const message = address ? `Your address: ${address}` : "Wallet not connected";
    
    toast({
      title: "Receive Tokens",
      description: message,
    });
    
    // Try to copy address to clipboard
    if (address) {
      navigator.clipboard.writeText(address)
        .then(() => hapticFeedback.success())
        .catch(() => console.log("Clipboard write failed"));
    }
  };

  const handleSendClick = () => {
    hapticFeedback.selection();
    onShowSendForm();
  };

  return (
    <>
      {!showSendForm && (
        <button
          onClick={handleSendClick}
          className="w-full bg-indigo-600 text-white rounded-lg py-2 mb-3 hover:bg-indigo-700 transition-colors flex items-center justify-center"
        >
          <Send className="h-4 w-4 mr-2" />
          Send Tokens
        </button>
      )}
      <button
        onClick={handleReceiveClick}
        className="w-full border border-gray-200 rounded-lg py-2 text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center"
      >
        <QrCode className="h-4 w-4 mr-2" />
        Receive Tokens
      </button>
    </>
  );
};

export default TokenActions;
