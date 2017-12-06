import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import numeral from 'numeral';
import selectExpenses from '../selectors/expenses';
import getExpensesTotal from '../selectors/expenses-total';

import replaceAll from '../utils/replaceAll';


export const ExpenseSumary = ({expensesTotal, expenseCount, hideExpenses, dictionary}) => (
  <div className="page-header">
    <div className="content-container">
      <h1
        className="page-header__title"
        dangerouslySetInnerHTML={{
        __html: replaceAll(dictionary.summaryMessageTitle, {
            "{p1}": `<span>${expenseCount}</span>`,
            "{p2}": expenseCount != 1 ? 's' : '',
            "{p3}": `<span>${numeral(expensesTotal / 100).format('$0,0.00')}</span>`
      })}}>
      </h1>
      {
        hideExpenses > 1 &&
        <h4 className="page-header__subtitle"
            dangerouslySetInnerHTML={{
              __html: replaceAll(dictionary.summaryMessageSubitle, {
                "{p1}": `<span>${hideExpenses}</span>`,
                "{p2}": hideExpenses != 1 ? 's' : ''
              })
            }}></h4>
      }
      <div className="page-header__actions">
        <Link className="button" to="/create">{dictionary.addExpenseButton}</Link>
      </div>
    </div>
  </div>
);

const mapStateToProps = (state) => {
  const expenses = selectExpenses(state.expenses.present, state.filters);
  return {
    expensesTotal: getExpensesTotal(expenses),
    expenseCount: expenses.length,
    hideExpenses: state.expenses.present.length - expenses.length,
    dictionary: state.lang.dictionary
  };
};

export default connect(mapStateToProps)(ExpenseSumary);
