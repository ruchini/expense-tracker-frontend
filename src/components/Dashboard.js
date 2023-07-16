import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Typography } from '@material-ui/core';
import axios from 'axios';

const Dashboard = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/data'); // Replace with your backend API endpoint
      const { data } = response.data;
      setChartData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Expense Categories
      </Typography>
      {chartData && <Pie data={chartData} />}
    </div>
  );
};

export default Dashboard;
