import React from 'react';
import ExpenseListFilters from './ExpenseListFilters';
import {connect} from 'react-redux';
import selectExpenses from '../selectors/expenses'
import numeral from 'numeral';

import AnyChart from 'anychart-react/dist/anychart-react.min.js'

export class ReportExpensePage extends React.Component {
  onSubmit = (expense) => {
    this.props.addExpense(expense);
    this.props.history.push('/');
  };

  render(){
    const {dictionary} = this.props;
    const {categories} = dictionary
    const expenses = this.props.expenses;
    //  Get category totals.

    let data = expenses.reduce((current, expense) => {
      
      let category = expense.hasOwnProperty('category') ? categories[expense.category] : categories['other']

      if(!current.hasOwnProperty(category)){
        current[category] = 0
      }
      current[category] += expense.amount
      return current;
    },{})

    let chart_data = Object.keys(data).map(property => ({
      x: property,
      value: data[property]
    }))

    return (
      <div>
        <div className="page-header">
          <div className="content-container">
            <h1 className="page-header__title">{dictionary.pageReportTitle}</h1>
          </div>
        </div>
          <div className="content-container">
            <ExpenseListFilters/>

            <div className="report-expense-page">
              
              {this.props.expenses.length > 0 ? (
              <div>
                <h3>Total</h3>
                <table>
                  {chart_data.map(data => (
                    <tr key={data.x}>
                      <td align="left"><strong>{data.x}</strong></td> 
                      <td align="right">{ numeral(data.value / 100).format('$0,0.00')}</td>
                    </tr>
                  ))}
                </table>
                
                <AnyChart
                    type="pie"
                    data={chart_data}
                    className="expense-chart"
                    width={800}
                    height={600}
                />

              </div>
              ) : (
                <div>{this.props.dictionary.noExpenseMessage}</div>
              )}
              
            
          </div>
      </div>
      </div>
    );
  };
}

const mapDispatchToProps = (dispatch) => ({
});

const mapStateToProps = (state) => ({
  dictionary: state.lang.dictionary,
  expenses: selectExpenses(state.expenses.present, state.filters)
});

export default connect(mapStateToProps, mapDispatchToProps)(ReportExpensePage);
