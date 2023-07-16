import React, { useState, useEffect } from 'react';
import ExpenseList from './ExpenseList';
import ExpenseFilter from './ExpenseFilter';
import axios from 'axios';
import { API_CREATE_EXPENSE, API_UPDATE_EXPENSE, API_DELETE_EXPENSE, API_GET_EXPENSES } from '../api';
import { ErrorPopup } from '../UI/ErrorPopup';

const ExpensePage = () => {
    const [expenses, setExpenses] = useState([]);
    const [error, setError] = useState(null);

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

    const handleFilter = (dateRange, expenseType) => {
        // Perform filtering based on the selected criteria
        // and update the expenses state
        // ...
    };

    return (
        <div>
        {/* <ExpenseFilter onFilter={handleFilter} /> */}
        <ExpenseList expenses={expenses} />
        {error && <ErrorPopup message={error} onClose={() => setError(null)} />}
        </div>
    );
};

export default ExpensePage;
