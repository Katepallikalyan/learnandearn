
import React from "react";
import { Award, Vote, Send, Coins, ExternalLink } from "lucide-react";

interface Transaction {
  id: string;
  type: "reward" | "vote" | "send" | "receive";
  description: string;
  amount: number;
  timestamp: Date;
}

interface TransactionListProps {
  transactions: Transaction[];
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };
  
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "reward":
        return <Award className="h-5 w-5 text-green-600" />;
      case "vote":
        return <Vote className="h-5 w-5 text-indigo-600" />;
      case "send":
        return <Send className="h-5 w-5 text-red-600" />;
      case "receive":
        return <Coins className="h-5 w-5 text-green-600" />;
      default:
        return <ExternalLink className="h-5 w-5 text-gray-600" />;
    }
  };
  
  const getTransactionColor = (amount: number) => {
    if (amount > 0) return "text-green-600";
    if (amount < 0) return "text-red-600";
    return "text-gray-500";
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        <p>No transaction history yet</p>
      </div>
    );
  }

  return (
    <div className="divide-y">
      {transactions.map((tx) => (
        <div key={tx.id} className="py-3 flex items-start">
          <div className={`p-2 rounded mr-3 ${
            tx.type === "reward" ? "bg-green-100" : 
            tx.type === "vote" ? "bg-indigo-100" :
            tx.type === "send" ? "bg-red-100" : "bg-amber-100"
          }`}>
            {getTransactionIcon(tx.type)}
          </div>
          <div className="flex-1">
            <div className="font-medium">{tx.description}</div>
            <div className="text-xs text-gray-400">{formatDate(tx.timestamp)}</div>
          </div>
          <div className={`${getTransactionColor(tx.amount)} font-medium`}>
            {tx.amount !== 0 ? 
              (tx.amount > 0 ? '+' : '') + tx.amount + ' LEARN' 
              : '—'}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionList;
