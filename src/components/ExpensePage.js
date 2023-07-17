import React, { useState, useEffect } from 'react';
import ExpenseList from './ExpenseList';
import axios from 'axios';
import { API_CREATE_EXPENSE, API_GET_EXPENSES } from '../api';
import { ErrorPopup } from '../UI/ErrorPopup';
import ExpenseForm from './ExpenseForm';
import Alert from '@mui/material/Alert';

const ExpensePage = () => {
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isAlertVisible, setIsAlertVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(API_GET_EXPENSES);
        const { data } = response.data;
        setExpenses(data);
      } catch (error) {
        console.error('Error fetching expenses:', error);
        setError('An error occurred while fetching expenses.');
      }
    };

    fetchData();
  }, []);

  const handleAddExpense = async (expenseData) => {
    try {
      await axios.post(API_CREATE_EXPENSE, expenseData);

      // Fetch updated expenses
      const response = await axios.get(API_GET_EXPENSES);
      const { data } = response.data;
      setExpenses(data);
      setIsFormOpen(false);
      setIsAlertVisible(true);
      setSuccessMessage('Expense added successfully');
      setError('');
      
      // Hide the alert message after 3 seconds
      setTimeout(() => {
        setIsAlertVisible(false);
      }, 3000);

    } catch (error) {
      console.error('Error adding expense:', error);
      setSuccessMessage('');
      setError('An error occurred while adding the expense.');
    }
  };

  const toggleForm = () => {
    setIsFormOpen((prevState) => !prevState);
  };

  return (
    <div>
      <button onClick={toggleForm}>Add Expenses</button>
      {isFormOpen && <ExpenseForm  open={isFormOpen} onClose={toggleForm} onAddExpense={handleAddExpense} />}
      <ExpenseList expenses={expenses} setExpenses={setExpenses}/>
      {error && <ErrorPopup message={error} onClose={() => setError(null)} />}
      {isAlertVisible && successMessage && (
        <Alert severity="success" onClose={() => setSuccessMessage(false)}>
          {successMessage}
        </Alert>
      )}
    </div>
  );
};

export default ExpensePage;
