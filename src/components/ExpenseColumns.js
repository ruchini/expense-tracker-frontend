import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';

const ExpenseColumns = ({ handleEdit, handleDelete }) => {
    const [dateFilter, setDateFilter] = useState(null);
    const [amountFilter, setAmountFilter] = useState(null);
    const [amountOperator, setAmountOperator] = useState('=');
    
    const renderCell = (params) => (
        <div>
            <EditIcon onClick={() => handleEdit(params.row)} />
        </div>
    );
    return [
        { field: 'description', headerName: 'Description', width: 200 },
        { field: 'type', headerName: 'Type', width: 150 },
        {
        field: 'amount',
        headerName: 'Amount (LKR)',
        width: 150,
        filterable: true, // Enable filtering for the amount column
        renderCell: (params) => params.value, // Display the amount as is
        renderFilterCell: (params) => (
            <div>
            <TextField
                value={amountFilter}
                onChange={(event) => setAmountFilter(event.target.value)}
                type="number"
                variant="outlined"
            />
            <TextField
                select
                value={amountOperator}
                onChange={(event) => setAmountOperator(event.target.value)}
                variant="outlined"
                style={{ marginLeft: 8, width: 120 }}
            >
                <option value="=">Equals</option>
                <option value=">">Greater Than</option>
                <option value="<">Less Than</option>
            </TextField>
            </div>
        ),
        valueGetter: (params) => parseFloat(params.value), // Transform the amount value into a number
        filterOperators: [
            {
            label: 'Equals',
            value: '=',
            getApplyFilterFn: (filterValue, field) => {
                return (params) => parseFloat(params[field]) === parseFloat(filterValue);
            },
            },
            {
            label: 'Greater Than',
            value: '>',
            getApplyFilterFn: (filterValue, field) => {
                return (params) => parseFloat(params[field]) > parseFloat(filterValue);
            },
            },
            {
            label: 'Less Than',
            value: '<',
            getApplyFilterFn: (filterValue, field) => {
                return (params) => parseFloat(params[field]) < parseFloat(filterValue);
            },
            },
        ],
        },
        {
        field: 'date',
        headerName: 'Date',
        width: 200,
        filterable: true, // Enable filtering for the date column
        renderCell: (params) => new Date(params.value).toLocaleDateString(), // Format the date display
        renderFilterCell: (params) => (
            <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
                value={dateFilter}
                onChange={(newValue) => setDateFilter(newValue)}
                renderInput={(params) => <TextField {...params} />}
            />
            </LocalizationProvider>
        ),
        valueGetter: (params) => new Date(params.value), // Transform the date value into a Date object
        filterOperators: [
            {
            label: 'Equals',
            value: '=',
            getApplyFilterFn: (filterValue, field) => {
                return (params) => {
                const expenseDate = new Date(params[field]);
                const filterdate = new Date(filterValue);
                return expenseDate.toDateString() === filterdate.toDateString();
                };
            },
            },
            {
            label: 'After',
            value: '>',
            getApplyFilterFn: (filterValue, field) => {
                return (params) => {
                const expenseDate = new Date(params[field]);
                return expenseDate > filterValue;
                };
            },
            },
            {
            label: 'Before',
            value: '<',
            getApplyFilterFn: (filterValue, field) => {
                return (params) => {
                const expenseDate = new Date(params[field]);
                return expenseDate < filterValue;
                };
            },
            },
        ],
        },
        {
        field: 'id',
        headerName: 'Edit',
        width: 70,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
            <div>
                <EditIcon onClick={() => handleEdit(params.row)} />
            </div>
            ),
        },
        {
        field: '_id',
        headerName: 'Delete',
        width: 70,
        sortable: false,
        filterable: false,
        renderCell: (params) => (
            <div>
            <DeleteIcon onClick={() => handleDelete(params.value)} />
            </div>
        ),
        },
    ];
};

export default ExpenseColumns;
