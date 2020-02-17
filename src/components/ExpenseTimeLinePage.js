import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux';
import moment from 'moment';
import ExpenseListFilters from './ExpenseListFilters';
import selectExpenses from '../selectors/expenses'
import AnyChart from 'anychart-react/dist/anychart-react.min.js'

import { setStartDate } from "../actions/filters";

const ExpenseTimeLinePage = (props) => {
   const { expenses, dictionary } = props;
   const {pageTimeLineExpense} = dictionary;

   useEffect(() => {
      props.setStartDate(moment().subtract(12, 'months'))
   },[])

   // Iterate all expenses and group them by month.
   const dataObj = expenses.reduce((acum, expense) => {
      const month = moment(expense.createdAt).startOf('month');
      let total = 0;
      total = expense.amount / 100;
      const monthString = month.format('MM-DD-YYYY')
      return {
         ...acum,
         [monthString]: acum[monthString] ? acum[monthString] + total : total
      }
   }, {})

   const data = Object.keys(dataObj).map(key => {
      return [
         moment(key).format('MMM YY').toUpperCase(),
         dataObj[key]
      ]
   })

   console.log(data)

   return (
      <div>
         <div className="page-header">
            <div className="content-container">
               <h1 className="page-header__title">{pageTimeLineExpense.title}</h1>
            </div>
         </div>
         <div className="content-container">
         <ExpenseListFilters />
            <AnyChart
               id={`chart-container3`}
               type="line"
               data={data.reverse()}
               legend={false}
               className="expense-chart"
               tooltip={{
                  format: "${%value}{decimalsCount:3,groupsSeparator:\\,}"
               }}
               height={500}
               yAxis={[{
                  enabled: true,
                  labels: {
                     format: '${%value}{decimalsCount:3,groupsSeparator:\\,}',
                  }
               }]}
            />
         </div>

      </div>
   )
}

const mapDispatchToProps = (dispatch) => ({
   setStartDate: (date) => dispatch(setStartDate(date))
});

const mapStateToProps = (state) => ({
   dictionary: state.lang.dictionary,
   expenses: selectExpenses(state.expenses.present, state.filters)
});

export default connect(mapStateToProps, mapDispatchToProps)(ExpenseTimeLinePage);