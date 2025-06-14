# Loan Wise - Credit Risk Assessment Platform

LoanWise is a full-stack web application that enables financial institutions to predict loan default probabilities using machine learning models. The platform provides an intuitive interface for loan officers to input borrower data and receive real-time risk assessments.

## Features

- Real-time loan default probability prediction
- Interactive dashboard with data visualizations
- Secure authentication system
- Historical prediction tracking
- Model explainability using SHAP values
- Export functionality for prediction reports

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Chart.js for visualizations
- Axios for API calls

### Backend
- FastAPI (Python)
- PostgreSQL database
- JWT authentication

### Machine Learning
- scikit-learn
- XGBoost
- SHAP for model explainability
- pandas for data processing

## Project Structure

```
loanwise/
├── frontend/           # React frontend application
├── backend/           # FastAPI backend server
├── ml/               # Machine learning models and data processing
└── docker/           # Docker configuration files
```

## Setup Instructions

1. Clone the repository
2. Set up the backend:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   uvicorn main:app --reload
   ```

3. Set up the frontend:
   ```bash
   cd frontend
   npm install
   npm start
   ```

4. Set up the database:
   ```bash
   # Follow the database setup instructions in backend/README.md
   ```

## Environment Variables

Create a `.env` file in the backend directory with the following variables:
```
DATABASE_URL=postgresql://postgres:postgres@db:5432/loanwise
JWT_SECRET=your_jwt_secret
MODEL_PATH=path_to_your_model
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## License

MIT License 
