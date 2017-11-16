import React from 'react';
import ReactDom from 'react-dom';
import ExpenseList from './ExpenseList';
import ExpenseListFilters from './ExpenseListFilters';

const ExpenseDashBoardPage = () => (
  <div>
    <ExpenseListFilters/>
    <ExpenseList/>
  </div>
);

export default ExpenseDashBoardPage;
