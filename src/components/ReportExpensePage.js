import React from 'react';
import ExpenseListFilters from './ExpenseListFilters';
import { connect } from 'react-redux';
import selectExpenses from '../selectors/expenses'
import numeral from 'numeral';

import AnyChart from 'anychart-react/dist/anychart-react.min.js'

export class ReportExpensePage extends React.Component {
  onSubmit = (expense) => {
    this.props.addExpense(expense);
    this.props.history.push('/');
  };

  render() {
    const { dictionary } = this.props;
    const { categories, payment_methods, pageReportExpense } = dictionary
    const expenses = this.props.expenses;
    //  Get category totals.

    let data = expenses.reduce((current, expense) => {

      let category = expense.hasOwnProperty('category') ? categories[expense.category] : categories['other']

      if (!current.hasOwnProperty(category)) {
        current[category] = 0
      }
      current[category] += expense.amount
      return current;
    }, {})

    let chart_data = Object.keys(data).map(property => ({
      x: property,
      value: data[property]
    }))

    //  Payment method data

    let payment_method_data = expenses.reduce((current, expense) => {

      let pm = expense.hasOwnProperty('payment_method') ? payment_methods[expense.payment_method] : payment_methods['other']

      if (!current.hasOwnProperty(pm)) {
        current[pm] = 0
      }
      current[pm] += expense.amount
      return current;
    }, {})

    let payment_method_chart_data = Object.keys(payment_method_data).map(property => ({
      x: property,
      value: payment_method_data[property]
    }))

    return (
      <div>
        <div className="page-header">
          <div className="content-container">
            <h1 className="page-header__title">{pageReportExpense.title}</h1>
          </div>
        </div>
        <div className="content-container">
          <ExpenseListFilters />

          <div className="report-expense-page">

            {this.props.expenses.length > 0 ? (
              <div>
                <Section
                  id="1"
                  title={pageReportExpense.categoryTitle}
                  data={chart_data}
                />

                <Section
                  id="2"
                  title={pageReportExpense.paymentMethodTitle}
                  data={payment_method_chart_data}
                />
              </div>
            ) : (
                <div className="empty_list"><span>{pageReportExpense.noExpenseMessage}</span></div>
              )}


          </div>
        </div>
      </div>
    );
  };
}

const Section = ({
  id,
  title,
  data
}) => {
  return (
    <div className="section">
      <div className="section_title">
       {title}
      </div>
      <div className="section_body">
        <div>
          <table>
            {data.map(item => (
              <tr key={item.x}>
                <td align="left"><strong>{item.x}</strong></td>
                <td align="right">{numeral(item.value / 100).format('$0,0.00')}</td>
              </tr>
            ))}
          </table>
        </div>
        <div>
          <AnyChart
            id={`chart-container${id}`}
            type="pie"
            data={data}
            legend={false}
            className="expense-chart"
            width={500}
            height={400}
          />
        </div>
      </div>

    </div>
  )
}

const mapDispatchToProps = (dispatch) => ({
});

const mapStateToProps = (state) => ({
  dictionary: state.lang.dictionary,
  expenses: selectExpenses(state.expenses.present, state.filters)
});

export default connect(mapStateToProps, mapDispatchToProps)(ReportExpensePage);
