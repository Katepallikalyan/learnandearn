
import React, { useState, useEffect } from "react";
import { useWeb3 } from "../context/Web3Context";
import { ThumbsUp, ThumbsDown, Timer, Check } from "lucide-react";
import { calculateTimeRemaining, calculateVotePercentages } from "../utils/hathorUtils";
import { castVote } from "../services/api";
import { useTelegram } from "../context/TelegramContext";
import { toast } from "../hooks/use-toast";

interface GovernanceProposal {
  id: number;
  title: string;
  description: string;
  votesFor: number;
  votesAgainst: number;
  status: string;
  endDate: Date;
}

interface GovernanceVoteProps {
  proposal: GovernanceProposal;
  onVoteSuccess: () => void;
}

const GovernanceVote: React.FC<GovernanceVoteProps> = ({ proposal: initialProposal, onVoteSuccess }) => {
  const { address, votingPower } = useWeb3();
  const { showAlert } = useTelegram();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [timeRemaining, setTimeRemaining] = useState<string>(
    calculateTimeRemaining(new Date(initialProposal.endDate))
  );
  const [hasVoted, setHasVoted] = useState<boolean>(false);
  const [proposal, setProposal] = useState<GovernanceProposal>(initialProposal);
  const [percentages, setPercentages] = useState(() => 
    calculateVotePercentages(initialProposal.votesFor, initialProposal.votesAgainst)
  );

  // Update time remaining every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining(new Date(proposal.endDate)));
    }, 60000);

    return () => clearInterval(interval);
  }, [proposal.endDate]);

  const handleVote = async (inFavor: boolean) => {
    if (!address) {
      showAlert("Please connect your wallet to vote");
      return;
    }

    if (votingPower <= 0) {
      showAlert("You need voting power to participate");
      return;
    }

    try {
      setSubmitting(true);
      const result = await castVote(proposal.id, address, inFavor, votingPower);
      
      if (result.success) {
        // Update local state to immediately reflect the vote
        const updatedProposal = {...proposal};
        
        if (inFavor) {
          updatedProposal.votesFor += votingPower;
        } else {
          updatedProposal.votesAgainst += votingPower;
        }
        
        // Update proposal and recalculate percentages
        setProposal(updatedProposal);
        setPercentages(calculateVotePercentages(updatedProposal.votesFor, updatedProposal.votesAgainst));
        
        setHasVoted(true);
        
        // Show toast notification
        toast({
          title: "Vote submitted successfully",
          description: `You voted ${inFavor ? "FOR" : "AGAINST"} the proposal`,
          variant: "default",
        });
        
        onVoteSuccess();
      }
    } catch (error) {
      console.error("Vote error:", error);
      toast({
        title: "Error",
        description: "Failed to cast vote. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-4">
      <div className="p-5">
        <h3 className="font-semibold text-lg mb-1">{proposal.title}</h3>
        <p className="text-sm text-gray-600 mb-4">{proposal.description}</p>

        <div className="flex items-center justify-between text-sm mb-1">
          <div className="font-medium">Current Votes</div>
          <div className="flex items-center text-gray-500">
            <Timer className="h-3 w-3 mr-1" />
            <span>{timeRemaining}</span>
          </div>
        </div>

        <div className="h-2 bg-gray-100 rounded-full mb-3 overflow-hidden">
          <div
            className="h-full bg-green-500"
            style={{ width: `${percentages.forPercentage}%` }}
          ></div>
        </div>

        <div className="flex justify-between text-sm mb-5">
          <div className="flex items-center">
            <ThumbsUp className="h-3 w-3 mr-1 text-green-500" />
            <span>{proposal.votesFor} ({percentages.forPercentage}%)</span>
          </div>
          <div className="flex items-center">
            <ThumbsDown className="h-3 w-3 mr-1 text-red-500" />
            <span>{proposal.votesAgainst} ({percentages.againstPercentage}%)</span>
          </div>
        </div>

        {hasVoted ? (
          <div className="flex items-center justify-center text-green-600 py-2">
            <Check className="h-5 w-5 mr-2" />
            <span>Vote Submitted</span>
          </div>
        ) : (
          <div className="flex space-x-3">
            <button
              onClick={() => handleVote(true)}
              disabled={submitting || proposal.status !== "Active"}
              className="flex-1 bg-green-50 text-green-600 border border-green-200 rounded-lg py-2 hover:bg-green-100 transition-colors disabled:opacity-50"
            >
              <ThumbsUp className="h-4 w-4 inline-block mr-1" />
              <span>For</span>
            </button>
            <button
              onClick={() => handleVote(false)}
              disabled={submitting || proposal.status !== "Active"}
              className="flex-1 bg-red-50 text-red-600 border border-red-200 rounded-lg py-2 hover:bg-red-100 transition-colors disabled:opacity-50"
            >
              <ThumbsDown className="h-4 w-4 inline-block mr-1" />
              <span>Against</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GovernanceVote;
