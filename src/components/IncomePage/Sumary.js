import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'semantic-ui-react'
import moment from 'moment';

import numeral from 'numeral';
import replaceAll from '../../utils/replaceAll';


export const Sumary = ({ expensesTotal, expenseCount, hideExpenses, dictionary }) => (
  <div className="page-header">
    <div className="content-container">
      <h1
        className="page-header__title"
        dangerouslySetInnerHTML={{
          __html: replaceAll(dictionary.incomePage.summaryMessageTitle, {
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
            __html: replaceAll(dictionary.incomePage.summaryMessageSubitle, {
              "{p1}": `<span>${hideExpenses}</span>`,
              "{p2}": hideExpenses != 1 ? 's' : ''
            })
          }}></h4>
      }
      <div className="page-header__actions">
        <div>
          <Link className="button button-gray" to="/dashboard">{dictionary.pageReportExpense.buttonExpense}</Link>
          <Link className="button" to="/income_statement">{dictionary.incomeStatementPage.button}</Link>
          {/* <Link className="button button-red" to="/timeline">{dictionary.pageReportExpense.buttonTimeLine}</Link> */}
         
        </div>

        <Link className="button button-green" to="/add_income">{dictionary.pageReportExpense.buttonAddIncome}</Link>

      </div>
    </div>
  </div>
);

export default Sumary
