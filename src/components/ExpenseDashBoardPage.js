import React from 'react';
import ExpenseList from './ExpenseList';
import ExpenseListFilters from './ExpenseListFilters';
import ExpenseSumary from './ExpenseSumary';
import UndoRedo from './UndoRedo';

const ExpenseDashBoardPage = () => (
  <div>
    <ExpenseSumary/>
    <ExpenseListFilters/>
    <ExpenseList/>
  </div>
);

export default ExpenseDashBoardPage;
