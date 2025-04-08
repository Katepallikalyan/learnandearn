
import React from "react";
import { QrCode, Send } from "lucide-react";
import { toast } from "../../hooks/use-toast";

interface TokenActionsProps {
  address: string | null;
  showSendForm: boolean;
  onShowSendForm: () => void;
}

const TokenActions: React.FC<TokenActionsProps> = ({ address, showSendForm, onShowSendForm }) => {
  const handleReceiveClick = () => {
    toast({
      title: "Receive Tokens",
      description: address ? `Your address: ${address}` : "Wallet not connected",
    });
  };

  return (
    <>
      {!showSendForm && (
        <button
          onClick={onShowSendForm}
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
