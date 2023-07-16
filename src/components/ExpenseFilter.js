import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { LocalizationProvider, DatePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns'; 
// import '@mui/lab/DatePicker/style.css';


const ExpenseFilter = ({ onFilter }) => {
  const [dateRange, setDateRange] = useState(null);
  const [expenseType, setExpenseType] = useState('');

  const handleFilter = (event) => {
    event.preventDefault();
    onFilter(dateRange, expenseType);
  };

  return (
    <div>
      <h2>Expense Filter</h2>
      <form onSubmit={handleFilter}>
        <LocalizationProvider dateAdapter={AdapterDateFns}> {/* Provide the AdapterDateFns */}
          <DatePicker
            label="Date Range"
            value={dateRange}
            onChange={(newValue) => setDateRange(newValue)}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
        <TextField
          label="Expense Type"
          value={expenseType}
          onChange={(event) => setExpenseType(event.target.value)}
        />
        <Button variant="contained" type="submit">
          Filter
        </Button>
      </form>
    </div>
  );
};

export default ExpenseFilter;
