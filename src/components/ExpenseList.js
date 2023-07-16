import React, { useState } from 'react';
import { DataGrid, GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import { DatePicker } from '@mui/lab';
import TextField from '@mui/material/TextField';

const ExpenseList = ({ expenses }) => {
  const [dateFilter, setDateFilter] = useState(null);
  const [amountFilter, setAmountFilter] = useState(null);
  const [amountOperator, setAmountOperator] = useState('=');

  const columns = [
    { field: 'description', headerName: 'Description', filterable: false, width: 200 },
    { field: 'type', headerName: 'Type', width: 150 },
    {
      field: 'amount',
      headerName: 'Amount',
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
        <DatePicker
          value={dateFilter}
          onChange={(newValue) => setDateFilter(newValue)}
          renderInput={(params) => <TextField {...params} />}
        />
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
  ];

  const applyFilters = () => {
    // Filter the rows manually based on the selected filters
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
  
  const CustomFilterToolbar = () => (
    <GridToolbarContainer>
      <div style={{ marginLeft: 'auto' }}>
        <DatePicker
          value={dateFilter}
          onChange={(newValue) => setDateFilter(newValue)}
          renderInput={(params) => <TextField {...params} />}
          clearable
        />
      </div>
      <GridToolbarExport />
    </GridToolbarContainer>
  );

  const filteredRows = applyFilters();

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={filteredRows}
        columns={columns}
        components={{ Toolbar: CustomFilterToolbar }}
      />
    </div>
  );
};

export default ExpenseList;
