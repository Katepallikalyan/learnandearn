
import { useState, useEffect, useCallback } from "react";
import { useTelegram } from "../context/TelegramContext";
import { useWeb3 } from "../context/Web3Context";
import { getQuizQuestions, submitQuizAnswers } from "../services/api";
import { toast } from "../hooks/use-toast";

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizAnswer {
  questionId: number;
  answerId: number;
}

interface QuizResult {
  correctCount: number;
  totalQuestions: number;
  percentageCorrect: number;
  earnedReward: number;
}

export const useQuiz = (topicId: number) => {
  const { user, showAlert } = useTelegram();
  const { refreshBalance } = useWeb3();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchAttempt, setFetchAttempt] = useState<number>(0);

  // Fetch quiz questions with retry mechanism
  useEffect(() => {
    const fetchQuestions = async () => {
      if (topicId <= 0) return;
      
      try {
        setLoading(true);
        setError(null);
        const data = await getQuizQuestions(topicId);
        
        if (data && data.length > 0) {
          setQuestions(data);
          // Reset other state when new questions are loaded
          setCurrentQuestionIndex(0);
          setAnswers([]);
          setSelectedOption(null);
          setQuizResult(null);
        } else {
          throw new Error("No questions found for this topic");
        }
      } catch (err) {
        console.error("Failed to fetch quiz questions:", err);
        setError("Failed to load quiz questions. Please try again.");
        // Auto-retry after a delay (up to 3 attempts)
        if (fetchAttempt < 3) {
          setTimeout(() => {
            setFetchAttempt(prev => prev + 1);
          }, 1500);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [topicId, fetchAttempt]);

  // Current question getter with safety check
  const currentQuestion = questions.length > 0 && currentQuestionIndex < questions.length 
    ? questions[currentQuestionIndex] 
    : null;

  // Check if we're on the last question
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  // Answer a question
  const answerQuestion = useCallback(
    (optionIndex: number) => {
      if (!currentQuestion) return;

      setSelectedOption(optionIndex);

      // Record the answer
      const existingAnswerIndex = answers.findIndex(
        (a) => a.questionId === currentQuestion.id
      );

      if (existingAnswerIndex >= 0) {
        // Update existing answer
        const updatedAnswers = [...answers];
        updatedAnswers[existingAnswerIndex] = {
          questionId: currentQuestion.id,
          answerId: optionIndex,
        };
        setAnswers(updatedAnswers);
      } else {
        // Add new answer
        setAnswers([
          ...answers,
          { questionId: currentQuestion.id, answerId: optionIndex },
        ]);
      }
    },
    [currentQuestion, answers]
  );

  // Go to next question
  const goToNextQuestion = useCallback(() => {
    if (selectedOption === null) {
      toast({
        title: "Required",
        description: "Please select an answer before continuing",
        variant: "destructive",
      });
      return;
    }

    if (isLastQuestion) {
      // If we're on the last question, submit the quiz
      submitQuiz();
    } else {
      // Move to the next question
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setSelectedOption(null);
    }
  }, [isLastQuestion, selectedOption]);

  // Submit the quiz
  const submitQuiz = useCallback(async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "User information not available",
        variant: "destructive",
      });
      return;
    }
    
    if (!topicId) {
      toast({
        title: "Error",
        description: "Quiz topic not selected",
        variant: "destructive",
      });
      return;
    }
    
    if (answers.length !== questions.length) {
      toast({
        title: "Error",
        description: "Please answer all questions before submitting",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const result = await submitQuizAnswers(
        topicId,
        user.id,
        answers
      );

      setQuizResult(result);

      // Show appropriate message based on result
      if (result.earnedReward > 0) {
        toast({
          title: "Congratulations!",
          description: `You earned ${result.earnedReward} LEARN tokens!`,
          variant: "default",
        });
        
        // Refresh wallet balance if user earned tokens
        setTimeout(async () => {
          await refreshBalance();
        }, 1000);
      } else {
        toast({
          title: "Quiz Completed",
          description: `You scored ${Math.round(result.percentageCorrect)}%. Try again to earn rewards!`,
          variant: "default",
        });
      }
    } catch (err) {
      console.error("Failed to submit quiz:", err);
      setError("Failed to submit quiz. Please try again.");
      toast({
        title: "Error",
        description: "Failed to submit quiz. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  }, [topicId, user, answers, questions.length, refreshBalance]);

  // Reset the quiz to start over
  const resetQuiz = useCallback(() => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setSelectedOption(null);
    setQuizResult(null);
    setError(null);
  }, []);

  return {
    questions,
    currentQuestion,
    currentQuestionIndex,
    isLastQuestion,
    selectedOption,
    quizResult,
    loading,
    submitting,
    error,
    answerQuestion,
    goToNextQuestion,
    resetQuiz,
  };
};
