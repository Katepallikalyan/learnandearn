
// Mock API service for Learn & Earn Telegram Mini App

// Base URL would point to your backend server
const BASE_URL = "https://api.example.com"; // Replace with your actual API endpoint

// Mock quiz data
const QUIZ_TOPICS = [
  {
    id: 1,
    title: "Blockchain Basics",
    description: "Learn the fundamental concepts of blockchain technology",
    imageUrl: "https://via.placeholder.com/150/4F46E5/FFFFFF?text=Blockchain",
    questionsCount: 5,
    difficulty: "Beginner",
    rewardAmount: 10,
  },
  {
    id: 2,
    title: "Smart Contracts",
    description: "Understand how smart contracts work and their applications",
    imageUrl: "https://via.placeholder.com/150/7C3AED/FFFFFF?text=Smart+Contracts",
    questionsCount: 5,
    difficulty: "Intermediate",
    rewardAmount: 20,
  },
  {
    id: 3,
    title: "DeFi Fundamentals",
    description: "Explore the world of decentralized finance",
    imageUrl: "https://via.placeholder.com/150/2563EB/FFFFFF?text=DeFi",
    questionsCount: 5,
    difficulty: "Advanced",
    rewardAmount: 30,
  },
  {
    id: 4,
    title: "NFTs Explained",
    description: "Discover the technology behind non-fungible tokens",
    imageUrl: "https://via.placeholder.com/150/9333EA/FFFFFF?text=NFTs",
    questionsCount: 5,
    difficulty: "Beginner",
    rewardAmount: 15,
  },
];

// Mock questions
const QUIZ_QUESTIONS = {
  1: [
    {
      id: 101,
      question: "What is a blockchain?",
      options: [
        "A type of cryptocurrency",
        "A distributed ledger technology",
        "A centralized database",
        "A programming language",
      ],
      correctAnswer: 1,
    },
    {
      id: 102,
      question: "Which of the following is NOT a characteristic of blockchain?",
      options: [
        "Decentralization",
        "Transparency",
        "Immutability",
        "Centralized control",
      ],
      correctAnswer: 3,
    },
    {
      id: 103,
      question: "What is a consensus mechanism?",
      options: [
        "A way to agree on the state of the blockchain",
        "A type of smart contract",
        "A cryptocurrency exchange",
        "A blockchain programming language",
      ],
      correctAnswer: 0,
    },
    {
      id: 104,
      question: "What is a block in blockchain?",
      options: [
        "A type of cryptocurrency",
        "A single transaction",
        "A collection of transactions",
        "A type of smart contract",
      ],
      correctAnswer: 2,
    },
    {
      id: 105,
      question: "What is the purpose of cryptography in blockchain?",
      options: [
        "To make transactions faster",
        "To secure and verify transactions",
        "To create new cryptocurrencies",
        "To program smart contracts",
      ],
      correctAnswer: 1,
    },
  ],
  // Additional quiz questions would be defined here for other topics
};

// Mock proposals for governance
const GOVERNANCE_PROPOSALS = [
  {
    id: 1,
    title: "Add a new quiz topic on DAOs",
    description: "Create a new educational module about Decentralized Autonomous Organizations",
    votesFor: 120,
    votesAgainst: 30,
    status: "Active",
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
  },
  {
    id: 2,
    title: "Increase rewards for advanced quizzes",
    description: "Proposal to increase token rewards for completing advanced difficulty quizzes",
    votesFor: 85,
    votesAgainst: 45,
    status: "Active",
    endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
  },
];

// Fetch quiz topics
export const getQuizTopics = async () => {
  // In a real app, this would be an API call
  // await fetch(`${BASE_URL}/quizzes`)
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return QUIZ_TOPICS;
};

// Fetch quiz questions
export const getQuizQuestions = async (topicId: number) => {
  // In a real app: await fetch(`${BASE_URL}/quizzes/${topicId}/questions`)
  
  await new Promise(resolve => setTimeout(resolve, 700));
  
  return QUIZ_QUESTIONS[topicId as keyof typeof QUIZ_QUESTIONS] || [];
};

// Submit quiz answers and get rewards
export const submitQuizAnswers = async (
  topicId: number,
  userId: number,
  answers: { questionId: number; answerId: number }[]
) => {
  // In a real app: await fetch(`${BASE_URL}/quizzes/submit`, {method: 'POST', body: JSON.stringify({...})})
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Calculate correct answers (in a real app this would happen server-side)
  const questions = QUIZ_QUESTIONS[topicId as keyof typeof QUIZ_QUESTIONS] || [];
  let correctCount = 0;
  
  answers.forEach(answer => {
    const question = questions.find(q => q.id === answer.questionId);
    if (question && question.correctAnswer === answer.answerId) {
      correctCount++;
    }
  });
  
  const totalQuestions = questions.length;
  const percentageCorrect = (correctCount / totalQuestions) * 100;
  
  // Find the quiz to get reward amount
  const quiz = QUIZ_TOPICS.find(q => q.id === topicId);
  const potentialReward = quiz ? quiz.rewardAmount : 0;
  
  // Calculate actual reward (only reward if they got at least 60% correct)
  let earnedReward = 0;
  if (percentageCorrect >= 80) {
    earnedReward = potentialReward; // Full reward for 80%+ correct
  } else if (percentageCorrect >= 60) {
    earnedReward = Math.floor(potentialReward * 0.5); // Half reward for 60-79% correct
  }
  
  return {
    correctCount,
    totalQuestions,
    percentageCorrect,
    earnedReward,
  };
};

// Get wallet balance
export const getWalletBalance = async (address: string) => {
  // In a real app: await fetch(`${BASE_URL}/wallet/${address}/balance`)
  
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Mock balance - in a real app this would come from the blockchain
  return {
    address,
    balance: 135,
    tokenSymbol: "LEARN",
  };
};

// Get voting power
export const getVotingPower = async (address: string) => {
  // In a real app: await fetch(`${BASE_URL}/governance/voting-power/${address}`)
  
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // Mock voting power - in a real app this might be calculated differently than just balance
  return {
    address,
    votingPower: 135,
  };
};

// Get governance proposals
export const getGovernanceProposals = async () => {
  // In a real app: await fetch(`${BASE_URL}/governance/proposals`)
  
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return GOVERNANCE_PROPOSALS;
};

// Cast vote on a proposal
export const castVote = async (
  proposalId: number,
  address: string,
  voteInFavor: boolean,
  votingPower: number
) => {
  // In a real app: await fetch(`${BASE_URL}/governance/vote`, {method: 'POST', body: JSON.stringify({...})})
  
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  return {
    success: true,
    proposalId,
    vote: voteInFavor ? "FOR" : "AGAINST",
    votingPower,
  };
};
