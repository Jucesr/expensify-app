import React from 'react';
import ReactDom from 'react-dom';
import ExpenseList from './ExpenseList';
import ExpenseListFilters from './ExpenseListFilters';
import ExpenseSumary from './ExpenseSumary';

const ExpenseDashBoardPage = () => (
  <div>
    <ExpenseSumary/>
    <ExpenseListFilters/>
    <ExpenseList/>
  </div>
);

export default ExpenseDashBoardPage;
