import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, ChevronLeft, ChevronRight, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useTest } from '../context/TestContext';

const ExamConduct: React.FC = () => {
  const {
    currentTest,
    currentQuestionIndex,
    userAnswers,
    timeRemaining,
    isTestActive,
    startTest,
    nextQuestion,
    previousQuestion,
    answerQuestion,
    submitTest,
    setTimeRemaining,
    endTest
  } = useTest();

  const [showResults, setShowResults] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isTestActive && !currentTest) {
      // Test not started yet
      return;
    }

    if (isTestActive && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (timeRemaining === 0 && isTestActive) {
      // Time's up, auto-submit
      handleSubmitTest();
    }
  }, [timeRemaining, isTestActive]);

  const handleStartTest = () => {
    startTest(30); // 30 minutes test
  };

  const handleSubmitTest = () => {
    const result = submitTest();
    setTestResult(result);
    setShowResults(true);
    setShowSubmitDialog(false);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getAnsweredQuestionsCount = () => {
    return userAnswers.filter(answer => answer !== -1).length;
  };

  // Test not started
  if (!isTestActive && !currentTest) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                RRB NTPC Mock Test
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Test your preparation with our comprehensive mock test. The test contains 10 questions 
                and you'll have 30 minutes to complete it.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Questions</h3>
                  <p className="text-2xl font-bold text-blue-600">10</p>
                </div>
                <div className="bg-teal-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-teal-900 mb-2">Duration</h3>
                  <p className="text-2xl font-bold text-teal-600">30 mins</p>
                </div>
                <div className="bg-orange-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-orange-900 mb-2">Marks</h3>
                  <p className="text-2xl font-bold text-orange-600">10</p>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8">
                <div className="flex items-center space-x-2 text-amber-800">
                  <AlertTriangle className="h-5 w-5" />
                  <span className="font-medium">Important Instructions</span>
                </div>
                <ul className="mt-3 text-sm text-amber-700 space-y-1 text-left">
                  <li>• Read each question carefully before selecting your answer</li>
                  <li>• You can navigate between questions using the navigation buttons</li>
                  <li>• Make sure to submit your test before time runs out</li>
                  <li>• Your progress will be automatically saved</li>
                </ul>
              </div>

              <button
                onClick={handleStartTest}
                className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Start Test
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show results
  if (showResults && testResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Test Completed!
              </h1>
              <p className="text-lg text-gray-600">
                Here are your results
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-green-50 p-6 rounded-lg text-center">
                <h3 className="font-semibold text-green-900 mb-2">Score</h3>
                <p className="text-3xl font-bold text-green-600">
                  {testResult.score}/{testResult.totalQuestions}
                </p>
                <p className="text-sm text-green-700">
                  {Math.round((testResult.score / testResult.totalQuestions) * 100)}%
                </p>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg text-center">
                <h3 className="font-semibold text-blue-900 mb-2">Correct</h3>
                <p className="text-3xl font-bold text-blue-600">{testResult.score}</p>
              </div>
              <div className="bg-red-50 p-6 rounded-lg text-center">
                <h3 className="font-semibold text-red-900 mb-2">Incorrect</h3>
                <p className="text-3xl font-bold text-red-600">
                  {testResult.totalQuestions - testResult.score}
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg text-center">
                <h3 className="font-semibold text-gray-900 mb-2">Time Taken</h3>
                <p className="text-3xl font-bold text-gray-600">
                  {Math.floor(testResult.timeTaken / 60)}m
                </p>
              </div>
            </div>

            {/* Category-wise performance */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Category-wise Performance</h3>
              <div className="space-y-3">
                {Object.entries(testResult.categoryWiseScore).map(([category, score]: [string, any]) => (
                  <div key={category} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-900">{category}</span>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-600">
                        {score.correct}/{score.total}
                      </span>
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(score.correct / score.total) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-12">
                        {Math.round((score.correct / score.total) * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={() => navigate('/analytics')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                View Detailed Analytics
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Take Another Test
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Active test
  if (!currentTest) return null;

  const currentQuestion = currentTest[currentQuestionIndex];
  const answeredCount = getAnsweredQuestionsCount();

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">RRB NTPC Mock Test</h1>
              <p className="text-sm text-gray-600">
                Question {currentQuestionIndex + 1} of {currentTest.length}
              </p>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <p className="text-sm text-gray-600">Answered</p>
                <p className="text-lg font-bold text-green-600">
                  {answeredCount}/{currentTest.length}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Time Remaining</p>
                <p className={`text-lg font-bold ${timeRemaining < 300 ? 'text-red-600' : 'text-blue-600'}`}>
                  {formatTime(timeRemaining)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question Panel */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {currentQuestion.category}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    currentQuestion.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                    currentQuestion.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {currentQuestion.difficulty}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 leading-relaxed">
                  {currentQuestion.question}
                </h2>
              </div>

              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <label
                    key={index}
                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      userAnswers[currentQuestionIndex] === index
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="answer"
                      value={index}
                      checked={userAnswers[currentQuestionIndex] === index}
                      onChange={() => answerQuestion(index)}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                      userAnswers[currentQuestionIndex] === index
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {userAnswers[currentQuestionIndex] === index && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <span className="text-gray-900">{option}</span>
                  </label>
                ))}
              </div>

              <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={previousQuestion}
                  disabled={currentQuestionIndex === 0}
                  className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="h-5 w-5 mr-1" />
                  Previous
                </button>

                <div className="flex space-x-3">
                  {currentQuestionIndex === currentTest.length - 1 ? (
                    <button
                      onClick={() => setShowSubmitDialog(true)}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      Submit Test
                    </button>
                  ) : (
                    <button
                      onClick={nextQuestion}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Next
                      <ChevronRight className="h-5 w-5 ml-1" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Question Navigation</h3>
              <div className="grid grid-cols-5 gap-2 mb-6">
                {currentTest.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      const diff = index - currentQuestionIndex;
                      if (diff > 0) {
                        for (let i = 0; i < diff; i++) nextQuestion();
                      } else if (diff < 0) {
                        for (let i = 0; i < Math.abs(diff); i++) previousQuestion();
                      }
                    }}
                    className={`w-10 h-10 rounded-lg border-2 text-sm font-medium transition-all ${
                      index === currentQuestionIndex
                        ? 'border-blue-500 bg-blue-500 text-white'
                        : userAnswers[index] !== -1
                        ? 'border-green-500 bg-green-500 text-white'
                        : 'border-gray-300 text-gray-600 hover:border-gray-400'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span className="text-gray-600">Answered</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span className="text-gray-600">Current</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-gray-300 rounded"></div>
                  <span className="text-gray-600">Not answered</span>
                </div>
              </div>

              <button
                onClick={() => setShowSubmitDialog(true)}
                className="w-full mt-6 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
              >
                Submit Test
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Dialog */}
      {showSubmitDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Submit Test</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to submit your test? You have answered {answeredCount} out of {currentTest.length} questions.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowSubmitDialog(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitTest}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamConduct;