import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button } from 'semantic-ui-react'
import moment from 'moment';

import numeral from 'numeral';
import selectExpenses from '../selectors/expenses';
import getExpensesTotal from '../selectors/expenses-total';
import { setStartDate, setEndDate, setPaymentMethodFilter } from "../actions/filters";

import replaceAll from '../utils/replaceAll';


export const ExpenseSumary = ({ expensesTotal, expenseCount, hideExpenses, dictionary, ...props }) => (
  <div className="page-header">
    <div className="content-container">
      <h1
        className="page-header__title"
        dangerouslySetInnerHTML={{
          __html: replaceAll(dictionary.summaryMessageTitle, {
            "{p1}": `<span>${expenseCount}</span>`,
            "{p2}": expenseCount != 1 ? 's' : '',
            "{p3}": `<span>${numeral(expensesTotal / 100).format('$0,0.00')}</span>`
          })
        }}>
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
        <div>
          <Link className="button" to="/details">{dictionary.pageReportExpense.button}</Link>
          <Link className="button button-red" to="/timeline">{dictionary.pageReportExpense.buttonTimeLine}</Link>
          <Button
            color="green"
            className="button button-red"
            onClick={() => {
              const date = moment();
              const dayOfMonth = date.date();

              let numberOfMonthsToSubstract
              if (dayOfMonth <= 23) {
                //  La fecha de corte aun no llega en este mes. Debe tomar el periodo pasado.
                numberOfMonthsToSubstract = 2;
              } else {
                //  
                numberOfMonthsToSubstract = 1;
              }

              let startDate = moment(date).subtract(numberOfMonthsToSubstract, 'month').set('date', 23);
              let endDate = moment(date).subtract(numberOfMonthsToSubstract - 1, 'month').set('date', 23);

              props.setEndDate(endDate);
              props.setStartDate(startDate);
              props.setPaymentMethodFilter('credit_card')
            }}
          >
            {dictionary.pageReportExpense.buttonCreditCard}
          </Button>
        </div>

        <Link className="button button-green" to="/create">{dictionary.addExpenseButton}</Link>

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

const mapDispatchToProps = (dispatch) => {
  return {
    setStartDate: (date) => dispatch(setStartDate(date)),
    setEndDate: (date) => dispatch(setEndDate(date)),
    setPaymentMethodFilter: (endDate) => dispatch(setPaymentMethodFilter(endDate)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ExpenseSumary);
