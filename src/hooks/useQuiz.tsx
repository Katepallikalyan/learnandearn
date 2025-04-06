
import { useState, useEffect, useCallback } from "react";
import { useTelegram } from "../context/TelegramContext";
import { useWeb3 } from "../context/Web3Context";
import { getQuizQuestions, submitQuizAnswers } from "../services/api";

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

  // Fetch quiz questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getQuizQuestions(topicId);
        setQuestions(data);
      } catch (err) {
        console.error("Failed to fetch quiz questions:", err);
        setError("Failed to load quiz questions. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [topicId]);

  // Current question getter
  const currentQuestion = questions[currentQuestionIndex];

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
      showAlert("Please select an answer before continuing");
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
  }, [isLastQuestion, selectedOption, showAlert]);

  // Submit the quiz
  const submitQuiz = useCallback(async () => {
    if (!user || !topicId) return;

    try {
      setSubmitting(true);
      setError(null);

      const result = await submitQuizAnswers(
        topicId,
        user.id,
        answers
      );

      setQuizResult(result);

      // Refresh wallet balance if user earned tokens
      if (result.earnedReward > 0) {
        await refreshBalance();
      }
    } catch (err) {
      console.error("Failed to submit quiz:", err);
      setError("Failed to submit quiz. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }, [topicId, user, answers, refreshBalance]);

  // Reset the quiz to start over
  const resetQuiz = useCallback(() => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setSelectedOption(null);
    setQuizResult(null);
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
