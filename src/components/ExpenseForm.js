import React, { useEffect, useState } from 'react';
import { Typography, TextField, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import Modal from '../UI/Modal';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';

const ExpenseForm = ({ open, onClose, onAddExpense, expenseToEdit }) => {
  const currentDate = new Date(); // Get the current date
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(currentDate); // Set the default date

  useEffect(() => {
    if (expenseToEdit) {
      // Update the form input values with the existing expense data
      setDescription(expenseToEdit.description);
      setType(expenseToEdit.type);
      setAmount(expenseToEdit.amount.toString());
      setDate(new Date(expenseToEdit.date)); 
    }
  }, [expenseToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form inputs
    if (description.trim() === '' || type.trim() === '' || amount.trim() === '') {
      return; // Prevent submitting if any field is empty
    }

    // Create expense object
    const expenseData = {
      description: description,
      type: type,
      amount: parseFloat(amount),
      date: date,
    };

    // Call the parent component's callback function to add or update the expense
    if (expenseToEdit) {
        expenseData._id = expenseToEdit._id;
        console.log(expenseData);
        onAddExpense(expenseData);
    } else {
        onAddExpense(expenseData);
    }

    // Reset form inputs
    setDescription('');
    setType('');
    setAmount('');
    setDate(null);
  };

  const handleClose = () => {
    onClose();
    setDescription('');
    setType('');
    setAmount('');
    setDate(null);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div style={{ padding: '20px' }}>
        <Typography variant="h5" gutterBottom>
          {expenseToEdit ? 'Edit Expense' : 'Add Expense'}
        </Typography>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            style={{ marginBottom: '10px' }}
          />
          <FormControl style={{ marginBottom: '10px' }}>
            <InputLabel>Type</InputLabel>
            <Select
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
              variant="outlined"
              label="Type"
            >
              <MenuItem value="Travel">Travel</MenuItem>
              <MenuItem value="Food">Food</MenuItem>
              <MenuItem value="Rent">Rent</MenuItem>
              <MenuItem value="Utilities">Utilities</MenuItem>
              <MenuItem value="Movies">Movies</MenuItem>
              <MenuItem value="Entertainments">Entertainments</MenuItem>
              <MenuItem value="Donations">Donations</MenuItem>
              <MenuItem value="Charity">Charity Services</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Amount (LKR)"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            style={{ marginBottom: '10px' }}
          />
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Date"
              value={date}
              onChange={(newValue) => setDate(newValue)}
              renderInput={(params) => (
                <TextField
                  label="Date"
                  {...params}
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  style={{ marginBottom: '10px' }}
                />
              )}
            />
          </LocalizationProvider>
          <Button type="submit" variant="contained" color="primary" style={{ marginTop: '10px' }}>
            {expenseToEdit ? 'Update Expense' : 'Add Expense'}
          </Button>
          <Button onClick={handleClose} variant="outlined" color="primary" style={{ marginTop: '10px' }}>
            Close
          </Button>
        </form>
      </div>
    </Modal>
  );
};

export default ExpenseForm;
