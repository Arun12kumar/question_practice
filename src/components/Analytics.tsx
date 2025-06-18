import React, { useEffect, useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Target, 
  Award, 
  Calendar,
  BookOpen,
  CheckCircle
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

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

const Analytics: React.FC = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load test results from localStorage
    const results = JSON.parse(localStorage.getItem('testResults') || '[]');
    setTestResults(results);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (testResults.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <BarChart3 className="h-8 w-8 text-gray-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">No Test Data Available</h1>
            <p className="text-lg text-gray-600 mb-8">
              Take your first practice test to see detailed analytics and performance insights.
            </p>
            <a
              href="/exam"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <BookOpen className="h-5 w-5 mr-2" />
              Start Your First Test
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Calculate overall statistics
  const totalTests = testResults.length;
  const totalQuestions = testResults.reduce((sum, result) => sum + result.totalQuestions, 0);
  const totalCorrect = testResults.reduce((sum, result) => sum + result.score, 0);
  const averageScore = totalCorrect / totalTests;
  const averagePercentage = (totalCorrect / totalQuestions) * 100;
  const averageTime = testResults.reduce((sum, result) => sum + result.timeTaken, 0) / totalTests;

  // Get category-wise performance
  const categoryPerformance: { [key: string]: { correct: number; total: number } } = {};
  testResults.forEach(result => {
    Object.entries(result.categoryWiseScore).forEach(([category, score]) => {
      if (!categoryPerformance[category]) {
        categoryPerformance[category] = { correct: 0, total: 0 };
      }
      categoryPerformance[category].correct += score.correct;
      categoryPerformance[category].total += score.total;
    });
  });

  // Prepare chart data
  const categoryChartData = {
    labels: Object.keys(categoryPerformance),
    datasets: [
      {
        label: 'Correct Answers',
        data: Object.values(categoryPerformance).map(cat => cat.correct),
        backgroundColor: 'rgba(37, 99, 235, 0.8)',
        borderColor: 'rgba(37, 99, 235, 1)',
        borderWidth: 1,
      },
      {
        label: 'Total Questions',
        data: Object.values(categoryPerformance).map(cat => cat.total),
        backgroundColor: 'rgba(156, 163, 175, 0.8)',
        borderColor: 'rgba(156, 163, 175, 1)',
        borderWidth: 1,
      },
    ],
  };

  const performanceChartData = {
    labels: ['Correct', 'Incorrect'],
    datasets: [
      {
        data: [totalCorrect, totalQuestions - totalCorrect],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Performance Analytics</h1>
          <p className="text-lg text-gray-600">
            Track your progress and identify areas for improvement
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tests Taken</p>
                <p className="text-2xl font-bold text-gray-900">{totalTests}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Average Score</p>
                <p className="text-2xl font-bold text-gray-900">
                  {averageScore.toFixed(1)}/{testResults[0]?.totalQuestions || 10}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Award className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-gray-900">{averagePercentage.toFixed(1)}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg. Time</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.floor(averageTime / 60)}m {averageTime % 60}s
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Category-wise Performance</h3>
            <Bar data={categoryChartData} options={chartOptions} />
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Overall Performance</h3>
            <div className="flex justify-center">
              <div className="w-64 h-64">
                <Doughnut 
                  data={performanceChartData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Category Performance Details */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 mb-8">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900">Detailed Category Analysis</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {Object.entries(categoryPerformance).map(([category, performance]) => {
                const percentage = (performance.correct / performance.total) * 100;
                return (
                  <div key={category} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{category}</h4>
                        <p className="text-sm text-gray-600">
                          {performance.correct} correct out of {performance.total} questions
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-32 bg-gray-200 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full ${
                            percentage >= 80 ? 'bg-green-500' :
                            percentage >= 60 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-lg font-semibold text-gray-900 w-16">
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent Tests */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900">Recent Test History</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {testResults.slice(0, 5).map((result, index) => (
                <div key={result.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Mock Test - {new Date(result.timestamp).toLocaleDateString()}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {Math.floor(result.timeTaken / 60)} minutes {result.timeTaken % 60} seconds
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {result.score}/{result.totalQuestions}
                      </p>
                      <p className="text-sm text-gray-600">
                        {Math.round((result.score / result.totalQuestions) * 100)}%
                      </p>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${
                      (result.score / result.totalQuestions) >= 0.8 ? 'bg-green-500' :
                      (result.score / result.totalQuestions) >= 0.6 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;