import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function History() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPredictions();
  }, []);

  const fetchPredictions = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/predictions/history');
      setPredictions(response.data);
    } catch (err) {
      setError('Failed to fetch prediction history.');
      console.error('History fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Low':
        return 'text-green-600';
      case 'Medium':
        return 'text-yellow-600';
      case 'High':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const chartData = {
    labels: predictions.map(p => new Date(p.created_at).toLocaleDateString()),
    datasets: [
      {
        label: 'Default Probability',
        data: predictions.map(p => p.default_probability * 100),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Default Probability Trend'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: 'Probability (%)'
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Loading prediction history...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Prediction History</h1>

      {predictions.length > 0 ? (
        <>
          <div className="bg-white shadow rounded-lg p-6 mb-8">
            <Line data={chartData} options={chartOptions} />
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {predictions.map((prediction) => (
                <li key={prediction.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-indigo-600 truncate">
                          Loan Amount: ${prediction.loan_amount.toLocaleString()}
                        </p>
                        <p className="mt-2 flex items-center text-sm text-gray-500">
                          <span>Credit Score: {prediction.credit_score}</span>
                          <span className="mx-2">•</span>
                          <span>Annual Income: ${prediction.annual_income.toLocaleString()}</span>
                        </p>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            Default Probability: {(prediction.default_probability * 100).toFixed(2)}%
                          </p>
                          <p className={`text-sm font-medium ${getRiskColor(prediction.risk_classification)}`}>
                            Risk: {prediction.risk_classification}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          Purpose: {prediction.purpose.replace('_', ' ')}
                        </p>
                        <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                          Term: {prediction.term}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <p>
                          {new Date(prediction.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <h3 className="mt-2 text-sm font-medium text-gray-900">No predictions</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by making your first loan prediction.
          </p>
        </div>
      )}
    </div>
  );
}

export default History; 