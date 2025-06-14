import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function PredictionForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    loan_amount: '',
    annual_income: '',
    credit_score: '',
    employment_length: '',
    debt_to_income_ratio: '',
    home_ownership: 'RENT',
    purpose: 'DEBT_CONSOLIDATION',
    interest_rate: '',
    term: '36 months'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [prediction, setPrediction] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setPrediction(null);

    try {
      const response = await axios.post('http://localhost:8000/api/predictions/predict', formData);
      setPrediction(response.data);
    } catch (err) {
      setError('Failed to make prediction. Please try again.');
      console.error('Prediction error:', err);
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

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">New Loan Prediction</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="loan_amount" className="block text-sm font-medium text-gray-700">
              Loan Amount ($)
            </label>
            <input
              type="number"
              name="loan_amount"
              id="loan_amount"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={formData.loan_amount}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="annual_income" className="block text-sm font-medium text-gray-700">
              Annual Income ($)
            </label>
            <input
              type="number"
              name="annual_income"
              id="annual_income"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={formData.annual_income}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="credit_score" className="block text-sm font-medium text-gray-700">
              Credit Score
            </label>
            <input
              type="number"
              name="credit_score"
              id="credit_score"
              required
              min="300"
              max="850"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={formData.credit_score}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="employment_length" className="block text-sm font-medium text-gray-700">
              Employment Length (years)
            </label>
            <input
              type="number"
              name="employment_length"
              id="employment_length"
              required
              min="0"
              max="50"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={formData.employment_length}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="home_ownership" className="block text-sm font-medium text-gray-700">
              Home Ownership
            </label>
            <select
              name="home_ownership"
              id="home_ownership"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={formData.home_ownership}
              onChange={handleChange}
            >
              <option value="RENT">Rent</option>
              <option value="MORTGAGE">Mortgage</option>
              <option value="OWN">Own</option>
            </select>
          </div>

          <div>
            <label htmlFor="purpose" className="block text-sm font-medium text-gray-700">
              Loan Purpose
            </label>
            <select
              name="purpose"
              id="purpose"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={formData.purpose}
              onChange={handleChange}
            >
              <option value="DEBT_CONSOLIDATION">Debt Consolidation</option>
              <option value="CREDIT_CARD">Credit Card</option>
              <option value="HOME_IMPROVEMENT">Home Improvement</option>
              <option value="MAJOR_PURCHASE">Major Purchase</option>
              <option value="SMALL_BUSINESS">Small Business</option>
            </select>
          </div>

          <div>
            <label htmlFor="interest_rate" className="block text-sm font-medium text-gray-700">
              Interest Rate (%)
            </label>
            <input
              type="number"
              name="interest_rate"
              id="interest_rate"
              required
              min="0"
              max="100"
              step="0.01"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={formData.interest_rate}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="term" className="block text-sm font-medium text-gray-700">
              Loan Term
            </label>
            <select
              name="term"
              id="term"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={formData.term}
              onChange={handleChange}
            >
              <option value="36 months">36 months</option>
              <option value="60 months">60 months</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {loading ? 'Processing...' : 'Make Prediction'}
          </button>
        </div>
      </form>

      {prediction && (
        <div className="mt-8 bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Prediction Results</h3>
            <div className="mt-5">
              <div className="rounded-md bg-gray-50 px-4 py-5 sm:p-6">
                <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Default Probability</dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">
                      {(prediction.default_probability * 100).toFixed(2)}%
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Risk Classification</dt>
                    <dd className={`mt-1 text-3xl font-semibold ${getRiskColor(prediction.risk_classification)}`}>
                      {prediction.risk_classification}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PredictionForm; 