import React, { createContext, useContext, useState } from 'react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

interface TestResult {
  id: string;
  userId: string;
  score: number;
  totalQuestions: number;
  answers: number[];
  correctAnswers: number[];
  timeTaken: number;
  timestamp: Date;
  categoryWiseScore: { [key: string]: { correct: number; total: number } };
}

interface TestContextType {
  currentTest: Question[] | null;
  currentQuestionIndex: number;
  userAnswers: number[];
  timeRemaining: number;
  isTestActive: boolean;
  testResults: TestResult[];
  startTest: (duration: number) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  answerQuestion: (answerIndex: number) => void;
  submitTest: () => TestResult;
  setTimeRemaining: (time: number) => void;
  endTest: () => void;
}

const TestContext = createContext<TestContextType | undefined>(undefined);

export const useTest = () => {
  const context = useContext(TestContext);
  if (context === undefined) {
    throw new Error('useTest must be used within a TestProvider');
  }
  return context;
};

// Mock questions data
const mockQuestions: Question[] = [
  {
    id: 1,
    question: "What is the capital of India?",
    options: ["Mumbai", "New Delhi", "Kolkata", "Chennai"],
    correctAnswer: 1,
    category: "General Knowledge",
    difficulty: "Easy"
  },
  {
    id: 2,
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: 1,
    category: "Science",
    difficulty: "Easy"
  },
  {
    id: 3,
    question: "What is 15% of 200?",
    options: ["25", "30", "35", "40"],
    correctAnswer: 1,
    category: "Mathematics",
    difficulty: "Medium"
  },
  {
    id: 4,
    question: "Who wrote the book 'Discovery of India'?",
    options: ["Mahatma Gandhi", "Jawaharlal Nehru", "Rabindranath Tagore", "Dr. APJ Abdul Kalam"],
    correctAnswer: 1,
    category: "History",
    difficulty: "Medium"
  },
  {
    id: 5,
    question: "If A = 1, B = 2, C = 3, then what is the value of CAB?",
    options: ["321", "312", "123", "132"],
    correctAnswer: 1,
    category: "Reasoning",
    difficulty: "Easy"
  },
  {
    id: 6,
    question: "Which of the following is a renewable source of energy?",
    options: ["Coal", "Solar", "Natural Gas", "Oil"],
    correctAnswer: 1,
    category: "Science",
    difficulty: "Easy"
  },
  {
    id: 7,
    question: "The first railway line in India was opened between which two cities?",
    options: ["Mumbai to Thane", "Mumbai to Pune", "Delhi to Agra", "Kolkata to Darjeeling"],
    correctAnswer: 0,
    category: "History",
    difficulty: "Hard"
  },
  {
    id: 8,
    question: "What is 25% of 80?",
    options: ["15", "20", "25", "30"],
    correctAnswer: 1,
    category: "Mathematics",
    difficulty: "Easy"
  },
  {
    id: 9,
    question: "Which state in India has the longest coastline?",
    options: ["Tamil Nadu", "Gujarat", "Maharashtra", "Andhra Pradesh"],
    correctAnswer: 1,
    category: "Geography",
    difficulty: "Medium"
  },
  {
    id: 10,
    question: "Complete the series: 2, 4, 8, 16, ?",
    options: ["24", "28", "32", "36"],
    correctAnswer: 2,
    category: "Reasoning",
    difficulty: "Medium"
  }
];

export const TestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTest, setCurrentTest] = useState<Question[] | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isTestActive, setIsTestActive] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);

  const startTest = (duration: number) => {
    const shuffledQuestions = [...mockQuestions].sort(() => Math.random() - 0.5);
    setCurrentTest(shuffledQuestions);
    setCurrentQuestionIndex(0);
    setUserAnswers(new Array(shuffledQuestions.length).fill(-1));
    setTimeRemaining(duration * 60); // Convert minutes to seconds
    setIsTestActive(true);
  };

  const nextQuestion = () => {
    if (currentTest && currentQuestionIndex < currentTest.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const answerQuestion = (answerIndex: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setUserAnswers(newAnswers);
  };

  const submitTest = (): TestResult => {
    if (!currentTest) throw new Error('No active test');

    const correctAnswers = currentTest.map(q => q.correctAnswer);
    const score = userAnswers.reduce((acc, answer, index) => {
      return acc + (answer === correctAnswers[index] ? 1 : 0);
    }, 0);

    // Calculate category-wise scores
    const categoryWiseScore: { [key: string]: { correct: number; total: number } } = {};
    currentTest.forEach((question, index) => {
      const category = question.category;
      if (!categoryWiseScore[category]) {
        categoryWiseScore[category] = { correct: 0, total: 0 };
      }
      categoryWiseScore[category].total++;
      if (userAnswers[index] === question.correctAnswer) {
        categoryWiseScore[category].correct++;
      }
    });

    const result: TestResult = {
      id: Date.now().toString(),
      userId: 'current-user',
      score,
      totalQuestions: currentTest.length,
      answers: userAnswers,
      correctAnswers,
      timeTaken: (30 * 60) - timeRemaining, // Assuming 30 minutes test
      timestamp: new Date(),
      categoryWiseScore
    };

    // Store result in localStorage
    const existingResults = JSON.parse(localStorage.getItem('testResults') || '[]');
    existingResults.push(result);
    localStorage.setItem('testResults', JSON.stringify(existingResults));

    setTestResults(existingResults);
    endTest();
    return result;
  };

  const endTest = () => {
    setCurrentTest(null);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setTimeRemaining(0);
    setIsTestActive(false);
  };

  return (
    <TestContext.Provider value={{
      currentTest,
      currentQuestionIndex,
      userAnswers,
      timeRemaining,
      isTestActive,
      testResults,
      startTest,
      nextQuestion,
      previousQuestion,
      answerQuestion,
      submitTest,
      setTimeRemaining,
      endTest
    }}>
      {children}
    </TestContext.Provider>
  );
};