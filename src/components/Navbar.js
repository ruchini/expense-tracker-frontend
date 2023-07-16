import React from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
    textDecoration: 'none',
    color: 'black',
    '&:hover': {
        color: '#8000ff',
    },
  },
  link: {
    marginLeft: theme.spacing(2),
    textDecoration: 'none',
    color: 'black',
    '&:hover': {
        color: '#8000ff',
    },
  },
}));

const Navbar = () => {
  const classes = useStyles();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component={Link} to="/" className={classes.title}>
          Expense Tracker
        </Typography>
        <Typography variant="h6" component={Link} to="/dashboard" className={classes.link}>
          Dashboard
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
