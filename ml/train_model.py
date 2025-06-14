import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, roc_auc_score
import joblib
import os

def load_and_preprocess_data(file_path):
    # Load the data
    df = pd.read_csv(file_path)
    
    # Handle missing values
    df = df.fillna(df.mean())
    
    # Feature engineering
    df['debt_to_income_ratio'] = df['annual_inc'] / df['loan_amnt']
    df['employment_length'] = df['emp_length'].str.extract('(\d+)').astype(float)
    
    # Select features for training
    features = [
        'loan_amnt',
        'annual_inc',
        'fico_range_high',
        'employment_length',
        'debt_to_income_ratio'
    ]
    
    X = df[features]
    y = df['loan_status'].map({'Fully Paid': 0, 'Charged Off': 1})
    
    return X, y

def train_model(X, y):
    # Split the data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    # Scale the features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train the model
    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=10,
        random_state=42
    )
    model.fit(X_train_scaled, y_train)
    
    # Evaluate the model
    y_pred = model.predict(X_test_scaled)
    y_pred_proba = model.predict_proba(X_test_scaled)[:, 1]
    
    print("Classification Report:")
    print(classification_report(y_test, y_pred))
    print("\nROC AUC Score:", roc_auc_score(y_test, y_pred_proba))
    
    # Save the model and scaler
    os.makedirs('models', exist_ok=True)
    joblib.dump(model, 'models/xgboost_model.pkl')
    joblib.dump(scaler, 'models/scaler.pkl')
    
    return model, scaler

if __name__ == "__main__":
    # Load and preprocess the data
    X, y = load_and_preprocess_data('data/loan_data.csv')
    
    # Train the model
    model, scaler = train_model(X, y) 