import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import axios from 'axios';
import { API_GET_EXPENSES } from '../api';
import { Chart, ArcElement } from 'chart.js';
Chart.register(ArcElement);

const Dashboard = () => {
  const [chartData, setChartData] = useState(null);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(API_GET_EXPENSES);
      const { data } = response.data;

      if (data && data.length > 0) {
        const categoryExpenses = {};

        data.forEach((item) => {
          if (categoryExpenses[item.type]) {
            categoryExpenses[item.type] += item.amount;
          } else {
            categoryExpenses[item.type] = item.amount;
          }
        });

        const labels = Object.keys(categoryExpenses);
        const amounts = Object.values(categoryExpenses);

        const maxAmount = 10000.0; // Maximum amount set to 10,000.00 LKR

        // Generate colors dynamically
        const backgroundColors = generateColors(labels.length, maxAmount, amounts);

        const chartData = {
          labels: labels,
          datasets: [
            {
              data: amounts,
              backgroundColor: backgroundColors,
              hoverBackgroundColor: backgroundColors,
            },
          ],
        };

        setChartData(chartData);

        const tableData = labels.map((label, index) => {
          const amount = amounts[index];
          const percentage = ((amount / maxAmount) * 100).toFixed(2);
          const color = percentage > 90 ? 'red' : backgroundColors[index];

          return {
            label: label,
            amount: amount,
            percentage: percentage,
            color: color,
          };
        });

        setTableData(tableData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const generateColors = (count, maxAmount, amounts) => {
    const colors = [];
    const maxPercentage = (maxAmount / maxAmount) * 100;
    for (let i = 0; i < count; i++) {
      const percentage = ((amounts[i] / maxAmount) * 100).toFixed(2);
      colors.push(percentage > 90 ? 'red' : `#${Math.floor(Math.random() * 16777215).toString(16)}`);
    }
    return colors;
  };

  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.parsed || 0;
            const dataset = context.dataset.data || [];
            const total = dataset.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
            const percentage = total > 0 ? ((value / total) * 100).toFixed(2) + '%' : '0%';

            return `${label}: ${percentage}`;
          },
        },
      },
    },
  };

  const legendOptions = {
    display: true,
    position: 'bottom',
    labels: {
      font: {
        size: 14,
      },
    },
  };

  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%',
    height: '50vh',
    maxWidth: '50%',
  };

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: '50%', paddingRight: '20px' }}>
        <Typography variant="h5" gutterBottom>
          Expense Dashboard
        </Typography>
        <div style={containerStyle}>
          {chartData ? (
            <Pie data={chartData} options={options} plugins={[legendOptions]} />
          ) : (
            'Loading...'
          )}
        </div>
      </div>
      <div style={{ width: '50%' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Percentage</TableCell>
                <TableCell>Color</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData.map((item) => (
                <TableRow key={item.label}>
                  <TableCell>{item.label}</TableCell>
                  <TableCell>{item.amount}</TableCell>
                  <TableCell style={{ color: item.color }}>
                    {item.percentage}% {item.color === 'red' && ' (Exceeds 90%)'}
                  </TableCell>
                  <TableCell>
                    <div
                      style={{
                        backgroundColor: item.color,
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                      }}
                    ></div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default Dashboard;
