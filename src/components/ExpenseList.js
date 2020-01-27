import React from 'react';
import {connect} from 'react-redux';
import ExpenseListItem from './ExpenseListItem';
import selectExpenses from '../selectors/expenses'

export const ExpenseList = ({expenses, dictionary, locale}) => (
  <div className="content-container">
    <div className="list-header">
      <div >{dictionary.tableExpense}</div>
      <div >{dictionary.tableAmount}</div>
    </div>
    <div className="list-body">
      {
        expenses.length == 0 ? (
          <div className="list-item-message">
            <span>{dictionary.noExpenseMessage}</span>
          </div>
        ) : (
          expenses.map( (expense) => {
            return <ExpenseListItem key={expense.id} dictonary={dictionary} {...expense} locale={locale} />
          })
        )
      }
    </div>
  </div>
);

const mapStateToProps = (state) => {
  return {
    expenses: selectExpenses(state.expenses.present, state.filters),
    dictionary: state.lang.dictionary,
    locale: state.lang.locale,
  };
};

export default connect(mapStateToProps)(ExpenseList);
