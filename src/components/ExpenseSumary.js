import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import numeral from 'numeral';
import selectExpenses from '../selectors/expenses';
import getExpensesTotal from '../selectors/expenses-total';


export const ExpenseSumary = (props) => (
  <div className="page-header">
    <div className="content-container">
      <h1 className="page-header__title">Viewing <span>{props.expenseCount}</span> {props.expenseCount <= 1 ? 'expense': 'expenses'} totalling <span>{numeral(props.expensesTotal / 100).format('$0,0.00')}</span>.</h1>
      <div className="page-header__actions">
        <Link className="button" to="/create">Add Expense</Link>
      </div>
    </div>
  </div>
);

const mapStateToProps = (state) => {
  const expenses = selectExpenses(state.expenses.present, state.filters);
  return {
    expensesTotal: getExpensesTotal(expenses),
    expenseCount: expenses.length
  };
};

export default connect(mapStateToProps)(ExpenseSumary);
