import React from 'react';
import {connect} from 'react-redux';
import selectExpenses from '../selectors/expenses';
import getExpensesTotal from '../selectors/expenses-total';
import numeral from 'numeral';

export const ExpenseSumary = (props) => (
  <div>
    {`Viewing ${props.expenseCount} ${props.expenseCount <= 1 ? 'expense': 'expenses'} totalling ${numeral(props.expensesTotal / 100).format('$0,0.00')}.`}
  </div>
);

const mapStateToProps = (state) => {
  const expenses = selectExpenses(state.expenses, state.filters);
  return {
    expensesTotal: getExpensesTotal(expenses),
    expenseCount: expenses.length
  };
};

export default connect(mapStateToProps)(ExpenseSumary);
