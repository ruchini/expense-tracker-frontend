import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Alert from '@mui/material/Alert';
import axios from 'axios';
import { API_UPDATE_EXPENSE, API_DELETE_EXPENSE, API_GET_EXPENSES } from '../api';
import ExpenseColumns from './ExpenseColumns';
import ExpenseForm from './ExpenseForm';

const ExpenseList = ({ expenses, setExpenses }) => {
  const [dateFilter, setDateFilter] = useState(null);
  const [amountFilter, setAmountFilter] = useState(null);
  const [amountOperator, setAmountOperator] = useState('=');
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [deleteError, setDeleteError] = useState(false);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [editedRow, setEditedRow] = useState(null);
  const [isFormOpen, setFormOpen] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSave = async (params) => {
    const { id, _id, field, value } = params;
    console.log(params);
    const updatedExpenses = expenses.map((expense) => {
      if (expense.id === id) {
        return { ...expense, [field]: value };
      }
      return expense;
    });
    setExpenses(updatedExpenses);
    try {
      await axios.put(`${API_UPDATE_EXPENSE}/${_id}`, params);
      console.log('Expense updated successfully');
      setEditedRow(null); // Reset edited row after saving
      
      // Fetch updated expenses
      const response = await axios.get(API_GET_EXPENSES);
      const { data } = response.data;
      setExpenses(data);
      setFormOpen(false);
      setSuccessMessage('Expense updated successfully');
      setIsAlertVisible(true);

      // Hide the alert message after 3 seconds
      setTimeout(() => {
        setIsAlertVisible(false);
      }, 3000);
    } catch (error) {
      console.error('Error updating expense:', error);
    }
  };

  const handleEdit = (expense) => {
    setExpenseToEdit(expense);
    setFormOpen(true);
  };

  const handleDelete = async (expenseId) => {
    try {
      await axios.delete(`${API_DELETE_EXPENSE}/${expenseId}`);
  
      // Fetch updated expenses
      const response = await axios.get(API_GET_EXPENSES);
      const { data } = response.data;
      setExpenses(data);
      setDeleteSuccess(true);
      setDeleteError(false);
      setIsAlertVisible(true);

      // Hide the alert message after 3 seconds
      setTimeout(() => {
        setIsAlertVisible(false);
      }, 3000);

    } catch (error) {
      console.error('Error deleting expense:', error);
      setDeleteError(true);
      setDeleteSuccess(false);
      setIsAlertVisible(true);

      // Hide the alert message after 3 seconds
      setTimeout(() => {
        setIsAlertVisible(false);
      }, 3000);
    }
  };

  const applyFilters = () => {
    const filteredRows = expenses.filter((expense) => {
      let passesDateFilter = true;
      let passesAmountFilter = true;
  
      if (dateFilter) {
        const expenseDate = new Date(expense.date);
        passesDateFilter = expenseDate.toDateString() === dateFilter.toDateString();
      }
  
      if (amountFilter) {
        switch (amountOperator) {
          case '=':
            passesAmountFilter = expense.amount === parseFloat(amountFilter);
            break;
          case '>':
            passesAmountFilter = expense.amount > parseFloat(amountFilter);
            break;
          case '<':
            passesAmountFilter = expense.amount < parseFloat(amountFilter);
            break;
          default:
            passesAmountFilter = true;
        }
      }
  
      return passesDateFilter && passesAmountFilter;
    });
  
    return filteredRows;
  };
  
  const filteredRows = applyFilters();

  return (
    <div style={{ height: 400, width: '100%' }}>
      {isAlertVisible && deleteSuccess && (
        <Alert severity="success" onClose={() => setDeleteSuccess(false)}>
          Expense deleted successfully.
        </Alert>
      )}
      {isAlertVisible && deleteError && (
        <Alert severity="error" onClose={() => setDeleteError(false)}>
          An error occurred while deleting the expense.
        </Alert>
      )}
      {isAlertVisible && successMessage && (
        <Alert severity="success" onClose={() => setSuccessMessage(false)}>
          {successMessage}
        </Alert>
      )}
      {/* Render the ExpenseForm */}
      {isFormOpen && (
        <ExpenseForm
          open={isFormOpen}
          onClose={() => setFormOpen(false)}
          onAddExpense={handleSave}
          expenseToEdit={expenseToEdit}
        />
      )}
      <DataGrid
        rows={filteredRows}
        columns={ExpenseColumns({ handleEdit, handleDelete })}
      />
    </div>
  );
};

export default ExpenseList;
