
import React, { useState } from "react";
import { Send } from "lucide-react";
import { useWeb3 } from "../../context/Web3Context";
import { toast } from "../../hooks/use-toast";
import { useTelegram } from "../../context/TelegramContext";

interface SendTokensFormProps {
  onCancel: () => void;
}

const SendTokensForm: React.FC<SendTokensFormProps> = ({ onCancel }) => {
  const { balance, sendTokens } = useWeb3();
  const { hapticFeedback, showMainButton, hideMainButton } = useTelegram();
  const [recipientAddress, setRecipientAddress] = useState("");
  const [sendAmount, setSendAmount] = useState("");
  const [sending, setSending] = useState(false);

  const handleSendToken = async () => {
    if (!recipientAddress || !sendAmount) {
      hapticFeedback.error();
      toast({
        title: "Error",
        description: "Please enter recipient address and amount",
        variant: "destructive",
      });
      return;
    }

    const amount = parseFloat(sendAmount);
    if (isNaN(amount) || amount <= 0) {
      hapticFeedback.error();
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    if (amount > balance) {
      hapticFeedback.error();
      toast({
        title: "Error",
        description: "Insufficient balance",
        variant: "destructive",
      });
      return;
    }

    setSending(true);
    showMainButton("Sending...", () => {});
    
    try {
      const success = await sendTokens(recipientAddress, amount);
      if (success) {
        hapticFeedback.success();
        toast({
          title: "Success",
          description: `${amount} LEARN tokens sent successfully`,
        });
        onCancel();
      } else {
        hapticFeedback.error();
      }
    } catch (error) {
      hapticFeedback.error();
      toast({
        title: "Error",
        description: "Failed to send tokens",
        variant: "destructive",
      });
    } finally {
      setSending(false);
      hideMainButton();
    }
  };

  return (
    <div className="mb-3 border border-gray-200 rounded-lg p-3">
      <div className="mb-2">
        <label className="block text-sm text-gray-500 mb-1">Recipient</label>
        <input
          type="text"
          value={recipientAddress}
          onChange={(e) => setRecipientAddress(e.target.value)}
          placeholder="Enter recipient address"
          className="w-full p-2 border border-gray-300 rounded text-sm"
          disabled={sending}
        />
      </div>
      <div className="mb-3">
        <label className="block text-sm text-gray-500 mb-1">Amount</label>
        <input
          type="number"
          value={sendAmount}
          onChange={(e) => setSendAmount(e.target.value)}
          placeholder="0.00"
          className="w-full p-2 border border-gray-300 rounded text-sm"
          disabled={sending}
        />
      </div>
      <div className="flex space-x-2">
        <button
          onClick={handleSendToken}
          disabled={sending}
          className="flex-1 bg-indigo-600 text-white rounded py-2 text-sm hover:bg-indigo-700 disabled:opacity-50"
        >
          {sending ? "Sending..." : "Send"}
        </button>
        <button
          onClick={() => {
            hapticFeedback.selection();
            onCancel();
          }}
          disabled={sending}
          className="flex-1 bg-gray-100 text-gray-700 rounded py-2 text-sm hover:bg-gray-200 disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default SendTokensForm;
